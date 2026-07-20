---
sidebar_position: 3
---

# Sessions

Sessions let you track user behavior and manage authentication across your products using JWT-based tokens.

## Frontend clients (publishable key)

When using **@ductape/client**, **@ductape/react**, or **@ductape/vue** with a **publishable key** (frontend/BFF flow):

- **Session in params:** Every request (e.g. `storage.upload`, `databases.query`, `actions.run`) must include a `session` property in the options object. The value is a session token issued by **your backend**. The proxy rejects requests that omit `session` or pass an empty value.
- **Session APIs are backend-only:** The client SDKs do **not** allow calling session methods (`start`, `verify`, `refresh`, `revoke`, `revokeAll`, `listActive`, `getInfo`, `enableAutoRefresh`) when using a publishable key—those methods throw. Sessions must be started, verified, and revoked **only on the backend**. Your backend returns a session token to the frontend (e.g. after login); the frontend then passes that token as `session` in each Ductape request.

See [Frontend access key strategies](/docs/FRONTEND_ACCESS_KEY_STRATEGIES) for the full security model.

## Quick Example

Use the **sessions** API on the Ductape instance. Initialize with your access key:

```ts
import Ductape from '@ductape/sdk';

const ductape = new Ductape({
  accessKey: 'your-access-key',
});

// Start a session (creates tokens)
const result = await ductape.sessions.start({
  tag: 'user-session',
  data: { userId: '123', email: 'user@example.com' },
});

console.log(result.token);        // JWT token (format: tag:jwt)
console.log(result.refreshToken);  // Refresh token
console.log(result.sessionId);     // Session ID
console.log(result.expiresAt);    // Expiration date
```

---

## Starting a Session

Start a new session to get tokens. The session **tag** must match a session configuration you created for the product.

```ts
const result = await ductape.sessions.start({
  tag: 'user-session',
  data: {
    userId: 'user_123',
    email: 'john@example.com',
    role: 'admin',
  },
});

// Returns
// { token: 'tag:eyJhbGciOi...', refreshToken: '...', expiresAt?: Date, sessionId?: string }
```

---

## Verifying a Session

Verify a session token and read the stored data:

```ts
const verifyResult = await ductape.sessions.verify({
  tag: 'user-session',
  token: result.token, // or 'tag:jwt' string
});

if (verifyResult.valid) {
  console.log('User data:', verifyResult.data);
  console.log('Session ID:', verifyResult.sessionId);
  console.log('Expires at:', verifyResult.expiresAt);
} else {
  console.log('Invalid or expired token');
}
```

---

## Refreshing a Session

Renew an expired session using the refresh token:

```ts
const refreshResult = await ductape.sessions.refresh({
  tag: 'user-session',
  refreshToken: result.refreshToken,
});

// Returns new tokens (same shape as start)
console.log(refreshResult.token);
console.log(refreshResult.refreshToken);
console.log(refreshResult.sessionId);
```

---

## Revoking a Session

Invalidate a session by session ID or user identifier:

```ts
// Revoke by session ID
await ductape.sessions.revoke({
  tag: 'user-session',
  sessionId: 'session-uuid',
});

// Or revoke by user identifier (from session selector)
await ductape.sessions.revoke({
  tag: 'user-session',
  identifier: 'user_123',
});
```

---

## Listing Active Sessions

Get a paginated list of active (runtime) sessions:

```ts
const result = await ductape.sessions.listActive({
  tag: 'user-session',
  identifier: 'user_123',  // Optional: filter by user
  page: 1,
  limit: 10,
});

console.log('Total:', result.total);
for (const session of result.sessions) {
  console.log('Session ID:', session.sessionId);
  console.log('Started at:', session.startAt);
  console.log('Expires at:', session.endAt);
  console.log('Active:', session.active);
}
```

---

## Creating Session Configurations

Define what data a session holds and how long it lasts. This is **product-level config**, not starting a session. Use `sessions.create(product, payload)`:

```ts
await ductape.sessions.create('my-product', {
  name: 'Checkout Session',
  tag: 'checkout-session',
  description: 'Session for checkout flow',
  selector: '$Session{userId}',  // must be "$Session{fieldName}" — plain "userId" is rejected
  expiry: 1,
  period: 'hours',
  schema: {
    // Sample data — actual example values, NOT type declarations
    // The value at the selector path must be a primitive (string/number/boolean)
    userId: 'user_123',
    email: 'user@example.com',
    cartId: 'cart_456',
  },
});
```

### Session config fields

| Field         | Type   | Description                                      |
|---------------|--------|--------------------------------------------------|
| `name`        | string | Display name                                     |
| `tag`         | string | Unique identifier (used in start/verify/refresh) |
| `description` | string | Purpose of the session                          |
| `selector`    | string | Primary identifier path in `$Session{fieldName}` format (e.g. `'$Session{userId}'`). The field at this path in `schema` must be a primitive. Used as the lookup key for revoke, list, and analytics. |
| `expiry`      | number | Duration before expiration                       |
| `period`      | string | Time unit: `seconds`, `minutes`, `hours`, `days` |
| `schema`      | object | **Sample data** showing example values that will be embedded in the JWT. Each field must have a primitive value at the selector path. Actual runtime values are passed via `sessions.start`. |

### Listing and fetching session configs

```ts
// List all session configs for a product
const configs = await ductape.sessions.list('my-product');

// Fetch one by tag
const config = await ductape.sessions.fetch('my-product', 'user-session');

// Update
await ductape.sessions.update('my-product', 'user-session', { expiry: 2, period: 'hours' });

// Delete
await ductape.sessions.delete('my-product', 'user-session');
```

---

## API Reference

### ductape.sessions methods

| Method | Description |
|--------|-------------|
| `start(data)` | Start a session; returns token, refreshToken, sessionId, expiresAt |
| `verify(data)` | Verify a token; returns `{ valid, data?, sessionId?, expiresAt? }` |
| `refresh(data)` | Refresh using refreshToken; returns new tokens |
| `revoke(data)` | Invalidate a session (sessionId or identifier) |
| `listActive(data)` | List active sessions with pagination |
| `create(product, payload)` | Create a session configuration |
| `list(product)` | List session configs for a product |
| `fetch(product, tag)` | Fetch a session config by tag |
| `update(product, tag, payload)` | Update a session config |
| `delete(product, tag)` | Delete a session config |
| `fetchUsers(data)` | Paginated session users |
| `fetchUserDetails(data)` | Detailed user info and session history |
| `fetchDashboard(data)` | Dashboard metrics for a session |
| `users(data)` | Fetch users for a session (alternative) |

### Error handling

```ts
import { SessionError } from '@ductape/sdk';

try {
  const result = await ductape.sessions.verify({ ... });
} catch (error) {
  if (error instanceof SessionError) {
    console.log('Error code:', error.code);
    console.log('Message:', error.message);
  }
}
```

---

## See Also

* [Generating Session Tokens](./use)
* [Refreshing Sessions](./refreshing)
* [Decrypting Sessions](./decrypting)
* [Fetching Session Users](./fetching-users)
* [Activity & Dashboard](./activity-dashboard)
