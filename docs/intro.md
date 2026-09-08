---
sidebar_position: 1
slug: /
---
# Why Ductape

Ductape is a framework for defining backend logic such as database operations, API calls, message queues, notifications, and jobs as reusable, environment-agnostic components. Write your logic once, configure it for any environment, and run it anywhere without rewriting for each provider or deployment.

Backend features rarely consist of a single API call.

A checkout might charge a customer, update inventory, create an order, publish an event, and send a notification. A KYC flow might call several providers, store results, retry failures, and update your database.

Normally, all of that logic gets scattered across services, SDKs, environment configuration, and provider-specific code.

**Ductape gives that logic a runtime.**

Ductape lets you define backend capabilities - API calls, database operations, queues, storage, notifications, and jobs - and compose them into reusable backend features.

You write the logic once. Ductape handles the configuration, credentials, execution, retries, observability, and environment-specific wiring.

## What Ductape gives you

### Compose backend features

Combine APIs, databases, queues, storage, and other capabilities into complete application features without rebuilding the underlying integrations each time.

### Keep business logic separate from infrastructure

Your feature logic doesn't need to know where credentials live, which environment it is running in, or how a particular provider is configured.

### Change infrastructure without rewriting features

Move between providers or environments while keeping the feature logic intact.

### Run consistently across environments

The same backend components can run in development, staging, and production with environment-specific configuration managed separately from your code.

### Get execution built in

Ductape provides the runtime concerns backend features need: retries, timeouts, error handling, logging, metrics, tracing, and dependency coordination.

## How Ductape works

Ductape organizes backend systems into a few composable primitives:

- **Apps:** API integrations whose endpoints become callable backend functions.
- **Resources:** Databases, message brokers, storage, notifications, and other infrastructure.
- **Actions:** Operations performed against apps and resources.
- **Features:** Backend workflows composed from actions.
- **Environments:** Development, staging, production, and other runtime contexts.

You define these components in code. Ductape connects them to the right infrastructure and provides the runtime required to execute them.

## Built for developers - and the agents building software for them

Ductape's primitives give developers a structured vocabulary for backend systems.

That same structure makes backend infrastructure easier for AI coding agents to understand and operate: instead of generating arbitrary integration code for every feature, an agent can work with defined backend capabilities and compose them into application logic.

## What you can build

- Checkout and payment flows
- Order and inventory systems
- KYC and verification pipelines
- Notification systems
- Data synchronization
- ETL and ingestion features
- Provider integrations
- Event-driven application features
- Scheduled and asynchronous jobs

**Build the backend feature. Let Ductape handle the machinery underneath it.**

## Next steps

- [Get started with Ductape](./getting-started.md)
- [Create an app](./apps/create-app.md)
- [Build reusable features](./features/overview.mdx)
- [Configure product environments](./apps/product-environments.md)
