---
sidebar_position: 1
---

# Getting Started with Secrets

Secrets allow you to securely store and manage sensitive data like API keys, tokens, and credentials within your Ductape workspace. All secrets are encrypted client-side using your workspace's private key before being stored.

## Key Features

- **Client-side Encryption**: Secret values are encrypted using your workspace's private key before transmission
- **Token Types**: Categorize secrets as `api` or `access` tokens
- **Scoped Access**: Restrict secrets to specific apps or services
- **Environment-specific**: Limit secrets to specific environments (dev, staging, production)
- **Expiration**: Set optional expiry dates for automatic token rotation reminders
- **Reference Syntax**: Use `$Secret{key}` syntax to reference secrets in your configurations

## Use Cases

- Store third-party API keys (Stripe, Twilio, SendGrid, etc.)
- Manage database credentials
- Store OAuth client secrets
- Keep webhook signing secrets
- Store encryption keys for external services

## How It Works

1. **Encryption**: When you create a secret, the value is encrypted client-side using your workspace's private key
2. **Storage**: Only the encrypted value is sent to and stored on Ductape servers
3. **Retrieval**: When you fetch a secret, the encrypted value is returned and decrypted client-side
4. **Reference**: Use `$Secret{secret_key}` to reference secrets in action configurations, environment variables, and authentication setups

## Security Model

- Workspace private keys never leave your local environment
- Server-side storage contains only encrypted values
- Only workspace members with valid credentials can decrypt secrets
- Optional expiration dates help enforce token rotation policies

## Next Steps

- [Managing Secrets](./managing-secrets.md) - Learn how to create, update, and delete secrets
- [Using Secrets](./using-secrets.md) - Learn how to reference secrets in your integrations
