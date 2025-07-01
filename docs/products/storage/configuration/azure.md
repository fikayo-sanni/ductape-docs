---
sidebar_position: 4
---

# Azure Blob Storage Configuration

To set up an Azure Blob Storage provider, provide the following configuration:

## Example Configuration
```typescript
const azureConfig = {
  containerName: "your-container-name",
  connectionString: "your-connection-string"
};
```

## Field Definitions
- **containerName:** The name of the Azure Blob container.
- **connectionString:** The connection string to access the container.

## Key Points
- The connection string should have the necessary permissions for the container.
- Keep your connection string secure and do not commit it to source control.

## Next Steps
- [Managing Storage Providers](../storage.md)
- [Fetching Files](../files.md)