---
sidebar_position: 1
---

# Fallbacks

Handle failures gracefully by automatically trying alternative providers.

## Quick Example

```ts
import { FeatureEventTypes, DataTypes } from '@ductape/types';

await ductape.product.fallbacks.create({
  tag: 'payment-fallback',
  name: 'Payment Providers',
  description: 'Stripe to PayPal fallback',
  input: {
    amount: { type: DataTypes.NUMBER },
    currency: { type: DataTypes.STRING }
  },
  options: [
    {
      event: 'stripe-charge',
      type: FeatureEventTypes.ACTION,
      retries: 1,
      input: { amount: '$Input{amount}' },
      output: { transactionId: '$Response{id}' }
    },
    {
      event: 'paypal-charge',
      type: FeatureEventTypes.ACTION,
      retries: 1,
      input: { amount: '$Input{amount}' },
      output: { transactionId: '$Response{id}' }
    }
  ]
});
```

## How Fallbacks Work

1. Define a list of providers/actions in priority order
2. Ductape tries the first option
3. If it fails, it automatically tries the next
4. Continues until one succeeds or all fail

## Creating a Fallback

```ts
await ductape.product.fallbacks.create({
  tag: 'sms-fallback',
  name: 'SMS Providers',
  description: 'Twilio to Vonage fallback',
  input: {
    phone: { type: DataTypes.STRING },
    message: { type: DataTypes.STRING }
  },
  options: [
    {
      event: 'twilio-send-sms',
      type: FeatureEventTypes.ACTION,
      retries: 2,
      input: {
        to: '$Input{phone}',
        body: '$Input{message}'
      }
    },
    {
      event: 'vonage-send-sms',
      type: FeatureEventTypes.ACTION,
      retries: 2,
      input: {
        to: '$Input{phone}',
        text: '$Input{message}'
      }
    }
  ]
});
```

### Fallback Fields

| Field | Type | Description |
|-------|------|-------------|
| `tag` | string | Unique identifier |
| `name` | string | Display name |
| `description` | string | Purpose of the fallback |
| `input` | object | Expected input schema |
| `options` | array | List of providers to try in order |

### Option Fields

| Field | Type | Description |
|-------|------|-------------|
| `event` | string | Event/action to execute |
| `type` | FeatureEventTypes | Type of event |
| `retries` | number | Retry attempts before moving to next |
| `input` | object | Input mapping |
| `output` | object | Output mapping |

## See Also

* [Processing Fallbacks](./use)
* [Fallback Event Type](../features/events/event-types/fallbacks)
* [Defining Inputs](./input)
* [Defining Outputs](./output)
