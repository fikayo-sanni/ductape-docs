---
sidebar_position: 8
---

# Table Management

Complete guide to creating, modifying, and managing database tables using the Ductape SDK. Supports PostgreSQL, MySQL, MariaDB, MongoDB, DynamoDB, and Cassandra.

## Quick Example

```ts
import Ductape from '@ductape/sdk';

// Initialize Ductape
const ductape = new Ductape({
  user_id: 'your-user-id',
  workspace_id: 'your-workspace-id',
  private_key: 'your-private-key',
});

// Connect to database
await ductape.databases.connect({ env: 'dev', product: 'my-app', database: 'main-db' });

// Create a table with Mongoose-style schema
await ductape.databases.schema.create('users', {
  id: { type: 'uuid', primaryKey: true },
  email: { type: 'string', maxLength: 255, required: true, unique: true },
  name: { type: 'string', maxLength: 100 },
  age: 'integer',  // Shorthand syntax
  status: { type: 'enum', enum: ['active', 'inactive'], default: 'active' },
  metadata: 'json',
}, { timestamps: true });

// List all tables
const tables = await ductape.databases.schema.list();

// Check if table exists
const exists = await ductape.databases.schema.exists('users');
```

## Connection Context

Establish a connection context once, then all schema operations use it automatically:

```ts
import Ductape from '@ductape/sdk';

const ductape = new Ductape({
  user_id: 'your-user-id',
  workspace_id: 'your-workspace-id',
  private_key: 'your-private-key',
});

// Connect once
await ductape.databases.connect({
  env: 'prd',
  product: 'my-app',
  database: 'main-db',
});

// All operations now use this context
await ductape.databases.schema.create('products', { ... });
await ductape.databases.schema.list();
await ductape.databases.schema.exists('users');
```

## Creating Tables

### Basic Table Creation

```ts
await ductape.databases.schema.create('users', {
  id: { type: 'uuid', primaryKey: true },
  email: { type: 'string', maxLength: 255, required: true, unique: true },
  name: { type: 'string', maxLength: 100 },
  age: 'integer',
}, { timestamps: true });
```

### Table with All Field Types

```ts
await ductape.databases.schema.create('products', {
  // Primary key
  id: { type: 'uuid', primaryKey: true },

  // Strings
  sku: { type: 'string', maxLength: 50, required: true },
  name: { type: 'string', maxLength: 255, required: true },
  description: 'text',

  // Numbers
  stock: 'integer',
  views: 'bigint',
  price: { type: 'decimal', precision: 10, scale: 2 },
  rating: 'float',

  // Boolean
  is_active: { type: 'boolean', default: true },

  // Dates
  launch_date: 'date',
  scheduled_at: 'datetime',

  // JSON
  settings: 'json',
  metadata: 'json',

  // Enum
  status: { type: 'enum', enum: ['draft', 'published', 'archived'], default: 'draft' },
}, { timestamps: true });
```

### Table with Indexes

```ts
await ductape.databases.schema.create('users', {
  id: { type: 'uuid', primaryKey: true },
  email: { type: 'string', maxLength: 255, required: true },
  username: { type: 'string', maxLength: 100, required: true },
  status: { type: 'string', maxLength: 20 },
}, {
  timestamps: true,
  indexes: [
    { fields: ['email'], unique: true },
    { fields: ['username'], unique: true },
    { fields: ['status', 'created_at'] },
  ],
});
```

### Advanced Field Definition

```ts
await ductape.databases.schema.create('orders', {
  id: { type: 'uuid', primaryKey: true },
  customer_id: { type: 'uuid', required: true },
  status: {
    type: 'enum',
    enum: ['pending', 'processing', 'completed', 'cancelled'],
    default: 'pending',
    required: true,
  },
  total: {
    type: 'decimal',
    precision: 10,
    scale: 2,
    required: true,
  },
  notes: 'text',
}, { timestamps: true });
```

## Field Types Reference

### Available Types

| Type | Description | Example |
|------|-------------|---------|
| `integer` | Whole numbers | `42` |
| `bigint` | Large integers | `9007199254740991` |
| `smallint` | Small integers | `-32768` to `32767` |
| `float` | Floating point | `3.14` |
| `double` | Double precision | `3.141592653589793` |
| `decimal` | Fixed precision | `99.99` |
| `string` | Variable text | `"hello"` |
| `text` | Long text | Long content |
| `boolean` | True/false | `true`, `false` |
| `date` | Date only | `2024-01-15` |
| `time` | Time only | `14:30:00` |
| `datetime` | Date and time | `2024-01-15 14:30:00` |
| `timestamp` | Timestamp | Auto-managed |
| `json` | JSON data | `{"key": "value"}` |
| `uuid` | UUID | `a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11` |
| `enum` | Enumeration | `'pending'` |
| `array` | Array type | `[1, 2, 3]` |
| `binary` | Binary data | Binary content |
| `blob` | Binary large object | Large binary |

### Mongoose-Style Aliases

For convenience, you can use Mongoose-style type names:

