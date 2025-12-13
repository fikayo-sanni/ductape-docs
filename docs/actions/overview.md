---
sidebar_position: 1
---

# Getting Started with Actions

This guide explains what Actions are in Ductape and how to work with them effectively.

## What is an Action?

An **Action** is an individual API endpoint that performs a specific task—like sending an email, charging a payment, or creating a user. When you import an App into Ductape, each endpoint in that App becomes an Action you can call.

Think of Actions as the building blocks of your integrations:

- **Apps** are collections of endpoints (like the Stripe API)
- **Actions** are individual endpoints (like "Create Charge" or "Refund Payment")
- **Products** orchestrate multiple Actions together into workflows

## Prerequisites

Before working with Actions, make sure you have:

1. A Ductape account and workspace
2. An App created with imported endpoints
3. The Ductape SDK installed in your project

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

## Step 3: Import Actions

Actions are imported from API documentation like Postman collections or OpenAPI specs. You can import them into an existing App or create a new App during import.

### Import into an Existing App

```ts
import { ImportDocTypes } from '@ductape/sdk/types';
import fs from 'fs';

// Read your Postman collection
const file = fs.readFileSync('./api.postman_collection.json');

// Import into an existing app
await ductape.actions.import({
  file,
  type: ImportDocTypes.postmanV21,
  app: 'my-app',
});

console.log('Actions imported successfully');
```

### Create a New App and Import

Omit the `app` to create a new App from the collection:

```ts
await ductape.actions.import({
  file,
  type: ImportDocTypes.postmanV21,
  // App will be created from collection metadata
});
```

### Supported Import Formats

| Format | Status | Description |
|--------|--------|-------------|
| Postman V2.1 | Available | Modern Postman collection format |
| Postman V2.0 | Coming Soon | Legacy Postman format |
| OpenAPI 3.0 | Coming Soon | OpenAPI/Swagger specification |

## Step 4: Explore Available Actions

Before running Actions, you can list all available Actions in an App:

```ts
// Set the app context
await ductape.app.init({ app: 'stripe-payments' });

// Fetch all actions
const actions = await ductape.actions.fetchAll();

actions.forEach((action) => {
  console.log(`${action.name} (${action.tag}): ${action.method} ${action.resource}`);
});
```

### Fetch a Specific Action

Get details about a single Action by its tag:

```ts
const action = await ductape.actions.fetch('create-charge');

console.log('Action:', action.name);
console.log('Method:', action.method);
console.log('Endpoint:', action.resource);
console.log('Description:', action.description);
```

## Step 5: Run an Action

Call any Action using `ductape.actions.run()`:

```ts
const result = await ductape.actions.run({
  env: 'dev',
  product: 'my-product',
  app: 'stripe-payments',
  action: 'create-charge',
  input: {
    amount: 2000,
    currency: 'usd',
    source: 'tok_visa'
  }
});

console.log('Charge created:', result);
```

### Flat Input Format

The SDK uses a **flat input format** where fields are automatically resolved to the correct location (body, params, query, or headers) based on the action's schema:

```ts
// Fields are auto-resolved based on the action schema
input: {
  amount: 2000,        // auto-resolves to body.amount
  currency: 'usd',     // auto-resolves to body.currency
  userId: '123'        // auto-resolves to params.userId
}
```

### Using Prefixes for Conflicts

If a key exists in multiple locations, use prefix syntax:

| Prefix | Target Location | Example |
|--------|-----------------|---------|
| `body:` | Request body | `'body:id': 'item_456'` |
| `params:` | Route parameters | `'params:id': 'user_123'` |
| `query:` | Query parameters | `'query:limit': 10` |
| `headers:` | HTTP headers | `'headers:X-Custom': 'value'` |

```ts
// Example with mixed input using prefixes where needed
await ductape.actions.run({
  env: 'dev',
  product: 'my-product',
  app: 'my-api',
  action: 'get-user-orders',
  input: {
    userId: '123',                          // auto-resolved to params
    status: 'pending',                       // auto-resolved to query
    limit: 5,                                // auto-resolved to query
    'headers:X-Request-ID': 'abc'            // explicit header
  }
});
```

## Step 6: Update Action Configuration

After importing Actions, you can update their configuration:

```ts
await ductape.actions.update('send-email', {
  description: 'Send transactional email via SendGrid',
  resource: '/v3/mail/send',
  method: 'POST',
});
```

## Complete Example

Here's a complete workflow showing how to work with Actions:

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

  // Import Actions from a Postman collection
  const collection = fs.readFileSync('./api.postman_collection.json');
  await ductape.actions.import({
    file: collection,
    type: ImportDocTypes.postmanV21,
    app: 'my-api',
  });

  // List all imported Actions
  await ductape.app.init({ app: 'my-api' });
  const actions = await ductape.actions.fetchAll();
  console.log(`Imported ${actions.length} actions`);

  // Update an Action's configuration
  await ductape.actions.update('create-user', {
    description: 'Create a new user account',
  });

  // Run the Action
  const result = await ductape.actions.run({
    env: 'dev',
    product: 'my-product',
    app: 'my-api',
    action: 'create-user',
    input: {
      name: 'John Doe',
      email: 'john@example.com'
    }
  });

  console.log('User created:', result);
}

main().catch(console.error);
```

## Action Lifecycle

Understanding the Action lifecycle helps you build reliable integrations:

```
Import → Configure → Validate → Run → Handle Response
```

1. **Import**: Actions are imported from Postman/OpenAPI specs
2. **Configure**: Update descriptions, validation rules, and settings
3. **Validate**: Set up input validation for data integrity
4. **Run**: Execute the Action with your input
5. **Handle**: Process the response or handle errors

## Next Steps

Now that you understand Actions, learn how to:

- [Run Actions](./run-actions) - Advanced execution patterns with caching and retries
- [Manage Actions](./managing-actions) - Update and organize your Actions
- [Data Validation](./validation) - Validate inputs before execution

## See Also

- [Getting Started with Apps](/apps/getting-started) - Create Apps and import Actions
- [Sessions](/sessions/overview) - Inject dynamic user data into Actions
- [Caching](/caching/overview) - Cache Action responses for better performance
