---
sidebar_position: 6
---

# Sequencing Events

Event sequencing in Ductape allows you to define the order and logic by which actions and events are executed within a feature. Sequences are described using the `IFeatureSequence` and `IFeatureEvent` types from the SDK, enabling you to build complex, conditional, and multi-step workflows.

## What is an Event Sequence?

An event sequence is an ordered array of events (actions, notifications, database actions, jobs, etc.) that are executed in the specified order. Each sequence can have a tag and may reference parent sequences for advanced branching or dependency management.

### IFeatureSequence Structure

```typescript
interface IFeatureSequence {
  parents?: Array<string>; // Optional: tags of parent sequences
  level?: number;         // Optional: depth or order in the workflow
  tag: string;            // Unique identifier for the sequence
  events: Array<IFeatureEvent>; // The events to execute in this sequence
}
```

### IFeatureEvent Structure (Simplified)

```typescript
interface IFeatureEvent {
  type: FeatureEventTypes; // e.g., ACTION, NOTIFICATION, DB_ACTION, etc.
  event: string;           // Tag of the event to execute
  input: Record<string, unknown>; // Input parameters for the event
  retries: number;         // Number of retry attempts if the event fails
  allow_fail: boolean;     // Whether failure is allowed without stopping the sequence
  // ...other advanced options
}
```

## Example: Defining an Event Sequence

```typescript
const mainSequence: IFeatureSequence = {
  tag: 'main_sequence',
  events: [
    {
      type: FeatureEventTypes.ACTION,
      event: 'validate_user',
      input: { userId: '$Input{user_id}' },
      retries: 2,
      allow_fail: false,
    },
    {
      type: FeatureEventTypes.NOTIFICATION,
      event: 'send_welcome_email',
      input: { email: '$Input{email}' },
      retries: 1,
      allow_fail: true,
    },
  ],
};
```

> **Tip:** You can define multiple sequences and use the `parents` field to create dependencies or branching logic between them.

## Best Practices
- Use descriptive tags for sequences and events to clarify their purpose.
- Keep sequences modular and focused on a single responsibility when possible.
- Use the `retries` and `allow_fail` fields to control error handling and resilience.
- Document the flow and dependencies between sequences for maintainability.

## See Also
- [Features Overview](../../getting-started.md)
- [Event Types Overview](./event-types/)
- [Data Piping](./data-piping.md)


