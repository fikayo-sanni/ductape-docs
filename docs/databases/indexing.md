---
sidebar_position: 9
---

# Indexes & Performance

Learn how to create and manage database indexes to dramatically improve query performance and optimize your database operations.

## Quick Example

```ts
// Create an index
await ductape.database.createIndex({
  table: 'users',
  index: {
    name: 'idx_users_email',
    table: 'users',
    columns: [{ name: 'email' }],
    type: IndexType.BTREE,
    unique: true,
  },
});

// List all indexes
const indexes = await ductape.database.listIndexes({
  table: 'users',
});

console.log(`Table has ${indexes.length} indexes`);
```

## Why Indexes Matter

Indexes are critical for database performance:

**Without Index:**
```ts
// Full table scan - reads every row (slow)
const user = await ductape.database.findOne({
  table: 'users',
  where: { email: 'alice@example.com' },
});
// 1M rows = 1000ms+
```

**With Index:**
```ts
// Index lookup - direct access (fast)
const user = await ductape.database.findOne({
  table: 'users',
  where: { email: 'alice@example.com' },
});
// 1M rows = 1-5ms
```

Indexes can provide **100-1000x performance improvement** for queries.

## Creating Indexes

### Basic Index

```ts
import { IndexType } from '@ductape/sdk';

await ductape.database.createIndex({
  table: 'users',
  index: {
    name: 'idx_users_email',
    table: 'users',
    columns: [{ name: 'email' }],
    type: IndexType.BTREE,
  },
});
```

### Unique Index

Enforce uniqueness while improving query performance:

```ts
await ductape.database.createIndex({
  table: 'users',
  index: {
    name: 'idx_users_email_unique',
    table: 'users',
    columns: [{ name: 'email' }],
    unique: true,
  },
});

// Now duplicate emails will be rejected
try {
  await ductape.database.insert({
    table: 'users',
    records: [{ email: 'alice@example.com', name: 'Alice' }],
  });

  // This will fail - email already exists
  await ductape.database.insert({
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
await ductape.database.createIndex({
  table: 'orders',
  index: {
    name: 'idx_orders_user_date',
    table: 'orders',
    columns: [
      { name: 'user_id' },
      { name: 'created_at', order: 'DESC' },
    ],
  },
});

// Now efficient to query by user_id and sort by date
const orders = await ductape.database.find({
  table: 'orders',
  where: { user_id: 123 },
  orderBy: [{ column: 'created_at', order: SortOrder.DESC }],
});
```

## Index Types

### BTREE (Default)

Best for most queries - supports equality, range, sorting:

```ts
await ductape.database.createIndex({
  table: 'products',
  index: {
    name: 'idx_products_price',
    table: 'products',
    columns: [{ name: 'price' }],
    type: IndexType.BTREE,
  },
});

// Efficiently supports:
// - Equality: WHERE price = 99.99
// - Range: WHERE price BETWEEN 50 AND 100
// - Sorting: ORDER BY price
// - Prefix: WHERE name LIKE 'Apple%'
```

**Use Cases:**
- Primary keys and foreign keys
- Numeric columns (price, quantity, age)
- Date/timestamp columns
- String columns with equality or prefix matching

### HASH

Optimized for exact equality matches only:

```ts
await ductape.database.createIndex({
  table: 'sessions',
  index: {
    name: 'idx_sessions_token',
    table: 'sessions',
    columns: [{ name: 'token' }],
    type: IndexType.HASH,
  },
});

// Efficient for: WHERE token = 'abc123'
// NOT for: WHERE token LIKE '%abc%', ORDER BY token
```

**Use Cases:**
- Session tokens
- API keys
- Hash lookups
- Exact match queries

### GIN (Generalized Inverted Index)

PostgreSQL-specific, best for array and JSONB columns:

