# What is Ductape?

Ductape is a backend infrastructure platform that simplifies how developers build, connect, and manage modern applications. Instead of writing boilerplate code for databases, caching, notifications, job queues, and third-party integrations, Ductape provides a unified SDK that handles it all.

## The Problem Ductape Solves

Building production-ready applications requires more than just writing business logic. You need to:

- Connect to multiple databases and manage connection pools
- Integrate with third-party APIs and handle a  uthentication
- Set up caching layers for performance
- Implement job queues for background processing
- Build notification systems across email, SMS, and push
- Handle file storage across cloud providers
- Manage feature flags and quotas
- Implement logging, monitoring, and error handling
- Deal with secrets management and environment configuration

Each of these requires significant engineering effort, and the complexity multiplies when you need to support multiple environments (development, staging, production) with different configurations.

**Ductape eliminates this complexity.** You define your infrastructure once, and Ductape handles the rest.

## Core Concepts

### Products

A **Product** is your application or service in Ductape. It's the top-level container for all your configurations, features, and integrations.

```typescript
import Ductape from '@ductape/sdk';

const ductape = new Ductape({
  workspace_id: 'your-workspace',
  private_key: 'your-key',
});

await ductape.product.init('my-saas-app');
```

### Apps (Integrations)

**Apps** are third-party services you integrate with—Stripe, Twilio, SendGrid, Slack, or any API. Ductape manages authentication, rate limiting, and provides a consistent interface.

```typescript
// Connect to a pre-configured Stripe integration
const stripe = await ductape.product.apps.connect('my-product', 'stripe');

// Use it like any SDK
const customer = await stripe.customers.create({
  email: 'user@example.com',
});
```

### Environments

Every resource in Ductape supports **Environments**. Define different configurations for development, staging, and production without changing your code.

```typescript
// Same code, different environments
await ductape.database.query({
  product: 'my-product',
  env: process.env.ENV, // 'dev', 'stg', or 'prd'
  database: 'users-db',
  query: 'SELECT * FROM users WHERE id = ?',
  params: [userId],
});
```

### Features

**Features** are reusable units of business logic that combine multiple operations. They support validation, rate limiting, caching, and automatic retries.

```typescript
// Define a feature once
await ductape.features.create('my-product', {
  tag: 'create-order',
  name: 'Create Order',
  steps: [
    { action: 'validate-inventory', app: 'inventory-service' },
    { action: 'charge-payment', app: 'stripe' },
    { action: 'send-confirmation', app: 'sendgrid' },
    { action: 'notify-warehouse', app: 'slack' },
  ],
});

// Execute it anywhere
const result = await ductape.features.run({
  product: 'my-product',
  env: 'prd',
  feature: 'create-order',
  input: { userId, items, paymentMethod },
});
```

## Platform Capabilities

### Databases

Connect to any database with a unified query interface. Ductape supports PostgreSQL, MySQL, MongoDB, DynamoDB, Cassandra, and more.

```typescript
// Works with any supported database
const users = await ductape.database.query({
  product: 'my-product',
  env: 'prd',
  database: 'main-db',
  table: 'users',
  where: { status: 'active' },
  limit: 100,
});
```

**Key features:**
- Connection pooling and management
- Automatic retries and failover
- Query logging and performance monitoring
- Schema migrations
- Database actions (reusable query templates)

### Graph Databases

First-class support for graph databases like Neo4j, Amazon Neptune, ArangoDB, and Memgraph.

```typescript
// Find user's social connections
const connections = await ductape.graph.traverse({
  product: 'my-product',
  env: 'prd',
  graph: 'social-graph',
  startNode: { label: 'User', id: userId },
  relationship: 'FOLLOWS',
  depth: 2,
  direction: 'OUTGOING',
});
```

### Vector Databases

Build AI-powered applications with semantic search, RAG, and recommendations using Pinecone, Qdrant, Weaviate, or in-memory vectors.

