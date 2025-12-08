---
sidebar_position: 9
---

# Indexes & Performance

Learn how to create and manage database indexes to dramatically improve query performance and optimize your database operations.

## Quick Example

```ts
import { DatabaseService } from '@ductape/sdk';

const db = new DatabaseService();
await db.connect({ env: 'dev', product: 'my-app', database: 'main-db' });

// Create an index
await db.schema.createIndex('users', ['email'], {
  unique: true,
  name: 'idx_users_email',
});

// List all indexes
const indexes = await db.schema.indexes('users');
console.log(`Table has ${indexes.length} indexes`);
```

## Why Indexes Matter

Indexes are critical for database performance:

**Without Index:**
```ts
// Full table scan - reads every row (slow)
const user = await db.findOne({
  table: 'users',
  where: { email: 'alice@example.com' },
});
// 1M rows = 1000ms+
```

**With Index:**
```ts
// Index lookup - direct access (fast)
const user = await db.findOne({
  table: 'users',
  where: { email: 'alice@example.com' },
});
// 1M rows = 1-5ms
```

Indexes can provide **100-1000x performance improvement** for queries.

## Creating Indexes

### Basic Index

```ts
await db.schema.createIndex('users', ['email']);
```

### Unique Index

Enforce uniqueness while improving query performance:

```ts
await db.schema.createIndex('users', ['email'], {
  unique: true,
});

// Now duplicate emails will be rejected
try {
  await db.insert({
    table: 'users',
    records: [{ email: 'alice@example.com', name: 'Alice' }],
  });

  // This will fail - email already exists
  await db.insert({
    table: 'users',
    records: [{ email: 'alice@example.com', name: 'Bob' }],
  });
} catch (error) {
  console.log('Unique constraint violation');
}
```

### Composite Index

Index multiple columns together:

```ts
await db.schema.createIndex('orders', ['user_id', 'created_at'], {
  name: 'idx_orders_user_date',
});

// Efficient for queries like:
const orders = await db.find({
  table: 'orders',
  where: { user_id: 123 },
  orderBy: [{ column: 'created_at', order: 'DESC' }],
});
```

### Sparse Index (MongoDB)

Only index documents where the field exists:

```ts
await db.schema.createIndex('users', ['phone'], {
  sparse: true,
});
```

### Partial Index (SQL)

Index only rows matching a condition:

```ts
await db.schema.createIndex('users', ['email'], {
  where: "status = 'active'",
  name: 'idx_users_email_active',
});

// Smaller, faster index for frequently queried subset
```

### TTL Index (MongoDB)

Automatically expire documents:

```ts
await db.schema.createIndex('sessions', ['expires_at'], {
  expireAfterSeconds: 3600,
});
```

## Index at Table Creation

Define indexes when creating tables:

```ts
await db.schema.create('orders', {
  id: { type: 'uuid', primaryKey: true },
  customer_id: 'uuid',
  status: { type: 'string', length: 50 },
  total: { type: 'decimal', precision: 10, scale: 2 },
}, {
  timestamps: true,
  indexes: [
    { fields: ['customer_id'] },
    { fields: ['status'] },
    { fields: ['status', 'created_at'] },
  ],
});
```

## Managing Indexes

### List Indexes

```ts
const indexes = await db.schema.indexes('users');

indexes.forEach(idx => {
  console.log(`Index: ${idx.name}`);
  console.log(`  Columns: ${idx.columns.join(', ')}`);
  console.log(`  Unique: ${idx.unique}`);
  console.log(`  Primary: ${idx.primaryKey}`);
});
```

### Drop Index

```ts
await db.schema.dropIndex('users', 'idx_users_old');
```

## Index Best Practices

### 1. Index Foreign Keys

Always index foreign key columns:

```ts
await db.schema.create('orders', {
  id: { type: 'uuid', primaryKey: true },
  user_id: 'uuid',
}, {
  indexes: [
    { fields: ['user_id'] },
  ],
});

// Now joins are fast
const ordersWithUsers = await db.query({
  query: `
    SELECT o.*, u.name, u.email
    FROM orders o
    JOIN users u ON o.user_id = u.id
    WHERE o.status = $1
  `,
  params: ['pending'],
});
```

### 2. Index WHERE Clause Columns

