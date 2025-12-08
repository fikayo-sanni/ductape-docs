---
sidebar_position: 2
---

# Scheduling Jobs

Schedule background tasks using the `dispatch()` methods available on each namespace. Jobs can run immediately, at a specific time, or on a recurring schedule.

## Quick Example

```ts
// Schedule an action to run in 1 hour
const job = await ductape.actions.dispatch({
  env: 'prd',
  product: 'my-app',
  app: 'email-service',
  event: 'send_welcome_email',
  input: {
    body: {
      userId: 'user_123',
      email: 'john@example.com'
    }
  },
  retries: 3,
  schedule: {
    start_at: Date.now() + 3600000  // 1 hour from now
  }
});

console.log('Job ID:', job.job_id);
console.log('Status:', job.status);  // 'scheduled' or 'queued'
```

## Dispatch Methods by Namespace

Each namespace has its own `dispatch()` method for scheduling operations as jobs:

| Namespace | Method | Description |
|-----------|--------|-------------|
| `ductape.actions` | `dispatch()` | Schedule app actions |
| `ductape.features` | `dispatch()` | Schedule feature execution |
| `ductape.notifications` | `dispatch()` | Schedule notifications |
| `ductape.storage` | `dispatch()` | Schedule storage operations |
| `ductape.events` | `dispatch()` | Schedule message broker publishes |
| `ductape.databases.action` | `dispatch()` | Schedule database actions |
| `ductape.databases` | `dispatch()` | Schedule database operations |
| `ductape.graphs.action` | `dispatch()` | Schedule graph actions |
| `ductape.graphs` | `dispatch()` | Schedule graph operations |

## Schedule Options

All `dispatch()` methods accept a `schedule` option:

```ts
interface IDispatchSchedule {
  start_at?: number | string;  // Unix timestamp (ms) or ISO date string
  cron?: string;               // Cron expression for recurring jobs
  every?: number;              // Interval in milliseconds
  limit?: number;              // Max number of repetitions
  endDate?: number | string;   // Stop after this date
  tz?: string;                 // Timezone for cron
}
```

## Examples

### Run immediately

```ts
// Omit schedule or use start_at: Date.now()
const job = await ductape.actions.dispatch({
  env: 'prd',
  product: 'billing',
  app: 'payment-service',
  event: 'process_payment',
  input: {
    body: {
      orderId: 'order_456',
      amount: 99.99
    }
  },
  retries: 3
});
```

### Schedule for a specific time

```ts
// Run at a specific timestamp
const job = await ductape.actions.dispatch({
  env: 'prd',
  product: 'marketing',
  app: 'campaign-service',
  event: 'send_campaign',
  input: {
    body: {
      campaignId: 'camp_123',
      audience: 'active_users'
    }
  },
  retries: 2,
  schedule: {
    start_at: new Date('2025-01-15T10:00:00Z').getTime()
  }
});
```

### Recurring job with cron

```ts
// Run every day at 9 AM
const job = await ductape.features.dispatch({
  env: 'prd',
  product: 'reports',
  tag: 'generate_daily_report',
  input: {},
  retries: 2,
  schedule: {
    cron: '0 9 * * *',
    tz: 'America/New_York'
  }
});

console.log('Recurring:', job.recurring);  // true
console.log('Next run:', job.next_run_at);
```

### Recurring job with interval

```ts
// Run every 24 hours
const job = await ductape.databases.action.dispatch({
  env: 'prd',
  product: 'sync',
  database: 'inventory-db',
  event: 'sync_inventory',
  input: { query: {}, data: {} },
  retries: 3,
  schedule: {
    every: 86400000  // 24 hours in milliseconds
  }
});
```

### Limited recurring job

```ts
// Run weekly, but only 4 times
const job = await ductape.notifications.dispatch({
  env: 'prd',
  product: 'reminders',
  notification: 'user-notifications',
  event: 'send_reminder',
  input: {
    email: { recipients: ['user@example.com'] }
  },
  retries: 2,
  schedule: {
    every: 604800000,  // 7 days
    limit: 4
  }
});
```

### Recurring job until a date

```ts
// Run daily until end of year
const job = await ductape.events.dispatch({
  env: 'prd',
  product: 'promo',
  broker: 'kafka-broker',
  event: 'check_promo_status',
  input: { message: { check: true } },
  retries: 1,
  schedule: {
    every: 86400000,
    endDate: '2025-12-31T23:59:59Z'
  }
});
```

