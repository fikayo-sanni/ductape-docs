---
sidebar_position: 2
---

# Fetching Cached Values

Retrieve previously stored values from your caches using `ductape.cache.values()`.

## Quick Example

```ts
const values = await ductape.cache.values({
  cache_tag: 'api-responses',
  product: 'my-app'
});

console.log(values);
```

## How It Works

Query cached data by specifying filters like cache tag, component tag, or product tag. This is useful for reusing cached API responses or computed values across your application.

## Examples

### Fetch all values from a cache

```ts
const values = await ductape.cache.values({
  cache_tag: 'user-data',
  product: 'dashboard'
});
```

### Filter by component

```ts
const values = await ductape.cache.values({
  cache_tag: 'api-responses',
  component_tag: 'fetch-user',
  component_type: 'action',
  product: 'my-app'
});
```

### Filter non-expired values only

```ts
const values = await ductape.cache.values({
  cache_tag: 'temp-data',
  product: 'my-app',
  expiry: new Date()
});
```

## Response

```json
[
  {
    "key": "user_123_result",
    "value": "{\"score\":88}",
    "cache_tag": "api-responses",
    "product": "my-app",
    "component_tag": "score_action",
    "component_type": "action",
    "expiry": "2025-05-01T00:00:00.000Z"
  }
]
```

| Field | Description |
|-------|-------------|
| `key` | Unique key for this cached value |
| `value` | The cached value (typically stringified JSON) |
| `cache_tag` | Cache this value belongs to |
| `product` | Product where this value was stored |
| `component_tag` | Component that stored the value |
| `component_type` | Type of component (`action`, `event`, etc.) |
| `expiry` | Expiration date, if set |

---

## Reference

### Filter Options

```ts
interface FetchRemoteCachePayload {
  cache_tag: string;
  product: string;
  component_tag?: string;
  component_type?: string;
  expiry?: Date;
}
```

## See Also

* [Caching Overview](./overview)
* [Setting Up Caches](./setup)
