---
sidebar_position: 3
---

# Database Action

Database Action Events are crucial for executing operations on your database within the Ductape framework. This event type allows you to define actions that interact directly with your database, enabling you to create, read, update, or delete records as needed.

## Overview of Database Action Events

A **Database Action Event** enables the specification of necessary parameters for database operations, handling data manipulation, and managing retries and error handling. This event type ensures a robust interaction with the database while allowing for configurable behavior in case of failures.

### IFeatureEvent Interface

```typescript
interface IFeatureEvent {
  type: FeatureEventTypes;     // Required: Specifies the type of event (should be FeatureEventTypes.DB_ACTION).
  event: string;               // Required: a concatenation of `${db_tag}:${db_action_tag}`
  input: {
    data: Record<string, unknown>;   // Required: The data to be processed in the database action.
    filter?: Record<string, unknown>; // Optional: Criteria for filtering records during read or delete operations.
  };
  retries: number;            // Required: Number of retry attempts if the notification fails.
  allow_fail: boolean;        // Required: Indicates if the event can fail without affecting the overall sequence.
}
```

### Properties Table

| Property    | Type                          | Required | Description                                                                                  |
|-------------|-------------------------------|----------|----------------------------------------------------------------------------------------------|
| `type`      | `FeatureEventTypes`          | Yes      | Specifies the type of event, should be `FeatureEventTypes.DB_ACTION`.                      |
| `event`     | `string`                     | Yes      | A unique identifier for the action, formatted as `${db_tag}:${db_action_tag}`.            |
| `input`     | `{ data, filter? }`          | Yes      | Contains the following properties: <br/> - `data`: (Required) The data for the database action. <br/> - `filter`: (Optional) Criteria for filtering records. |
| `retries`   | `number`                     | Yes      | The number of retry attempts allowed if the action fails.                                   |
| `allow_fail`| `boolean`                    | Yes      | Indicates whether the event can fail without affecting the overall sequence.                |

## Sample Database Action Event

Here’s an example of how to structure a Database Action Event for inserting a new user record into the database:

```typescript
const insertUserEvent: IFeatureEvent = {
    type: FeatureEventTypes.DB_ACTION, // The event type for database actions
    event: 'user_db:insert',            // Concatenated event identifier
    input: {
        data: {
            username: 'new_user',       // Required: Data to be inserted
            email: 'new_user@example.com',
            password: 'securepassword',
        },
        filter: {
            email: 'new_user@example.com', // Optional: Filter criteria for checking existing users
        },
    },
    retries: 3, // Number of retry attempts if the action fails
    allow_fail: false, // The action cannot fail without affecting the overall sequence
};
```

## Use Cases for Database Action Events

1. **Inserting Data**: Use database action events to insert new records into a database, as shown in the sample above.

2. **Updating Records**: Define an event to update existing records based on specific criteria.

3. **Retrieving Records**: Use filters to fetch specific records from the database.

4. **Deleting Records**: Create an event to remove records from the database using filters.

### Example for Updating a User Record

```typescript
const updateUserEvent: IFeatureEvent = {
    type: FeatureEventTypes.DB_ACTION,
    event: 'user_db:update',
    input: {
        data: {
            userId: 'user_12345', // Required: Unique identifier for the user to be updated
            email: 'updated_email@example.com',
        },
        filter: {
            userId: 'user_12345', // Optional: Filter to identify the record to be updated
        },
    },
    retries: 2, // Number of retry attempts if the action fails
    allow_fail: true, // The action can fail without affecting the overall sequence
};
```

## Conclusion

Database Action Events are essential for managing data within your application effectively. By leveraging the `IFeatureEvent` interface and adhering to the provided structure, you can ensure robust interaction with your database, streamline data processing, and handle errors gracefully. This documentation serves as a guide to implementing and utilizing Database Action Events within your Ductape applications.