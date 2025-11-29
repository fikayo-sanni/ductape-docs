---
sidebar_position: 9
---

# Jobs

Jobs in Ductape are scheduled events that automate tasks at specific times or intervals. Use them for background processes, recurring tasks, and scheduled workflows.

## Quick Example

```ts
import { JobEventTypes } from '@ductape/sdk/types';

await ductape.job.create({
  name: 'Daily Report',
  tag: 'daily-report',
  event_type: JobEventTypes.ACTION,
  event_tag: 'generate_report',
  executions: 0,        // 0 = unlimited
  intervals: 86400000   // 24 hours
});
```

## Creating a Job

```ts
await ductape.job.create({
  name: 'Sync Inventory',
  tag: 'sync-inventory',
  event_type: JobEventTypes.ACTION,
  event_tag: 'sync_stock',
  executions: 0,
  intervals: 3600000  // Every hour
});
```

### Job Fields

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Human-readable name |
| `tag` | string | Unique identifier |
| `event_type` | JobEventTypes | Type of event to execute |
| `event_tag` | string | Tag of the event to run |
| `executions` | number | Run count (0 = unlimited) |
| `intervals` | number | Milliseconds between runs |

### Event Types

| Type | What it does |
|------|--------------|
| `ACTION` | Runs an action |
| `NOTIFICATION` | Sends a notification |
| `DATABASE_ACTION` | Executes a database query |
| `FUNCTION` | Runs a cloud function |
| `MESSAGEBROKER` | Publishes to a message broker |

## Updating a Job

```ts
await ductape.job.update('daily-report', {
  name: 'Weekly Report',
  intervals: 604800000  // 7 days
});
```

## Fetching Jobs

```ts
// Get all jobs
const jobs = await ductape.job.fetchAll();

// Get specific job
const job = await ductape.job.fetch('daily-report');
```

## Best Practices

- Use descriptive names and tags
- Set intervals thoughtfully to avoid overloading your system
- Use `executions: 0` only for jobs that should run continuously
- Monitor job execution and failures

## See Also

* [Scheduling Jobs](./use)
* [Features](../features/overview)
* [Actions](../actions/run-actions)
