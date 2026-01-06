---
sidebar_position: 8
---

# Best Practices

This guide covers production-ready patterns and recommendations for working with databases in Ductape. Following these practices will help you build reliable, performant, and maintainable applications.

## Connection Management

### Use Environment-Specific Configurations

Always configure separate database credentials for each environment:

```ts
// Development - local database
await ductape.database.connect({
  env: 'dev',
  product: 'my-app',
  database: 'main-db',
});

// Production - production credentials
await ductape.database.connect({
  env: 'prd',
  product: 'my-app',
  database: 'main-db',
});
```

Configure environment URLs in the Ductape console to keep credentials secure and separate.

### Connect Once, Reuse Connection

Establish the connection once and reuse it for multiple operations:

```ts
// Good: Connect once at startup
await ductape.database.connect({
  env: 'prd',
  product: 'my-app',
  database: 'main-db',
});

// All subsequent queries inherit the connection
await ductape.database.query({ table: 'users' });
await ductape.database.query({ table: 'orders' });
await ductape.database.query({ table: 'products' });
```

```ts
// Bad: Connecting for each query
async function getUser(id: number) {
  await ductape.database.connect({ ... }); // Unnecessary reconnection
  return ductape.database.query({ table: 'users', where: { id } });
}
```

### Disconnect When Done

Clean up connections when your application shuts down:

```ts
process.on('SIGTERM', async () => {
  await ductape.database.disconnect();
  process.exit(0);
});
```

## Query Optimization

### Select Only Needed Columns

Reduce data transfer by selecting only required fields:

```ts
// Good: Select specific columns
const users = await ductape.database.query({
  table: 'users',
  select: ['id', 'name', 'email'],
});

// Bad: Selecting all columns when you only need a few
const users = await ductape.database.query({
  table: 'users',
  // Returns all columns including large text fields
});
```

### Use Appropriate Indexes

Create indexes for frequently queried columns:

```ts
// Create index for email lookups
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
});

// Create composite index for common queries
await ductape.database.createIndex({
  env: 'dev',
  product: 'my-app',
  database: 'main-db',
  table: 'orders',
  index: {
    name: 'idx_orders_customer_status',
    table: 'orders',
    columns: [{ name: 'customer_id' }, { name: 'status' }],
  },
});
```

### Paginate Large Result Sets

Never fetch unlimited results. Always use pagination:

```ts
// Good: Paginated queries
const pageSize = 20;
const page = 1;

const result = await ductape.database.query({
  table: 'orders',
  limit: pageSize,
  offset: (page - 1) * pageSize,
  orderBy: { column: 'created_at', order: 'DESC' },
});

// Bad: Unbounded query
const allOrders = await ductape.database.query({
  table: 'orders',
  // Could return millions of rows!
});
```

### Use Count for Totals

Get total counts efficiently without fetching all data:

```ts
// Get count separately for pagination metadata
const total = await ductape.database.count({
  table: 'orders',
  where: { status: 'pending' },
});

const orders = await ductape.database.query({
  table: 'orders',
  where: { status: 'pending' },
  limit: 20,
  offset: 0,
});

return {
  data: orders.data,
  total,
  totalPages: Math.ceil(total / 20),
};
```

## Data Integrity

### Use Transactions for Related Operations

Always wrap related operations in transactions:

```ts
// Good: Atomic operations
await ductape.database.transaction({
  env: 'prd',
  product: 'my-app',
  database: 'main-db',
}, async (transaction) => {
  const order = await ductape.database.insert({
    table: 'orders',
    data: orderData,
    transaction,
  });

  await ductape.database.insert({
    table: 'order_items',
    data: items.map(item => ({ order_id: order.insertedIds[0], ...item })),
    transaction,
  });

  await ductape.database.update({
    table: 'inventory',
    data: { stock: { $dec: quantity } },
    where: { product_id: productId },
    transaction,
  });
});
```

### Validate Input Data

Use Database Actions with validation for user input:

```ts
// Good: Validated action
const action = await ductape.database.createAction({
  tag: 'create-user',
  type: DatabaseActionType.INSERT,
  table: 'users',
  input: {
    email: '{{email:EMAIL}}',
    name: '{{name:STRING:2:100}}',
    age: '{{age:NUMBER:18:120}}',
  },
});
```

For direct queries, validate before executing:

