---
title: From Libraries to Reusable Backend Components
description: How Ductape moves teams from function-level reuse to product-level components—databases, API apps, and integrations—with accurate SDK examples.
---

Engineers love libraries because they enable real reusability. Instead of rewriting the same code repeatedly, teams rely on shared packages for logging, auth helpers, HTTP clients, validation, and database access. Those libraries solve a clear need: avoid starting from scratch on routine tasks and keep behavior consistent across projects.

The desire for reuse runs deep. Once a team benefits from a solid auth library or HTTP client, it's natural to want reuse at a higher level—not just functions, but whole backend capabilities.

## Moving from functions to complete components

That's where Ductape fits. Rather than reusing individual helpers, Ductape lets you define and reuse **complete backend components** on a **Product**: databases, third-party API apps, storage, messaging, notifications, and more. Each component includes its environments, credentials (via secrets), configuration, and runtime behavior.

You define a component once—in the Workbench or via the SDK—then any codebase that initializes the SDK with the same **product** and **env** uses that configuration. You don't rewire auth, environment URLs, or integration setup in every repo.

### Third-party apps (e.g. Stripe)

Ductape does not expose helpers like `defineConnection()` or `oauth()`. You connect an app to your product, configure credentials once, and run **actions** through the SDK:

```typescript
import Ductape from '@ductape/sdk';

const ductape = new Ductape({
  accessKey: process.env.DUCTAPE_ACCESS_KEY!,
  product: 'my-app',
  env: 'staging',
});

// Configure once — secrets are resolved at runtime, not hardcoded
ductape.api.config({
  app: 'stripe',
  env: 'staging',
  credentials: {
    'headers:Authorization': '$Secret{STRIPE_API_KEY}',
  },
});

// Use the same configured app from any service
const charge = await ductape.api.run({
  app: 'stripe',
  action: 'create-charge',
  input: { amount: 1000, currency: 'usd' },
});

const customer = await ductape.api.run({
  app: 'stripe',
  action: 'create-customer',
  input: { email: 'user@example.com' },
});
```

Apps are wired to your product in the Workbench (or via builder APIs). Runtime code stays thin: `api.config` + `api.run`, with OAuth supported through `ductape.api.oauth()` when an app requires it.

### Databases

Same pattern: define the database component on the product, then connect and query with a consistent SDK surface:

```typescript
// Define once (builder API — typically at setup or via Workbench)
await ductape.databases.create({
  product_tag: 'my-app',
  tag: 'primary-db',
  name: 'Primary Database',
  type: 'postgresql',
  envs: [
    {
      slug: 'staging',
      connection_url: 'postgresql://staging-host:5432/myapp',
    },
    {
      slug: 'production',
      connection_url: 'postgresql://prod-host:5432/myapp',
    },
  ],
});

// In application code — set product/env on the constructor, connect once
const ductape = new Ductape({
  accessKey: process.env.DUCTAPE_ACCESS_KEY!,
  product: 'my-app',
  env: 'production',
});

await ductape.databases.connect({
  database: 'primary-db',
});

const { records } = await ductape.databases.query({
  table: 'customers',
  where: { status: 'active' },
  limit: 50,
});

await ductape.databases.delete({
  table: 'customers',
  where: { id: customerId },
});
```

Connection pooling, retries, and logging are handled by the SDK and platform—you don't pass a custom `pooling: { ... }` block in a `createConnection()` call because that API doesn't exist. You register the component and call `connect`, `query`, `insert`, and `delete` on `ductape.databases`.

## The vision with Ductape

Ductape turns backend integrations and services into reusable, portable **product components**. Payment apps, databases, notification channels, storage buckets, and job processors can be defined centrally per product and environment, then consumed from TypeScript, Go, Java, .NET, NestJS, or client SDKs with the same tags and env slugs.

Developers focus on product logic while relying on components that already encode environment-specific config and credential handling. When you rotate a secret or change a connection URL in the Workbench, consuming apps pick it up without redeploying integration boilerplate in every codebase.

The useful analogy isn't "import an npm package and get Stripe's SDK back." It's **define infrastructure once on the Product, run it everywhere with one SDK**—similar in spirit to how Docker standardizes deployment, but for backend components and their configuration rather than for shipping container images alone.

---

## Corrections from the original draft

| Original | Issue | Fix |
|----------|--------|-----|
| `defineConnection({ provider: "stripe", auth: oauth(), ... })` | Not a Ductape API | `ductape.api.config()` + `ductape.api.run()` |
| `await stripe.customers.create(...)` | Implies a generated Stripe SDK on the connection object | Actions run via `ductape.api.run({ app, action, input })` |
| `createConnection({ name, type, auth, pooling })` | Not a Ductape API | `ductape.databases.create()` + `ductape.databases.connect()` |
| `await primaryDb.query("SELECT ...")` | Wrong API shape | `ductape.databases.query({ table, where, ... })` |
| "Shared state layer any codebase initializes" | Overstates a global runtime | **Product-level configuration** resolved by the SDK per `accessKey` + `product` + `env` |
| `stripe.customers.transfer` | Non-standard / illustrative | Use named actions like `create-charge`, `create-customer` |

## Related docs

- [Getting Started](/getting-started) — install, `api.config`, `api.run`, database `connect`
- [What is Ductape?](/introduction/what-is-ductape) — products, apps, environments
- [Setting up a Database](/workbench/products/database) — Workbench flow
