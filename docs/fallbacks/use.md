---
sidebar_position: 1
---

# Processing Fallbacks

Handle failures gracefully with backup logic using `ductape.fallback.run()`.

## Quick Example

```ts
// Trigger a fallback when payment fails
await ductape.fallback.run({
  env: 'prd',
  product: 'my-app',
  fallback_tag: 'payment-failure',
  action: 'trigger',
  input: {
    orderId: '12345',
    reason: 'timeout'
  }
});
```

## How It Works

1. **env** - Which environment to run in (`dev`, `staging`, `prd`)
2. **product** - Your product's unique identifier
3. **fallback_tag** - The fallback logic to use
4. **action** - What to do: `trigger`, `update`, or `reset`

## Examples

### Trigger a fallback

```ts
await ductape.fallback.run({
  env: 'prd',
  product: 'payments',
  fallback_tag: 'payment-failure',
  action: 'trigger',
  input: {
    orderId: '12345',
    reason: 'gateway_timeout',
    attemptedProvider: 'stripe'
  }
});
```

### Fallback for API failures

```ts
await ductape.fallback.run({
  env: 'prd',
  product: 'notifications',
  fallback_tag: 'sms-failure',
  action: 'trigger',
  input: {
    userId: 'user_123',
    message: 'Your order has shipped',
    originalProvider: 'twilio'
  }
});
```

### Update fallback configuration

```ts
await ductape.fallback.run({
  env: 'prd',
  product: 'payments',
  fallback_tag: 'payment-failure',
  action: 'update',
  input: {
    maxRetries: 3,
    fallbackProvider: 'paypal'
  }
});
```

### Reset fallback state

```ts
await ductape.fallback.run({
  env: 'prd',
  product: 'payments',
  fallback_tag: 'payment-failure',
  action: 'reset'
});
```

### With session context

```ts
await ductape.fallback.run({
  env: 'prd',
  product: 'checkout',
  fallback_tag: 'checkout-failure',
  action: 'trigger',
  input: {
    cartId: 'cart_456',
    step: 'payment'
  },
  session: {
    tag: 'user-session',
    token: 'eyJhbGciOi...'
  }
});
```

## Actions

| Action | What it does |
|--------|--------------|
| `trigger` | Executes the fallback logic with provided input |
| `update` | Updates the fallback configuration |
| `reset` | Resets the fallback state |

---

## Reference

### IFallbackProcessorInput

```ts
interface IFallbackProcessorInput {
  env: string;
  product: string;
  fallback_tag: string;
  action: 'trigger' | 'update' | 'reset';
  input?: Record<string, unknown>;
  session?: ISession;
  cache?: string;
}
```

### ISession

```ts
interface ISession {
  tag: string;   // Session identifier
  token: string; // Session token (e.g., JWT)
}
```

## See Also

* [Sessions](../sessions/overview)
* [Quotas](../quotas/overview)