```typescript
// Semantic search
const results = await ductape.vector.query({
  product: 'my-product',
  env: 'prd',
  tag: 'documents',
  vector: queryEmbedding,
  topK: 10,
  filter: { field: 'category', operator: '$eq', value: 'tech' },
});
```

### Caching

Intelligent caching with Redis, Memcached, or in-memory stores. Ductape handles cache invalidation, TTL management, and fallback strategies.

```typescript
// Automatic caching for any operation
const data = await ductape.caches.get({
  product: 'my-product',
  env: 'prd',
  cache: 'api-cache',
  key: `user:${userId}`,
  fallback: async () => {
    return await fetchUserFromDatabase(userId);
  },
  ttl: 3600,
});
```

### Jobs & Scheduling

Background job processing with support for delayed jobs, recurring schedules, retries, and dead-letter queues.

```typescript
// Schedule a job
await ductape.jobs.create('my-product', {
  tag: 'send-weekly-report',
  schedule: '0 9 * * MON', // Every Monday at 9 AM
  handler: 'generate-report',
  retries: 3,
});

// Or dispatch immediately
await ductape.jobs.dispatch({
  product: 'my-product',
  env: 'prd',
  job: 'process-upload',
  data: { fileId, userId },
});
```

### Notifications

Multi-channel notifications with templating, scheduling, and delivery tracking.

```typescript
// Send across channels
await ductape.notifications.send({
  product: 'my-product',
  env: 'prd',
  template: 'order-confirmation',
  channels: ['email', 'sms', 'push'],
  recipient: {
    email: user.email,
    phone: user.phone,
    deviceToken: user.deviceToken,
  },
  data: { orderId, items, total },
});
```

### Storage

File storage abstraction for AWS S3, Google Cloud Storage, Azure Blob, and local filesystems.

```typescript
// Upload a file
const url = await ductape.storage.upload({
  product: 'my-product',
  env: 'prd',
  storage: 'user-uploads',
  file: fileBuffer,
  path: `users/${userId}/avatar.png`,
  contentType: 'image/png',
});

// Generate signed URLs
const downloadUrl = await ductape.storage.getSignedUrl({
  product: 'my-product',
  env: 'prd',
  storage: 'user-uploads',
  path: `users/${userId}/avatar.png`,
  expiresIn: 3600,
});
```

### Message Brokers

Pub/sub messaging with Kafka, RabbitMQ, AWS SQS/SNS, and Redis Streams.

```typescript
// Publish events
await ductape.messageBrokers.publish({
  product: 'my-product',
  env: 'prd',
  broker: 'events',
  topic: 'user.created',
  message: { userId, email, createdAt },
});
```

### Sessions

Secure session management with JWT support, refresh tokens, and multi-device handling.

```typescript
// Start a session
const session = await ductape.sessions.start({
  product: 'my-product',
  env: 'prd',
  session: 'user-sessions',
  identifier: user.email,
  data: { userId: user.id, role: user.role },
});

// Verify on subsequent requests
const verified = await ductape.sessions.verify({
  product: 'my-product',
  env: 'prd',
  session: 'user-sessions',
  token: request.headers.authorization,
});
```

### Webhooks

Receive and process webhooks from third-party services with automatic verification and retry handling.

```typescript
// Configure webhook handling
await ductape.webhooks.enable({
  product: 'my-product',
  app: 'stripe',
  webhook: 'payment-events',
  events: ['payment_intent.succeeded', 'payment_intent.failed'],
  handler: 'process-payment-webhook',
});
```

### Quotas & Rate Limiting

Protect your resources with configurable quotas and rate limits.

```typescript
// Check quota before expensive operations
const allowed = await ductape.quotas.check({
  product: 'my-product',
  env: 'prd',
  quota: 'api-calls',
  identifier: userId,
  cost: 1,
});

if (!allowed) {
  throw new Error('Rate limit exceeded');
}
```

