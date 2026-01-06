---
sidebar_position: 4
---

# Fetching Session Users

Ductape allows you to retrieve users associated with a specific session in your product. This is useful for analytics, auditing, or managing user access and activity within sessions.

## Fetch All Users for a Session

To fetch all users associated with a particular session, use the `fetchUsers` method. This returns paginated results.

### Example

```ts
const result = await sessions.fetchUsers({
  product: "my-product",   // The tag of your product
  session: "user-session", // The tag of the session
  env: "production",       // Optional: filter by environment
  page: 1,                 // Page number (default: 1)
  limit: 20                // Number of users per page (default: 20)
});

console.log('Total users:', result.total);
console.log('Total pages:', result.totalPages);

for (const user of result.users) {
  console.log('User ID:', user.ductape_user_id);
  console.log('Identifier:', user.identifier);
  console.log('Last seen:', user.last_seen);
}
```

### Parameters

| Field     | Type     | Required | Description                                 |
|-----------|----------|----------|---------------------------------------------|
| `product` | string   | Yes      | The tag of your product.                    |
| `session` | string   | Yes      | The tag of the session to query users from. |
| `env`     | string   | No       | Filter by environment (e.g., 'production'). |
| `page`    | number   | No       | The page number for pagination (default: 1).|
| `limit`   | number   | No       | The number of users per page (default: 20). |

### Response

Returns a paginated result object:

```ts
{
  users: ISessionUser[];  // Array of user objects
  total: number;          // Total number of users
  page: number;           // Current page
  limit: number;          // Users per page
  totalPages: number;     // Total number of pages
}
```

Each user object includes:
- `_id` - MongoDB document ID
- `ductape_user_id` - Unique Ductape user identifier
- `product_tag` - The product tag
- `session_tag` - The session tag
- `identifier` - User identifier (from session selector)
- `env` - Environment
- `first_seen` - First session timestamp
- `last_seen` - Most recent activity timestamp
- `createdAt` - Record creation timestamp
- `updatedAt` - Record update timestamp

---

## Fetch a Specific User's Details

Get detailed information about a specific session user, including their session history:

```ts
const userDetails = await sessions.fetchUserDetails({
  product: "my-product",
  session: "user-session",
  identifier: "user@example.com", // The user's identifier
  env: "production"               // Optional
});

console.log('User ID:', userDetails.ductape_user_id);
console.log('Total sessions:', userDetails.totalSessions);
console.log('Active sessions:', userDetails.activeSessionsCount);

// View session history
for (const session of userDetails.sessions) {
  console.log('Session ID:', session.session_id);
  console.log('Started:', session.start_at);
  console.log('Expires:', session.end_at);
  console.log('Active:', session.active);
}
```

### Parameters

| Field        | Type     | Required | Description                    |
|--------------|----------|----------|--------------------------------|
| `product`    | string   | Yes      | The tag of your product.       |
| `session`    | string   | Yes      | The tag of the session.        |
| `identifier` | string   | Yes      | The user's unique identifier.  |
| `env`        | string   | No       | Filter by environment.         |

### Response

Returns the user object with additional session information:

```ts
{
  // All ISessionUser fields plus:
  sessions: IUserSessionInfo[];  // Array of session records
  totalSessions: number;         // Total number of sessions
  activeSessionsCount: number;   // Currently active sessions
}
```

Each session info object includes:
- `session_id` - Unique session identifier
- `start_at` - Session start timestamp
- `end_at` - Session expiry timestamp
- `active` - Whether the session is currently active

---

## Using the Ductape Class

You can also access these methods through the main Ductape class:

```ts
import Ductape from '@ductape/sdk';

const ductape = new Ductape({
  accessKey: 'your-access-key',
});

// Fetch users
const users = await ductape.products.sessions.users({
  session: "user-session",
  product: "my-product",
  page: 1,
  limit: 20
});

// Fetch specific user
const user = await ductape.products.sessions.user("ductape_user_id");
```

---

## See Also

- [Managing Sessions](./overview.md)
- [Session Activity & Dashboard](./activity-dashboard.md)