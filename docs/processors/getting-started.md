---
sidebar_position: 1
---

# Understanding Processors

So far in the documentation, we have covered how to build both apps and products and how to use app actions within our products, but we have not yet explored how to run product resources. This is where processors come in.

The processor interface in Ductape allows you to run your product resources seamlessly on your servers while being fully context-aware of environments, versions, and preferred configurations as set up in the builders.

## Initializing a Processor

The processor interface can be accessed using the `ductape.processor` module of the Ductape SDK:

```typescript
// Access the processor interface
const processor = ductape.processor;
```

Once initialized, the `processor` instance exposes multiple functionalities for managing product resources.

## Processor Management Interface

### Actions

The `action` interface allows you to run product actions:

- `run(data: IProductActionProcessorInput)`: Executes a product action using the processor service.

### Databases

The `db` interface allows you to run database-related actions:

- `run(data: IProductDBActionProcessorInput)`: Executes a database action using the processor service.

### Features

The `feature` interface allows you to execute product features:

- `run(data: IProcessorInput)`: Runs a feature using the processor service.

### Notifications

The `notification` interface allows you to send product notifications:

- `send(data: IProductNotificationProcessorInput)`: Sends a notification using the processor service.

### Storage

The `storage` interface allows you to manage product storage:

- `save(data: IProductStorageProcessorInput)`: Saves data to storage using the processor service.

### Cloud Functions

The `cloudFunction` interface allows you to invoke cloud functions:

- `invoke(data: IProductFunctionProcessorInput)`: Invokes a cloud function using the processor service.

### Message Brokers

The `messageBroker` interface allows you to handle message queues:

- `publish()`: Publishes a message to the broker.
- `subscribe()`: Subscribes to a message broker channel.

### Webhooks

The `webhook` interface allows you to handle webhook events:

- `emit()`: Emits a webhook event.
- `receive()`: Receives and processes a webhook event.

### Jobs

The `job` interface allows you to schedule background jobs:

- `schedule()`: Schedules a job for execution.

## Summary

The processor interface provides a powerful way to execute product resources such as webhooks, jobs, actions, databases, features, notifications, storage, cloud functions, and message brokers within the Ductape ecosystem. By leveraging this interface, developers can efficiently manage and execute various product functionalities on their own infrastructure while maintaining seamless integration with Ductape’s environment management and configuration settings.

