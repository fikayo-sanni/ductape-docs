---
sidebar_position: 3
---

# Processing Storage

Upload files to your configured storage providers using `ductape.storage.upload()`.

## Quick Example

```ts
// Upload a file
const result = await ductape.storage.upload({
  product: 'my-app',
  env: 'prd',
  storage: 'main-storage',
  fileName: 'documents/report.pdf',
  buffer: fileBuffer,
  mimeType: 'application/pdf',
});

console.log('File URL:', result.url);
```

## How It Works

1. **product** - Your product's unique identifier
2. **env** - Which environment to run in (`dev`, `staging`, `prd`)
3. **storage** - The storage configuration tag
4. **fileName** - Destination path for the file
5. **buffer** - File content as Buffer or string
6. **mimeType** - Optional MIME type

## Examples

### Upload a file

```ts
import { readFileSync } from 'fs';

const fileBuffer = readFileSync('invoice.pdf');

const result = await ductape.storage.upload({
  product: 'billing',
  env: 'prd',
  storage: 'invoices-storage',
  fileName: 'invoices/invoice-001.pdf',
  buffer: fileBuffer,
  mimeType: 'application/pdf',
});

console.log('Uploaded to:', result.url);
```

### Download a file

```ts
const result = await ductape.storage.download({
  product: 'billing',
  env: 'prd',
  storage: 'invoices-storage',
  fileName: 'invoices/invoice-001.pdf',
});

console.log('Content type:', result.contentType);
console.log('Size:', result.size);
// result.data contains the file buffer
```

### Delete a file

```ts
const result = await ductape.storage.delete({
  product: 'billing',
  env: 'prd',
  storage: 'invoices-storage',
  fileName: 'invoices/old-invoice.pdf',
});

console.log('Deleted:', result.success);
```

### List files

```ts
const result = await ductape.storage.list({
  product: 'billing',
  env: 'prd',
  storage: 'invoices-storage',
  prefix: 'invoices/',
  limit: 100,
});

result.files.forEach(file => {
  console.log(`${file.name} - ${file.size} bytes`);
});
```

### Generate signed URL

```ts
// For downloads (read access)
const readUrl = await ductape.storage.getSignedUrl({
  product: 'billing',
  env: 'prd',
  storage: 'invoices-storage',
  fileName: 'invoices/invoice-001.pdf',
  expiresIn: 3600, // 1 hour
  action: 'read',
});

// For uploads (write access)
const writeUrl = await ductape.storage.getSignedUrl({
  product: 'billing',
  env: 'prd',
  storage: 'invoices-storage',
  fileName: 'uploads/new-file.pdf',
  expiresIn: 600, // 10 minutes
  action: 'write',
});
```

### Dispatch as background job

```ts
const result = await ductape.storage.dispatch({
  product: 'reports',
  env: 'prd',
  storage: 'reports-storage',
  operation: 'upload',
  fileName: 'reports/monthly.pdf',
  buffer: reportBuffer,
  mimeType: 'application/pdf',
  startAt: Date.now() + 60000, // Delay 1 minute
});

console.log('Job ID:', result.jobId);
console.log('Status:', result.status); // 'queued'
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
await ductape.storage.upload({
  product: 'profiles',
  env: 'prd',
  storage: 'avatars-storage',
  fileName: `users/${userId}/avatar.jpg`,
  buffer: imageBuffer,
  mimeType: 'image/jpeg',
});
```

**Date-based organization**
```ts
const now = new Date();
const year = now.getFullYear();
const month = String(now.getMonth() + 1).padStart(2, '0');
const day = String(now.getDate()).padStart(2, '0');

await ductape.storage.upload({
  product: 'documents',
  env: 'prd',
  storage: 'invoices-storage',
  fileName: `invoices/${year}/${month}/${day}/invoice-${invoiceId}.pdf`,
  buffer: pdfBuffer,
  mimeType: 'application/pdf',
});
```

**Type-based organization**
```ts
const fileType = mimeType.startsWith('image/') ? 'images' : 'documents';
await ductape.storage.upload({
  product: 'media',
  env: 'prd',
  storage: 'media-storage',
  fileName: `${fileType}/${category}/${originalFileName}`,
  buffer: fileBuffer,
  mimeType,
});
```

### Best Practices

1. **Consistent structure** - Use a consistent folder naming pattern across your application
2. **Meaningful paths** - Choose paths that make files easy to locate and manage
3. **Avoid deep nesting** - Keep folder hierarchies reasonably shallow (3-4 levels max)
4. **No special characters** - Use alphanumeric characters, hyphens, and underscores in folder names
5. **Forward slashes only** - Always use `/` for path separators (works across all providers)

---

## Reference

### IUploadOptions

```ts
interface IUploadOptions {
  product: string;
  env: string;
  storage: string;
  fileName: string;
  buffer: Buffer | string;
  mimeType?: string;
}
```

### IDownloadOptions

```ts
interface IDownloadOptions {
  product: string;
  env: string;
  storage: string;
  fileName: string;
}
```

### IDeleteOptions

```ts
interface IDeleteOptions {
  product: string;
  env: string;
  storage: string;
  fileName: string;
}
```

### IListFilesOptions

```ts
interface IListFilesOptions {
  product: string;
  env: string;
  storage: string;
  prefix?: string;
  limit?: number;
  continuationToken?: string;
}
```

### ISignedUrlOptions

```ts
interface ISignedUrlOptions {
  product: string;
  env: string;
  storage: string;
  fileName: string;
  expiresIn?: number;  // seconds, default: 3600
  action?: 'read' | 'write';
}
```

### IStorageResult

```ts
interface IStorageResult {
  success: boolean;
  url: string;
  fileName: string;
  mimeType?: string;
}
```

### IDownloadResult

```ts
interface IDownloadResult {
  data: Buffer;
  contentType: string;
  size: number;
}
```

### IListFilesResult

```ts
interface IListFilesResult {
  files: Array<{
    name: string;
    size: number;
    lastModified: Date;
  }>;
  continuationToken?: string;
  hasMore: boolean;
}
```

## See Also

* [Storage Overview](./overview)
* [Reading Files](./read-files)
* [Sessions](../sessions/overview)
