---
sidebar_position: 1
---

# Fallbacks

Fallbacks in Ductape provide automatic failover between multiple providers or actions. When one provider fails, Ductape automatically tries the next option in your fallback chain until one succeeds or all options are exhausted.

## What is a Fallback?

A fallback is a resilience mechanism that:
- Defines multiple provider/action options in priority order
- Automatically switches to the next option when one fails
- Tracks provider health and availability
- Supports retry logic per provider
- Can integrate with healthchecks for smart routing
- Maintains historical performance data

Use fallbacks for:
- **Provider redundancy** - Switch between payment gateways, SMS providers, etc.
- **High availability** - Ensure critical services stay operational
- **Cost optimization** - Route to cheaper providers when primary is down
- **Geographic routing** - Failover to regional providers
- **API resilience** - Handle third-party API outages gracefully

## Creating a Fallback

Create a fallback using `ductape.fallback.create()`:

```typescript
import Ductape from '@ductape/sdk';
import { FeatureEventTypes, DataTypes } from '@ductape/sdk/types';

const ductape = new Ductape({
  workspace_id: 'your-workspace-id',
  user_id: 'your-user-id',
  private_key: 'your-private-key',
});



await ductape.fallback.create({
  name: 'Payment Provider Fallback',
  tag: 'payment-fallback',
  description: 'Stripe to PayPal to Square fallback chain',
  input: {
    amount: { type: DataTypes.NUMBER },
    currency: { type: DataTypes.STRING },
    customerId: { type: DataTypes.STRING },
  },
  options: [
    {
      type: FeatureEventTypes.ACTION,
      event: 'create-charge',
      app: 'stripe',
      input: {
        amount: '$Input{amount}',
        currency: '$Input{currency}',
        customer: '$Input{customerId}',
      },
      output: {
        transactionId: '$Response{id}',
        status: '$Response{status}',
      },
      retries: 2,
      healthcheck: 'stripe-health',  // Optional: use healthcheck status
    },
    {
      type: FeatureEventTypes.ACTION,
      event: 'create-payment',
      app: 'paypal',
      input: {
        amount: '$Input{amount}',
        currency: '$Input{currency}',
      },
      output: {
        transactionId: '$Response{payment_id}',
        status: '$Response{state}',
      },
      retries: 2,
      healthcheck: 'paypal-health',
    },
    {
      type: FeatureEventTypes.ACTION,
      event: 'charge',
      app: 'square',
      input: {
        amount_money: {
          amount: '$Input{amount}',
          currency: '$Input{currency}',
        },
      },
      output: {
        transactionId: '$Response{payment_id}',
        status: '$Response{status}',
      },
      retries: 1,
    },
  ],
});
```

### Fallback Fields

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Display name for the fallback |
| `tag` | string | Unique identifier |
| `description` | string | Description of the fallback purpose |
| `input` | Record&lt;string, IFeatureInput&gt; | Input schema definition |
| `options` | IFallbackOptions[] | Array of provider options in priority order |

### Fallback Option Fields

Each option in the `options` array has:

| Field | Type | Description |
|-------|------|-------------|
| `type` | FeatureEventTypes | Type of action (ACTION or FEATURE) |
| `event` | string | Tag of the action/feature to execute |
| `app` | string | App tag (required if type is ACTION) |
| `input` | object | Input mapping for the action |
| `output` | object | Output mapping from the action response |
| `retries` | number | Number of retry attempts before failing over |
| `healthcheck` | string | Optional healthcheck tag for provider status |
| `provider_status` | string | Provider availability status (tracked automatically) |
| `last_available` | boolean | Whether provider was available last check (tracked automatically) |
| `last_checked` | Date | Last healthcheck timestamp (tracked automatically) |
| `check_interval` | number | Healthcheck interval in milliseconds (optional) |

## Running a Fallback

Execute fallback logic at runtime using `ductape.fallback.run()`:

