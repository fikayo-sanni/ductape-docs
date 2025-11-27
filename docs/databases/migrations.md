---
sidebar_position: 6
---

# Database Migrations

Migrations provide version-controlled schema changes for your database. Create tables, add columns, create indexes, and evolve your schema safely across environments.

## Quick Example

```ts
import { createTableMigration, SchemaHelpers } from '@ductape/sdk';

// Define migration
const migration = createTableMigration('create_users_table', {
  name: 'users',
  columns: [
    SchemaHelpers.id(),
    SchemaHelpers.string('email', 255, false),
    SchemaHelpers.string('name', 255),
    ...SchemaHelpers.timestamps(),
  ],
});

// Run migration
await ductape.database.runMigration(migration, {
  env: 'dev',
  product: 'my-app',
  database: 'main-db',
});
```

## Why Use Migrations?

- **Version Control** - Track schema changes alongside code
- **Reproducibility** - Apply the same changes across all environments
- **Rollback** - Safely undo changes when needed
- **Team Collaboration** - Share schema changes with your team
- **Audit Trail** - Know what changed, when, and by whom

## Creating Migrations

### Using Migration Helpers

The SDK provides helper functions for common migrations:

#### Create Table Migration

```ts
import { createTableMigration, SchemaHelpers } from '@ductape/sdk';

const migration = createTableMigration('create_products_table', {
  name: 'products',
  columns: [
    SchemaHelpers.id(),
    SchemaHelpers.string('name', 255, false),
    SchemaHelpers.text('description'),
    SchemaHelpers.decimal('price', 10, 2),
    SchemaHelpers.integer('stock'),
    SchemaHelpers.boolean('is_active', true),
    SchemaHelpers.json('metadata'),
    ...SchemaHelpers.timestamps(),
  ],
});
```

#### Add Column Migration

```ts
import { addColumnMigration, SchemaHelpers } from '@ductape/sdk';

const migration = addColumnMigration(
  'add_phone_to_users',
  'users',
  SchemaHelpers.string('phone', 20)
);
```

#### Add Index Migration

```ts
import { addIndexMigration } from '@ductape/sdk';

const migration = addIndexMigration(
  'add_email_index',
  'users',
  'idx_users_email',
  ['email'],
  true // unique
);
```

### Manual Migration Definition

For complex migrations, define them manually:

```ts
import { createMigration, createTable, addColumn, dropTable, ColumnType } from '@ductape/sdk';

const migration = createMigration(
  'create_orders_system',
  // Up migrations (apply)
  [
    createTable({
      name: 'orders',
      columns: [
        {
          name: 'id',
          type: ColumnType.UUID,
          primaryKey: true,
          nullable: false,
          defaultValue: 'gen_random_uuid()',
        },
        {
          name: 'customer_id',
          type: ColumnType.INTEGER,
          nullable: false,
          references: { table: 'users', column: 'id' },
        },
        {
          name: 'total',
          type: ColumnType.DECIMAL,
          precision: 10,
          scale: 2,
          nullable: false,
        },
        {
          name: 'status',
          type: ColumnType.ENUM,
          enumValues: ['pending', 'processing', 'completed', 'cancelled'],
          nullable: false,
          defaultValue: 'pending',
        },
        {
          name: 'created_at',
          type: ColumnType.TIMESTAMP,
          nullable: false,
          defaultValue: 'NOW()',
        },
      ],
    }),
    createTable({
      name: 'order_items',
      columns: [
        { name: 'id', type: ColumnType.INTEGER, primaryKey: true, autoIncrement: true },
        { name: 'order_id', type: ColumnType.UUID, nullable: false },
        { name: 'product_id', type: ColumnType.INTEGER, nullable: false },
        { name: 'quantity', type: ColumnType.INTEGER, nullable: false },
        { name: 'unit_price', type: ColumnType.DECIMAL, precision: 10, scale: 2 },
      ],
    }),
  ],
  // Down migrations (rollback)
  [
    dropTable('order_items'),
    dropTable('orders'),
  ]
);
```

## Schema Helpers

Pre-configured column definitions for common types:

