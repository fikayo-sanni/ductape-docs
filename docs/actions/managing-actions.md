---
sidebar_position: 3
---

# Managing Actions

After importing Actions into your App, you can update their configuration, fetch details, and organize them effectively.

## Prerequisites

Before managing Actions, ensure you have:

1. The Ductape SDK installed and initialized
2. An App with imported Actions

```ts
import Ductape from '@ductape/sdk';

const ductape = new Ductape({
  workspace_id: 'your-workspace-id',
  user_id: 'your-user-id',
  private_key: 'your-private-key',
});

// Set the app context
await ductape.app.init({ app: 'my-app' });
```

## Fetching Actions

### Fetch All Actions

Retrieve all Actions within the current App:

```ts
const actions = await ductape.action.fetchAll();

actions.forEach((action) => {
  console.log(`${action.name} (${action.tag})`);
  console.log(`  Method: ${action.method}`);
  console.log(`  Endpoint: ${action.resource}`);
  console.log(`  Description: ${action.description}`);
});
```

### Fetch a Specific Action

Get details about a single Action by its tag:

```ts
const action = await ductape.action.fetch('send-email');

console.log('Action Details:');
console.log('  Name:', action.name);
console.log('  Tag:', action.tag);
console.log('  Method:', action.method);
console.log('  Resource:', action.resource);
console.log('  Description:', action.description);
```

## Updating Actions

Update an Action's configuration using the `update` function. You can modify the description, resource path, name, or HTTP method.

```ts
const updatedAction = await ductape.action.update('send-email', {
  description: 'Send transactional emails via SendGrid API',
  resource: '/v3/mail/send',
  method: 'POST',
});

console.log('Updated:', updatedAction.tag);
```

### Updatable Fields

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Human-readable display name |
| `description` | string | Explanation of what the Action does |
| `resource` | string | API endpoint path |
| `method` | string | HTTP method (GET, POST, PUT, DELETE, etc.) |

### Update Examples

#### Update Description Only

```ts
await ductape.action.update('create-customer', {
  description: 'Creates a new customer in the payment system',
});
```

#### Update Endpoint Path

```ts
await ductape.action.update('list-products', {
  resource: '/api/v2/products',
});
```

#### Update HTTP Method

```ts
await ductape.action.update('update-user', {
  method: 'PATCH', // Changed from PUT to PATCH
});
```

#### Multiple Updates

```ts
await ductape.action.update('webhook-handler', {
  name: 'Stripe Webhook Handler',
  description: 'Processes incoming Stripe webhook events',
  resource: '/webhooks/stripe',
  method: 'POST',
});
```

## Best Practices

### Use Descriptive Names

Give Actions clear, action-oriented names:

```ts
// Good
await ductape.action.update('send-email', {
  name: 'Send Transactional Email',
});

// Avoid
await ductape.action.update('send-email', {
  name: 'Email', // Too vague
});
```

### Document Your Actions

Always add meaningful descriptions:

```ts
await ductape.action.update('charge-customer', {
  description: 'Charges the customer for a one-time payment. Requires a valid payment method attached to the customer.',
});
```

### Keep Resources Up to Date

When APIs change versions, update your resource paths:

```ts
// Migrate to v2 API
await ductape.action.update('list-users', {
  resource: '/api/v2/users',
});
```

## Next Steps

- [Data Validation](./validation) - Set up validation rules for Action inputs
- [Running Actions](./run-actions) - Execute Actions with different input patterns
- [Actions Overview](./overview) - Return to the Actions overview

## See Also

- [Getting Started with Apps](/apps/getting-started) - Create and import Apps
- [Importing Actions](/apps/import-actions) - Import Actions from Postman or OpenAPI
