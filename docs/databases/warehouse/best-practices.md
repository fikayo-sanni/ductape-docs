---
sidebar_position: 6
---

# Best Practices

Optimize your Warehouse queries for performance, reliability, and maintainability.

## Query Optimization

### 1. Select Only Needed Fields

Avoid using `*` in cross-database queries:

```ts
// ❌ Bad: Fetches all fields from all sources
fields: ['*']

// ✅ Good: Only fetch what you need
fields: ['u.id', 'u.name', 'o.total', 'o.status']
```

### 2. Filter Early

Apply filters on individual sources before joining:

```ts
// ✅ Good: Filter applied to joined source
join: [{
  type: 'left',
  source: { type: 'database', tag: 'orders-db', entity: 'orders', alias: 'o' },
  on: { left: 'u.id', right: 'o.userId' },
  where: { 'o.status': { $eq: 'completed' } }  // Filter before join
}]

// Also filter primary source
where: { 'u.status': { $eq: 'active' } }
```

### 3. Use Appropriate Limits

Always use pagination for large datasets:

```ts
const result = await ductape.warehouse.query({
  operation: 'select',
  from: { type: 'database', tag: 'users-db', entity: 'users', alias: 'u' },
  fields: ['u.id', 'u.name'],
  limit: 50,
  offset: page * 50
});
```

### 4. Leverage Aliases

Use clear, consistent aliases for readability:

```ts
// ✅ Good: Clear aliases
from: { type: 'database', tag: 'users-postgres', entity: 'users', alias: 'u' },
join: [
  { source: { tag: 'orders-mongo', entity: 'orders', alias: 'o' } },
  { source: { tag: 'products-postgres', entity: 'products', alias: 'p' } }
]
```

## Join Performance

### 1. Put Smaller Dataset on Right

When joining, the Warehouse fetches the right side for each left record:

```ts
// ✅ If users is smaller than orders, use users as right
from: { type: 'database', tag: 'orders-db', entity: 'orders', alias: 'o' },
join: [{
  type: 'inner',
  source: { type: 'database', tag: 'users-db', entity: 'users', alias: 'u' },
  on: { left: 'o.userId', right: 'u.id' }
}]
```

### 2. Limit Semantic Join Results

Control the number of vector matches:

```ts
semantic: {
  embedField: 'description',
  similarityThreshold: 0.8,  // Higher threshold = fewer matches
  topK: 5  // Limit matches per record
}
```

### 3. Avoid Deep Graph Traversals

Keep graph depth minimal:

```ts
graph: {
  relationship: 'FRIENDS_WITH',
  direction: 'outgoing',
  minDepth: 1,
  maxDepth: 2  // Keep depth low
}
```

## Transaction Design

### 1. Keep Transactions Small

Minimize the number of operations per transaction:

```ts
// ✅ Good: Essential operations only
await ductape.warehouse.transaction([
  { operation: 'insert', from: { tag: 'orders-db' }, data: order },
  { operation: 'update', from: { tag: 'inventory-db' }, data: stockUpdate, where: productFilter }
]);

// ❌ Bad: Too many unrelated operations
await ductape.warehouse.transaction([
  { /* order */ },
  { /* inventory */ },
  { /* audit log */ },     // Could be async
  { /* analytics */ },     // Could be async
  { /* notifications */ }  // Could be async
]);
```

### 2. Use Idempotent Operations

Design for safe retries:

```ts
// ✅ Good: Idempotent with unique key
{
  operation: 'upsert',
  from: { type: 'database', tag: 'events-db', entity: 'events' },
  data: {
    idempotencyKey: `${eventType}_${userId}_${timestamp}`,
    type: eventType,
    userId,
    timestamp
  }
}

// ✅ Good: Conditional update
{
  operation: 'update',
  from: { type: 'database', tag: 'inventory-db', entity: 'inventory' },
  data: { quantity: { $decrement: 1 } },
  where: {
    productId: { $eq: productId },
    quantity: { $gte: 1 }  // Only if stock available
  }
}
```

### 3. Handle Failures Gracefully

Always check transaction status:

```ts
const result = await ductape.warehouse.transaction(operations);

if (result.status === 'completed') {
  return { success: true };
}

if (result.status === 'compensated') {
  // Rolled back - inform user
  return { success: false, message: 'Order could not be processed', retry: true };
}

if (result.status === 'failed') {
  // Partial failure - may need manual intervention
  console.error('Transaction in inconsistent state:', result);
  await alertOpsTeam(result);
  return { success: false, message: 'Please contact support', supportTicket: true };
}
```

## Data Source Design

