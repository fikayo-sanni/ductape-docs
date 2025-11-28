---
sidebar_position: 1
---

# Caching

Store and reuse values from API calls, database reads, and other operations.

## Quick Example

```ts
await ductape.cache.create({
  name: 'API Responses',
  tag: 'api-responses',
  description: 'Cache for external API calls',
  expiry: 60000  // 1 minute in milliseconds
});
```

## Creating a Cache

```ts
await ductape.cache.create({
  name: 'User Data Cache',
  tag: 'user-data',
  description: 'Caches user profile information',
  expiry: 300000  // 5 minutes
});
```

### Cache Fields

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Display name |
| `tag` | string | Unique identifier |
| `description` | string | What the cache stores |
| `expiry` | number | TTL in milliseconds |

## Updating a Cache

```ts
await ductape.cache.update('user-data', {
  name: 'Updated Cache Name',
  expiry: 600000  // 10 minutes
});
```

## Fetching Caches

```ts
// Get all caches
const caches = await ductape.cache.fetchAll();

// Get specific cache
const cache = await ductape.cache.fetch('user-data');
```

## Using Cache in Processors

Add the `cache` parameter when calling processors:

```ts
await ductape.action.run({
  env: 'prd',
  product: 'my-app',
  app: 'api-service',
  event: 'get_user',
  input: { body: { userId: '123' } },
  cache: 'user-data'  // Uses the cache
});
```

## See Also

* [Fetching Cached Values](./values)
* [Setting Up Caches](./setup)