```ts
await ductape.database.createIndex({
  table: 'products',
  index: {
    name: 'idx_products_tags',
    table: 'products',
    columns: [{ name: 'tags' }],
    type: IndexType.GIN,
  },
});

// Efficient for array operations
const products = await ductape.database.find({
  table: 'products',
  where: {
    tags: { $CONTAINS: 'electronics' },
  },
});

// Also great for JSONB columns
await ductape.database.createIndex({
  table: 'users',
  index: {
    name: 'idx_users_metadata',
    table: 'users',
    columns: [{ name: 'metadata' }],
    type: IndexType.GIN,
  },
});
```

**Use Cases:**
- Array columns
- JSONB/JSON columns
- Full-text search
- Tag systems

### GIST (Generalized Search Tree)

PostgreSQL-specific, for geometric and full-text data:

```ts
await ductape.database.createIndex({
  table: 'stores',
  index: {
    name: 'idx_stores_location',
    table: 'stores',
    columns: [{ name: 'location' }],
    type: IndexType.GIST,
  },
});

// Efficient for geospatial queries
const nearbyStores = await ductape.database.query({
  query: `
    SELECT * FROM stores
    WHERE ST_DWithin(location, ST_MakePoint($1, $2)::geography, $3)
    ORDER BY location <-> ST_MakePoint($1, $2)::geography
  `,
  params: [-122.4194, 37.7749, 5000], // lon, lat, distance in meters
});
```

**Use Cases:**
- Geospatial data (PostGIS)
- Range types
- Full-text search vectors
- Network addresses

### FULLTEXT

Full-text search indexes:

```ts
await ductape.database.createIndex({
  table: 'articles',
  index: {
    name: 'idx_articles_content',
    table: 'articles',
    columns: [
      { name: 'title' },
      { name: 'content' },
    ],
    type: IndexType.FULLTEXT,
  },
});

// MySQL full-text search
const articles = await ductape.database.query({
  query: `
    SELECT *, MATCH(title, content) AGAINST(? IN NATURAL LANGUAGE MODE) as relevance
    FROM articles
    WHERE MATCH(title, content) AGAINST(? IN NATURAL LANGUAGE MODE)
    ORDER BY relevance DESC
  `,
  params: ['graph databases', 'graph databases'],
});
```

**Use Cases:**
- Article content
- Product descriptions
- Search functionality
- Text-heavy columns

### SPATIAL

For geospatial data (MySQL):

```ts
await ductape.database.createIndex({
  table: 'locations',
  index: {
    name: 'idx_locations_coordinates',
    table: 'locations',
    columns: [{ name: 'coordinates' }],
    type: IndexType.SPATIAL,
  },
});
```

**Use Cases:**
- GPS coordinates
- Geographic data
- Mapping applications
- Location-based queries

## Advanced Index Features

### Partial Indexes

Index only rows that match a condition (PostgreSQL):

```ts
await ductape.database.createIndex({
  table: 'orders',
  index: {
    name: 'idx_orders_pending',
    table: 'orders',
    columns: [{ name: 'created_at' }],
    where: "status = 'pending'",
  },
});

// Smaller, faster index for frequently queried subset
const pendingOrders = await ductape.database.find({
  table: 'orders',
  where: { status: 'pending' },
  orderBy: [{ column: 'created_at', order: SortOrder.DESC }],
});
```

**Benefits:**
- Smaller index size
- Faster index updates
- Better cache utilization
- Ideal for filtered queries

### Expression Indexes

Index on computed expressions (PostgreSQL):

```ts
await ductape.database.createIndex({
  table: 'users',
  index: {
    name: 'idx_users_email_lower',
    table: 'users',
    columns: [
      { name: 'email', expression: 'LOWER(email)' },
    ],
  },
});

// Now case-insensitive searches are fast
const user = await ductape.database.query({
  query: 'SELECT * FROM users WHERE LOWER(email) = LOWER($1)',
  params: ['Alice@Example.com'],
});
```

### Covering Indexes (Include Columns)

Include additional columns in the index (PostgreSQL):

```ts
await ductape.database.createIndex({
  table: 'products',
  index: {
    name: 'idx_products_category_covering',
    table: 'products',
    columns: [{ name: 'category' }],
    include: ['name', 'price', 'stock'],
  },
});

// Query can be satisfied entirely from the index (index-only scan)
const products = await ductape.database.find({
  table: 'products',
  select: ['name', 'price', 'stock'],
  where: { category: 'electronics' },
});
```

