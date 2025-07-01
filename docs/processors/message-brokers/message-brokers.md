---
sidebar_position: 1
---

# Processing Message Brokers

Ductape provides a **Message Broker** interface to handle event-driven communication between your system components. It supports two main operations:

- **Publishing Messages** – Send messages to a specific event/topic.
- **Subscribing to Events** – Listen for messages on a specific event/topic and process them with a callback.


## Publishing Messages

Publishing allows you to send structured data (messages) to a broker, which can then be consumed by other services or components subscribed to that event.

```ts
await ductape.processor.messageBroker.publish(data: IMessageBrokerPublishInput)
```

### `IMessageBrokerPublishInput`

| Field         | Type                        | Required | Description                                               |
| ------------- | --------------------------- | -------- | --------------------------------------------------------- |
| `env`         | `string`                    | Yes      | Environment where the message should be published.        |
| `event`       | `string`                    | Yes      | Event identifier in the format `brokerTag:topicTag`.      |
| `product_tag` | `string`                    | Yes      | Unique identifier for the product sending the message.    |
| `input`       | `object`                    | Yes      | Payload containing the message data to publish.           |
| `cache`       | `string`                    | No       | Cache tag to use if request caching is needed.            |
| `session`     | [`ISession`](#isession-schema) | No   | Session object with `token` and `tag`.                    |

> **Note:** Optional fields can be omitted or passed as empty `{}`.


## Subscribing to Events

Subscribing allows you to listen for incoming messages on a specified event/topic and process them with a callback function.

```ts
await ductape.processor.messageBroker.subscribe(data: IMessageBrokerSubscribeInput)
```

### `IMessageBrokerSubscribeInput`

| Field         | Type                        | Required | Description                                               |
| ------------- | --------------------------- | -------- | --------------------------------------------------------- |
| `env`         | `string`                    | Yes      | Environment where the subscription should be active.      |
| `event`       | `string`                    | Yes      | Event identifier in the format `brokerTag:topicTag`.      |
| `product_tag` | `string`                    | Yes      | Unique identifier for the product receiving the message.  |
| `input`       | `object`                    | Yes      | Subscription details, including the callback function.    |
| `session`     | [`ISession`](#isession-schema) | No   | Session object with `token` and `tag`.                    |

The `input` object must include:

| Field      | Type       | Required | Description                                 |
| ---------- | ---------- | -------- | ------------------------------------------- |
| `callback` | `Function` | Yes      | Async function to handle received messages. |


## `ISession` Schema

The `session` field enables optional session tracking for any message broker operation.

```ts
interface ISession {
  tag: string;   // session tag
  token: string; // session token (e.g. signed JWT)
}
```

| Field   | Type     | Required | Description                                   |
| ------- | -------- | -------- | --------------------------------------------- |
| `tag`   | `string` | Yes      | Tag identifying the session type.             |
| `token` | `string` | Yes      | Token generated when the session was created. |


## Returns

Both `publish` and `subscribe` return a `Promise<unknown>` resolving with the result of the operation. The structure depends on the broker and event implementation.


## Example

**Publishing a message:**
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

**Subscribing to an event:**
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


## See Also

* [Session Tracking](../sessions)
* [Processing Features](../features/processing)
