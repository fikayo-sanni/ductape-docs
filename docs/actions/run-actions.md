---
sidebar_position: 2
---

# Running Actions

Once you have Actions imported into an App, you can execute them using `ductape.action.run()`. This function handles authentication, environment switching, and request formatting automatically.

## Prerequisites

Before running Actions, ensure you have:

1. The Ductape SDK installed and initialized
2. An App with imported Actions
3. A Product that connects to the App

```ts
import Ductape from 'ductape-sdk';

const ductape = new Ductape({
  workspace_id: 'your-workspace-id',
  user_id: 'your-user-id',
  public_key: 'your-public-key',
  token: 'your-token',
  env_type: 'development',
});
```

## Quick Example

```ts
const result = await ductape.action.run({
  env: 'dev',
  product_tag: 'my-product',
  app: 'stripe-app',
  event: 'create_customer',
  input: {
    body: {
      email: 'john@example.com',
      name: 'John Doe'
    }
  }
});

console.log(result); // { id: 'cus_xxx', email: 'john@example.com', ... }
```

## How It Works

1. **env** - Which environment to run in (`dev`, `staging`, `prd`)
2. **product_tag** - Your product's unique identifier
3. **app** - The connected app's access tag (e.g., `stripe-app`, `twilio-app`)
4. **event** - The action you want to trigger (e.g., `create_customer`, `send_sms`)
5. **input** - The data to send (body, query params, headers, route params)

## More Examples

### Sending data in the request body

```ts
await ductape.action.run({
  env: 'prd',
  product_tag: 'payments',
  app: 'stripe',
  event: 'create_payment_intent',
  input: {
    body: {
      amount: 2000,
      currency: 'usd',
      customer: 'cus_123'
    }
  }
});
```

### Using query parameters

```ts
await ductape.action.run({
  env: 'dev',
  product_tag: 'crm',
  app: 'hubspot',
  event: 'search_contacts',
  input: {
    query: {
      email: 'jane@example.com',
      limit: 10
    }
  }
});
```

### With route parameters

```ts
await ductape.action.run({
  env: 'dev',
  product_tag: 'inventory',
  app: 'shopify',
  event: 'get_product',
  input: {
    params: {
      productId: '12345'
    }
  }
});
```

### With custom headers

```ts
await ductape.action.run({
  env: 'prd',
  product_tag: 'api-gateway',
  app: 'internal-api',
  event: 'fetch_user',
  input: {
    headers: {
      'X-Request-ID': 'req_abc123'
    },
    params: { userId: '456' }
  }
});
```

### With session tracking

Use sessions to inject user-specific data dynamically:

```ts
await ductape.action.run({
  env: 'prd',
  product_tag: 'dashboard',
  app: 'analytics',
  event: 'get_user_stats',
  input: {
    params: { userId: '$Session{user}{id}' }
  },
  session: {
    tag: 'user-session',
    token: 'eyJhbGciOi...'
  }
});
```

### With caching and retries

```ts
await ductape.action.run({
  env: 'prd',
  product_tag: 'catalog',
  app: 'products-api',
  event: 'list_products',
  input: {
    query: { category: 'electronics' }
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

## Reference

### IActionProcessorInput

```ts
interface IActionProcessorInput {
  env: string;
  product_tag: string;
  app: string;
  event: string;
  input: IActionRequest;
  cache?: string;
  retries?: number;
  session?: ISession;
}
```

### IActionRequest

```ts
interface IActionRequest {
  query?: Record<string, unknown>;   // URL query parameters
  params?: Record<string, unknown>;  // Route parameters
  body?: Record<string, unknown>;    // Request body
  headers?: Record<string, unknown>; // HTTP headers
}
```

### ISession

```ts
interface ISession {
  tag: string;   // Session identifier
  token: string; // Encrypted session token (e.g., JWT)
}
```

## See Also

* [Sessions](../sessions/overview)
* [Caching](../caching/overview)
