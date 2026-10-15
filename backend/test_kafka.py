import asyncio
import os
import ssl
from dotenv import load_dotenv
from aiokafka import AIOKafkaProducer

load_dotenv()

async def send_one():
    context = ssl.create_default_context()
    context.load_verify_locations(cafile="ca.pem")
    bootstrap_servers = os.environ.get("KAFKA_BOOTSTRAP_SERVERS")
    username = os.environ.get("KAFKA_USERNAME")
    password = os.environ.get("KAFKA_PASSWORD")
    topic = os.environ.get("KAFKA_TOPIC", "marketing_events")

    producer = AIOKafkaProducer(
        bootstrap_servers=bootstrap_servers,
        security_protocol="SASL_SSL",
        sasl_mechanism="PLAIN",
        sasl_plain_username=username,
        sasl_plain_password=password,
        ssl_context=context
    )
    await producer.start()
    try:
        await producer.send_and_wait(topic, b"Super message")
        print("Successfully sent message")
    finally:
        await producer.stop()

asyncio.run(send_one())
