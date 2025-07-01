---
sidebar_position: 4
---

# Jobs

Job events in Ductape are scheduled tasks designed to execute at specified intervals or at a specific point in time. They are ideal for running autonomous, isolated tasks such as notifications, database cleanup, report generation, or data synchronization.

## What is a Job Event?

A job event is defined using the `IFeatureEvent` type from the SDK, with `type` set to `FeatureEventTypes.JOB`. Job events are void—they do not pass data to subsequent events, but can receive data from preceding events within the feature sequence.

## IFeatureEvent Structure (Job)

```typescript
interface IFeatureEvent {
  type: FeatureEventTypes;         // Required: Should be FeatureEventTypes.JOB
  event: string;                  // Required: Unique identifier for the job event
  input: Record<string, unknown>; // Required: Input for the job (structure depends on job type)
  retries: number;                // Required: Number of retry attempts if the job fails
  allow_fail: boolean;            // Required: Whether the job can fail without affecting the overall sequence
  // ...other optional fields
}
```

## Properties

| Property     | Type                      | Required | Description                                                                                       |
|--------------|---------------------------|----------|---------------------------------------------------------------------------------------------------|
| `type`       | `FeatureEventTypes`       | Yes      | Should be `FeatureEventTypes.JOB`.                                                                |
| `event`      | `string`                  | Yes      | Unique identifier for the job event.                                                              |
| `input`      | `Record<string, unknown>` | Yes      | Job input parameters; structure depends on the job type (`notification`, `action`, `db_action`, etc.). |
| `retries`    | `number`                  | Yes      | Number of retry attempts allowed if the job event encounters failure.                             |
| `allow_fail` | `boolean`                 | Yes      | Whether the job event can fail without affecting the overall feature sequence.                    |

## Example: Job Event

```typescript
const sendReminderJob: IFeatureEvent = {
  type: FeatureEventTypes.JOB,
  event: 'send_notification',
  input: {
    push_notification: {
      title: 'Reminder Alert',
      body: 'This is a reminder for your upcoming event.',
      data: {
        eventId: '$Input{event_id}',
        reminderType: 'upcoming_event',
      },
      device_token: '$Input{device_token}',
    },
    email: {
      to: '$Input{email}',
      subject: 'Event Reminder',
      body: 'Hello! This is a reminder for your upcoming event on $Input{date}.',
    },
  },
  retries: 3,
  allow_fail: false,
};
```

## Best Practices
- Use job events for isolated or final sequence actions that do not need to pipe data forward.
- Leverage data piping in input fields to dynamically reference data from previous events or feature inputs.
- Set `retries` and `allow_fail` thoughtfully to control error handling and resilience.
- Document the purpose and expected result of each job event for maintainability.

## See Also
- [Features Overview](../../../getting-started.md)
- [Event Types Overview](../)
- [Data Piping](../data-piping.md)