```typescript
const result = await ductape.fallback.run({
  env: 'prd',
  product: 'my-product',
  tag: 'payment-fallback',
  input: {
    amount: 2500,
    currency: 'USD',
    customerId: 'cus_123',
  },
  session: {
    tag: 'user-session',
    token: 'session-token',
  },
  cache: 'payment-cache',  // Optional: cache results
});

console.log('Payment result:', result);
console.log('Provider used:', result.provider);
console.log('Transaction ID:', result.transactionId);
```

### Run Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `env` | string | Environment (e.g., 'dev', 'prd') |
| `product` | string | Product tag |
| `tag` | string | Fallback tag to execute |
| `input` | object | Input data for the fallback |
| `session` | object | Optional session information |
| `cache` | string | Optional cache tag |

### How Execution Works

1. **Try First Option:** Execute the first provider in the options array
2. **Retry on Failure:** If it fails, retry up to the specified retry count
3. **Failover:** If all retries fail, move to the next option
4. **Healthcheck Integration:** Skip providers marked unhealthy (if healthchecks configured)
5. **Return Success:** Return as soon as any provider succeeds
6. **All Failed:** If all providers fail, return error with failure details

## Fetching Fallbacks

### Get All Fallbacks

```typescript
const fallbacks = await ductape.fallback.fetchAll();

fallbacks.forEach(fallback => {
  console.log(`${fallback.name} (${fallback.tag})`);
  console.log(`Options: ${fallback.options.length}`);
  fallback.options.forEach((option, i) => {
    console.log(`  ${i + 1}. ${option.app}/${option.event}`);
    console.log(`     Status: ${option.provider_status || 'unknown'}`);
    console.log(`     Retries: ${option.retries}`);
  });
});
```

### Get a Specific Fallback

```typescript
const fallback = await ductape.fallback.fetch('payment-fallback');

console.log('Fallback:', fallback.name);
console.log('Description:', fallback.description);
console.log('Provider Options:');
fallback.options.forEach((option, i) => {
  console.log(`  ${i + 1}. ${option.app}/${option.event}`);
  console.log(`     Last Available: ${option.last_available}`);
  console.log(`     Last Checked: ${option.last_checked}`);
});
```

## Updating Fallbacks

Update fallback configuration using `ductape.fallback.update()`:

```typescript
await ductape.fallback.update('payment-fallback', {
  description: 'Updated payment provider fallback',
  options: [
    {
      type: FeatureEventTypes.ACTION,
      event: 'create-charge',
      app: 'stripe',
      input: {
        amount: '$Input{amount}',
        currency: '$Input{currency}',
      },
      output: {
        transactionId: '$Response{id}',
      },
      retries: 3,  // Increased retries
    },
    // Add new provider
    {
      type: FeatureEventTypes.ACTION,
      event: 'create-payment',
      app: 'adyen',
      input: {
        amount: '$Input{amount}',
        currency: '$Input{currency}',
      },
      output: {
        transactionId: '$Response{pspReference}',
      },
      retries: 2,
    },
  ],
});
```

## Using Fallbacks in Features

Integrate fallbacks into feature workflows:

```typescript
import { FeatureEventTypes, DataTypes } from '@ductape/sdk/types';

await ductape.features.create({
  tag: 'process-payment',
  name: 'Process Payment with Fallback',
  input: {
    amount: { type: DataTypes.NUMBER },
    currency: { type: DataTypes.STRING },
    userId: { type: DataTypes.STRING },
  },
  events: [
    // Validate payment
    {
      type: FeatureEventTypes.ACTION,
      event: 'validate-payment',
      app: 'payment-service',
      input: {
        amount: '$Input{amount}',
        userId: '$Input{userId}',
      },
    },
    // Execute payment with fallback
    {
      type: FeatureEventTypes.FALLBACK,
      event: 'payment-fallback',
      input: {
        amount: '$Input{amount}',
        currency: '$Input{currency}',
      },
    },
    // Log successful payment
    {
      type: FeatureEventTypes.ACTION,
      event: 'log-payment',
      app: 'logging-service',
      input: {
        transactionId: '$Sequence{payment-fallback}{transactionId}',
        provider: '$Sequence{payment-fallback}{provider}',
        amount: '$Input{amount}',
      },
    },
  ],
});
```