```ts
// Validate before insert
function createUser(data: { email: string; name: string }) {
  if (!isValidEmail(data.email)) {
    throw new Error('Invalid email format');
  }
  if (data.name.length < 2) {
    throw new Error('Name too short');
  }

  return ductape.database.insert({
    table: 'users',
    data,
  });
}
```

### Use Upsert for Idempotent Operations

Prevent duplicate key errors with upsert:

```ts
// Good: Upsert for settings
await ductape.database.upsert({
  table: 'user_settings',
  data: {
    user_id: userId,
    theme: 'dark',
    notifications: true,
  },
  conflictKeys: ['user_id'],
});

// Bad: Insert that fails on duplicate
try {
  await ductape.database.insert({
    table: 'user_settings',
    data: { user_id: userId, theme: 'dark' },
  });
} catch (error) {
  // Handle duplicate key error
  await ductape.database.update({
    table: 'user_settings',
    data: { theme: 'dark' },
    where: { user_id: userId },
  });
}
```

## Error Handling

### Catch and Handle Specific Errors

```ts
import { DatabaseError, DatabaseErrorType } from '@ductape/sdk';

async function createUser(data: UserData) {
  try {
    return await ductape.database.insert({
      table: 'users',
      data,
    });
  } catch (error) {
    if (error instanceof DatabaseError) {
      switch (error.type) {
        case DatabaseErrorType.UNIQUE_VIOLATION:
          throw new Error('Email already exists');
        case DatabaseErrorType.FOREIGN_KEY_VIOLATION:
          throw new Error('Invalid reference');
        case DatabaseErrorType.CONNECTION_ERROR:
          // Log and retry or fail gracefully
          console.error('Database connection failed');
          throw new Error('Service temporarily unavailable');
        default:
          throw error;
      }
    }
    throw error;
  }
}
```

### Use Savepoints for Partial Failures

When some operations can fail without affecting others:

```ts
await ductape.database.transaction({ ... }, async (transaction) => {
  // Critical: Must succeed
  await ductape.database.insert({
    table: 'orders',
    data: orderData,
    transaction,
  });

  // Optional: Can fail
  const savepoint = await transaction.savepoint('notifications');
  try {
    await ductape.database.insert({
      table: 'notifications',
      data: notificationData,
      transaction,
    });
    await savepoint.release();
  } catch {
    await savepoint.rollback();
    // Order still created, notification skipped
  }
});
```

## Performance Patterns

### Batch Operations

Insert multiple records in a single operation:

```ts
// Good: Batch insert
await ductape.database.insert({
  table: 'logs',
  data: logEntries, // Array of records
});

// Bad: Individual inserts
for (const entry of logEntries) {
  await ductape.database.insert({
    table: 'logs',
    data: entry,
  });
}
```

### Use Aggregations Instead of Fetching All Data

```ts
// Good: Database-side aggregation
const stats = await ductape.database.aggregate({
  table: 'orders',
  operations: {
    total_revenue: { $SUM: 'total' },
    order_count: { $COUNT: '*' },
    avg_order_value: { $AVG: 'total' },
  },
  where: { status: 'completed' },
});

// Bad: Fetching all data and calculating in app
const orders = await ductape.database.query({
  table: 'orders',
  where: { status: 'completed' },
});
const totalRevenue = orders.data.reduce((sum, o) => sum + o.total, 0);
const avgOrderValue = totalRevenue / orders.data.length;
```

### Avoid N+1 Queries

Use relationships to fetch related data in fewer queries:

```ts
// Good: Include relationships
const orders = await ductape.database.query({
  table: 'orders',
  where: { customer_id: customerId },
  include: {
    items: {
      type: 'one-to-many',
      table: 'order_items',
      foreignKey: 'order_id',
    },
  },
});

// Bad: N+1 pattern
const orders = await ductape.database.query({
  table: 'orders',
  where: { customer_id: customerId },
});

for (const order of orders.data) {
  // Separate query for each order!
  const items = await ductape.database.query({
    table: 'order_items',
    where: { order_id: order.id },
  });
  order.items = items.data;
}
```

## Security Practices

### Never Expose Raw Database Errors

```ts
// Good: Sanitized error messages
try {
  await ductape.database.insert({ table: 'users', data });
} catch (error) {
  console.error('Database error:', error); // Log full error
  throw new Error('Failed to create user'); // Return safe message
}

// Bad: Exposing internal details
try {
  await ductape.database.insert({ table: 'users', data });
} catch (error) {
  throw error; // Exposes table names, column names, etc.
}
```

