---
sidebar_position: 4
---

# Product Environments

A **Product Environment** in Ductape defines a context (such as development, staging, or production) in which your product runs. Environments let you manage different settings, credentials, and integrations for each context, ensuring your product works smoothly everywhere.

## Environment Structure
| Field        | Type     | Required | Description                                                    | Example           |
|--------------|----------|----------|----------------------------------------------------------------|-------------------|
| env_name     | string   | Yes      | Name of the environment                                        | Development       |
| slug         | string   | Yes      | Unique 3-letter identifier for the environment (lowercase)     | dev               |
| description  | string   | No       | Brief description of the environment                           | Dev environment   |
| active       | boolean  | Yes      | Whether the environment is active                              | true              |
| envs         | array    | No       | App environment mappings (see app docs)                        |                   |
| auth         | object   | No       | Authentication config for the environment                      |                   |

## Creating a Product Environment
To set up a new environment, use the `create` function on the `product.environments` instance.

**Example:**
```typescript
const environment = await ductape.product.environments.create({
  env_name: "Development",
  slug: "dev",
  description: "Development environment"
});
```

## Updating a Product Environment
To update an existing environment, specify the `slug` and the new details.

**Example:**
```typescript
const updatedEnvironment = await ductape.product.environments.update("prd", {
  env_name: "Production",
  description: "Production environment"
});
```

## Fetching Environments
You can retrieve all environments for your product or fetch a specific one by its `slug`.

**Fetch All:**
```typescript
const environments = await ductape.product.environments.fetchAll();
```

**Fetch One:**
```typescript
const environment = await ductape.product.environments.fetch("prd");
```

## Why Use Environments?
- Separate development, staging, and production settings
- Safely test changes before deploying to production
- Manage credentials and integrations for each context

## Next Steps
- [Products](./getting-started.md)
- [Apps](../apps/getting-started.md)
- [Enable Caching](../getting-started/enable-caching.md)