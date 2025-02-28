---
sidebar_position: 1
---

# Using  Message Brokers

Ductape provides a **Message Broker** interface for handling event-based communication between different components of your system. It supports:  

1. **Publishing Messages** – Send messages to a specific event.  
2. **Subscribing to Events** – Listen for messages on a specific event and execute a callback function when triggered.  

## 1. Publishing Messages  

### Description
Publishing a message allows you to send structured data to a message broker, which other services can subscribe to and consume.  

### Required Data Fields 
- **`env`** – Environment where the message should be published (e.g., `"production"` or `"staging"`).  
- **`event`** – The event is in the format brokerTag:topicTag
- **`product_tag`** – Identifier for the product.  
- **`input`** – Contains the actual message payload.  

### Example Usage

```ts
await ductape.processor.messageBroker.publish({
  env: "prd",
  event: "sqsbroker:new-orders",
  product_tag: "my_product",
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

**Key Points**  
- The `message` field is a flexible object containing event-specific data.  
- The event is sent to the appropriate environment and product context.  


## 2. Subscribing to Events

### Description
Subscribing to an event allows you to listen for messages from a message broker and execute a callback function when a message arrives.  

### Required Data Fields
- **`env`** – Environment where the subscription should be active.  
- **`event`** – The event is in the format brokerTag:topicTag 
- **`product_tag`** – Identifier for the product.  
- **`input`** – Contains the subscription details, including:  
  - **`topicTag`** – Unique identifier for the topic.  
  - **`callback`** – Function to handle received messages.  

### Example Usage

```ts
await ductape.processor.messageBroker.subscribe({
  env: "prd",
  event: "sqsbroker:new-orders",
  product_tag: "my_product",
  input: {
    callback: async (message) => {
      console.log("Received message:", message);
      // Process the message (e.g., update order status)
    }
  }
});
```

**Key Points**  
- The callback function receives the message and executes necessary logic.  
- The `topicTag` helps in identifying different event listeners.  

## Choosing the Right Method
| Method        | Use Case |
|--------------|----------|
| **Publishing Messages** | Use when you need to send an event to the message broker. |
| **Subscribing to Events** | Use when you need to listen for events and process incoming messages. |