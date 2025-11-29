---
sidebar_position: 8
---

# Table Management

Complete guide to creating, modifying, and managing database tables using the Ductape SDK. Supports PostgreSQL, MySQL, MongoDB collections, and DynamoDB tables.

## Quick Example

```ts
import { SchemaHelpers } from '@ductape/sdk';

// Create a table
await ductape.database.createTable(
  { env: 'dev', product: 'my-app', database: 'main-db' },
  {
    name: 'products',
    columns: [
      SchemaHelpers.id(),
      SchemaHelpers.string('name', 255, false),
      SchemaHelpers.decimal('price', 10, 2),
      SchemaHelpers.boolean('is_active', true),
      ...SchemaHelpers.timestamps(),
    ],
  },
  { ifNotExists: true }
);

// List all tables
const tables = await ductape.database.listTables({
  env: 'dev',
  product: 'my-app',
  database: 'main-db',
});

// Check if table exists
const exists = await ductape.database.tableExists(
  { env: 'dev', product: 'my-app', database: 'main-db' },
  'products'
);
```

## Connection Context

Establish a connection context to avoid repeating configuration:

```ts
// Connect once
await ductape.database.connect({
  env: 'prd',
  product: 'my-app',
  database: 'main-db',
});

// All table operations inherit context
await ductape.database.listTables({});
await ductape.database.tableExists({}, 'users');
```

Or specify the full configuration on each call:

```ts
const config = {
  env: 'dev',
  product: 'my-app',
  database: 'main-db',
};

await ductape.database.createTable(config, schema);
```

## Creating Tables

### Basic Table Creation

```ts
import { SchemaHelpers, ColumnType } from '@ductape/sdk';

await ductape.database.createTable(
  { env: 'dev', product: 'my-app', database: 'main-db' },
  {
    name: 'users',
    columns: [
      SchemaHelpers.id(),
      SchemaHelpers.string('email', 255, false),
      SchemaHelpers.string('name', 255),
      ...SchemaHelpers.timestamps(),
    ],
  },
  { ifNotExists: true }
);
```

### Table with All Column Types

```ts
await ductape.database.createTable(
  config,
  {
    name: 'products',
    columns: [
      // Primary key
      SchemaHelpers.id(),

      // Strings
      SchemaHelpers.string('sku', 50, false),
      SchemaHelpers.string('name', 255, false),
      SchemaHelpers.text('description'),

      // Numbers
      SchemaHelpers.integer('stock'),
      SchemaHelpers.bigint('views'),
      SchemaHelpers.decimal('price', 10, 2),
      SchemaHelpers.float('rating'),

      // Boolean
      SchemaHelpers.boolean('is_active', true),

      // Dates
      SchemaHelpers.date('launch_date'),
      SchemaHelpers.datetime('scheduled_at'),

      // JSON
      SchemaHelpers.json('settings'),
      SchemaHelpers.jsonb('metadata'), // PostgreSQL only

      // Timestamps
      ...SchemaHelpers.timestamps(),
      SchemaHelpers.softDelete(),
    ],
  }
);
```

### Table with Foreign Keys

```ts
await ductape.database.createTable(
  config,
  {
    name: 'orders',
    columns: [
      SchemaHelpers.id(),
      SchemaHelpers.foreignKey('customer_id', 'users'),
      SchemaHelpers.decimal('total', 10, 2),
      SchemaHelpers.string('status', 50),
      ...SchemaHelpers.timestamps(),
    ],
  }
);
```

### Table with Indexes

```ts
await ductape.database.createTable(
  config,
  {
    name: 'users',
    columns: [
      SchemaHelpers.id(),
      SchemaHelpers.string('email', 255, false),
      SchemaHelpers.string('username', 100, false),
      ...SchemaHelpers.timestamps(),
    ],
    indexes: [
      {
        name: 'idx_users_email',
        table: 'users',
        columns: [{ name: 'email' }],
        unique: true,
      },
      {
        name: 'idx_users_username',
        table: 'users',
        columns: [{ name: 'username' }],
        unique: true,
      },
      {
        name: 'idx_users_created',
        table: 'users',
        columns: [{ name: 'created_at', order: 'DESC' }],
      },
    ],
  }
);
```

### Advanced Column Definition

