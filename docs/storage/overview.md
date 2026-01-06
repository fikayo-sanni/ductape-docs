---
sidebar_position: 1
---

# Storage

Configure cloud storage providers and perform file operations across AWS S3, Google Cloud Storage, and Azure Blob Storage through a unified interface.

## Quick Example

```ts
import { StorageService } from '@ductape/sdk';

const storage = new StorageService({
  accessKey: 'your-access-key',
});

// Upload a file
const result = await storage.upload({
  product: 'my-product',
  env: 'production',
  storage: 'main-storage',
  fileName: 'documents/report.pdf',
  buffer: fileBuffer,
  mimeType: 'application/pdf',
});

console.log('File URL:', result.url);
```

## Using the Ductape Class

You can also use storage through the main Ductape class:

```ts
import Ductape from '@ductape/sdk';

const ductape = new Ductape({
  accessKey: 'your-access-key',
});

// Upload a file
const result = await ductape.storage.upload({
  product: 'my-product',
  env: 'production',
  storage: 'main-storage',
  fileName: 'documents/report.pdf',
  buffer: fileBuffer,
  mimeType: 'application/pdf',
});
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
const result = await storage.upload({
  product: 'my-product',
  env: 'production',
  storage: 'main-storage',
  fileName: 'images/photo.jpg',
  buffer: imageBuffer,           // Buffer or string
  mimeType: 'image/jpeg',        // Optional
});

// Returns
{
  success: true,
  url: 'https://bucket.s3.amazonaws.com/images/photo.jpg',
  fileName: 'images/photo.jpg',
  mimeType: 'image/jpeg'
}
```

### Download a File

```ts
const result = await storage.download({
  product: 'my-product',
  env: 'production',
  storage: 'main-storage',
  fileName: 'documents/report.pdf',
});

// Returns
{
  data: Buffer,           // File contents
  contentType: 'application/pdf',
  size: 1024000
}
```

### Delete a File

```ts
const result = await storage.delete({
  product: 'my-product',
  env: 'production',
  storage: 'main-storage',
  fileName: 'documents/old-report.pdf',
});

// Returns
{
  success: true,
  fileName: 'documents/old-report.pdf'
}
```

### List Files

```ts
const result = await storage.list({
  product: 'my-product',
  env: 'production',
  storage: 'main-storage',
  prefix: 'documents/',        // Optional: filter by prefix
  fileType: 'image',           // Optional: filter by type (image, video, audio, document, archive, other)
  limit: 100,                  // Optional: max results (default: 100, max: 1000)
  continuationToken: '...',    // Optional: for pagination
});

// Returns
{
  success: true,
  files: [
    { name: 'documents/report.pdf', size: 1024000, lastModified: Date, url: '...', mimeType: 'application/pdf' },
    { name: 'documents/invoice.pdf', size: 512000, lastModified: Date, url: '...', mimeType: 'application/pdf' },
  ],
  limit: 100,
  nextToken: '...',            // Continuation token for next page
  hasMore: true                // Whether more results are available
}
```

#### File Type Filtering

Filter files by type to retrieve only specific categories:

```ts
// Get only images
const images = await storage.list({
  product: 'my-product',
  env: 'production',
  storage: 'media-storage',
  fileType: 'image',
  limit: 50,
});

// Available file types: 'image', 'video', 'audio', 'document', 'archive', 'other'
```

#### Pagination Example

For buckets with many files, use cursor-based pagination:

```ts
async function getAllFiles(product: string, env: string, storageTag: string) {
  const allFiles = [];
  let continuationToken: string | undefined;

  do {
    const result = await storage.list({
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

Get comprehensive file counts and sizes without loading all files:

```ts
const stats = await storage.stats({
  product: 'my-product',
  env: 'production',
  storage: 'main-storage',
  prefix: 'documents/',     // Optional: filter by prefix
});

