---
sidebar_position: 2
---

# AWS S3 Configuration

To set up an AWS S3 storage provider, provide the following configuration:

## Example Configuration
```typescript
const awsConfig = {
  bucketName: "your-bucket-name",
  accessKeyId: "your-access-key-id",
  secretAccessKey: "your-secret-access-key",
  region: "us-east-1"
};
```

## Field Definitions
- **bucketName:** The name of the S3 bucket.
- **accessKeyId:** AWS access key ID.
- **secretAccessKey:** AWS secret access key.
- **region:** AWS region where the bucket is hosted.

## Key Points
- All fields are required for AWS S3 configuration.
- Ensure your IAM user has the correct permissions for the bucket.

## Next Steps
- [Managing Storage Providers](../storage.md)
- [Fetching Files](../files.md)