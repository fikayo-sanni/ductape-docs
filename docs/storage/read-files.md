---
sidebar_position: 2
---

# Reading Files

Read files from disk and prepare them for upload using `ductape.storage.read()`.

## Quick Example

```ts
const { buffer, fileName, mimeType } = await ductape.storage.read('path/to/file.pdf');

// Use the result in a storage operation
await ductape.storage.upload({
  env: 'prd',
  product: 'my-app',
  event: 'upload_document',
  input: { buffer, fileName, mimeType }
});
```

## How It Works

The `read` function:
1. Reads the file from disk
2. Encodes content as base64
3. Extracts the filename
4. Detects the MIME type

## Examples

### Read and upload a file

```ts
const file = await ductape.storage.read('invoices/invoice-001.pdf');

await ductape.storage.upload({
  env: 'prd',
  product: 'billing',
  event: 'upload_invoice',
  input: {
    buffer: file.buffer,
    fileName: file.fileName,
    mimeType: file.mimeType
  }
});
```

### Read multiple files

```ts
const files = await Promise.all([
  ductape.storage.read('docs/report.pdf'),
  ductape.storage.read('images/chart.png')
]);
```

## Response

```ts
interface IFileReadResult {
  buffer: string;    // Base64-encoded content
  fileName: string;  // File name from path
  mimeType: string;  // Detected MIME type
}
```

| Field | Description |
|-------|-------------|
| `buffer` | Base64-encoded file content |
| `fileName` | Name extracted from the file path |
| `mimeType` | MIME type (empty string if unknown) |

## See Also

* [Storage Overview](./overview)
* [Processing Storage](./use)
* [Sessions](../sessions/overview)
