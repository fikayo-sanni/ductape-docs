---
sidebar_position: 4
---

# Azure Blob Storage Configuration

To set up an Azure Blob Storage provider, provide the following configuration:

```typescript
const azureConfig = {
  containerName: "your-container-name",
  connectionString: "your-connection-string"
};
```

- **containerName:** The name of the Azure Blob container.
- **connectionString:** The connection string to access the container.