// Returns
{
  success: true,
  totalFiles: 1250,
  totalSize: 5368709120,    // 5 GB in bytes
  byType: {
    image: { count: 500, size: 2147483648 },
    video: { count: 50, size: 2684354560 },
    audio: { count: 100, size: 268435456 },
    document: { count: 400, size: 214748364 },
    archive: { count: 50, size: 53687091 },
    other: { count: 150, size: 0 }
  }
}
```

The `stats()` method efficiently iterates through all files using provider-native pagination (up to 1000 files per API call) and categorizes them by extension. It only retrieves metadata, not file contents.

### Generate Signed URL

Create temporary URLs for secure file access:

```ts
// Read access (download)
const result = await storage.getSignedUrl({
  product: 'my-product',
  env: 'production',
  storage: 'main-storage',
  fileName: 'documents/report.pdf',
  expiresIn: 3600,            // Seconds (default: 3600)
  action: 'read',             // 'read' or 'write'
});

// Returns
{
  url: 'https://bucket.s3.amazonaws.com/documents/report.pdf?X-Amz-...',
  expiresAt: Date
}

// Write access (upload)
const uploadUrl = await storage.getSignedUrl({
  product: 'my-product',
  env: 'production',
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
const result = await storage.dispatch({
  product: 'my-product',
  env: 'production',
  storage: 'main-storage',
  operation: 'upload',
  fileName: 'reports/monthly.pdf',
  buffer: reportBuffer,
  mimeType: 'application/pdf',
  startAt: Date.now() + 60000,  // Optional: delay 1 minute
});

// Returns
{
  jobId: 'uuid-v4',
  status: 'queued'
}
```

---

## Creating Storage Configurations

Configure different providers per environment:

```ts
import { StorageProviders } from '@ductape/sdk/types';

await ductape.storage.create({
  name: 'App Storage',
  tag: 'app-storage',
  envs: [
    {
      slug: 'prd',
      type: StorageProviders.AWS,
      config: {
        bucket: 'my-prod-bucket',
        region: 'us-east-1',
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY
      }
    },
    {
      slug: 'dev',
      type: StorageProviders.GCP,
      config: {
        bucket: 'my-dev-bucket',
        projectId: 'my-project',
        keyFilename: '/path/to/service-account.json'
      }
    }
  ]
});
```

### Updating Storage

```ts
await ductape.storage.update('app-storage', {
  envs: [
    {
      slug: 'prd',
      type: StorageProviders.AZURE,
      config: {
        containerName: 'my-container',
        accountName: 'myaccount',
        accountKey: process.env.AZURE_KEY
      }
    }
  ]
});
```

### Fetching Storage

```ts
// Get all storage providers
const providers = await ductape.storage.fetchAll();

// Get specific provider
const provider = await ductape.storage.fetch('app-storage');
```

---

## API Reference

### StorageService Methods

| Method | Description |
|--------|-------------|
| `upload(options)` | Upload a file to cloud storage |
| `download(options)` | Download a file from cloud storage |
| `delete(options)` | Delete a file from cloud storage |
| `list(options)` | List files with pagination support |
| `stats(options)` | Get file counts and sizes by type |
| `getSignedUrl(options)` | Generate a temporary signed URL |
| `dispatch(options)` | Queue a storage operation as a job |
| `testConnection(options)` | Test storage provider connectivity |

### Error Handling

```ts
import { StorageError } from '@ductape/sdk';

try {
  const result = await storage.upload({ ... });
} catch (error) {
  if (error instanceof StorageError) {
    console.log('Error code:', error.code);
    console.log('Message:', error.message);
    // Codes: STORAGE_ENV_NOT_FOUND, UPLOAD_FAILED, DOWNLOAD_FAILED,
    //        DELETE_FAILED, LIST_FAILED, STATS_FAILED, SIGNED_URL_FAILED
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
      universe_domain: 'googleapis.com'
    }
  }
}
```

| Field | Description |
|-------|-------------|
| `bucketName` | The name of the GCP storage bucket |
| `config` | Service account credentials object (from GCP Console JSON key file) |

The service account must have Storage Object Creator/Viewer roles for the bucket.

### Azure Blob Storage

```ts
{
  slug: 'prd',
  type: StorageProviders.AZURE,
  config: {
    containerName: 'your-container-name',
    connectionString: 'your-connection-string'
  }
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
