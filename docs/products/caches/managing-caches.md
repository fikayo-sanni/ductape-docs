---
sidebar_position: 1
---

# Setting Up Caches

Caches allow you to locally store and reuse values from repeated events—such as API calls, database reads, or event publishing. This helps reduce the overhead of making remote calls during execution.

## Creating a Cache

To create a new cache entry, use the `create` function from the `product.cache` interface:

```ts
import ductape from './ductapeClient';
import { IProductCache } from '@ductape/sdk/dist/types';

const details: IProductCache = {
  name: 'Example Cache',              // Name of the cache
  description: 'Stores temporary API responses', // Description of what it stores
  tag: 'example_cache',               // Unique cache identifier
  expiry: 60000                       // Expiry time in milliseconds
};

await ductape.product.cache.create(details);
```

| Field        | Type                   | Description                                                |
|--------------|------------------------|------------------------------------------------------------|
| `name`       | `string`               | The name of the cache entry.                              |
| `description`| `string`               | A short description of what the cache is used for.         |
| `tag`        | `string`               | A unique identifier for the cache entry.                   |
| `expiry`     | `number` (milliseconds)| The expiration time before the cache becomes invalid.      |

## Updating a Cache

To update an existing cache entry, use the `update` function. Provide the `tag` of the cache you want to update and the new data:

```ts
const tag = 'example_cache';
const data: Partial<IProductCache> = {
  name: 'Updated Cache Name',
  description: 'Updated cache description',
  expiry: 120000
};

await ductape.product.cache.update(tag, data);
```

All fields in the update payload are optional.

## Fetching Caches

To retrieve all cache entries:

```ts
const caches = await ductape.product.cache.fetchAll();
```

This returns an array of all caches associated with your product.

To fetch a specific cache by its `tag`:

```ts
const tag = 'example_cache';
const cache = await ductape.product.cache.fetch(tag);
```

This returns the cache entry associated with the given tag.