```ts
import { ColumnType } from '@ductape/sdk';

await ductape.database.createTable(
  config,
  {
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
        references: {
          table: 'users',
          column: 'id',
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        },
      },
      {
        name: 'status',
        type: ColumnType.ENUM,
        enumValues: ['pending', 'processing', 'completed', 'cancelled'],
        nullable: false,
        defaultValue: 'pending',
      },
      {
        name: 'total',
        type: ColumnType.DECIMAL,
        precision: 10,
        scale: 2,
        nullable: false,
      },
      {
        name: 'notes',
        type: ColumnType.TEXT,
        nullable: true,
      },
      {
        name: 'created_at',
        type: ColumnType.TIMESTAMP,
        nullable: false,
        defaultValue: 'CURRENT_TIMESTAMP',
      },
    ],
  }
);
```

### Create Table Options

```ts
await ductape.database.createTable(
  config,
  schema,
  {
    ifNotExists: true,           // Don't error if table exists
    temporary: false,            // Create temporary table
    unlogged: false,             // Unlogged table (PostgreSQL)
    engine: 'InnoDB',            // Storage engine (MySQL)
    charset: 'utf8mb4',          // Character set (MySQL)
    collation: 'utf8mb4_unicode_ci', // Collation (MySQL)
  }
);
```

## Schema Helpers Reference

Pre-configured column definitions for common types:

### Primary Keys

```ts
SchemaHelpers.id()              // Auto-increment INTEGER primary key
SchemaHelpers.uuid()            // UUID primary key
```

### String Types

```ts
SchemaHelpers.string('name', 255)           // VARCHAR(255), nullable
SchemaHelpers.string('email', 255, false)   // VARCHAR(255), NOT NULL
SchemaHelpers.text('description')           // TEXT
```

### Numeric Types

```ts
SchemaHelpers.integer('age')                // INTEGER
SchemaHelpers.bigint('views')               // BIGINT
SchemaHelpers.decimal('price', 10, 2)       // DECIMAL(10,2)
SchemaHelpers.float('rating')               // FLOAT
```

### Boolean Type

```ts
SchemaHelpers.boolean('is_active')          // BOOLEAN, nullable
SchemaHelpers.boolean('is_active', true)    // BOOLEAN, default TRUE
```

### Date and Time Types

```ts
SchemaHelpers.date('birth_date')            // DATE
SchemaHelpers.datetime('scheduled_at')      // DATETIME
SchemaHelpers.timestamp('logged_at')        // TIMESTAMP
```

### JSON Types

```ts
SchemaHelpers.json('settings')              // JSON
SchemaHelpers.jsonb('metadata')             // JSONB (PostgreSQL only)
```

### Foreign Keys

```ts
SchemaHelpers.foreignKey('user_id', 'users')              // FK to users.id
SchemaHelpers.foreignKey('author_id', 'users', 'CASCADE') // With ON DELETE CASCADE
```

### Special Helpers

```ts
...SchemaHelpers.timestamps()               // created_at, updated_at
SchemaHelpers.softDelete()                  // deleted_at for soft deletes
```

## Listing Tables

### List All Tables

```ts
const tables = await ductape.database.listTables({
  env: 'dev',
  product: 'my-app',
  database: 'main-db',
});

console.log('Tables:', tables);
// Output: ["users", "products", "orders", ...]
```

### With Connection Context

```ts
await ductape.database.connect({
  env: 'prd',
  product: 'my-app',
  database: 'main-db',
});

const tables = await ductape.database.listTables({});
```

## Checking Table Existence

### Check if Table Exists

```ts
const exists = await ductape.database.tableExists(
  { env: 'dev', product: 'my-app', database: 'main-db' },
  'users'
);

if (exists) {
  console.log('Table exists');
} else {
  console.log('Table does not exist');
}
```

### Conditional Table Creation

```ts
const tableName = 'products';

const exists = await ductape.database.tableExists(config, tableName);

if (!exists) {
  await ductape.database.createTable(config, {
    name: tableName,
    columns: [...],
  });
}
```

Or use the `ifNotExists` option:

```ts
await ductape.database.createTable(
  config,
  schema,
  { ifNotExists: true }
);
```

## Getting Table Schema

### Retrieve Table Schema

```ts
const schema = await ductape.database.getTableSchema(
  { env: 'dev', product: 'my-app', database: 'main-db' },
  'users'
);

console.log('Table name:', schema.name);
console.log('Columns:', schema.columns);
console.log('Indexes:', schema.indexes);
console.log('Constraints:', schema.constraints);
```

