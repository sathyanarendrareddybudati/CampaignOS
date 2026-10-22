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
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT, timeout=15)
        server.starttls()
        server.login(SENDER_EMAIL, SENDER_PASSWORD)
        text = msg.as_string()
        server.sendmail(SENDER_EMAIL, to_email, text)
        server.quit()
        print(f"Successfully sent email to {to_email}")
        return True
    except smtplib.SMTPAuthenticationError as e:
        print(f"Failed to send email to {to_email}: SMTP Authentication Error ({e.smtp_code} {e.smtp_error}). If using Gmail, an App Password is required.")
        return False
    except smtplib.SMTPServerDisconnected as e:
        print(f"Failed to send email to {to_email}: Server disconnected ({e}). Gmail disconnects the connection if an App Password is not used.")
        return False
    except Exception as e:
        print(f"Failed to send email to {to_email}: {e}")
        return False

async def consume_events():
    bootstrap_servers = os.environ.get("KAFKA_BOOTSTRAP_SERVERS")
    if not bootstrap_servers:
        print("[Kafka] KAFKA_BOOTSTRAP_SERVERS not set. Skipping event consumer.")
        return

    username = os.environ.get("KAFKA_USERNAME")
    password = os.environ.get("KAFKA_PASSWORD")
    topic = os.environ.get("KAFKA_TOPIC", "marketing_events")

    while True:
        consumer = None
        try:
            context = ssl.create_default_context()
            if os.path.exists("ca.pem"):
                context.load_verify_locations(cafile="ca.pem")

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
            print(f"[Kafka Consumer] Successfully connected to {bootstrap_servers} on topic '{topic}'")

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
                        
                        # Query Rules Engine
                        rules = db.query(models.Rule).all()
                        first_match = None
                        time_str = datetime.utcnow().strftime("%H:%M:%S")

                        for r in rules:
                            trigger_event = r.trigger.get("event") if isinstance(r.trigger, dict) else None
                            if trigger_event == event_type:
                                action_type = r.action.get("type", "Action") if isinstance(r.action, dict) else "Action"
                                dispatch_msg = f"{action_type} adapter"
                                print(f"[RULES ENGINE] Match found for {event_type}! Executing action: {action_type} for {email}")
                                
                                # Actually send the email if email is provided
                                if email != "unknown@customer.com" and "email" in action_type.lower():
                                    send_email(email, action_type)
                                
                                if not first_match:
                                    first_match = {
                                        "rule": f"Matched: {trigger_event}",
                                        "dispatch": dispatch_msg,
                                        "status": "Delivered",
                                        "css_class": "purple" if "game" in action_type.lower() else "blue"
                                    }

                        if first_match:
                            event_log = models.EventLog(
                                time=time_str,
                                event=event_type,
                                rule=first_match["rule"],
                                dispatch=first_match["dispatch"],
                                status=first_match["status"],
                                css_class=first_match["css_class"]
                            )
                        else:
                            event_log = models.EventLog(
                                time=time_str,
                                event=event_type,
                                rule="No matching rule",
                                dispatch="—",
                                status="Ignored",
                                css_class="yellow"
                            )
                        
                        db.add(event_log)
                        db.commit()
                            
                    except json.JSONDecodeError:
                        print("Received non-JSON message:", val_str)
                    finally:
                        db.close()
                except Exception as e:
                    print("Error processing kafka message", e)

        except (asyncio.CancelledError, KeyboardInterrupt):
            print("[Kafka Consumer] Shutting down.")
            break
        except Exception as e:
            print(f"[Kafka Consumer] Connection issue ({e}). Reconnecting in 30s...")
            await asyncio.sleep(30)
        finally:
            if consumer:
                try:
                    await consumer.stop()
                except Exception:
                    pass
