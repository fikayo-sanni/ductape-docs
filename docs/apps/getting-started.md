---
sidebar_position: 1
---

# Getting Started with Apps

This guide walks you through creating your first App in Ductape, from installation to importing and calling your first action.

## What is an App?

In Ductape, an **App** is a collection of API endpoints from a single provider—like Stripe, Twilio, or your own backend services. Think of it as a wrapper around an API that makes every endpoint callable like a native function in your code.

Once you create an App and import its endpoints (called **Actions**), you can:

- Call any endpoint with a single function call
- Manage authentication across environments
- Configure retry policies and error handling
- Connect the App to Products for orchestration

## Types of Apps

- **Private Apps:** Internal APIs accessible only within your workspace. Use these for microservices and internal tools.
- **Public Apps:** APIs shared with other workspaces. Use these to let other developers integrate with your services.

## Prerequisites

Before you begin, make sure you have:

1. A Ductape account and workspace
2. API documentation (Postman collection or OpenAPI spec) for the service you want to integrate
3. API credentials for the service (API keys, OAuth tokens, etc.)

## Step 1: Install the SDK

Install the Ductape SDK in your project:

```bash
npm install @ductape/sdk
```

## Step 2: Initialize the SDK

Set up the Ductape SDK with your credentials:

```ts
import Ductape from '@ductape/sdk';

const ductape = new Ductape({
  workspace_id: 'your-workspace-id',
  user_id: 'your-user-id',
  private_key: 'your-private-key',
});
```

## Step 3: Create an App

Create a new App to represent your API integration:

```ts
const app = await ductape.app.create({
  app_name: 'Payment Service',
  description: 'Stripe payment processing integration',
  tag: 'stripe-payments',
});

console.log('Created app:', app.tag);
```

### App Configuration Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `app_name` | string | Yes | Human-readable display name |
| `tag` | string | Yes | Unique identifier for the app |
| `description` | string | No | Description of what the app does |

## Step 4: Import Actions

Actions are the individual endpoints your App can call. Import them from a Postman collection or OpenAPI spec:

```ts
import { ImportDocTypes } from '@ductape/sdk/types';
import fs from 'fs';

// Read your Postman collection
const file = fs.readFileSync('./stripe-api.postman_collection.json');

// Import into your app
await ductape.actions.import({
  file,
  type: ImportDocTypes.postmanV21,
  app: 'stripe-payments',
});

console.log('Actions imported successfully');
```

### Supported Import Formats

| Format | Status | Description |
|--------|--------|-------------|
| Postman V2.1 | Available | Modern Postman collection format |
| Postman V2.0 | Coming Soon | Legacy Postman format |
| OpenAPI 3.0 | Coming Soon | OpenAPI/Swagger specification |

### Creating an App and Importing in One Step

You can also create a new App directly from your API documentation:

```ts
// This creates a new app and imports all actions
await ductape.actions.import({
  file,
  type: ImportDocTypes.postmanV21,
  // Omit app to create a new app
});
```

## Step 5: Configure Authentication

Set up authentication so your App can make authenticated API calls:

```ts
await ductape.auth.create({
  app: 'stripe-payments',
  type: 'api_key',
  config: {
    header_name: 'Authorization',
    prefix: 'Bearer',
  },
  envs: [
    {
      slug: 'dev',
      value: 'sk_test_xxxxxxxxxxxxx',
    },
    {
      slug: 'prd',
      value: 'sk_live_xxxxxxxxxxxxx',
    },
  ],
});
```

### Authentication Types

| Type | Use Case |
|------|----------|
| `api_key` | API keys passed in headers or query params |
| `oauth2` | OAuth 2.0 authentication flows |
| `basic` | HTTP Basic authentication |
| `bearer` | Bearer token authentication |

## Step 6: Set Up Environments

Configure environment-specific settings like base URLs:

```ts
await ductape.app.environment.create({
  app: 'stripe-payments',
  envs: [
    {
      slug: 'dev',
      base_url: 'https://api.stripe.com/v1',
      description: 'Development environment with test keys',
    },
    {
      slug: 'staging',
      base_url: 'https://api.stripe.com/v1',
      description: 'Staging environment',
    },
    {
      slug: 'prd',
      base_url: 'https://api.stripe.com/v1',
      description: 'Production environment with live keys',
    },
  ],
});
```

## Step 7: Call an Action

With your App configured, you can now call any imported action:

```ts
// Call the "create-charge" action from your Stripe app
const result = await ductape.actions.run({
  app: 'stripe-payments',
  event: 'create-charge',
  env: 'dev',
  input: {
    amount: 2000, // $20.00
    currency: 'usd',
    source: 'tok_visa',
    description: 'Test charge',
  },
});

console.log('Charge created:', result.data);
```

## Complete Example

Here's a complete example bringing it all together:

```ts
import Ductape from '@ductape/sdk';
import { ImportDocTypes } from '@ductape/sdk/types';
import fs from 'fs';

async function main() {
  // Initialize SDK
  const ductape = new Ductape({
    workspace_id: 'your-workspace-id',
    user_id: 'your-user-id',
    private_key: 'your-private-key',
  });

  // Create the app
  await ductape.app.create({
    app_name: 'Email Service',
    description: 'SendGrid email integration',
    tag: 'sendgrid',
  });

  // Import actions from Postman collection
  const collection = fs.readFileSync('./sendgrid.postman_collection.json');
  await ductape.actions.import({
    file: collection,
    type: ImportDocTypes.postmanV21,
    app: 'sendgrid',
  });

  // Configure authentication
  await ductape.auth.create({
    app: 'sendgrid',
    type: 'bearer',
    envs: [
      { slug: 'dev', value: 'SG.test_api_key' },
      { slug: 'prd', value: 'SG.live_api_key' },
    ],
  });

  // Set up environments
  await ductape.app.environment.create({
    app: 'sendgrid',
    envs: [
      { slug: 'dev', base_url: 'https://api.sendgrid.com/v3' },
      { slug: 'prd', base_url: 'https://api.sendgrid.com/v3' },
    ],
  });

  // Send an email using the imported action
  const result = await ductape.actions.run({
    app: 'sendgrid',
    event: 'send-email',
    env: 'dev',
    input: {
      personalizations: [
        { to: [{ email: 'user@example.com' }] }
      ],
      from: { email: 'noreply@yourapp.com' },
      subject: 'Welcome to our platform!',
      content: [
        { type: 'text/plain', value: 'Thanks for signing up!' }
      ],
    },
  });

  console.log('Email sent:', result.data);
}

main().catch(console.error);
```

## App Resources

Apps support several types of resources that you can configure:

| Resource | Description |
|----------|-------------|
| **Actions** | API endpoints the app can call |
| **Authentication** | Credentials and auth configuration |
| **Environments** | Environment-specific settings |
| **Variables** | Dynamic values passed at runtime |
| **Constants** | Static values used across environments |
| **Webhooks** | Incoming webhook handlers |
| **Retry Policy** | Rules for handling failed requests |

## Next Steps

Now that you have your App set up, learn how to:

- [Manage Apps](./create-app) - Update, delete, and organize your apps
- [Configure Authentication](./authentication) - Advanced auth patterns
- [Set Up Webhooks](./webhooks/) - Handle incoming webhook events
- [Manage Environments](./environments) - Environment configuration
- [Use Variables & Constants](./constants-variables) - Dynamic configuration

## See Also

- [Actions Overview](/actions/overview) - Deep dive into actions
- [Running Actions](/actions/run-actions) - Execute actions in different contexts
- [App Instance Management](./app-instance) - Manage app instances