### Use Parameterized Queries

Raw queries use parameterized inputs by default:

```ts
// Good: Parameterized (safe)
await ductape.database.raw({
  query: 'SELECT * FROM users WHERE email = $1',
  params: [userEmail],
});

// Bad: String concatenation (SQL injection risk)
await ductape.database.raw({
  query: `SELECT * FROM users WHERE email = '${userEmail}'`, // DANGEROUS!
});
```

### Limit Query Scope

Restrict queries to prevent accidental data exposure:

```ts
// Good: Always filter by tenant/owner
async function getUserOrders(userId: number, tenantId: number) {
  return ductape.database.query({
    table: 'orders',
    where: {
      user_id: userId,
      tenant_id: tenantId, // Always include tenant filter
    },
  });
}
```

## Transaction Best Practices

### Keep Transactions Short

Long transactions hold locks and reduce concurrency:

```ts
// Good: Short transaction
await ductape.database.transaction({ ... }, async (trx) => {
  await ductape.database.insert({ table: 'orders', data, transaction: trx });
  await ductape.database.update({ table: 'inventory', data: update, transaction: trx });
});

// Bad: External I/O inside transaction
await ductape.database.transaction({ ... }, async (trx) => {
  await ductape.database.insert({ table: 'orders', data, transaction: trx });
  await sendEmail(order);        // DON'T: Holds transaction open
  await callExternalAPI(order);  // DON'T: Network latency
});
```

### Move External Operations Outside

```ts
// Good: External I/O after transaction
const order = await ductape.database.transaction({ ... }, async (trx) => {
  return await ductape.database.insert({ table: 'orders', data, transaction: trx });
});

// After commit - safe to do external operations
await sendEmailNotification(order);
await callExternalAPI(order);
```

### Choose Appropriate Isolation Levels

| Scenario | Recommended Level |
|----------|-------------------|
| Standard CRUD | READ_COMMITTED (default) |
| Report generation | REPEATABLE_READ |
| Financial transactions | SERIALIZABLE |
| High-throughput writes | READ_COMMITTED |

## Actions vs Direct Queries

### Use Actions For

- Standard CRUD operations with consistent structure
- Operations that need input validation
- Reusable operations across your application
- Operations that benefit from centralized configuration

```ts
// Action: Validated, reusable
await ductape.database.execute({
  action: 'main-db:create-user',
  input: { email, name, role },
});
```

### Use Direct Queries For

- Dynamic queries with variable conditions
- Complex aggregations and analytics
- Ad-hoc data exploration
- Operations not fitting action templates

```ts
// Direct query: Dynamic filters
const where: any = {};
if (filters.status) where.status = filters.status;
if (filters.minPrice) where.price = { $GTE: filters.minPrice };

await ductape.database.query({
  table: 'products',
  where: Object.keys(where).length > 0 ? where : undefined,
});
```

## Database-Specific Tips

### PostgreSQL

- Use `SERIALIZABLE` isolation for financial operations
- Leverage `RETURNING` clause for insert/update results
- Use `ARRAY_AGG` for grouping into arrays

### MySQL

- Default isolation is `REPEATABLE_READ`
- Use `GROUP_CONCAT` for string aggregation
- Be aware of implicit commits with DDL statements

### MongoDB

- Transactions require replica set or sharded cluster
- Savepoints are not supported
- Use aggregation pipeline for complex queries

### DynamoDB

- Transactions limited to 100 items
- Savepoints not supported
- 2x write cost for transactional writes

## Checklist

Before deploying to production, verify:

- [ ] Environment-specific database configurations
- [ ] Appropriate indexes for frequent queries
- [ ] Pagination on all list endpoints
- [ ] Transactions for related operations
- [ ] Input validation on user-facing operations
- [ ] Error handling with sanitized messages
- [ ] No N+1 query patterns
- [ ] Connection cleanup on shutdown
- [ ] Appropriate isolation levels for critical operations

## Next Steps

- [Database Overview](./overview) - Start from the beginning
- [Transactions](./transactions) - Deep dive into transactions
- [Direct Queries](./direct-queries) - Advanced query patterns

## See Also

* [Getting Started](./getting-started)
* [Database Actions](./actions)
