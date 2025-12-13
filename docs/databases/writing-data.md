---
sidebar_position: 3
---

# Writing Data

Learn how to insert, update, upsert, and delete data using Ductape's database API. This guide covers single records, bulk operations, and advanced write patterns.

## Insert Operations

### Insert a Single Record

```ts
const result = await ductape.database.insert({
  table: 'users',
  data: {
    name: 'John Doe',
    email: 'john@example.com',
    status: 'active',
    created_at: new Date(),
  },
  returning: true, // Return the inserted record
});

console.log('Inserted ID:', result.insertedIds[0]);
console.log('Inserted data:', result.data);
```

### Insert Multiple Records

```ts
const result = await ductape.database.insert({
  table: 'users',
  data: [
    { name: 'User 1', email: 'user1@example.com' },
    { name: 'User 2', email: 'user2@example.com' },
    { name: 'User 3', email: 'user3@example.com' },
  ],
});

console.log('Inserted count:', result.count);
console.log('Inserted IDs:', result.insertedIds);
```

### Insert with Conflict Handling (Upsert)

Handle duplicate key conflicts gracefully:

```ts
const result = await ductape.database.insert({
  table: 'users',
  data: {
    email: 'john@example.com',
    name: 'John Doe',
    status: 'active',
  },
  onConflict: {
    columns: ['email'],        // Conflict detection columns
    action: 'update',          // 'update' or 'ignore'
    update: ['name', 'status'], // Columns to update on conflict
  },
});
```

### Insert with Connection Parameters

```ts
const result = await ductape.database.insert({
  env: 'prd',
  product: 'my-app',
  database: 'users-db',
  table: 'users',
  data: {
    name: 'John Doe',
    email: 'john@example.com',
  },
});
```

## Update Operations

### Update Matching Records

```ts
const result = await ductape.database.update({
  table: 'users',
  data: {
    status: 'inactive',
    updated_at: new Date(),
  },
  where: {
    last_login: { $LT: new Date('2023-01-01') },
  },
  returning: true,
});

console.log('Updated count:', result.count);
console.log('Updated records:', result.data);
```

### Update Operators

Ductape provides special operators for atomic update operations. These operators work across all supported databases (PostgreSQL, MySQL, MariaDB, MongoDB, DynamoDB, Cassandra).

#### Numeric Operators

```ts
// $INC - Increment a numeric value
await ductape.database.update({
  table: 'products',
  data: {
    stock: { $INC: 10 }, // Add 10 to stock
    views: { $INC: 1 },  // Increment view count
  },
  where: { id: productId },
});

// $DEC - Decrement a numeric value
await ductape.database.update({
  table: 'products',
  data: {
    stock: { $DEC: 5 }, // Subtract 5 from stock
  },
  where: { id: productId },
});

// $MUL - Multiply a numeric value
await ductape.database.update({
  table: 'products',
  data: {
    price: { $MUL: 1.1 }, // Increase price by 10%
  },
  where: { category: 'electronics' },
});

// $MIN - Set to minimum (only update if new value is less than current)
await ductape.database.update({
  table: 'products',
  data: {
    lowest_price: { $MIN: currentPrice }, // Track lowest price seen
  },
  where: { id: productId },
});

// $MAX - Set to maximum (only update if new value is greater than current)
await ductape.database.update({
  table: 'products',
  data: {
    highest_price: { $MAX: currentPrice }, // Track highest price seen
  },
  where: { id: productId },
});
```

#### Field Operators

```ts
// $SET - Explicitly set a value (useful when you need to distinguish from regular updates)
await ductape.database.update({
  table: 'users',
  data: {
    settings: { $SET: { theme: 'dark', language: 'en' } },
  },
  where: { id: userId },
});

// $UNSET - Remove/null a field
await ductape.database.update({
  table: 'users',
  data: {
    temporary_token: { $UNSET: true }, // Set to NULL / remove field
  },
  where: { id: userId },
});
```

#### Array Operators

These operators work with array/list columns. Behavior varies by database:
- **PostgreSQL**: Works with native array types
- **MySQL/MariaDB**: Works with JSON arrays
- **MongoDB**: Native array support
- **DynamoDB**: Works with List and Set types
- **Cassandra**: Works with list and set types

```ts
// $PUSH - Add an element to an array
await ductape.database.update({
  table: 'users',
  data: {
    tags: { $PUSH: 'premium' }, // Add 'premium' to tags array
  },
  where: { id: userId },
});

// $PULL - Remove an element from an array
await ductape.database.update({
  table: 'users',
  data: {
    tags: { $PULL: 'trial' }, // Remove 'trial' from tags array
  },
  where: { id: userId },
});

// $ADDTOSET - Add element only if it doesn't exist (unique add)
await ductape.database.update({
  table: 'users',
  data: {
    roles: { $ADDTOSET: 'editor' }, // Add 'editor' only if not present
  },
  where: { id: userId },
});
```

