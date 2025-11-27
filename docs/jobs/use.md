---
sidebar_position: 2
---

# Scheduling Jobs

Schedule background tasks using `ductape.job.schedule()`. Jobs can run immediately, at a specific time, or on a recurring schedule.

## Quick Example

```ts
// Schedule a job to run immediately
await ductape.job.schedule({
  env: 'prd',
  product_tag: 'my-app',
  event: 'send_welcome_email',
  start_at: 0,  // 0 means run immediately
  retries: 3,
  input: {
    userId: 'user_123',
    email: 'john@example.com'
  }
});
```

## How It Works

1. **env** - Which environment to run in (`dev`, `staging`, `prd`)
2. **product_tag** - Your product's unique identifier
3. **event** - The job tag to execute
4. **start_at** - When to run (Unix timestamp, or `0` for immediate)
5. **retries** - Number of retry attempts on failure
6. **input** - Data to pass to the job

## Examples

### Run immediately

```ts
await ductape.job.schedule({
  env: 'prd',
  product_tag: 'billing',
  event: 'process_payment',
  start_at: 0,
  retries: 3,
  input: {
    orderId: 'order_456',
    amount: 99.99
  }
});
```

### Schedule for a specific time

```ts
// Run at a specific timestamp
await ductape.job.schedule({
  env: 'prd',
  product_tag: 'marketing',
  event: 'send_campaign',
  start_at: 1704067200,  // Unix timestamp
  retries: 2,
  input: {
    campaignId: 'camp_123',
    audience: 'active_users'
  }
});
```

### Recurring job with cron

```ts
// Run every day at 9 AM
await ductape.job.schedule({
  env: 'prd',
  product_tag: 'reports',
  event: 'generate_daily_report',
  start_at: 0,
  retries: 2,
  input: {},
  repeat: {
    cron: '0 9 * * *',
    tz: 'America/New_York'
  }
});
```

### Recurring job with interval

```ts
// Run every 24 hours
await ductape.job.schedule({
  env: 'prd',
  product_tag: 'sync',
  event: 'sync_inventory',
  start_at: 0,
  retries: 3,
  input: {},
  repeat: {
    every: 86400000  // 24 hours in milliseconds
  }
});
```

### Limited recurring job

```ts
// Run weekly, but only 4 times
await ductape.job.schedule({
  env: 'prd',
  product_tag: 'reminders',
  event: 'send_reminder',
  start_at: 0,
  retries: 2,
  input: { userId: 'user_123' },
  repeat: {
    every: 604800000,  // 7 days
    limit: 4
  }
});
```

### Recurring job until a date

```ts
// Run daily until end of year
await ductape.job.schedule({
  env: 'prd',
  product_tag: 'promo',
  event: 'check_promo_status',
  start_at: 0,
  retries: 1,
  input: {},
  repeat: {
    every: 86400000,
    endDate: '2025-12-31T23:59:59Z'
  }
});
```

### With session data

```ts
await ductape.job.schedule({
  env: 'prd',
  product_tag: 'notifications',
  event: 'send_digest',
  start_at: 0,
  retries: 3,
  input: {
    userId: '$Session{user}{id}',
    email: '$Session{user}{email}'
  },
  session: {
    tag: 'user-session',
    token: 'eyJhbGciOi...'
  }
});
```

## Repeat Options

| Option | Type | Description |
|--------|------|-------------|
| `cron` | `string` | Cron expression (e.g., `'0 9 * * *'` for 9 AM daily) |
| `every` | `number` | Interval in milliseconds |
| `limit` | `number` | Max number of repetitions |
| `endDate` | `string` | Stop after this date (ISO format) |
| `tz` | `string` | Timezone for cron (e.g., `'America/New_York'`) |

## Common Cron Patterns

| Pattern | Meaning |
|---------|---------|
| `0 * * * *` | Every hour |
| `0 9 * * *` | Every day at 9 AM |
| `0 0 * * 0` | Every Sunday at midnight |
| `0 0 1 * *` | First day of every month |
| `*/15 * * * *` | Every 15 minutes |

---

## Reference

### IJobProcessorInput

```ts
interface IJobProcessorInput {
  env: string;
  product_tag: string;
  event: string;
  start_at: number;
  retries: number;
  input: Record<string, unknown>;
  app?: string;
  cache?: string;
  session?: ISession;
  repeat?: IJobRepeatOptions;
}
```

### IJobRepeatOptions

```ts
interface IJobRepeatOptions {
  cron?: string;
  every?: number;
  limit?: number;
  endDate?: number | string;
  tz?: string;
}
```

### ISession

```ts
interface ISession {
  tag: string;
  token: string;
}
```

## See Also

* [Setting Up Jobs](./overview)
* [Sessions](../sessions/overview)
* [Features](../features/overview)
