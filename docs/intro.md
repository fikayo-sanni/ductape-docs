---
sidebar_position: 1
slug: /
---
# What is Ductape?

Ductape is a framework for defining backend logic—such as database operations, API calls, message queues, notifications, and jobs—as reusable, environment-agnostic components. Write your logic once, configure it for any environment, and run it anywhere—without rewriting for each provider or deployment.

## Why Ductape?

Traditional backend development often means duplicating logic across services, environments, and providers. Ductape solves this by letting you:
- **Write Once, Run Anywhere:** Define your backend logic once and reuse it across development, staging, and production.
- **Swap Providers Easily:** Change databases, APIs, or message brokers without rewriting your business logic.
- **Centralize Configuration:** Manage credentials, endpoints, and environment-specific details in one place.
- **Debug and Monitor Consistently:** Use unified logs and monitoring for all your backend workflows.

## How Does Ductape Work?

Ductape organizes your backend into modular building blocks:
- **Products:** Logical groupings of apps, resources, and workflows.
- **Apps:** Integrations with third-party or internal services.
- **Environments:** Contexts like development, staging, or production.
- **Actions:** Tasks performed by apps (e.g., send an email, run a query).
- **Resources:** Databases, message brokers, storage, notifications, and more.

You define these building blocks in code, configure them for your environments, and Ductape handles the rest.

## Who is Ductape For?

- Teams building complex backend systems that need to scale and adapt quickly.
- Developers who want to avoid duplicating logic for each environment or provider.
- Anyone who wants a consistent, testable, and portable way to manage backend workflows.

## What Problems Does Ductape Solve?

| Problem                          | Without Ductape                        | With Ductape                          |
|-----------------------------------|----------------------------------------|---------------------------------------|
| Add new environment               | Manual config changes, redeploys        | Add config, reuse logic, no rewrites  |
| Integrate new provider            | Write new glue code, test, debug        | Add provider config, logic stays same |
| Debug production issue            | Sift through logs in multiple services  | Unified logs and monitoring           |
| Share logic across apps           | Copy-paste or rewrite code              | Define once, reuse everywhere         |

## What Can You Build With Ductape?

- Multi-environment deployments (dev, staging, prod)
- Workflows that combine APIs, databases, and message queues
- Systems that can swap providers (e.g., Twilio to SendGrid) with zero code changes
- Unified monitoring and debugging for all backend logic

## Next Steps

- [Quickstart](./getting-started/quickstart.md)
- [Products](./products/getting-started.md)
- [Apps](./apps/getting-started.md)
- [Environments](./products/environments.md)
- [Advanced Features](./products/)