### With session data

```ts
const job = await ductape.notifications.dispatch({
  env: 'prd',
  product: 'notifications',
  notification: 'digest-notifications',
  event: 'send_digest',
  input: {
    email: {
      recipients: ['$Session{user}{email}'],
      subject: { userId: '$Session{user}{id}' }
    }
  },
  retries: 3,
  session: {
    tag: 'user-session',
    token: 'eyJhbGciOi...'
  }
});
```

### Database operation dispatch

```ts
// Schedule a database cleanup operation
const job = await ductape.databases.dispatch({
  env: 'prd',
  product: 'my-app',
  database: 'logs-db',
  operation: 'deleteMany',
  input: {
    filter: { createdAt: { $lt: '$DateAdd($Now(), -30, "days")' } }
  },
  schedule: {
    cron: '0 3 * * *'  // Daily at 3 AM
  }
});
```

### Graph operation dispatch

```ts
// Schedule a graph cleanup operation
const job = await ductape.graphs.dispatch({
  env: 'prd',
  product: 'my-app',
  graph: 'session-graph',
  operation: 'deleteNodes',
  input: { filter: { expired: true } },
  schedule: {
    cron: '0 4 * * *'  // Daily at 4 AM
  }
});
```

## Dispatch Result

All `dispatch()` methods return an `IDispatchResult`:

```ts
interface IDispatchResult {
  job_id: string;                        // Unique job ID
  status: 'scheduled' | 'queued';        // Job status
  scheduled_at: number;                  // Scheduled start time
  recurring: boolean;                    // Whether this is a recurring job
  next_run_at?: number;                  // Next run time (for recurring)
}
```

## Common Cron Patterns

| Pattern | Meaning |
|---------|---------|
| `0 * * * *` | Every hour |
| `0 9 * * *` | Every day at 9 AM |
| `0 0 * * 0` | Every Sunday at midnight |
| `0 0 1 * *` | First day of every month |
| `*/15 * * * *` | Every 15 minutes |
| `0 9 * * 1` | Every Monday at 9 AM |

---

## Reference

### IDispatchOptions (base for all dispatch inputs)

```ts
interface IDispatchOptions {
  retries?: number;
  schedule?: IDispatchSchedule;
  session?: {
    tag: string;
    token: string;
  };
  cache?: string;
}
```

### IDispatchSchedule

```ts
interface IDispatchSchedule {
  start_at?: number | string;
  cron?: string;
  every?: number;
  limit?: number;
  endDate?: number | string;
  tz?: string;
}
```

### Namespace-Specific Dispatch Inputs

```ts
// Actions
interface IActionDispatchInput extends IDispatchOptions {
  env: string;
  product: string;
  app: string;
  event: string;
  input: IActionRequest;
}

// Features
interface IFeatureDispatchInput extends IDispatchOptions {
  env: string;
  product: string;
  tag: string;
  input: Record<string, unknown>;
}

// Notifications
interface INotificationDispatchInput extends IDispatchOptions {
  env: string;
  product: string;
  notification: string;
  event: string;
  input: INotificationRequest;
}

// Storage
interface IStorageDispatchInput extends IDispatchOptions {
  env: string;
  product: string;
  storage: string;
  event: string;
  input: IStorageRequest;
}

// Message Broker (Events)
interface IPublishDispatchInput extends IDispatchOptions {
  env: string;
  product: string;
  broker: string;
  event: string;
  input: IPublishRequest;
}

// Database Actions
interface IDBActionDispatchInput extends IDispatchOptions {
  env: string;
  product: string;
  database: string;
  event: string;
  input: IDbActionRequest;
}

// Database Operations
interface IDBOperationDispatchInput extends IDispatchOptions {
  env: string;
  product: string;
  database: string;
  operation: string;
  input: Record<string, unknown>;
}

// Graph Actions
interface IGraphActionDispatchInput extends IDispatchOptions {
  env: string;
  product: string;
  graph: string;
  event: string;
  input: Record<string, unknown>;
}

// Graph Operations
interface IGraphOperationDispatchInput extends IDispatchOptions {
  env: string;
  product: string;
  graph: string;
  operation: string;
  input: Record<string, unknown>;
}
```

## See Also

* [Setting Up Jobs](./overview)
* [Processing Overview](../processing-overview)
* [Sessions](../sessions/overview)
* [Features](../features/overview)
