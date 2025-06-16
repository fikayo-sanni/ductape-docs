---
sidebar_position: 5
---

# Executing Database Actions

Database actions are executed using:

```ts
await ductape.processor.db.execute(data: IDBActionProcessorInput)
````

This method runs a database action within the Ductape system, using provided environment settings, product context, and action-specific input. It also supports optional caching, retries, and session tracking.


## Parameters

### `IDBActionProcessorInput`

| Field         | Type                                           | Required | Description                                                    |
| ------------- | ---------------------------------------------- | -------- | -------------------------------------------------------------- |
| `env`         | `string`                                       | ✅ Yes    | Environment slug (e.g., `"dev"`, `"prd"`).                     |
| `product_tag` | `string`                                       | ✅ Yes    | Unique product identifier associated with the database action. |
| `event`       | `string`                                       | ✅ Yes    | Tag identifying the database action to execute.                |
| `cache`       | `string`                                       | ❌ No     | Optional cache tag for request caching.                        |
| `input`       | [`IDbActionRequest`](#idbactionrequest-schema) | ✅ Yes    | Input data and optional filter for the action.                 |
| `session`     | [`ISession`](#ISession-schema)     | ❌ No     | Optional session tracking object.                              |
| `retries`     | `number`                                       | ❌ No     | Number of retry attempts in case of execution failure.         |


## `IDbActionRequest` Schema

```ts
interface IDbActionRequest {
  data: Record<string, unknown>;
  filter?: Record<string, unknown>;
}
```

| Field    | Type                      | Required | Description                                                                 |
| -------- | ------------------------- | -------- | --------------------------------------------------------------------------- |
| `data`   | `Record<string, unknown>` | ✅ Yes    | Payload used in the action (e.g. create/update).                            |
| `filter` | `Record<string, unknown>` | ❌ No     | Criteria for selecting records (for update/delete). If not used, pass `{}`. |

## `ISession` Schema

The optional `session` field enables session tracking on database actions.

```ts
interface ISession {
  tag: string;   // session tag
  token: string; // encoded session token (e.g., signed string or JWT)
}
```

| Field   | Type     | Required | Description                                   |
| ------- | -------- | -------- | --------------------------------------------- |
| `tag`   | `string` | ✅ Yes    | Identifier for the session.                   |
| `token` | `string` | ✅ Yes    | Token for validating or tracking the session. |

## Returns

A `Promise<unknown>` resolving with the result of the database action.
The structure of the result depends on the specific database action executed.


## Example Usage

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
