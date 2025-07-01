---
sidebar_position: 1
---

# Getting Started with Products

A **Product** in Ductape is a logical grouping of apps, resources, and workflows that together deliver a specific backend capability or workflow. Products let you combine, configure, and orchestrate all the components your application needs.

## Creating a Product

**Example:**
```typescript
const product = await ductape.product.create({
  name: "Payments Service",
  tag: "payments_service",
  description: "Handles all payment processing"
});
```

## Product Resources
Products can include many types of resources. Each resource is managed and configured as part of the product:

- **[Apps](../apps/getting-started.md):** Integrations with third-party or internal services.
- **[Environments](./environments.md):** Contexts like development, staging, or production.
- **[Databases](./databases/):** Connect and manage relational or NoSQL databases.
- **[Notifications](./notifications/):** Send push, email, callback, or SMS notifications.
- **[Jobs](./jobs/):** Define and schedule background or recurring tasks.
- **[Cloud Functions](./features/):** Reusable logic written in code.
- **[Caches](./../getting-started/enable-caching.md):** Store and reuse results of expensive operations.
- **[Features](./features/):** Orchestrate complex workflows and business logic.
- **[Quotas](./quotas/):** Share load between providers.
- **[Fallbacks](./fallbacks/):** Automatically switch providers if one fails.
- **[Message Brokers](./message-broker/):** Integrate with Kafka, RabbitMQ, SQS, etc.
- **[Storage](./storage/):** Manage files and data storage.
- **[Healthchecks](./../getting-started/healthchecks.md):** Monitor system health and responsiveness.

Each resource can be added, configured, and managed through the product interface, allowing you to build robust, scalable backend systems.

## Next Steps
- [Apps](../apps/getting-started.md)
- [Environments](./environments.md)
- [Databases](./databases/)
- [Notifications](./notifications/)
- [Jobs](./jobs/)
- [Features](./features/)
- [Enable Caching](../getting-started/enable-caching.md)