| Mongoose Type | Maps To |
|---------------|---------|
| `String` | `string` |
| `Number` | `integer` |
| `Boolean` | `boolean` |
| `Date` | `datetime` |
| `ObjectId` | `uuid` |
| `Array` | `array` |
| `Object` | `json` |
| `Mixed` | `json` |

```ts
// Both are equivalent
await ductape.databases.schema.create('users', {
  name: 'String',  // Mongoose-style
  age: 'integer',  // Native style
});
```

### Field Options

```ts
{
  type: 'string',           // Field type (required)
  required: true,           // NOT NULL constraint
  unique: true,             // Unique constraint
  primaryKey: true,         // Primary key
  autoIncrement: true,      // Auto-increment (integers)
  default: 'value',         // Default value
  minLength: 1,             // Min length for validation (strings)
  maxLength: 255,           // Max length / column size (strings)
  precision: 10,            // Precision (decimals)
  scale: 2,                 // Scale (decimals)
  enum: ['a', 'b'],         // Enum values
  comment: 'Description',   // Column comment
}
```

## Listing Tables

### List All Tables

```ts
const tables = await ductape.databases.schema.list();
console.log('Tables:', tables);
// Output: ["users", "products", "orders", ...]
```

### List Tables in Schema (PostgreSQL)

```ts
const tables = await ductape.databases.schema.list('public');
```

## Checking Table Existence

```ts
const exists = await ductape.databases.schema.exists('users');

if (exists) {
  console.log('Table exists');
} else {
  console.log('Table does not exist');
}
```

## Getting Table Schema

### Retrieve Table Schema

```ts
const schema = await ductape.databases.schema.describe('users');

console.log('Table name:', schema.name);
console.log('Columns:', schema.columns);
console.log('Indexes:', schema.indexes);
console.log('Constraints:', schema.constraints);
```

### Inspect Table Structure

```ts
const schema = await ductape.databases.schema.describe('orders');

// List all columns
schema.columns.forEach((col) => {
  console.log(`${col.name}: ${col.type}${col.nullable ? '' : ' NOT NULL'}`);
});

// Find primary key
const pk = schema.columns.find(col => col.isPrimaryKey);
console.log('Primary key:', pk?.name);

// List indexes
schema.indexes?.forEach((idx) => {
  console.log(`${idx.name}: ${idx.columns.join(', ')} (unique: ${idx.unique})`);
});
```

## Modifying Tables

### Add Field

```ts
// Full definition
await ductape.databases.schema.addField('users', 'phone', {
  type: 'string',
  maxLength: 20,
  required: false,
});

// Shorthand
await ductape.databases.schema.addField('users', 'avatar_url', 'string');
```

### Drop Field

```ts
await ductape.databases.schema.dropField('users', 'phone');
```

### Rename Field

```ts
await ductape.databases.schema.renameField('users', 'name', 'full_name');
```

### Modify Field

```ts
// Change type/constraints
await ductape.databases.schema.modifyField('users', 'email', {
  maxLength: 500,
  required: true,
});

// Change default value
await ductape.databases.schema.modifyField('users', 'status', {
  default: 'inactive',
});
```

## Index Management

### Create Index

```ts
// Simple index
await ductape.databases.schema.createIndex('users', ['email']);

// Composite unique index
await ductape.databases.schema.createIndex('users', ['email', 'status'], {
  unique: true,
  name: 'idx_users_email_status',
});

// Sparse index (MongoDB)
await ductape.databases.schema.createIndex('users', ['phone'], {
  sparse: true,
});

// Partial index (SQL)
await ductape.databases.schema.createIndex('users', ['status'], {
  where: "status = 'active'",
});

// TTL index (MongoDB)
await ductape.databases.schema.createIndex('sessions', ['expires_at'], {
  expireAfterSeconds: 3600,
});
```

### List Indexes

```ts
const indexes = await ductape.databases.schema.indexes('users');

indexes.forEach(idx => {
  console.log(`${idx.name}: ${idx.columns.join(', ')} (unique: ${idx.unique})`);
});
```

### Drop Index

```ts
await ductape.databases.schema.dropIndex('users', 'idx_users_email_status');
```

## Constraint Management (SQL)

### Add Constraint

```ts
// Foreign key
await ductape.databases.schema.addConstraint('posts', {
  name: 'fk_posts_author',
  type: 'foreignKey',
  columns: ['author_id'],
  references: {
    table: 'users',
    columns: ['id'],
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
});

// Unique constraint
await ductape.databases.schema.addConstraint('users', {
  name: 'uq_users_email_org',
  type: 'unique',
  columns: ['email', 'org_id'],
});

// Check constraint
await ductape.databases.schema.addConstraint('users', {
  name: 'chk_users_age',
  type: 'check',
  columns: ['age'],
  expression: 'age >= 0 AND age <= 150',
});
```

### Drop Constraint

```ts
await ductape.databases.schema.dropConstraint('posts', 'fk_posts_author');
```

## Renaming Tables

```ts
await ductape.databases.schema.rename('users', 'app_users');
```

## Dropping Tables

