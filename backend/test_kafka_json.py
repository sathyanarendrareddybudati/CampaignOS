import asyncio
import json
import os
import ssl
from dotenv import load_dotenv
from aiokafka import AIOKafkaProducer

load_dotenv()

async def send_event():
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
        data = {
            "event": "customer.purchase.recorded",
            "rule": "Spin & save matched",
            "dispatch": "Game adapter",
            "status": "Delivered",
            "class": "purple"
        }
        await producer.send_and_wait(topic, json.dumps(data).encode('utf-8'))
        print("Successfully sent JSON event to Kafka")
    finally:
        await producer.stop()

asyncio.run(send_event())