### Logging & Observability

Automatic logging for all operations with structured data, searchable queries, and integration with your observability stack.

```typescript
// Query logs
const logs = await ductape.logs.query({
  product: 'my-product',
  env: 'prd',
  type: 'feature',
  status: 'fail',
  from: new Date(Date.now() - 24 * 60 * 60 * 1000),
});
```

## Why Choose Ductape?

### 1. Unified SDK — One Interface for Everything

Stop juggling dozens of libraries with different APIs, authentication methods, and error handling patterns. Ductape provides a single, consistent interface for all your infrastructure needs.

**Without Ductape:**
```typescript
// Different libraries, different patterns, different error handling
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import Redis from 'ioredis';
import { Pool } from 'pg';
import Stripe from 'stripe';
import twilio from 'twilio';

const s3 = new S3Client({ region: 'us-east-1', credentials: {...} });
const redis = new Redis({ host: 'localhost', password: '...' });
const db = new Pool({ connectionString: '...' });
const stripe = new Stripe('sk_...', { apiVersion: '...' });
const twilioClient = twilio('AC...', '...');

// Each has different error handling, retry logic, connection management...
```

**With Ductape:**
```typescript
import Ductape from '@ductape/sdk';

const ductape = new Ductape({ workspace_id, private_key });
await ductape.product.init('my-product');

// Consistent interface for everything
await ductape.storage.upload({...});
await ductape.caches.set({...});
await ductape.database.query({...});
await ductape.notifications.send({...});
```

### 2. Environment Management — Zero Code Changes Between Environments

Deploy the same code to development, staging, and production. Ductape handles the configuration differences automatically.

```typescript
// This exact code works in dev, staging, AND production
const users = await ductape.database.query({
  product: 'my-product',
  env: process.env.NODE_ENV, // 'dev', 'stg', or 'prd'
  database: 'users-db',
  table: 'users',
  where: { status: 'active' },
});

// In dev: connects to your local PostgreSQL
// In staging: connects to staging RDS instance
// In production: connects to production RDS with read replicas
```

No more environment-specific config files, no more "it works on my machine" issues, no more production credentials in development.

### 3. Built-in Best Practices — Production-Ready from Day One

Every operation includes enterprise-grade reliability features out of the box:

- **Connection Pooling**: Efficient resource management for all databases
- **Automatic Retries**: Intelligent retry logic with exponential backoff
- **Circuit Breakers**: Prevent cascade failures when services are down
- **Rate Limiting**: Protect your resources and respect third-party API limits
- **Caching**: Reduce latency and costs with intelligent caching layers
- **Logging**: Every operation is traced and searchable

```typescript
// All of this is automatic—no configuration needed
const result = await ductape.features.run({
  product: 'my-product',
  env: 'prd',
  feature: 'process-payment',
  input: { userId, amount },
  // Built-in: retries, circuit breaker, logging, caching, rate limiting
});
```

### 4. Provider Agnostic — Switch Providers Without Rewriting Code

Your infrastructure choices shouldn't lock you into specific vendors. Ductape abstracts away provider-specific details.

```typescript
// Today: PostgreSQL + AWS S3 + Redis
// Tomorrow: MySQL + Google Cloud Storage + Memcached
// Your code: unchanged

await ductape.database.query({
  product: 'my-product',
  env: 'prd',
  database: 'main-db', // Works with any SQL database
  table: 'orders',
  where: { status: 'pending' },
});

await ductape.storage.upload({
  product: 'my-product',
  env: 'prd',
  storage: 'uploads', // Works with S3, GCS, Azure, or local
  file: buffer,
  path: 'invoices/invoice-123.pdf',
});
```

Migrate from one provider to another by changing configuration—not code.

### 5. Observability — Debug Anything in Minutes

Every operation is automatically logged with full context. No more adding log statements everywhere or wondering what went wrong.