### Schema Response Structure

```ts
interface ITableSchema {
  name: string;
  columns: Array<{
    name: string;
    type: ColumnType;
    nullable: boolean;
    primaryKey: boolean;
    autoIncrement: boolean;
    defaultValue?: any;
    length?: number;
    precision?: number;
    scale?: number;
    references?: {
      table: string;
      column: string;
      onDelete?: string;
      onUpdate?: string;
    };
  }>;
  indexes?: Array<{
    name: string;
    table: string;
    columns: Array<{ name: string; order?: 'ASC' | 'DESC' }>;
    unique: boolean;
    primaryKey: boolean;
  }>;
  constraints?: Array<{
    name: string;
    type: 'PRIMARY_KEY' | 'FOREIGN_KEY' | 'UNIQUE' | 'CHECK';
    columns: string[];
    references?: {
      table: string;
      columns: string[];
    };
  }>;
}
```

### Inspect Table Structure

```ts
const schema = await ductape.database.getTableSchema(config, 'orders');

// List all columns
schema.columns.forEach((col) => {
  console.log(`${col.name}: ${col.type}${col.nullable ? '' : ' NOT NULL'}`);
});

// Find primary key
const pk = schema.columns.find(col => col.primaryKey);
console.log('Primary key:', pk?.name);

// List foreign keys
const fks = schema.columns.filter(col => col.references);
fks.forEach((fk) => {
  console.log(`${fk.name} -> ${fk.references?.table}.${fk.references?.column}`);
});

// List indexes
schema.indexes?.forEach((idx) => {
  console.log(`${idx.name}: ${idx.columns.map(c => c.name).join(', ')}`);
});
```

## Altering Tables

### Add Column

```ts
import { ColumnAlterationType, SchemaHelpers } from '@ductape/sdk';

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
```

### Add Multiple Columns

```ts
await ductape.database.alterTable(
  config,
  'products',
  [
    {
      type: ColumnAlterationType.ADD,
      column: SchemaHelpers.string('sku', 50),
    },
    {
      type: ColumnAlterationType.ADD,
      column: SchemaHelpers.text('long_description'),
    },
    {
      type: ColumnAlterationType.ADD,
      column: SchemaHelpers.json('attributes'),
    },
  ]
);
```

### Modify Column

```ts
import { ColumnType } from '@ductape/sdk';

await ductape.database.alterTable(
  config,
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
```

### Rename Column

```ts
await ductape.database.alterTable(
  config,
  'users',
  [
    {
      type: ColumnAlterationType.RENAME,
      oldName: 'username',
      newName: 'user_name',
    },
  ]
);
```

### Drop Column

```ts
await ductape.database.alterTable(
  config,
  'users',
  [
    {
      type: ColumnAlterationType.DROP,
      columnName: 'deprecated_field',
    },
  ]
);
```

### Multiple Alterations

```ts
await ductape.database.alterTable(
  config,
  'products',
  [
    // Add new columns
    {
      type: ColumnAlterationType.ADD,
      column: SchemaHelpers.string('brand', 100),
    },
    // Rename existing column
    {
      type: ColumnAlterationType.RENAME,
      oldName: 'desc',
      newName: 'description',
    },
    // Drop deprecated column
    {
      type: ColumnAlterationType.DROP,
      columnName: 'old_field',
    },
  ]
);
```

### Alter Table Options

```ts
await ductape.database.alterTable(
  config,
  'users',
  alterations,
  {
    ifExists: true,              // Only alter if table exists
    cascade: false,              // CASCADE or RESTRICT (PostgreSQL)
  }
);
```

## Dropping Tables

### Drop a Table

```ts
await ductape.database.dropTable(
  { env: 'dev', product: 'my-app', database: 'main-db' },
  'old_table'
);
```

### Drop with Cascade

```ts
// Drop table and all dependent objects
await ductape.database.dropTable(
  config,
  'users',
  { cascade: true }
);
```

### Conditional Drop

```ts
// Only drop if exists (no error if missing)
await ductape.database.dropTable(
  config,
  'temp_table',
  { ifExists: true }
);
```

### Safe Drop Pattern

