---
sidebar_position: 3
---

# Processing Storage

Upload files to your configured storage providers using `ductape.storage.run()`.

## Quick Example

```ts
// Read a local file and upload it
const { buffer, fileName, mimeType } = await ductape.storage.read('path/to/file.txt');

await ductape.storage.run({
  env: 'prd',
  product: 'my-app',
  event: 'upload_file',
  input: {
    buffer,
    fileName,
    mimeType
  }
});
```

## How It Works

1. **env** - Which environment to run in (`dev`, `staging`, `prd`)
2. **product** - Your product's unique identifier
3. **event** - The storage event tag to trigger
4. **input** - File data (buffer, fileName, mimeType)

## Examples

### Upload a file

```ts
const { buffer, fileName, mimeType } = await ductape.storage.read('invoice.pdf');

const result = await ductape.storage.run({
  env: 'prd',
  product: 'billing',
  event: 'upload_invoice',
  input: {
    buffer,
    fileName,
    mimeType
  }
});
```

### Upload with session context

```ts
await ductape.storage.run({
  env: 'prd',
  product: 'profiles',
  event: 'upload_avatar',
  input: {
    buffer,
    fileName,
    mimeType
  },
  session: {
    tag: 'user-session',
    token: 'eyJhbGciOi...'
  }
});
```

### Upload with retries

```ts
await ductape.storage.run({
  env: 'prd',
  product: 'documents',
  event: 'upload_document',
  input: {
    buffer,
    fileName,
    mimeType
  },
  retries: 3
});
```

### Upload with caching

```ts
await ductape.storage.run({
  env: 'prd',
  product: 'assets',
  event: 'upload_image',
  input: {
    buffer,
    fileName,
    mimeType
  },
  cache: 'image-upload-cache'
});
```

## Optional Parameters

| Parameter | What it does |
|-----------|--------------|
| `session` | Attach user session context to the request |
| `cache` | Cache tag to store results for reuse |
| `retries` | Number of retry attempts on failure |

---

## Reference

### IStorageProcessorInput

```ts
interface IStorageProcessorInput {
  env: string;
  product: string;
  event: string;
  input: IStorageRequest;
  session?: ISession;
  cache?: string;
  retries?: number;
}
```

### IStorageRequest

```ts
interface IStorageRequest {
  buffer: string;      // Base64-encoded file content
  fileName: string;    // Name of the file
  mimeType?: string;   // MIME type (optional, inferred if omitted)
}
```

### ISession

```ts
interface ISession {
  tag: string;   // Session identifier
  token: string; // Session token (e.g., JWT)
}
```

## See Also

* [Reading Files](./read-files)
* [Sessions](../sessions/overview)
