---
sidebar_position: 6
---

# Verifying Session Tokens

Validate and decrypt session tokens to retrieve user data using `ductape.sessions.verify()`.

## Quick Example

```ts
const result = await ductape.sessions.verify({
  product: 'my-product',
  env: 'prd',
  tag: 'user-session',
  token: 'user-session:eyJhbGci...', // or the full token from sessions.start()
});

if (result.valid) {
  console.log('User data:', result.data);
  console.log('Session ID:', result.sessionId);
  console.log('Expires at:', result.expiresAt);
}
```

## How It Works

Pass the session token (and product, env, tag) to verify and decode the JWT. The returned `data` is the same object you passed when starting the session.

## Examples

### Verify user session

```ts
const result = await ductape.sessions.verify({
  product: 'my-product',
  env: 'prd',
  tag: 'checkout-session',
  token: req.headers.authorization?.replace('Bearer ', '') ?? '',
});

if (result.valid && result.data) {
  console.log('UserId:', result.data.userId);
  console.log('Email:', result.data.email);
}
```

### Use in middleware

```ts
async function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];

  try {
    const result = await ductape.sessions.verify({
      product: 'my-product',
      env: 'prd',
      tag: 'user-session',
      token: token ?? '',
    });
    if (result.valid && result.data) {
      req.user = result.data;
      req.sessionId = result.sessionId;
      next();
    } else {
      res.status(401).json({ error: 'Invalid session' });
    }
  } catch (error) {
    res.status(401).json({ error: 'Invalid session' });
  }
}
```

## Response

```ts
interface IVerifyResult {
  valid: boolean;
  data?: Record<string, unknown>;  // The data you stored when starting the session
  sessionId?: string;
  expiresAt?: Date;
}
```

| Field      | Description                                |
|------------|--------------------------------------------|
| `valid`    | Whether the token is valid and not expired |
| `data`     | Decrypted session data                     |
| `sessionId`| Session identifier                         |
| `expiresAt`| Token expiration date                      |

## See Also

* [Generating Sessions](./use)
* [Refreshing Sessions](./refreshing)
* [Sessions Overview](./overview)
