---
sidebar_position: 1
---

# Storage

Configure cloud storage providers and perform file operations across AWS S3, Google Cloud Storage, and Azure Blob Storage through a unified interface.

## Quick Example

Use the **storage** API on the Ductape instance. Initialize Ductape with your access key:

```ts
import Ductape from '@ductape/sdk';

const ductape = new Ductape({
  accessKey: 'your-access-key',
  env_type: 'prd', // optional
});

// Upload a file
const result = await ductape.storage.upload({
  product: 'my-product',
  env: 'prd',
  storage: 'main-storage',
  fileName: 'documents/report.pdf',
  buffer: fileBuffer,
  mimeType: 'application/pdf',
});

console.log('File URL:', result.url);
```

---

## Supported Providers

| Provider | Enum Value | Description |
|----------|------------|-------------|
| Amazon S3 | `StorageProviders.AWS` | AWS S3 buckets |
| Google Cloud | `StorageProviders.GCP` | Google Cloud Storage |
| Azure | `StorageProviders.AZURE` | Azure Blob Storage |

---

## File Operations

### Upload a File

```ts
const result = await ductape.storage.upload({
  product: 'my-product',
  env: 'prd',
  storage: 'main-storage',
  fileName: 'images/photo.jpg',
  buffer: imageBuffer,           // Buffer or string
  mimeType: 'image/jpeg',        // Optional
});

// Returns { success: true, url: '...', fileName: '...', mimeType: '...' }
```

### Download a File

```ts
const result = await ductape.storage.download({
  product: 'my-product',
  env: 'prd',
  storage: 'main-storage',
  fileName: 'documents/report.pdf',
});

// Returns { success: true, data: Buffer, fileName?: string, size?: number, mimeType?: string }
```

### Remove a File

Use `storage.remove()` to delete a file:

```ts
const result = await ductape.storage.remove({
  product: 'my-product',
  env: 'prd',
  storage: 'main-storage',
  fileName: 'documents/old-report.pdf',
});

// Returns { success: true, fileName?: string }
```

### List Files

Use `storage.listFiles()` for paginated listing:

```ts
const result = await ductape.storage.listFiles({
  product: 'my-product',
  env: 'prd',
  storage: 'main-storage',
  prefix: 'documents/',           // Optional
  limit: 100,                     // Optional (default: 100, max: 1000)
  continuationToken: '...',       // Optional: for next page
});

// Returns { success: true, files: [...], limit?, nextToken?, hasMore }
```

#### Pagination Example

Use `continuationToken` and `nextToken` for cursor-based pagination:

```ts
async function getAllFiles(product: string, env: string, storageTag: string) {
  const allFiles = [];
  let continuationToken: string | undefined;

  do {
    const result = await ductape.storage.listFiles({
      product,
      env,
      storage: storageTag,
      limit: 100,
      continuationToken,
    });

    allFiles.push(...result.files);
    continuationToken = result.nextToken;
  } while (continuationToken);

  return allFiles;
}
```

### Get Storage Statistics

Get file counts and sizes without loading all files:

```ts
const stats = await ductape.storage.stats({
  product: 'my-product',
  env: 'prd',
  storage: 'main-storage',
  prefix: 'documents/',     // Optional
});

// Returns { success: true, totalFiles, totalSize, byType: { image, video, audio, document, archive, other } }
```

### Generate Signed URL

Create temporary URLs for secure file access:

```ts
// Read access (download)
const result = await ductape.storage.getSignedUrl({
  product: 'my-product',
  env: 'prd',
  storage: 'main-storage',
  fileName: 'documents/report.pdf',
  expiresIn: 3600,            // Seconds (default: 3600)
  action: 'read',             // 'read' or 'write'
});

// Write access (upload)
const uploadUrl = await ductape.storage.getSignedUrl({
  product: 'my-product',
  env: 'prd',
  storage: 'main-storage',
  fileName: 'uploads/new-file.pdf',
  expiresIn: 600,
  action: 'write',
});
```

---

## Dispatch Storage Jobs

Queue storage operations as background jobs:

```ts
const result = await ductape.storage.dispatch({
  product: 'my-product',
  env: 'prd',
  storage: 'main-storage',
  operation: 'upload',
  input: {
    fileName: 'reports/monthly.pdf',
    buffer: reportBuffer,
    mimeType: 'application/pdf',
  },
  schedule: { start_at: Date.now() + 60000 },  // Optional: delay 1 minute
});

// Returns { job_id, status, scheduled_at, recurring?, next_run_at? }
```

