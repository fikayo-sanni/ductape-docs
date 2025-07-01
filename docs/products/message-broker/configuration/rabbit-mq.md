---
sidebar_position: 2
---

# RabbitMQ Configuration
To setup RabbitMQ configuration, you need to provide the RabbitMQ configuration details as below

```typescript
const rabbitMQConfig = {
  host: 'rabbitmq.yourdomain.com', // Replace with your RabbitMQ server hostname or IP
  port: 5672, // RabbitMQ port (default is 5672)
  username: 'rabbitmq-user', // RabbitMQ username
  password: 'secure-password-123', // RabbitMQ password
  exchange: 'my-exchange', // The exchange name
  queue: 'my-queue', // The queue name
  routingKey: 'my-routing-key', // The routing key for message routing
};
```

- **host:** The hostname or IP address of the RabbitMQ server.
- **port:** The port RabbitMQ is running on.
- **username:** The username for authentication.
- **password:** The password for authentication.
- **exchange:** The exchange name for routing messages.
- **queue:** The queue where messages will be sent or consumed from.
- **routingKey:** The routing key used to direct messages.

**Best Practices:**
- Use strong, unique credentials for each environment.
- Use separate exchanges/queues for dev, staging, and prod.
- Monitor queue and exchange health for scaling and reliability.

## See Also
- [Message Brokers Overview](../message-brokers.md)
- [Managing Topics](../managing-topics.md)
- [Kafka Configuration](./kafka.md)
- [AWS SQS Configuration](./aws-sqs.md)
- [Redis Configuration](./redis.md)
- [Google PubSub Configuration](./google-pubsub.md)