```ts
const tableName = 'old_users';

const exists = await ductape.database.tableExists(config, tableName);

if (exists) {
  console.log(`Dropping table: ${tableName}`);
  await ductape.database.dropTable(config, tableName);
} else {
  console.log(`Table ${tableName} does not exist`);
}
```

## Column Types Reference

### Complete Type List

| Type | Description | Example | Database Support |
|------|-------------|---------|------------------|
| `INTEGER` | Whole numbers | `42` | All |
| `BIGINT` | Large integers | `9007199254740991` | PostgreSQL, MySQL |
| `FLOAT` | Floating point | `3.14` | All |
| `DOUBLE` | Double precision | `3.141592653589793` | PostgreSQL, MySQL |
| `DECIMAL` | Fixed precision | `99.99` | PostgreSQL, MySQL |
| `STRING` | Variable text | `"hello"` | All (VARCHAR) |
| `TEXT` | Long text | Long content | All |
| `BOOLEAN` | True/false | `true`, `false` | All |
| `DATE` | Date only | `2024-01-15` | PostgreSQL, MySQL |
| `DATETIME` | Date and time | `2024-01-15 14:30:00` | All |
| `TIMESTAMP` | Unix timestamp | Auto-managed | All |
| `JSON` | JSON data | `{"key": "value"}` | PostgreSQL, MySQL 5.7+ |
| `JSONB` | Binary JSON | Indexed JSON | PostgreSQL only |
| `UUID` | UUID | `a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11` | PostgreSQL, MySQL 8+ |
| `ENUM` | Enumeration | `'pending'` | PostgreSQL, MySQL |
| `ARRAY` | Array type | `[1,2,3]` | PostgreSQL |

### Type Mapping Across Databases

| SDK Type | PostgreSQL | MySQL | MongoDB | DynamoDB |
|----------|-----------|--------|---------|----------|
| `INTEGER` | `INTEGER` | `INT` | `Number` | `N` |
| `STRING` | `VARCHAR(n)` | `VARCHAR(n)` | `String` | `S` |
| `TEXT` | `TEXT` | `TEXT` | `String` | `S` |
| `BOOLEAN` | `BOOLEAN` | `TINYINT(1)` | `Boolean` | `BOOL` |
| `DECIMAL` | `NUMERIC(p,s)` | `DECIMAL(p,s)` | `Decimal128` | `N` |
| `TIMESTAMP` | `TIMESTAMP` | `TIMESTAMP` | `Date` | `N` |
| `JSON` | `JSON` | `JSON` | `Object` | `M` |
| `JSONB` | `JSONB` | `JSON` | `Object` | `M` |
| `UUID` | `UUID` | `CHAR(36)` | `String` | `S` |
| `ARRAY` | `ARRAY` | - | `Array` | `L` |

## Database-Specific Features

### PostgreSQL

```ts
// JSONB column with GIN index
await ductape.database.createTable(
  config,
  {
    name: 'documents',
    columns: [
      SchemaHelpers.id(),
      SchemaHelpers.jsonb('data'),
    ],
    indexes: [
      {
        name: 'idx_documents_data',
        table: 'documents',
        columns: [{ name: 'data' }],
        method: 'gin',
      },
    ],
  }
);

// Array column
{
  name: 'tags',
  type: ColumnType.ARRAY,
  arrayType: ColumnType.STRING,
}

// Unlogged table (faster, no crash recovery)
await ductape.database.createTable(
  config,
  schema,
  { unlogged: true }
);
```

### MySQL

```ts
// Specify storage engine and charset
await ductape.database.createTable(
  config,
  schema,
  {
    engine: 'InnoDB',
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
  }
);

// Full-text index
{
  name: 'idx_fulltext_description',
  table: 'products',
  columns: [{ name: 'description' }],
  type: 'FULLTEXT',
}
```

### MongoDB Collections

```ts
// MongoDB uses collections instead of tables
await ductape.database.createTable(
  config,
  {
    name: 'users',  // Creates collection
    columns: [
      { name: '_id', type: ColumnType.UUID, primaryKey: true },
      { name: 'email', type: ColumnType.STRING },
      { name: 'profile', type: ColumnType.JSON },
    ],
    indexes: [
      {
        name: 'idx_email',
        table: 'users',
        columns: [{ name: 'email' }],
        unique: true,
      },
    ],
  }
);
```

### DynamoDB Tables

