---
sidebar_position: 2
---

# Getting Started

This guide walks you through setting up Ductape in your project and making your first API call.

Code examples below use tabs for **TypeScript**, **Java**, **Go**, and **.NET** where the raw `@ductape/sdk` applies. **NestJS** examples ([NestJS docs](/nestjs/overview)) are **TypeScript only**.

## CLI

For local development, login, linking a project, and managing resources from the terminal, see the **[Ductape CLI](./cli)** (`ductape login`, `ductape resources storage list`, `ductape start`).

## Installation

Install the Ductape SDK for your language:

```bash
npm install @ductape/sdk@0.1.8
```

## Initialize the SDK

Create a Ductape instance with your workspace credentials. Set **product** and **env** on the constructor so you do not repeat them on every call (see [SDK runtime defaults](/sdk/runtime-defaults)):

```ts
import Ductape from '@ductape/sdk';

const ductape = new Ductape({
  accessKey: process.env.DUCTAPE_ACCESS_KEY!,
  product: 'my-product',
  env: 'dev',
});
```

You can find your access key in the Ductape dashboard under **Settings > API Keys**.

## Your First Action

Once you've [added an app](/docs/apps/getting-started) and connected it to a [product](/docs/products/overview), you can run actions:

```ts
const result = await ductape.api.run({
  app: 'stripe',
  action: 'create-charge',
  input: {
    amount: 1000,
    currency: 'usd',
  }
});

console.log(result);
```

## Project Setup

For real applications, initialize Ductape once and share the instance across your project. This ensures credentials, OAuth tokens, and database connections are available everywhere.

### Create a Ductape Module

```ts title="src/lib/ductape.ts"
import Ductape from '@ductape/sdk';

const env = process.env.NODE_ENV === 'production' ? 'prd' : 'dev';

// Create a single instance — product/env defaults live on the constructor only
export const ductape = new Ductape({
  accessKey: process.env.DUCTAPE_ACCESS_KEY!,
  product: 'my-product',
  env,
});

// Configure action credentials once at startup
ductape.api.config({
  app: 'stripe',
  credentials: {
    'headers:Authorization': '$Secret{STRIPE_API_KEY}',
  }
});

ductape.api.config({
  app: 'twilio',
  credentials: {
    'headers:Authorization': '$Secret{TWILIO_AUTH_TOKEN}',
  }
});
```

### Use It Anywhere

Import the shared instance in any file:

```ts title="src/services/payment.service.ts"
import { ductape } from '../lib/ductape';

export async function createCharge(amount: number, currency: string) {
  return ductape.api.run({
    app: 'stripe',
    action: 'create-charge',
    input: { amount, currency }
  });
}
```

```ts title="src/services/notification.service.ts"
import { ductape } from '../lib/ductape';

export async function sendSMS(to: string, message: string) {
  return ductape.api.run({
    app: 'twilio',
    action: 'send-sms',
    input: { to, body: message }
  });
}
```

## Connecting Data Stores

Ductape supports relational databases, graph databases, and vector databases. Establish connections at application startup:

```ts title="src/lib/ductape.ts"
import Ductape from '@ductape/sdk';

export const ductape = new Ductape({
  accessKey: process.env.DUCTAPE_ACCESS_KEY!,
  product: 'my-product',
  env: process.env.NODE_ENV === 'production' ? 'prd' : 'dev',
});

const env = process.env.NODE_ENV === 'production' ? 'prd' : 'dev';

export async function initializeDuctape() {
  // Configure API credentials
  ductape.api.config({
    app: 'stripe',
    credentials: {
      'headers:Authorization': '$Secret{STRIPE_API_KEY}',
    }
  });

  // Connect to relational database
  await ductape.databases.connect({
    database: 'users-db',
  });

  // Connect to graph database
  await ductape.graph.connect({
    graph: 'social-graph',
  });

  // Connect to vector database
  await ductape.vector.connect({
    tag: 'embeddings',
  });
}
```

Then use them in your services:

```ts title="src/services/user.service.ts"
import { ductape } from '../lib/ductape';

export async function getActiveUsers() {
  return ductape.databases.find({
    table: 'users',
    where: { status: 'active' },
    limit: 100,
  });
}

export async function createUser(name: string, email: string) {
  return ductape.databases.insert({
    table: 'users',
    records: [{ name, email, status: 'active', created_at: new Date() }],
    returning: true,
  });
}
```

```ts title="src/services/social.service.ts"
import { ductape } from '../lib/ductape';

export async function getUserConnections(userId: string) {
  return ductape.graph.traverse({
    startNodeId: userId,
    direction: 'OUTGOING',
    relationshipTypes: ['FRIENDS_WITH', 'FOLLOWS'],
    maxDepth: 1,
  });
}
```

