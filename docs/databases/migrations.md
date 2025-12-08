---
sidebar_position: 6
---

# Database Migrations

Migrations provide version-controlled schema changes for your database. Every schema operation in Ductape automatically creates a migration, ensuring all changes are tracked, reproducible, and reversible across all environments.

## Quick Example

```ts
import { DatabaseService } from '@ductape/sdk';

const db = new DatabaseService();
await db.connect({ env: 'dev', product: 'my-app', database: 'main-db' });

// Create table - automatically generates and applies a migration
const result = await db.schema.create('users', {
  id: { type: 'uuid', primaryKey: true },
  email: { type: 'string', length: 255, required: true, unique: true },
  name: { type: 'string', length: 100 },
}, { timestamps: true });

// The migration is tracked and can be replayed
console.log('Migration:', result.migration.tag);
```

## How It Works

Unlike traditional ORMs where you write migration files manually, Ductape uses a **migration-first approach**:

1. **Every schema change creates a migration** - When you call `db.schema.create()`, `db.schema.addField()`, etc., a migration is automatically generated
2. **Migrations are applied immediately** - By default, the migration runs on the connected environment
3. **Migrations are tracked** - All applied migrations are stored in a migrations table
4. **Platform-independent** - The same migration works across PostgreSQL, MySQL, MongoDB, DynamoDB, Cassandra, and MariaDB

```
Your Code                  Generated Migration           Database
    ↓                            ↓                           ↓
db.schema.create()  →  { type: 'createCollection' }  →  CREATE TABLE
db.schema.addField() →  { type: 'addField' }         →  ALTER TABLE ADD
db.schema.dropIndex() → { type: 'dropIndex' }        →  DROP INDEX
```

## Why This Approach?

- **No migration files to manage** - Migrations are generated from your intent
- **Type-safe** - Schema definitions are validated at compile time
- **Cross-database** - Same API works for SQL and NoSQL databases
- **Automatic rollback** - Every migration includes down operations
- **Environment-aware** - Apply to dev, staging, or production

## Schema Operations (Automatic Migrations)

### Create Table

```ts
await db.schema.create('products', {
  id: { type: 'uuid', primaryKey: true },
  name: { type: 'string', length: 255, required: true },
  price: { type: 'decimal', precision: 10, scale: 2 },
  stock: 'integer',
  is_active: { type: 'boolean', default: true },
  metadata: 'json',
}, { timestamps: true });

// Generated migration:
// {
//   type: 'createCollection',
//   name: 'products',
//   fields: [...],
//   up: [...],
//   down: [{ type: 'dropCollection', name: 'products' }]
// }
```

### Add Field

```ts
await db.schema.addField('users', 'phone', {
  type: 'string',
  length: 20,
});

// Generated migration:
// {
//   type: 'addField',
//   collection: 'users',
//   field: { name: 'phone', type: 'string', length: 20 },
//   down: [{ type: 'dropField', collection: 'users', field: 'phone' }]
// }
```

### Drop Field

```ts
await db.schema.dropField('users', 'old_column');
```

### Rename Field

```ts
await db.schema.renameField('users', 'name', 'full_name');
```

### Modify Field

```ts
await db.schema.modifyField('users', 'email', {
  length: 500,
  required: true,
});
```

### Create Index

```ts
await db.schema.createIndex('users', ['email'], {
  unique: true,
  name: 'idx_users_email',
});
```

### Drop Index

```ts
await db.schema.dropIndex('users', 'idx_users_old');
```

### Add Constraint (SQL)

```ts
await db.schema.addConstraint('posts', {
  name: 'fk_posts_author',
  type: 'foreignKey',
  columns: ['author_id'],
  references: {
    table: 'users',
    columns: ['id'],
    onDelete: 'CASCADE',
  },
});
```

### Drop Table

```ts
await db.schema.drop('old_table', { cascade: true });
```

## Advanced: Migration Builder

For complex scenarios where you need to batch multiple operations or have more control, use the `MigrationBuilder`:

```ts
import { MigrationBuilder, migration } from '@ductape/sdk';

// Fluent API for building migrations
const usersMigration = migration('create_users_with_indexes')
  .description('Create users table with all indexes')
  .createCollection('users', [
    { name: 'id', type: 'uuid', primaryKey: true },
    { name: 'email', type: 'string', length: 255, unique: true },
    { name: 'name', type: 'string', length: 100 },
    { name: 'status', type: 'enum', enumValues: ['active', 'inactive'] },
  ])
  .createIndex('users', 'idx_users_email', [{ name: 'email' }], { unique: true })
  .createIndex('users', 'idx_users_status', [{ name: 'status' }])
  .build();

// Apply the migration
const engine = new MigrationEngine(db.getAdapter());
await engine.up(usersMigration);
```

### Batch Multiple Operations

