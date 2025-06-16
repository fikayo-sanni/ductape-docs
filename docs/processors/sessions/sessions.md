---
sidebar_position: 1
---

# Generating Session Tokens

Sessions allow you to keep track of user activity across your products and third-party integrations. It is an optional flow that enables visibility into customer usage patterns, debugging of recurring issues, and the ability to recreate a user's journey from your backend’s perspective.

After [setting up sessions](../../apps/products/sessions), you can use the `ductape.processor.sessions.start()` method to initialize a session and generate a **session token** and a **refresh token**.

## Usage

```ts
const data = {
  userId: "1919102009383",
  details: {
    username: "feekayo",
    email: "fikayo@ductape.app"
  }
}

await ductape.processor.sessions.start({
  product: "my-product-tag",
  env: "snd",
  tag: "session-tag",
  data
})
````

## Parameters

| Name      | Type     | Required | Description                                                                 |
| --------- | -------- | -------- | --------------------------------------------------------------------------- |
| `product` | `string` | ✅ Yes    | The product tag (as defined in your Ductape dashboard).                     |
| `env`     | `string` | ✅ Yes    | The environment (`dev`, `snd`, `prd`, etc.) the session is associated with. |
| `tag`     | `string` | ✅ Yes    | A custom label for the session (e.g., `checkout-flow`, `support-chat`).     |
| `data`    | `object` | ✅ Yes    | Payload containing identifying user information and identifier as defined in the session specification |


## Response

On success, this method returns an object containing the session token and refresh token, which should be persisted client-side or server-side depending on your architecture.

### Example Response

```json
{
  "token": "ejyui11919102393:abc123xyz456...",
  "refreshToken": "eueywuwjwmwmw:zyx456cba321..."
}
```

### Response Fields

| Field           | Type     | Description                                                    |
| --------------- | -------- | -------------------------------------------------------------- |
| `token` | `string` | A short-lived token used to identify the current session.      |
| `refreshToken` | `string` | A long-lived token used to refresh or resume a user’s session. |

## Best Practices

* **Store both tokens securely.** Avoid exposing them in public logs or front-end code unless encrypted.
* **Regenerate sessions on major flows.** Use different `tag`s for different flows or features to track user behavior effectively.
* **Attach identifiers.** Always provide a stable identifier and enrich the user details payload as much details as you can spare if available.

## Related Guides

* [Understanding Sessions](../../products/sessions)
* [Tracking Actions](../tracking/actions)
* [Refreshing Sessions](./refreshing)