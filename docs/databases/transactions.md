---
sidebar_position: 5
---

# Transactions

Transactions ensure that multiple database operations execute atomically - either all succeed or all fail. This guide covers transaction basics, savepoints, isolation levels, and best practices.

## Quick Example

```ts
await ductape.database.transaction({
  env: 'prd',
  product: 'my-app',
  database: 'main-db',
}, async (transaction) => {
  // Create order
  const order = await ductape.database.insert({
    table: 'orders',
    data: { customer_id: 123, total: 99.99, status: 'pending' },
    transaction,
  });

  // Create order items
  await ductape.database.insert({
    table: 'order_items',
    data: items.map(item => ({ order_id: order.insertedIds[0], ...item })),
    transaction,
  });

  // Update inventory
  await ductape.database.update({
    table: 'products',
    data: { stock: { $dec: 1 } },
    where: { id: productId },
    transaction,
  });

  return order;
});
// All changes commit on success, or rollback on any error
```

## Why Use Transactions?

Without transactions, related operations can partially complete, leaving your data in an inconsistent state:

```ts
// Without transaction - DANGEROUS
await ductape.database.insert({ table: 'orders', data: orderData });
// If this fails, the order exists but has no items!
await ductape.database.insert({ table: 'order_items', data: itemsData });
// If this fails, inventory isn't updated!
await ductape.database.update({ table: 'products', data: stockUpdate });
```

With transactions, all operations succeed together or fail together:

```ts
// With transaction - SAFE
await ductape.database.transaction({ ... }, async (transaction) => {
  await ductape.database.insert({ table: 'orders', data: orderData, transaction });
  await ductape.database.insert({ table: 'order_items', data: itemsData, transaction });
  await ductape.database.update({ table: 'products', data: stockUpdate, transaction });
});
// Either all changes are saved, or none are
```

## Callback API (Recommended)

The callback API automatically handles commit and rollback:

```ts
const result = await ductape.database.transaction({
  env: 'prd',
  product: 'my-app',
  database: 'main-db',
}, async (transaction) => {
  // Your database operations here
  // All use the same transaction context

  const user = await ductape.database.insert({
    table: 'users',
    data: { name: 'John', email: 'john@example.com' },
    transaction,
  });

  await ductape.database.insert({
    table: 'profiles',
    data: { user_id: user.insertedIds[0], bio: 'Hello!' },
    transaction,
  });

  return user; // Return value is passed through
});

console.log('User created:', result);
```

### How It Works

1. Transaction begins automatically
2. Your callback executes
3. If callback succeeds → Transaction commits
4. If callback throws → Transaction rolls back
5. Original error is re-thrown

## Manual Transaction Control

For more control, manage the transaction lifecycle manually:

```ts
const transaction = await ductape.database.beginTransaction({
  env: 'prd',
  product: 'my-app',
  database: 'main-db',
  isolationLevel: 'REPEATABLE_READ',
});

try {
  await ductape.database.insert({
    table: 'accounts',
    data: { balance: 1000 },
    transaction,
  });

  await ductape.database.update({
    table: 'accounts',
    data: { balance: { $dec: 100 } },
    where: { id: sourceId },
    transaction,
  });

  await ductape.database.update({
    table: 'accounts',
    data: { balance: { $inc: 100 } },
    where: { id: targetId },
    transaction,
  });

  // Manually commit
  await transaction.commit();
  console.log('Transfer complete');
} catch (error) {
  // Manually rollback
  await transaction.rollback();
  console.error('Transfer failed:', error);
  throw error;
}
```

## Savepoints

Savepoints allow partial rollback within a transaction. If a risky operation fails, you can rollback to the savepoint without losing earlier work.

```ts
await ductape.database.transaction({
  env: 'prd',
  product: 'my-app',
  database: 'main-db',
}, async (transaction) => {
  // First operation - will be kept
  await ductape.database.insert({
    table: 'users',
    data: { name: 'User 1' },
    transaction,
  });

  // Create savepoint before risky operation
  const savepoint = await transaction.savepoint('before_bulk');

  try {
    // Risky bulk insert
    await ductape.database.insert({
      table: 'users',
      data: Array.from({ length: 1000 }, (_, i) => ({
        name: `User ${i + 2}`,
      })),
      transaction,
    });

    // Release savepoint if successful
    await savepoint.release();
  } catch (error) {
    // Rollback only to savepoint - User 1 is preserved
    await savepoint.rollback();
    console.error('Bulk insert failed, rolled back to savepoint');
  }

  // Continue with more operations...
  await ductape.database.insert({
    table: 'audit_log',
    data: { action: 'user_import', status: 'partial' },
    transaction,
  });
});
```

