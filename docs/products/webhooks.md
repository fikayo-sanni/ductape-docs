---
sidebar_position: 5
---

# Product Webhooks

Manage webhooks for product apps and generate webhook URLs.

## Overview

Product webhooks allow external services to send events to your product. When connected apps trigger events (like payment success, email bounce, etc.), they can notify your product via webhooks.

## Fetching App Webhooks

Get all webhooks for a connected app:

```typescript
import Ductape from '@ductape/sdk';

const ductape = new Ductape({
  accessKey: 'your-access-key',
});

await ductape.product.init('my-product');

const webhooks = await ductape.product.webhook.fetchAllForProductApp('stripe-payments');

webhooks.forEach(webhook => {
  console.log(`Webhook: ${webhook.event}`);
  console.log(`URL: ${webhook.url}`);
});
```

## Generating Webhook Links

Create webhook URLs for external services to call:

```typescript
const webhookUrl = await ductape.product.webhook.generateLink({
  app: 'stripe-payments',
  event: 'payment.succeeded',
  env: 'prd',
  product: 'my-product',
});

console.log('Webhook URL:', webhookUrl);
// Use this URL in Stripe dashboard
```

## Webhook Link Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `app` | string | App access tag |
| `event` | string | Event name/tag |
| `env` | string | Environment slug |
| `product` | string | Product tag |

## Complete Example

```typescript
import Ductape from '@ductape/sdk';

async function setupWebhooks() {
  const ductape = new Ductape({
    accessKey: 'your-access-key',
  });

  await ductape.product.init('ecommerce-platform');

  // Generate webhook URLs for Stripe events
  const paymentSuccessUrl = await ductape.product.webhook.generateLink({
    app: 'stripe-payments',
    event: 'payment.succeeded',
    env: 'prd',
    product: 'ecommerce-platform',
  });

  const paymentFailedUrl = await ductape.product.webhook.generateLink({
    app: 'stripe-payments',
    event: 'payment.failed',
    env: 'prd',
    product: 'ecommerce-platform',
  });

  const refundUrl = await ductape.product.webhook.generateLink({
    app: 'stripe-payments',
    event: 'charge.refunded',
    env: 'prd',
    product: 'ecommerce-platform',
  });

  console.log('Configure these URLs in Stripe dashboard:');
  console.log('Payment Success:', paymentSuccessUrl);
  console.log('Payment Failed:', paymentFailedUrl);
  console.log('Refund:', refundUrl);

  // Fetch all configured webhooks
  const webhooks = await ductape.product.webhook.fetchAllForProductApp('stripe-payments');
  console.log(`Total webhooks configured: ${webhooks.length}`);
}

setupWebhooks().catch(console.error);
```

## Use Cases

### Payment Webhooks
```typescript
// Stripe payment events
const stripeWebhooks = [
  'payment.succeeded',
  'payment.failed',
  'charge.refunded',
  'customer.created',
];

for (const event of stripeWebhooks) {
  const url = await ductape.product.webhook.generateLink({
    app: 'stripe-payments',
    event,
    env: 'prd',
    product: 'payment-service',
  });
  console.log(`${event}: ${url}`);
}
```

### Email Webhooks
```typescript
// SendGrid email events
const emailWebhooks = [
  'email.delivered',
  'email.opened',
  'email.bounced',
  'email.clicked',
];

for (const event of emailWebhooks) {
  const url = await ductape.product.webhook.generateLink({
    app: 'sendgrid-email',
    event,
    env: 'prd',
    product: 'notification-service',
  });
  console.log(`${event}: ${url}`);
}
```

## Environment-Specific Webhooks

Generate different webhook URLs for each environment:

```typescript
const environments = ['dev', 'stg', 'prd'];

for (const env of environments) {
  const url = await ductape.product.webhook.generateLink({
    app: 'stripe-payments',
    event: 'payment.succeeded',
    env,
    product: 'payment-service',
  });
  console.log(`${env}: ${url}`);
}
```

## Webhook Security

When receiving webhook calls:

1. **Verify signatures** - Validate webhook signatures from providers
2. **Use HTTPS** - Always use secure connections
3. **Validate payload** - Check payload structure and content
4. **Idempotency** - Handle duplicate webhook deliveries
5. **Respond quickly** - Return 200 status promptly

## Best Practices

- **Generate once** - Create webhook URLs during setup, not on every request
- **Document events** - Keep track of which webhooks are configured where
- **Test webhooks** - Use development environments to test webhook handling
- **Monitor failures** - Track failed webhook deliveries
- **Version events** - Include versions in event names if needed

## See Also

- [Products Overview](./overview) - Product architecture
- [Connecting Apps](./connecting-apps) - Link apps to products
- [App Webhooks](/apps/webhooks) - Configure webhooks at the app level
- [Features](/features/overview) - Process webhook events in workflows
