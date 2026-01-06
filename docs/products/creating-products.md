---
sidebar_position: 2
---

# Creating Products

Learn how to create and configure products in Ductape.

## Basic Product Creation

Create a product with just a name and description:

```typescript
import Ductape from '@ductape/sdk';

const ductape = new Ductape({
  accessKey: 'your-access-key',
});

const product = await ductape.product.create({
  name: 'My Product',
  description: 'A complete backend system',
});

console.log('Product created:', product.tag);
```

The product tag is automatically generated from the name (e.g., "My Product" becomes "my-product").

## Product Creation Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Display name for the product |
| `description` | string | Yes | Product description |
| `unique` | boolean | No | Whether to ensure unique name (default: false) |

All other product resources (apps, environments, features, etc.) are added after product creation using their respective methods.

## Initializing a Product

After creating a product, initialize it before use:

```typescript
await ductape.product.init('my-product');
```

This:
- Loads the product configuration
- Sets the active product context
- Prepares resources for operations
- Validates product structure

## Complete Example

```typescript
import Ductape from '@ductape/sdk';

async function createProduct() {
  const ductape = new Ductape({
    accessKey: 'your-access-key',
  });

  // Create the product
  const product = await ductape.product.create({
    name: 'E-commerce Platform',
    description: 'Complete e-commerce backend with payments, inventory, and shipping',
  });

  console.log('Product created:', product.tag);
  // Product tag is auto-generated: "ecommerce-platform"

  // Initialize for use
  await ductape.product.init(product.tag);
  console.log('Product initialized');

  // Now you can add resources
  await ductape.product.environment.create({
    env_name: 'production',
    slug: 'prd',
    description: 'Production environment',
    active: true,
  });

  console.log('Environment added');

  // Connect an app
  await ductape.product.app.connect('stripe');
  console.log('App connected');
}

createProduct().catch(console.error);
```

## Best Practices

- **Use descriptive names** - The product tag is auto-generated from the name
- **Write clear descriptions** - Explain what the product does and its purpose
- **Initialize after creation** - Always call `product.init()` before adding resources
- **Add resources incrementally** - Create the product first, then add environments, apps, features, etc.
- **Use unique flag** - Set `unique: true` to ensure no duplicate product names

## Common Patterns

### Creating Multiple Products

```typescript
const products = [
  { name: 'User Service', description: 'User management and authentication' },
  { name: 'Payment Service', description: 'Payment processing and billing' },
  { name: 'Notification Service', description: 'Email, SMS, and push notifications' },
];

for (const config of products) {
  const product = await ductape.product.create(config);
  console.log(`Created: ${product.tag}`);
}
```

### Creating with Environments

```typescript
const product = await ductape.product.create({
  name: 'API Service',
  description: 'Main API backend',
});

await ductape.product.init(product.tag);

// Add environments
const environments = ['dev', 'stg', 'prd'];
for (const slug of environments) {
  await ductape.product.environment.create({
    env_name: slug === 'prd' ? 'production' : slug === 'stg' ? 'staging' : 'development',
    slug,
    description: `${slug.toUpperCase()} environment`,
    active: true,
  });
}
```

## Error Handling

```typescript
try {
  const product = await ductape.product.create({
    name: 'My Product',
    description: 'Product description',
    unique: true,  // Ensure unique name
  });
  console.log('Product created:', product.tag);
} catch (error) {
  if (error.message.includes('already exists')) {
    console.log('Product already exists');
    // Fetch existing product
    const existing = await ductape.product.fetch('my-product');
    await ductape.product.init(existing.tag);
  } else {
    throw error;
  }
}
```

## Next Steps

- [Managing Environments](./environments) - Add dev, staging, and production environments
- [Connecting Apps](./connecting-apps) - Link third-party integrations to your product
- [Updating Products](./updating-products) - Modify product configuration

## See Also

- [Products Overview](./overview) - Understand product architecture
- [Apps](/apps/getting-started) - Create apps to connect to products
- [Features](/features/overview) - Build workflows within products
