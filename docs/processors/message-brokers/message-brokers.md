---
sidebar_position: 1
---

# Using Message Brokers

Ductape provides a **Message Broker** interface to handle event-driven communication between your system components. It supports two main operations:  

1. **Publishing Messages** – Send messages to a specific event/topic.  
2. **Subscribing to Events** – Listen for messages on a specific event/topic and process them with a callback.

## 1. Publishing Messages

### Description  
Publishing allows you to send structured data (messages) to a broker, which can then be consumed by other services or components subscribed to that event.

### Required Fields  

| Field         | Type       | Description                                               |
|---------------|------------|-----------------------------------------------------------|
| `env`         | `string`   | Environment where the message should be published (e.g., `"prd"`, `"staging"`). |
| `event`       | `string`   | Event identifier in the format `brokerTag:topicTag` (e.g., `"sqsbroker:new-orders"`). |
| `product_tag` | `string`   | Unique identifier for the product sending the message.    |
| `input`       | `object`   | Payload containing the message data to publish.           |
| `cache`       | `string`   | *(Optional)* Cache tag to use if request caching is needed.|
| **`session`** | `ISession` | *(Optional)* Session object with `token` and `tag`.       |

### `ISession` Type  
```typescript
interface ISession {
  token: string;
  tag: string;
}
````

### Example Usage

```ts
await ductape.processor.messageBroker.publish({
  env: "prd",
  event: "sqsbroker:new-orders",
  product_tag: "my_product",
  session: {
    token: "abc123xyz",
    tag: "session-tag-1"
  },
  input: {
    message: {
      orderId: "12345",
      status: "pending",
      customer: {
        name: "John Doe",
        email: "john@example.com"
      }
    }
  }
});
```

## 2. Subscribing to Events

### Description

Subscribing allows you to listen for incoming messages on a specified event/topic and process them with a callback function.

### Required Fields

| Field         | Type       | Description                                                                           |
| ------------- | ---------- | ------------------------------------------------------------------------------------- |
| `env`         | `string`   | Environment where the subscription should be active (e.g., `"prd"`).                  |
| `event`       | `string`   | Event identifier in the format `brokerTag:topicTag` (e.g., `"sqsbroker:new-orders"`). |
| `product_tag` | `string`   | Unique identifier for the product receiving the message.                              |
| `input`       | `object`   | Subscription details, including the callback function.                                |
| **`session`** | `ISession` | *(Optional)* Session object with `token` and `tag`.                                   |

The `input` object must include:

| Field      | Type       | Description                                 |
| ---------- | ---------- | ------------------------------------------- |
| `callback` | `Function` | Async function to handle received messages. |

### Example Usage

```ts
await ductape.processor.messageBroker.subscribe({
  env: "prd",
  event: "sqsbroker:new-orders",
  product_tag: "my_product",
  session: {
    token: "abc123xyz",
    tag: "session-tag-1"
  },
  input: {
    callback: async (message) => {
      console.log("Received message:", message);
      // Implement processing logic here (e.g., update order status)
    }
  }
});
```

## Choosing the Right Method

| Method                    | Use Case                                                 |
| ------------------------- | -------------------------------------------------------- |
| **Publishing Messages**   | When you need to send events/messages to other services. |
| **Subscribing to Events** | When you need to listen for and process incoming events. |
