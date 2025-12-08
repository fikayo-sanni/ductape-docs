---
sidebar_position: 3
---

# Quotas

Distribute load across multiple providers based on weights for better reliability and cost optimization.

## Overview

Quotas allow you to split traffic between multiple providers. For example, send 70% of SMS through Twilio and 30% through Nexmo to:

- Reduce dependency on a single provider
- Optimize costs across providers
- Test new providers with limited traffic

## Defining a Quota

```ts
const quota = await resilience.quota.define({
  product: 'my-product',
  tag: 'sms-quota',
  name: 'SMS Provider Quota',
  description: 'Distribute SMS across providers',
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
      .mapInput((input) => ({
        body: { to: input.phone, body: input.message }
      }))
      .mapOutput((res) => ({ messageId: res.sid }))
      .retries(2);

    ctx.provider('nexmo')
      .weight(30)
      .healthcheck('nexmo-health')
      .app('nexmo-app')
      .action('send-sms')
      .mapInput((input) => ({
        body: { to: input.phone, text: input.message }
      }))
      .mapOutput((res) => ({ messageId: res['message-id'] }))
      .retries(2);
  },
});
```

## Provider Configuration

### Weight

Define the percentage of traffic for each provider:

```ts
ctx.provider('twilio').weight(70);  // 70% of traffic
ctx.provider('nexmo').weight(30);   // 30% of traffic
```

Weights are relative - if you have weights of 70 and 30, that's 70% and 30%. If you have 7 and 3, it's still 70% and 30%.

### Healthcheck

Link a healthcheck to automatically skip unhealthy providers:

```ts
ctx.provider('twilio')
  .healthcheck('twilio-health')  // Skip if unhealthy
  .app('twilio-app')
  .action('send-sms');
```

### Target Types

#### App Action

Route to an app action:

```ts
ctx.provider('twilio')
  .weight(70)
  .app('twilio-app')
  .action('send-sms');
```

#### Database Action

Route to a database:

```ts
ctx.provider('primary-db')
  .weight(80)
  .database('main-db')
  .action('write');
```

#### Workflow

Route to a workflow:

```ts
ctx.provider('standard-flow')
  .weight(90)
  .workflow('order-processing')
  .input({ priority: 'normal' });
```

#### Notification

Route to a notification:

```ts
ctx.provider('email-provider')
  .weight(100)
  .notification('transactional-email')
  .event('send');
```

### Input/Output Mapping

Transform input for each provider:

```ts
ctx.provider('twilio')
  .weight(70)
  .app('twilio-app')
  .action('send-sms')
  .mapInput((input) => ({
    body: {
      To: input.phone,
      Body: input.message,
      From: '+1234567890'
    }
  }))
  .mapOutput((response) => ({
    messageId: response.sid,
    status: response.status
  }));
```

### Retries and Check Interval

Configure retry behavior:

```ts
ctx.provider('twilio')
  .weight(70)
  .app('twilio-app')
  .action('send-sms')
  .retries(3)           // Retry up to 3 times
  .checkInterval(5000); // Wait 5s between health checks
```

## Running Quotas

### Synchronous Run

```ts
const result = await resilience.quota.run({
  product: 'my-product',
  env: 'prd',
  tag: 'sms-quota',
  input: {
    phone: '+1234567890',
    message: 'Hello, World!'
  },
});
```

### With Session

```ts
const result = await resilience.quota.run({
  product: 'my-product',
  env: 'prd',
  tag: 'sms-quota',
  input: { phone: '+1234567890', message: 'Hello!' },
  session: {
    tag: 'user-session',
    token: 'session-token-123'
  },
});
```

### With Caching

```ts
const result = await resilience.quota.run({
  product: 'my-product',
  env: 'prd',
  tag: 'sms-quota',
  input: { phone: '+1234567890', message: 'Hello!' },
  cache: 'sms-cache',
});
```

## Dispatching Quotas

Schedule quota execution for later:

```ts
// Dispatch with delay
const job = await resilience.quota.dispatch({
  product: 'my-product',
  env: 'prd',
  tag: 'sms-quota',
  input: { phone: '+1234567890', message: 'Hello!' },
  schedule: {
    delay: 60000, // Run after 60 seconds
  },
});

// Dispatch at specific time
const job = await resilience.quota.dispatch({
  product: 'my-product',
  env: 'prd',
  tag: 'sms-quota',
  input: { phone: '+1234567890', message: 'Happy Birthday!' },
  schedule: {
    at: new Date('2024-12-25T00:00:00Z'),
  },
});

// Dispatch with cron schedule
const job = await resilience.quota.dispatch({
  product: 'my-product',
  env: 'prd',
  tag: 'daily-report',
  input: { type: 'daily' },
  schedule: {
    cron: '0 9 * * *', // Every day at 9 AM
  },
});
```

## Managing Quotas

### Create

```ts
await resilience.quota.create(productId, quota);
```

### Fetch

```ts
const q = await resilience.quota.fetch(productId, 'sms-quota');
```

### Fetch All

```ts
const quotas = await resilience.quota.fetchAll(productId);
```

### Update

```ts
await resilience.quota.update(productId, 'sms-quota', {
  input: { phone: { type: 'string' }, message: { type: 'string' } },
  handler: async (ctx) => {
    // Update weights
    ctx.provider('twilio').weight(50).app('twilio-app').action('send-sms');
    ctx.provider('nexmo').weight(50).app('nexmo-app').action('send-sms');
  },
});
```

### Delete

```ts
await resilience.quota.delete(productId, 'sms-quota');
```

## How Quota Selection Works

1. **Filter healthy providers**: Skip providers whose healthcheck is failing
2. **Calculate effective weights**: Redistribute weights among healthy providers
3. **Random selection**: Use weighted random selection to pick a provider
4. **Execute**: Run the selected provider's action
5. **Retry if needed**: On failure, retry or try another provider

## Best Practices

### Start with Uneven Weights

Begin with most traffic to your primary provider:

```ts
ctx.provider('primary').weight(90);
ctx.provider('backup').weight(10);
```

### Always Use Healthchecks

Link healthchecks to automatically avoid unhealthy providers:

```ts
ctx.provider('twilio')
  .healthcheck('twilio-health')  // Required for resilience
  .app('twilio-app')
  .action('send-sms');
```

### Normalize Output

Use `mapOutput` to ensure consistent responses regardless of provider:

```ts
// Both providers return { messageId, status }
ctx.provider('twilio')
  .mapOutput((res) => ({ messageId: res.sid, status: res.status }));

ctx.provider('nexmo')
  .mapOutput((res) => ({ messageId: res['message-id'], status: res.status }));
```
