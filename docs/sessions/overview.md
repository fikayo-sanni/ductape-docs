---
sidebar_position: 3
---

# Sessions

Sessions let you track user behavior and manage authentication across your products.

## Quick Example

```ts
// Create a session configuration
await ductape.product.sessions.create({
  name: 'User Session',
  tag: 'user-session',
  description: 'Main user authentication session',
  schema: {
    userId: 'user_123',
    details: {
      username: 'johndoe',
      email: 'john@example.com'
    }
  },
  selector: '$Session{userId}',
  expiry: 7,
  period: 'days'
});
```

## Creating a Session Type

Define what data your session should hold and how long it should last:

```ts
await ductape.product.sessions.create({
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
| `period` | string | Time unit (`minutes`, `hours`, `days`) |

## Updating a Session

```ts
await ductape.product.sessions.update({
  tag: 'user-session',
  expiry: 14,
  period: 'days'
});
```

## Fetching Sessions

```ts
// Get all session types
const sessions = await ductape.product.sessions.fetchAll();

// Get specific session type
const session = await ductape.product.sessions.fetch('user-session');
```

## What You Can Do With Sessions

- Define custom session schemas
- Set custom expiry times
- Track user behavior across your product
- Manage authentication and authorization

## See Also

* [Generating Session Tokens](./use)
* [Refreshing Sessions](./refreshing)
* [Decrypting Sessions](./decrypting)
* [Fetching Session Users](./fetching-users)
