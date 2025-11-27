---
sidebar_position: 3
---

# Refreshing Session Tokens

Extend session validity by refreshing tokens using `ductape.sessions.refresh()`.

## Quick Example

```ts
const newTokens = await ductape.sessions.refresh({
  product: 'my-app',
  env: 'prd',
  tag: 'user-session',
  refreshToken: 'your-refresh-token'
});

console.log(newTokens.token);        // New session token
console.log(newTokens.refreshToken); // New refresh token
```

## How It Works

Use the refresh token (received when creating or refreshing a session) to get new tokens without requiring the user to re-authenticate.

## Examples

### Basic refresh

```ts
const result = await ductape.sessions.refresh({
  product: 'ecommerce',
  env: 'prd',
  tag: 'checkout-session',
  refreshToken: 'eueywuwjwmwmw:zyx456cba321...'
});

// Store the new tokens
const { token, refreshToken } = result;
```

### Auto-refresh in frontend

```ts
async function refreshAuth() {
  const storedRefreshToken = localStorage.getItem('refreshToken');

  const result = await ductape.sessions.refresh({
    product: 'my-app',
    env: 'prd',
    tag: 'user-session',
    refreshToken: storedRefreshToken
  });

  localStorage.setItem('token', result.token);
  localStorage.setItem('refreshToken', result.refreshToken);

  return result.token;
}
```

## Response

```json
{
  "token": "new-session-token...",
  "refreshToken": "new-refresh-token..."
}
```

| Field | Description |
|-------|-------------|
| `token` | New session token for subsequent requests |
| `refreshToken` | New refresh token for the next refresh |

---

## Reference

### Input

```ts
interface RefreshSessionInput {
  product: string;      // Product tag
  env: string;          // Environment (dev, staging, prd)
  tag: string;          // Session tag
  refreshToken: string; // Refresh token from previous session
}
```

## See Also

* [Generating Sessions](./use)
* [Decrypting Sessions](./decrypting)
* [Sessions Overview](./overview)