Index columns frequently used in WHERE conditions:

```ts
// If you often query by status
await db.schema.createIndex('orders', ['status']);

// If you often query by status AND date
await db.schema.createIndex('orders', ['status', 'created_at']);
```

### 3. Index ORDER BY Columns

Index columns used for sorting:

```ts
await db.schema.createIndex('posts', ['created_at'], {
  name: 'idx_posts_date_desc',
});

// Fast ordered queries
const recentPosts = await db.find({
  table: 'posts',
  orderBy: [{ column: 'created_at', order: 'DESC' }],
  limit: 10,
});
```

### 4. Composite Index Column Order

**Most selective column first:**

```ts
// email is highly selective (unique)
// city is less selective (many users per city)
await db.schema.createIndex('users', ['email', 'city'], {
  name: 'idx_users_email_city',
});

// This index efficiently supports:
// - WHERE email = 'x@y.com'
// - WHERE email = 'x@y.com' AND city = 'NYC'
// But NOT efficiently for:
// - WHERE city = 'NYC' alone
```

**Match query patterns:**

```ts
// If you query: WHERE user_id = ? ORDER BY created_at DESC
await db.schema.createIndex('posts', ['user_id', 'created_at']);
```

### 5. Don't Over-Index

**Problems with too many indexes:**
- Slower INSERT/UPDATE/DELETE operations
- More disk space
- Higher memory usage
- Longer backup/restore times

```ts
// Bad - indexing everything
await db.schema.createIndex(...); // on name
await db.schema.createIndex(...); // on email
await db.schema.createIndex(...); // on phone
await db.schema.createIndex(...); // on address
await db.schema.createIndex(...); // on city
await db.schema.createIndex(...); // on state
// Result: Fast reads, VERY slow writes

// Good - strategic indexing
await db.schema.createIndex('users', ['email']); // for login
await db.schema.createIndex('users', ['city', 'state']); // for search
// Result: Fast reads, reasonable write speed
```

**Rule of thumb:**
- 3-5 indexes per table is typical
- Only index columns you actually query
- Remove unused indexes

## Common Index Patterns

### User Authentication

```ts
await db.schema.create('users', {
  id: { type: 'uuid', primaryKey: true },
  email: { type: 'string', length: 255, required: true },
  username: { type: 'string', length: 100, required: true },
  status: { type: 'string', length: 20 },
  last_login: 'timestamp',
}, {
  timestamps: true,
  indexes: [
    { fields: ['email'], unique: true },
    { fields: ['username'], unique: true },
  ],
});

// Partial index for active users only (SQL)
await db.schema.createIndex('users', ['last_login'], {
  where: "status = 'active'",
  name: 'idx_users_active_login',
});
```

### E-Commerce Orders

```ts
await db.schema.create('orders', {
  id: { type: 'uuid', primaryKey: true },
  user_id: 'uuid',
  status: { type: 'string', length: 50 },
  total: { type: 'decimal', precision: 10, scale: 2 },
  items_count: 'integer',
}, {
  timestamps: true,
  indexes: [
    // User's orders, most recent first
    { fields: ['user_id', 'created_at'] },
    // Filter by status
    { fields: ['status', 'created_at'] },
  ],
});
```

### Social Media Posts

```ts
await db.schema.create('posts', {
  id: { type: 'uuid', primaryKey: true },
  user_id: 'uuid',
  content: 'text',
  tags: 'array',
}, {
  timestamps: true,
  indexes: [
    // User's timeline
    { fields: ['user_id', 'created_at'] },
  ],
});

// Full-text search on content (database-specific)
// For PostgreSQL:
await db.query({
  query: `CREATE INDEX idx_posts_content ON posts USING gin(to_tsvector('english', content))`,
});
```

### Audit Logs

```ts
await db.schema.create('audit_logs', {
  id: { type: 'uuid', primaryKey: true },
  entity_type: { type: 'string', length: 100 },
  entity_id: 'integer',
  action: { type: 'string', length: 50 },
}, {
  timestamps: true,
  indexes: [
    // Query by entity
    { fields: ['entity_type', 'entity_id', 'created_at'] },
    // Query by action type
    { fields: ['action', 'created_at'] },
  ],
});
```

## Database-Specific Features

### PostgreSQL

