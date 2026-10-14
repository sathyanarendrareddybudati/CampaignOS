import asyncio
import ssl
import json
from aiokafka import AIOKafkaProducer
from app.infrastructure.database import SessionLocal
from app.domain import models
import uuid

from dotenv import load_dotenv
import os

load_dotenv()

def generate_uuid():
    return str(uuid.uuid4())

def setup_db():
    db = SessionLocal()
    # Create test campaign
    campaign_id = generate_uuid()
    campaign = models.Campaign(id=campaign_id, name="Test Welcome Campaign", status="Active")
    db.add(campaign)
    
    # Create test rule
    rule = models.Rule(
        id=generate_uuid(),
        campaign_id=campaign_id,
        trigger={"event": "user.signup"},
        action={"type": "Send Welcome Email"}
    )
    db.add(rule)
    db.commit()
    db.close()
    print("Created test campaign and rule in DB")

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
            "event": "user.signup",
            "email": "satyareddy0608@gmail.com"
        }
        await producer.send_and_wait(topic, json.dumps(data).encode('utf-8'))
        print("Successfully sent 'user.signup' event to Kafka")
    finally:
        await producer.stop()

if __name__ == "__main__":
    setup_db()
    asyncio.run(send_event())
