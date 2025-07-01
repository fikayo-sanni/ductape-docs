---
sidebar_position: 5
---

# Processing Database Actions

Processing database actions is done using `db.execute(data)` of the ductape.processor interface.

It executes a database action processor within the Ductape system, handling a database action request based on the provided environment, product tag, and other parameters.

```ts
await ductape.processor.db.execute(data: IDBActionProcessorInput)
```

This processes a defined database action in the specified environment and application context, passing along request input, metadata, and optionally session tracking.


## Parameters

### `IDBActionProcessorInput`

| Field         | Type                                           | Required | Description                                                    |
| ------------- | ---------------------------------------------- | -------- | -------------------------------------------------------------- |
| `env`         | `string`                                       | Yes      | Environment slug (e.g., `"dev"`, `"prd"`).                     |
| `product_tag` | `string`                                       | Yes      | Product tag associated with this database action.              |
| `event`       | `string`                                       | Yes      | Event tag identifying the database action to be processed.     |
| `cache`       | `string`                                       | No       | Cache tag (if using request caching).                          |
| `input`       | [`IDbActionRequest`](#idbactionrequest-schema) | Yes      | Request input including data and optional filter.              |
| `session`     | [`ISession`](#isession-schema)                 | No       | Optional session tracking object.                              |
| `retries`     | `number`                                       | No       | Number of retry attempts if execution fails.                   |


## `IDbActionRequest` Schema

```ts
interface IDbActionRequest {
  data: Record<string, unknown>;
  filter?: Record<string, unknown>;
}
```

| Field    | Type                      | Required | Description                                                                 |
| -------- | ------------------------- | -------- | --------------------------------------------------------------------------- |
| `data`   | `Record<string, unknown>` | Yes      | Payload used in the action (e.g. create/update).                            |
| `filter` | `Record<string, unknown>` | No       | Criteria for selecting records (for update/delete). If not used, pass `{}`. |

> **Note:** If any of the above fields are undefined or empty, pass them as `{}`.


## `ISession` Schema

The `session` field enables optional session tracking for any database action run.

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


## Returns

A `Promise<unknown>` — resolves with the database action's output. The shape of the response depends on the implementation of the triggered database action.


## Example

```ts
const data: IDBActionProcessorInput = {
  env: 'dev',
  product_tag: 'my-product',
  event: 'postgres-db-tag:update_user',
  input: {
    data: { name: 'John Doe', email: 'john@example.com' },
    filter: { userId: '123' }
  },
  session: {
    tag: 'session-123',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  },
  retries: 2
};

const res = await ductape.processor.db.execute(data);
```


## See Also

* [Defining Database Actions](../../category/database-actions/)
* [Session Tracking](../sessions)
* [Caching Support](../../products/caches/managing-caches)
