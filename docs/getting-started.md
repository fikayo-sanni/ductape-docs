---
sidebar_position: 2
---

# Getting Started

This guide walks you through setting up Ductape in your project and making your first API call.

## Installation

Install the Ductape SDK:

```bash
npm install @ductape/sdk
```

## Initialize the SDK

Create a Ductape instance with your workspace credentials:

```ts
import Ductape from '@ductape/sdk';

const ductape = new Ductape({
  accessKey: process.env.DUCTAPE_ACCESS_KEY!,
});
```

You can find your credentials in the Ductape dashboard under **Settings > API Keys**.

## Your First Action

Once you've [added an app](/docs/apps/getting-started) and connected it to a [product](/docs/products/overview), you can run actions:

```ts
const result = await ductape.actions.run({
  product: 'my-product',
  app: 'stripe',
  env: 'dev',
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

// Create a single instance
export const ductape = new Ductape({
  accessKey: process.env.DUCTAPE_ACCESS_KEY!,
});

const env = process.env.NODE_ENV === 'production' ? 'prd' : 'dev';

// Configure credentials once at startup
ductape.actions.config({
  product: 'my-product',
  app: 'stripe',
  env,
  credentials: {
    'headers:Authorization': '$Secret{STRIPE_API_KEY}',
  }
});

ductape.actions.config({
  product: 'my-product',
  app: 'twilio',
  env,
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
  return ductape.actions.run({
    product: 'my-product',
    app: 'stripe',
    env: process.env.NODE_ENV === 'production' ? 'prd' : 'dev',
    action: 'create-charge',
    input: { amount, currency }
  });
}
```

```ts title="src/services/notification.service.ts"
import { ductape } from '../lib/ductape';

export async function sendSMS(to: string, message: string) {
  return ductape.actions.run({
    product: 'my-product',
    app: 'twilio',
    env: process.env.NODE_ENV === 'production' ? 'prd' : 'dev',
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
});

const env = process.env.NODE_ENV === 'production' ? 'prd' : 'dev';

export async function initializeDuctape() {
  // Configure API credentials
  ductape.actions.config({
    product: 'my-product',
    app: 'stripe',
    env,
    credentials: {
      'headers:Authorization': '$Secret{STRIPE_API_KEY}',
    }
  });

  // Connect to relational database
  await ductape.databases.connect({
    env,
    product: 'my-product',
    database: 'users-db',
  });

  // Connect to graph database
  await ductape.graph.connect({
    env,
    product: 'my-product',
    graph: 'social-graph',
  });

  // Connect to vector database
  await ductape.vector.connect({
    env,
    product: 'my-product',
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
    product: 'my-product',
    env: process.env.NODE_ENV === 'production' ? 'prd' : 'dev',
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

export const ductape = new Ductape({
  accessKey: process.env.DUCTAPE_ACCESS_KEY!,
});

const env = process.env.NODE_ENV === 'production' ? 'prd' : 'dev';

export async function initializeDuctape() {
  ductape.actions.config({
    product: 'my-product',
    app: 'stripe',
    env,
    credentials: {
      'headers:Authorization': '$Secret{STRIPE_API_KEY}',
    }
  });

  await ductape.databases.connect({
    env,
    product: 'my-product',
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

```ts title="src/ductape/ductape.module.ts"
import { Module, Global } from '@nestjs/common';
import { DuctapeService } from './ductape.service';

@Global()
@Module({
  providers: [DuctapeService],
  exports: [DuctapeService],
})
export class DuctapeModule {}
```

```ts title="src/ductape/ductape.service.ts"
import { Injectable, OnModuleInit } from '@nestjs/common';
import Ductape from '@ductape/sdk';

@Injectable()
export class DuctapeService implements OnModuleInit {
  private readonly ductape: Ductape;
  private readonly env = process.env.NODE_ENV === 'production' ? 'prd' : 'dev';

  constructor() {
    this.ductape = new Ductape({
      accessKey: process.env.DUCTAPE_ACCESS_KEY!,
    });
  }

  async onModuleInit() {
    this.ductape.actions.config({
      product: 'my-product',
      app: 'stripe',
      env: this.env,
      credentials: {
        'headers:Authorization': '$Secret{STRIPE_API_KEY}',
      }
    });

    await this.ductape.databases.connect({
      env: this.env,
      product: 'my-product',
      database: 'users-db',
    });
  }

  get actions() {
    return this.ductape.actions;
  }

  get databases() {
    return this.ductape.databases;
  }

  get workflows() {
    return this.ductape.workflows;
  }
}
```

```ts title="src/payments/payments.service.ts"
import { Injectable } from '@nestjs/common';
import { DuctapeService } from '../ductape/ductape.service';

@Injectable()
export class PaymentsService {
  constructor(private readonly ductape: DuctapeService) {}

  async createCharge(amount: number, currency: string) {
    return this.ductape.actions.run({
      product: 'my-product',
      app: 'stripe',
      env: process.env.NODE_ENV === 'production' ? 'prd' : 'dev',
      action: 'create-charge',
      input: { amount, currency }
    });
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
    });

    ductapeInstance.actions.config({
      product: 'my-product',
      app: 'stripe',
      env,
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
      env,
      product: 'my-product',
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

  const result = await ductape.actions.run({
    product: 'my-product',
    app: 'stripe',
    env: process.env.NODE_ENV === 'production' ? 'prd' : 'dev',
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

- [Add Apps](/docs/apps/getting-started) - Connect third-party APIs
- [Create Products](/docs/products/overview) - Organize your integrations
- [Run Actions](/docs/actions/run-actions) - Execute API calls
- [Configure Auth](/docs/actions/auth-configuration) - Set up credentials and OAuth
- [Connect Databases](/docs/databases/getting-started) - Work with relational data
- [Build Workflows](/docs/workflows/overview) - Create multi-step processes
