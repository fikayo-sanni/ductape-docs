---
sidebar_position: 3
---

# Fetching Files

To fetch files that have been previously uploaded, use the `ductape.storage.files` function. This function allows you to retrieve a paginated list of files within your workspace, filtered by optional parameters.

## Input Parameters
| Field    | Type     | Required | Default | Description                                                      |
|:---------|:---------|:---------|:--------|:-----------------------------------------------------------------|
| `page`   | number   | No       | 0       | The page number to fetch. Starts from 0.                         |
| `limit`  | number   | No       | 20      | Number of results per page.                                      |
| `event`  | string   | Yes      | null    | Required storage tag of the bucket you want to look up.          |

## Example
```typescript
const files = await ductape.storage.files({
  event: "primary-storage",
  page: 0,
  limit: 20
});
```

## Output Structure
The data returned is an array of file metadata objects with the following structure:

| Field         | Type     | Description                                         |
|:--------------|:---------|:----------------------------------------------------|
| `url`         | string   | The public or signed URL for accessing the file.    |
| `workspace_id`| string   | The workspace this file belongs to.                 |
| `type`        | string   | The file type category.                             |
| `product`     | string   | The product the file is associated with.            |
| `provider`    | string   | The cloud storage provider used (e.g., gcp, azure). |
| `process_id`  | string   | The process run identifier for this file.           |
| `event`       | string   | The event that triggered this file upload.          |
| `env`         | string   | The environment this file was uploaded in.          |
| `size`        | number   | The file size in bytes.                             |

## Key Points
- Use the correct storage tag (`event`) to fetch files from the right bucket.
- Pagination is supported via `page` and `limit` parameters.
- Output includes all relevant metadata for each file.

## Next Steps
- [Managing Storage Providers](./overview.md)
- [Storage Provider Configuration](./providers/aws.md)