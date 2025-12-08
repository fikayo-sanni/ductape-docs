---
sidebar_position: 4
---

# Fallbacks

Automatically failover to backup providers when your primary provider fails.

## Overview

Fallbacks provide sequential failover - try the primary provider first, and if it fails, automatically try the next one in line. This ensures your operations complete even when individual providers have issues.

## Defining a Fallback

```ts
const fallback = await resilience.fallback.define({
  product: 'my-product',
  tag: 'payment-fallback',
  name: 'Payment Provider Fallback',
  description: 'Failover between payment providers',
  input: {
    amount: { type: 'number' },
    currency: { type: 'string' },
    card_token: { type: 'string' },
  },
  handler: async (ctx) => {
    // Primary provider - tried first
    ctx.primary('stripe')
      .healthcheck('stripe-health')
      .app('stripe-app')
      .action('charge')
      .mapInput((input) => ({
        body: {
          amount: input.amount,
          currency: input.currency,
          source: input.card_token,
        }
      }))
      .mapOutput((res) => ({
        chargeId: res.id,
        status: res.status,
      }))
      .retries(2);

    // Fallback provider - tried if primary fails
    ctx.fallback('paypal')
      .healthcheck('paypal-health')
      .app('paypal-app')
      .action('payment')
      .mapInput((input) => ({
        body: {
          amount: { value: input.amount / 100, currency: input.currency },
          intent: 'CAPTURE',
        }
      }))
      .mapOutput((res) => ({
        chargeId: res.id,
        status: res.status,
      }))
      .retries(2);
  },
});
```

## Primary vs Fallback

### Primary Provider

The first provider to try. Define with `ctx.primary()`:

```ts
ctx.primary('stripe')
  .healthcheck('stripe-health')
  .app('stripe-app')
  .action('charge');
```

### Fallback Providers

Backup providers tried in order if primary fails. Define with `ctx.fallback()`:

```ts
// First fallback
ctx.fallback('paypal')
  .healthcheck('paypal-health')
  .app('paypal-app')
  .action('payment');

// Second fallback
ctx.fallback('square')
  .healthcheck('square-health')
  .app('square-app')
  .action('create-payment');
```

## Provider Configuration

### Healthcheck

Link a healthcheck to skip unhealthy providers:

```ts
ctx.primary('stripe')
  .healthcheck('stripe-health')  // Skip if unhealthy
  .app('stripe-app')
  .action('charge');
```

### Target Types

#### App Action

```ts
ctx.primary('stripe')
  .app('stripe-app')
  .action('charge');
```

#### Database

```ts
ctx.primary('primary-db')
  .database('main-db')
  .action('write');
```

#### Workflow

```ts
ctx.primary('standard-flow')
  .workflow('order-processing')
  .input({ priority: 'high' });
```

#### Notification

```ts
ctx.primary('sendgrid')
  .notification('transactional-email')
  .event('send');
```

### Input/Output Mapping

Transform input/output for each provider:

```ts
ctx.primary('stripe')
  .app('stripe-app')
  .action('charge')
  .mapInput((input) => ({
    body: {
      amount: input.amount,
      currency: input.currency,
      source: input.card_token,
    }
  }))
  .mapOutput((response) => ({
    chargeId: response.id,
    status: response.status,
    provider: 'stripe',
  }));

ctx.fallback('paypal')
  .app('paypal-app')
  .action('payment')
  .mapInput((input) => ({
    body: {
      amount: { value: input.amount / 100, currency: input.currency },
    }
  }))
  .mapOutput((response) => ({
    chargeId: response.id,
    status: response.status === 'COMPLETED' ? 'succeeded' : response.status,
    provider: 'paypal',
  }));
```

### Retries

Configure retries per provider:

```ts
ctx.primary('stripe')
  .app('stripe-app')
  .action('charge')
  .retries(3);  // Retry 3 times before trying fallback
```

### Check Interval

Time between health checks:

```ts
ctx.primary('stripe')
  .app('stripe-app')
  .action('charge')
  .checkInterval(10000);  // Check health every 10 seconds
```

## Running Fallbacks

### Synchronous Run

```ts
const result = await resilience.fallback.run({
  product: 'my-product',
  env: 'prd',
  tag: 'payment-fallback',
  input: {
    amount: 5000,
    currency: 'usd',
    card_token: 'tok_visa',
  },
});
```

