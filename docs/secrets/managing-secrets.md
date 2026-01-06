---
sidebar_position: 2
---

# Managing Secrets

This guide covers all CRUD operations for workspace secrets using the Ductape SDK.

## Prerequisites

Before managing secrets, ensure you have:

1. Installed the Ductape SDK
2. Initialized the SDK with valid credentials
3. Access to the workspace where you want to manage secrets

```typescript
import Ductape from '@ductape/sdk';

const ductape = new Ductape({
  accessKey: 'your-access-key',
});

await ductape.init();
```

## Create a Secret

Create a new encrypted secret in your workspace.

### Parameters

| Field       | Type     | Required | Description                                      | Example                    |
|-------------|----------|----------|--------------------------------------------------|----------------------------|
| key         | string   | Yes      | Unique identifier for the secret                 | `STRIPE_API_KEY`           |
| value       | string   | Yes      | The secret value (will be encrypted)             | `sk_live_xxx...`           |
| description | string   | No       | Human-readable description                       | `Production Stripe key`    |
| token_type  | string   | No       | Type of token: `api` or `access`                 | `api`                      |
| scope       | string[] | No       | Array of app tags this secret can be used with   | `['stripe_app', 'pay_app']`|
| envs        | string[] | No       | Array of environment slugs                       | `['prd', 'staging']`       |
| expires_at  | number   | No       | Unix timestamp for expiration (null = no expiry) | `1735689600`               |

### Example

```typescript
const secret = await ductape.secrets.create({
  key: 'STRIPE_API_KEY',
  value: 'sk_live_51ABC123...',
  description: 'Production Stripe API key for payment processing',
  token_type: 'api',
  scope: ['stripe_payments', 'checkout_service'],
  envs: ['prd', 'staging'],
  expires_at: Math.floor(Date.now() / 1000) + (365 * 24 * 60 * 60) // 1 year from now
});

console.log('Secret created:', secret.key);
```

### Response

```typescript
{
  _id: '507f1f77bcf86cd799439011',
  workspace_id: 'ws_123',
  key: 'STRIPE_API_KEY',
  description: 'Production Stripe API key for payment processing',
  token_type: 'api',
  scope: ['stripe_payments', 'checkout_service'],
  envs: ['prd', 'staging'],
  expires_at: 1735689600,
  createdAt: '2024-01-15T10:30:00.000Z',
  updatedAt: '2024-01-15T10:30:00.000Z'
}
```

## List All Secrets

Retrieve all secrets in your workspace. Note: This returns metadata only, not the encrypted values.

### Example

```typescript
const secrets = await ductape.secrets.fetchAll();

secrets.forEach(secret => {
  console.log(`${secret.key}: ${secret.description || 'No description'}`);
  console.log(`  Type: ${secret.token_type || 'Not specified'}`);
  console.log(`  Scope: ${secret.scope?.join(', ') || 'All apps'}`);
  console.log(`  Environments: ${secret.envs?.join(', ') || 'All environments'}`);
});
```

### Response

```typescript
[
  {
    _id: '507f1f77bcf86cd799439011',
    workspace_id: 'ws_123',
    key: 'STRIPE_API_KEY',
    description: 'Production Stripe API key',
    token_type: 'api',
    scope: ['stripe_payments'],
    envs: ['prd'],
    expires_at: 1735689600,
    createdAt: '2024-01-15T10:30:00.000Z',
    updatedAt: '2024-01-15T10:30:00.000Z'
  },
  {
    _id: '507f1f77bcf86cd799439012',
    workspace_id: 'ws_123',
    key: 'SENDGRID_KEY',
    description: 'SendGrid API key for emails',
    token_type: 'api',
    scope: ['email_service'],
    envs: ['dev', 'staging', 'prd'],
    expires_at: null,
    createdAt: '2024-01-10T08:00:00.000Z',
    updatedAt: '2024-01-10T08:00:00.000Z'
  }
]
```

## Fetch a Single Secret

Retrieve a specific secret including its decrypted value.

### Parameters

| Field | Type   | Required | Description                      |
|-------|--------|----------|----------------------------------|
| key   | string | Yes      | The unique key of the secret     |

### Example

```typescript
const secret = await ductape.secrets.fetch('STRIPE_API_KEY');

console.log('Key:', secret.key);
console.log('Value:', secret.value); // Decrypted value
console.log('Description:', secret.description);
```

### Response

