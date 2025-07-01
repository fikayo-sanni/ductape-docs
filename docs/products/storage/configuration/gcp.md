---
sidebar_position: 3
---

# Google Cloud Storage Configuration

To set up a Google Cloud Storage provider, provide the following configuration:

## Example Configuration
```typescript
const gcpConfig = {
  bucketName: "your-gcp-bucket",
  keyFilename: "/path/to/service-account.json"
};
```

## Field Definitions
- **bucketName:** The name of the GCP storage bucket.
- **keyFilename:** Path to the GCP service account key file.

## Key Points
- The service account must have permissions to access the bucket.
- The key file should be kept secure and not committed to source control.

## Next Steps
- [Managing Storage Providers](../storage.md)
- [Fetching Files](../files.md)