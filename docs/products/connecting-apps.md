---
sidebar_position: 4
---

# Connecting Apps to Products

Learn how to connect third-party apps and integrations to your products.

## Overview

Apps represent third-party services (like Stripe, SendGrid, Twilio) that your product integrates with. Connecting apps to products allows you to use their actions within your features and workflows.

## Connecting an App

First, connect an app to create an access tag:

```typescript
import Ductape from '@ductape/sdk';

const ductape = new Ductape({
  accessKey: 'your-access-key',
});

await ductape.product.init('my-product');

// Connect the app
const access = await ductape.product.app.connect('stripe');
console.log('App connected with access tag:', access);
```

## Adding App Configuration

After connecting, add environment-specific configuration:

```typescript
await ductape.product.app.add({
  access_tag: 'stripe-payments',
  app: 'stripe',
  envs: [
    {
      slug: 'prd',
      base_url: 'https://api.stripe.com',
      request_type: 'JSON',
      active: true,
    },
    {
      slug: 'dev',
      base_url: 'https://api.stripe.com',
      request_type: 'JSON',
      active: true,
    },
  ],
});
```

## App Configuration Fields

| Field | Type | Description |
|-------|------|-------------|
| `access_tag` | string | Unique identifier for this app instance |
| `app` | string | The base app tag |
| `envs` | array | Environment-specific configurations |

### Environment Fields

| Field | Type | Description |
|-------|------|-------------|
| `slug` | string | Environment slug (dev, stg, prd) |
| `base_url` | string | API base URL for this environment |
| `request_type` | string | Request format (JSON, XML, etc.) |
| `active` | boolean | Whether this environment is active |

## Fetching Connected Apps

### Get All Apps
```typescript
const apps = await ductape.product.app.fetchAll();

apps.forEach(app => {
  console.log(`${app.access_tag} (${app.app})`);
  console.log(`Environments: ${app.envs.map(e => e.slug).join(', ')}`);
});
```

### Get Specific App
```typescript
const app = await ductape.product.app.fetch('stripe-payments');
console.log('App configuration:', app);
```

## Updating App Configuration

```typescript
await ductape.product.app.update('stripe-payments', {
  envs: [
    {
      slug: 'prd',
      base_url: 'https://api.stripe.com/v2',  // Updated version
      request_type: 'JSON',
      active: true,
    },
  ],
});
```

## Complete Example

```typescript
import Ductape from '@ductape/sdk';

async function setupProductApps() {
  const ductape = new Ductape({
    accessKey: 'your-access-key',
  });

  await ductape.product.init('ecommerce-platform');

  // Connect payment provider
  await ductape.product.app.connect('stripe');
  await ductape.product.app.add({
    access_tag: 'stripe-payments',
    app: 'stripe',
    envs: [
      {
        slug: 'prd',
        base_url: 'https://api.stripe.com',
        request_type: 'JSON',
        active: true,
      },
      {
        slug: 'dev',
        base_url: 'https://api.stripe.com',
        request_type: 'JSON',
        active: true,
      },
    ],
  });

  // Connect email service
  await ductape.product.app.connect('sendgrid');
  await ductape.product.app.add({
    access_tag: 'sendgrid-email',
    app: 'sendgrid',
    envs: [
      {
        slug: 'prd',
        base_url: 'https://api.sendgrid.com',
        request_type: 'JSON',
        active: true,
      },
      {
        slug: 'dev',
        base_url: 'https://api.sendgrid.com',
        request_type: 'JSON',
        active: true,
      },
    ],
  });

  // Connect SMS service
  await ductape.product.app.connect('twilio');
  await ductape.product.app.add({
    access_tag: 'twilio-sms',
    app: 'twilio',
    envs: [
      {
        slug: 'prd',
        base_url: 'https://api.twilio.com',
        request_type: 'JSON',
        active: true,
      },
    ],
  });

  console.log('All apps connected!');
}

setupProductApps().catch(console.error);
```

## Using Connected Apps

Once connected, use apps in your workflows:

```typescript
// Run an action from a connected app
await ductape.actions.run({
  env: 'prd',
  product: 'ecommerce-platform',
  app: 'stripe-payments',
  event: 'create-charge',
  input: {
    body: {
      amount: 2000,
      currency: 'usd',
    },
  },
});
```

## Best Practices

- **Use descriptive access tags** - `stripe-payments`, not just `stripe`
- **Configure all environments** - Set up dev, staging, and production
- **Keep credentials separate** - Use secrets for API keys per environment
- **Version base URLs** - Include API versions when relevant
- **Document integrations** - Note which apps are used where

## Multiple Instances

You can connect the same app multiple times with different configurations:

```typescript
// US Stripe account
await ductape.product.app.connect('stripe');
await ductape.product.app.add({
  access_tag: 'stripe-us',
  app: 'stripe',
  envs: [/* US config */],
});

// EU Stripe account
await ductape.product.app.connect('stripe');
await ductape.product.app.add({
  access_tag: 'stripe-eu',
  app: 'stripe',
  envs: [/* EU config */],
});
```

## See Also

- [Products Overview](./overview) - Product architecture
- [Apps](/apps/getting-started) - Create and manage apps
- [Actions](/actions/overview) - Use app actions in workflows
- [Secrets](/secrets/overview) - Manage API credentials
