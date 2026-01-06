---
sidebar_position: 1
---

# Products Overview

Products in Ductape are the central organizational units for your backend systems. A product represents a complete application or service and contains all the resources needed to build and run it—including apps, environments, features, databases, and more.

## What is a Product?

A product is a complete backend system that:
- **Organizes resources** - Groups apps, environments, sessions, features, and other components
- **Manages environments** - Supports multiple deployment environments (dev, staging, production)
- **Connects integrations** - Links third-party apps and APIs to your product
- **Orchestrates workflows** - Coordinates features, jobs, and actions
- **Tracks versions** - Maintains configuration and state across deployments

Think of a product as your entire application backend—everything from authentication to payment processing to data storage, all managed in one place.

## Product Structure

Every product contains:

| Component | Description |
|-----------|-------------|
| **Basic Info** | Name, tag, description, workspace association |
| **Apps** | Connected third-party integrations (Stripe, SendGrid, etc.) |
| **Environments** | Deployment environments (dev, staging, production) |
| **Features** | Workflow orchestrations |
| **Sessions** | User session management |
| **Databases** | Database configurations and connections |
| **Graphs** | Graph database configurations |
| **Jobs** | Scheduled background tasks |
| **Caches** | Caching configurations |
| **Storage** | File storage configurations |
| **Notifications** | Notification channels and templates |
| **Quotas** | Usage limits and rate limiting |
| **Fallbacks** | Provider failover configurations |
| **Message Brokers** | Event streaming and pub/sub |

## Quick Start

```typescript
import Ductape from '@ductape/sdk';

const ductape = new Ductape({
  accessKey: 'your-access-key',
});

// Create a product
const product = await ductape.product.create({
  name: 'E-commerce Platform',
  description: 'Complete e-commerce backend system',
});

console.log('Product created:', product.tag);
// Tag is auto-generated: "ecommerce-platform"

// Initialize the product for use
await ductape.product.init(product.tag);

console.log('Product initialized!');
```

## Core Operations

### Creating Products
Create a new product with just a name and description:

```typescript
const product = await ductape.product.create({
  name: 'My Product',
  description: 'Product description',
});

console.log('Product tag:', product.tag);
// Tag is auto-generated from name: "my-product"
```

### Initializing Products
Before using a product, initialize it to set the active context:

```typescript
await ductape.product.init(product.tag);
```

This loads the product configuration and makes it available for operations. All subsequent resource operations (environments, apps, features, etc.) will apply to this initialized product.

### Fetching Products
Retrieve product information:

```typescript
// Get all products in workspace
const products = await ductape.product.fetchAll();

// Get specific product
const product = await ductape.product.fetch('my-product');
```

### Updating Products
Modify product configuration:

```typescript
await ductape.product.update('my-product', {
  description: 'Updated description',
  name: 'New Product Name',
});
```

## Product Resources

Once a product is created and initialized, you can manage its resources:

### Environments
```typescript
await ductape.product.environment.create({
  env_name: 'production',
  slug: 'prd',
  description: 'Production environment',
  active: true,
});
```

### Apps
```typescript
// Connect an existing app
await ductape.product.app.connect('stripe');

// Add app configuration
await ductape.product.app.add({
  access_tag: 'stripe-payments',
  app: 'stripe',
  envs: [],
});
```

### Webhooks
```typescript
// Get webhooks for a product app
const webhooks = await ductape.product.webhook.fetchAllForProductApp('stripe-payments');

// Generate webhook link
const link = await ductape.product.webhook.generateLink({
  app: 'stripe',
  event: 'payment.succeeded',
  env: 'prd',
});
```

## Best Practices

- **Use descriptive tags** - Product tags are used throughout the SDK; make them meaningful
- **Initialize before use** - Always call `product.init()` before working with product resources
- **Organize by environment** - Use environments to separate dev, staging, and production
- **Start minimal** - Create products with empty arrays; add resources as needed
- **Version control** - Export product configurations to version control
- **Document structure** - Maintain documentation of your product architecture

## Product Lifecycle

```
Create → Initialize → Add Resources → Deploy → Update → Monitor
```

1. **Create** - Define basic product structure
2. **Initialize** - Load product for active use
3. **Add Resources** - Connect apps, create environments, configure features
4. **Deploy** - Push to environments
5. **Update** - Modify configuration as needed
6. **Monitor** - Track performance and health

## Next Steps

- [Creating Products](./creating-products) - Detailed guide on product creation
- [Managing Environments](./environments) - Set up dev, staging, and production
- [Connecting Apps](./connecting-apps) - Link third-party integrations
- [Product Webhooks](./webhooks) - Configure webhook endpoints

## See Also

- [Apps](/apps/getting-started) - Create and manage apps
- [Features](/features/overview) - Build product workflows
- [Sessions](/sessions/overview) - Manage user sessions
