---
sidebar_position: 2
---

# Reading Files from Disk

Read a file from the **local filesystem** and get a base64 buffer and metadata. Use this when you need to read a file from disk before uploading it to cloud storage.

Use `ductape.storage.files.read(path)`.

## Quick Example

```ts
const file = await ductape.storage.files.read('path/to/file.pdf');

// Use the result in an upload
await ductape.storage.upload({
  product: 'my-product',
  env: 'prd',
  storage: 'main-storage',
  fileName: file.fileName,
  buffer: Buffer.from(file.buffer, 'base64'),
  mimeType: file.mimeType,
});
```

## How It Works

`storage.files.read(path)`:

1. Reads the file from disk (server-side path)
2. Encodes content as base64 in the returned `buffer`
3. Sets `fileName` from the path basename
4. Detects MIME type from the path/extension

## Response

```ts
interface IFileReadResult {
  buffer: string;    // Base64-encoded content
  fileName: string;  // Basename of the path
  mimeType: string;  // Detected MIME type (may be '')
}
```

| Field     | Description                |
|----------|----------------------------|
| `buffer` | Base64-encoded file content |
| `fileName` | Name extracted from the path |
| `mimeType` | MIME type (empty string if unknown) |

## Examples

### Read and upload

```ts
const file = await ductape.storage.files.read('invoices/invoice-001.pdf');

await ductape.storage.upload({
  product: 'my-product',
  env: 'prd',
  storage: 'invoices-storage',
  fileName: file.fileName,
  buffer: Buffer.from(file.buffer, 'base64'),
  mimeType: file.mimeType || 'application/pdf',
});
```

### Read multiple files

```ts
const files = await Promise.all([
  ductape.storage.files.read('docs/report.pdf'),
  ductape.storage.files.read('images/chart.png'),
]);
```

## See Also

- [Storage Overview](./overview)
- [Processing Storage](./use)
- [Listing Files](./files)
