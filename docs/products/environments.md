---
sidebar_position: 3
---

# Product Environments

Manage deployment environments for your products.

## Overview

Product environments allow you to maintain separate configurations for development, staging, and production. Each environment can have its own settings, credentials, and endpoints while sharing the same product structure.

## Creating an Environment

```typescript
import Ductape from '@ductape/sdk';

const ductape = new Ductape({
  workspace_id: 'your-workspace-id',
  user_id: 'your-user-id',
  private_key: 'your-private-key',
});

await ductape.product.init('my-product');

await ductape.product.environment.create({
  env_name: 'production',
  slug: 'prd',
  description: 'Production environment',
  active: true,
});
```

## Environment Fields

| Field | Type | Description |
|-------|------|-------------|
| `env_name` | string | Full environment name |
| `slug` | string | Short identifier (3 chars recommended) |
| `description` | string | Environment description |
| `active` | boolean | Whether environment is active |

## Common Environments

### Development
```typescript
await ductape.product.environment.create({
  env_name: 'development',
  slug: 'dev',
  description: 'Development environment for testing',
  active: true,
});
```

### Staging
```typescript
await ductape.product.environment.create({
  env_name: 'staging',
  slug: 'stg',
  description: 'Staging environment for pre-production testing',
  active: true,
});
```

### Production
```typescript
await ductape.product.environment.create({
  env_name: 'production',
  slug: 'prd',
  description: 'Production environment',
  active: true,
});
```

## Fetching Environments

### Get All Environments
```typescript
const environments = await ductape.product.environment.fetchAll();

environments.forEach(env => {
  console.log(`${env.env_name} (${env.slug}): ${env.active ? 'active' : 'inactive'}`);
});
```

### Get Specific Environment
```typescript
const production = await ductape.product.environment.fetch('prd');
console.log('Production environment:', production);
```

## Updating Environments

```typescript
await ductape.product.environment.update('dev', {
  description: 'Updated development environment',
  active: false,
});
```

## Using Environments

Environments are referenced when running actions, features, and other operations:

```typescript
// Run action in production
await ductape.actions.run({
  env: 'prd',
  product: 'my-product',
  app: 'stripe',
  event: 'create-charge',
  input: { amount: 1000 },
});

// Run feature in development
await ductape.features.run({
  env: 'dev',
  product: 'my-product',
  feature_tag: 'process-payment',
  input: { userId: '123' },
});
```

## Best Practices

- **Use standard slugs** - `dev`, `stg`, `prd` are conventional
- **Keep active** - Only deactivate environments temporarily
- **Document differences** - Note what's different between environments
- **Test progression** - Test in dev → staging → production
- **Separate credentials** - Use different API keys per environment

## See Also

- [Products Overview](./overview) - Product architecture
- [Creating Products](./creating-products) - Create new products
- [Connecting Apps](./connecting-apps) - Link apps to products
