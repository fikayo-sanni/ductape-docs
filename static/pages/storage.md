---
title: "Managing Storage with Ductape"
sidebar_position: 6
---

# Managing Storage with Ductape

**Goal:**  
Add a storage resource to your product, and learn how to upload, retrieve, and delete files using Ductape.

**Prerequisites:**  
- Ductape product created  
- Storage provider credentials (e.g., AWS S3, Google Cloud Storage, Azure Blob)

---

## Step 1: Add a Storage Resource

```typescript
await ductape.product.storage.create({
  name: "Main Storage",
  tag: "main_storage",
  type: "s3", // or "gcs", "azure_blob", etc.
  config: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    bucket: process.env.AWS_BUCKET_NAME
  }
});
```

## Step 2: Upload a File

```typescript
const uploadResult = await ductape.processor.storage.save({
  env: "dev",
  product: "payments_service",
  storage: "main_storage",
  input: {
    fileName: "example.txt",
    buffer: Buffer.from("Hello, Ductape!"),
    mimeType: "text/plain"
  }
});
console.log(uploadResult);
```

## Step 3: Retrieve a File

```typescript
const file = await ductape.processor.storage.fetch({
  env: "dev",
  product: "payments_service",
  storage: "main_storage",
  input: {
    fileName: "example.txt"
  }
});
console.log(file);
```

## Step 4: Delete a File

```typescript
await ductape.processor.storage.delete({
  env: "dev",
  product: "payments_service",
  storage: "main_storage",
  input: {
    fileName: "example.txt"
  }
});
```

**Best Practices:**  
- Use unique file names or organize files in folders for easy management.
- Set appropriate permissions on your storage bucket.
- Clean up unused files to save costs.

**Next Steps:**  
- [Integrating Message Brokers](./message-brokers.md)
- [Scheduling Background Jobs](./jobs.md)
