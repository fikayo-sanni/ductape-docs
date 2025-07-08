---
sidebar_position: 3
---

# Managing Message Broker Topics

Message Broker Topics in Ductape define the channels through which your application publishes and subscribes to messages. Topics are essential for structuring event-driven communication between services, microservices, or external systems.

A topic is always associated with a specific message broker and environment. Its tag should follow the format: `messageBrokerTag:topicTag` (e.g., `orders:new_order`).

## Creating a Topic

To create a topic, use the `create` function from the `messageBroker.topics` interface. You must specify the broker, topic tag, and payload schema. For AWS SQS, you must also provide queue URLs for each environment.

```typescript
const details = {
  name: "User Created Event",
  messageBrokerTag: "user-service",
  tag: "user-service:user_created",
  description: "Topic for user creation events.",
  queueUrl: [
    { env_slug: "prd", url: "https://sqs.us-east-1.amazonaws.com/123456789012/user-created-prd" },
    { env_slug: "dev", url: "https://sqs.us-east-1.amazonaws.com/123456789012/user-created-dev" },
  ],
  sample: {
    userId: "12345",
    createdAt: "2024-08-20T12:34:56Z"
  }
};

await ductape.app.messageBroker.topics.create(details);
```

| Field              | Type      | Required   | Description                                                                |
|--------------------|-----------|------------|----------------------------------------------------------------------------|
| `name`             | string    | Yes        | Human-readable name for the topic.                                         |
| `messageBrokerTag` | string    | Yes        | Tag of the associated message broker.                                      |
| `tag`              | string    | Yes        | Unique topic identifier (`brokerTag:topicTag`).                            |
| `description`      | string    | No         | Description of the topic's purpose.                                        |
| `queueUrl`         | array     | SQS only   | Array of `{ env_slug, url }` for each environment (SQS only).              |
| `sample`           | object    | Yes        | Example payload for the topic.                                             |

> **Note:** For SQS, `queueUrl` is required. For other brokers, omit this field.

## Updating a Topic

To update a topic, use the `update` function. You can change the description, queue URLs, or payload schema as needed.

```typescript
const tag = "user-service:user_created";
const update = {
  description: "Updated description for the user creation event.",
  queueUrl: [
    { env_slug: "prd", url: "https://sqs.us-east-1.amazonaws.com/123456789012/user-created-prd-updated" },
  ],
};

await ductape.app.messageBroker.topics.update(tag, update);
```

| Updatable Field     | Description                                                    |
|---------------------|----------------------------------------------------------------|
| `name`              | Human-readable name for the topic.                             |
| `messageBrokerTag`  | Tag of the associated message broker.                          |
| `tag`               | Unique topic identifier (`brokerTag:topicTag`).                |
| `description`       | Description of the topic's purpose.                            |
| `queueUrl` (SQS)    | Array of `{ env_slug, url }` for each environment (SQS only).  |
| `sample`            | Example payload for the topic.                                 |

> **Tip:** Always use the `brokerTag:topicTag` format for topic tags to avoid conflicts.

## Fetching Topics

- **Fetch a single topic by tag:**
  ```typescript
  const topic = ductape.app.messageBroker.topics.fetch("user-service:user_created");
  ```
- **Fetch all topics for a broker:**
  ```typescript
  const topics = ductape.app.messageBroker.topics.fetchAll("user-service");
  ```

## Best Practices
- Use descriptive names and tags for topics to clarify their purpose.
- Keep payload schemas consistent and well-documented.
- For SQS, ensure each environment has a unique queue URL.
- Regularly review and update topic definitions as your integration needs evolve.
- Use the same naming conventions for tags and slugs across your product.

## See Also
- [Message Brokers Overview](./message-brokers.md)
- [RabbitMQ Configuration](./configuration/rabbit-mq.md)
- [Kafka Configuration](./configuration/kafka.md)
- [AWS SQS Configuration](./configuration/aws-sqs.md)
- [Redis Configuration](./configuration/redis.md)
- [Google PubSub Configuration](./configuration/google-pubsub.md)
- [Jobs](../jobs.md)
- [Features](../features/getting-started.md)

