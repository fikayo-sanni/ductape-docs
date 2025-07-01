---
sidebar_position: 5
---

# Google PubSub Configuration

To use Google PubSub as a message broker in Ductape, provide the following configuration for each environment:

```typescript
const googlePubSubConfig = {
  projectId: 'your-gcp-project-id', // Google Cloud Project ID
  topicName: 'my-topic', // Pub/Sub topic name
  subscriptionName: 'my-subscription', // (Optional) Subscription name
  keyFilename: '/path/to/keyfile.json', // Path to service account key file
};
```

| Field             | Type   | Required | Description                                 |
|-------------------|--------|----------|---------------------------------------------|
| `projectId`       | string | Yes      | Google Cloud Project ID                     |
| `topicName`       | string | Yes      | Name of the Pub/Sub topic                   |
| `subscriptionName`| string | No       | Name of the Pub/Sub subscription            |
| `keyFilename`     | string | Yes      | Path to the service account key file        |

**Best Practices:**
- Use separate topics/subscriptions for each environment.
- Secure your service account key and restrict permissions.
- Monitor Pub/Sub message throughput and error rates.

## See Also
- [Message Brokers Overview](../message-brokers.md)
- [Managing Topics](../managing-topics.md)
- [RabbitMQ Configuration](./rabbit-mq.md)
- [Kafka Configuration](./kafka.md)
- [AWS SQS Configuration](./aws-sqs.md)
- [Redis Configuration](./redis.md)