```ts
import { SchemaHelpers } from '@ductape/sdk';

const columns = [
  // Primary Keys
  SchemaHelpers.id(),                           // Auto-increment integer PK
  SchemaHelpers.uuid(),                         // UUID primary key

  // Strings
  SchemaHelpers.string('name', 255),            // VARCHAR(255), nullable
  SchemaHelpers.string('email', 255, false),    // VARCHAR(255), not null
  SchemaHelpers.text('description'),            // TEXT

  // Numbers
  SchemaHelpers.integer('count'),               // INTEGER
  SchemaHelpers.bigint('views'),                // BIGINT
  SchemaHelpers.decimal('price', 10, 2),        // DECIMAL(10,2)
  SchemaHelpers.float('rating'),                // FLOAT

  // Boolean
  SchemaHelpers.boolean('is_active', true),     // BOOLEAN, default true

  // Dates
  SchemaHelpers.date('birth_date'),             // DATE
  SchemaHelpers.datetime('scheduled_at'),       // DATETIME
  SchemaHelpers.timestamp('logged_at'),         // TIMESTAMP

  // JSON
  SchemaHelpers.json('settings'),               // JSON
  SchemaHelpers.jsonb('metadata'),              // JSONB (PostgreSQL)

  // References
  SchemaHelpers.foreignKey('user_id', 'users'), // INTEGER FK to users.id

  // Timestamps
  ...SchemaHelpers.timestamps(),                // created_at, updated_at
  SchemaHelpers.softDelete(),                   // deleted_at
];
```

## Column Types

| Type | Description | SQL Equivalent |
|------|-------------|----------------|
| `INTEGER` | Integer number | INT |
| `BIGINT` | Large integer | BIGINT |
| `FLOAT` | Floating point | FLOAT |
| `DOUBLE` | Double precision | DOUBLE |
| `DECIMAL` | Exact decimal | DECIMAL(p,s) |
| `STRING` | Variable text | VARCHAR(n) |
| `TEXT` | Long text | TEXT |
| `BOOLEAN` | True/false | BOOLEAN |
| `DATE` | Date only | DATE |
| `DATETIME` | Date and time | DATETIME |
| `TIMESTAMP` | Timestamp | TIMESTAMP |
| `JSON` | JSON data | JSON |
| `JSONB` | Binary JSON | JSONB (PostgreSQL) |
| `UUID` | UUID | UUID |
| `ENUM` | Enumeration | ENUM |
| `ARRAY` | Array type | ARRAY |

## Running Migrations

### Run a Migration

```ts
const result = await ductape.database.runMigration(migration, {
  env: 'dev',
  product: 'my-app',
  database: 'main-db',
});

console.log('Success:', result.success);
console.log('Operations:', result.operations);
```

### Execute via Action Tag

```ts
await ductape.processor.db.migration.run({
  migration: 'main-db:create_users_table',
  env: 'prd',
  product: 'my-app',
});
```

## Rolling Back Migrations

### Rollback a Migration

```ts
const result = await ductape.database.rollbackMigration(migration, {
  env: 'dev',
  product: 'my-app',
  database: 'main-db',
});

console.log('Rollback success:', result.success);
```

### Rollback via Action Tag

```ts
await ductape.processor.db.migration.rollback({
  migration: 'main-db:create_users_table',
  env: 'prd',
  product: 'my-app',
});
```

## Migration History

### Get Migration History

```ts
const history = await ductape.database.getMigrationHistory({
  env: 'prd',
  product: 'my-app',
  database: 'main-db',
});

history.forEach((entry) => {
  console.log('Tag:', entry.tag);
  console.log('Name:', entry.name);
  console.log('Applied at:', entry.appliedAt);
  console.log('Applied by:', entry.appliedBy);
  console.log('---');
});
```

### Get Migration Status

```ts
const status = await ductape.database.getMigrationStatus({
  env: 'prd',
  product: 'my-app',
  database: 'main-db',
  definedMigrations: allMigrations, // Your migration definitions
});

console.log('Total migrations:', status.total);
console.log('Completed:', status.completed);
console.log('Pending:', status.pending);
console.log('Last applied:', status.lastApplied?.name);
console.log('Pending migrations:', status.pendingMigrations);
```