### Column Sort Order

Specify ascending or descending order:

```ts
await ductape.database.createIndex({
  table: 'posts',
  index: {
    name: 'idx_posts_date_desc',
    table: 'posts',
    columns: [
      { name: 'created_at', order: 'DESC' },
    ],
  },
});

// Optimized for descending sorts (newest first)
const recentPosts = await ductape.database.find({
  table: 'posts',
  orderBy: [{ column: 'created_at', order: SortOrder.DESC }],
  limit: 10,
});
```

### Prefix Indexes

Index only first N characters (MySQL):

```ts
await ductape.database.createIndex({
  table: 'urls',
  index: {
    name: 'idx_urls_path',
    table: 'urls',
    columns: [
      { name: 'path', length: 255 }, // Only index first 255 chars
    ],
  },
});
```

**Benefits:**
- Smaller index size
- Faster updates
- Good for long text columns

## Managing Indexes

### List Indexes

```ts
const indexes = await ductape.database.listIndexes({
  table: 'users',
});

indexes.forEach(index => {
  console.log(`Index: ${index.name}`);
  console.log(`  Type: ${index.type}`);
  console.log(`  Columns: ${index.columns.join(', ')}`);
  console.log(`  Unique: ${index.unique}`);
  console.log(`  Primary: ${index.primaryKey}`);
  if (index.size) {
    console.log(`  Size: ${(index.size / 1024 / 1024).toFixed(2)} MB`);
  }
});
```

### Drop Index

```ts
await ductape.database.dropIndex({
  table: 'users',
  indexName: 'idx_users_old_column',
});
```

### Concurrent Index Creation

Create indexes without locking the table (PostgreSQL):

```ts
await ductape.database.createIndex({
  table: 'large_table',
  index: {
    name: 'idx_large_table_column',
    table: 'large_table',
    columns: [{ name: 'column_name' }],
  },
  concurrent: true, // Don't block writes
});
```

**Important:**
- Takes longer than regular index creation
- Doesn't block table writes
- Essential for production databases
- PostgreSQL-specific

### Conditional Creation

```ts
await ductape.database.createIndex({
  table: 'users',
  index: {
    name: 'idx_users_email',
    table: 'users',
    columns: [{ name: 'email' }],
  },
  ifNotExists: true, // Don't error if exists
});
```

## Index Best Practices

### 1. Index Foreign Keys

Always index foreign key columns:

```ts
// Orders table with foreign key
await ductape.database.createIndex({
  table: 'orders',
  index: {
    name: 'idx_orders_user_id',
    table: 'orders',
    columns: [{ name: 'user_id' }],
  },
});

// Now joins are fast
const ordersWithUsers = await ductape.database.query({
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
await ductape.database.createIndex({
  table: 'orders',
  index: {
    name: 'idx_orders_status',
    table: 'orders',
    columns: [{ name: 'status' }],
  },
});

// If you often query by status AND date
await ductape.database.createIndex({
  table: 'orders',
  index: {
    name: 'idx_orders_status_date',
    table: 'orders',
    columns: [
      { name: 'status' },
      { name: 'created_at' },
    ],
  },
});
```

### 3. Index ORDER BY Columns

Index columns used for sorting:

```ts
await ductape.database.createIndex({
  table: 'posts',
  index: {
    name: 'idx_posts_date',
    table: 'posts',
    columns: [{ name: 'created_at', order: 'DESC' }],
  },
});

// Fast ordered queries
const recentPosts = await ductape.database.find({
  table: 'posts',
  orderBy: [{ column: 'created_at', order: SortOrder.DESC }],
  limit: 10,
});
```

### 4. Composite Index Column Order

**Most selective column first:**