```typescript
// Query recent failures
const failures = await ductape.logs.query({
  product: 'my-product',
  env: 'prd',
  status: 'fail',
  from: new Date(Date.now() - 60 * 60 * 1000), // Last hour
});

// Each log includes:
// - Full request/response data
// - Execution time
// - Error messages and stack traces
// - User context
// - Environment details
```

**Dashboard Features:**
- Real-time operation monitoring
- Performance metrics and trends
- Cost tracking per feature/operation
- Alert configuration
- Full-text search across all logs

### 6. Security First — Enterprise-Grade Protection Built In

Security isn't an afterthought—it's foundational:

- **Secrets Management**: Never hardcode credentials again. Use `{{SECRET_NAME}}` syntax and Ductape injects them at runtime.
- **Encrypted Communications**: All data in transit is encrypted with TLS 1.3
- **Audit Logging**: Every operation is logged for compliance and debugging
- **Role-Based Access**: Control who can access what at the workspace, product, and environment level
- **Environment Isolation**: Development credentials can never accidentally access production data

```typescript
// Secrets are injected at runtime—never exposed in code
await ductape.vector.create({
  product: 'my-product',
  tag: 'embeddings',
  envs: [
    {
      slug: 'prd',
      apiKey: '{{PINECONE_API_KEY}}', // Injected from secure vault
      endpoint: '{{PINECONE_ENDPOINT}}',
    },
  ],
});
```

### 7. Developer Experience — Build Faster, Debug Easier

Ductape is designed by developers, for developers:

- **TypeScript-First**: Full type safety with intelligent autocomplete
- **Consistent Patterns**: Learn once, use everywhere
- **Helpful Errors**: Clear error messages that tell you what went wrong and how to fix it
- **Local Development**: In-memory providers for databases and caches make local development instant
- **Comprehensive Docs**: Every feature documented with examples

### 8. Cost Efficiency — Pay for What You Use

- **No Idle Resources**: Ductape manages connection pools and resources efficiently
- **Built-in Caching**: Reduce expensive database and API calls automatically
- **Usage Visibility**: See exactly what's costing you money with detailed breakdowns
- **Quota Management**: Set limits to prevent unexpected bills

```typescript
// Set quotas to control costs
await ductape.quotas.configure({
  product: 'my-product',
  quota: 'ai-api-calls',
  limits: {
    daily: 10000,
    perUser: 100,
  },
  action: 'reject', // or 'throttle' or 'alert'
});
```

## Getting Started

### Installation

```bash
npm install @ductape/sdk
```

### Quick Start

```typescript
import Ductape from '@ductape/sdk';

// Initialize the SDK
const ductape = new Ductape({
  workspace_id: process.env.DUCTAPE_WORKSPACE_ID,
  private_key: process.env.DUCTAPE_PRIVATE_KEY,
});

// Initialize your product
await ductape.product.init('my-product');

// Start building!
const users = await ductape.database.query({
  product: 'my-product',
  env: 'prd',
  database: 'main-db',
  table: 'users',
  where: { status: 'active' },
});
```

## Use Cases

### SaaS Applications

Build multi-tenant applications with isolated data, per-tenant quotas, and usage tracking.

### AI/ML Products

Power RAG pipelines, semantic search, and recommendations with integrated vector databases and caching.

### E-commerce Platforms

Handle payments, inventory, notifications, and order processing with reliable background jobs.

### API Platforms

Build APIs with built-in rate limiting, authentication, logging, and third-party integrations.

### Real-time Applications

Use message brokers and webhooks for real-time updates and event-driven architectures.

## Next Steps

- [Quick Start Guide](/getting-started/quickstart)
- [Core Concepts](/concepts/products)
- [Database Guide](/databases/overview)
- [Vector Database Guide](/vectors/overview)
- [API Reference](/api/overview)

---

Ductape handles the infrastructure so you can focus on what matters: building great products.