```ts
// DynamoDB specific configuration
await ductape.database.createTable(
  config,
  {
    name: 'users',
    columns: [
      { name: 'id', type: ColumnType.STRING, primaryKey: true },
      { name: 'email', type: ColumnType.STRING },
      { name: 'created_at', type: ColumnType.TIMESTAMP },
    ],
    // DynamoDB uses indexes differently
    indexes: [
      {
        name: 'email-index',
        table: 'users',
        columns: [{ name: 'email' }],
        type: 'GSI', // Global Secondary Index
      },
    ],
  },
  {
    billingMode: 'PAY_PER_REQUEST', // or 'PROVISIONED'
    readCapacity: 5,
    writeCapacity: 5,
  }
);
```

## Common Patterns

### Soft Delete Tables

```ts
await ductape.database.createTable(
  config,
  {
    name: 'users',
    columns: [
      SchemaHelpers.id(),
      SchemaHelpers.string('email', 255, false),
      ...SchemaHelpers.timestamps(),
      SchemaHelpers.softDelete(), // deleted_at column
    ],
  }
);

// Query excluding deleted records
await ductape.database.query({
  table: 'users',
  where: {
    deleted_at: null,
  },
});
```

### Audit Tables

```ts
await ductape.database.createTable(
  config,
  {
    name: 'audit_logs',
    columns: [
      SchemaHelpers.id(),
      SchemaHelpers.foreignKey('user_id', 'users'),
      SchemaHelpers.string('action', 100, false),
      SchemaHelpers.string('entity_type', 100),
      SchemaHelpers.integer('entity_id'),
      SchemaHelpers.json('changes'),
      SchemaHelpers.string('ip_address', 45),
      SchemaHelpers.timestamp('created_at'),
    ],
    indexes: [
      {
        name: 'idx_audit_user_action',
        table: 'audit_logs',
        columns: [
          { name: 'user_id' },
          { name: 'action' },
        ],
      },
      {
        name: 'idx_audit_entity',
        table: 'audit_logs',
        columns: [
          { name: 'entity_type' },
          { name: 'entity_id' },
        ],
      },
      {
        name: 'idx_audit_created',
        table: 'audit_logs',
        columns: [{ name: 'created_at', order: 'DESC' }],
      },
    ],
  }
);
```

### Polymorphic Associations

```ts
await ductape.database.createTable(
  config,
  {
    name: 'comments',
    columns: [
      SchemaHelpers.id(),
      SchemaHelpers.foreignKey('user_id', 'users'),
      SchemaHelpers.text('content'),
      // Polymorphic fields
      SchemaHelpers.string('commentable_type', 100), // "Post", "Product", etc.
      SchemaHelpers.integer('commentable_id'),
      ...SchemaHelpers.timestamps(),
    ],
    indexes: [
      {
        name: 'idx_comments_polymorphic',
        table: 'comments',
        columns: [
          { name: 'commentable_type' },
          { name: 'commentable_id' },
        ],
      },
    ],
  }
);
```

### Partitioned Tables (PostgreSQL)

```ts
// Parent table
await ductape.database.createTable(
  config,
  {
    name: 'events',
    columns: [
      SchemaHelpers.id(),
      SchemaHelpers.string('event_type', 100),
      SchemaHelpers.json('data'),
      SchemaHelpers.timestamp('created_at'),
    ],
  }
);

// Partition by range (month)
await ductape.database.raw({
  env: 'dev',
  product: 'my-app',
  database: 'main-db',
  query: `
    ALTER TABLE events
    PARTITION BY RANGE (created_at);

    CREATE TABLE events_2024_01
    PARTITION OF events
    FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');
  `,
});
```

## Best Practices

### 1. Always Use Migrations for Production

```ts
// ❌ Bad: Direct table creation in production
await ductape.database.createTable(config, schema);

// ✅ Good: Use migrations for version control
import { createTableMigration } from '@ductape/sdk';

const migration = createTableMigration('create_users_table', schema);
await ductape.database.runMigration(migration, config);
```

### 2. Use ifNotExists for Idempotency

```ts
await ductape.database.createTable(
  config,
  schema,
  { ifNotExists: true } // Safe to run multiple times
);
```

### 3. Define Indexes at Creation

