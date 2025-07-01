---
sidebar_position: 1
---

# Scheduling Jobs

Jobs are scheduled using `ductape.processor.job.schedule(data)`, which queues background tasks within the Ductape system. This method supports executing a variety of job types such as app actions, notifications, cloud functions, storage tasks, database operations, or internal features. You can control execution timing, group jobs into sessions, optionally enable input caching, and schedule recurring executions.

```ts
await ductape.processor.job.schedule(data: IJobProcessorInput)
```

This processes a job event in the specified environment and application context, passing along request input, metadata, and optionally session tracking.


## Parameters

### `IJobProcessorInput`

| Field         | Type                        | Required | Description                                                                 |
| ------------- | --------------------------- | -------- | --------------------------------------------------------------------------- |
| `product_tag` | `string`                    | Yes      | Unique identifier for the product executing the job.                        |
| `env`         | `string`                    | Yes      | Environment slug (e.g., `"dev"`, `"prd"`).                               |
| `event`       | `string`                    | Yes      | Event tag representing the job to schedule.                                 |
| `input`       | `object`                    | Yes      | Payload for the job (see accepted input types below).                       |
| `retries`     | `number`                    | Yes      | Number of times to retry the job.                                           |
| `start_at`    | `number`                    | Yes      | Unix timestamp for when the job should start. Use `0` to start immediately. |
| `app`         | `string`                    | No       | Name of the application related to the job.                                 |
| `cache`       | `string`                    | No       | Cache tag to deduplicate or memoize identical job inputs.                   |
| `session`     | [`ISession`](#isession-schema) | No   | Attach user session context to the job execution.                           |
| `repeat`      | [`IJobRepeatOptions`](#ijobrepeatoptions) | No | Configuration for scheduling recurring jobs.                                |

> **Note:** Use `{}` as input when no parameters are required. Optional fields can be omitted or passed as empty `{}`.


## Supported Job Types

The `event` tag and `input` payload should correspond to one of the following job types:

```ts
enum JobEventTypes {
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


## Accepted `input` Types

The `input` field should match one of the following interfaces:

- `IActionRequest` – To schedule an app action.
- `INotificationRequest` – To send a notification.
- `IDbActionRequest` – To perform a database operation.
- `IFunctionRequest` – To execute a cloud function.
- `IStorageRequest` – To interact with file storage.
- `Record<string, unknown>` – To trigger a product feature directly.


## `ISession` Schema

The `session` field enables optional session tracking for any job schedule.

```ts
interface ISession {
  tag: string;   // session tag
  token: string; // session token (e.g. signed JWT)
}
```

| Field   | Type     | Required | Description                                   |
| ------- | -------- | -------- | --------------------------------------------- |
| `tag`   | `string` | Yes      | Tag identifying the session type.             |
| `token` | `string` | Yes      | Token generated when the session was created. |


## Injecting Session Data into Input

You can inject properties from the session payload into the `input` object using the `$Session{tag}{key}` annotation. This resolves the value dynamically from the decrypted session object.

For example:

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

| Field     | Type                | Required | Description                                                                 |
|-----------|---------------------|----------|-----------------------------------------------------------------------------|
| `cron`    | `string`            | No       | Cron expression (e.g., `'0 0 1 * *'` for monthly).                          |
| `every`   | `number` (ms)       | No       | Millisecond-based repeat interval (e.g., `86400000` for daily).            |
| `limit`   | `number`            | No       | Maximum number of repetitions. Defaults to unlimited if not provided.      |
| `endDate` | `number \| string`  | No       | End timestamp or ISO string. Stops job repetition after this date.         |
| `tz`      | `string`            | No       | Timezone used when evaluating `cron` expressions.                          |

> Either `cron` or `every` must be defined. Do not set both unless you intend fallback logic (e.g., `every` if `cron` fails).

#### Examples

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


## Returns

A `Promise<unknown>` — resolves with the result of the job execution. The structure depends on the job implementation and type.


## Example

```ts
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


## See Also

* [Processing Features](../features/processing)
* [Starting a Session](../sessions/generating)
* [Decrypting Session Tokens](../sessions/decrypting)
* [Refreshing Session Tokens](../sessions/refreshing)
* [Session Tracking](../sessions)
