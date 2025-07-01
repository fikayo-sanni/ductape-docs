---
sidebar_position: 9
---

# Jobs

Jobs in Ductape are scheduled events that allow you to automate tasks at specific times or intervals. They are essential for running background processes, recurring tasks, notifications, database actions, and more. Jobs can execute any previously created product event type, including actions, notifications, database actions, functions, and message broker events.

A job is always associated with a specific event type and event tag. You can control how often a job runs, how many times it executes, and what event it triggers.

## Creating a Job

To create a job, use the `create` function from the `product.jobs` interface. You must specify the job details, including the event type and tag to execute, and scheduling options.

```typescript
import ductape from './ductapeClient';
import { JobEventTypes, IProductJob } from "ductape-sdk/dist/types";

const details: IProductJob = {
  name: 'Example Job',
  tag: 'example_job',
  event_type: JobEventTypes.ACTION, // event type to execute
  event_tag: 'action_tag',          // tag of the event to run
  executions: 5,                    // set to 0 for unlimited executions
  intervals: 60000,                 // interval in milliseconds
};
await ductape.product.jobs.create(details);
```

| Field         | Type                     | Required | Description                                                                 |
|-------------- |--------------------------|----------|-----------------------------------------------------------------------------|
| `name`        | string                   | Yes      | Human-readable name for the job.                                            |
| `tag`         | string                   | Yes      | Unique identifier for the job.                                              |
| `event_type`  | `JobEventTypes` enum     | Yes      | The type of event to execute (see below).                                  |
| `event_tag`   | string                   | Yes      | Tag of the event being executed.                                            |
| `executions`  | number                   | Yes      | Number of times to execute the job. Set to `0` for unlimited executions.    |
| `intervals`   | number (milliseconds)    | Yes      | Interval in milliseconds between each execution.                            |

> **Note:** Setting `executions` to `0` means the job will run indefinitely at the specified interval until deleted or updated.

### Supported Job Event Types

The `JobEventTypes` enum specifies the type of events you can schedule as jobs:

| JobEventTypes      | Description                                |
|--------------------|--------------------------------------------|
| `ACTION`           | Executes an action event.                  |
| `NOTIFICATION`     | Executes a notification event.             |
| `DATABASE_ACTION`  | Executes a database action.                |
| `FUNCTION`         | Executes a cloud function.                 |
| `MESSAGEBROKER`    | Executes a message broker event emit.      |

## Updating a Job

To update an existing job, use the `update` function, providing the job `tag` and the updated details. You can change the name, executions, intervals, or event details as needed.

```typescript
const tag = 'example_job';
const data: Partial<IProductJob> = {
  name: 'Updated Job Name',
  executions: 10,
  intervals: 120000,
};
await ductape.product.jobs.update(tag, data);
```

| Updatable Field   | Description                                                    |
|-------------------|----------------------------------------------------------------|
| `name`            | Human-readable name for the job.                               |
| `event_type`      | The type of event to execute.                                  |
| `event_tag`       | Tag of the event being executed.                               |
| `executions`      | Number of times to execute the job.                            |
| `intervals`       | Interval in milliseconds between each execution.               |

> **Tip:** Use descriptive names and tags for jobs to clarify their purpose and make management easier.

## Fetching Jobs

- **Fetch all jobs:**
  ```typescript
  const jobs = await ductape.product.jobs.fetchAll();
  ```
- **Fetch a specific job by tag:**
  ```typescript
  const job = await ductape.product.jobs.fetch('example_job');
  ```

## Best Practices
- Use descriptive names and tags for jobs to clarify their purpose.
- Set intervals and executions thoughtfully to avoid overloading your system.
- Use unlimited executions (`executions: 0`) only for jobs that should run continuously.
- Regularly review and update job definitions as your integration needs evolve.
- Use the same naming conventions for tags and slugs across your product.
- Monitor job execution and failures to ensure reliability.
- Schedule jobs in non-overlapping intervals if they operate on shared resources.

## See Also

- [Job Event Type (Technical Reference)](./features/events/event-types/jobs.md)
- [Action Events](./features/events/event-types/actions.md)
- [Notification Events](./features/events/event-types/notifications.md)
- [Database Action Events](./features/events/event-types/database-actions.md)
- [Managing Message Broker Topics](./message-broker/managing-topics.md)
- [Healthchecks](./healthchecks.md)