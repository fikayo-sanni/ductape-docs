---
sidebar_position: 1
---

# Overview

Build resilient integrations with healthchecks, quotas (load distribution), and fallbacks (automatic failover).

## What is Resilience?

Resilience in Ductape helps you build fault-tolerant integrations by:

- **Healthchecks**: Monitor provider availability and detect failures
- **Quotas**: Distribute load across multiple providers based on weights
- **Fallbacks**: Automatically failover to backup providers when primary fails

## Quick Start

```ts
import { ResilienceService } from '@ductape/sdk';

const resilience = new ResilienceService({
  workspace_id: 'your-workspace-id',
  public_key: 'your-public-key',
  user_id: 'your-user-id',
  token: 'your-token',
  env_type: 'prd',
});
```

## Code-First API

Define resilience configurations using a fluent, type-safe API:

```ts
// Define a healthcheck
const healthcheck = await resilience.healthcheck.define({
  product: 'my-product',
  tag: 'stripe-health',
  handler: async (ctx) => {
    ctx.probe().app('stripe-app').action('health');
    ctx.interval(30000); // Check every 30 seconds
    ctx.retries(2);
    ctx.env('prd');
  },
});

// Define a quota for load distribution
const quota = await resilience.quota.define({
  product: 'my-product',
  tag: 'sms-quota',
  input: {
    phone: { type: 'string' },
    message: { type: 'string' },
  },
  handler: async (ctx) => {
    ctx.provider('twilio')
      .weight(70)
      .healthcheck('twilio-health')
      .app('twilio-app')
      .action('send-sms')
      .retries(2);

    ctx.provider('nexmo')
      .weight(30)
      .healthcheck('nexmo-health')
      .app('nexmo-app')
      .action('send-sms')
      .retries(2);
  },
});

// Define a fallback for automatic failover
const fallback = await resilience.fallback.define({
  product: 'my-product',
  tag: 'payment-fallback',
  input: {
    amount: { type: 'number' },
  },
  handler: async (ctx) => {
    ctx.primary('stripe')
      .healthcheck('stripe-health')
      .app('stripe-app')
      .action('charge')
      .retries(2);

    ctx.fallback('paypal')
      .healthcheck('paypal-health')
      .app('paypal-app')
      .action('payment')
      .retries(2);
  },
});
```

## Running Resilience Operations

### Run a Quota

```ts
const result = await resilience.quota.run({
  product: 'my-product',
  env: 'prd',
  tag: 'sms-quota',
  input: { phone: '+1234567890', message: 'Hello!' },
});
```

### Run a Fallback

```ts
const paymentResult = await resilience.fallback.run({
  product: 'my-product',
  env: 'prd',
  tag: 'payment-fallback',
  input: { amount: 1000 },
});
```

## Key Concepts

### Providers

Providers represent different services or APIs that can perform the same operation. For example, Twilio and Nexmo are both SMS providers.

### Health-Aware Routing

Resilience automatically routes traffic away from unhealthy providers based on healthcheck results.

### Weighted Distribution

Quotas distribute load across providers based on configured weights. A provider with weight 70 receives 70% of traffic.

### Sequential Failover

Fallbacks try providers in order until one succeeds. If the primary fails, it automatically tries the fallback.

## Next Steps

- [Healthchecks](./healthchecks.md) - Monitor provider availability
- [Quotas](./quotas.md) - Distribute load across providers
- [Fallbacks](./fallbacks.md) - Automatic failover on failures
