---
sidebar_position: 4
---

# Distributed Transactions

The Warehouse uses the **Saga pattern** to execute distributed transactions across multiple data sources. This ensures data consistency even when operations span different databases, graphs, and vector stores.

## Overview

Traditional ACID transactions don't work across different database systems. The Saga pattern breaks a transaction into a sequence of local transactions, each with a compensating action (rollback) that can undo its effects if a later step fails.

```
[Step 1] → [Step 2] → [Step 3] → ✅ Success
    ↓          ↓          ↓
[Undo 1] ← [Undo 2] ← [Undo 3] ← ❌ Failure
```

## Basic Transaction

Execute multiple operations as a single logical transaction:

```ts
const result = await ductape.warehouse.transaction([
  // Step 1: Create order in PostgreSQL
  {
    operation: 'insert',
    from: {
      type: 'database',
      tag: 'orders-postgres',
      entity: 'orders'
    },
    data: {
      userId: 'user_123',
      total: 99.99,
      status: 'pending'
    }
  },
  // Step 2: Create event in Neo4j graph
  {
    operation: 'insert',
    from: {
      type: 'graph',
      tag: 'activity-neo4j',
      entity: 'OrderEvent'
    },
    data: {
      type: 'ORDER_PLACED',
      userId: 'user_123',
      timestamp: new Date().toISOString()
    }
  },
  // Step 3: Update user behavior vector
  {
    operation: 'upsert',
    from: {
      type: 'vector',
      tag: 'user-behavior',
      entity: 'behaviors'
    },
    data: {
      id: 'user_123_purchase',
      vector: purchaseBehaviorVector,
      metadata: { action: 'purchase', amount: 99.99 }
    }
  }
]);

if (result.status === 'completed') {
  console.log('Transaction successful');
} else if (result.status === 'compensated') {
  console.log('Transaction rolled back:', result.error);
}
```

## Transaction Result

```ts
interface ISagaResult {
  status: 'completed' | 'compensated' | 'failed';
  executionTime: number;
  stepResults: Record<string, {
    data?: any[];
    affectedRows?: number;
    error?: string;
  }>;
  compensatedSteps?: string[];
  error?: string;
}
```

## Transaction Options

Configure transaction behavior with options:

```ts
const result = await ductape.warehouse.transaction(
  operations,
  {
    timeout: 30000,        // Total timeout in ms
    retryOnFailure: true,  // Retry failed steps
    maxRetries: 3,         // Max retry attempts per step
    compensateOnTimeout: true  // Rollback if timeout
  }
);
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `timeout` | number | 30000 | Maximum execution time in ms |
| `retryOnFailure` | boolean | false | Auto-retry failed steps |
| `maxRetries` | number | 3 | Max retries per step |
| `compensateOnTimeout` | boolean | true | Rollback on timeout |

## Multi-Database Write

A common pattern - write to multiple databases atomically:

```ts
// Create a user across multiple systems
const result = await ductape.warehouse.transaction([
  // 1. Create user in main database
  {
    operation: 'insert',
    from: {
      type: 'database',
      tag: 'users-postgres',
      entity: 'users'
    },
    data: {
      id: userId,
      email: 'john@example.com',
      name: 'John Doe',
      createdAt: new Date()
    }
  },
  // 2. Create user profile in MongoDB
  {
    operation: 'insert',
    from: {
      type: 'database',
      tag: 'profiles-mongo',
      entity: 'profiles'
    },
    data: {
      userId,
      bio: '',
      avatar: null,
      preferences: defaultPreferences
    }
  },
  // 3. Create user node in graph
  {
    operation: 'insert',
    from: {
      type: 'graph',
      tag: 'social-neo4j',
      entity: 'User'
    },
    data: {
      id: userId,
      name: 'John Doe',
      joinedAt: new Date().toISOString()
    }
  },
  // 4. Index user for search
  {
    operation: 'upsert',
    from: {
      type: 'vector',
      tag: 'user-search',
      entity: 'users'
    },
    data: {
      id: userId,
      vector: await generateUserEmbedding({ name: 'John Doe', email: 'john@example.com' }),
      metadata: { name: 'John Doe', email: 'john@example.com' }
    }
  }
]);
```

## Order Processing Example

Complete order processing with inventory, payment, and notification:

```ts
async function processOrder(order: Order) {
  const result = await ductape.warehouse.transaction([
    // 1. Create order record
    {
      operation: 'insert',
      from: { type: 'database', tag: 'orders-db', entity: 'orders' },
      data: {
        id: order.id,
        userId: order.userId,
        items: order.items,
        total: order.total,
        status: 'processing'
      }
    },
    // 2. Decrement inventory for each item
    ...order.items.map(item => ({
      operation: 'update' as const,
      from: { type: 'database', tag: 'inventory-db', entity: 'inventory' },
      data: { quantity: { $decrement: item.quantity } },
      where: { productId: { $eq: item.productId } }
    })),
    // 3. Create payment record
    {
      operation: 'insert',
      from: { type: 'database', tag: 'payments-db', entity: 'payments' },
      data: {
        orderId: order.id,
        amount: order.total,
        status: 'pending',
        method: order.paymentMethod
      }
    },
    // 4. Log order event in graph
    {
      operation: 'insert',
      from: { type: 'graph', tag: 'events-neo4j', entity: 'OrderEvent' },
      data: {
        orderId: order.id,
        userId: order.userId,
        type: 'ORDER_CREATED',
        timestamp: new Date().toISOString()
      }
    }
  ]);

  if (result.status !== 'completed') {
    throw new Error(`Order failed: ${result.error}`);
  }

  return result;
}
```

## Handling Failures

When a step fails, the Warehouse automatically compensates by undoing completed steps:

```ts
const result = await ductape.warehouse.transaction([
  { operation: 'insert', from: { type: 'database', tag: 'db1', entity: 'table1' }, data: { id: 1 } },
  { operation: 'insert', from: { type: 'database', tag: 'db2', entity: 'table2' }, data: { id: 1 } },
  { operation: 'insert', from: { type: 'database', tag: 'db3', entity: 'table3' }, data: { invalidData: true } } // Fails
]);