## Schema Management

### Create Table Directly

```ts
import { SchemaHelpers, ColumnType } from '@ductape/sdk';

await ductape.database.createTable(
  {
    env: 'dev',
    product: 'my-app',
    database: 'main-db',
  },
  {
    name: 'users',
    columns: [
      SchemaHelpers.id(),
      SchemaHelpers.string('email', 255, false),
      SchemaHelpers.string('name', 255),
      ...SchemaHelpers.timestamps(),
    ],
    indexes: [
      {
        name: 'idx_users_email',
        table: 'users',
        columns: [{ name: 'email' }],
        unique: true,
      },
    ],
  },
  { ifNotExists: true }
);
```

### Alter Table

```ts
import { ColumnAlterationType, SchemaHelpers } from '@ductape/sdk';

// Add column
await ductape.database.alterTable(
  { env: 'dev', product: 'my-app', database: 'main-db' },
  'users',
  [
    {
      type: ColumnAlterationType.ADD,
      column: SchemaHelpers.string('phone', 20),
    },
  ]
);

// Modify column
await ductape.database.alterTable(
  { env: 'dev', product: 'my-app', database: 'main-db' },
  'users',
  [
    {
      type: ColumnAlterationType.MODIFY,
      column: {
        name: 'bio',
        type: ColumnType.TEXT,
        nullable: true,
      },
    },
  ]
);

// Drop column
await ductape.database.alterTable(
  { env: 'dev', product: 'my-app', database: 'main-db' },
  'users',
  [
    {
      type: ColumnAlterationType.DROP,
      columnName: 'old_field',
    },
  ]
);

// Rename column
await ductape.database.alterTable(
  { env: 'dev', product: 'my-app', database: 'main-db' },
  'users',
  [
    {
      type: ColumnAlterationType.RENAME,
      oldName: 'old_name',
      newName: 'new_name',
    },
  ]
);
```

### Drop Table

```ts
await ductape.database.dropTable(
  { env: 'dev', product: 'my-app', database: 'main-db' },
  'old_table'
);
```

### List Tables

```ts
const tables = await ductape.database.listTables({
  env: 'dev',
  product: 'my-app',
  database: 'main-db',
});

console.log('Tables:', tables);
```

## Index Management

Indexes improve query performance by allowing the database to find rows without scanning the entire table. Proper indexing is crucial for application performance.

### Why Use Indexes?

| Without Index | With Index |
|--------------|------------|
| Full table scan | Direct row lookup |
| O(n) complexity | O(log n) complexity |
| Slow on large tables | Fast regardless of size |
| High I/O | Minimal I/O |

### Create Index

```ts
await ductape.database.createIndex({
  env: 'dev',
  product: 'my-app',
  database: 'main-db',
  table: 'users',
  index: {
    name: 'idx_users_email',
    table: 'users',
    columns: [{ name: 'email' }],
    unique: true,
  },
  ifNotExists: true,
});
```

### Index Types

#### Single Column Index

Index on one column - best for simple lookups:

```ts
// For queries like: WHERE email = 'user@example.com'
await ductape.database.createIndex({
  ...config,
  table: 'users',
  index: {
    name: 'idx_users_email',
    table: 'users',
    columns: [{ name: 'email' }],
  },
});
```

#### Composite Index

Index on multiple columns - order matters:

```ts
// For queries like: WHERE customer_id = 123 AND status = 'active'
await ductape.database.createIndex({
  ...config,
  table: 'orders',
  index: {
    name: 'idx_orders_customer_status',
    table: 'orders',
    columns: [
      { name: 'customer_id' },
      { name: 'status' },
    ],
  },
});
```

**Important**: Column order in composite indexes matters. The index above works for:
- `WHERE customer_id = 123`
- `WHERE customer_id = 123 AND status = 'active'`

But NOT efficiently for:
- `WHERE status = 'active'` (needs separate index)

#### Unique Index

Enforces uniqueness constraint:

```ts
await ductape.database.createIndex({
  ...config,
  table: 'users',
  index: {
    name: 'idx_users_email_unique',
    table: 'users',
    columns: [{ name: 'email' }],
    unique: true,
  },
});
```

