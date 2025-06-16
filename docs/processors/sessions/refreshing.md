---
sidebar_position: 3
---

# Refreshing Session Tokens

Session tokens can expire or become stale over time. If your application needs to maintain a user's session beyond the original token’s validity period, you can use `ductape.processor.sessions.refresh()` to generate a new token using a valid refresh token.

This allows you to keep the session alive without forcing the user to start a new session from scratch.

## Overview

To refresh a session, you must pass the same session context along with the original **refresh token** returned by `sessions.start()`.

## Input

The `refresh()` method accepts the following object:

```ts
{
  product: string;
  env: string;
  tag: string;
  refreshToken: string; // refresh token
}
````

| Field     | Type     | Required | Description                                                                 |
| --------- | -------- | -------- | --------------------------------------------------------------------------- |
| `product` | `string` | ✅ Yes    | The tag of the product the session was associated with.                     |
| `env`     | `string` | ✅ Yes    | The environment slug (e.g., `dev`, `snd`, `prd`).                           |
| `tag`     | `string` | ✅ Yes    | The session tag used when the session was created.                          |
| `refreshToken`   | `string` | ✅ Yes    | The **refresh token** returned by `sessions.start()` or a previous refresh. |


## Output

The response will include a new session token and a new refresh token.

```ts
{
  token: string;        // New session token
  refreshToken: string // New refresh token
}
```

| Field           | Type     | Description                                  |
| --------------- | -------- | -------------------------------------------- |
| `token`         | `string` | New session token to use in subsequent calls |
| `refreshToken` | `string` | Use this to refresh again when needed        |


## Example Usage

```ts
const refreshPayload = {
  product: 'my-product',
  env: 'dev',
  tag: 'session-tag',
  refreshToken: 'old-refresh-token-here'
};

const result = await ductape.processor.sessions.refresh(refreshPayload);

// result:
{
  token: 'new-session-token',
  refreshToken: 'new-refresh-token'
}
```

## Use Cases

* Maintain long-lived sessions without requiring re-authentication
* Automatically refresh tokens in background jobs or frontend apps
* Extend user journeys across multiple backend requests securely

## Related

* [Generating Session Tokens](../sessions)
* [Tracking Sessions in Actions](../actions/run-actions#isession-schema)
* [Tracking Sessions in DB Actions](../database-actions/db-actions#isession-schema)