```ts
const orderSystemMigration = migration('create_order_system')
  .description('Create orders and order_items tables')
  .createCollection('orders', [
    { name: 'id', type: 'uuid', primaryKey: true },
    { name: 'customer_id', type: 'uuid', nullable: false },
    { name: 'status', type: 'string', length: 50 },
    { name: 'total', type: 'decimal', precision: 10, scale: 2 },
  ])
  .createCollection('order_items', [
    { name: 'id', type: 'uuid', primaryKey: true },
    { name: 'order_id', type: 'uuid', nullable: false },
    { name: 'product_id', type: 'uuid', nullable: false },
    { name: 'quantity', type: 'integer' },
    { name: 'unit_price', type: 'decimal', precision: 10, scale: 2 },
  ])
  .createIndex('orders', 'idx_orders_customer', [{ name: 'customer_id' }])
  .createIndex('order_items', 'idx_order_items_order', [{ name: 'order_id' }])
  .build();
```

## Migration Engine

The `MigrationEngine` handles executing migrations directly:

```ts
import { MigrationEngine } from '@ductape/sdk';

const engine = new MigrationEngine(db.getAdapter());

// Run migration up
await engine.up(migration);

// Run migration down (rollback)
await engine.down(migration);

// Get migration history
const history = await engine.getHistory();

// Check migration status
const status = await engine.getStatus({
  definedMigrations: [migration1, migration2, migration3],
});

console.log('Pending migrations:', status.pending);
console.log('Completed migrations:', status.completed);
```

## Field Types

Platform-independent field types that work across all databases:

| Type | Description | SQL | MongoDB | DynamoDB | Cassandra |
|------|-------------|-----|---------|----------|-----------|
| `integer` | Whole numbers | INT | Number | N | int |
| `bigint` | Large integers | BIGINT | Long | N | bigint |
| `smallint` | Small integers | SMALLINT | Number | N | smallint |
| `float` | Floating point | FLOAT | Double | N | float |
| `double` | Double precision | DOUBLE | Double | N | double |
| `decimal` | Exact decimal | DECIMAL | Decimal128 | N | decimal |
| `string` | Variable text | VARCHAR | String | S | text |
| `text` | Long text | TEXT | String | S | text |
| `boolean` | True/false | BOOLEAN | Boolean | BOOL | boolean |
| `date` | Date only | DATE | Date | S | date |
| `time` | Time only | TIME | String | S | time |
| `datetime` | Date and time | DATETIME | Date | S | timestamp |
| `timestamp` | Timestamp | TIMESTAMP | Date | N | timestamp |
| `json` | JSON data | JSON/JSONB | Object | M | text |
| `uuid` | UUID | UUID | String | S | uuid |
| `enum` | Enumeration | ENUM | String | S | text |
| `array` | Array type | ARRAY | Array | L | list |
| `binary` | Binary data | BYTEA | BinData | B | blob |
| `blob` | Large binary | BLOB | BinData | B | blob |

## Database-Specific Migrations

### SQL Databases (PostgreSQL, MySQL, MariaDB)

```ts
await db.schema.create('users', {
  id: { type: 'uuid', primaryKey: true },
  email: { type: 'string', required: true },
}, {
  sqlOptions: {
    ifNotExists: true,
    temporary: false,
    unlogged: false,  // PostgreSQL only
  },
});

// Add constraint
await db.schema.addConstraint('orders', {
  name: 'fk_orders_user',
  type: 'foreignKey',
  columns: ['user_id'],
  references: {
    table: 'users',
    columns: ['id'],
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
});
```

### MongoDB

```ts
await db.schema.create('users', {
  _id: { type: 'uuid', primaryKey: true },
  email: { type: 'string', required: true },
}, {
  mongoOptions: {
    capped: false,
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        required: ['email'],
        properties: {
          email: { bsonType: 'string' }
        }
      }
    },
    validationLevel: 'strict',
    validationAction: 'error',
  },
});

// Shard a collection
// (handled via raw migration operations)
```

### DynamoDB

```ts
await db.schema.create('users', {
  id: { type: 'string', primaryKey: true },
  email: 'string',
  created_at: 'timestamp',
}, {
  dynamoOptions: {
    partitionKey: { name: 'id', type: 'S' },
    sortKey: { name: 'created_at', type: 'N' },
    billingMode: 'PAY_PER_REQUEST',
    globalSecondaryIndexes: [{
      name: 'email-index',
      partitionKey: { name: 'email', type: 'S' },
      projection: 'ALL',
    }],
    localSecondaryIndexes: [{
      name: 'created-index',
      sortKey: { name: 'created_at', type: 'N' },
      projection: 'KEYS_ONLY',
    }],
    streamEnabled: true,
    streamViewType: 'NEW_AND_OLD_IMAGES',
    ttlAttribute: 'expires_at',
  },
});
```

### Cassandra

