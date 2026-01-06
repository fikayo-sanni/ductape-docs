---
sidebar_position: 3
---

# Running Actions

Once you have Actions imported into an App, you can execute them using `ductape.actions.run()`. This function handles authentication, environment switching, and request formatting automatically.

## Prerequisites

Before running Actions, ensure you have:

1. The Ductape SDK installed and initialized
2. An App with imported Actions
3. A Product that connects to the App

```ts
import Ductape from '@ductape/sdk';

const ductape = new Ductape({
  accessKey: 'your-access-key',
});
```

## Quick Example

```ts
const result = await ductape.actions.run({
  env: 'dev',
  product: 'my-product',
  app: 'stripe-app',
  action: 'create_customer',
  input: {
    email: 'john@example.com',
    name: 'John Doe'
  }
});

console.log(result); // { id: 'cus_xxx', email: 'john@example.com', ... }
```

## How It Works

1. **env** - Which environment to run in (`dev`, `stg`, `prd`)
2. **product** - Your product's unique identifier
3. **app** - The connected app's access tag (e.g., `stripe-app`, `twilio-app`)
4. **event** - The action you want to trigger (e.g., `create_customer`, `send_sms`)
5. **input** - The data to send (automatically resolved to body, query, params, or headers based on the action's schema)

## Flat Input Format

The SDK uses a **flat input format** that automatically resolves your fields to the correct location (body, params, query, or headers) based on the action's schema definition.

```ts
// Simple and clean - fields are auto-resolved
input: {
  email: 'john@example.com',    // auto-resolves to body.email
  name: 'John Doe',             // auto-resolves to body.name
  userId: '123'                 // auto-resolves to params.userId
}
```

### Handling Conflicts with Prefixes

If the same key exists in multiple locations (e.g., `id` in both params and body), use prefix syntax to specify the exact location:

```ts
input: {
  'params:id': 'user_123',      // explicitly goes to params.id
  'body:id': 'item_456',        // explicitly goes to body.id
  'query:id': 'search_789',     // explicitly goes to query.id
  'headers:X-Request-ID': 'req_abc'  // explicitly goes to headers
}
```

### Available Prefixes

| Prefix | Target Location | Example |
|--------|-----------------|---------|
| `body:` | Request body | `'body:amount': 1000` |
| `params:` | Route parameters | `'params:userId': '123'` |
| `query:` | Query parameters | `'query:limit': 10` |
| `headers:` | HTTP headers | `'headers:Authorization': 'Bearer ...'` |

## More Examples

### Sending data in the request body

```ts
await ductape.actions.run({
  env: 'prd',
  product: 'payments',
  app: 'stripe',
  action: 'create_payment_intent',
  input: {
    amount: 2000,
    currency: 'usd',
    customer: 'cus_123'
  }
});
```

### Using query parameters

```ts
await ductape.actions.run({
  env: 'dev',
  product: 'crm',
  app: 'hubspot',
  action: 'search_contacts',
  input: {
    email: 'jane@example.com',
    limit: 10
  }
});
```

### With route parameters

```ts
await ductape.actions.run({
  env: 'dev',
  product: 'inventory',
  app: 'shopify',
  action: 'get_product',
  input: {
    productId: '12345'
  }
});
```

### With custom headers

```ts
await ductape.actions.run({
  env: 'prd',
  product: 'api-gateway',
  app: 'internal-api',
  action: 'fetch_user',
  input: {
    userId: '456',
    'headers:X-Request-ID': 'req_abc123'
  }
});
```

### Mixed input with explicit prefixes

When you have fields that could conflict, use prefixes for clarity:

```ts
await ductape.actions.run({
  env: 'prd',
  product: 'orders',
  app: 'order-service',
  action: 'update_order',
  input: {
    'params:orderId': 'order_123',   // Route: /orders/:orderId
    status: 'shipped',                // Body field
    tracking_number: 'TRK456',        // Body field
    'headers:X-Idempotency-Key': 'unique_key_789'
  }
});
```

### With shared configuration

Use `actions.config()` to set credentials once and reuse them across multiple action calls.

**Recommended pattern:** Define your app config once and spread it:

```ts
// Define app configurations
const stripeConfig = { product: 'my-product', app: 'stripe', env: 'prd' };
const twilioConfig = { product: 'my-product', app: 'twilio', env: 'prd' };

// Set credentials using the config
ductape.actions.config({
  ...stripeConfig,
  credentials: {
    'headers:Authorization': '$Secret{STRIPE_API_KEY}',
  }
});

ductape.actions.config({
  ...twilioConfig,
  credentials: {
    'headers:Authorization': '$Secret{TWILIO_AUTH_TOKEN}',
  }
});

// Now use the same config for all action calls
await ductape.actions.run({
  ...stripeConfig,
  action: 'create_charge',
  input: { amount: 1000, currency: 'usd' }
});

await ductape.actions.run({
  ...stripeConfig,
  action: 'list_customers',
  input: { limit: 10 }
});

await ductape.actions.run({
  ...twilioConfig,
  action: 'send_sms',
  input: { to: '+1234567890', body: 'Hello!' }
});
```

This pattern keeps your code DRY and makes it easy to switch environments:

```ts
// Environment-based configs
const stripe = {
  dev: { product: 'my-product', app: 'stripe', env: 'dev' },
  prd: { product: 'my-product', app: 'stripe', env: 'prd' },
};

// Use the appropriate config
const env = process.env.NODE_ENV === 'production' ? 'prd' : 'dev';
ductape.actions.config({
  ...stripe[env],
  credentials: { 'headers:Authorization': '$Secret{STRIPE_API_KEY}' }
});
```

### With session tracking

Use sessions to inject user-specific data dynamically:

```ts
await ductape.actions.run({
  env: 'prd',
  product: 'dashboard',
  app: 'analytics',
  action: 'get_user_stats',
  input: {
    userId: '$Session{user}{id}'
  },
  session:'user-session:eyJhbGciOi...'
});
```

### With caching and retries

```ts
await ductape.actions.run({
  env: 'prd',
  product: 'catalog',
  app: 'products-api',
  action: 'list_products',
  input: {
    category: 'electronics'
  },
  cache: 'products-list',  // Cache the response
  retries: 3               // Retry up to 3 times on failure
});
```

## Optional Parameters

| Parameter | What it does |
|-----------|--------------|
| `cache` | Cache tag to store the response for reuse |
| `retries` | Number of retry attempts if the action fails |
| `session` | Session object for dynamic value injection |

---

## Shared Configuration

### actions.config()

Set shared credentials for a product/app/env combination. These credentials are automatically merged into all subsequent action calls.

```ts
ductape.actions.config({
  product: string,      // Product tag
  app: string,          // App tag
  env: string,          // Environment (dev, staging, prd)
  credentials: {        // Credentials in flat input format
    'headers:Authorization': 'Bearer xxx',
    'headers:X-API-Key': 'key_xxx',
    // ... any other credentials
  }
});
```

**Key behaviors:**
- Credentials are stored in memory for the SDK instance
- User input takes precedence over shared credentials (can override)
- Use prefix syntax for headers: `'headers:Authorization'`
- Works with `$Secret{}` placeholders for secure credential injection

---

## Reference

### IActionProcessorInput

```ts
interface IActionProcessorInput {
  env: string;
  product: string;
  app: string;
  action: string;
  input: IFlatInput | IActionRequest;  // Flat or structured format
  cache?: string;
  retries?: number;
  session?: string;
}
```

### IFlatInput (Recommended)

```ts
// Flat input - auto-resolved from action schema
type IFlatInput = Record<string, unknown>;

// Example
const input: IFlatInput = {
  amount: 1000,              // auto-resolves to body.amount
  currency: 'usd',           // auto-resolves to body.currency
  'params:id': 'user_123'    // explicit: goes to params.id
};
```

### IActionRequest (Structured Format)

The structured format is still supported for backwards compatibility:

```ts
interface IActionRequest {
  query?: Record<string, unknown>;   // URL query parameters
  params?: Record<string, unknown>;  // Route parameters
  body?: Record<string, unknown>;    // Request body
  headers?: Record<string, unknown>; // HTTP headers
}
```

## See Also

* [Sessions](../sessions/overview)
* [Caching](../caching/overview)
