---
sidebar_position: 2
---

# Healthchecks

Monitor provider availability and detect failures before they impact your users.

## Overview

Healthchecks periodically probe your providers to verify they're working correctly. When a provider fails, it's marked as unavailable and traffic is routed elsewhere.

## Defining a Healthcheck

```ts
const healthcheck = await resilience.healthcheck.define({
  product: 'my-product',
  tag: 'stripe-health',
  name: 'Stripe API Health',
  description: 'Monitors Stripe API availability',
  handler: async (ctx) => {
    // Configure the probe
    ctx.probe().app('stripe-app').action('health');

    // Check every 30 seconds
    ctx.interval(30000);

    // Retry 2 times before marking unhealthy
    ctx.retries(2);

    // Enable for production environment
    ctx.env('prd');
    ctx.env('stg'); // Also enable for staging
  },
});
```

## Probe Types

### App Probe

Check an app action for availability:

```ts
// Simple action check (no input required)
ctx.probe().app('stripe-app').action('health');

// Action with input data for processing
ctx.probe().app('stripe-app').action('health').input({
  body: {
    test_mode: true,
    api_version: '2024-01-01',
  },
  headers: {
    'X-Custom-Header': 'value',
  },
});
```

### Database Probe

Check database connectivity:

```ts
// Simple ping
ctx.probe().database('main-db').action('ping');

// With query input
ctx.probe().database('main-db').action('query').input({
  query: 'SELECT 1',
});
```

### Workflow Probe

Run a workflow to verify end-to-end functionality:

```ts
ctx.probe().workflow('health-check-flow').input({
  test: true,
});
```

## Configuration Options

### Interval

How often to run the healthcheck (in milliseconds):

```ts
ctx.interval(30000); // Every 30 seconds
ctx.interval(60000); // Every minute
ctx.interval(300000); // Every 5 minutes
```

### Retries

Number of consecutive failures before marking unhealthy:

```ts
ctx.retries(2); // Mark unhealthy after 2 failures
ctx.retries(3); // More tolerance for flaky services
```

### Environment Configuration

Configure per-environment settings:

```ts
ctx.env('prd'); // Simple enable
ctx.env('stg', {
  input: {
    body: { test_mode: true }
  }
});
```

## Failure Notifications

Get notified when healthchecks fail:

```ts
handler: async (ctx) => {
  ctx.probe().app('stripe-app').action('health');
  ctx.interval(30000);
  ctx.retries(2);
  ctx.env('prd');

  // Configure failure notifications
  ctx.onFailure()
    .notification('alert-notification')
    .message('provider-down')
    .email({ recipients: ['ops@company.com'] })
    .push({ recipients: ['on-call-team'] });
}
```

### Notification Channels

- **Email**: Send email alerts
- **Push**: Send push notifications
- **SMS**: Send text messages
- **Callback**: Call a webhook

### Webhooks

Call external services when failures occur:

```ts
ctx.onFailure()
  .webhook({
    url: 'https://alerts.company.com/webhook',
    method: 'POST',
    headers: { 'Authorization': 'Bearer token' },
    body: { service: 'stripe', status: 'down' }
  });
```

### Event Emission

Emit events for internal handling:

```ts
ctx.onFailure()
  .emit({
    event: 'provider.unhealthy',
    data: { provider: 'stripe' }
  });
```

## Managing Healthchecks

### Create

```ts
await resilience.healthcheck.create(productId, healthcheck);
```

### Fetch

```ts
const hc = await resilience.healthcheck.fetch(productId, 'stripe-health');
```

### Fetch All

```ts
const healthchecks = await resilience.healthcheck.fetchAll(productId);
```

### Update

```ts
await resilience.healthcheck.update(productId, 'stripe-health', {
  handler: async (ctx) => {
    ctx.probe().app('stripe-app').action('health');
    ctx.interval(15000); // More frequent checks
    ctx.retries(3);
    ctx.env('prd');
  },
});
```

### Delete

```ts
await resilience.healthcheck.delete(productId, 'stripe-health');
```

## Status and Manual Runs

### Get Status

```ts
const status = await resilience.healthcheck.getStatus({
  product: productId,
  env: 'prd',
  tag: 'stripe-health',
});

console.log(status);
// {
//   status: 'available',
//   lastAvailable: '2024-01-15T10:30:00Z',
//   lastChecked: '2024-01-15T10:35:00Z',
//   lastLatency: 150,
//   averageLatency: 145
// }
```

### Manual Run

Trigger a healthcheck immediately:

```ts
const result = await resilience.healthcheck.runNow({
  product: productId,
  env: 'prd',
  tag: 'stripe-health',
});

console.log(result);
// {
//   status: 'available',
//   latency: 142,
//   checkedAt: '2024-01-15T10:36:00Z'
// }
```

## Data References

Use dynamic values in your healthcheck configuration:

```ts
handler: async (ctx) => {
  ctx.probe().app('stripe-app').action('health');
  ctx.interval(30000);
  ctx.retries(2);
  ctx.env('prd', {
    input: {
      headers: {
        'Authorization': ctx.auth('stripe-auth'),
      },
      body: {
        api_key: ctx.token('stripe-api-key'),
        endpoint: ctx.variable('stripe-app', 'health_endpoint'),
      }
    }
  });
}
```

### Available References

- `ctx.auth(field)` - Reference authentication data
- `ctx.token(key)` - Reference token values
- `ctx.variable(app, key)` - Reference app variables
- `ctx.constant(app, key)` - Reference app constants