### Savepoint Support

| Database | Savepoint Support |
|----------|-------------------|
| PostgreSQL | Full support |
| MySQL | Full support |
| MongoDB | Not supported (throws error) |
| DynamoDB | Not supported (throws error) |

## Isolation Levels

Control how transactions interact with concurrent operations:

```ts
await ductape.database.transaction({
  env: 'prd',
  product: 'my-app',
  database: 'main-db',
  isolationLevel: 'SERIALIZABLE',
}, async (transaction) => {
  // Operations here
});
```

### Available Levels

| Level | Description | Use Case |
|-------|-------------|----------|
| `READ_UNCOMMITTED` | Can see uncommitted changes from other transactions | Rarely used, maximum concurrency |
| `READ_COMMITTED` | Only sees committed changes | Default for most databases |
| `REPEATABLE_READ` | Consistent reads within transaction | Reports, analytics |
| `SERIALIZABLE` | Full isolation, transactions execute as if sequential | Financial operations |

### Isolation Level Examples

```ts
// READ_COMMITTED - Default, good for most operations
await ductape.database.transaction({
  ...config,
  isolationLevel: 'READ_COMMITTED',
}, async (trx) => {
  // Standard CRUD operations
});

// REPEATABLE_READ - For consistent report generation
await ductape.database.transaction({
  ...config,
  isolationLevel: 'REPEATABLE_READ',
}, async (trx) => {
  // Read operations that must see consistent data
  const orders = await ductape.database.query({ table: 'orders', transaction: trx });
  const totals = await ductape.database.aggregate({ table: 'orders', operations: {...}, transaction: trx });
});

// SERIALIZABLE - For financial transactions
await ductape.database.transaction({
  ...config,
  isolationLevel: 'SERIALIZABLE',
}, async (trx) => {
  // Check balance and transfer atomically
  const account = await ductape.database.query({ table: 'accounts', where: { id: 1 }, transaction: trx });
  if (account.data[0].balance >= amount) {
    await ductape.database.update({ table: 'accounts', data: { balance: { $dec: amount } }, transaction: trx });
  }
});
```

## Read-Only Transactions

Mark transactions as read-only for optimization:

```ts
await ductape.database.transaction({
  env: 'prd',
  product: 'my-app',
  database: 'main-db',
  readOnly: true, // Optimization hint
}, async (transaction) => {
  // Only read operations
  const users = await ductape.database.query({
    table: 'users',
    where: { status: 'active' },
    transaction,
  });

  const stats = await ductape.database.aggregate({
    table: 'orders',
    operations: {
      total: { $SUM: 'amount' },
      count: { $COUNT: '*' },
    },
    transaction,
  });

  return { users: users.data, stats };
});
```

## Transaction Timeout

Set a maximum duration for transactions:

```ts
await ductape.database.transaction({
  env: 'prd',
  product: 'my-app',
  database: 'main-db',
  timeout: 30000, // 30 seconds
}, async (transaction) => {
  // Operations must complete within 30 seconds
  // Otherwise, transaction is rolled back
});
```

## Error Handling

### Handling Specific Errors

```ts
await ductape.database.transaction({
  env: 'prd',
  product: 'my-app',
  database: 'main-db',
}, async (transaction) => {
  try {
    await ductape.database.insert({
      table: 'users',
      data: { email: existingEmail },
      transaction,
    });
  } catch (error) {
    if (error.code === 'UNIQUE_VIOLATION') {
      // Handle gracefully without killing transaction
      console.log('User already exists, skipping...');
      // Continue with other operations
    } else {
      // Rethrow to rollback entire transaction
      throw error;
    }
  }

  // More operations...
});
```

### Transaction Status

```ts
const transaction = await ductape.database.beginTransaction({
  env: 'prd',
  product: 'my-app',
  database: 'main-db',
});

console.log('Active:', transaction.isActive()); // true

await transaction.commit();
console.log('Active:', transaction.isActive()); // false
console.log('Status:', transaction.status); // 'committed'
```

## Database-Specific Considerations

### PostgreSQL

- Full ACID support
- All isolation levels
- Savepoints supported
- Deferrable transactions for read-only with SERIALIZABLE