```typescript
{
  _id: '507f1f77bcf86cd799439011',
  workspace_id: 'ws_123',
  key: 'STRIPE_API_KEY',
  value: 'sk_live_51ABC123...', // Decrypted value
  description: 'Production Stripe API key',
  token_type: 'api',
  scope: ['stripe_payments'],
  envs: ['prd'],
  expires_at: 1735689600,
  createdAt: '2024-01-15T10:30:00.000Z',
  updatedAt: '2024-01-15T10:30:00.000Z'
}
```

## Update a Secret

Update an existing secret's value or metadata.

### Parameters

| Field       | Type     | Required | Description                                      |
|-------------|----------|----------|--------------------------------------------------|
| key         | string   | Yes      | The key of the secret to update (path parameter) |
| value       | string   | No       | New secret value (will be re-encrypted)          |
| description | string   | No       | Updated description                              |
| token_type  | string   | No       | Updated token type                               |
| scope       | string[] | No       | Updated scope array                              |
| envs        | string[] | No       | Updated environments array                       |
| expires_at  | number   | No       | Updated expiration timestamp                     |

### Example

```typescript
// Update the value and extend expiration
const updated = await ductape.secrets.update('STRIPE_API_KEY', {
  value: 'sk_live_51NEW_KEY...',
  description: 'Rotated Stripe API key - January 2025',
  expires_at: Math.floor(Date.now() / 1000) + (180 * 24 * 60 * 60) // 180 days
});

console.log('Secret updated:', updated.key);
console.log('New expiration:', new Date(updated.expires_at * 1000));
```

### Update Metadata Only

```typescript
// Update scope and environments without changing the value
const updated = await ductape.secrets.update('STRIPE_API_KEY', {
  scope: ['stripe_payments', 'subscription_service', 'invoice_service'],
  envs: ['dev', 'staging', 'prd']
});
```

## Delete a Secret

Permanently delete a secret from your workspace.

### Parameters

| Field | Type   | Required | Description                      |
|-------|--------|----------|----------------------------------|
| key   | string | Yes      | The key of the secret to delete  |

### Example

```typescript
const deleted = await ductape.secrets.delete('OLD_API_KEY');

if (deleted) {
  console.log('Secret successfully deleted');
}
```

## Revoke a Secret

Revoke a secret to disable it without deleting. The secret remains in your workspace but cannot be used.

### Example

```typescript
const revoked = await ductape.secrets.revoke('COMPROMISED_KEY');

if (revoked) {
  console.log('Secret has been revoked');
}
```

## Best Practices

### Naming Conventions

Use clear, descriptive names with consistent formatting:

```typescript
// Good naming
'STRIPE_API_KEY_PROD'
'SENDGRID_API_KEY'
'DB_PASSWORD_STAGING'
'WEBHOOK_SECRET_GITHUB'

// Avoid
'key1'
'api_key'
'secret'
```

### Token Rotation

Set expiration dates and rotate secrets regularly:

```typescript
// Set 90-day expiration for compliance
const secret = await ductape.secrets.create({
  key: 'PCI_COMPLIANT_KEY',
  value: 'sensitive_value',
  expires_at: Math.floor(Date.now() / 1000) + (90 * 24 * 60 * 60)
});
```

### Scope Restriction

Limit secrets to only the apps that need them:

```typescript
// Restrict Stripe key to payment-related apps only
const secret = await ductape.secrets.create({
  key: 'STRIPE_SECRET',
  value: 'sk_live_xxx',
  scope: ['payment_processor', 'subscription_handler'],
  envs: ['prd'] // Production only
});
```

### Environment Separation

Use different secrets for different environments:

```typescript
// Development
await ductape.secrets.create({
  key: 'STRIPE_KEY_DEV',
  value: 'sk_test_xxx',
  envs: ['dev']
});

// Production
await ductape.secrets.create({
  key: 'STRIPE_KEY_PROD',
  value: 'sk_live_xxx',
  envs: ['prd']
});
```

## Error Handling

```typescript
try {
  const secret = await ductape.secrets.create({
    key: 'MY_SECRET',
    value: 'secret_value'
  });
} catch (error) {
  if (error.response?.status === 409) {
    console.error('Secret with this key already exists');
  } else if (error.response?.status === 403) {
    console.error('You do not have permission to create secrets');
  } else {
    console.error('Failed to create secret:', error.message);
  }
}
```

## Next Steps

- [Using Secrets](./using-secrets.md) - Learn how to reference secrets in your integrations
- [Overview](./overview.md) - Return to the secrets overview
