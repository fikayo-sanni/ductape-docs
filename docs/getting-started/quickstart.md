---
sidebar_position: 1
---
# Quickstart

This guide will walk you through your first Ductape project, step by step. By the end, you'll have created a product, added an app, set up environments, and run your first action—all using Ductape's consistent, reusable approach.

## Step 1: Install the SDK

```bash
npm install @ductape/sdk
```

## Step 2: Create a Product
A Product is a logical grouping of apps, resources, and workflows.

| Field         | Type           | Required | Default | Description                                 | Example           |
|---------------|----------------|----------|---------|---------------------------------------------|-------------------|
| name          | string         | Yes      |         | Name of the product                         | Payments Service  |
| description   | string         | No       |         | Description of the product                  | Handles payments  |

**Example:**
```typescript
const product = await ductape.product.create({
  name: "Payments Service",
  description: "Handles all payment processing"
});
```

## Step 3: Add an App
Apps are integrations with third-party or internal services.

| Field         | Type           | Required | Default | Description                                 | Example           |
|---------------|----------------|----------|---------|---------------------------------------------|-------------------|
| access_tag    | string         | Yes      |         | Unique tag for app access                   | email_app_tag     |
| envs          | array          | Yes      |         | List of environment configurations          | See below         |

**Example:**
```typescript
const appAccess = await ductape.product.apps.connect("email_app_tag");
await ductape.product.apps.add({
  access_tag: appAccess.access_tag,
  envs: [
    {
      app_env_slug: "dev",
      product_env_slug: "dev",
      variables: [{ key: "api_key", value: "dev-key" }],
      auth: [{ auth_tag: "api_auth", data: { token: "dev-token" } }]
    }
  ]
});
```

## Step 4: Add an Environment
Environments let you run the same logic in different contexts (dev, staging, prod).

| Field         | Type           | Required | Default | Description                                 | Example           |
|---------------|----------------|----------|---------|---------------------------------------------|-------------------|
| env_name      | string         | Yes      |         | Name of the environment                     | Development       |
| slug          | string         | Yes      |         | Unique identifier (lowercase, 3+ chars)     | dev               |
| description   | string         | No       |         | Description of the environment              | Dev environment   |

**Example:**
```typescript
const environment = await ductape.product.environments.create({
  env_name: "Development",
  slug: "dev",
  description: "Development environment"
});
```

## Step 4.5: Enable Caching (Optional but Recommended)

Caching in Ductape allows you to store and quickly retrieve the results of expensive operations, such as API calls or database queries. This improves performance, reduces costs, and is essential for efficient job processing and reliable healthchecks.

### Why Enable Caching?
- **Performance:** Avoids repeating expensive operations by reusing cached results.
- **Jobs:** Scheduled/background jobs can use cached data to avoid redundant work and speed up processing.
- **Healthchecks:** Caching helps track the health and responsiveness of your system by storing recent results and reducing load on critical services.

### How to Enable Caching
To enable caching, you need to create a cache resource for your product and reference its tag when running actions or jobs.

| Field      | Type   | Required | Default | Description                        | Example        |
|------------|--------|----------|---------|------------------------------------|----------------|
| name       | string | Yes      |         | Name of the cache                  | Main Cache     |
| tag        | string | Yes      |         | Unique identifier for the cache    | main_cache     |
| expiry     | number | Yes      |         | Expiry time in milliseconds        | 60000          |
| description| string | No       |         | Description of the cache           | For API calls  |

**Example:**
```typescript
const cache = await ductape.product.caches.create({
  name: "Main Cache",
  tag: "main_cache",
  expiry: 60000, // 1 minute
  description: "Cache for API call results"
});
```

To use the cache when running an action, include the `cache` field in your `IActionProcessorInput`:

```typescript
const result = await ductape.processor.action.run({
  env: "dev",
  product: "payments_service",
  app: "email_app_tag",
  event: "send_email",
  cache: "main_cache", // Enable caching for this action
  input: {
    body: {
      to: "user@example.com",
      subject: "Hello from Ductape!",
      body: "This is a test email."
    }
  }
});
```

**Tip:**
- Use caching for any operation that is expensive, slow, or called frequently.
- For jobs and healthchecks, caching helps avoid unnecessary retries and provides a reliable snapshot of recent system state.

## Step 5: Run an Action

To run an action, use the `processor.action.run` method. This method requires an `IActionProcessorInput` object, which specifies the environment, product, app, event (action tag), and input data.

### IActionProcessorInput
| Field   | Type   | Required | Default | Description | Example |
|---------|--------|----------|---------|-------------|---------|
| env     | string | Yes      |         | Environment slug (e.g., 'dev', 'prd') | dev |
| product | string | Yes      |         | Product tag or ID | payments_service |
| app     | string | Yes      |         | App access tag | email_app_tag |
| event   | string | Yes      |         | Action tag (as defined in the app) | send_email |
| input   | object | Yes      |         | Action input (see below) | `{"body": {"to": "user@example.com"}}` |
| cache   | string | No       |         | Cache tag (if using caching) |   |
| retries | number | No       |         | Number of retries |   |
| session | object | No       |         | Session info (tag, token) |   |

### IActionRequest (input field)
| Field   | Type   | Required | Default | Description | Example |
|---------|--------|----------|---------|-------------|---------|
| query   | object | No       |         | Query parameters | `{"page": 1}` |
| params  | object | No       |         | URL parameters | `{"id": 123}` |
| body    | object | No       |         | Request body | `{"to": "user@example.com", "subject": "Hello", "body": "Welcome!"}` |
| headers | object | No       |         | HTTP headers | `{"Authorization": "Bearer token"}` |
| input   | object | No       |         | Additional input | `{"meta": "value"}` |

**Example:**
```typescript
const result = await ductape.processor.action.run({
  env: "dev",
  product: "payments_service",
  app: "email_app_tag",
  event: "send_email",
  input: {
    body: {
      to: "user@example.com",
      subject: "Hello from Ductape!",
      body: "This is a test email."
    }
  }
});
```

This will execute the `send_email` action for the specified app in the given environment and product, passing the provided input to the action.

## Next Steps
- [Products](../products/getting-started.md)
- [Apps](../apps/getting-started.md)
- [Environments](../products/environments.md)