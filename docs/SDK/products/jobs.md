---
sidebar_position: 8
---

# Jobs

Jobs are scheduled events in Ductape that allow you to execute tasks at a specified time, at intervals, or both. Any previously created product event types can be scheduled as jobs, including `actions`, `notifications`, `database_actions`, and `functions`.

## Creating Jobs

To create a job, use the `createJob` function of the `productBuilder` interface:

```typescript
import { JobEventTypes } from "ductape-sdk/dist/types/enums";
import { IProductJob } from "ductape-sdk/dist/types/productsBuilder.types";

// ... product builder instance

const details: IProductJob = {
    name: 'Example Job',          // name of job
    tag: 'example_job',            // unique job identifier
    event_type: JobEventTypes.ACTION, // event type to execute
    event_tag: 'action_tag',       // tag of the event to run
    executions: 5,                 // set to 0 for unlimited executions
    intervals: 60000,              // interval in milliseconds
    start_at: 198766789,           // start time as a Unix timestamp
};
await productBuilder.createJob(details);
```

| Field        | Type                   | Description                                                                                  |
|--------------|------------------------|----------------------------------------------------------------------------------------------|
| `name`       | `string`               | The name of the job, used for identification and logging.                                    |
| `tag`        | `string`               | A unique identifier for the job, used to manage and retrieve specific jobs.                  |
| `event_type` | `JobEventTypes` enum   | The type of event to execute (e.g., `ACTION`, `NOTIFICATION`).                               |
| `event_tag`  | `string`               | The tag for the event being executed, corresponding to the specific event type chosen.       |
| `executions` | `number`               | The number of times to execute the job. Set to `0` for unlimited executions.                 |
| `intervals`  | `number` (milliseconds)| The interval, in milliseconds, between each job execution.                                   |
| `start_at`   | `number` (timestamp)   | The Unix timestamp that specifies when the job should begin execution.                       |

### Job Event Types

The `JobEventTypes` enum specifies the type of events you can schedule as jobs.

| JobEventTypes      | Description                                |
|--------------------|--------------------------------------------|
| `ACTION`           | Executes an action event.                  |
| `NOTIFICATION`     | Executes a notification event.             |
| `DATABASE_ACTION`  | Executes a database action.                |
| `FUNCTION`         | Executes a custom function.                |

## Updating Jobs

To update an existing job, use the `updateJob` function, providing the job `tag` and the updated details:

```typescript
const tag = 'example_job';
const data: Partial<IProductJob> = {
    name: 'Updated Job Name',     // optional updated name
    executions: 10,               // optional updated execution limit
    intervals: 120000,            // optional updated interval
};
await productBuilder.updateJob(tag, data);
```

## Fetching Jobs

To retrieve a list of all jobs, use the `fetchJobs` function:

```typescript
const jobs = await productBuilder.fetchJobs(); // returns an array of all jobs
```

To fetch a specific job, use the `fetchJob` function with the job `tag`:

```typescript
const tag = 'example_job';
const job = await productBuilder.fetchJob(tag); // retrieves a specific job by tag
```

These functions provide flexibility for creating, updating, and managing scheduled events across your Ductape applications.