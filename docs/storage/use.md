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

## Organizing Files in Folders

You can organize files into folders within your storage buckets by including the folder path in the `fileName` field. All cloud providers (AWS S3, GCP, Azure) support folder-like paths using forward slashes.

### How It Works

Cloud storage uses "virtual folders" - they're path prefixes in the object key, not actual directories. Simply include the full path in `fileName`:

```ts
// Root level - no folder
fileName: 'document.pdf'

// Single folder
fileName: 'uploads/document.pdf'

// Nested folders
fileName: 'users/123/documents/invoice.pdf'
```

### Examples

**User-specific folders**
```ts
const userId = 'user_12345';
await ductape.storage.run({
  env: 'prd',
  product: 'profiles',
  event: 'upload_avatar',
  input: {
    buffer,
    fileName: `users/${userId}/avatar.jpg`,  // Stored in: users/user_12345/avatar.jpg
    mimeType: 'image/jpeg'
  }
});
```

**Date-based organization**
```ts
const now = new Date();
const year = now.getFullYear();
const month = String(now.getMonth() + 1).padStart(2, '0');
const day = String(now.getDate()).padStart(2, '0');

await ductape.storage.run({
  env: 'prd',
  product: 'documents',
  event: 'upload_invoice',
  input: {
    buffer,
    fileName: `invoices/${year}/${month}/${day}/invoice-${invoiceId}.pdf`,
    mimeType: 'application/pdf'
  }
});
```

**Type-based organization**
```ts
const fileType = mimeType.startsWith('image/') ? 'images' : 'documents';
await ductape.storage.run({
  env: 'prd',
  product: 'media',
  event: 'upload_file',
  input: {
    buffer,
    fileName: `${fileType}/${category}/${fileName}`,
    mimeType
  }
});
```

**Environment separation** (if using same bucket across environments)
```ts
await ductape.storage.run({
  env: 'prd',
  product: 'assets',
  event: 'upload_asset',
  input: {
    buffer,
    fileName: `${env}/uploads/${fileName}`,  // prd/uploads/file.jpg
    mimeType
  }
});
```

### Best Practices

1. **Consistent structure** - Use a consistent folder naming pattern across your application
2. **Meaningful paths** - Choose paths that make files easy to locate and manage
3. **Avoid deep nesting** - Keep folder hierarchies reasonably shallow (3-4 levels max)
4. **No special characters** - Use alphanumeric characters, hyphens, and underscores in folder names
5. **Forward slashes only** - Always use `/` for path separators (works across all providers)

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
