---
sidebar_position: 4
---

# Kafka Configuration
To setup Kafka configuration, you need to provide the Kafka configuration details as below

```typescript
const kafkaConfig = {
  brokers: ['kafka-broker1:9092', 'kafka-broker2:9092'], // List of Kafka brokers
  clientId: 'my-app', // Client ID for Kafka producer/consumer
  groupId: 'my-consumer-group', // Consumer group ID
  topic: 'my-topic', // Kafka topic name
  ssl: true, // Enable SSL for secure communication (optional)
  sasl: {
    mechanism: 'plain', // Authentication mechanism (e.g., 'plain', 'scram-sha-256')
    username: 'kafka-user', // SASL username
    password: 'secure-password-123', // SASL password
  },
};
```

- **brokers:** An array of Kafka broker addresses.
- **clientId:** A unique identifier for the Kafka client.
- **groupId:** The consumer group ID for message consumption.
- **topic:** The Kafka topic to read from or publish to.
- **ssl:** (Optional) Enable SSL if secure communication is required.
- **sasl:** (Optional) Authentication details for Kafka.