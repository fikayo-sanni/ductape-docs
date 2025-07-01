---
sidebar_position: 1
---

# Processing Fallbacks

Fallbacks are managed using `ductape.processor.fallback.run(data)` within the Ductape system. This processor allows you to define, trigger, and update fallback logic for products or features when primary actions fail or time out.

```ts
await ductape.processor.fallback.run(data: IFallbackProcessorInput)
```

This processes a fallback event in the specified environment and application context, handling fallback execution or updates.


## Parameters

### `IFallbackProcessorInput`

| Field         | Type                        | Required | Description                                     |
| ------------- | --------------------------- | -------- | ----------------------------------------------- |
| `env`         | `string`                    | Yes      | Environment slug (e.g., `"dev"`, `"prd"`).      |
| `product_tag` | `string`                    | Yes      | Unique identifier for the product.              |
| `fallback_tag`| `string`                    | Yes      | Tag of the fallback to trigger or update.       |
| `action`      | `string`                    | Yes      | Action to perform: `"trigger"`, `"update"`, or `"reset"`. |
| `input`       | `object`                    | No       | Input data for the fallback logic.              |
| `session`     | [`ISession`](#isession-schema) | No   | Attach user session context to the request.     |
| `cache`       | `string`                    | No       | Cache tag to cache this request, if applicable. |

> **Note:** Optional fields can be omitted or passed as empty `{}`.


## `ISession` Schema

The `session` field enables optional session tracking for any fallback operation.

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

Returns a `Promise<unknown>` resolving with the result of the fallback operation. The exact structure depends on the specific fallback action.


## Example

```ts
const data = {
  env: "prd",
  product_tag: "my-product",
  fallback_tag: "payment-failure",
  action: "trigger",
  input: {
    orderId: "12345",
    reason: "timeout"
  },
  session: {
    tag: "user-session",
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  cache: "fallback-payment-failure"
};

const res = await ductape.processor.fallback.run(data);
```


## See Also

* [Session Tracking](../sessions)
* [Processing Features](../features/processing) 