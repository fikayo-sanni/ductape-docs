---
sidebar_position: 1
---

# Generating Session Tokens

Create session tokens to track user activity across your products using `ductape.sessions.start()`.

## Quick Example

```ts
import Ductape from '@ductape/sdk';

const ductape = new Ductape({
  accessKey: 'your-access-key',
});

const result = await ductape.sessions.start({
  tag: 'user-session',
  data: {
    userId: 'user_123',
    details: {
      username: 'johndoe',
      email: 'john@example.com',
    },
  },
});

console.log(result.token);        // Session token (format: tag:jwt)
console.log(result.refreshToken); // Refresh token
console.log(result.sessionId);    // Session ID
console.log(result.expiresAt);    // Expiration date
```

## How It Works

1. **product** - Your product's unique identifier
2. **env** - Which environment (`dev`, `staging`, `prd`)
3. **tag** - A label for this session type (e.g., `checkout-flow`)
4. **data** - User information and identifier

## Examples

### Basic session

```ts
const session = await ductape.sessions.start({
  tag: 'checkout-session',
  data: {
    userId: 'user_456',
    details: {
      email: 'jane@example.com'
    }
  }
});
```

### Session with rich user data

```ts
const session = await ductape.sessions.start({
  tag: 'user-session',
  data: {
    userId: 'user_789',
    details: {
      username: 'jsmith',
      email: 'jsmith@company.com',
      role: 'admin',
      plan: 'enterprise'
    }
  }
});
```

### Different sessions for different flows

```ts
// Checkout flow session
const checkoutSession = await ductape.sessions.start({
  tag: 'checkout-flow',
  data: { userId: 'user_123', details: { cartId: 'cart_456' } }
});

// Support chat session
const supportSession = await ductape.sessions.start({
  tag: 'support-chat',
  data: { userId: 'user_123', details: { ticketId: 'ticket_789' } }
});
```

## Response

```ts
{
  token: string;        // Format: "tag:jwt" (e.g. "user-session:eyJhbGci...")
  refreshToken: string;
  expiresAt?: Date;
  sessionId?: string;
}
```

| Field | Description |
|-------|-------------|
| `token` | Session token (tag:jwt); use in verify() or pass to messaging/storage when needed |
| `refreshToken` | Long-lived token to refresh or resume sessions |
| `expiresAt` | When the access token expires |
| `sessionId` | Unique session identifier |

## Best Practices

- **Store tokens securely** - Avoid exposing in logs or unencrypted storage
- **Use different tags** - Create separate sessions for different flows
- **Include identifiers** - Always provide a stable userId

---

## Reference

### Parameters

```ts
interface StartSessionInput {
  product: string;
  env: string;
  tag: string;
  data: Record<string, unknown>;  // Any JSON-serializable data (must match session schema)
  cache?: string;                 // Optional cache tag for idempotency
}
```

## See Also

* [Sessions Overview](./overview)
* [Refreshing Sessions](./refreshing)
* [Decrypting Sessions](./decrypting)
