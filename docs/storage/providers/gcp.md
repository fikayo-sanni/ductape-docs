---
sidebar_position: 3
---

# Google Cloud Storage Configuration

To set up a Google Cloud Storage provider, provide the following configuration:

## Example Configuration
```typescript
const gcpConfig = {
  bucketName: "your-gcp-bucket",
  config: {
    type: "service_account",
    project_id: "your-project-id",
    private_key_id: "key-id",
    private_key: "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
    client_email: "service-account@project.iam.gserviceaccount.com",
    client_id: "123456789",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/service-account%40project.iam.gserviceaccount.com",
    universe_domain: "googleapis.com"
  }
};
```

## Field Definitions

### bucketName
The name of the GCP storage bucket where files will be stored.

### config
The service account credentials object containing all required GCP authentication fields:

- **type:** Always `"service_account"`
- **project_id:** Your GCP project ID
- **private_key_id:** The private key identifier
- **private_key:** The RSA private key (include newline characters as `\n`)
- **client_email:** The service account email address
- **client_id:** The client identifier
- **auth_uri:** OAuth2 authorization URI (usually `https://accounts.google.com/o/oauth2/auth`)
- **token_uri:** OAuth2 token URI (usually `https://oauth2.googleapis.com/token`)
- **auth_provider_x509_cert_url:** Certificate provider URL
- **client_x509_cert_url:** Service account certificate URL
- **universe_domain:** The universe domain (usually `googleapis.com`)

## Key Points
- The service account must have permissions to access the bucket (Storage Object Creator/Viewer roles)
- **Do not** commit service account credentials to source control
- Store credentials securely using environment variables or secret management
- The `private_key` field must preserve newline characters as `\n`
- You can obtain these credentials by downloading the JSON key file from GCP Console

## Next Steps
- [Managing Storage Providers](../overview.md)
- [Fetching Files](../files.md)