```ts
await ductape.database.transaction({
  ...config,
  isolationLevel: 'SERIALIZABLE',
  readOnly: true,
  deferrable: true, // PostgreSQL-specific optimization
}, async (trx) => { ... });
```

### MySQL

- Full ACID support (InnoDB)
- All isolation levels
- Savepoints supported
- Default isolation: REPEATABLE_READ

### MongoDB

- Requires replica set or sharded cluster
- Savepoints NOT supported
- Higher latency than SQL transactions
- Different isolation semantics

```ts
// MongoDB transaction
await ductape.database.transaction({
  env: 'prd',
  product: 'my-app',
  database: 'mongo-db',
}, async (transaction) => {
  // Savepoint would throw error here
  // await transaction.savepoint('sp1'); // NOT_SUPPORTED error

  await ductape.database.insert({
    table: 'orders', // Collection name
    data: orderData,
    transaction,
  });
});
```

### DynamoDB

- Uses TransactWriteItems (batch-based)
- Maximum 100 items per transaction
- Savepoints NOT supported
- 2x write cost for transactional writes

```ts
// DynamoDB transaction (max 100 items)
await ductape.database.transaction({
  env: 'prd',
  product: 'my-app',
  database: 'dynamo-db',
}, async (transaction) => {
  // Each insert/update/delete counts toward 100 item limit
  await ductape.database.insert({
    table: 'orders',
    data: orderData,
    transaction,
  });
});
```

## Transaction Options Reference

| Option | Type | Description |
|--------|------|-------------|
| `env` | string | Environment (dev, staging, prd) |
| `product` | string | Product tag |
| `database` | string | Database tag |
| `isolationLevel` | string | Isolation level |
| `readOnly` | boolean | Read-only optimization |
| `timeout` | number | Timeout in milliseconds |
| `deferrable` | boolean | Deferrable (PostgreSQL only) |

## Best Practices

### 1. Keep Transactions Short

Long transactions hold locks and reduce concurrency:

```ts
// Good: Short transaction
await ductape.database.transaction({ ... }, async (trx) => {
  await ductape.database.insert({ table: 'orders', data, transaction: trx });
  await ductape.database.update({ table: 'inventory', data: update, transaction: trx });
});

// Bad: Long transaction with external I/O
await ductape.database.transaction({ ... }, async (trx) => {
  await ductape.database.insert({ table: 'orders', data, transaction: trx });
  await sendEmailNotification(order); // DON'T do this inside transaction
  await callExternalAPI(order);       // DON'T do this inside transaction
});
```

### 2. No External I/O in Transactions

Move network calls, file operations, and external API calls outside:

```ts
// Good: External I/O outside transaction
const order = await ductape.database.transaction({ ... }, async (trx) => {
  return await ductape.database.insert({ table: 'orders', data, transaction: trx });
});

// After transaction completes
await sendEmailNotification(order);
await callExternalAPI(order);
```

### 3. Use Callback API

The callback API prevents forgetting to commit or rollback:

```ts
// Good: Callback API
await ductape.database.transaction({ ... }, async (trx) => {
  // Automatic commit on success, rollback on error
});

// Risky: Manual control
const trx = await ductape.database.beginTransaction({ ... });
// If you forget to commit or rollback, connection leaks!
```

### 4. Choose Appropriate Isolation Level

Use the lowest isolation level that meets your requirements:

```ts
// Most operations: READ_COMMITTED (default)
await ductape.database.transaction({ ... }, async (trx) => { ... });

// Reports needing consistent reads: REPEATABLE_READ
await ductape.database.transaction({ isolationLevel: 'REPEATABLE_READ' }, async (trx) => { ... });

// Financial/critical: SERIALIZABLE
await ductape.database.transaction({ isolationLevel: 'SERIALIZABLE' }, async (trx) => { ... });
```

### 5. Use Savepoints for Partial Operations

When some operations can fail without killing the entire transaction:

```ts
await ductape.database.transaction({ ... }, async (trx) => {
  await ductape.database.insert({ table: 'main_record', data, transaction: trx });

  const sp = await trx.savepoint('optional_data');
  try {
    await ductape.database.insert({ table: 'optional_record', data, transaction: trx });
    await sp.release();
  } catch {
    await sp.rollback(); // Main record still saved
  }
});
```

## Next Steps

- [Migrations](./migrations) - Schema changes within transactions
- [Best Practices](./best-practices) - Production patterns
- [Direct Queries](./direct-queries) - Raw queries in transactions

## See Also

* [Writing Data](./writing-data)
* [Database Overview](./overview)
