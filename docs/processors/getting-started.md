---
sidebar_position: 1
---

# Processors: Running Product Resources
A Processor is the execution engine for your Ductape product. It runs actions, features, jobs, and other resources on your own infrastructure, while staying fully integrated with your product’s environments, configuration, and version control.

Think of it as the bridge between your code and where it actually runs. It ensures every workflow executes with the right settings, in the right environment, and with full context.

## Accessing the Processor Interface

You can access the processor interface using the `ductape.processor` module:

```typescript
import { ductape } from 'ductape-sdk';

// Initialize the processor
const processor = ductape.processor;
```

## Processor Capabilities

Each processor interface exposes methods for managing a specific type of product resource:

- **Actions**: Run product actions (`processor.action.run`)
- **Databases**: Execute database actions (`processor.db.run`)
- **Features**: Run product features (`processor.feature.run`)
- **Notifications**: Send notifications (`processor.notification.send`)
- **Storage**: Manage storage (`processor.storage.save`)
- **Message Brokers**: Publish/subscribe to message queues (`processor.messageBroker.publish`, `processor.messageBroker.subscribe`)
- **Webhooks**: Emit or receive webhook events (`processor.webhook.emit`, `processor.webhook.receive`)
- **Jobs**: Schedule background jobs (`processor.job.schedule`)

## Example: Running an Action

```typescript
import { ductape } from 'ductape-sdk';

const processor = ductape.processor;

// Example: Run a product action
const result = await processor.action.run({
  action: 'sendWelcomeEmail',
  input: {
    userId: '12345',
    email: 'user@example.com',
  },
  environment: 'production',
});

console.log('Action result:', result);
```

## Best Practices
- Always specify the correct environment and version when running processor tasks.
- Use the appropriate processor interface for the resource you want to manage.
- Handle errors and results according to your product's requirements.

## See Also
- [Actions](./actions/run-actions.md)
- [Database Actions](./database-actions/db-actions.md)
- [Features](./features/features.md)
- [Jobs](./jobs/jobs.md)
- [Message Brokers](./message-brokers/message-brokers.md)
- [Notifications](./notifications/notifications.md)
- [Sessions](./sessions/sessions.md)
- [Storage](./storage/storage.md)
- [Database Migrations](./database-migrations/db-migrations.md)

