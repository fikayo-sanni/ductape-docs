---
sidebar_position: 6
---

# Decrypting Session Tokens

Validate and decrypt session tokens to retrieve user data using `ductape.sessions.validate()`.

## Quick Example

```ts
const userData = await ductape.sessions.validate({
  product: 'my-app',
  env: 'prd',
  tag: 'user-session',
  token: 'eyJhbGciOi...'
});

console.log(userData);
// { userId: 'user_123', details: { email: 'john@example.com' } }
```

## How It Works

Pass your session token along with the product, environment, and tag to retrieve the original user data stored when the session was created.

## Examples

### Validate user session

```ts
const session = await ductape.sessions.validate({
  product: 'ecommerce',
  env: 'prd',
  tag: 'checkout-session',
  token: 'eyJhbGciOi...'
});

// Returns the data you stored during session creation
console.log(session.userId);
console.log(session.details.email);
```

### Use in middleware

```ts
async function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];

  try {
    const user = await ductape.sessions.validate({
      product: 'my-app',
      env: 'prd',
      tag: 'user-session',
      token
    });
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid session' });
  }
}
```

## Response

The response contains the exact data you stored when creating the session:

```json
{
  "userId": "user_123",
  "details": {
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

---

## Reference

### Input

```ts
interface ValidateSessionInput {
  product: string;  // Product tag
  env: string;      // Environment (dev, staging, prd)
  tag: string;      // Session tag
  token: string;    // Session token to validate
}
```

## See Also

* [Generating Sessions](./use)
* [Refreshing Sessions](./refreshing)
* [Sessions Overview](./overview)
