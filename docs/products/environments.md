---
sidebar_position: 4
---

# Product Environments

Ductape provides the capability to set up product environments to support development, testing, and production configurations within your projects. Product environments help manage different app settings, ensuring that products run smoothly in varied contexts, facilitating a seamless coordination of app functionalities.

## Creating Product Environments

To set up a new environment, use the `create` function on the `product.env` instance. Below is an example and a table of required fields for creating a product environment.

```typescript
import ductape from "@ductape/sdk";

const data = {
    env_name: "develop",
    slug: "dev",
    description: "Development environment",
};
const environment = await ductape.product.environments.create(data); // Create product environment
```

| Field        | Type     | Description                                                    | Required |
|-------------|----------|----------------------------------------------------------------|----------|
| `env_name`  | `string` | Name of the environment                                        | Yes      |
| `slug`      | `string` | Unique 3-letter identifier for the environment (lowercase)     | Yes      |
| `description` | `string` | Brief description of the environment                           | No       |

## Updating a Product Environment

To update an existing environment, specify the `slug` for the environment you wish to update along with the new environment details.

```typescript
import ductape from "@ductape/sdk";

const slug = "prd"; // Environment slug
const data = {
    env_name: "Production",
    description: "Production environment",
};
const updatedEnvironment = await ductape.product.environments.update(slug, data); // Update environment
```

## Fetching Environments

You can retrieve all configured environments for your product or fetch a specific one by its `slug`.

### Fetch All Environments

```typescript
const environments = await ductape.product.environments.fetchAll(); // Fetch all product environments
```

### Fetch a Single Environment

```typescript
const slug = "prd";
const environment = await ductape.product.environments.fetch(slug); // Fetch specific environment by slug
```

These functions allow easy retrieval and management of environments within the Ductape platform, ensuring you can view, update, or configure each environment as required.