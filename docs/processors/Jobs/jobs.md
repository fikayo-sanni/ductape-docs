---
sidebar_position: 1
---

# Scheduling Jobs

Jobs are scheduled using `ductape.processor.job.schedule(data)`, which queues background tasks within the Ductape system.

This method supports executing a variety of job types such as app actions, notifications, cloud functions, storage tasks, database operations, or internal features. You can control execution timing, group jobs into sessions, optionally enable input caching, and schedule recurring executions.

## Usage

```ts
await ductape.processor.job.schedule(data: IJobProcessorInput)
```

## Input

### `IJobProcessorInput`

Object containing parameters to schedule a job.

| Property      | Type               | Required   | Description                                                                 |
| ------------- | ------------------ | ---------- | --------------------------------------------------------------------------- |
| `product_tag` | `string`           | ✅ Yes      | Unique identifier for the product executing the job.                        |
| `env`         | `string`           | ✅ Yes      | Environment slug (`"dev"`, `"prd"`, etc.).                                  |
| `event`       | `string`           | ✅ Yes      | Event tag representing the job to schedule.                                 |
| `input`       | `object`           | ✅ Yes      | Payload for the job (see accepted input types below).                       |
| `retries`     | `number`           | ✅ Yes      | Number of times to retry the job.                                           |
| `start_at`    | `number`           | ✅ Yes      | Unix timestamp for when the job should start. Use `0` to start immediately. |
| `app`         | `string`           | ❌ Optional | Name of the application related to the job.                                 |
| `cache`       | `string`           | ❌ Optional | Cache tag to deduplicate or memoize identical job inputs.                   |
| `session`     | `ISession`         | ❌ Optional | Attach user session context to the job execution.                           |
| `repeat`      | `IJobRepeatOptions`| ❌ Optional | Configuration for scheduling recurring jobs.                                |

### Supported Job Types

The `event` tag and `input` payload should correspond to one of the following job types:

```ts
export enum JobEventTypes {
  ACTION = 'action',                  // App actions
  FEATURE = 'feature',                // Internal features
  NOTIFICATION = 'notification',      // Notifications (push, email, etc.)
  DB_ACTION = 'database_action',      // Database reads/writes
  JOB = 'job',                        // Generic background jobs
  STORAGE = 'storage',                // File storage operations
  PUBLISH = 'publish',                // Publish-subscribe events
  SUBSCRIBE = 'subscribe',            // Subscription handlers
  QUOTA = 'quota',                    // Quota enforcement
  FALLBACK = 'fallback',              // Fallback logic for errors/timeouts
}
```

### Accepted `input` Types

The `input` field should match one of the following interfaces:

- `IActionRequest` – To schedule an app action.
- `INotificationRequest` – To send a notification.
- `IDbActionRequest` – To perform a database operation.
- `IFunctionRequest` – To execute a cloud function.
- `IStorageRequest` – To interact with file storage.
- `Record<string, unknown>` – To trigger a product feature directly.

> Use `{}` as input when no parameters are required.

### `ISession`

Optional object to attach user session context to the job.

```ts
{
  tag: string;
  token: string;
}
```

| Field   | Type     | Required | Description                                   |
| ------- | -------- | -------- | --------------------------------------------- |
| `tag`   | `string` | ✅ Yes    | Tag identifying the session type.             |
| `token` | `string` | ✅ Yes    | Token generated when the session was created. |

#### Injecting Session Data into Input

You can dynamically inject values from the session into the job `input` using the `$Session{tag}{key}` notation:

```ts
input: {
  userId: "$Session{details}{id}",
  email: "$Session{details}{email}"
}
```

> The system will resolve these values server-side after decrypting the session token.

## Recurring Jobs

Use the optional `repeat` field to configure a job to run on a repeating schedule.

### `IJobRepeatOptions`

```ts
interface IJobRepeatOptions {
  cron?: string;               // e.g., '0 0 1 * *' (1st of every month at midnight)
  every?: number;              // e.g., 86400000 (repeat every 24 hours in ms)
  limit?: number;              // Optional: how many times the job should repeat
  endDate?: number | string;   // Optional: stop repeating after this date (timestamp or ISO string)
  tz?: string;                 // Optional: timezone for cron execution (e.g., 'Europe/Amsterdam')
}
```

| Property   | Type                | Required | Description                                                                 |
|------------|---------------------|----------|-----------------------------------------------------------------------------|
| `cron`     | `string`            | ❌ No     | Cron expression (e.g., `'0 0 1 * *'` for monthly).                          |
| `every`    | `number` (ms)       | ❌ No     | Millisecond-based repeat interval (e.g., `86400000` for daily).            |
| `limit`    | `number`            | ❌ No     | Maximum number of repetitions. Defaults to unlimited if not provided.      |
| `endDate`  | `number \| string`  | ❌ No     | End timestamp or ISO string. Stops job repetition after this date.         |
| `tz`       | `string`            | ❌ No     | Timezone used when evaluating `cron` expressions.                          |

> Either `cron` or `every` must be defined. Do not set both unless you intend fallback logic (e.g., `every` if `cron` fails).

### Examples

**Every 24 hours:**
```ts
repeat: {
  every: 86400000
}
```

**At midnight on the 1st of every month (UTC):**
```ts
repeat: {
  cron: '0 0 1 * *'
}
```

**Repeat weekly up to 10 times:**
```ts
repeat: {
  every: 604800000,
  limit: 10
}
```

**Repeat daily until a certain date:**
```ts
repeat: {
  every: 86400000,
  endDate: '2025-12-31T23:59:59Z'
}
```

**Use a specific timezone (e.g., Europe/Amsterdam):**
```ts
repeat: {
  cron: '0 9 * * 1',
  tz: 'Europe/Amsterdam'
}
```

> Repeating jobs are re-queued automatically after each successful execution and follow the constraints set by `limit` and `endDate`.

## Output

A `Promise<unknown>` resolving with the result of the job execution. The structure depends on the job implementation and type.

## Example Usage

```ts
import { ductape } from '@ductape/sdk';

const data = {
  product_tag: "my-product",
  env: "prd",
  event: "send_notification",
  start_at: 0,
  input: {
    slug: "order_update",
    push_notification: {
      title: { en: "Order Shipped" },
      body: { en: "Your order #12345 has been shipped!" },
      data: { trackingId: "XYZ987" },
      device_token: "abcdef123456"
    }
  },
  session: {
    tag: "user-session",
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  cache: "notify-user-123",
  repeat: {
    cron: "0 10 * * *",
    tz: "Europe/Amsterdam",
    limit: 30
  }
};

const res = await ductape.processor.job.schedule(data);
```

## Notes

- Use `start_at: 0` for immediate job execution.
- Sessions are useful for associating the job with authenticated user data.
- Use `cache` for idempotent, repeatable jobs that can be deduplicated.
- Feature-style input values (like `$Session{...}`) are supported for all input types.
- Repeated jobs will automatically be rescheduled after completion, respecting any `limit` and `endDate`.

## Related

- [Processing Features](../features/processing)
- [Starting a Session](../sessions/generating)
- [Decrypting Session Tokens](../sessions/decrypting)
- [Refreshing Session Tokens](../sessions/refreshing)
