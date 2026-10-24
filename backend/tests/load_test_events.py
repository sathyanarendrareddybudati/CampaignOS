import asyncio
import time
import httpx
import statistics

BASE_URL = "http://localhost:8000"
NUM_REQUESTS = 60
CONCURRENCY = 6

async def send_event(client: httpx.AsyncClient, token: str, idx: int):
    event_payload = {
        "event": "customer.pos_purchase" if idx % 2 == 0 else "customer.app_interaction",
        "customer_id": f"cust_spike_{idx}",
        "amount": 25.0 + (idx % 75),
        "email": f"customer_{idx}@example.com"
    }
    start = time.perf_counter()
    try:
        res = await client.post(
            f"{BASE_URL}/api/v1/events/",
            json=event_payload,
            headers={"Authorization": f"Bearer {token}"},
            timeout=25.0
        )
        duration = (time.perf_counter() - start) * 1000  # ms
        return res.status_code == 200, duration, res.status_code
    except Exception as e:
        duration = (time.perf_counter() - start) * 1000
        return False, duration, str(e)

async def run_load_test():
    print("=" * 60)
    print("🚀 LOYUM EVENT PIPELINE LOAD TEST - EVENT SPIKE SIMULATION")
    print("=" * 60)
    print(f"Target Endpoint: {BASE_URL}/api/v1/events/")
    print(f"Total Events: {NUM_REQUESTS}")
    print(f"Concurrent Workers: {CONCURRENCY}\n")

    # 1. Obtain Auth Token
    from app.core import auth
    from app.infrastructure.database import SessionLocal
    from app.domain import models
    db = SessionLocal()
    load_email = "load_tester@loyum.io"
    user = db.query(models.User).filter(models.User.email == load_email).first()
    if not user:
        user = models.User(email=load_email, hashed_password=auth.get_password_hash("testpass"))
        db.add(user)
        db.commit()
    db.close()

    token = auth.create_access_token(data={"sub": load_email})
    print("✓ Authenticated successfully with JWT bearer token.")

    # 2. Fire concurrent event requests
    sem = asyncio.Semaphore(CONCURRENCY)
    latencies = []
    successes = 0
    failures = 0

    async def worker(idx):
        nonlocal successes, failures
        async with sem:
            async with httpx.AsyncClient() as client:
                ok, dur, status = await send_event(client, token, idx)
                latencies.append(dur)
                if ok:
                    successes += 1
                else:
                    failures += 1

    test_start = time.perf_counter()
    tasks = [worker(i) for i in range(NUM_REQUESTS)]
    await asyncio.gather(*tasks)
    total_time = time.perf_counter() - test_start

    # 3. Report Results
    throughput = NUM_REQUESTS / total_time
    avg_latency = statistics.mean(latencies)
    p50 = statistics.median(latencies)
    sorted_lat = sorted(latencies)
    p95 = sorted_lat[int(len(sorted_lat) * 0.95)]
    p99 = sorted_lat[int(len(sorted_lat) * 0.99)]

    print("\n" + "=" * 60)
    print("📊 LOAD TEST BENCHMARK RESULTS")
    print("=" * 60)
    print(f"Total Requests:       {NUM_REQUESTS}")
    print(f"Successful (HTTP 200): {successes} ({successes / NUM_REQUESTS * 100:.1f}%)")
    print(f"Failed Requests:      {failures}")
    print(f"Total Duration:       {total_time:.2f} seconds")
    print(f"Throughput:           {throughput:.1f} events/sec")
    print("-" * 60)
    print(f"Average Latency:      {avg_latency:.2f} ms")
    print(f"Median (p50):         {p50:.2f} ms")
    print(f"p95 Latency:          {p95:.2f} ms")
    print(f"p99 Latency:          {p99:.2f} ms")
    print(f"Min Latency:          {min(latencies):.2f} ms")
    print(f"Max Latency:          {max(latencies):.2f} ms")
    print("=" * 60)

    if failures == 0 and throughput > 10:
        print("✅ PASSED: Event processing engine handles high concurrency spikes without dropouts.")
    else:
        print("⚠️ WARNING: Check failure causes or database locks.")

if __name__ == "__main__":
    asyncio.run(run_load_test())