#### Operator Reference

| Operator | Description | Supported Databases |
|----------|-------------|---------------------|
| `$INC` | Increment numeric value | All |
| `$DEC` | Decrement numeric value | All |
| `$MUL` | Multiply numeric value | PostgreSQL, MySQL, MariaDB, MongoDB |
| `$MIN` | Set to minimum of current and new value | PostgreSQL, MySQL, MariaDB, MongoDB |
| `$MAX` | Set to maximum of current and new value | PostgreSQL, MySQL, MariaDB, MongoDB |
| `$SET` | Explicitly set a value | All |
| `$UNSET` | Remove/null a field | All |
| `$PUSH` | Add element to array | All |
| `$PULL` | Remove element from array | All (except DynamoDB) |
| `$ADDTOSET` | Add unique element to array | All |

#### Combining Multiple Operators

```ts
await ductape.database.update({
  table: 'game_stats',
  data: {
    score: { $INC: 100 },           // Increment score
    high_score: { $MAX: newScore }, // Update high score if higher
    games_played: { $INC: 1 },      // Increment game count
    achievements: { $ADDTOSET: 'first_win' }, // Add achievement
    updated_at: new Date(),         // Regular field update
  },
  where: { player_id: playerId },
});
```

### Update with Complex Conditions

```ts
await ductape.database.update({
  table: 'orders',
  data: {
    status: 'cancelled',
    cancelled_at: new Date(),
    cancellation_reason: 'Customer request',
  },
  where: {
    $AND: {
      status: { $IN: ['pending', 'processing'] },
      created_at: { $LT: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    },
  },
});
```

### Update Single Record by ID

```ts
await ductape.database.update({
  table: 'users',
  data: {
    name: 'Jane Doe',
    email: 'jane@example.com',
  },
  where: { id: userId },
  returning: true,
});
```

## Upsert Operations

Insert a record or update if it already exists:

### Basic Upsert

```ts
const result = await ductape.database.upsert({
  table: 'user_preferences',
  data: {
    user_id: 123,
    theme: 'dark',
    language: 'en',
    notifications: true,
  },
  conflictKeys: ['user_id'], // Unique key to check
});

console.log('Operation:', result.operation); // 'inserted' or 'updated'
console.log('Affected rows:', result.count);
```

### Upsert with Specific Update Columns

```ts
const result = await ductape.database.upsert({
  table: 'product_inventory',
  data: {
    product_id: 'prod-123',
    warehouse_id: 'wh-1',
    quantity: 100,
    last_restocked: new Date(),
  },
  conflictKeys: ['product_id', 'warehouse_id'],
  updateColumns: ['quantity', 'last_restocked'], // Only update these on conflict
});
```

## Delete Operations

### Delete Matching Records

```ts
const result = await ductape.database.delete({
  table: 'users',
  where: {
    status: 'deleted',
  },
});

console.log('Deleted count:', result.count);
```

### Delete with Complex Conditions

```ts
await ductape.database.delete({
  table: 'sessions',
  where: {
    $AND: {
      expires_at: { $LT: new Date() },
      user_id: { $IS_NOT_NULL: true },
    },
  },
});
```

### Delete Single Record

```ts
await ductape.database.delete({
  table: 'users',
  where: { id: userId },
});
```

### Soft Delete Pattern

Instead of permanently deleting, mark records as deleted:

```ts
// Soft delete
await ductape.database.update({
  table: 'users',
  data: {
    deleted_at: new Date(),
    status: 'deleted',
  },
  where: { id: userId },
});

// Query excluding soft-deleted records
const activeUsers = await ductape.database.query({
  table: 'users',
  where: {
    deleted_at: { $IS_NULL: true },
  },
});
```

## Transactions

Wrap multiple write operations in a transaction:

### Using the Callback API (Recommended)

```ts
const result = await ductape.database.transaction({
  env: 'prd',
  product: 'my-app',
  database: 'main-db',
}, async (transaction) => {
  // Insert order
  const order = await ductape.database.insert({
    table: 'orders',
    data: {
      customer_id: customerId,
      total: 99.99,
      status: 'pending',
    },
    transaction,
  });

  // Insert order items
  await ductape.database.insert({
    table: 'order_items',
    data: items.map(item => ({
      order_id: order.insertedIds[0],
      product_id: item.productId,
      quantity: item.quantity,
      price: item.price,
    })),
    transaction,
  });

  // Update inventory
  for (const item of items) {
    await ductape.database.update({
      table: 'products',
      data: { stock: { $dec: item.quantity } },
      where: { id: item.productId },
      transaction,
    });
  }

  return order;
});
```

