---
sidebar_position: 3
---

# Managing Cache Values

The `CacheService` provides comprehensive methods for managing cache values programmatically, including fetching, setting, and clearing cache entries.

## Quick Start

```ts
import Ductape from '@ductape/sdk';

const {cache} = new Ductape({
  workspace_id: 'your-workspace-id',
  private_key: 'your-private-key',
  user_id: 'your-user-id',
});

// Fetch cache values
const values = await cache.fetchValues({
  product: 'my-product',
  cache: 'user-cache',
});

// Get a specific value
const value = await cache.get({ key: 'user:123' });

// Set a value
await cache.set({
  product: 'my-product',
  cache: 'user-cache',
  key: 'user:123',
  value: JSON.stringify({ name: 'John' }),
});

// Clear a value
await cache.clear({ key: 'user:123' });
```

---

## Fetching Cache Values

Retrieve paginated cache values with optional filtering by environment:

```ts
const result = await cache.fetchValues({
  product: 'my-product',
  cache: 'user-cache',
  env: 'production',    // Optional: filter by environment
  page: 1,              // Page number (default: 1)
  limit: 20,            // Values per page (default: 20)
});

console.log('Total values:', result.total);
console.log('Total pages:', result.totalPages);

for (const value of result.values) {
  console.log('Key:', value.key);
  console.log('Value:', value.value);
  console.log('Expires:', value.expiry);
}
```

### Parameters

| Field     | Type   | Required | Description                        |
|-----------|--------|----------|------------------------------------|
| `product` | string | Yes      | The tag of your product            |
| `cache`   | string | Yes      | The tag of the cache               |
| `env`     | string | No       | Filter by environment              |
| `page`    | number | No       | Page number (default: 1)           |
| `limit`   | number | No       | Values per page (default: 20)      |

### Response

```ts
{
  values: ICacheValue[];   // Array of cache values
  total: number;           // Total number of values
  page: number;            // Current page
  limit: number;           // Values per page
  totalPages: number;      // Total number of pages
}
```

---

## Getting a Single Value

Retrieve a specific cache value by its key:

```ts
const value = await cache.get({ key: 'user:123' });

if (value) {
  console.log('Found:', value.key);
  console.log('Data:', JSON.parse(value.value));
} else {
  console.log('Value not found');
}
```

### Parameters

| Field | Type   | Required | Description           |
|-------|--------|----------|-----------------------|
| `key` | string | Yes      | The cache entry key   |

### Response

Returns `ICacheValue | null`:

```ts
{
  _id: string;           // Unique ID
  key: string;           // Cache key
  value: string;         // Cached value (stringified)
  cache_tag: string;     // Cache tag
  product_tag: string;   // Product tag
  component_tag: string; // Component tag
  component_type: string;// Component type
  expiry?: Date;         // Expiration date (if set)
  createdAt: Date;       // Creation timestamp
  updatedAt: Date;       // Last update timestamp
}
```

---

## Setting Cache Values

Store a value in the cache:

```ts
await cache.set({
  product: 'my-product',
  cache: 'user-cache',
  key: 'user:123',
  value: JSON.stringify({ name: 'John', email: 'john@example.com' }),
  expiry: new Date(Date.now() + 3600000), // 1 hour from now
});
```

### Parameters

| Field          | Type   | Required | Description                           |
|----------------|--------|----------|---------------------------------------|
| `product`      | string | Yes      | The tag of your product               |
| `cache`        | string | Yes      | The tag of the cache                  |
| `key`          | string | Yes      | Unique key for this entry             |
| `value`        | string | Yes      | The value to cache (typically JSON)   |
| `componentTag` | string | No       | Component tag (defaults to cache tag) |
| `componentType`| string | No       | Component type (defaults to 'cache')  |
| `expiry`       | Date   | No       | Expiration date                       |

### Response

Returns `boolean` indicating success.

---

## Clearing Cache Values

### Clear a Single Value

Remove a specific cache entry by key:

```ts
const cleared = await cache.clear({ key: 'user:123' });
console.log('Cleared:', cleared);
```

### Clear All Values

Remove all cache values for a product/cache combination:

