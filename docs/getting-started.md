---
sidebar_position: 2
title: Getting Started
---

# Getting Started with Ductape

This guide covers the four tools you use day-to-day: the Workbench, the CLI, the TypeScript SDK, and the MCP server.

## Prerequisites
- Node.js 18 or later
- A Ductape account (sign up at [cloud.ductape.app](https://cloud.ductape.app))



## 1. Workbench

Everything starts in the Workbench. You create your product, configure environments, and add or provision the resources your application will use. The CLI and SDK read from what you configure here.

### Sign up

Go to [cloud.ductape.app](https://cloud.ductape.app) and create an account. After signing in you will land in your default workspace.

### Create a product

A product is the top-level container for your environments, resources, features, and access keys. Give it a name and a tag (lowercase, no spaces). See the [Products docs](https://docs.ductape.app/products/creating-products) for details.

### Add environments

Add at least two environments inside your product, for example `dev` and `prd`. Each environment holds its own resource connections and access keys. See [Environments](https://docs.ductape.app/products/environments).

### Add and provision resources

From your product, add the resources your application needs:

- **Databases** (PostgreSQL, MySQL, MongoDB, DynamoDB) — [docs](https://docs.ductape.app/databases/relational/getting-started)
- **Graphs** (Neo4j, Neptune, ArrangoDB, Memgraph) — [docs](https://docs.ductape.app/databases/graphs/getting-started)
- **Storage** (AWS S3, GCS, Azure Blob) — [docs](https://docs.ductape.app/storage/overview)
- **Message brokers** (Kafka, SQS, RabbitMQ, Redis, Pub/Sub, NATS)
- **Vector stores** (Pinecone, Qdrant, Weaviate)

To provision resources through a cloud account (AWS, GCP, Azure, MongoDB Atlas, Neo4j Aura), set up a cloud connection first. See [Cloud Connections](https://docs.ductape.app/cloud/connections) and [Cloud-linked resources](https://docs.ductape.app/cloud/cloud-linked-components).

### Copy your access key

Go to **Settings > API Keys** inside your workspace and copy the access key. You will need it when initializing the SDK and logging in from the CLI.



## 2. CLI

The CLI lets you manage resources, generate code snippets, and interact with the proxy from your terminal.

### Install

```bash
npm install --global @ductape/cli
```

### Login

```bash
ductape login              # authenticates against cloud.ductape.app
ductape whoami             # confirm active user and workspace
ductape workspaces list    # switch workspace if needed
```

### Link your project folder

Run this inside the folder that contains your application code. It associates the folder with a product in your workspace.

```bash
ductape init --link
```

### Common commands

```bash
ductape resources storage list
ductape resources databases list
ductape cloud connections list
ductape cloud resources list --connection <tag>
ductape generate snippet storage upload -l typescript
ductape secrets list
ductape products list
```

Full command reference: [CLI docs](https://docs.ductape.app/cli).



## 3. SDK

The SDK is the runtime integration layer in your application. It connects to the databases, storage, brokers, sessions, and other resources you configured in the Workbench. Server-side only; For Typescript Node.js 18 or later required.

### Install

```bash
npm install @ductape/sdk
```

### Initialize

```ts
import Ductape from '@ductape/sdk';

const ductape = new Ductape({
  accessKey: process.env.DUCTAPE_ACCESS_KEY!,
  product:   'my-product',  // product tag from the Workbench
  env:       'prd',         // environment slug
});
```

### Connect data stores at startup

Call these once when your application starts. The SDK reuses connections across all subsequent requests.

```ts
await ductape.databases.connect({ database: 'main-db' });
await ductape.graph.connect({ graph: 'main-graph' });
```

### Examples

```ts
// Database query
const rows = await ductape.databases.query({
  table: 'orders',
  where: { status: 'pending' },
  limit: 50,
});

// File upload
await ductape.storage.upload({
  storage:  'main-storage',
  fileName: 'reports/q1.pdf',
  buffer:   fileBuffer,
  mimeType: 'application/pdf',
});

// Session
const session = await ductape.sessions.start({
  tag:  'user-session',
  data: { userId: 'u1' },
});

// Third-party app action
const result = await ductape.api.run({
  app:    'stripe',
  action: 'create-charge',
  input:  { amount: 1000, currency: 'usd' },
});
```

### Available namespaces

| Namespace | Description |
|---|---|
| `ductape.databases` | Relational and document databases |
| `ductape.graph` | Graph databases (Neo4j) |
| `ductape.vector` | Vector search (Pinecone, Qdrant, Weaviate) |
| `ductape.storage` | File storage (S3, GCS, Azure Blob) |
| `ductape.events` | Message brokers (Kafka, SQS, RabbitMQ, Redis, Pub/Sub, NATS) |
| `ductape.sessions` | JWT sessions: start, verify, refresh, revoke |
| `ductape.caches` | Cache get, set, and invalidate |
| `ductape.notifications` | Email, SMS, and push notifications |
| `ductape.jobs` | Background jobs |
| `ductape.agents` | LLM agents with tools and memory |
| `ductape.models` | LLM inference |
| `ductape.api` | Third-party app actions |
| `ductape.feature` | Multi-step product features |
| `ductape.secrets` | Secrets per environment |
| `ductape.warehouse` | Unified query across relational, graph, and vector |

Full SDK reference: [SDK docs](https://docs.ductape.app/products/overview).



## 4. MCP Server

The MCP server exposes Ductape SDK operations as tools that an MCP client such as Cursor can call. It is stateless and requires your **Publishable Key** on every request.

### Install

```bash
npm install @ductape/mcp
```

### Configure in Cursor

Add to `~/.cursor/mcp.json` (or a project-level `.cursor/mcp.json`). Restart Cursor after saving.

```json
{
  "mcpServers": {
    "ductape": {
      "command": "npx",
      "args": ["-y", "@ductape/mcp"],
      "env": {
        "DUCTAPE_PUBLISHABLE_KEY": "your-publishable-key-here",
        "DUCTAPE_WORKSPACE": "your-workspace-id-here"
      }
    }
  }
}
```

Both values are under **Tokens → Publishable key** in the Workbench. Setting them in `env` means the server is authenticated and workspace-scoped — no per-call credential passing needed.

### Tools exposed

| Tool | What it does |
|---|---|
| `ductape_execute` | Calls any SDK module method (databases, storage, vector, and others) via the backend proxy. Runtime operations only. |
| `ductape_generate_payload` | Returns an executable payload template with schema metadata for a given product action. |
| `ductape_generate_snippet` | Returns a ready-to-copy SDK snippet in TypeScript or Python alongside the payload. |
| `ductape_cli` | Runs any Ductape CLI command for administrative operations (create/update products, apps, environments, apply sessions/notifications/events, run DB migrations). Uses the user's local CLI session — no key required. |

Full reference: [MCP Server docs](https://docs.ductape.app/mcp-server/getting-started).



## Typical first-project flow

1. Sign up at [cloud.ductape.app](https://cloud.ductape.app) and create a workspace.
2. Create a product with at least one environment (`dev` and `prd` are a good start).
3. Add databases, storage, graphs, or brokers and link them to each environment via cloud connections or manual credentials.
4. Copy your access key from **Tokens > SDK Access Keys**.
5. Install the CLI: `npm install --global @ductape/cli`, then `ductape login` and `ductape init --link` in your project folder.
6. Install the SDK: `npm install @ductape/sdk`. Initialize it with your access key, product tag, and environment. Connect to your resources at startup.
7. Add the MCP server to Cursor: `npm install @ductape/mcp` and configure `~/.cursor/mcp.json`. Use `ductape_generate_snippet` to get ready-to-use code as you build.
