---
sidebar_position: 1
---

# Storage

Configure cloud storage providers for file uploads and downloads.

## Quick Example

```ts
import { StorageProviders } from '@ductape/sdk/types';

await ductape.storage.create({
  name: 'Primary Storage',
  tag: 'primary-storage',
  envs: [
    {
      slug: 'prd',
      type: StorageProviders.AWS,
      config: {
        bucket: 'my-bucket',
        region: 'us-east-1',
        accessKeyId: 'your-key',
        secretAccessKey: 'your-secret'
      }
    }
  ]
});
```

## Supported Providers

| Provider | Enum Value | Description |
|----------|------------|-------------|
| Amazon S3 | `StorageProviders.AWS` | AWS S3 buckets |
| Google Cloud | `StorageProviders.GCP` | Google Cloud Storage |
| Azure | `StorageProviders.AZURE` | Azure Blob Storage |

## Creating Storage

Configure different providers per environment:

```ts
await ductape.storage.create({
  name: 'App Storage',
  tag: 'app-storage',
  envs: [
    {
      slug: 'prd',
      type: StorageProviders.AWS,
      config: awsConfig
    },
    {
      slug: 'dev',
      type: StorageProviders.GCP,
      config: gcpConfig
    }
  ]
});
```

## Updating Storage

```ts
await ductape.storage.update('app-storage', {
  envs: [
    {
      slug: 'prd',
      type: StorageProviders.AZURE,
      config: azureConfig
    }
  ]
});
```

## Fetching Storage

```ts
// Get all storage providers
const providers = await ductape.storage.fetchAll();

// Get specific provider
const provider = await ductape.storage.fetch('app-storage');
```

## Key Points

- Configure different providers per environment
- Swap providers without code changes
- Consistent interface across all providers

## See Also

* [Processing Storage](./use)
* [Reading Files](./read-files)
* [AWS Configuration](./providers/aws)
* [GCP Configuration](./providers/gcp)
* [Azure Configuration](./providers/azure)