```ts
// Partial indexes
await db.schema.createIndex('orders', ['status'], {
  where: "status = 'pending'",
});

// GIN index for JSONB (via raw query)
await db.query({
  query: `CREATE INDEX idx_users_metadata ON users USING gin(metadata)`,
});

// Concurrent index creation (via raw query)
await db.query({
  query: `CREATE INDEX CONCURRENTLY idx_users_email ON users(email)`,
});
```

### MySQL

```ts
// Full-text index (via raw query)
await db.query({
  query: `CREATE FULLTEXT INDEX idx_articles_content ON articles(title, content)`,
});

// Prefix indexes for long strings (via raw query)
await db.query({
  query: `CREATE INDEX idx_urls_path ON urls(path(255))`,
});
```

### MongoDB

```ts
// Sparse index
await db.schema.createIndex('users', ['phone'], {
  sparse: true,
});

// TTL index
await db.schema.createIndex('sessions', ['expires_at'], {
  expireAfterSeconds: 3600,
});
```

## Performance Monitoring

### Check Index Usage (PostgreSQL)

```ts
const stats = await db.query({
  query: `
    SELECT
      indexname,
      idx_scan as scans,
      idx_tup_read as tuples_read,
      pg_size_pretty(pg_relation_size(indexrelid)) as size
    FROM pg_stat_user_indexes
    WHERE schemaname = 'public'
    ORDER BY idx_scan ASC
  `,
});

// Find unused indexes (scans = 0)
const unused = stats.records.filter(s => s.scans === 0);
console.log('Unused indexes:', unused);
```

### Check Index Usage (MySQL)

```ts
const stats = await db.query({
  query: `
    SELECT
      table_name,
      index_name,
      count_star as rows_selected
    FROM performance_schema.table_io_waits_summary_by_index_usage
    WHERE object_schema = DATABASE()
    AND index_name IS NOT NULL
    ORDER BY count_star DESC
  `,
});
```

### Index Size Analysis

```ts
// PostgreSQL
const sizes = await db.query({
  query: `
    SELECT
      tablename,
      indexname,
      pg_size_pretty(pg_relation_size(indexrelid)) as size
    FROM pg_stat_user_indexes
    ORDER BY pg_relation_size(indexrelid) DESC
  `,
});
```

## Troubleshooting

### Index Not Being Used

**Problem:** Query is slow despite having an index.

**Solutions:**

1. **Check column data types match:**
```ts
// Won't use index if types don't match
// Table: user_id is INTEGER
// Query: WHERE user_id = '123' (STRING)

// Fix: Use correct type
const users = await db.find({
  table: 'users',
  where: { user_id: 123 }, // INTEGER, not string
});
```

2. **Avoid functions on indexed columns:**
```sql
-- Won't use index
WHERE LOWER(email) = 'alice@example.com'

-- Will use index
WHERE email = 'alice@example.com'
```

3. **Use EXPLAIN to analyze:**
```ts
const plan = await db.query({
  query: `EXPLAIN ANALYZE SELECT * FROM users WHERE email = $1`,
  params: ['alice@example.com'],
});
console.log(plan.records);
// Look for "Index Scan" vs "Seq Scan"
```

### Slow Index Creation

**Problem:** Creating index takes too long or locks table.

**Solutions:**

```ts
// PostgreSQL: Use concurrent index creation
await db.query({
  query: `CREATE INDEX CONCURRENTLY idx_large_table ON large_table(column)`,
});
```

## When to Create Indexes

| Column Type | Index Recommended |
|-------------|-------------------|
| Primary key | Automatic |
| Foreign key | Yes |
| Columns in WHERE clauses | Yes |
| Columns in ORDER BY | Consider |
| Columns in JOIN conditions | Yes |
| Low cardinality (few unique values) | Usually no |
| Frequently updated columns | Consider trade-offs |

## Next Steps

- [Query Optimization](./best-practices) - Optimize database queries
- [Transactions](./transactions) - Ensure data consistency
- [Migrations](./migrations) - Manage schema changes
- [Aggregations](./aggregations) - Complex data analysis

## See Also

* [Table Management](./table-management) - Create and manage tables
* [Querying Data](./querying) - Find and filter records
* [Best Practices](./best-practices) - Database optimization
