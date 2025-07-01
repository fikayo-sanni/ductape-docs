---
sidebar_position: 3
---

# Processing Storage

Storage operations are performed using `ductape.processor.storage.run(data)`.

This method processes storage-related requests such as uploading files within the Ductape system, using environment, product tag, and other parameters.

```ts
await ductape.processor.storage.run(data: IStorageProcessorInput)
```

This processes a storage event in the specified environment and application context, passing along file data, metadata, and optionally session tracking.


## Parameters

### `IStorageProcessorInput`

| Field         | Type                        | Required | Description                                     |
| ------------- | --------------------------- | -------- | ----------------------------------------------- |
| `env`         | `string`                    | Yes      | Environment slug (e.g., `"dev"`, `"prd"`).      |
| `product_tag` | `string`                    | Yes      | Unique identifier for the product.              |
| `event`       | `string`                    | Yes      | Tag of the storage event to be triggered.       |
| `input`       | [`IStorageRequest`](#istoragerequest) | Yes | File data and metadata for storage.             |
| `session`     | [`ISession`](#isession-schema) | No   | Attach user session context to the request.     |
| `cache`       | `string`                    | No       | Cache tag to cache this request, if applicable. |
| `retries`     | `number`                    | No       | Number of retry attempts on failure.            |

> **Note:** Optional fields can be omitted or passed as empty `{}`.


## `IStorageRequest`

The shape of the `input` object:

```ts
interface IStorageRequest {
  buffer: string;      // Base64-encoded file content
  fileName: string;    // Name of the file
  mimeType?: string;   // MIME type of the file (optional)
}
```

| Field      | Type     | Required | Description                                 |
| ---------- | -------- | -------- | ------------------------------------------- |
| `buffer`   | `string` | Yes      | Base64-encoded content of the file.         |
| `fileName` | `string` | Yes      | Name of the file.                          |
| `mimeType` | `string` | No       | MIME type of the file. Inferred if omitted. |


## `ISession` Schema

The `session` field enables optional session tracking for any storage operation.

```ts
interface ISession {
  tag: string;   // session tag
  token: string; // session token (e.g. signed JWT)
}
```

| Field   | Type     | Required | Description                                   |
| ------- | -------- | -------- | --------------------------------------------- |
| `tag`   | `string` | Yes      | Tag identifying the session type.             |
| `token` | `string` | Yes      | Token generated when the session was created. |


## Returns

Returns a `Promise<unknown>` resolving with the result of the storage operation. The exact structure depends on the specific storage action.


## Example

```ts
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


## See Also

* [Reading Files](./read-files)
* [Session Tracking](../sessions)