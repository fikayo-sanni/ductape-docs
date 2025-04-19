---
sidebar_position: 1
---
# Managing Database Migrations

Ductape allows you to define and manage **database migrations** for your product environments. Migrations are versioned sets of `up` and `down` SQL operations that can be tracked and executed.

### Creating a Migration

To create a new database migration:

```ts
import ductape from './ductapeClient';
import { IProductDatabaseMigration } from 'ductape-sdk/dist/types';

const migration: IProductDatabaseMigration = {
  name: 'Create users table',
  description: 'Initial table setup',
  tag: 'create_users_table',
  value: {
    up: ['CREATE TABLE users (id SERIAL PRIMARY KEY, name TEXT);'],
    down: ['DROP TABLE users;']
  }
};

await ductape.product.migrations.create(migration);
```

### Fields for `IProductDatabaseMigration`

| Field         | Type                    | Description                                               |
|---------------|-------------------------|-----------------------------------------------------------|
| `name`        | `string`                | A user-friendly name for the migration.                   |
| `description` | `string` (optional)     | A brief description of what the migration does.           |
| `tag`         | `string`                | A unique identifier for the migration.                    |
| `value.up`    | `string[]`              | List of SQL statements to apply the migration.            |
| `value.down`  | `string[]`              | List of SQL statements to undo the migration.             |
| `created_at`  | `string` (optional)     | ISO timestamp of creation.                               |
| `updated_at`  | `string` (optional)     | ISO timestamp of last update.                            |


## Fetching Migrations

### Fetch All Migrations for a Database

```ts
const allMigrations = await ductape.product.migrations.fetchAll('my_database_tag');
```

### Fetch a Single Migration by Tag

Use the format: `database_tag:action_tag`.

```ts
const migration = await ductape.product.migrations.fetch('my_database_tag:create_users_table');
```


## Updating a Migration

```ts
await ductape.product.migrations.update('create_users_table', {
  description: 'Updated table creation script',
  value: {
    up: ['CREATE TABLE users (id SERIAL PRIMARY KEY, name TEXT, email TEXT);'],
    down: ['DROP TABLE users;']
  }
});
```

Only include the fields you want to update.