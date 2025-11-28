---
sidebar_position: 1
---

# Message Brokers

Message brokers let you build event-driven applications by sending and receiving messages between services. Ductape supports multiple providers through a unified interface.

## What You Can Do

- **Publish messages** to topics for other services to consume
- **Subscribe** to topics and process incoming messages
- **Switch providers** per environment without changing your code

## Supported Providers

| Provider | Type | Best For |
|----------|------|----------|
| **Kafka** | `KAFKA` | High-throughput distributed streaming |
| **RabbitMQ** | `RABBITMQ` | Flexible routing, reliable delivery |
| **Redis** | `REDIS` | Simple pub/sub, low latency |
| **AWS SQS** | `AWS_SQS` | Serverless managed queues |
| **Google Pub/Sub** | `GOOGLE_PUBSUB` | Google Cloud integration |

---

## Creating a Message Broker

Create a message broker in your product with environment-specific configurations:

```typescript
import { MessageBrokerTypes } from '@ductape/types';

await ductape.broker.create({
  name: 'Order Events',
  tag: 'order-events',
  description: 'Handles all order-related messages',
  envs: [
    {
      slug: 'prd',
      type: MessageBrokerTypes.KAFKA,
      config: {
        brokers: ['kafka-prod.example.com:9092'],
        clientId: 'order-service',
        groupId: 'order-consumers',
        topic: 'orders',
        ssl: true,
        sasl: {
          mechanism: 'scram-sha-256',
          username: 'prod-user',
          password: 'prod-password'
        }
      }
    },
    {
      slug: 'dev',
      type: MessageBrokerTypes.REDIS,
      config: {
        host: 'localhost',
        port: 6379
      }
    }
  ]
});
```

### Provider Configurations

**Kafka**
```typescript
{
  brokers: string[];        // ['broker1:9092', 'broker2:9092']
  clientId: string;         // Your client identifier
  groupId: string;          // Consumer group ID
  topic: string;            // Topic name
  ssl?: boolean;            // Enable SSL
  sasl?: {                  // Optional authentication
    mechanism: 'plain' | 'scram-sha-256' | 'scram-sha-512';
    username: string;
    password: string;
  }
}
```

**RabbitMQ**
```typescript
{
  host: string;             // 'rabbitmq.example.com'
  port: number;             // 5672
  username: string;
  password: string;
  queue: string;            // Queue name
  routingKey: string;       // Routing key for messages
}
```

**Redis**
```typescript
{
  host: string;             // 'redis.example.com'
  port: number;             // 6379
  password?: string;        // Optional password
}
```

**AWS SQS**
```typescript
{
  region: string;           // 'us-east-1'
  accessKeyId: string;      // AWS access key
  secretAccessKey: string;  // AWS secret key
}
```

**Google Pub/Sub**
```typescript
{
  projectId: string;        // GCP project ID
  topicName: string;        // Pub/Sub topic name
  subscriptionName?: string;// Optional subscription name
  keyFilename: string;      // Path to service account key
}
```

---

## Managing Topics

Topics define the channels for your messages. Each topic has a sample payload that documents the expected message format.

### Create a Topic

```typescript
await ductape.broker.topic.create({
  name: 'New Orders',
  messageBrokerTag: 'order-events',
  tag: 'order-events:new-orders',
  description: 'Topic for new order notifications',
  sample: {
    orderId: '12345',
    customerId: 'cust_789',
    total: 99.99,
    createdAt: '2024-01-15T10:30:00Z'
  }
});
```

For **AWS SQS**, provide queue URLs per environment:

```typescript
await ductape.broker.topic.create({
  name: 'New Orders',
  messageBrokerTag: 'sqs-broker',
  tag: 'sqs-broker:new-orders',
  queueUrl: [
    { env_slug: 'prd', url: 'https://sqs.us-east-1.amazonaws.com/123/orders-prd' },
    { env_slug: 'dev', url: 'https://sqs.us-east-1.amazonaws.com/123/orders-dev' }
  ],
  sample: { orderId: '12345' }
});
```

### Update a Topic

```typescript
await ductape.broker.topic.update('order-events:new-orders', {
  description: 'Updated description',
  sample: {
    orderId: '12345',
    customerId: 'cust_789',
    total: 99.99,
    status: 'pending'
  }
});
```

### Fetch Topics

```typescript
// Get a specific topic
const topic = await ductape.broker.topic.fetch('order-events:new-orders');

// Get all topics for a broker
const topics = await ductape.broker.topic.fetchAll('order-events');
```

---

## Publishing Messages

Send messages to a topic using `ductape.broker.publish()`:

```typescript
await ductape.broker.publish({
  env: 'prd',
  product: 'my-product',
  event: 'order-events:new-orders',
  message: {
    orderId: '12345',
    customerId: 'cust_789',
    total: 99.99,
    createdAt: new Date().toISOString()
  }
});
```

### With Session Context

Include session data when publishing user-related events:

```typescript
await ductape.broker.publish({
  env: 'prd',
  product: 'my-product',
  event: 'order-events:new-orders',
  message: {
    orderId: '12345',
    action: 'created'
  },
  session: {
    tag: 'user-session',
    token: 'eyJhbGciOi...'
  }
});
```

---

## Subscribing to Messages

Listen for messages on a topic using `ductape.broker.subscribe()`:

```typescript
await ductape.broker.subscribe({
  env: 'prd',
  product: 'my-product',
  event: 'order-events:new-orders',
  callback: async (message) => {
    console.log('Received order:', message);
    await processNewOrder(message);
  }
});
```

---

## Event Format

Events use the format `brokerTag:topicTag`:

| Event | Broker Tag | Topic Tag |
|-------|------------|-----------|
| `order-events:new-orders` | order-events | new-orders |
| `notifications:user-alerts` | notifications | user-alerts |

---

## Best Practices

1. **Use environment-specific configs** - Different credentials and endpoints per environment
2. **Define clear topic schemas** - The `sample` field documents expected message format
3. **Handle failures gracefully** - Implement retry logic in subscribe callbacks
4. **Use descriptive tags** - Clear naming makes debugging easier
5. **Secure credentials** - Store sensitive values in environment variables

## See Also

- [Features](../features/overview) - Use message brokers in workflows
- [Jobs](../jobs/overview) - Schedule recurring publish operations
