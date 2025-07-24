---
sidebar_position: 1
---

# Getting Started with Products

A **Product** in Ductape is a container for everything your backend needs.

It starts with an integration. You create a Product and connect one or more Apps to it. You can then call the endpoints from those Apps like functions in your code. 

But it doesn't stop there. You can also add other backend components, like databases, notifications, jobs, and more, and use them the same way, as callable functions within your logic. 

Each Product can include:

- **[Apps](../apps/getting-started.md):** Integrations with third-party or internal services.
- **[Environments](./environments.md):** Contexts like development, staging, or production.
- **[Databases](./databases/database.md):** Connect and manage relational or NoSQL databases.
- **[Notifications](./notifications/notifications.md):** Send push, email, callback, or SMS notifications.
- **[Jobs](./jobs/):** Define and schedule background or recurring tasks.
- **[Caches](./../getting-started/enable-caching.md):** Store and reuse results of expensive operations.
- **[Features](./features/getting-started.md):** Orchestrate complex workflows and business logic.
- **[Quotas](./quotas/getting-started.md):** Share load between providers.
- **[Fallbacks](./fallbacks/getting-started.md):** Automatically switch providers if one fails.
- **[Message Brokers](./message-broker/message-brokers.md):** Integrate with Kafka, RabbitMQ, SQS, etc.
- **[Storage](./storage/):** Manage files and data storage.
- **[Healthchecks](./healthchecks.md):** Monitor system health and responsiveness.

A Product lets you bring all these elements together and orchestrate them to build reliable, reusable backend systems

## Creating a Product 

**Example:**
```typescript
const product = await ductape.product.create({
  name: "Payments Service",
  tag: "payments_service",
  description: "Handles all payments processing"
});
```

## Next Steps
- [Apps](../apps/getting-started.md)
- [Environments](./environments.md)
- [Databases](./databases/database.md)
- [Notifications](./notifications/)
- [Jobs](./jobs/)
- [Features](./features/getting-started.md)
- [Enable Caching](../getting-started/enable-caching.md)