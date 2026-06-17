---
sidebar_position: 2
---

# Auth Configuration

Before running Actions, you need to configure authentication. Ductape provides two methods for managing credentials:

1. **`actions.config()`** - For static credentials (API keys, bearer tokens)
2. **`actions.oauth()`** - For OAuth tokens with automatic refresh

## Quick Start

```ts
import Ductape from '@ductape/sdk';

const ductape = new Ductape({
  accessKey: 'your-access-key',
});

// Simple API key authentication
ductape.api.config({
  app: 'stripe',
  credentials: {
    'headers:Authorization': 'Bearer sk_live_xxx',
  }
});

// Now all Stripe actions include the Authorization header automatically
await ductape.api.run({
  app: 'stripe',
  action: 'create-charge',
  input: { amount: 1000, currency: 'usd' }
});
```

---

## Static Credentials with `actions.config()`

Use `actions.config()` for credentials that don't expire or are manually rotated (API keys, static tokens).

### Basic Usage

```ts
ductape.api.config({
  app: 'stripe',
  credentials: {
    'headers:Authorization': 'Bearer sk_live_xxx',
  }
});
```

### Using Secrets

For security, use `$Secret{}` references instead of hardcoding credentials:

```ts
ductape.api.config({
  app: 'stripe',
  credentials: {
    'headers:Authorization': '$Secret{STRIPE_API_KEY}',
  }
});
```

Secrets are:
- Encrypted at rest
- Decrypted only at runtime
- Scoped to specific apps and environments

### Multiple Credential Types

```ts
ductape.api.config({
  app: 'internal-api',
  credentials: {
    'headers:Authorization': '$Secret{API_TOKEN}',
    'headers:X-API-Key': '$Secret{API_KEY}',
    'query:api_version': '2024-01',
  }
});
```

### Reusable Config Pattern

Define your app configuration once and reuse it:

```ts
// Define configurations
const stripeConfig = { app: 'stripe' };
const twilioConfig = { app: 'twilio' };

// Set up credentials
ductape.api.config({
  ...stripeConfig,
  credentials: {
    'headers:Authorization': '$Secret{STRIPE_API_KEY}',
  }
});

ductape.api.config({
  ...twilioConfig,
  credentials: {
    'headers:Authorization': '$Secret{TWILIO_AUTH_TOKEN}',
  }
});

// Use the same config for all action calls
await ductape.api.run({
  ...stripeConfig,
  action: 'create-charge',
  input: { amount: 1000, currency: 'usd' }
});

await ductape.api.run({
  ...twilioConfig,
  action: 'send-sms',
  input: { to: '+1234567890', body: 'Hello!' }
});
```

### Environment-Based Configuration

```ts
const stripe = {
  dev: { app: 'stripe' },
  prd: { app: 'stripe' },
};

const env = process.env.NODE_ENV === 'production' ? 'prd' : 'dev';

ductape.api.config({
  ...stripe[env],
  credentials: {
    'headers:Authorization': '$Secret{STRIPE_API_KEY}',
  }
});
```

---

## OAuth with `actions.oauth()`

Use `actions.oauth()` for tokens that expire and need automatic refresh (OAuth 2.0 access tokens).

### How It Works

1. You provide initial tokens and an expiration time
2. You define a `credentials` function that maps tokens to request credentials
3. You define an `onExpiry` callback that refreshes tokens when they expire
4. The SDK automatically:
   - Checks token expiry before each request
   - Calls your refresh callback when tokens expire
   - Stores refreshed tokens securely in `$Secret{}`
   - Retries the original request with fresh tokens

### Basic OAuth Setup

```ts
await ductape.api.oauth({
  app: 'salesforce',

  // Initial tokens
  tokens: {
    accessToken: 'initial_access_token',
    refreshToken: 'initial_refresh_token',
  },

  // When tokens expire (Unix timestamp in ms)
  expiresAt: Date.now() + 3600 * 1000, // 1 hour from now

  // How to build credentials from tokens
  credentials: (tokens) => ({
    'headers:Authorization': `Bearer ${tokens.accessToken}`
  }),

  // How to refresh tokens when expired
  onExpiry: async (currentTokens) => {
    // Call your refresh token endpoint
    const response = await ductape.api.run({
      app: 'salesforce',
      action: 'refresh-token',
      input: {
        'body:grant_type': 'refresh_token',
        'body:refresh_token': currentTokens.refreshToken,
      }
    });

    return {
      tokens: {
        accessToken: response.access_token,
        refreshToken: response.refresh_token || currentTokens.refreshToken
      },
      expiresIn: response.expires_in // seconds until expiry
    };
  }
});
```

### Using `expiresIn` vs `expiresAt`

```ts
// Option 1: expiresAt - Unix timestamp in milliseconds
expiresAt: Date.now() + 3600 * 1000

// Option 2: expiresIn - seconds until expiry
expiresIn: 3600  // 1 hour
```

Both work the same in the initial config and in the `onExpiry` return value.

### OAuth with Secrets

You can initialize OAuth with existing secrets:

```ts
await ductape.api.oauth({
  app: 'salesforce',

  // Use existing secrets
  tokens: {
    accessToken: '$Secret{SALESFORCE_ACCESS_TOKEN}',
    refreshToken: '$Secret{SALESFORCE_REFRESH_TOKEN}',
  },

  expiresAt: tokenExpiry,

  credentials: (tokens) => ({
    'headers:Authorization': `Bearer ${tokens.accessToken}`
  }),

  onExpiry: async (currentTokens) => {
    const response = await ductape.api.run({
      app: 'salesforce',
      action: 'refresh-token',
      input: {
        'body:grant_type': 'refresh_token',
        'body:refresh_token': currentTokens.refreshToken,
      }
    });

    // Tokens are automatically saved back to secrets
    return {
      tokens: {
        accessToken: response.access_token,
        refreshToken: response.refresh_token || currentTokens.refreshToken
      },
      expiresIn: response.expires_in
    };
  }
});
```

