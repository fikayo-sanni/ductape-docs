---
sidebar_position: 7
---

# Direct Queries

Direct queries provide full access to all database operations through the SDK. Use this guide to understand the complete API available for database operations.

## Connection Context

Establish a connection once and all subsequent operations inherit the context:

```ts
// Connect once
await ductape.database.connect({
  env: 'prd',
  product: 'my-app',
  database: 'main-db',
});

// All queries inherit context - no need to specify env/product/database
await ductape.database.query({ table: 'users' });
await ductape.database.insert({ table: 'users', data: {...} });
await ductape.database.aggregate({ table: 'orders', operations: {...} });
```

Or specify connection parameters explicitly on each call:

```ts
await ductape.database.query({
  env: 'prd',
  product: 'my-app',
  database: 'main-db',
  table: 'users',
});
```

## Available Methods

The database service provides these methods:

| Method | Description | See Guide |
|--------|-------------|-----------|
| `query()` | Read data with filters, sorting, pagination | [Querying](./querying) |
| `insert()` | Insert single or multiple records | [Writing Data](./writing-data) |
| `update()` | Update matching records | [Writing Data](./writing-data) |
| `delete()` | Delete matching records | [Writing Data](./writing-data) |
| `upsert()` | Insert or update on conflict | [Writing Data](./writing-data) |
| `raw()` | Execute raw SQL/queries | [Querying](./querying#raw-queries) |
| `count()` | Count records | [Aggregations](./aggregations) |
| `sum()` | Sum column values | [Aggregations](./aggregations) |
| `avg()` | Average column values | [Aggregations](./aggregations) |
| `min()` / `max()` | Min/max values | [Aggregations](./aggregations) |
| `groupBy()` | Group and aggregate | [Aggregations](./aggregations) |
| `aggregate()` | Multiple aggregations | [Aggregations](./aggregations) |
| `transaction()` | Transaction wrapper | [Transactions](./transactions) |
| `beginTransaction()` | Manual transaction | [Transactions](./transactions) |
| `createTable()` | Create new table | Below |
| `alterTable()` | Modify table structure | Below |
| `dropTable()` | Delete table | Below |
| `createIndex()` | Create index | [Migrations](./migrations#index-management) |
| `dropIndex()` | Delete index | [Migrations](./migrations#index-management) |
| `listIndexes()` | List table indexes | [Migrations](./migrations#index-management) |
| `runMigration()` | Run migration | [Migrations](./migrations) |

## Schema Management

### Create Table

```ts
import { SchemaHelpers } from '@ductape/sdk';

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
```

### Schema Helpers

Pre-configured column definitions:

```ts
import { SchemaHelpers } from '@ductape/sdk';

SchemaHelpers.id()                           // Auto-increment primary key
SchemaHelpers.uuid()                         // UUID primary key
SchemaHelpers.string('name', 255, false)     // String (length, nullable)
SchemaHelpers.text('bio')                    // Text field
SchemaHelpers.integer('age')                 // Integer
SchemaHelpers.bigint('views')                // Big integer
SchemaHelpers.decimal('price', 10, 2)        // Decimal (precision, scale)
SchemaHelpers.boolean('active', true)        // Boolean with default
SchemaHelpers.date('birth_date')             // Date
SchemaHelpers.datetime('scheduled_at')       // Datetime
SchemaHelpers.timestamp('logged_at')         // Timestamp
SchemaHelpers.json('settings')               // JSON
SchemaHelpers.jsonb('metadata')              // JSONB (PostgreSQL)
SchemaHelpers.foreignKey('user_id', 'users') // Foreign key
SchemaHelpers.timestamps()                   // created_at, updated_at
SchemaHelpers.softDelete()                   // deleted_at
```

### Alter Table

```ts
import { ColumnAlterationType, ColumnType } from '@ductape/sdk';

// Add column
await ductape.database.alterTable(
  { env: 'dev', product: 'my-app', database: 'main-db' },
  'products',
  [
    {
      type: ColumnAlterationType.ADD,
      column: { name: 'sku', type: ColumnType.STRING, length: 50 },
    },
  ]
);

// Drop column
await ductape.database.alterTable(
  { env: 'dev', product: 'my-app', database: 'main-db' },
  'products',
  [
    { type: ColumnAlterationType.DROP, columnName: 'old_field' },
  ]
);

// Rename column
await ductape.database.alterTable(
  { env: 'dev', product: 'my-app', database: 'main-db' },
  'products',
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

### Get Schema Information

```ts
// List all tables
const tables = await ductape.database.listTables({
  env: 'dev',
  product: 'my-app',
  database: 'main-db',
});

// Get table schema
const schema = await ductape.database.getTableSchema(
  { env: 'dev', product: 'my-app', database: 'main-db' },
  'users'
);

console.log('Table:', schema.name);
console.log('Columns:', schema.columns);
console.log('Indexes:', schema.indexes);

// Check if table exists
const exists = await ductape.database.tableExists(
  { env: 'dev', product: 'my-app', database: 'main-db' },
  'users'
);
```

## Building Dynamic Queries

### Conditional Filters

```ts
function searchProducts(filters: {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}) {
  const where: any = {};

  if (filters.category) {
    where.category = filters.category;
  }

  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    where.price = {};
    if (filters.minPrice !== undefined) where.price.$GTE = filters.minPrice;
    if (filters.maxPrice !== undefined) where.price.$LTE = filters.maxPrice;
  }

  if (filters.inStock) {
    where.stock = { $GT: 0 };
  }

  return ductape.database.query({
    table: 'products',
    where: Object.keys(where).length > 0 ? where : undefined,
  });
}
```

### Paginated Results Helper

```ts
async function getPaginatedResults<T>(
  table: string,
  page: number,
  pageSize: number,
  where?: object
): Promise<{
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}> {
  const result = await ductape.database.query({
    table,
    where,
    limit: pageSize,
    offset: (page - 1) * pageSize,
  });

  return {
    data: result.data as T[],
    total: result.count,
    page,
    totalPages: Math.ceil(result.count / pageSize),
  };
}
```

## Error Handling

```ts
import { DatabaseError, DatabaseErrorType } from '@ductape/sdk';

try {
  await ductape.database.insert({
    table: 'users',
    data: { email: 'test@example.com' },
  });
} catch (error) {
  if (error instanceof DatabaseError) {
    switch (error.type) {
      case DatabaseErrorType.CONNECTION_ERROR:
        console.error('Cannot connect to database');
        break;
      case DatabaseErrorType.QUERY_ERROR:
        console.error('Query failed:', error.message);
        break;
      case DatabaseErrorType.UNIQUE_VIOLATION:
        console.error('Duplicate key');
        break;
      case DatabaseErrorType.FOREIGN_KEY_VIOLATION:
        console.error('Invalid reference');
        break;
      default:
        throw error;
    }
  }
}
```

## Next Steps

- [Querying Data](./querying) - Read operations in detail
- [Writing Data](./writing-data) - Insert, update, delete operations
- [Aggregations](./aggregations) - COUNT, SUM, GROUP BY operations
- [Transactions](./transactions) - Atomic operations
- [Migrations](./migrations) - Schema versioning

## See Also

* [Best Practices](./best-practices)
