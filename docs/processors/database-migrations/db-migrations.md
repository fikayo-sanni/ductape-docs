---
sidebar_position: 6
---

# Processing Database Migrations

Processing database migrations is done using the `ductape.processor.db.migration` interface.

This interface provides two methods for managing migrations:

- `run` — Executes the specified database migration.
- `rollback` — Rolls back (reverts) the specified migration.

```ts
await ductape.processor.db.migration.run({
  migration: string,
  env: string,
  product: string
})

await ductape.processor.db.migration.rollback({
  migration: string,
  env: string,
  product: string
})
```


## Parameters

Both `run` and `rollback` methods accept the same input object:

| Field        | Type     | Required | Description                                                        |
| ------------ | -------- | -------- | ------------------------------------------------------------------ |
| `migration`  | `string` | Yes      | The full migration tag in the format `"database_tag:action_tag"`.   |
| `env`        | `string` | Yes      | Environment slug (e.g. `"dev"`, `"prd"`).                         |
| `product`    | `string` | Yes      | Product tag the migration belongs to.                              |

> **Note:** The `migration` tag should follow the format `database_tag:action_tag`, where:
> - `database_tag` identifies the database the migration belongs to
> - `action_tag` is the specific migration action to run


## Returns

A `Promise<unknown>` — resolves with the result of the migration execution. The structure of the result depends on the logic defined within the migration itself.


## Example

### Run a Migration
```ts
await ductape.processor.db.migration.run({
  migration: 'postgres-db:create_users_table',
  env: 'dev',
  product: 'my-product'
});
```

### Rollback a Migration
```ts
await ductape.processor.db.migration.rollback({
  migration: 'postgres-db:create_users_table',
  env: 'dev',
  product: 'my-product'
});
```


## See Also

* [Defining Database Actions](../../category/database-actions/)
* [Session Tracking](../sessions)