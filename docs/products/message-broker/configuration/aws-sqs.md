---
sidebar_position: 4
---

# AWS SQS Configuration

To use AWS SQS as a message broker in Ductape, provide the following configuration for each environment:

```typescript
const awsSqsConfig = {
  region: 'us-east-1', // AWS region
  queueUrl: 'https://sqs.us-east-1.amazonaws.com/123456789012/my-queue', // SQS queue URL
  accessKeyId: 'your-access-key-id', // AWS access key ID
  secretAccessKey: 'your-secret-access-key', // AWS secret access key
};
```

| Field            | Type   | Required | Description                                 |
|------------------|--------|----------|---------------------------------------------|
| `region`         | string | Yes      | AWS region where the SQS queue is hosted    |
| `queueUrl`       | string | Yes      | URL of the SQS queue                        |
| `accessKeyId`    | string | Yes      | AWS access key ID for authentication        |
| `secretAccessKey`| string | Yes      | AWS secret key for authentication           |

**Best Practices:**
- Use IAM roles and least-privilege policies for credentials.
- Use separate queues for dev, staging, and prod.
- Monitor queue length and dead-letter queues for reliability.

## See Also
- [Message Brokers Overview](../message-brokers.md)
- [Managing Topics](../managing-topics.md)
- [RabbitMQ Configuration](./rabbit-mq.md)
- [Kafka Configuration](./kafka.md)
- [Redis Configuration](./redis.md)
- [Google PubSub Configuration](./google-pubsub.md)
