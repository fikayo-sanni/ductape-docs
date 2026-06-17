---
sidebar_position: 3
---

# Listing Files

List files in a storage bucket with pagination using `ductape.storage.listFiles()`.

## Parameters

| Field                | Type   | Required | Default | Description                                    |
|----------------------|--------|----------|--------|------------------------------------------------|
| `product`            | string | Yes      | —      | Product tag.                                   |
| `env`                | string | Yes      | —      | Environment slug (e.g. `prd`, `dev`).          |
| `storage`            | string | Yes      | —      | Storage configuration tag.                     |
| `prefix`             | string | No       | —      | Prefix to filter keys (e.g. `documents/`).     |
| `limit`              | number | No       | 100    | Max results per page (max: 1000).               |
| `continuationToken`  | string | No       | —      | Token for the next page (from previous result). |
| `cache`              | string | No       | —      | Optional cache tag for caching the result.      |

## Example

```ts
const result = await ductape.storage.listFiles({
  storage: 'primary-storage',
  prefix: 'uploads/',
  limit: 20,
});

console.log('Files:', result.files);
console.log('Has more:', result.hasMore);
console.log('Next token:', result.nextToken);
```

## Response

| Field       | Type     | Description                                  |
|-------------|----------|----------------------------------------------|
| `success`   | boolean  | Whether the request succeeded.               |
| `files`     | array    | List of file metadata objects.               |
| `limit`     | number   | Page size.                                   |
| `nextToken` | string?  | Token to pass as `continuationToken` for the next page. |
| `hasMore`   | boolean  | Whether more results are available.          |

Each file in `files` has: `name`, `size`, `lastModified`, and optionally `url`, `mimeType`, `metadata`.

## Pagination

Use `continuationToken` and `nextToken` to fetch the next page:

```ts
let token: string | undefined;
do {
  const result = await ductape.storage.listFiles({
    storage: 'primary-storage',
    limit: 100,
    continuationToken: token,
  });
  // process result.files
  token = result.nextToken;
} while (token);
```

## See Also

- [Storage Overview](./overview)
- [Processing Storage](./use)
- [Reading Files](./read-files)
