---
sidebar_position: 1
---

# Processing Quotas

Enforce usage limits and track consumption using `ductape.quota.run()`.

## Quick Example

```ts
// Check if user has remaining API calls
const result = await ductape.quota.run({
  env: 'prd',
  product_tag: 'my-app',
  quota_tag: 'api-requests',
  action: 'check'
});
```

## How It Works

1. **env** - Which environment to run in (`dev`, `staging`, `prd`)
2. **product_tag** - Your product's unique identifier
3. **quota_tag** - The quota to check or update
4. **action** - What to do: `check`, `increment`, or `reset`

## Examples

### Check quota

```ts
const quota = await ductape.quota.run({
  env: 'prd',
  product_tag: 'billing',
  quota_tag: 'monthly-exports',
  action: 'check'
});
```

### Increment usage

```ts
await ductape.quota.run({
  env: 'prd',
  product_tag: 'billing',
  quota_tag: 'api-requests',
  action: 'increment',
  amount: 1
});
```

### Increment by custom amount

```ts
await ductape.quota.run({
  env: 'prd',
  product_tag: 'storage',
  quota_tag: 'storage-bytes',
  action: 'increment',
  amount: 1024 * 1024  // 1MB
});
```

### Reset quota

```ts
await ductape.quota.run({
  env: 'prd',
  product_tag: 'billing',
  quota_tag: 'monthly-exports',
  action: 'reset'
});
```

### With session context

```ts
await ductape.quota.run({
  env: 'prd',
  product_tag: 'api-gateway',
  quota_tag: 'user-api-calls',
  action: 'increment',
  amount: 1,
  session: {
    tag: 'user-session',
    token: 'eyJhbGciOi...'
  }
});
```

## Actions

| Action | What it does |
|--------|--------------|
| `check` | Returns current usage and remaining quota |
| `increment` | Increases usage by `amount` (default: 1) |
| `reset` | Resets usage back to zero |

---

## Reference

### IQuotaProcessorInput

```ts
interface IQuotaProcessorInput {
  env: string;
  product_tag: string;
  quota_tag: string;
  action: 'check' | 'increment' | 'reset';
  amount?: number;
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
* [Fallbacks](../fallbacks/overview)
