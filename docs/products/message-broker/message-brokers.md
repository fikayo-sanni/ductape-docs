---
sidebar_position: 1
---

# Managing Message Brokers

Ductape supports seamless integration with multiple message brokers, allowing you to build scalable, event-driven applications. Message brokers enable your product to publish and consume messages across distributed systems, decoupling services and improving reliability.

## Supported Message Brokers

Ductape provides a unified interface for the following brokers:

- **Kafka** (`MessageBrokerTypes.KAFKA`)
- **Redis** (`MessageBrokerTypes.REDIS`)
- **RabbitMQ** (`MessageBrokerTypes.RABBITMQ`)
- **Google PubSub** (`MessageBrokerTypes.GOOGLE_PUBSUB`)
- **AWS SQS** (`MessageBrokerTypes.AWS_SQS`)

You can configure different brokers for each environment (e.g., dev, staging, prod) and swap providers without changing your application logic.

## Creating a Message Broker

To create a message broker, use the `create` function from the `product.messageBrokers` interface. Each environment requires its own configuration, depending on the broker type.

```typescript
import { MessageBrokerTypes } from "ductape-sdk/types";

const broker = await ductape.product.messageBrokers.create({
  name: "Message Bus",
  tag: "message-bus",
  description: "Message Broker for Product",
  envs: [
    {
      slug: "prd",
      type: MessageBrokerTypes.RABBITMQ,
      config: rabbitMQConfig,
    },
    {
      slug: "dev",
      type: MessageBrokerTypes.REDIS,
      config: redisConfig,
    },
  ],
});
```

### Field Definitions

| Field         | Type                      | Required | Description                                                      |
|--------------|---------------------------|----------|------------------------------------------------------------------|
| `name`       | `string`                  | Yes      | Display name for the broker.                                     |
| `tag`        | `string`                  | Yes      | Unique identifier for the broker.                                |
| `description`| `string`                  | No       | Short description of the broker.                                 |
| `envs`       | `array`                   | Yes      | List of environment configs. See below for per-broker config.    |
| `envs.slug`  | `string`                  | Yes      | Environment slug (e.g., `prd`, `dev`).                           |
| `envs.type`  | `MessageBrokerTypes` enum | Yes      | Type of broker for this environment.                             |
| `envs.config`| `object`                  | Yes      | Broker-specific configuration object.                            |

See [Configuration](./configuration/) for details on each broker's config fields.

## Updating Message Brokers

To update a message broker, use the `update` function. You can change providers per environment without affecting your application logic.

```typescript
await ductape.product.messageBrokers.update("message-bus", {
  envs: [
    {
      slug: "prd",
      type: MessageBrokerTypes.KAFKA,
      config: kafkaConfig,
    },
  ],
});
```

## Fetching Message Brokers

- **Fetch all brokers:**
  ```typescript
  const brokers = await ductape.product.messageBrokers.fetchAll();
  ```
- **Fetch a single broker by tag:**
  ```typescript
  const broker = await ductape.product.messageBrokers.fetch('message-bus');
  ```

## Configuration Examples

See the [Configuration](./configuration/) section for detailed config examples for each supported broker:
- [RabbitMQ](./configuration/rabbit-mq.md)
- [Kafka](./configuration/kafka.md)
- [AWS SQS](./configuration/aws-sqs.md)
- [Redis](./configuration/redis.md)
- [Google PubSub](./configuration/google-pubsub.md)

## Best Practices
- Use environment-specific configs to isolate dev, staging, and prod traffic.
- Use unique tags for each broker and topic to avoid conflicts.
- Secure credentials and connection details using environment variables or secret management.
- Monitor broker health and message throughput for scaling.
- Use the same naming conventions for tags and slugs across your product.

## See Also
- [Managing Topics](./managing-topics.md)
- [Jobs](../jobs.md)
- [Features](../features/)
