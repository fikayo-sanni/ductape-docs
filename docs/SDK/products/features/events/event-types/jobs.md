---
sidebar_position: 4
---

# Jobs


# Job Event Type Documentation

**Job Events** in Ductape are scheduled tasks designed to execute at specified intervals or at a specific point in time. They are autonomous events, meaning they are void and do not pass data to subsequent events, but they can receive data from preceding events within the feature sequence.

## Overview of Job Events

A **Job Event** executes standalone tasks based on pre-defined schedules, supporting actions like data updates, cleanup operations, reminders, notifications, and more. Since they do not pipe data forward, they are ideal for tasks that either finalize a sequence or perform isolated actions that don’t need downstream data transfer.

### IFeatureEvent Interface

```typescript
interface IFeatureEvent {
  type: FeatureEventTypes;            // Required: Specifies the type of event (should be FeatureEventTypes.JOB).
  event: string;                      // Required: event_tag
  input: Record<string, unknown>;     // Required: Input for the job. Structure depends on the job type (e.g., notification, action, db_action, or feature).
  retries: number;                    // Required: Number of retry attempts if the job fails.
  allow_fail: boolean;                // Required: Indicates if the job can fail without affecting the overall sequence.
}
```

### Properties Table

| Property      | Type                         | Required | Description                                                                                       |
|---------------|------------------------------|----------|---------------------------------------------------------------------------------------------------|
| `type`        | `FeatureEventTypes`          | Yes      | Specifies the event type, should be `FeatureEventTypes.JOB`.                                      |
| `event`       | `string`                     | Yes      | Unique identifier for the job event, represented as `event_tag`.                                  |
| `input`       | `Record<string, unknown>`    | Yes      | Job input parameters; the structure is dynamic based on the job type (`notification`, `action`, `db_action`, `feature`). |
| `retries`     | `number`                     | Yes      | Number of retry attempts allowed if the job event encounters failure.                             |
| `allow_fail`  | `boolean`                    | Yes      | Specifies whether the job event can fail without affecting the overall feature sequence.          |

## Sample Job Event

Here’s an example of a Job Event set up to send a scheduled reminder notification. This event will execute at its designated time and retry on failure.

```typescript
const sendReminderJob: IFeatureEvent = {
    type: FeatureEventTypes.JOB,           // Specifies the event as a job
    event: 'send_notification',   // Unique identifier for the job
    input: {
        push_notification: {
            title: 'Reminder Alert',                // Title of the push notification
            body: 'This is a reminder for your upcoming event.', // Message content
            data: {
                eventId: '$Input{event_id}', // Data piping: event ID fetched from a previous input
                reminderType: 'upcoming_event',       // Type of reminder being sent
            },
            device_token: '$Input{device_token}', // Device token piped from user input
        },
        email: {
            to: '$Input{email}',                // Piped recipient email from user input
            subject: 'Event Reminder',
            body: 'Hello! This is a reminder for your upcoming event on $Input{date}.', // Using data piping to include the event date
        },
    },
    retries: 3,         // Number of retry attempts in case of failure
    allow_fail: false,  // Failure of this job will impact the overall sequence
};
```

### Example Use Cases for Job Events

1. **Notifications**: Scheduled email or push notifications to remind users of an upcoming event or deadline.
2. **Database Cleanup**: Routine tasks such as deleting outdated records or optimizing database entries.
3. **Report Generation**: Jobs that generate summary reports or data exports at regular intervals.
4. **Data Synchronization**: Periodic syncing of data between internal and external systems.

### Key Points for Job Events

- **Isolation**: Job events do not pipe data to other events, making them ideal for isolated or final sequence actions.
- **Data Piping**: Job events can receive input data piped from preceding events but do not send outputs to subsequent events.
- **Flexible Input Structure**: Job events accept flexible inputs based on the type of action they perform (`notification`, `action`, `db_action`, or `feature`).
- **Resilience with Retries**: With retry and failure-handling properties, jobs can be configured to attempt multiple times before impacting the sequence.