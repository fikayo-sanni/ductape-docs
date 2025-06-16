---
sidebar_position: 1
---

# Processing Features

Features are executed using `ductape.processor.feature.run(data)`, which triggers a defined feature processor within the Ductape system.

This method handles a feature request based on the provided environment, product tag, and optionally user session and cache configurations.


## Usage

```ts
await ductape.processor.feature.run(data: IProcessorInput)
````

## Input

### `IProcessorInput`

Object containing parameters needed to execute a feature.

| Property      | Type                      | Required   | Description                                                             |
| ------------- | ------------------------- | ---------- | ----------------------------------------------------------------------- |
| `product_tag` | `string`                  | ✅ Yes      | Unique identifier for the product executing the feature.                |
| `env`         | `string`                  | ✅ Yes      | Environment slug (`"dev"`, `"prd"`, etc.).                              |
| `feature_tag` | `string`                  | ✅ Yes      | Tag of the feature to execute.                                          |
| `input`       | `Record<string, unknown>` | ✅ Yes      | Input parameters for the feature. Use `{}` if no parameters are needed. |
| `session`     | `ISession`         | ❌ Optional | Attach user session context to the request.                             |
| `cache`       | `string`                  | ❌ Optional | Cache tag to cache this request (e.g., `"get-user-details"`).           |


### `ISession`

Optional object to enable session tracking and access session-based user data.

```ts
{
  tag: string;
  token: string;
}
```

| Field   | Type     | Required | Description                                   |
| ------- | -------- | -------- | --------------------------------------------- |
| `tag`   | `string` | ✅ Yes    | Tag identifying the session type.             |
| `token` | `string` | ✅ Yes    | Token generated when the session was created. |


### Injecting Session Data into Input

You can inject properties from the session payload into the `input` object using the `$Session{tag}{key}` annotation.

* This resolves the value dynamically from the decrypted session object.
* For example:

```ts
input: {
  userId: "$Session{details}{id}",
  email: "$Session{details}{email}"
}
```

> Ensure the session contains a matching `tag` and fields (e.g., `id`, `email`).


## Output

A `Promise<unknown>` resolving with the result of the feature execution. The structure depends on the feature implementation.


## Example Usage

```ts
import { ductape } from '@ductape/sdk';

const data = {
  product_tag: "my-product",
  env: "prd",
  feature_tag: "deploy_auction_and_bid",
  input: {
    beneficiary: "$Session{details}{walletAddress}",
    amount: 40
  },
  session: {
    tag: "user-session",
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  cache: "deploy-feature-result"
};

const res = await ductape.processor.feature.run(data);
```

## Notes

* If `input` is empty or not required, use `input: {}`.
* Caching is useful for idempotent or read-only feature calls.
* Session injection is resolved server-side after the token is decrypted.

## Related

* [Starting a Session](../sessions/generating)
* [Decrypting Session Tokens](../sessions/decrypting)
* [Refreshing Session Tokens](../sessions/refreshing)