### With Session

```ts
const result = await resilience.fallback.run({
  product: 'my-product',
  env: 'prd',
  tag: 'payment-fallback',
  input: { amount: 5000, currency: 'usd', card_token: 'tok_visa' },
  session: {
    tag: 'checkout-session',
    token: 'session-123'
  },
});
```

### With Caching

```ts
const result = await resilience.fallback.run({
  product: 'my-product',
  env: 'prd',
  tag: 'payment-fallback',
  input: { amount: 5000, currency: 'usd', card_token: 'tok_visa' },
  cache: 'payment-cache',
});
```

## Dispatching Fallbacks

Schedule fallback execution for later:

```ts
// Dispatch with delay
const job = await resilience.fallback.dispatch({
  product: 'my-product',
  env: 'prd',
  tag: 'payment-fallback',
  input: { amount: 5000, currency: 'usd', card_token: 'tok_visa' },
  schedule: {
    delay: 5000, // Run after 5 seconds
  },
});

// Dispatch at specific time
const job = await resilience.fallback.dispatch({
  product: 'my-product',
  env: 'prd',
  tag: 'payment-fallback',
  input: { amount: 5000, currency: 'usd', card_token: 'tok_visa' },
  schedule: {
    at: new Date('2024-12-25T00:00:00Z'),
  },
});
```

## Managing Fallbacks

### Create

```ts
await resilience.fallback.create(productId, fallback);
```

### Fetch

```ts
const fb = await resilience.fallback.fetch(productId, 'payment-fallback');
```

### Fetch All

```ts
const fallbacks = await resilience.fallback.fetchAll(productId);
```

### Update

```ts
await resilience.fallback.update(productId, 'payment-fallback', {
  input: { amount: { type: 'number' }, currency: { type: 'string' } },
  handler: async (ctx) => {
    ctx.primary('stripe').app('stripe-app').action('charge');
    ctx.fallback('paypal').app('paypal-app').action('payment');
    ctx.fallback('square').app('square-app').action('create-payment');
  },
});
```

### Delete

```ts
await resilience.fallback.delete(productId, 'payment-fallback');
```

## How Fallback Selection Works

1. **Check primary health**: Is the primary provider healthy?
2. **Try primary**: If healthy, execute the primary provider
3. **On failure**: If primary fails (after retries), move to next fallback
4. **Check fallback health**: Is the fallback provider healthy?
5. **Try fallback**: If healthy, execute the fallback
6. **Repeat**: Continue until success or no more fallbacks

## Fallbacks vs Quotas

| Feature | Fallbacks | Quotas |
|---------|-----------|--------|
| **Strategy** | Sequential failover | Weighted distribution |
| **Use case** | Backup providers | Load balancing |
| **Selection** | Try in order | Random by weight |
| **Traffic** | 100% to primary | Split across providers |

### When to Use Fallbacks

- You have a preferred provider
- You want guaranteed execution order
- Cost varies significantly between providers

### When to Use Quotas

- You want to distribute load
- All providers are equally capable
- You want to test new providers with limited traffic

## Best Practices

### Always Use Healthchecks

Ensure you skip unhealthy providers:

```ts
ctx.primary('stripe')
  .healthcheck('stripe-health')  // Skip if unhealthy
  .app('stripe-app')
  .action('charge');
```

### Normalize Output

Use `mapOutput` for consistent responses:

```ts
// Both return { chargeId, status, provider }
ctx.primary('stripe')
  .mapOutput((res) => ({
    chargeId: res.id,
    status: res.status,
    provider: 'stripe'
  }));

ctx.fallback('paypal')
  .mapOutput((res) => ({
    chargeId: res.id,
    status: res.status === 'COMPLETED' ? 'succeeded' : res.status,
    provider: 'paypal'
  }));
```

### Set Appropriate Retries

Balance reliability vs latency:

```ts
// Primary: more retries (it's preferred)
ctx.primary('stripe')
  .retries(3);

// Fallbacks: fewer retries (already in fallback mode)
ctx.fallback('paypal')
  .retries(1);
```

### Order Fallbacks by Preference

Put most reliable/cost-effective fallbacks first:

```ts
ctx.primary('stripe');        // Best rates
ctx.fallback('paypal');       // Good alternative
ctx.fallback('square');       // Last resort
```
