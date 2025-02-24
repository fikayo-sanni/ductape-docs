---
sidebar_position: 3 
---

# Managing Topics

Ductape provides interfaces for managing **Message Broker Topics**, which define how your application communicates with other services through various message brokers. These topics allow you to publish and subscribe to structured messages, enabling seamless integration across different environments.

A **Message Broker Topic** consists of a unique combination of identifiers and payload definitions, ensuring consistent communication between your application and other services. When using AWS SQS as the message broker, you must specify the queue URLs for the relevant environments.

> **Note:** Message Broker Topic tags are expected to follow the format: `messageBrokerTag:topicTag`. This convention ensures clarity and prevents conflicts across different brokers and topics.

## Create a Message Broker Topic

To create a Message Broker Topic, use the example below:

```typescript
const details = {
  name: "User Created Event",
  messageBrokerTag: "user-service",
  tag: "user-service:user_created",
  description: "Topic for user creation events.",
  queueUrl: [
    {
      env_slug: "prd",
      url: "https://sqs.us-east-1.amazonaws.com/123456789012/user-created-prd",
    },
    {
      env_slug: "dev",
      url: "https://sqs.us-east-1.amazonaws.com/123456789012/user-created-dev",
    },
  ],
  sample: { 
    "userId": "12345", 
    "createdAt": "2024-08-20T12:34:56Z" 
  }
};

await ductape.app.messageBroker.topics.create(details);
```

### Field Descriptions
- **name** *(required)*: A human-readable name for the topic.
- **messageBrokerTag** *(required)*: The tag representing the associated message broker.
- **tag** *(required)*: The unique topic identifier in the format `messageBrokerTag:topicTag`.
- **description** *(optional)*: A brief explanation of the topic’s purpose.
- **queueUrl** *(optional; required for SQS)*: An array specifying environment slugs and their respective SQS URLs.
- **data** *(required)*: An array defining the payload schema, specifying field names and data types.
- **sample** *(required)*: A JSON-formatted example of the expected payload.

> **Important:** Include `queueUrl` entries only when using SQS as the message broker. Other message brokers do not require this field.


## Update a Message Broker Topic

To update an existing topic, use the following example:

```typescript
const tag = "user-service:user_created";
const update = {
  description: "Updated description for the user creation event.",
  queueUrl: [
    {
      env_slug: "prd",
      url: "https://sqs.us-east-1.amazonaws.com/123456789012/user-created-prd-updated",
    },
  ],
};

await ductape.app.messageBroker.topics.update(tag, update);
```

### Updatable Fields
- **name**: Change the topic name.
- **messageBrokerTag**: Update the associated message broker tag.
- **tag**: Modify the topic’s unique identifier.
- **description**: Provide a new or updated description.
- **queueUrl**: Adjust or add environment-specific queue URLs (only required for SQS).
- **data**: Revise the payload schema.
- **sample**: Update the example payload.

> **Tip:** When updating the topic tag, ensure it follows the `messageBrokerTag:topicTag` format to maintain consistency.

## Fetch Message Broker Topics

You can retrieve topics individually or by their associated message broker tag.

### Fetch a Single Topic
```typescript
const tag = "user-service:user_created";
const topic = ductape.app.messageBroker.topics.fetch(tag); // Fetch a specific topic by its tag
```

### Fetch All Topics for a Message Broker
```typescript
const messageBrokerTag = "user-service";
const topics = ductape.app.messageBroker.topics.fetchAll(messageBrokerTag); // Fetch all topics under the specified message broker
```

These fetching methods help manage and review the topics used to communicate with other services, ensuring alignment with integration requirements.


By defining and managing **Message Broker Topics** through Ductape, you can establish a structured and scalable communication pattern between your application and other services. Ensuring that topics are well-defined and follow the expected conventions will facilitate smoother integrations and maintain data consistency across environments.

