---
sidebar_position: 1
---

# Processing Quotas

Quotas are managed using `ductape.processor.quota.run(data)` within the Ductape system. This processor allows you to enforce, check, and update usage quotas for products or features.

```ts
await ductape.processor.quota.run(data: IQuotaProcessorInput)
```

This processes a quota event in the specified environment and application context, handling quota checks, increments, or resets.


## Parameters

### `IQuotaProcessorInput`

| Field         | Type                        | Required | Description                                     |
| ------------- | --------------------------- | -------- | ----------------------------------------------- |
| `env`         | `string`                    | Yes      | Environment slug (e.g., `"dev"`, `"prd"`).      |
| `product_tag` | `string`                    | Yes      | Unique identifier for the product.              |
| `quota_tag`   | `string`                    | Yes      | Tag of the quota to check or update.            |
| `action`      | `string`                    | Yes      | Action to perform: `"check"`, `"increment"`, or `"reset"`. |
| `amount`      | `number`                    | No       | Amount to increment (for `increment` action).   |
| `session`     | [`ISession`](#isession-schema) | No   | Attach user session context to the request.     |
| `cache`       | `string`                    | No       | Cache tag to cache this request, if applicable. |

> **Note:** Optional fields can be omitted or passed as empty `{}`.


## `ISession` Schema

The `session` field enables optional session tracking for any quota operation.

```ts
interface ISession {
  tag: string;   // session tag
  token: string; // session token (e.g. signed JWT)
}
```

| Field   | Type     | Required | Description                                   |
| ------- | -------- | -------- | --------------------------------------------- |
| `tag`   | `string` | Yes      | Tag identifying the session type.             |
| `token` | `string` | Yes      | Token generated when the session was created. |


## Returns

Returns a `Promise<unknown>` resolving with the result of the quota operation. The exact structure depends on the specific quota action.


## Example

```ts
const data = {
  env: "prd",
  product_tag: "my-product",
  quota_tag: "api-requests",
  action: "increment",
  amount: 1,
  session: {
    tag: "user-session",
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  cache: "quota-api-requests"
};

const res = await ductape.processor.quota.run(data);
```


## See Also

* [Session Tracking](../sessions)
* [Processing Features](features/features) 