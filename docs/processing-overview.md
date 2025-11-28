---
sidebar_position: 21
---

# Processors: Running Product Resources
A Processor is the execution engine for your Ductape product. It runs actions, features, jobs, and other resources on your own infrastructure, while staying fully integrated with your product's environments, configuration, and version control.

Think of it as the bridge between your code and where it actually runs. It ensures every workflow executes with the right settings, in the right environment, and with full context.

## Accessing Processor Methods

The Ductape SDK provides direct access to processor methods at the root level for most operations:

```typescript
import Ductape from '@ductape/sdk';

const ductape = new Ductape({
  workspace_id: 'your-workspace-id',
  user_id: 'your-user-id',
  private_key: 'your-private-key',
});

// Most processor methods are available directly on ductape
await ductape.action.run({ ... });
await ductape.storage.run({ ... });
await ductape.sessions.start({ ... });

// Database operations
await ductape.database.execute({ ... });
```

## Processor Capabilities

The SDK exposes methods for managing different types of product resources:

- **Actions**: Run product actions (`ductape.action.run`)
- **Databases**: Execute database actions (`ductape.database.execute`)
- **Features**: Run product features (`ductape.feature.run`)
- **Notifications**: Send notifications (`ductape.notification.send`)
- **Storage**: Manage storage (`ductape.storage.run`)
- **Message Brokers**: Publish/subscribe to message queues (`ductape.broker.publish`, `ductape.broker.subscribe`)
- **Sessions**: Create, validate, and refresh sessions (`ductape.sessions.start`, `ductape.sessions.validate`, `ductape.sessions.refresh`)
- **Jobs**: Schedule background jobs (`ductape.job.schedule`)
- **Quotas**: Run quota checks (`ductape.quota.run`)
- **Fallbacks**: Execute fallback logic (`ductape.fallback.run`)

## Example: Running an Action

```typescript
import Ductape from '@ductape/sdk';

const ductape = new Ductape({
  workspace_id: 'your-workspace-id',
  user_id: 'your-user-id',
  private_key: 'your-private-key',
});

// Run a product action directly
const result = await ductape.action.run({
  env: 'prd',
  product: 'my-app',
  app: 'email-service',
  event: 'send_welcome_email',
  input: {
    body: {
      userId: '12345',
      email: 'user@example.com'
    }
  }
});

console.log('Action result:', result);
```

## Best Practices
- Always specify the correct environment when running processor tasks
- Use the appropriate processor interface for the resource you want to manage
- Handle errors and results according to your product's requirements

## See Also
- [Actions](./actions/run-actions.md)
- [Databases](./databases/execute.md)
- [Features](./features/run.md)
- [Jobs](./jobs/use.md)
- [Message Brokers](./message-brokers/use.md)
- [Notifications](./notifications/send.md)
- [Sessions](./sessions/use.md)
- [Storage](./storage/use.md)