```ts
const result = await cache.clearAll({
  product: 'my-product',
  cache: 'user-cache',
  env: 'production',  // Optional: filter by environment
});

console.log('Cleared', result.cleared, 'values');
```

---

## Fetching Dashboard Metrics

Get comprehensive metrics about your cache:

```ts
const dashboard = await cache.fetchDashboard({
  product: 'my-product',
  cache: 'user-cache',
  env: 'production',  // Optional
});

console.log('Total values:', dashboard.totalValues);
console.log('Active values:', dashboard.activeValues);
console.log('Expired values:', dashboard.expiredValues);
console.log('Total size:', dashboard.totalSize, 'bytes');
```

### Response

```ts
{
  totalValues: number;   // Total number of cached values
  activeValues: number;  // Non-expired values
  expiredValues: number; // Expired values
  totalSize: number;     // Total size in bytes
}
```

---

## Complete Example

Here's a complete example showing how to manage cache values:

```ts
import { CacheService } from '@ductape/sdk';

const cache = new CacheService({
  workspace_id: 'your-workspace-id',
  public_key: 'your-public-key',
  user_id: 'your-user-id',
  token: 'your-token',
  env_type: 'prd',
});

async function manageCacheValues() {
  const product = 'my-product';
  const cacheTag = 'user-cache';

  // Store some values
  await cache.set({
    product,
    cache: cacheTag,
    key: 'user:1',
    value: JSON.stringify({ name: 'Alice', role: 'admin' }),
    expiry: new Date(Date.now() + 86400000), // 24 hours
  });

  await cache.set({
    product,
    cache: cacheTag,
    key: 'user:2',
    value: JSON.stringify({ name: 'Bob', role: 'user' }),
    expiry: new Date(Date.now() + 86400000),
  });

  // Get dashboard metrics
  const dashboard = await cache.fetchDashboard({ product, cache: cacheTag });
  console.log('Cache Stats:', dashboard);

  // Fetch all values
  const result = await cache.fetchValues({ product, cache: cacheTag });
  console.log('Total values:', result.total);

  // Get a specific value
  const user = await cache.get({ key: 'user:1' });
  if (user) {
    console.log('User 1:', JSON.parse(user.value));
  }

  // Clear a value
  await cache.clear({ key: 'user:2' });

  // Clear all values
  const cleared = await cache.clearAll({ product, cache: cacheTag });
  console.log('Cleared', cleared.cleared, 'values');
}

manageCacheValues();
```

---

## Error Handling

All cache methods throw `CacheError` on failure:

```ts
import { CacheService, CacheError } from '@ductape/sdk';

try {
  const values = await cache.fetchValues({
    product: 'my-product',
    cache: 'user-cache',
  });
} catch (error) {
  if (error instanceof CacheError) {
    console.log('Error code:', error.code);
    console.log('Message:', error.message);
    // Codes: FETCH_VALUES_FAILED, FETCH_DASHBOARD_FAILED,
    //        GET_VALUE_FAILED, SET_VALUE_FAILED,
    //        CLEAR_VALUE_FAILED, CLEAR_VALUES_FAILED
  }
}
```

---

## API Reference

### CacheService Methods

| Method              | Description                              |
|---------------------|------------------------------------------|
| `fetchValues()`     | Get paginated cache values               |
| `fetchDashboard()`  | Get cache metrics                        |
| `get()`             | Get a specific value by key              |
| `set()`             | Store a value in the cache               |
| `clear()`           | Clear a single value by key              |
| `clearAll()`        | Clear all values for a product/cache     |

### TypeScript Interfaces

```ts
interface IFetchCacheValuesOptions {
  product: string;
  cache: string;
  env?: string;
  page?: number;
  limit?: number;
}

interface IFetchCacheDashboardOptions {
  product: string;
  cache: string;
  env?: string;
}

interface ISetCacheValueOptions {
  product: string;
  cache: string;
  key: string;
  value: string;
  componentTag?: string;
  componentType?: string;
  expiry?: Date;
}

interface IClearCacheValueOptions {
  key: string;
}

interface IClearCacheValuesOptions {
  product: string;
  cache: string;
  env?: string;
}
```

---

## See Also

- [Caching Overview](./overview)
- [Setting Up Caches](./setup)
- [Fetching Cached Values](./values)