#### Sorted Index

Control sort order for range queries:

```ts
// For queries with ORDER BY created_at DESC
await ductape.database.createIndex({
  ...config,
  table: 'orders',
  index: {
    name: 'idx_orders_created_desc',
    table: 'orders',
    columns: [
      { name: 'created_at', order: 'DESC' },
    ],
  },
});
```

#### Partial Index (PostgreSQL)

Index only rows matching a condition:

```ts
// Only index active users - smaller and faster
await ductape.database.createIndex({
  ...config,
  table: 'users',
  index: {
    name: 'idx_users_email_active',
    table: 'users',
    columns: [{ name: 'email' }],
    where: "status = 'active'", // Partial index condition
  },
});
```

#### Index Methods (PostgreSQL)

Specify the index algorithm:

```ts
// B-tree (default) - Best for equality and range queries
await ductape.database.createIndex({
  ...config,
  table: 'orders',
  index: {
    name: 'idx_orders_total',
    table: 'orders',
    columns: [{ name: 'total' }],
    method: 'btree',
  },
});

// Hash - Best for equality comparisons only
await ductape.database.createIndex({
  ...config,
  table: 'sessions',
  index: {
    name: 'idx_sessions_token',
    table: 'sessions',
    columns: [{ name: 'token' }],
    method: 'hash',
  },
});

// GIN - Best for full-text search and JSONB
await ductape.database.createIndex({
  ...config,
  table: 'products',
  index: {
    name: 'idx_products_metadata',
    table: 'products',
    columns: [{ name: 'metadata' }],
    method: 'gin',
  },
});

// GiST - Best for geometric and full-text data
await ductape.database.createIndex({
  ...config,
  table: 'locations',
  index: {
    name: 'idx_locations_coords',
    table: 'locations',
    columns: [{ name: 'coordinates' }],
    method: 'gist',
  },
});
```

### Concurrent Index Creation (PostgreSQL)

Create indexes without locking the table:

```ts
// Won't block reads/writes during creation
await ductape.database.createIndex({
  env: 'prd',
  product: 'my-app',
  database: 'main-db',
  table: 'users',
  index: {
    name: 'idx_users_email',
    table: 'users',
    columns: [{ name: 'email' }],
    unique: true,
  },
  concurrent: true, // Create without locking
});
```

### List Indexes

View all indexes on a table:

```ts
const indexes = await ductape.database.listIndexes({
  env: 'dev',
  product: 'my-app',
  database: 'main-db',
  table: 'users',
  includeSystem: false, // Exclude system-generated indexes
});

indexes.forEach((index) => {
  console.log('Name:', index.name);
  console.log('Table:', index.table);
  console.log('Columns:', index.columns);
  console.log('Unique:', index.unique);
  console.log('Primary Key:', index.primaryKey);
  console.log('Type:', index.type);
  console.log('Size:', index.size);
  console.log('---');
});
```

### Get Index Statistics

Analyze index usage and performance:

```ts
// Get statistics for all indexes on a table
const stats = await ductape.database.getIndexStatistics(
  { env: 'prd', product: 'my-app', database: 'main-db' },
  'users'
);

stats.forEach((stat) => {
  console.log('Index:', stat.indexName);
  console.log('Scans:', stat.scans);
  console.log('Tuples Read:', stat.tuplesRead);
  console.log('Size:', stat.sizeFormatted);
  console.log('Last Used:', stat.lastUsed);
  console.log('Bloated:', stat.bloated);
  console.log('---');
});

// Get statistics for a specific index
const emailStats = await ductape.database.getIndexStatistics(
  { env: 'prd', product: 'my-app', database: 'main-db' },
  'users',
  'idx_users_email'
);
```

### Drop Index

Remove an index:

```ts
await ductape.database.dropIndex({
  env: 'dev',
  product: 'my-app',
  database: 'main-db',
  table: 'users',
  indexName: 'idx_users_old',
  ifExists: true,
  concurrent: true,  // PostgreSQL: Drop without locking
  cascade: false,    // Also drop dependent objects
});
```

### Index via Migration