```ts
await db.schema.create('events', {
  id: { type: 'uuid', primaryKey: true },
  user_id: 'uuid',
  event_type: 'string',
  data: 'json',
  created_at: 'timestamp',
}, {
  cassandraOptions: {
    partitionKey: ['user_id'],
    clusteringColumns: ['created_at', 'id'],
    clusteringOrder: [
      { column: 'created_at', order: 'DESC' },
      { column: 'id', order: 'ASC' },
    ],
    defaultTTL: 86400,
    compaction: {
      class: 'LeveledCompactionStrategy',
    },
  },
});
```

## Migration History

### View Migration History

```ts
const engine = new MigrationEngine(db.getAdapter());
const history = await engine.getHistory();

history.forEach((entry) => {
  console.log('Tag:', entry.tag);
  console.log('Name:', entry.name);
  console.log('Applied at:', entry.appliedAt);
  console.log('Checksum:', entry.checksum);
  console.log('---');
});
```

### Check Migration Status

```ts
const status = await engine.getStatus({
  definedMigrations: allMigrations,
});

console.log('Total:', status.total);
console.log('Completed:', status.completed);
console.log('Pending:', status.pending);
console.log('Last applied:', status.lastApplied?.name);

// List pending migrations
status.pendingMigrations.forEach((m) => {
  console.log('Pending:', m.name);
});
```

## Rolling Back Migrations

### Rollback Last Migration

```ts
const engine = new MigrationEngine(db.getAdapter());
await engine.down(lastMigration);
```

### Rollback to Specific Point

```ts
// Get history and find the target
const history = await engine.getHistory();
const targetIndex = history.findIndex(h => h.tag === 'target_migration_tag');

// Rollback each migration after the target
for (let i = history.length - 1; i > targetIndex; i--) {
  await engine.down(history[i].migration);
}
```

## Raw Operations

For database-specific operations not covered by the standard API:

```ts
const rawMigration = migration('custom_operation')
  .raw('postgresql', 'CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
  .raw('postgresql', 'CREATE INDEX CONCURRENTLY idx_users_email ON users(email)')
  .build();
```

## Best Practices

### 1. Keep Migrations Small

Create separate migrations for each logical change:

```ts
// Good: Separate migrations
await db.schema.create('users', { ... });
await db.schema.create('posts', { ... });
await db.schema.addField('users', 'avatar_url', 'string');

// Avoid: One giant migration with everything
```

### 2. Test in Development First

Always run migrations in development before production:

```ts
// Development
await db.connect({ env: 'dev', product: 'my-app', database: 'main-db' });
await db.schema.create('new_table', { ... });

// After testing, apply to production
await db.connect({ env: 'prd', product: 'my-app', database: 'main-db' });
await db.schema.create('new_table', { ... });
```

### 3. Use Descriptive Names

```ts
migration('add_phone_and_address_to_users')
migration('create_order_fulfillment_tables')
migration('add_composite_index_on_orders')
```

### 4. Include Both Up and Down

The simplified API automatically generates rollback operations, but verify they're correct for complex changes:

```ts
const result = await db.schema.addField('users', 'phone', 'string');

// Verify the down migration
console.log(result.migration.down);
// Should include: { type: 'dropField', collection: 'users', field: 'phone' }
```

### 5. Handle Data Migrations Separately

For data migrations, use the query API:

```ts
// Schema migration
await db.schema.addField('users', 'full_name', 'string');

// Data migration (separate operation)
await db.update({
  table: 'users',
  data: {
    full_name: { $CONCAT: ['first_name', ' ', 'last_name'] }
  },
  where: { full_name: null },
});

// Clean up old columns
await db.schema.dropField('users', 'first_name');
await db.schema.dropField('users', 'last_name');
```

## Migration Helpers

The `MigrationHelpers` class provides utilities for common operations:

```ts
import { MigrationHelpers } from '@ductape/sdk';

// Generate a unique migration tag
const tag = MigrationHelpers.generateTag('create_users');
// "20240115_143052_create_users"

// Validate a migration
const isValid = MigrationHelpers.validate(migration);

// Calculate migration checksum
const checksum = MigrationHelpers.checksum(migration);
```

## Troubleshooting

### Migration Already Applied

```ts
try {
  await db.schema.create('users', { ... });
} catch (error) {
  if (error.message.includes('already exists')) {
    console.log('Migration already applied, skipping');
  }
}
```

### Failed Migration

If a migration fails partway through:

1. Check the migration history to see what was applied
2. Manually fix the database state if needed
3. Mark the migration as failed or remove it from history
4. Re-run the migration

### Different Environments Out of Sync

```ts
// Get status for each environment
for (const env of ['dev', 'staging', 'prd']) {
  await db.connect({ env, product: 'my-app', database: 'main-db' });
  const status = await engine.getStatus({ definedMigrations: allMigrations });
  console.log(`${env}: ${status.completed}/${status.total} migrations applied`);
}
```

## Next Steps

- [Table Management](./table-management) - Detailed schema operations
- [Indexing](./indexing) - Performance optimization
- [Best Practices](./best-practices) - Production patterns

## See Also

* [Getting Started](./getting-started)
* [Querying Data](./querying)
* [Writing Data](./writing-data)
