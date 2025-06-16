---
sidebar_position: 3
---

# Processing Storage

Storage operations are performed using `ductape.processor.storage.run(data)`.

This method processes storage-related requests such as uploading files within the Ductape system, using environment, product tag, and other parameters.

## Usage

```ts
await ductape.processor.storage.run(data: IStorageProcessorInput)
````

## Input

### `IStorageProcessorInput`

An object containing parameters needed to execute the storage processor.

| Property      | Type              | Required   | Description                                     |
| ------------- | ----------------- | ---------- | ----------------------------------------------- |
| `env`         | `string`          | ✅ Yes      | Environment slug (e.g., `"dev"`, `"prd"`).      |
| `product_tag` | `string`          | ✅ Yes      | Unique identifier for the product.              |
| `event`       | `string`          | ✅ Yes      | Tag of the storage event to be triggered.       |
| `input`       | `IStorageRequest` | ✅ Yes      | File data and metadata for storage.             |
| `session`     | `ISession` | ❌ Optional | Attach user session context to the request.     |
| `cache`       | `string`          | ❌ Optional | Cache tag to cache this request, if applicable. |
| `retries`     | `number`          | ❌ Optional | Number of retry attempts on failure.            |

### `IStorageRequest`

The shape of the `input` object:

```ts
interface IStorageRequest {
  buffer: string;      // Base64-encoded file content
  fileName: string;    // Name of the file
  mimeType?: string;   // MIME type of the file (optional)
}
```

* **`buffer`** (`string`) – Base64-encoded content of the file to be stored.
* **`fileName`** (`string`) – Name of the file.
* **`mimeType`** (`string`, optional) – MIME type of the file. If omitted, the system will attempt to infer it.

### `ISession`

Optional object to enable session tracking and access session-based user data.

```ts
{
  tag: string;
  token: string;
}
```

| Field   | Type     | Required | Description                                   |
| ------- | -------- | -------- | --------------------------------------------- |
| `tag`   | `string` | ✅ Yes    | Tag identifying the session type.             |
| `token` | `string` | ✅ Yes    | Token generated when the session was created. |

## Returns

Returns a `Promise<unknown>` resolving with the result of the storage operation. The exact structure depends on the specific storage action.

## Example Usage

```ts
import { ductape } from '@ductape/sdk';

const { buffer, fileName, mimeType } = await ductape.processor.storage.readFile('path/to/file.txt');

const data = {
  env: "dev",
  product_tag: "my-product",
  event: "upload_file",
  input: {
    buffer,
    fileName,
    mimeType,
  },
  session: {
    tag: "user-session",
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  retries: 2,
  cache: "upload-file-cache", // Optional caching
};

const res = await ductape.processor.storage.run(data);
```