### 1. Use Consistent Naming

```ts
// ✅ Good: Clear, consistent naming
'users-postgres'
'orders-mongodb'
'social-neo4j'
'embeddings-pinecone'

// ❌ Bad: Inconsistent
'userDB'
'OrdersMongo'
'neo4j-graph'
```

### 2. Plan Join Keys

Ensure join keys are indexed and of compatible types:

```ts
// In PostgreSQL users table: id INTEGER PRIMARY KEY
// In MongoDB orders collection: userId field should be indexed
// Ensure types match: both INTEGER or both STRING

join: [{
  on: { left: 'u.id', right: 'o.userId' }  // Both should be same type
}]
```

### 3. Document Entity Relationships

```ts
/**
 * Data Sources:
 * - users-postgres: Main user data (users, profiles)
 *   - users.id -> orders.userId
 *   - users.id -> Person.userId (graph)
 *
 * - orders-mongo: Order transactions
 *   - orders.productId -> products.id
 *
 * - social-neo4j: Social graph
 *   - Person -[FRIENDS_WITH]-> Person
 *   - Person -[FOLLOWS]-> Person
 */
```

## Error Handling

### 1. Validate Before Querying

```ts
function validateQuery(source: IDataSource) {
  if (!source.tag) {
    throw new Error('Data source tag is required');
  }
  if (!source.entity) {
    throw new Error('Entity name is required');
  }
}
```

### 2. Handle Specific Errors

```ts
try {
  const result = await ductape.warehouse.query(query);
  return result;
} catch (error) {
  if (error.code === 'SOURCE_NOT_FOUND') {
    throw new Error(`Data source "${query.from.tag}" not found`);
  }
  if (error.code === 'ENTITY_NOT_FOUND') {
    throw new Error(`Entity "${query.from.entity}" does not exist`);
  }
  if (error.code === 'QUERY_TIMEOUT') {
    // Maybe retry with smaller limit
    return retryWithLimit(query, query.limit / 2);
  }
  throw error;
}
```

### 3. Log Query Metadata

```ts
const result = await ductape.warehouse.query(query);

logger.info('Query executed', {
  operation: query.operation,
  sources: result.metadata.sourcesQueried,
  executionTime: result.metadata.executionTime,
  rowsReturned: result.data.length,
  cached: result.metadata.cached
});
```

## Security

### 1. Validate User Input

Never directly use user input in queries:

```ts
// ❌ Bad: Potential injection
where: { 'u.id': { $eq: req.params.userId } }

// ✅ Good: Validate and sanitize
const userId = parseInt(req.params.userId, 10);
if (isNaN(userId) || userId <= 0) {
  throw new Error('Invalid user ID');
}
where: { 'u.id': { $eq: userId } }
```

### 2. Use Parameterized Values

The Warehouse automatically parameterizes values, but validate types:

```ts
// Ensure types match expected
const query = {
  where: {
    'u.email': { $eq: String(email) },
    'u.age': { $gte: Number(minAge) }
  }
};
```

### 3. Limit Data Exposure

Only return necessary fields:

```ts
// ❌ Bad: Returns sensitive data
fields: ['u.*']

// ✅ Good: Explicit safe fields
fields: ['u.id', 'u.name', 'u.publicEmail', 'u.avatar']
// Exclude: passwordHash, internalNotes, etc.
```

## Monitoring

### 1. Track Slow Queries

```ts
const startTime = Date.now();
const result = await ductape.warehouse.query(query);
const duration = result.metadata.executionTime;

if (duration > 1000) {  // More than 1 second
  logger.warn('Slow query detected', {
    query: JSON.stringify(query),
    duration,
    sourcesQueried: result.metadata.sourcesQueried
  });
}
```

### 2. Monitor Transaction Health

```ts
const metrics = {
  transactionsTotal: 0,
  transactionsCompleted: 0,
  transactionsCompensated: 0,
  transactionsFailed: 0
};

const result = await ductape.warehouse.transaction(operations);
metrics.transactionsTotal++;
metrics[`transactions${result.status.charAt(0).toUpperCase() + result.status.slice(1)}`]++;
```

## Summary

| Category | Best Practice |
|----------|---------------|
| **Queries** | Select specific fields, filter early, use limits |
| **Joins** | Smaller dataset on right, limit semantic matches |
| **Transactions** | Keep small, use idempotent operations, handle failures |
| **Data Sources** | Consistent naming, plan join keys, document relationships |
| **Errors** | Validate input, handle specific errors, log metadata |
| **Security** | Validate user input, limit data exposure |
| **Monitoring** | Track slow queries, monitor transaction health |
