import os
import asyncio
import ssl
from aiokafka import AIOKafkaConsumer
import json
from datetime import datetime
from app.infrastructure.database import SessionLocal
from app.domain import models
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

load_dotenv()

def send_email(to_email: str, action_type: str):
    SENDER_EMAIL = os.environ.get("SENDER_EMAIL")
    SENDER_PASSWORD = os.environ.get("SENDER_PASSWORD")

    if not SENDER_EMAIL or SENDER_EMAIL == "your-email@gmail.com":
        print(f"Skipping actual email to {to_email} because SENDER_EMAIL is not configured in .env.")
        return False

    msg = MIMEMultipart()
    msg['From'] = SENDER_EMAIL
    msg['To'] = to_email
    
    if "Welcome" in action_type:
        msg['Subject'] = "Welcome to our platform!"
        body = "Thank you for signing up. We're excited to have you on board!"
    else:
        msg['Subject'] = "You have a new notification!"
        body = f"An action was triggered for your account: {action_type}"
        
    msg.attach(MIMEText(body, 'plain'))

    try:
        SMTP_SERVER = os.environ.get("SMTP_SERVER", "smtp.gmail.com")
        SMTP_PORT = int(os.environ.get("SMTP_PORT", 587))
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(SENDER_EMAIL, SENDER_PASSWORD)
        text = msg.as_string()
        server.sendmail(SENDER_EMAIL, to_email, text)
        server.quit()
        print(f"Successfully sent email to {to_email}")
        return True
    except Exception as e:
        print(f"Failed to send email to {to_email}: {e}")
        return False

async def consume_events():
    context = ssl.create_default_context()
    context.load_verify_locations(cafile="ca.pem")
    
    bootstrap_servers = os.environ.get("KAFKA_BOOTSTRAP_SERVERS")
    username = os.environ.get("KAFKA_USERNAME")
    password = os.environ.get("KAFKA_PASSWORD")
    topic = os.environ.get("KAFKA_TOPIC", "marketing_events")
    
    consumer = AIOKafkaConsumer(
        topic,
        bootstrap_servers=bootstrap_servers,
        security_protocol="SASL_SSL",
        sasl_mechanism="PLAIN",
        sasl_plain_username=username,
        sasl_plain_password=password,
        ssl_context=context,
        group_id="loyalty_engine_group"
    )
    
    await consumer.start()
    try:
        async for msg in consumer:
            print("consumed: ", msg.topic, msg.partition, msg.offset,
                  msg.key, msg.value, msg.timestamp)
            
            # parse message and store in db
            try:
                val_str = msg.value.decode('utf-8')
                db = SessionLocal()
                try:
                    data = json.loads(val_str)
                    event_type = data.get("event", "unknown.event")
                    email = data.get("email", "unknown@customer.com")
                    
                    # 1. Log the incoming raw event
                    new_log = models.EventLog(
                        time=datetime.utcnow().strftime("%H:%M:%S"),
                        event=event_type,
                        rule="Evaluating rules...",
                        dispatch="—",
                        status="Received",
                        css_class="gray"
                    )
                    db.add(new_log)
                    db.commit()

                    # 2. Query Rules Engine
                    rules = db.query(models.Rule).all()
                    matched = False
                    for r in rules:
                        trigger_event = r.trigger.get("event") if isinstance(r.trigger, dict) else None
                        if trigger_event == event_type:
                            matched = True
                            action_type = r.action.get("type", "Action") if isinstance(r.action, dict) else "Action"
                            
                            # 3. Simulate Dispatch
                            dispatch_msg = f"{action_type} adapter"
                            print(f"[RULES ENGINE] Match found for {event_type}! Executing action: {action_type} for {email}")
                            
                            # Actually send the email if email is provided
                            if email != "unknown@customer.com" and "email" in action_type.lower():
                                send_email(email, action_type)
                            
                            # 4. Log the action result
                            action_log = models.EventLog(
                                time=datetime.utcnow().strftime("%H:%M:%S"),
                                event=f"campaign.action.{action_type.lower()}",
                                rule=f"Matched trigger: {trigger_event}",
                                dispatch=dispatch_msg,
                                status="Delivered",
                                css_class="purple" if "game" in action_type.lower() else "blue"
                            )
                            db.add(action_log)
                            db.commit()

                    if not matched:
                        # Log ignored event
                        ignored_log = models.EventLog(
                            time=datetime.utcnow().strftime("%H:%M:%S"),
                            event=f"{event_type}",
                            rule="No matching rule",
                            dispatch="—",
                            status="Ignored",
                            css_class="yellow"
                        )
                        db.add(ignored_log)
                        db.commit()
                        
                except json.JSONDecodeError:
                    print("Received non-JSON message:", val_str)
                finally:
                    db.close()
            except Exception as e:
                print("Error processing kafka message", e)
    finally:
        await consumer.stop()
