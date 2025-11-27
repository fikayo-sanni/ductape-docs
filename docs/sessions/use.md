---
sidebar_position: 1
---

# Generating Session Tokens

Create session tokens to track user activity across your products using `ductape.sessions.create()`.

## Quick Example

```ts
const result = await ductape.sessions.create({
  product: 'my-app',
  env: 'prd',
  tag: 'user-session',
  data: {
    userId: 'user_123',
    details: {
      username: 'johndoe',
      email: 'john@example.com'
    }
  }
});

console.log(result.token);        // Session token
console.log(result.refreshToken); // Refresh token
```

## How It Works

1. **product** - Your product's unique identifier
2. **env** - Which environment (`dev`, `staging`, `prd`)
3. **tag** - A label for this session type (e.g., `checkout-flow`)
4. **data** - User information and identifier

## Examples

### Basic session

```ts
const session = await ductape.sessions.create({
  product: 'ecommerce',
  env: 'prd',
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
const session = await ductape.sessions.create({
  product: 'dashboard',
  env: 'prd',
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
const checkoutSession = await ductape.sessions.create({
  product: 'marketplace',
  env: 'prd',
  tag: 'checkout-flow',
  data: { userId: 'user_123', details: { cartId: 'cart_456' } }
});

// Support chat session
const supportSession = await ductape.sessions.create({
  product: 'marketplace',
  env: 'prd',
  tag: 'support-chat',
  data: { userId: 'user_123', details: { ticketId: 'ticket_789' } }
});
```

## Response

```json
{
  "token": "ejyui11919102393:abc123xyz456...",
  "refreshToken": "eueywuwjwmwmw:zyx456cba321..."
}
```

| Field | Description |
|-------|-------------|
| `token` | Short-lived token for the current session |
| `refreshToken` | Long-lived token to refresh or resume sessions |

## Best Practices

- **Store tokens securely** - Avoid exposing in logs or unencrypted storage
- **Use different tags** - Create separate sessions for different flows
- **Include identifiers** - Always provide a stable userId

---

## Reference

### Parameters

```ts
interface CreateSessionInput {
  product: string;
  env: string;
  tag: string;
  data: {
    userId: string;
    details: Record<string, unknown>;
  };
}
```

## See Also

* [Sessions Overview](./overview)
* [Refreshing Sessions](./refreshing)
* [Decrypting Sessions](./decrypting)
