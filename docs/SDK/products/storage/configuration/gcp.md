---
sidebar_position: 3
---

# Google Cloud Storage Configuration

To set up a Google Cloud Storage provider, provide the following configuration:

```typescript
const gcpConfig = {
  bucketName: "your-gcp-bucket",
  keyFilename: "/path/to/service-account.json"
};
```

- **bucketName:** The name of the GCP storage bucket.
- **keyFilename:** Path to the GCP service account key file.