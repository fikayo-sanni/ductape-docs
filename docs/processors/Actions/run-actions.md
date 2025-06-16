---
sidebar_position: 2
---

# Processing Actions

Processing actions is done using action.run(data) of the ductape.processor interface.  

It executes an action processor within the Ductape system, handling an action request based on the provided environment, product tag, and other parameters.  


```ts
await ductape.processor.action.run(data: IActionProcessorInput)
````

This processes a defined action in the specified environment and application context, passing along request input, metadata, and optionally session tracking.


## Parameters

### `IActionProcessorInput`

| Field         | Type                                       | Required | Description                                               |
| ------------- | ------------------------------------------ | -------- | --------------------------------------------------------- |
| `env`         | `string`                                   | ✅ Yes    | Environment slug (e.g. `"dev"`, `"prd"`).                 |
| `product_tag` | `string`                                   | ✅ Yes    | Product tag associated with this action.                  |
| `app`         | `string`                                   | ✅ Yes    | Access tag of the application triggering the action.      |
| `event`       | `string`                                   | ✅ Yes    | Event tag identifying the action to be processed.         |
| `cache`       | `string`                                   | ❌ No     | Cache tag (if using request caching).                     |
| `input`       | [`IActionRequest`](#iactionrequest-schema) | ✅ Yes    | Request input including query, body, headers, and params. |
| `session`     | [`ISession`](#ISession-schema) | ❌ No     | Optional session tracking object.                         |
| `retries`     | `number`                                   | ❌ No     | Number of retry attempts if execution fails.              |



## `IActionRequest` Schema

```ts
interface IActionRequest {
  query?: Record<string, unknown>;
  params?: Record<string, unknown>;
  body?: Record<string, unknown>;
  headers?: Record<string, unknown>;
}
```

| Field     | Type                      | Required | Description           |
| --------- | ------------------------- | -------- | --------------------- |
| `query`   | `Record<string, unknown>` | ❌ No     | URL query parameters. |
| `params`  | `Record<string, unknown>` | ❌ No     | Route parameters.     |
| `body`    | `Record<string, unknown>` | ❌ No     | Request body data.    |
| `headers` | `Record<string, unknown>` | ❌ No     | HTTP request headers. |

> 📝 **Note:** If any of the above fields are undefined or empty, pass them as `{}`.


## `ISession` Schema

The `session` field enables optional session tracking for any action run.

```ts
interface ISession {
  tag: string;   // session tag
  token: string; // session token (e.g. signed JWT)
}
```

| Field   | Type     | Required | Description                                           |
| ------- | -------- | -------- | ----------------------------------------------------- |
| `tag`   | `string` | ✅ Yes    | Session tag identifying the session.                  |
| `token` | `string` | ✅ Yes    | Encoded token used to validate and track the session. |



## Returns

A `Promise<unknown>` — resolves with the action’s output. The shape of the response depends on the implementation of the triggered action.


## Example

```ts
const data: IActionProcessorInput = {
  env: 'dev',
  product_tag: 'my-product',
  app: 'auth-service',
  event: 'user.signup',
  input: {
    query: { userId: '123' },
    body: { email: 'user@example.com' },
    headers: { Authorization: '$Auth{token_access}{token}' },
    params: {}
  },
  session: {
    tag: 'session-tag',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  },
  retries: 3
};

const result = await ductape.processor.action.run(data);
```


## See Also

* [Session Tracking](../sessions)