```ts title="src/services/search.service.ts"
import { ductape } from '../lib/ductape';

export async function searchSimilarProducts(queryEmbedding: number[]) {
  return ductape.vector.query({
    tag: 'embeddings',
    vector: queryEmbedding,
    topK: 10,
    includeMetadata: true,
  });
}
```

## Framework Examples

### Express.js

```ts title="src/ductape.ts"
import Ductape from '@ductape/sdk';

const env = process.env.NODE_ENV === 'production' ? 'prd' : 'dev';

export const ductape = new Ductape({
  accessKey: process.env.DUCTAPE_ACCESS_KEY!,
  product: 'my-product',
  env,
});

export async function initializeDuctape() {
  ductape.api.config({
    app: 'stripe',
    credentials: {
      'headers:Authorization': '$Secret{STRIPE_API_KEY}',
    }
  });

  await ductape.databases.connect({
    database: 'users-db',
  });

  console.log('Ductape initialized');
}
```

```ts title="src/app.ts"
import express from 'express';
import { initializeDuctape } from './ductape';

const app = express();

initializeDuctape().then(() => {
  app.listen(3000, () => {
    console.log('Server running on port 3000');
  });
});
```

### NestJS

Use the official **`@ductape/nestjs`** integration package for decorators and modules instead of wrapping the SDK manually. Full docs: [NestJS overview](/nestjs/overview). Examples below are **TypeScript only**.

```bash
npm install @ductape/nestjs @ductape/sdk
```

```ts title="app.module.ts"
import { Module } from '@nestjs/common';
import { DuctapeModule, DuctapeDatabaseModule } from '@ductape/nestjs';
import { PaymentsModule } from './payments/payments.module';

@Module({
  imports: [
    DuctapeModule.forIntegration({
      accessKey: process.env.DUCTAPE_ACCESS_KEY!,
      product: 'my-product',
      env: process.env.NODE_ENV === 'production' ? 'prd' : 'dev',
    }),
    DuctapeDatabaseModule.register({ tags: ['users-db'] }),
    PaymentsModule,
  ],
})
export class AppModule {}
```

```ts title="payments/payments.service.ts"
import { Injectable } from '@nestjs/common';
import { Api, ApiConfig } from '@ductape/nestjs';

@Injectable()
@ApiConfig({
  product: 'my-product',
  app: 'stripe',
  env: 'prd',
  credentials: {
    'headers:Authorization': '$Secret{STRIPE_API_KEY}',
  },
})
export class PaymentsService {
  @Api({ app: 'stripe', action: 'create-charge' })
  createCharge(input: { amount: number; currency: string }) {
    return input;
  }
}
```

### Next.js

```ts title="src/lib/ductape.ts"
import Ductape from '@ductape/sdk';

const env = process.env.NODE_ENV === 'production' ? 'prd' : 'dev';

let ductapeInstance: Ductape | null = null;
let initialized = false;

export function getDuctape(): Ductape {
  if (!ductapeInstance) {
    ductapeInstance = new Ductape({
      accessKey: process.env.DUCTAPE_ACCESS_KEY!,
      product: 'my-product',
      env,
    });

    ductapeInstance.api.config({
      app: 'stripe',
      credentials: {
        'headers:Authorization': '$Secret{STRIPE_API_KEY}',
      }
    });
  }

  return ductapeInstance;
}

export async function initializeDuctape(): Promise<Ductape> {
  const ductape = getDuctape();

  if (!initialized) {
    await ductape.databases.connect({
      database: 'users-db',
    });

    initialized = true;
  }

  return ductape;
}
```

```ts title="src/app/api/payments/route.ts"
import { getDuctape } from '@/lib/ductape';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { amount, currency } = await request.json();
  const ductape = getDuctape();

  const result = await ductape.api.run({
    app: 'stripe',
    action: 'create-charge',
    input: { amount, currency }
  });

  return NextResponse.json(result);
}
```

## Why Use a Singleton?

Using a single Ductape instance ensures:

1. **Credentials persist** - Settings from `actions.config()` and `actions.oauth()` are available for all action calls.

2. **Connections are reused** - Database, graph, and vector connections established at startup are reused across all requests.

3. **OAuth tokens stay fresh** - The SDK tracks token expiry and refreshes automatically.

4. **Efficient resource usage** - One instance means one set of connections and one credential store.

## Next Steps

- [Add Apps](/apps/create-app) - Connect third-party APIs
- [Create Products](/products/overview) - Organize your integrations
- [Run Actions](/actions/run-actions) - Execute API calls
- [Configure Auth](/actions/auth-configuration) - Set up credentials and OAuth
- [Connect Databases](/databases/relational/getting-started) - Work with relational data
- [Build Features](/features/overview) - Create multi-step processes
