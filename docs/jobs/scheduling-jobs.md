---
sidebar_position: 1
---

# Scheduling Jobs

Schedule background tasks using the `dispatch()` methods available on each namespace. Jobs can run immediately, at a specific time, or on a recurring schedule.

## Overview

Ductape's job scheduling system allows you to:

- **Execute tasks asynchronously** - Run operations in the background without blocking
- **Schedule for later** - Delay execution to a specific time
- **Create recurring jobs** - Use cron expressions or intervals for repeated execution
- **Integrate with all primitives** - Schedule actions, notifications, database operations, and more

## Quick Example

```ts
// Schedule an action to run in 1 hour
const job = await ductape.actions.dispatch({
  env: 'prd',
  product: 'my-app',
  app: 'email-service',
  event: 'send_welcome_email',
  input: {
    userId: 'user_123',
    email: 'john@example.com'
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
| `ductape.workflows` | `dispatch()` | Schedule workflow execution |
| `ductape.notifications` | `dispatch()` | Schedule notifications |
| `ductape.storage` | `dispatch()` | Schedule storage operations |
| `ductape.events` | `dispatch()` | Schedule message broker publishes |
| `ductape.database` | `dispatch()` | Schedule database operations |
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

### Schedule Fields

| Field | Type | Description |
|-------|------|-------------|
| `start_at` | number \| string | When to start the job. Unix timestamp (ms) or ISO date string |
| `cron` | string | Cron expression for recurring schedules |
| `every` | number | Interval in milliseconds between runs |
| `limit` | number | Maximum number of times to run (for recurring jobs) |
| `endDate` | number \| string | Stop recurring after this date |
| `tz` | string | Timezone for cron expressions (e.g., `'America/New_York'`) |

## Basic Examples

### Run Immediately

```ts
// Omit schedule or use start_at: Date.now()
const job = await ductape.actions.dispatch({
  env: 'prd',
  product: 'billing',
  app: 'payment-service',
  event: 'process_payment',
  input: {
    orderId: 'order_456',
    amount: 99.99
  },
  retries: 3
});
```

### Schedule for a Specific Time

```ts
// Run at a specific timestamp
const job = await ductape.actions.dispatch({
  env: 'prd',
  product: 'marketing',
  app: 'campaign-service',
  event: 'send_campaign',
  input: {
    campaignId: 'camp_123',
    audience: 'active_users'
  },
  retries: 2,
  schedule: {
    start_at: new Date('2025-01-15T10:00:00Z').getTime()
  }
});
```

### Recurring Job with Cron

```ts
// Run every day at 9 AM
const job = await ductape.workflows.dispatch({
  env: 'prd',
  product: 'reports',
  workflow: 'generate_daily_report',
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

### Recurring Job with Interval

```ts
// Run every 24 hours
const job = await ductape.database.dispatch({
  env: 'prd',
  product: 'sync',
  database: 'inventory-db',
  operation: 'insert',
  input: {
    table: 'sync_logs',
    data: {
      sync_type: 'inventory',
      started_at: '$Now()'
    }
  },
  retries: 3,
  schedule: {
    every: 86400000  // 24 hours in milliseconds
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

For a complete guide on cron expressions, see [Cron Expressions](./cron-expressions).

## Next Steps

- [Cron Expressions](./cron-expressions) - Master cron syntax for recurring jobs
- [Job Management](./job-management) - Monitor, pause, and cancel jobs
- [Retry Strategies](./retry-strategies) - Handle failures gracefully
- [Examples](./examples) - Real-world scheduling patterns

## See Also

* [Processing Overview](../processing-overview)
* [Sessions](../sessions/overview)
* [Workflows](../workflows/overview)
