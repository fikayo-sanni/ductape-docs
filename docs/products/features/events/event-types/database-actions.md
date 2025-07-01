---
sidebar_position: 3
---

# Database Actions

Database Action events in Ductape are used to execute operations on your database, such as creating, reading, updating, or deleting records. They enable your feature to interact directly with your database, supporting robust data processing and error handling.

## What is a Database Action Event?

A database action event is defined using the `IFeatureEvent` type from the SDK, with `type` set to `FeatureEventTypes.DB_ACTION`. It specifies the parameters for a database operation, including the data to process and optional filters.

## IFeatureEvent Structure (Database Action)

```typescript
interface IFeatureEvent {
  type: FeatureEventTypes;     // Required: Should be FeatureEventTypes.DB_ACTION
  event: string;              // Required: Concatenated as `${db_tag}:${db_action_tag}`
  input: {
    data: Record<string, unknown>;   // Required: Data for the database action
    filter?: Record<string, unknown>; // Optional: Criteria for filtering records
  };
  retries: number;            // Required: Number of retry attempts if the action fails
  allow_fail: boolean;        // Required: Whether the event can fail without affecting the overall sequence
  // ...other optional fields
}
```

## Properties

| Property     | Type                          | Required | Description                                                                                  |
|--------------|-------------------------------|----------|----------------------------------------------------------------------------------------------|
| `type`       | `FeatureEventTypes`           | Yes      | Should be `FeatureEventTypes.DB_ACTION`.                                                     |
| `event`      | `string`                      | Yes      | Unique identifier for the action, formatted as `${db_tag}:${db_action_tag}`.                 |
| `input`      | `{ data, filter? }`           | Yes      | Data for the action and optional filter criteria.                                            |
| `retries`    | `number`                      | Yes      | Number of retry attempts allowed if the action fails.                                        |
| `allow_fail` | `boolean`                     | Yes      | Whether the event can fail without affecting the overall sequence.                           |

## Example: Insert Record

```typescript
const insertUserEvent: IFeatureEvent = {
  type: FeatureEventTypes.DB_ACTION,
  event: 'user_db:insert',
  input: {
    data: {
      username: 'new_user',
      email: 'new_user@example.com',
      password: 'securepassword',
    },
    filter: {
      email: 'new_user@example.com',
    },
  },
  retries: 3,
  allow_fail: false,
};
```

## Example: Update Record

```typescript
const updateUserEvent: IFeatureEvent = {
  type: FeatureEventTypes.DB_ACTION,
  event: 'user_db:update',
  input: {
    data: {
      userId: 'user_12345',
      email: 'updated_email@example.com',
    },
    filter: {
      userId: 'user_12345',
    },
  },
  retries: 2,
  allow_fail: true,
};
```

## Best Practices
- Use descriptive event tags (e.g., `user_db:insert`) for clarity.
- Leverage data piping in input fields to dynamically reference data from previous events or feature inputs.
- Set `retries` and `allow_fail` thoughtfully to control error handling and resilience.
- Document the purpose and expected result of each database action event for maintainability.

## See Also
- [Features Overview](../../../getting-started.md)
- [Event Types Overview](../)
- [Data Piping](../data-piping.md)