if (result.status === 'compensated') {
  console.log('Steps that were rolled back:', result.compensatedSteps);
  // ['step_0', 'step_1'] - First two inserts were deleted
  console.log('Error:', result.error);
}
```

## Compensation Strategies

The Warehouse uses these compensation strategies by operation type:

| Operation | Compensation |
|-----------|--------------|
| `insert` | `delete` the inserted record |
| `update` | `update` with original values |
| `delete` | `insert` the deleted record |
| `upsert` | Delete or restore original |

## Error Handling Best Practices

```ts
try {
  const result = await ductape.warehouse.transaction(operations);

  switch (result.status) {
    case 'completed':
      // All steps succeeded
      return { success: true, data: result.stepResults };

    case 'compensated':
      // Failed but rolled back successfully
      console.error('Transaction rolled back:', result.error);
      return { success: false, rolledBack: true, error: result.error };

    case 'failed':
      // Failed and could not fully rollback
      console.error('Transaction failed with partial state:', result.error);
      console.error('Compensated steps:', result.compensatedSteps);
      // Manual intervention may be needed
      await alertOpsTeam(result);
      return { success: false, rolledBack: false, error: result.error };
  }
} catch (error) {
  // Network or system error
  console.error('System error during transaction:', error);
  throw error;
}
```

## Idempotency

For reliable retries, design operations to be idempotent:

```ts
// Good: Idempotent upsert with unique key
{
  operation: 'upsert',
  from: { type: 'database', tag: 'orders-db', entity: 'orders' },
  data: {
    idempotencyKey: `order_${userId}_${timestamp}`,
    // ... order data
  }
}

// Good: Conditional update
{
  operation: 'update',
  from: { type: 'database', tag: 'inventory-db', entity: 'inventory' },
  data: { quantity: { $decrement: 1 } },
  where: {
    productId: { $eq: productId },
    quantity: { $gte: 1 }  // Only if sufficient stock
  }
}
```

## Monitoring Transactions

Track transaction execution in the result metadata:

```ts
const result = await ductape.warehouse.transaction(operations);

console.log('Execution time:', result.executionTime, 'ms');
console.log('Steps executed:', Object.keys(result.stepResults).length);

for (const [stepId, stepResult] of Object.entries(result.stepResults)) {
  console.log(`${stepId}:`, {
    success: !stepResult.error,
    affectedRows: stepResult.affectedRows,
    error: stepResult.error
  });
}
```

## Next Steps

- [Query Reference](./query-reference.md) - Complete query syntax documentation
- [Joins](./joins.md) - Cross-database joins
- [Getting Started](./getting-started.md) - Basic warehouse usage