```ts
// email is highly selective (unique)
// city is less selective (many users per city)
await ductape.database.createIndex({
  table: 'users',
  index: {
    name: 'idx_users_email_city',
    table: 'users',
    columns: [
      { name: 'email' },  // High selectivity first
      { name: 'city' },   // Lower selectivity second
    ],
  },
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
await ductape.database.createIndex({
  table: 'posts',
  index: {
    name: 'idx_posts_user_date',
    table: 'posts',
    columns: [
      { name: 'user_id' },
      { name: 'created_at', order: 'DESC' },
    ],
  },
});
```

### 5. Don't Over-Index

**Problems with too many indexes:**
- Slower INSERT/UPDATE/DELETE operations
- More disk space
- Higher memory usage
- Longer backup/restore times

```ts
// Bad - indexing everything
await ductape.database.createIndex({ /* index on name */ });
await ductape.database.createIndex({ /* index on email */ });
await ductape.database.createIndex({ /* index on phone */ });
await ductape.database.createIndex({ /* index on address */ });
await ductape.database.createIndex({ /* index on city */ });
await ductape.database.createIndex({ /* index on state */ });
// Result: Fast reads, VERY slow writes

// Good - strategic indexing
await ductape.database.createIndex({ /* index on email (for login) */ });
await ductape.database.createIndex({ /* index on city + state (for search) */ });
// Result: Fast reads, reasonable write speed
```

**Rule of thumb:**
- 3-5 indexes per table is typical
- Only index columns you actually query
- Remove unused indexes

### 6. Index Maintenance

**PostgreSQL:**

```ts
// Analyze table statistics (helps query planner)
await ductape.database.query({
  query: 'ANALYZE users',
});

// Rebuild bloated indexes
await ductape.database.query({
  query: 'REINDEX TABLE users',
});

// Or rebuild specific index
await ductape.database.query({
  query: 'REINDEX INDEX idx_users_email',
});
```

**MySQL:**

```ts
// Optimize table (rebuilds indexes)
await ductape.database.query({
  query: 'OPTIMIZE TABLE users',
});

// Analyze table
await ductape.database.query({
  query: 'ANALYZE TABLE users',
});
```

## Common Index Patterns

### User Authentication

```ts
// Unique index for email login
await ductape.database.createIndex({
  table: 'users',
  index: {
    name: 'idx_users_email',
    table: 'users',
    columns: [{ name: 'email' }],
    unique: true,
  },
});

// Index for username lookups
await ductape.database.createIndex({
  table: 'users',
  index: {
    name: 'idx_users_username',
    table: 'users',
    columns: [{ name: 'username' }],
    unique: true,
  },
});

// Partial index for active users only
await ductape.database.createIndex({
  table: 'users',
  index: {
    name: 'idx_users_active',
    table: 'users',
    columns: [{ name: 'last_login' }],
    where: "status = 'active'",
  },
});
```

### E-Commerce Orders

```ts
// Index for user's orders
await ductape.database.createIndex({
  table: 'orders',
  index: {
    name: 'idx_orders_user_date',
    table: 'orders',
    columns: [
      { name: 'user_id' },
      { name: 'created_at', order: 'DESC' },
    ],
  },
});

// Index for order status filtering
await ductape.database.createIndex({
  table: 'orders',
  index: {
    name: 'idx_orders_status_date',
    table: 'orders',
    columns: [
      { name: 'status' },
      { name: 'created_at', order: 'DESC' },
    ],
  },
});

// Covering index for order list view
await ductape.database.createIndex({
  table: 'orders',
  index: {
    name: 'idx_orders_list',
    table: 'orders',
    columns: [
      { name: 'user_id' },
      { name: 'created_at', order: 'DESC' },
    ],
    include: ['status', 'total', 'items_count'],
  },
});
```

### Social Media Posts

```ts
// Index for user's timeline
await ductape.database.createIndex({
  table: 'posts',
  index: {
    name: 'idx_posts_user_date',
    table: 'posts',
    columns: [
      { name: 'user_id' },
      { name: 'created_at', order: 'DESC' },
    ],
  },
});

// Full-text search on content
await ductape.database.createIndex({
  table: 'posts',
  index: {
    name: 'idx_posts_content',
    table: 'posts',
    columns: [{ name: 'content' }],
    type: IndexType.FULLTEXT,
  },
});

// Index for hashtag filtering
await ductape.database.createIndex({
  table: 'posts',
  index: {
    name: 'idx_posts_tags',
    table: 'posts',
    columns: [{ name: 'tags' }],
    type: IndexType.GIN, // PostgreSQL array
  },
});
```

