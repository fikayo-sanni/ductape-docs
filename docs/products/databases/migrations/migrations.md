---
sidebar_position: 1
---
# Database Migrations

A **database migration** is a versioned set of changes (such as creating or altering tables) that you apply to your product's database. Migrations help you evolve your database schema safely and consistently across environments. Ductape lets you define, track, and manage migrations for each product environment, ensuring your data structure stays in sync as your application grows.

## What is a Migration?
A migration consists of two parts:
- **up**: SQL statements to apply the migration (e.g., create a table, add a column).
- **down**: SQL statements to undo the migration (e.g., drop a table, remove a column).

Migrations are versioned and can be applied or rolled back as needed.

## Migration Structure

The `IProductDatabaseMigration` type defines the structure of a migration:

| Field         | Type         | Description                                        |
|-------------- |--------------|----------------------------------------------------|
| `name`        | `string`     | Human-readable name for the migration              |
| `description` | `string`     | (Optional) Description of what the migration does  |
| `tag`         | `string`     | Unique identifier for the migration                |
| `value`       | `object`     | Migration SQL statements (see below)               |
| `value.up`    | `string[]`   | SQL statements to apply the migration              |
| `value.down`  | `string[]`   | SQL statements to undo the migration               |
| `created_at`  | `string`     | (Optional) ISO timestamp of creation               |
| `updated_at`  | `string`     | (Optional) ISO timestamp of last update            |

> **Note:** The `value` field is an object with two arrays: `up` and `down`.
> Example: `{"up": ["CREATE TABLE ..."], "down": ["DROP TABLE ..."]}`

## Creating a Migration

To create a new migration, provide all required fields and the SQL statements for both `up` and `down` operations:

```typescript
import ductape from './ductapeClient';
import { IProductDatabaseMigration } from '@ductape/sdk/types';

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

## Fetching Migrations

### Fetch All Migrations for a Database
Retrieve all migrations for a specific database by its tag:

```typescript
const allMigrations = await ductape.product.migrations.fetchAll('my_database_tag');
```

### Fetch a Single Migration by Tag
Use the format `database_tag:migration_tag` to fetch a specific migration:

```typescript
const migration = await ductape.product.migrations.fetch('my_database_tag:create_users_table');
```

## Updating a Migration
Update an existing migration by providing the tag and only the fields you want to change:

```typescript
await ductape.product.migrations.update('create_users_table', {
  description: 'Updated table creation script',
  value: {
    up: ['CREATE TABLE users (id SERIAL PRIMARY KEY, name TEXT, email TEXT);'],
    down: ['DROP TABLE users;']
  }
});
```

## Best Practices & Tips
- Always provide both `up` and `down` SQL statements for safe rollbacks.
- Use clear, descriptive names and tags for migrations.
- Test migrations in a development environment before applying to production.
- Keep migrations small and focused for easier troubleshooting.

## Next Steps
- [Managing Databases](../database.md)
- [Database Actions](../database-actions/PostgreSQL.md)
- [Fetching Database Actions](../database-actions/Fetching.md)