---
sidebar_position: 4
---

# Running Features

Execute your workflow features using `ductape.features.run()`.

## Quick Example

```ts
const result = await ductape.features.run({
  env: 'prd',
  product: 'my-app',
  feature_tag: 'process_order',
  input: {
    orderId: '12345',
    customerId: 'cust_789'
  }
});

console.log(result); // Output from your feature workflow
```

## How It Works

Features are pre-defined workflows that chain multiple operations together. When you run a feature:

1. **env** - Which environment to run in (`dev`, `staging`, `prd`)
2. **product** - Your product's unique identifier
3. **feature_tag** - The feature workflow to execute
4. **input** - Data to pass into the feature

## Examples

### Simple feature with input

```ts
await ductape.features.run({
  env: 'prd',
  product: 'ecommerce',
  feature_tag: 'checkout_flow',
  input: {
    cartId: 'cart_123',
    paymentMethod: 'card',
    shippingAddress: '123 Main St'
  }
});
```

### Feature with no input

```ts
await ductape.features.run({
  env: 'dev',
  product: 'analytics',
  feature_tag: 'generate_daily_report',
  input: {}
});
```

### With session data injection

Use `$Session{key}{field}` to inject user-specific values:

```ts
await ductape.features.run({
  env: 'prd',
  product: 'marketplace',
  feature_tag: 'create_listing',
  input: {
    title: 'Vintage Watch',
    price: 250,
    sellerId: '$Session{user}{id}',
    sellerEmail: '$Session{user}{email}'
  },
  session: {
    tag: 'user-session',
    token: 'eyJhbGciOi...'
  }
});
```

### With caching

Cache results to avoid re-running expensive operations:

```ts
await ductape.features.run({
  env: 'prd',
  product: 'dashboard',
  feature_tag: 'get_user_stats',
  input: { userId: '123' },
  cache: 'user-stats-123'
});
```

## What Features Can Do

A single feature can orchestrate:
- API calls to external services
- Database operations
- Sending notifications
- Uploading files to storage
- Publishing to message queues
- Running other features

All defined in one reusable workflow.

## Optional Parameters

| Parameter | What it does |
|-----------|--------------|
| `cache` | Cache tag to store results for reuse |
| `session` | Session object for dynamic value injection |

---

## Reference

### IFeatureProcessorInput

```ts
interface IFeatureProcessorInput {
  env: string;
  product: string;
  feature_tag: string;
  input: Record<string, unknown>;
  cache?: string;
  session?: ISession;
}
```

### ISession

```ts
interface ISession {
  tag: string;   // Session identifier
  token: string; // Encrypted session token (e.g., JWT)
}
```

## See Also

- [Features Overview](./overview) - Create and configure features
- [Defining Inputs](./inputs) - Input validation and types
- [Defining Outputs](./output) - Map results to your response
- [Sessions](../sessions/overview) - User session management
