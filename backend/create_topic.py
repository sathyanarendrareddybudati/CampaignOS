import os
from dotenv import load_dotenv
from kafka.admin import KafkaAdminClient, NewTopic

load_dotenv()

bootstrap_servers = os.environ.get("KAFKA_BOOTSTRAP_SERVERS")
username = os.environ.get("KAFKA_USERNAME")
password = os.environ.get("KAFKA_PASSWORD")
topic_name = os.environ.get("KAFKA_TOPIC", "marketing_events")

admin_client = KafkaAdminClient(
    bootstrap_servers=bootstrap_servers,
    security_protocol="SASL_SSL",
    sasl_mechanism="PLAIN",
    sasl_plain_username=username,
    sasl_plain_password=password,
    ssl_cafile="ca.pem",
    client_id='test'
)

topic_list = []
topic_list.append(NewTopic(name=topic_name, num_partitions=1, replication_factor=2))
admin_client.create_topics(new_topics=topic_list, validate_only=False)
print("Created topic")