```ts
// Simple drop
await ductape.databases.schema.drop('old_table');

// With options
await ductape.databases.schema.drop('users', {
  ifExists: true,
  cascade: true,  // Drop dependent objects
});
```

## Database-Specific Features

### PostgreSQL

```ts
await ductape.databases.schema.create('documents', {
  id: { type: 'uuid', primaryKey: true },
  data: 'json',
  tags: 'array',
}, {
  sqlOptions: {
    unlogged: true,  // Faster, no crash recovery
    tablespace: 'fast_storage',
  },
});
```

### MongoDB

```ts
await ductape.databases.schema.create('users', {
  _id: { type: 'uuid', primaryKey: true },
  email: { type: 'string', required: true },
  profile: 'json',
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
  },
});
```

### DynamoDB

```ts
await ductape.databases.schema.create('users', {
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
  },
});
```

### Cassandra

```ts
await ductape.databases.schema.create('events', {
  id: { type: 'uuid', primaryKey: true },
  user_id: 'uuid',
  event_type: 'string',
  data: 'json',
}, {
  cassandraOptions: {
    partitionKey: ['user_id'],
    clusteringColumns: ['id'],
    clusteringOrder: [{ column: 'id', order: 'DESC' }],
    defaultTTL: 86400,
  },
});
```

## Common Patterns

### Soft Delete Tables

```ts
await ductape.databases.schema.create('users', {
  id: { type: 'uuid', primaryKey: true },
  email: { type: 'string', maxLength: 255, required: true },
  deleted_at: 'timestamp',
}, { timestamps: true });

// Query excluding deleted records
await ductape.databases.query({
  table: 'users',
  where: { deleted_at: null },
});
```

### Audit Tables

```ts
await ductape.databases.schema.create('audit_logs', {
  id: { type: 'uuid', primaryKey: true },
  user_id: 'uuid',
  action: { type: 'string', maxLength: 100, required: true },
  entity_type: { type: 'string', maxLength: 100 },
  entity_id: 'integer',
  changes: 'json',
  ip_address: { type: 'string', maxLength: 45 },
}, {
  timestamps: true,
  indexes: [
    { fields: ['user_id', 'action'] },
    { fields: ['entity_type', 'entity_id'] },
  ],
});
```

### Polymorphic Associations

```ts
await ductape.databases.schema.create('comments', {
  id: { type: 'uuid', primaryKey: true },
  user_id: 'uuid',
  content: 'text',
  commentable_type: { type: 'string', maxLength: 100 },
  commentable_id: 'integer',
}, {
  timestamps: true,
  indexes: [
    { fields: ['commentable_type', 'commentable_id'] },
  ],
});
```

## Migrations

Every schema operation automatically generates a migration that's tracked and can be replayed across environments. The simplified API handles this transparently:

```ts
// This creates AND applies a migration
await ductape.databases.schema.create('users', {
  id: { type: 'uuid', primaryKey: true },
  email: { type: 'string', required: true },
});

// The migration is stored and can be viewed
// See the Migrations documentation for details
```

For more control over migrations, see the [Migrations](./migrations) documentation.

## Best Practices

### 1. Always Include Timestamps

```ts
await ductape.databases.schema.create('products', {
  id: { type: 'uuid', primaryKey: true },
  name: { type: 'string', required: true },
}, { timestamps: true }); // Adds created_at, updated_at
```

### 2. Define Indexes at Creation

```ts
await ductape.databases.schema.create('users', {
  id: { type: 'uuid', primaryKey: true },
  email: { type: 'string', required: true },
}, {
  indexes: [
    { fields: ['email'], unique: true },
  ],
});
```

### 3. Use Appropriate Field Types

```ts
// Good: VARCHAR with appropriate maxLength
email: { type: 'string', maxLength: 255 }

// Bad: TEXT for short strings
email: 'text'  // Wastes space
```

### 4. Name Tables and Columns Consistently

```ts
// Good naming conventions:
// - Tables: plural, snake_case
// - Columns: snake_case
// - Indexes: idx_{table}_{columns}
// - Foreign keys: {related_table_singular}_id

await ductape.databases.schema.create('order_items', {
  id: { type: 'uuid', primaryKey: true },
  order_id: 'uuid',
  product_id: 'uuid',
  quantity: 'integer',
  unit_price: { type: 'decimal', precision: 10, scale: 2 },
});
```

## Error Handling

```ts
import { DatabaseError, DatabaseErrorType } from '@ductape/sdk';

try {
  await ductape.databases.schema.create('users', { ... });
} catch (error) {
  if (error instanceof DatabaseError) {
    switch (error.type) {
      case DatabaseErrorType.SCHEMA_ERROR:
        console.error('Invalid schema definition');
        break;
      case DatabaseErrorType.TABLE_EXISTS:
        console.error('Table already exists');
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

## Next Steps

- [Migrations](./migrations) - Version-controlled schema changes
- [Indexing](./indexing) - Optimize query performance
- [Direct Queries](./direct-queries) - Full database API reference
- [Best Practices](./best-practices) - Production patterns

## See Also

* [Getting Started](./getting-started)
* [Querying Data](./querying)
* [Writing Data](./writing-data)