Create indexes as part of migrations:

```ts
import { addIndexMigration } from '@ductape/sdk';

// Simple index migration
const emailIndex = addIndexMigration(
  'add_users_email_index',
  'users',
  'idx_users_email',
  ['email'],
  true // unique
);

// Composite index migration
const orderIndex = addIndexMigration(
  'add_orders_composite_index',
  'orders',
  'idx_orders_customer_date',
  ['customer_id', 'created_at']
);

// Run the migrations
await ductape.database.runMigration(emailIndex, config);
await ductape.database.runMigration(orderIndex, config);
```

### Indexes with Table Creation

Add indexes when creating tables:

```ts
await ductape.database.createTable(
  { env: 'dev', product: 'my-app', database: 'main-db' },
  {
    name: 'orders',
    columns: [
      SchemaHelpers.id(),
      SchemaHelpers.foreignKey('customer_id', 'users'),
      SchemaHelpers.string('status', 50),
      SchemaHelpers.decimal('total', 10, 2),
      ...SchemaHelpers.timestamps(),
    ],
    indexes: [
      {
        name: 'idx_orders_customer',
        table: 'orders',
        columns: [{ name: 'customer_id' }],
      },
      {
        name: 'idx_orders_status',
        table: 'orders',
        columns: [{ name: 'status' }],
      },
      {
        name: 'idx_orders_created',
        table: 'orders',
        columns: [{ name: 'created_at', order: 'DESC' }],
      },
    ],
  }
);
```

### When to Create Indexes

| Column Type | Index Recommended |
|-------------|-------------------|
| Primary key | Automatic |
| Foreign key | Yes |
| Columns in WHERE clauses | Yes |
| Columns in ORDER BY | Consider |
| Columns in JOIN conditions | Yes |
| Low cardinality (few unique values) | Usually no |
| Frequently updated columns | Consider trade-offs |

### Index Best Practices

1. **Index foreign keys** - Always index columns used in JOINs
2. **Consider query patterns** - Index columns frequently used in WHERE clauses
3. **Composite index order** - Put most selective column first
4. **Don't over-index** - Each index slows down INSERT/UPDATE/DELETE
5. **Monitor index usage** - Remove unused indexes
6. **Use partial indexes** - When queries filter on specific values
7. **Rebuild periodically** - Indexes can become fragmented

### Database-Specific Notes

#### PostgreSQL
- Supports B-tree, Hash, GIN, GiST, SP-GiST, BRIN
- Partial indexes for filtered queries
- Expression indexes for computed values
- Concurrent index creation: `CONCURRENTLY` option

#### MySQL
- Supports B-tree and Hash (engine-dependent)
- Full-text indexes for text search
- Spatial indexes for geometry
- Prefix indexes for long strings

#### MongoDB
- Single field, compound, multikey indexes
- Text indexes for text search
- 2dsphere for geospatial
- TTL indexes for auto-expiration

## Migration Parameters

| Field | Type | Description |
|-------|------|-------------|
| `migration` | string | Migration tag in format `database_tag:migration_tag` |
| `env` | string | Environment (dev, staging, prd) |
| `product` | string | Product tag |
| `database` | string | Database tag |

## Best Practices

### 1. Always Define Down Migrations

```ts
// Good: Has rollback
const migration = createMigration(
  'add_column',
  [addColumn('users', { name: 'phone', type: ColumnType.STRING })],
  [dropColumn('users', 'phone')] // Down migration
);
```

### 2. Use Unique Migration Tags

```ts
import { generateMigrationTag } from '@ductape/sdk';

const tag = generateMigrationTag('add_users_table');
// "1234567890_add_users_table"
```

### 3. Test Migrations in Dev First

Always test migrations in development before applying to production.

### 4. Keep Migrations Small

Create separate migrations for each logical change.

### 5. Never Modify Applied Migrations

Once applied, create new migrations instead of modifying existing ones.

## Next Steps

- [Direct Queries](./direct-queries) - Raw SQL for complex schema operations
- [Best Practices](./best-practices) - Production migration patterns

## See Also

* [Database Overview](./overview)
* [Getting Started](./getting-started)