### Manual Transaction Control

```ts
const transaction = await ductape.database.beginTransaction({
  env: 'prd',
  product: 'my-app',
  database: 'main-db',
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
    where: { id: sourceAccountId },
    transaction,
  });

  await transaction.commit();
} catch (error) {
  await transaction.rollback();
  throw error;
}
```

## Write Result Structures

### Insert Result

```ts
interface IInsertResult<T> {
  data: T[];              // Inserted records (if returning: true)
  count: number;          // Number of inserted records
  insertedIds: any[];     // IDs of inserted records
}
```

### Update Result

```ts
interface IUpdateResult<T> {
  data: T[];              // Updated records (if returning: true)
  count: number;          // Number of updated records
}
```

### Delete Result

```ts
interface IDeleteResult {
  count: number;          // Number of deleted records
}
```

### Upsert Result

```ts
interface IUpsertResult<T> {
  data: T[];              // Affected records
  count: number;          // Number of affected records
  operation: 'inserted' | 'updated';
}
```

## Options Reference

### Insert Options

| Option | Type | Description |
|--------|------|-------------|
| `table` | string | Table name |
| `data` | object \| object[] | Record(s) to insert |
| `returning` | boolean | Return inserted records |
| `onConflict` | object | Conflict handling configuration |
| `transaction` | ITransaction | Transaction to use |

### Update Options

| Option | Type | Description |
|--------|------|-------------|
| `table` | string | Table name |
| `data` | object | Fields to update |
| `where` | object | Filter conditions |
| `returning` | boolean | Return updated records |
| `transaction` | ITransaction | Transaction to use |

### Delete Options

| Option | Type | Description |
|--------|------|-------------|
| `table` | string | Table name |
| `where` | object | Filter conditions |
| `returning` | boolean | Return deleted records |
| `transaction` | ITransaction | Transaction to use |

### Upsert Options

| Option | Type | Description |
|--------|------|-------------|
| `table` | string | Table name |
| `data` | object | Record to insert/update |
| `conflictKeys` | string[] | Unique key columns |
| `updateColumns` | string[] | Columns to update on conflict |
| `transaction` | ITransaction | Transaction to use |

## Best Practices

### 1. Always Use Transactions for Related Changes

```ts
// Good: Multiple related changes in a transaction
await ductape.database.transaction({ ... }, async (trx) => {
  await ductape.database.insert({ table: 'orders', data: order, transaction: trx });
  await ductape.database.insert({ table: 'order_items', data: items, transaction: trx });
  await ductape.database.update({ table: 'inventory', data: updates, transaction: trx });
});

// Bad: Related changes without transaction
await ductape.database.insert({ table: 'orders', data: order });
await ductape.database.insert({ table: 'order_items', data: items }); // Might fail, leaving orphaned order
```

### 2. Use Returning for Immediate Data Access

```ts
// Good: Get inserted data immediately
const result = await ductape.database.insert({
  table: 'users',
  data: userData,
  returning: true,
});
const newUser = result.data[0];

// Avoid: Separate query after insert
const insertResult = await ductape.database.insert({ table: 'users', data: userData });
const newUser = await ductape.database.query({
  table: 'users',
  where: { id: insertResult.insertedIds[0] }
});
```

### 3. Validate Before Writing

```ts
// Validate data before database operations
function validateUser(data: any) {
  if (!data.email || !data.email.includes('@')) {
    throw new Error('Invalid email');
  }
  if (!data.name || data.name.length < 2) {
    throw new Error('Name too short');
  }
}

validateUser(userData);
await ductape.database.insert({ table: 'users', data: userData });
```

### 4. Use Soft Deletes for Important Data

```ts
// Instead of hard delete
await ductape.database.delete({ table: 'users', where: { id: userId } });

// Use soft delete
await ductape.database.update({
  table: 'users',
  data: { deleted_at: new Date(), status: 'deleted' },
  where: { id: userId },
});
```

### 5. Handle Conflicts Gracefully

```ts
try {
  await ductape.database.insert({
    table: 'users',
    data: { email: 'test@example.com', name: 'Test' },
  });
} catch (error) {
  if (error.code === 'UNIQUE_VIOLATION') {
    // Handle duplicate email
    console.log('Email already exists');
  } else {
    throw error;
  }
}

// Or use upsert for automatic handling
await ductape.database.upsert({
  table: 'users',
  data: { email: 'test@example.com', name: 'Test' },
  conflictKeys: ['email'],
});
```

## Next Steps

- [Aggregations](./aggregations) - Perform calculations on your data
- [Transactions](./transactions) - Deep dive into transaction management
- [Best Practices](./best-practices) - Production-ready patterns

## See Also

* [Querying Data](./querying)
* [Transactions](./transactions)
* [Best Practices](./best-practices)