### Audit Logs

```ts
// Composite index for log queries
await ductape.database.createIndex({
  table: 'audit_logs',
  index: {
    name: 'idx_audit_entity_action_date',
    table: 'audit_logs',
    columns: [
      { name: 'entity_type' },
      { name: 'action' },
      { name: 'created_at', order: 'DESC' },
    ],
  },
});

// Partial index for recent logs only
await ductape.database.createIndex({
  table: 'audit_logs',
  index: {
    name: 'idx_audit_recent',
    table: 'audit_logs',
    columns: [{ name: 'created_at', order: 'DESC' }],
    where: "created_at > NOW() - INTERVAL '30 days'",
  },
});
```

## Performance Monitoring

### Check Index Usage (PostgreSQL)

```ts
const indexStats = await ductape.database.query({
  query: `
    SELECT
      schemaname,
      tablename,
      indexname,
      idx_scan as index_scans,
      idx_tup_read as tuples_read,
      idx_tup_fetch as tuples_fetched,
      pg_size_pretty(pg_relation_size(indexrelid)) as index_size
    FROM pg_stat_user_indexes
    WHERE schemaname = 'public'
    ORDER BY idx_scan ASC, pg_relation_size(indexrelid) DESC
  `,
});

// Find unused indexes (idx_scan = 0)
const unusedIndexes = indexStats.records.filter(idx => idx.index_scans === 0);
console.log('Unused indexes:', unusedIndexes);
```

### Check Index Usage (MySQL)

```ts
const indexStats = await ductape.database.query({
  query: `
    SELECT
      object_schema AS db,
      object_name AS table_name,
      index_name,
      count_star AS rows_selected,
      count_read AS rows_read
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
const indexSizes = await ductape.database.query({
  query: `
    SELECT
      tablename,
      indexname,
      pg_size_pretty(pg_relation_size(indexrelid)) as size
    FROM pg_stat_user_indexes
    WHERE schemaname = 'public'
    ORDER BY pg_relation_size(indexrelid) DESC
  `,
});

// MySQL
const indexSizes = await ductape.database.query({
  query: `
    SELECT
      table_name,
      index_name,
      ROUND(stat_value * @@innodb_page_size / 1024 / 1024, 2) as size_mb
    FROM mysql.innodb_index_stats
    WHERE database_name = DATABASE()
    AND stat_name = 'size'
    ORDER BY stat_value DESC
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
const users = await ductape.database.find({
  table: 'users',
  where: { user_id: 123 }, // INTEGER
});
```

2. **Avoid functions on indexed columns:**
```ts
// Won't use index
WHERE LOWER(email) = 'alice@example.com'

// Will use index
WHERE email = 'alice@example.com'

// Or create expression index:
CREATE INDEX idx_email_lower ON users(LOWER(email))
```

3. **Use EXPLAIN to analyze:**
```ts
const plan = await ductape.database.query({
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
// Use concurrent index creation (PostgreSQL)
await ductape.database.createIndex({
  table: 'large_table',
  index: {
    name: 'idx_large_table',
    table: 'large_table',
    columns: [{ name: 'column' }],
  },
  concurrent: true,
});

// Or create during low-traffic periods
// Or consider online schema change tools (pt-online-schema-change, gh-ost)
```

## Next Steps

- [Query Optimization](./best-practices) - Optimize database queries
- [Transactions](./transactions) - Ensure data consistency
- [Migrations](./migrations) - Manage schema changes
- [Aggregations](./aggregations) - Complex data analysis

## See Also

* [Querying Data](./querying) - Find and filter records
* [Best Practices](./best-practices) - Database optimization
* [Schema Management](./migrations) - Database migrations
