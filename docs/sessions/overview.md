---
sidebar_position: 3
---

# Sessions

Sessions let you track user behavior and manage authentication across your products using JWT-based tokens.

## Quick Example

```ts
import { SessionsService } from '@ductape/sdk';

const sessions = new SessionsService({
  workspace_id: 'your-workspace-id',
  public_key: 'your-public-key',
  user_id: 'your-user-id',
  token: 'your-token',
  env_type: 'prd',
});

// Create a session
const result = await sessions.create({
  product: 'my-product',
  env: 'production',
  tag: 'user-session',
  data: { userId: '123', email: 'user@example.com' },
});

console.log(result.token);        // JWT token
console.log(result.refreshToken); // Refresh token
console.log(result.sessionId);    // Session ID
```

## Using the Ductape Class

You can also use sessions through the main Ductape class:

```ts
import Ductape from '@ductape/sdk';

const ductape = new Ductape({
  workspace_id: 'your-workspace-id',
  public_key: 'your-public-key',
  user_id: 'your-user-id',
  token: 'your-token',
  env_type: 'prd',
});

// Start a session
const result = await ductape.sessions.start({
  product: 'my-product',
  env: 'production',
  tag: 'user-session',
  data: { userId: '123', email: 'user@example.com' },
});
```

---

## Creating a Session

Create a new session by providing user data that will be encrypted in the JWT:

```ts
const result = await sessions.create({
  product: 'my-product',
  env: 'production',
  tag: 'user-session',
  data: {
    userId: 'user_123',
    email: 'john@example.com',
    role: 'admin'
  },
});

// Returns
{
  token: 'eyJhbGciOi...',      // JWT access token
  refreshToken: 'encrypted...', // Refresh token for renewal
  expiresAt: Date,              // Token expiration date
  sessionId: 'uuid-v4'          // Unique session identifier
}
```

---

## Verifying a Session

Verify a session token and extract the stored data:

```ts
const verifyResult = await sessions.verify({
  product: 'my-product',
  env: 'production',
  tag: 'user-session',
  token: 'eyJhbGciOi...',
});

if (verifyResult.valid) {
  console.log('User ID:', verifyResult.data.userId);
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
const refreshResult = await sessions.refresh({
  product: 'my-product',
  env: 'production',
  tag: 'user-session',
  refreshToken: 'encrypted...',
});

// Returns new tokens
console.log(refreshResult.token);        // New JWT token
console.log(refreshResult.refreshToken); // New refresh token
console.log(refreshResult.sessionId);    // New session ID
```

---

## Revoking a Session

Invalidate a session by session ID or user identifier:

```ts
// Revoke by session ID
await sessions.revoke({
  product: 'my-product',
  env: 'production',
  tag: 'user-session',
  sessionId: 'session-uuid',
});

// Or revoke by user identifier
await sessions.revoke({
  product: 'my-product',
  env: 'production',
  tag: 'user-session',
  identifier: 'user_123',
});
```

---

## Listing Active Sessions

Get a paginated list of active sessions for a user:

```ts
const result = await sessions.list({
  product: 'my-product',
  env: 'production',
  tag: 'user-session',
  identifier: 'user_123',  // Optional: filter by user
  page: 1,
  limit: 10,
});

console.log('Total sessions:', result.total);
for (const session of result.sessions) {
  console.log('Session ID:', session.sessionId);
  console.log('Started at:', session.startAt);
  console.log('Expires at:', session.endAt);
  console.log('Active:', session.active);
}
```

---

## Defining Sessions with Code-First API

Define session schemas programmatically:

```ts
const sessionDef = await sessions.define({
  product: 'my-product',
  tag: 'checkout-session',
  name: 'Checkout Session',
  description: 'Session for checkout flow',
  handler: async (ctx) => {
    ctx.selector('userId');
    ctx.expiry(1, 'hours');
    ctx.schema({
      userId: { type: 'string', required: true },
      email: { type: 'string', required: true },
      cartId: { type: 'string', required: false },
    });
  },
});

// Register the session with a product
await sessions.register('my-product', sessionDef);
```

---

## Creating Session Configurations

Define what data your session should hold and how long it should last:

```ts
await ductape.sessions.create({
  name: 'Checkout Session',
  tag: 'checkout-session',
  description: 'Session for checkout flow',
  schema: {
    userId: 'user_456',
    details: {
      email: 'jane@example.com',
      cartId: 'cart_789'
    }
  },
  selector: '$Session{userId}',
  expiry: 1,
  period: 'hours'
});
```

### Session Fields

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Display name |
| `tag` | string | Unique identifier |
| `description` | string | Purpose of the session |
| `schema` | object | Data structure (encrypted in token) |
| `selector` | string | User identifier path (e.g., `$Session{userId}`) |
| `expiry` | number | Duration before expiration |
| `period` | string | Time unit (`seconds`, `minutes`, `hours`, `days`) |

---

## API Reference

### SessionsService Methods

| Method | Description |
|--------|-------------|
| `create(options)` | Create a new session and return tokens |
| `verify(options)` | Verify a session token |
| `refresh(options)` | Refresh an expired session |
| `revoke(options)` | Invalidate a session |
| `list(options)` | List active sessions |
| `define(options)` | Define a session schema (code-first) |
| `register(product, session)` | Register a defined session |

### Error Handling

```ts
import { SessionError } from '@ductape/sdk';

try {
  const result = await sessions.verify({ ... });
} catch (error) {
  if (error instanceof SessionError) {
    console.log('Error code:', error.code);
    console.log('Message:', error.message);
    // Codes: SESSION_NOT_FOUND, ENV_NOT_FOUND, JWT_NOT_AVAILABLE,
    //        CREATE_FAILED, VERIFY_FAILED, REFRESH_FAILED, etc.
  }
}
```

---

## See Also

* [Generating Session Tokens](./use)
* [Refreshing Sessions](./refreshing)
* [Decrypting Sessions](./decrypting)
* [Fetching Session Users](./fetching-users)
