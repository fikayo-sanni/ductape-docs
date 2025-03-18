---
sidebar_position: 1
---

# Caches

Caches allow you to locally store and reuse values from repeated events, such as API calls, database reads, and event publishing. This reduces the overhead of constantly making remote calls to look up values during execution.

## Creating Caches

To create a cache entry, use the `create` function of the `product.cache` interface:

```typescript
import ductape from './ductapeClient'
import { IProductCache } from "ductape-sdk/dist/types";

const details: IProductCache = {
    name: 'Example Cache',       // name of cache
    description: 'Stores temporary API responses', // description of the cache entry
    tag: 'example_cache',        // unique cache identifier
    expiry: 60000                // expiry time in milliseconds
};
await ductape.product.cache.create(details);
```

| Field        | Type                   | Description                                              |
|-------------|------------------------|----------------------------------------------------------|
| `name`      | `string`               | The name of the cache entry for identification.         |
| `description` | `string`               | A brief description of what the cache entry is used for. |
| `tag`       | `string`               | A unique identifier for the cache entry.                |
| `expiry`    | `number` (milliseconds)| The expiration time in milliseconds before it expires.  |

## Updating Caches

To update an existing cache entry, use the `update` function, providing the cache `tag` and the updated details:

```typescript
const tag = 'example_cache';
const data: Partial<IProductCache> = {
    name: 'Updated Cache Name', // optional updated name
    description: 'Updated cache description', // optional updated description
    expiry: 120000              // optional updated expiry
};
await ductape.product.cache.update(tag, data);
```

## Fetching Caches

To retrieve all cache entries, use the `fetchAll` function:

```typescript
const caches = await ductape.product.cache.fetchAll(); // returns an array of all cache entries
```

To fetch a specific cache entry, use the `fetch` function with the cache `tag`:

```typescript
const tag = 'example_cache';
const cache = await ductape.product.cache.fetch(tag); // retrieves a specific cache entry by tag
```

These functions provide flexibility for creating, updating, and managing cache storage in your Ductape applications.

