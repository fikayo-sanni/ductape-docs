---
sidebar_position: 1
---

# Managing Storage Providers

Ductape allows you to configure different storage providers for your project. You can define a storage resource for each environment you are building on. Supported providers:
- **Azure Blob Storage:** `StorageProviders.AZURE`
- **Google Cloud Storage (GCP):** `StorageProviders.GCP`
- **Amazon S3:** `StorageProviders.AWS`

Ductape provides a uniform interface across multiple storage providers, making them easily interchangeable without affecting your application's functionality.

## Setting Up Storage Providers
To create a storage resource in Ductape, use the `create` function of the `product.storage` interface. Configure each product environment with the appropriate storage provider settings.

```typescript
import { StorageProviders } from "ductape-sdk/types";

const storageProvider = await ductape.product.storage.create({
  name: "Primary Storage",
  tag: "primary-storage",
  envs: [
    {
      slug: "prd",
      type: StorageProviders.AWS,
      config: awsConfig,
    },
    {
      slug: "stg",
      type: StorageProviders.GCP,
      config: gcpConfig,
    }
  ]
});
```

## Updating Storage Providers
To update a storage resource, use the `update` function of the `product.storage` interface. You can modify configurations for different environments while keeping your application functional.

```typescript
const update = await ductape.product.storage.update("primary-storage", {
  envs: [
    {
      slug: "prd",
      type: StorageProviders.AZURE,
      config: azureConfig,
    }
  ]
});
```

## Fetching Storage Providers
To fetch all storage providers for a product, use the `fetchAll` function of the `product.storage` interface.

```typescript
const storageProviders = await ductape.product.storage.fetchAll();
```

## Fetching a Single Storage Provider
To fetch a single storage provider, use the `fetch` function of the `product.storage` interface. It takes the storage provider tag as input.

```typescript
const storageProvider = await ductape.product.storage.fetch("primary-storage");
```

## Key Points
- You can configure a different storage provider for each environment.
- Supported providers: AWS S3, Google Cloud Storage, Azure Blob Storage.
- All storage operations use a consistent interface, regardless of provider.

## Next Steps
- [Storage Provider Configuration: AWS](./configuration/aws.md)
- [Storage Provider Configuration: GCP](./configuration/gcp.md)
- [Storage Provider Configuration: Azure](./configuration/azure.md)
- [Fetching Files](./files.md)