---

## Creating Storage Configurations

Create and manage storage per product. Pass **product** in the data object:

```ts
import { StorageProviders } from '@ductape/sdk/types';

await ductape.storage.create({
  product: 'my-product',
  name: 'App Storage',
  tag: 'app-storage',
  envs: [
    {
      slug: 'prd',
      type: StorageProviders.AWS,
      config: {
        bucketName: 'my-prod-bucket',
        region: 'us-east-1',
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
      },
    },
    {
      slug: 'dev',
      type: StorageProviders.GCP,
      config: {
        bucketName: 'my-dev-bucket',
        config: { /* GCP service account JSON */ },
      },
    },
  ],
});
```

### Updating Storage

```ts
await ductape.storage.update('my-product', 'app-storage', {
  envs: [
    {
      slug: 'prd',
      type: StorageProviders.AZURE,
      config: {
        containerName: 'my-container',
        connectionString: process.env.AZURE_CONNECTION_STRING,
      },
    },
  ],
});
```

### Listing and Fetching Storage

```ts
// List all storage configs for a product
const providers = await ductape.storage.list('my-product');

// Fetch a single storage by tag
const provider = await ductape.storage.fetch('my-product', 'app-storage');
```

---

## API Reference

### ductape.storage Methods

| Method | Description |
|--------|-------------|
| `create(data)` | Create a storage config (`data` includes `product`, `name`, `tag`, `envs`) |
| `list(product)` | List all storage configs for a product |
| `fetch(product, tag)` | Fetch a storage config by tag |
| `update(product, tag, data)` | Update a storage config |
| `delete(product, tag)` | Delete a storage config |
| `upload(options)` | Upload a file |
| `download(options)` | Download a file |
| `remove(options)` | Remove (delete) a file |
| `listFiles(options)` | List files with pagination |
| `getSignedUrl(options)` | Generate a temporary signed URL |
| `stats(options)` | Get file counts and sizes by type |
| `dispatch(options)` | Queue a storage operation as a job |
| `testConnection(options)` | Test storage provider connectivity |

For reading a file from **local disk** (e.g. before upload), use `ductape.storage.files.read(path)`.

### Error Handling

```ts
import { StorageError } from '@ductape/sdk';

try {
  const result = await ductape.storage.upload({ ... });
} catch (error) {
  if (error instanceof StorageError) {
    console.log('Error code:', error.code);
    console.log('Message:', error.message);
  }
}
```

---

## Provider Configuration

### AWS S3

```ts
{
  slug: 'prd',
  type: StorageProviders.AWS,
  config: {
    bucketName: 'your-bucket-name',
    accessKeyId: 'your-access-key-id',
    secretAccessKey: 'your-secret-access-key',
    region: 'us-east-1'
  }
}
```

| Field | Description |
|-------|-------------|
| `bucketName` | The name of the S3 bucket |
| `accessKeyId` | AWS access key ID |
| `secretAccessKey` | AWS secret access key |
| `region` | AWS region where the bucket is hosted |

### Google Cloud Storage

```ts
{
  slug: 'prd',
  type: StorageProviders.GCP,
  config: {
    bucketName: 'your-gcp-bucket',
    config: {
      type: 'service_account',
      project_id: 'your-project-id',
      private_key_id: 'key-id',
      private_key: '-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n',
      client_email: 'service-account@project.iam.gserviceaccount.com',
      client_id: '123456789',
      auth_uri: 'https://accounts.google.com/o/oauth2/auth',
      token_uri: 'https://oauth2.googleapis.com/token',
      auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
      client_x509_cert_url: 'https://www.googleapis.com/robot/v1/metadata/x509/...',
      universe_domain: 'googleapis.com',
    },
  },
}
```

| Field | Description |
|-------|-------------|
| `bucketName` | The name of the GCP storage bucket |
| `config` | Service account credentials object (from GCP Console JSON key file) |

### Azure Blob Storage

```ts
{
  slug: 'prd',
  type: StorageProviders.AZURE,
  config: {
    containerName: 'your-container-name',
    connectionString: 'your-connection-string',
  },
}
```

| Field | Description |
|-------|-------------|
| `containerName` | The name of the Azure Blob container |
| `connectionString` | The connection string to access the container |

---

## Key Points

- Configure different providers per environment
- Swap providers without code changes
- Consistent interface across all providers
- Built-in logging for all operations
- Support for signed URLs with configurable expiry
- Store credentials securely using environment variables

## See Also

* [Processing Storage](./use)
* [Sessions](../sessions/overview)
