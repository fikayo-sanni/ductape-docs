---
sidebar_position: 2
---

# Fetching Cached Values

You can retrieve previously stored values from a specific cache using the `values` function under `ductape.product.caches`.

This is useful when you want to reuse cached data across components or environments, such as responses from API calls or computed values from earlier events.

### Usage

```ts
import ductape from './ductapeClient';
import { FetchRemoteCachePayload } from '@ductape/sdk/dist/types';

const filters: FetchRemoteCachePayload = {
  cache_tag: 'example_cache',
  component_tag: 'my_component',
  component_type: 'action',
  product_tag: 'my_product',
};

const values = await ductape.product.caches.values(filters);
```

### Filter Options

| Field            | Type      | Description                                                                 |
|------------------|-----------|-----------------------------------------------------------------------------|
| `cache_tag`      | `string`  | The tag of the cache to query values from.                                  |
| `component_tag`  | `string`  | The tag of the component that stored the value.                             |
| `component_type` | `string`  | The type of component (`action`, `event`, `condition`, etc).                |
| `product_tag`    | `string`  | The tag of the product (used when working across multiple products).        |
| `expiry`         | `Date`    | Optional date to filter only non-expired values.                            |

### Sample Response

```json
[
  {
    "key": "user_123_result",
    "value": "{\"score\":88}",
    "cache_tag": "example_cache",
    "product_tag": "my_product",
    "component_tag": "score_action",
    "component_type": "action",
    "expiry": "2025-05-01T00:00:00.000Z"
  },
  {
    "key": "user_124_result",
    "value": "{\"score\":92}",
    "cache_tag": "example_cache",
    "product_tag": "my_product",
    "component_tag": "score_action",
    "component_type": "action",
    "expiry": "2025-05-01T00:00:00.000Z"
  }
]
```

### Response Fields

| Field             | Type      | Description                                                               |
|-------------------|-----------|---------------------------------------------------------------------------|
| `key`             | `string`  | The unique key for this cached value.                                     |
| `value`           | `string`  | The cached value (typically a stringified object).                        |
| `cache_tag`       | `string`  | The tag of the cache this value belongs to.                               |
| `product_tag`     | `string`  | The tag of the product where this value was generated.                    |
| `component_tag`   | `string`  | The tag of the component (e.g., action or event) that stored the value.   |
| `component_type`  | `string`  | The type of component that generated this value (`action`, `event`, etc). |
| `expiry`          | `Date`    | The expiration date of this cache value, if set.                          |