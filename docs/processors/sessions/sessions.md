---
sidebar_position: 1
---

# Sessions: Generating Session Tokens

Sessions in Ductape allow you to track user activity across your products and integrations. By generating session tokens, you gain visibility into customer usage, can debug recurring issues, and recreate user journeys from your backend's perspective. Sessions are optional but highly recommended for advanced analytics and troubleshooting.

## What is a Session Token?
A session token is a short-lived credential that identifies a user's session. Alongside it, a refresh token is issued to extend or resume sessions securely.

## How to Generate a Session Token

After [setting up sessions](../../products/sessions), use the `ductape.processor.sessions.start({...})` method to initialize a session and generate both a session token and a refresh token.

### Example Usage

```typescript
import { ductape } from 'ductape-sdk';

const data = {
  userId: '1919102009383',
  details: {
    username: 'feekayo',
    email: 'fikayo@ductape.app',
  },
};

const result = await ductape.processor.sessions.start({
  product: 'my-product-tag',
  env: 'snd',
  tag: 'session-tag',
  data,
});

console.log('Session tokens:', result);
```

## Parameters

| Name      | Type     | Required | Description                                                                 |
| --------- | -------- | -------- | --------------------------------------------------------------------------- |
| `product` | `string` | Yes    | The product tag (as defined in your Ductape dashboard).                     |
| `env`     | `string` | Yes    | The environment (`dev`, `snd`, `prd`, etc.) the session is associated with. |
| `tag`     | `string` | Yes    | A custom label for the session (e.g., `checkout-flow`, `support-chat`).     |
| `data`    | `object` | Yes    | Payload containing identifying user information and identifier as defined in the session specification |

## Response

On success, this method returns an object containing the session token and refresh token. Persist these tokens client-side or server-side as appropriate for your architecture.

### Example Response

```json
{
  "token": "ejyui11919102393:abc123xyz456...",
  "refreshToken": "eueywuwjwmwmw:zyx456cba321..."
}
```

| Field         | Type     | Description                                                    |
| ------------- | -------- | -------------------------------------------------------------- |
| `token`       | `string` | A short-lived token used to identify the current session.      |
| `refreshToken`| `string` | A long-lived token used to refresh or resume a user's session. |

## Best Practices
- **Store both tokens securely.** Avoid exposing them in public logs or front-end code unless encrypted.
- **Regenerate sessions on major flows.** Use different `tag`s for different flows or features to track user behavior effectively.
- **Attach identifiers.** Always provide a stable identifier and enrich the user details payload with as much detail as possible.

## See Also
- [Understanding Sessions](../../products/sessions)
- [Refreshing Sessions](./refreshing.md)
- [Decrypting Sessions](./decrypting.md)