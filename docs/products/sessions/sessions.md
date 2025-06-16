---
sidebar_position: 3
---

# Managing Sessions

Ductape allows you to configure and manage sessions for your product, enabling you to track user behavior, manage authentication and authorization out of the box, and maintain full visibility over activities happening within your products.

Sessions in Ductape are flexible containers for identifying and interacting with users across different environments. You can define your own schema for what a session should hold, configure expiry times, and determine how users are identified within your system.

## Creating Sessions

To create a new session type, use the `create` function from the `product.sessions` interface.

### Example

```ts
import ductape from './ductapeClient';
import { IProductSession } from '@ductape/sdk/dist/types';

const details: IProductSession = {
  name: "Session Name",
  tag: "session_name",
  description: "Session Description Here",
  schema: { // Define your own session schema (will be encrypted in the session token)
    userId: "191010192-19198829819",
    details: {
      username: "ductape-user",
      email: "santos@ductape.app",
    }
  },
  selector: "$Session{userId}", // Used to identify the session user (can also be nested like $Session{details}{username})
  expiry: 7, // Number of units before the session expires
  period: "hours" // Expiry unit (e.g., hours, days)
};

await ductape.products.sessions.create(details);
````

### Field Definitions

| Field         | Type            | Required | Description                                                                                                                                     |
| ------------- | --------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`        | `string`        | Yes      | The display name of the session.                                                                                                                |
| `tag`         | `string`        | Yes      | A unique identifier for the session. Used to reference the session type within your application.                                                |
| `description` | `string`        | Yes      | A short description of the session’s purpose.                                                                                                   |
| `schema`      | `object`        | Yes      | The structure of the data you want to associate with the session. This is encrypted within the token.                                           |
| `selector`    | `string`        | Yes      | A reference path within the schema to identify a user (e.g., `$Session{userId}` or `$Session{details}{username}`).                              |
| `expiry`      | `number`        | Yes      | How long the session is valid for, in units specified by `period`.                                                                              |
| `period`      | `string` (enum) | Yes      | The time unit for session expiry (e.g., `minutes`, `hours`, `days`). Supported values are defined in the system’s `TokenPeriods` configuration. |

## Updating Sessions

You can update an existing session configuration by passing a `Partial<IProductSession>` object to the `update` function. The session is identified using its `tag` field.

### Example

```ts
const updatedDetails: Partial<IProductSession> = {
  tag: "session_name", // Required to locate the session
  expiry: 14, // Update the expiry time
  period: "days" // Update the expiry unit
};

await ductape.products.sessions.update(updatedDetails);
```

**Note:**
The `tag` field is required in the payload to identify which session you want to update. Any other provided fields will be merged into the existing session configuration.


## Fetching Sessions

You can fetch either all configured sessions for a product or a specific session using its `tag`.

### Fetch All Sessions

```ts
await ductape.products.sessions.fetchAll();
```

This returns an array of all session configurations associated with your product.

### Fetch a Specific Session

```ts
await ductape.products.sessions.fetch("session_name");
```

This retrieves the session configuration matching the provided `tag`.

## Summary

Sessions in Ductape offer a flexible and secure way to track user behaviors, manage access, and control session lifecycle through customized, encrypted tokens. You can:

* Define your own session schemas
* Set custom expiry times and identification selectors
* Dynamically update session configurations
* Easily query all or specific sessions within your product

This capability makes it straightforward to manage user sessions for authentication, analytics, or any custom workflow in your applications.
