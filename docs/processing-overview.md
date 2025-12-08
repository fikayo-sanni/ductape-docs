---
sidebar_position: 21
---

# Processors: Running Product Resources
A Processor is the execution engine for your Ductape product. It runs actions, features, jobs, and other resources on your own infrastructure, while staying fully integrated with your product's environments, configuration, and version control.

Think of it as the bridge between your code and where it actually runs. It ensures every workflow executes with the right settings, in the right environment, and with full context.

## Accessing Processor Methods

The Ductape SDK provides direct access to processor methods through dedicated namespaces:

```typescript
import Ductape from '@ductape/sdk';

const ductape = new Ductape({
  workspace_id: 'your-workspace-id',
  user_id: 'your-user-id',
  private_key: 'your-private-key',
});

// Run operations immediately
await ductape.actions.run({ ... });
await ductape.features.run({ ... });
await ductape.notifications.send({ ... });
await ductape.storage.save({ ... });
await ductape.events.publish({ ... });
await ductape.sessions.start({ ... });

// Schedule operations as jobs (dispatch)
await ductape.actions.dispatch({ ..., schedule: { start_at: Date.now() + 3600000 } });
await ductape.features.dispatch({ ..., schedule: { cron: '0 9 * * *' } });

// Database operations via DatabaseService
await ductape.databases.action.execute({ ... });
await ductape.databases.action.dispatch({ ... });
await ductape.databases.dispatch({ ... });

// Graph operations via GraphService
await ductape.graphs.action.dispatch({ ... });
await ductape.graphs.dispatch({ ... });
```

## Processor Capabilities

The SDK exposes methods for managing different types of product resources:

### Immediate Execution

| Namespace | Methods | Description |
|-----------|---------|-------------|
| `ductape.actions` | `run()`, `dispatch()` | Run or schedule product actions |
| `ductape.features` | `run()`, `output()`, `replay()`, `resume()`, `dispatch()` | Run or schedule product features |
| `ductape.notifications` | `send()`, `dispatch()` | Send or schedule notifications |
| `ductape.storage` | `readFile()`, `save()`, `dispatch()` | Manage storage operations |
| `ductape.events` | `publish()`, `subscribe()`, `dispatch()` | Message broker operations |
| `ductape.sessions` | `start()`, `decrypt()`, `refresh()` | Session management |
| `ductape.quota` | `run()` | Run quota checks |
| `ductape.fallback` | `run()` | Execute fallback logic |

### Database Operations (via `ductape.databases`)

| Method | Description |
|--------|-------------|
| `action.execute()` | Execute a database action immediately |
| `action.dispatch()` | Schedule a database action as a job |
| `dispatch()` | Schedule a database operation as a job |
| `migration.run()` | Run a database migration |
| `migration.rollback()` | Rollback a database migration |

### Graph Operations (via `ductape.graphs`)

| Method | Description |
|--------|-------------|
| `action.dispatch()` | Schedule a graph action as a job |
| `dispatch()` | Schedule a graph operation as a job |

## Example: Running an Action

```typescript
import Ductape from '@ductape/sdk';

const ductape = new Ductape({
  workspace_id: 'your-workspace-id',
  user_id: 'your-user-id',
  private_key: 'your-private-key',
});

// Run a product action immediately
const result = await ductape.actions.run({
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

## Example: Scheduling a Job with Dispatch

```typescript
// Schedule an action to run in 1 hour
const job = await ductape.actions.dispatch({
  env: 'prd',
  product: 'my-app',
  app: 'email-service',
  event: 'send_reminder_email',
  input: {
    body: { userId: '12345' }
  },
  schedule: {
    start_at: Date.now() + 3600000  // 1 hour from now
  }
});

console.log('Job scheduled:', job.job_id);

// Schedule a recurring job with cron
const recurringJob = await ductape.features.dispatch({
  env: 'prd',
  product: 'my-app',
  tag: 'daily-report',
  input: {},
  schedule: {
    cron: '0 9 * * *',      // Every day at 9 AM
    tz: 'America/New_York'  // Timezone
  }
});
```

## Best Practices
- Always specify the correct environment when running processor tasks
- Use `dispatch()` methods for scheduled/recurring operations instead of immediate execution
- Handle errors and results according to your product's requirements
- Use appropriate retry and schedule options for job dispatch

## See Also
- [Actions](./actions/run-actions.md)
- [Databases](./databases/actions.md)
- [Features](./features/run.md)
- [Jobs](./jobs/use.md)
- [Message Brokers](./message-brokers/overview.md)
- [Notifications](./notifications/send.md)
- [Sessions](./sessions/use.md)
- [Storage](./storage/use.md)