## Example: SMS Provider Fallback

```typescript
import Ductape from '@ductape/sdk';
import { FeatureEventTypes, DataTypes } from '@ductape/sdk/types';

const ductape = new Ductape({
  workspace_id: 'your-workspace-id',
  user_id: 'your-user-id',
  private_key: 'your-private-key',
});

await ductape.product.init('messaging-app');

// Create SMS fallback
await ductape.fallback.create({
  name: 'SMS Provider Fallback',
  tag: 'sms-fallback',
  description: 'Twilio to Vonage to AWS SNS',
  input: {
    phone: { type: DataTypes.STRING },
    message: { type: DataTypes.STRING },
  },
  options: [
    {
      type: FeatureEventTypes.ACTION,
      event: 'send-sms',
      app: 'twilio',
      input: {
        to: '$Input{phone}',
        body: '$Input{message}',
      },
      output: {
        messageId: '$Response{sid}',
        status: '$Response{status}',
      },
      retries: 2,
      healthcheck: 'twilio-health',
    },
    {
      type: FeatureEventTypes.ACTION,
      event: 'send-sms',
      app: 'vonage',
      input: {
        to: '$Input{phone}',
        text: '$Input{message}',
      },
      output: {
        messageId: '$Response{message_id}',
        status: '$Response{status}',
      },
      retries: 2,
      healthcheck: 'vonage-health',
    },
    {
      type: FeatureEventTypes.ACTION,
      event: 'publish-sms',
      app: 'aws-sns',
      input: {
        PhoneNumber: '$Input{phone}',
        Message: '$Input{message}',
      },
      output: {
        messageId: '$Response{MessageId}',
      },
      retries: 1,
    },
  ],
});

// Send SMS with automatic fallback
const result = await ductape.fallback.run({
  env: 'prd',
  product: 'messaging-app',
  tag: 'sms-fallback',
  input: {
    phone: '+1234567890',
    message: 'Your verification code is 123456',
  },
});

console.log(`SMS sent via ${result.provider}`);
console.log(`Message ID: ${result.messageId}`);
```

## Healthcheck Integration

Combine fallbacks with healthchecks for intelligent provider selection:

```typescript
// Create healthchecks for providers
await ductape.health.create({
  name: 'Stripe Health',
  tag: 'stripe-health',
  app: 'stripe',
  event: 'ping',
  interval: 60000,  // Check every minute
  retries: 2,
  envs: [
    {
      slug: 'prd',
      input: {},
    },
  ],
});

// Fallback will skip unhealthy providers
await ductape.fallback.create({
  name: 'Smart Payment Fallback',
  tag: 'smart-payment',
  description: 'Provider fallback with health awareness',
  input: {
    amount: { type: DataTypes.NUMBER },
  },
  options: [
    {
      type: FeatureEventTypes.ACTION,
      event: 'charge',
      app: 'stripe',
      input: { amount: '$Input{amount}' },
      output: { id: '$Response{id}' },
      retries: 1,
      healthcheck: 'stripe-health',  // Skip if unhealthy
    },
    {
      type: FeatureEventTypes.ACTION,
      event: 'charge',
      app: 'paypal',
      input: { amount: '$Input{amount}' },
      output: { id: '$Response{id}' },
      retries: 1,
      healthcheck: 'paypal-health',
    },
  ],
});
```

## Best Practices

- **Order providers** by preference (cost, reliability, features)
- **Set appropriate retries** - balance between resilience and latency
- **Use healthchecks** to avoid trying known-down providers
- **Standardize output mapping** across providers for consistency
- **Monitor fallback usage** to detect provider issues
- **Test fallback chains** regularly to ensure they work when needed
- **Document provider differences** in input/output requirements
- **Track costs** - fallbacks may route to more expensive providers
- **Set timeouts** to prevent slow providers from blocking fallbacks

## See Also

- [Healthchecks](/apps/healthchecks) - Monitor provider availability
- [Features](/features/overview) - Integrate fallbacks into workflows
- [Actions](/actions/overview) - Create provider actions for fallback options
