---
sidebar_position: 1
---

# Processing Features

Processing features is done using `ductape.processor.feature.run(data)` of the ductape.processor interface.

It executes a feature processor within the Ductape system, handling a feature request based on the provided environment, product tag, and other parameters.

```ts
await ductape.processor.feature.run(data: IFeatureProcessorInput)
```

This processes a defined feature in the specified environment and application context, passing along request input, metadata, and optionally session tracking.


## Parameters

### `IFeatureProcessorInput`

| Field         | Type                      | Required | Description                                                             |
| ------------- | ------------------------- | -------- | ----------------------------------------------------------------------- |
| `product_tag` | `string`                  | Yes      | Unique identifier for the product executing the feature.                |
| `env`         | `string`                  | Yes      | Environment slug (e.g. `"dev"`, `"prd"`).                             |
| `feature_tag` | `string`                  | Yes      | Tag of the feature to execute.                                          |
| `input`       | `Record<string, unknown>` | Yes      | Input parameters for the feature. If not required, use `{}`.            |
| `session`     | [`ISession`](#isession-schema) | No   | Optional session tracking object.                                       |
| `cache`       | `string`                  | No       | Cache tag to cache this request (e.g., `"get-user-details"`).          |

> **Note:** If `input` is empty or not required, use `input: {}`.


## `ISession` Schema

The `session` field enables optional session tracking for any feature run.

```ts
interface ISession {
  tag: string;   // session tag
  token: string; // session token (e.g. signed JWT)
}
```

| Field   | Type     | Required | Description                                           |
| ------- | -------- | -------- | ----------------------------------------------------- |
| `tag`   | `string` | Yes      | Session tag identifying the session.                  |
| `token` | `string` | Yes      | Encoded token used to validate and track the session. |


## Injecting Session Data into Input

You can inject properties from the session payload into the `input` object using the `$Session{tag}{key}` annotation. This resolves the value dynamically from the decrypted session object.

For example:

```ts
input: {
  userId: "$Session{details}{id}",
  email: "$Session{details}{email}"
}
```

> Ensure the session contains a matching `tag` and fields (e.g., `id`, `email`).


## Returns

A `Promise<unknown>` — resolves with the result of the feature execution. The structure depends on the feature implementation.


## Example

```ts
const data: IFeatureProcessorInput = {
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


## See Also

* [Decrypting Session Tokens](../sessions/decrypting)
* [Refreshing Session Tokens](../sessions/refreshing)
* [Session Tracking](../sessions)