### Auto-Generated Secrets

If you pass plain token values (not `$Secret{}` references), the SDK automatically creates secrets with the format:

```
OAUTH_{PRODUCT}_{APP}_{ENV}_{TOKENKEY}
```

For example:
- `OAUTH_MY_PRODUCT_SALESFORCE_PRD_ACCESSTOKEN`
- `OAUTH_MY_PRODUCT_SALESFORCE_PRD_REFRESHTOKEN`

These secrets are updated automatically when tokens refresh.

### Refresh Buffer

By default, tokens are refreshed 1 minute before actual expiry. Customize this with `refreshBuffer`:

```ts
await ductape.api.oauth({
  app: 'salesforce',
  tokens: { ... },
  expiresAt: tokenExpiry,
  credentials: (tokens) => ({ ... }),
  onExpiry: async (currentTokens) => { ... },

  // Refresh 5 minutes before expiry
  refreshBuffer: 5 * 60 * 1000 // 5 minutes in ms
});
```

### Complete OAuth Example

Here's a complete example with Google OAuth:

```ts
// Initialize OAuth for Google APIs
await ductape.api.oauth({
  app: 'google',

  tokens: {
    accessToken: initialAccessToken,
    refreshToken: initialRefreshToken,
  },

  expiresAt: initialExpiry,

  credentials: (tokens) => ({
    'headers:Authorization': `Bearer ${tokens.accessToken}`
  }),

  onExpiry: async (currentTokens) => {
    // Use the OAuth token endpoint
    const response = await ductape.api.run({
      app: 'google',
      action: 'token-refresh',
      input: {
        'body:client_id': '$Secret{GOOGLE_CLIENT_ID}',
        'body:client_secret': '$Secret{GOOGLE_CLIENT_SECRET}',
        'body:refresh_token': currentTokens.refreshToken,
        'body:grant_type': 'refresh_token',
      }
    });

    return {
      tokens: {
        accessToken: response.access_token,
        // Google doesn't rotate refresh tokens by default
        refreshToken: currentTokens.refreshToken
      },
      expiresIn: response.expires_in
    };
  },

  refreshBuffer: 2 * 60 * 1000 // Refresh 2 minutes early
});

// Now all Google API calls automatically handle token refresh
const events = await ductape.api.run({
  app: 'google',
  action: 'list-calendar-events',
  input: {
    calendarId: 'primary',
    maxResults: 10
  }
});
```

---

## When to Use Each Method

| Scenario | Method |
|----------|--------|
| API keys that don't expire | `actions.config()` |
| Static bearer tokens | `actions.config()` |
| Basic auth credentials | `actions.config()` |
| OAuth 2.0 access tokens | `actions.oauth()` |
| Tokens with automatic refresh | `actions.oauth()` |
| Short-lived tokens (< 1 hour) | `actions.oauth()` |

---

## Credential Priority

When credentials come from multiple sources, they merge with this priority (highest to lowest):

1. **Input credentials** - Passed directly in `api.run()`
2. **OAuth credentials** - From `actions.oauth()` configuration
3. **Config credentials** - From `actions.config()` configuration

This means you can always override shared credentials on a per-request basis:

```ts
// Config sets default Authorization
ductape.api.config({
  app: 'api',
  credentials: {
    'headers:Authorization': '$Secret{DEFAULT_TOKEN}',
  }
});

// Override for a specific request
await ductape.api.run({
  app: 'api',
  action: 'admin-endpoint',
  input: {
    'headers:Authorization': '$Secret{ADMIN_TOKEN}', // Overrides default
    data: 'value'
  }
});
```

---

## Reference

### actions.config() Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `product` | string | No | Product tag (defaults to constructor) |
| `app` | string | Yes | App tag |
| `env` | string | No | Environment (dev, stg, prd; defaults to constructor) |
| `credentials` | object | Yes | Flat credentials object |

### actions.oauth() Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `product` | string | No | Product tag (defaults to constructor) |
| `app` | string | Yes | App tag |
| `env` | string | No | Environment (dev, stg, prd; defaults to constructor) |
| `tokens` | object | Yes | Initial tokens object |
| `tokens.accessToken` | string | Yes | Access token (value or `$Secret{}`) |
| `tokens.refreshToken` | string | No | Refresh token (value or `$Secret{}`) |
| `expiresAt` | number | No* | Token expiry (Unix ms timestamp) |
| `expiresIn` | number | No* | Seconds until expiry |
| `credentials` | function | Yes | `(tokens) => credentialsObject` |
| `onExpiry` | function | Yes | `async (tokens) => refreshResult` |
| `refreshBuffer` | number | No | Ms before expiry to refresh (default: 60000) |

*Either `expiresAt` or `expiresIn` should be provided. If neither is provided, defaults to 1 hour.

### onExpiry Return Value

```ts
interface IOAuthRefreshResult {
  tokens: {
    accessToken: string;
    refreshToken?: string;
    [key: string]: unknown;  // Additional token data
  };
  expiresAt?: number;  // Unix ms timestamp
  expiresIn?: number;  // Seconds until expiry
}
```

---

## See Also

* [Running Actions](./run-actions)
* [Secrets Management](../secrets/overview)