```ts
// ✅ Good: Define indexes when creating table
await ductape.database.createTable(
  config,
  {
    name: 'users',
    columns: [...],
    indexes: [
      { name: 'idx_email', table: 'users', columns: [{ name: 'email' }], unique: true },
    ],
  }
);
```

### 4. Use Schema Helpers

```ts
// ❌ Bad: Manual column definition
{
  name: 'created_at',
  type: ColumnType.TIMESTAMP,
  nullable: false,
  defaultValue: 'CURRENT_TIMESTAMP',
}

// ✅ Good: Use helper
...SchemaHelpers.timestamps()
```

### 5. Always Include Timestamps

```ts
await ductape.database.createTable(
  config,
  {
    name: 'products',
    columns: [
      SchemaHelpers.id(),
      // ... other columns
      ...SchemaHelpers.timestamps(), // created_at, updated_at
    ],
  }
);
```

### 6. Foreign Keys for Referential Integrity

```ts
// ✅ Good: Use foreign keys
{
  name: 'user_id',
  type: ColumnType.INTEGER,
  references: {
    table: 'users',
    column: 'id',
    onDelete: 'CASCADE',
  },
}
```

### 7. Check Existence Before Dropping

```ts
const exists = await ductape.database.tableExists(config, 'temp_table');
if (exists) {
  await ductape.database.dropTable(config, 'temp_table');
}
```

### 8. Name Tables and Columns Consistently

```ts
// ✅ Good: Consistent naming
// - Tables: plural, snake_case
// - Columns: snake_case
// - Indexes: idx_{table}_{columns}
// - Foreign keys: {related_table_singular}_id

await ductape.database.createTable(
  config,
  {
    name: 'order_items',           // plural, snake_case
    columns: [
      SchemaHelpers.id(),
      SchemaHelpers.foreignKey('order_id', 'orders'),
      SchemaHelpers.foreignKey('product_id', 'products'),
      SchemaHelpers.integer('quantity'),
      SchemaHelpers.decimal('unit_price', 10, 2),
    ],
    indexes: [
      {
        name: 'idx_order_items_order',
        table: 'order_items',
        columns: [{ name: 'order_id' }],
      },
    ],
  }
);
```

## Error Handling

```ts
import { DatabaseError, DatabaseErrorType } from '@ductape/sdk';

try {
  await ductape.database.createTable(config, schema);
} catch (error) {
  if (error instanceof DatabaseError) {
    switch (error.type) {
      case DatabaseErrorType.SCHEMA_ERROR:
        console.error('Invalid schema definition');
        break;
      case DatabaseErrorType.TABLE_EXISTS:
        console.error('Table already exists');
        // Consider using ifNotExists option
        break;
      case DatabaseErrorType.CONNECTION_ERROR:
        console.error('Database connection failed');
        break;
      default:
        throw error;
    }
  }
}
```

## Performance Considerations

### 1. Create Indexes Concurrently (PostgreSQL)

```ts
// Won't block table during index creation
await ductape.database.createIndex({
  ...config,
  table: 'users',
  index: indexDef,
  concurrent: true,
});
```

### 2. Use Appropriate Column Types

```ts
// ❌ Bad: TEXT for short strings
SchemaHelpers.text('country_code')  // Wastes space

// ✅ Good: VARCHAR with appropriate length
SchemaHelpers.string('country_code', 2)  // Efficient
```

### 3. Avoid Over-Indexing

```ts
// ❌ Bad: Too many indexes
indexes: [
  { name: 'idx_col1', columns: [{ name: 'col1' }] },
  { name: 'idx_col2', columns: [{ name: 'col2' }] },
  { name: 'idx_col3', columns: [{ name: 'col3' }] },
  { name: 'idx_col4', columns: [{ name: 'col4' }] },
  // Slows down INSERT/UPDATE/DELETE
]

// ✅ Good: Index strategically
indexes: [
  // Composite index covers multiple query patterns
  { name: 'idx_user_status', columns: [
    { name: 'user_id' },
    { name: 'status' },
  ]},
]
```

## Next Steps

- [Migrations](./migrations) - Version-controlled schema changes
- [Indexing](./indexing) - Optimize query performance
- [Direct Queries](./direct-queries) - Full database API reference
- [Best Practices](./best-practices) - Production patterns

## See Also

* [Getting Started](./getting-started)
* [Querying Data](./querying)
* [Writing Data](./writing-data)
