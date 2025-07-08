---
sidebar_position: 6
---

# Decrypting Session Tokens

You can decrypt a session token using the `ductape.processor.sessions.decrypt({...})` method to retrieve the original user-related payload stored when the session was created. This is useful for validating user identity, tracing session state, or referencing contextual information across systems.

## Overview

After a session is created with [`sessions.start({...})`](../sessions/#how-to-generate-a-session-token), you can decrypt the session token by providing a session payload. The method returns the original object that was stored during session creation — this structure is dynamic and may include any user-defined fields.

## Input

The method accepts a session payload in the following structure:

```typescript
{
  product: string;
  env: string;
  tag: string;
  token: string;
}
```

| Field     | Type     | Required | Description                                             |
| --------- | -------- | -------- | ------------------------------------------------------- |
| `product` | `string` | Yes      | The tag of the product the session was associated with. |
| `env`     | `string` | Yes      | The environment slug (e.g., `dev`, `snd`, `prd`).       |
| `tag`     | `string` | Yes      | The session tag used when the session was created.      |
| `token`   | `string` | Yes      | The session token returned from the session start call. |

## Output

The response is the original payload that was passed during session creation. It is dynamic and will contain the exact structure you stored, such as:

```typescript
{
  userId: '1919102009383',
  details: {
    username: 'feekayo',
    email: 'fikayo@ductape.app'
  },
  role: 'admin',
  flags: {
    onboardingComplete: true
  }
}
```

| Field      | Type  | Description                                           |
| ---------- | ----- | ----------------------------------------------------- |
| *(varies)* | any   | The exact object stored when the session was created. |

> Note: Because the payload is user-defined, there is no enforced schema on the output. You should validate the structure based on your expected shape at runtime.

## Example Usage

```typescript
const sessionPayload = {
  product: 'my-product',
  env: 'dev',
  tag: 'session-tag',
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
};

const sessionData = await ductape.processor.sessions.decrypt(sessionPayload);

// Example result
{
  userId: '1919102009383',
  details: {
    username: 'feekayo',
    email: 'fikayo@ductape.app'
  },
  role: 'admin'
}
```

## Use Cases

- Retrieve custom metadata saved during login or onboarding
- Rehydrate user identity in stateless processes
- Trace and inspect user journeys across integrated services

## See Also
- [Generating Session Tokens](./sessions.md)
- [Refreshing Session Tokens](./refreshing.md)
- [Tracking Sessions in Actions](../actions/run-actions.md#isession-schema)
- [Tracking Sessions in DB Actions](../database-actions/db-actions.md#isession-schema)