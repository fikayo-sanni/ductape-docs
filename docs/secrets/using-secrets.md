---
sidebar_position: 3
---

# Using Secrets

Learn how to reference your workspace secrets in Ductape configurations using the `$Token{}` syntax.

## The $Token{} Syntax

Ductape provides a special syntax to reference secrets in your configurations without exposing the actual values. When you use `$Token{key}`, Ductape automatically resolves and decrypts the secret at runtime.

### Basic Usage

```
$Token{SECRET_KEY}
```

Replace `SECRET_KEY` with the key of your secret (the exact key you used when creating the secret).

## Where to Use Secrets

### In App Authentication

Reference secrets when configuring app authentication:

```typescript
await ductape.product.apps.add({
  access_tag: 'stripe_app',
  envs: [
    {
      app_env_slug: 'prd',
      product_env_slug: 'prd',
      variables: [],
      auth: [
        {
          auth_tag: 'api_key_auth',
          data: {
            api_key: '$Token{STRIPE_API_KEY}'  // Secret reference
          }
        }
      ]
    }
  ]
});
```

### In Environment Variables

Use secrets in app environment variables:

```typescript
await ductape.product.apps.add({
  access_tag: 'email_service',
  envs: [
    {
      app_env_slug: 'prd',
      product_env_slug: 'prd',
      variables: [
        { key: 'SENDGRID_KEY', value: '$Token{SENDGRID_API_KEY}' },
        { key: 'FROM_EMAIL', value: 'noreply@example.com' }
      ],
      auth: []
    }
  ]
});
```

### In Action Headers

Reference secrets in custom headers:

```typescript
const result = await ductape.action.run({
  env: 'prd',
  product: 'my_product',
  app: 'custom_api',
  event: 'fetch_data',
  input: {
    headers: {
      'X-API-Key': '$Token{CUSTOM_API_KEY}',
      'X-Webhook-Secret': '$Token{WEBHOOK_SIGNING_SECRET}'
    },
    body: {
      data: 'payload'
    }
  }
});
```

### In Webhook Configurations

Secure your webhooks with secret references:

```typescript
await ductape.product.webhooks.create({
  name: 'GitHub Webhook',
  tag: 'github_webhook',
  signing_secret: '$Token{GITHUB_WEBHOOK_SECRET}',
  // ... other configuration
});
```

## Copying Secret References

In the Ductape Workbench, you can quickly copy the token reference syntax:

1. Navigate to **Workspace Settings** > **Secrets**
2. Find the secret you want to reference
3. Click the **copy icon** next to the secret name
4. The `$Token{SECRET_KEY}` syntax is copied to your clipboard
5. Paste it wherever you need to use the secret

## Runtime Resolution

When Ductape processes a configuration containing `$Token{}` references:

1. **Detection**: The system identifies all `$Token{}` patterns
2. **Validation**: Checks if the referenced secrets exist and are accessible
3. **Scope Check**: Verifies the secret's scope includes the current app
4. **Environment Check**: Confirms the secret is available in the current environment
5. **Decryption**: Retrieves and decrypts the secret value
6. **Substitution**: Replaces the `$Token{}` reference with the actual value

## Scope and Environment Restrictions

Secrets respect their scope and environment restrictions at runtime:

### Scope Example

```typescript
// Secret created with limited scope
await ductape.secrets.create({
  key: 'STRIPE_KEY',
  value: 'sk_live_xxx',
  scope: ['payment_app']  // Only accessible by payment_app
});

// This works - payment_app is in scope
await ductape.action.run({
  app: 'payment_app',
  // ...
  input: {
    headers: { 'Authorization': 'Bearer $Token{STRIPE_KEY}' }
  }
});

// This fails - analytics_app is not in scope
await ductape.action.run({
  app: 'analytics_app',
  // ...
  input: {
    headers: { 'Authorization': 'Bearer $Token{STRIPE_KEY}' }  // Error!
  }
});
```

### Environment Example

```typescript
// Secret created for production only
await ductape.secrets.create({
  key: 'PROD_DATABASE_URL',
  value: 'postgres://prod-server/db',
  envs: ['prd']
});

// This works - running in production
await ductape.action.run({
  env: 'prd',
  // ...
});

// This fails - secret not available in dev
await ductape.action.run({
  env: 'dev',
  // ...
  input: {
    body: { db_url: '$Token{PROD_DATABASE_URL}' }  // Error!
  }
});
```

## Multiple Secrets in One Configuration

You can use multiple secret references in the same configuration:

```typescript
await ductape.product.apps.add({
  access_tag: 'multi_service_app',
  envs: [
    {
      app_env_slug: 'prd',
      product_env_slug: 'prd',
      variables: [
        { key: 'DB_HOST', value: '$Token{DATABASE_HOST}' },
        { key: 'DB_USER', value: '$Token{DATABASE_USER}' },
        { key: 'DB_PASS', value: '$Token{DATABASE_PASSWORD}' },
        { key: 'REDIS_URL', value: '$Token{REDIS_CONNECTION_STRING}' },
        { key: 'S3_KEY', value: '$Token{AWS_ACCESS_KEY}' },
        { key: 'S3_SECRET', value: '$Token{AWS_SECRET_KEY}' }
      ],
      auth: [
        {
          auth_tag: 'oauth',
          data: {
            client_id: '$Token{OAUTH_CLIENT_ID}',
            client_secret: '$Token{OAUTH_CLIENT_SECRET}'
          }
        }
      ]
    }
  ]
});
```

## Troubleshooting

### Secret Not Found

```
Error: Secret 'MY_SECRET' not found
```

**Solution**: Verify the secret exists in your workspace and the key is spelled correctly (case-sensitive).

### Scope Mismatch

```
Error: Secret 'STRIPE_KEY' is not accessible by app 'other_app'
```

**Solution**: Update the secret's scope to include the app, or use a different secret.

### Environment Mismatch

```
Error: Secret 'PROD_KEY' is not available in environment 'dev'
```

**Solution**: Update the secret's `envs` array to include the environment, or use an environment-specific secret.

### Expired Secret

```
Error: Secret 'OLD_KEY' has expired
```

**Solution**: Update the secret with a new value and expiration date, or create a new secret.

## Security Considerations

1. **Never log secret values**: Avoid logging configurations that contain resolved secrets
2. **Use narrow scopes**: Only grant access to apps that genuinely need the secret
3. **Set expirations**: Use `expires_at` to enforce regular rotation
4. **Audit usage**: Review which apps and environments use each secret
5. **Rotate compromised secrets**: If a secret is exposed, immediately update or delete it

## Next Steps

- [Managing Secrets](./managing-secrets.md) - Learn CRUD operations for secrets
- [Overview](./overview.md) - Return to the secrets overview
