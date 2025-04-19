---
sidebar_position: 6
---

# Executing Migrations

Database migrations can be triggered using the `ductape.processor.db.migration` interface.

This interface provides two methods:

- `run` – Executes the specified database migration.
- `rollback` – Rolls back (reverts) the specified migration.

## Function Signatures

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

| Name       | Type     | Required | Description                                                        |
|------------|----------|----------|--------------------------------------------------------------------|
| `migration`| `string` | Yes      | The full migration tag in the format `"database_tag:action_tag"`. |
| `env`      | `string` | Yes      | The slug of the environment (e.g., `"dev"`, `"prd"`).              |
| `product`  | `string` | Yes      | The product tag the migration belongs to.                          |


## Returns

A `Promise<unknown>` that resolves with the result of the migration execution.  
The structure of the result depends on the logic defined within the migration itself.

## Example Usage

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


> Note: The `migration` tag should follow the format `database_tag:action_tag`, where:
> - `database_tag` identifies the database the migration belongs to
> - `action_tag` is the specific migration action to run