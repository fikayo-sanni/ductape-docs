---
sidebar_position: 6
---

# Transactions

Learn how to use transactions to ensure data consistency and atomicity when performing multiple graph operations.

## Quick Example

```ts
// All operations succeed or all fail together
await ductape.graph.executeTransaction(async (tx) => {
  // Create user node
  const user = await ductape.graph.createNode({
    labels: ['User'],
    properties: { name: 'Alice', email: 'alice@example.com' },
  }, tx);

  // Create profile node
  const profile = await ductape.graph.createNode({
    labels: ['Profile'],
    properties: { bio: 'Software Engineer' },
  }, tx);

  // Link them with a relationship
  await ductape.graph.createRelationship({
    type: 'HAS_PROFILE',
    startNodeId: user.node.id,
    endNodeId: profile.node.id,
  }, tx);

  // If any operation fails, all changes are rolled back
});
```

## Why Use Transactions?

Transactions ensure **ACID properties**:

- **Atomicity**: All operations succeed or all fail - no partial updates
- **Consistency**: Database moves from one valid state to another
- **Isolation**: Concurrent transactions don't interfere
- **Durability**: Committed changes are permanent

### Without Transactions (Dangerous)

```ts
// Create user
const user = await ductape.graph.createNode({
  labels: ['User'],
  properties: { name: 'Bob', balance: 1000 },
});

// Transfer money - WHAT IF THIS FAILS?
const recipient = await ductape.graph.findNodeById('recipient-id');

// Update user balance
await ductape.graph.updateNode({
  id: user.node.id,
  properties: { balance: 500 },
});

// ❌ System crashes here - money is lost!

// Update recipient balance (never executed)
await ductape.graph.updateNode({
  id: recipient.id,
  properties: { balance: recipient.properties.balance + 500 },
});
```

### With Transactions (Safe)

```ts
await ductape.graph.executeTransaction(async (tx) => {
  // Get user
  const user = await ductape.graph.findNodeById('user-id', tx);

  // Get recipient
  const recipient = await ductape.graph.findNodeById('recipient-id', tx);

  // Deduct from user
  await ductape.graph.updateNode({
    id: user.id,
    properties: { balance: user.properties.balance - 500 },
  }, tx);

  // Add to recipient
  await ductape.graph.updateNode({
    id: recipient.id,
    properties: { balance: recipient.properties.balance + 500 },
  }, tx);

  // ✅ Both updates happen or neither happens
});
```

## Execute Transaction (Recommended)

The easiest way to use transactions - automatically handles commit/rollback:

```ts
const result = await ductape.graph.executeTransaction(async (tx) => {
  // All operations use the same transaction
  const node1 = await ductape.graph.createNode({
    labels: ['Product'],
    properties: { name: 'Laptop', price: 999 },
  }, tx);

  const node2 = await ductape.graph.createNode({
    labels: ['Category'],
    properties: { name: 'Electronics' },
  }, tx);

  await ductape.graph.createRelationship({
    type: 'IN_CATEGORY',
    startNodeId: node1.node.id,
    endNodeId: node2.node.id,
  }, tx);

  // Return any value you want
  return { productId: node1.node.id, categoryId: node2.node.id };
});

console.log('Created:', result);
// Automatically committed if no errors
// Automatically rolled back if any error occurs
```

### Error Handling

```ts
try {
  await ductape.graph.executeTransaction(async (tx) => {
    const user = await ductape.graph.createNode({
      labels: ['User'],
      properties: { email: 'alice@example.com' },
    }, tx);

    // This might fail (e.g., constraint violation)
    await ductape.graph.createNode({
      labels: ['User'],
      properties: { email: 'alice@example.com' }, // Duplicate!
    }, tx);

    // Transaction automatically rolls back on error
  });
} catch (error) {
  console.log('Transaction failed, all changes rolled back');
  console.error(error.message);
}
```

## Manual Transaction Control

For more control, manage transactions manually:

### Basic Pattern

```ts
// Begin transaction
const tx = await ductape.graph.beginTransaction();

try {
  // Perform operations
  const node = await ductape.graph.createNode({
    labels: ['User'],
    properties: { name: 'Charlie' },
  }, tx);

  const relationship = await ductape.graph.createRelationship({
    type: 'FOLLOWS',
    startNodeId: node.node.id,
    endNodeId: 'another-node-id',
  }, tx);

  // Commit transaction
  await ductape.graph.commitTransaction(tx);
  console.log('Transaction committed successfully');

} catch (error) {
  // Rollback on error
  await ductape.graph.rollbackTransaction(tx);
  console.error('Transaction rolled back:', error.message);
  throw error;
}
```

### With Finally Block

```ts
const tx = await ductape.graph.beginTransaction();

try {
  // Your operations here
  await ductape.graph.createNode({
    labels: ['Article'],
    properties: { title: 'Graph Databases' },
  }, tx);

  await ductape.graph.commitTransaction(tx);

} catch (error) {
  await ductape.graph.rollbackTransaction(tx);
  throw error;

} finally {
  // Clean up resources if needed
  console.log('Transaction completed');
}
```

## Transaction Options

### Isolation Levels

```ts
await ductape.graph.executeTransaction(
  async (tx) => {
    // Your operations
  },
  {
    isolation: 'READ_COMMITTED', // or 'SERIALIZABLE'
  }
);
```

**Isolation Levels:**

- `READ_COMMITTED`: Prevents dirty reads (default)
- `SERIALIZABLE`: Highest isolation, prevents all anomalies

### Timeout

```ts
await ductape.graph.executeTransaction(
  async (tx) => {
    // Long-running operations
  },
  {
    timeout: 30000, // 30 seconds
  }
);
```

### Read-Only Transactions

```ts
await ductape.graph.executeTransaction(
  async (tx) => {
    // Only read operations
    const users = await ductape.graph.findNodes({
      labels: ['User'],
    }, tx);

    const stats = await ductape.graph.getStatistics(tx);

    return { users, stats };
  },
  {
    readOnly: true, // Optimizes for read performance
  }
);
```

## Common Patterns

### User Registration

```ts
async function registerUser(email: string, name: string, password: string) {
  return ductape.graph.executeTransaction(async (tx) => {
    // Check if user exists
    const existing = await ductape.graph.findNodes({
      labels: ['User'],
      where: { email },
      limit: 1,
    }, tx);

    if (existing.nodes.length > 0) {
      throw new Error('Email already registered');
    }

    // Create user node
    const user = await ductape.graph.createNode({
      labels: ['User'],
      properties: {
        email,
        name,
        passwordHash: hashPassword(password),
        createdAt: new Date(),
      },
    }, tx);

    // Create profile node
    const profile = await ductape.graph.createNode({
      labels: ['Profile'],
      properties: {
        userId: user.node.id,
        avatar: null,
        bio: '',
      },
    }, tx);

    // Link user to profile
    await ductape.graph.createRelationship({
      type: 'HAS_PROFILE',
      startNodeId: user.node.id,
      endNodeId: profile.node.id,
    }, tx);

    // Create default settings
    const settings = await ductape.graph.createNode({
      labels: ['Settings'],
      properties: {
        theme: 'light',
        notifications: true,
      },
    }, tx);

    // Link user to settings
    await ductape.graph.createRelationship({
      type: 'HAS_SETTINGS',
      startNodeId: user.node.id,
      endNodeId: settings.node.id,
    }, tx);

    return user.node;
  });
}
```

### Money Transfer

```ts
async function transferMoney(
  fromUserId: string,
  toUserId: string,
  amount: number
) {
  return ductape.graph.executeTransaction(async (tx) => {
    // Lock and fetch both accounts
    const fromUser = await ductape.graph.findNodeById(fromUserId, tx);
    const toUser = await ductape.graph.findNodeById(toUserId, tx);

    if (!fromUser || !toUser) {
      throw new Error('User not found');
    }

    // Check sufficient balance
    if (fromUser.properties.balance < amount) {
      throw new Error('Insufficient funds');
    }

    // Deduct from sender
    await ductape.graph.updateNode({
      id: fromUserId,
      properties: {
        balance: fromUser.properties.balance - amount,
      },
    }, tx);

    // Add to recipient
    await ductape.graph.updateNode({
      id: toUserId,
      properties: {
        balance: toUser.properties.balance + amount,
      },
    }, tx);

    // Create transaction record
    const transaction = await ductape.graph.createNode({
      labels: ['Transaction'],
      properties: {
        amount,
        timestamp: new Date(),
        type: 'transfer',
      },
    }, tx);

    // Link transaction to users
    await ductape.graph.createRelationship({
      type: 'SENT',
      startNodeId: fromUserId,
      endNodeId: transaction.node.id,
    }, tx);

    await ductape.graph.createRelationship({
      type: 'RECEIVED',
      startNodeId: toUserId,
      endNodeId: transaction.node.id,
    }, tx);

    return transaction.node;
  });
}
```

### Batch Operations

```ts
async function createMultipleUsersWithRelationships(
  users: Array<{ name: string; email: string }>
) {
  return ductape.graph.executeTransaction(async (tx) => {
    const createdNodes = [];

    // Create all user nodes
    for (const userData of users) {
      const user = await ductape.graph.createNode({
        labels: ['User'],
        properties: {
          ...userData,
          createdAt: new Date(),
        },
      }, tx);

      createdNodes.push(user.node);
    }

    // Create relationships between consecutive users
    for (let i = 0; i < createdNodes.length - 1; i++) {
      await ductape.graph.createRelationship({
        type: 'INVITED_BY',
        startNodeId: createdNodes[i + 1].id,
        endNodeId: createdNodes[i].id,
        properties: {
          invitedAt: new Date(),
        },
      }, tx);
    }

    return createdNodes;
  });
}
```

### Cascade Delete

```ts
async function deleteUserAndRelatedData(userId: string) {
  return ductape.graph.executeTransaction(async (tx) => {
    // Find user
    const user = await ductape.graph.findNodeById(userId, tx);
    if (!user) {
      throw new Error('User not found');
    }

    // Find all posts by user
    const posts = await ductape.graph.findRelationships({
      startNodeId: userId,
      type: 'POSTED',
      direction: 'OUTGOING',
    }, tx);

    // Delete all posts
    for (const post of posts.relationships) {
      await ductape.graph.deleteNode({
        id: post.endNodeId,
        detach: true,
      }, tx);
    }

    // Find and delete profile
    const profile = await ductape.graph.findRelationships({
      startNodeId: userId,
      type: 'HAS_PROFILE',
      direction: 'OUTGOING',
    }, tx);

    if (profile.relationships.length > 0) {
      await ductape.graph.deleteNode({
        id: profile.relationships[0].endNodeId,
        detach: true,
      }, tx);
    }

    // Delete user node
    await ductape.graph.deleteNode({
      id: userId,
      detach: true, // Also deletes all relationships
    }, tx);

    return { deleted: true, userId };
  });
}
```

### Conditional Updates

```ts
async function incrementPostLikes(postId: string, userId: string) {
  return ductape.graph.executeTransaction(async (tx) => {
    // Check if user already liked the post
    const existingLike = await ductape.graph.findRelationships({
      startNodeId: userId,
      endNodeId: postId,
      type: 'LIKED',
    }, tx);

    if (existingLike.relationships.length > 0) {
      throw new Error('Already liked this post');
    }

    // Create like relationship
    await ductape.graph.createRelationship({
      type: 'LIKED',
      startNodeId: userId,
      endNodeId: postId,
      properties: {
        likedAt: new Date(),
      },
    }, tx);

    // Get current post
    const post = await ductape.graph.findNodeById(postId, tx);

    // Increment likes count
    await ductape.graph.updateNode({
      id: postId,
      properties: {
        likes: (post.properties.likes || 0) + 1,
      },
    }, tx);

    return post;
  });
}
```

## Transaction Performance

### Keep Transactions Short

```ts
// ❌ Bad - transaction is open too long
await ductape.graph.executeTransaction(async (tx) => {
  const user = await ductape.graph.createNode({ /* ... */ }, tx);

  // External API call - blocks transaction
  await fetch('https://api.example.com/notify', {
    method: 'POST',
    body: JSON.stringify(user),
  });

  await ductape.graph.updateNode({ /* ... */ }, tx);
});

// ✅ Good - keep transaction short
const user = await ductape.graph.executeTransaction(async (tx) => {
  const user = await ductape.graph.createNode({ /* ... */ }, tx);
  await ductape.graph.updateNode({ /* ... */ }, tx);
  return user;
});

// External API call after transaction commits
await fetch('https://api.example.com/notify', {
  method: 'POST',
  body: JSON.stringify(user),
});
```

### Batch Operations

```ts
// ✅ Batch operations in single transaction
await ductape.graph.executeTransaction(async (tx) => {
  const nodes = [];

  for (const data of largeDataset) {
    const node = await ductape.graph.createNode({
      labels: ['Product'],
      properties: data,
    }, tx);
    nodes.push(node);
  }

  return nodes;
});
```

### Read-Only Optimization

```ts
// Use read-only transactions for analytics queries
await ductape.graph.executeTransaction(
  async (tx) => {
    const stats = await ductape.graph.getStatistics(tx);

    const popularPosts = await ductape.graph.findNodes({
      labels: ['Post'],
      where: { likes: { $GT: 1000 } },
    }, tx);

    return { stats, popularPosts };
  },
  { readOnly: true } // Allows database to optimize
);
```

## Best Practices

### 1. Always Use Transactions for Multiple Operations

```ts
// ✅ Good - ensures atomicity
await ductape.graph.executeTransaction(async (tx) => {
  const user = await ductape.graph.createNode({ /* ... */ }, tx);
  await ductape.graph.createNode({ /* profile */ }, tx);
  await ductape.graph.createRelationship({ /* link */ }, tx);
});
```

### 2. Use executeTransaction Instead of Manual Control

```ts
// ✅ Recommended - automatic commit/rollback
await ductape.graph.executeTransaction(async (tx) => {
  // operations
});

// ❌ Avoid unless you need fine control
const tx = await ductape.graph.beginTransaction();
try {
  // operations
  await ductape.graph.commitTransaction(tx);
} catch (error) {
  await ductape.graph.rollbackTransaction(tx);
}
```

### 3. Handle Errors Appropriately

```ts
try {
  await ductape.graph.executeTransaction(async (tx) => {
    // operations that might fail
  });
} catch (error) {
  if (error.message.includes('constraint')) {
    console.log('Data validation error');
  } else if (error.message.includes('deadlock')) {
    console.log('Retry transaction');
  } else {
    console.log('Unexpected error');
  }
  throw error;
}
```

### 4. Don't Nest Transactions

```ts
// ❌ Bad - nested transactions not supported
await ductape.graph.executeTransaction(async (tx) => {
  await ductape.graph.createNode({ /* ... */ }, tx);

  // Don't start another transaction here
  await ductape.graph.executeTransaction(async (tx2) => {
    // This won't work as expected
  });
});

// ✅ Good - single transaction for all operations
await ductape.graph.executeTransaction(async (tx) => {
  await ductape.graph.createNode({ /* ... */ }, tx);
  await ductape.graph.createNode({ /* ... */ }, tx);
  await ductape.graph.createRelationship({ /* ... */ }, tx);
});
```

### 5. Pass Transaction to All Operations

```ts
// ✅ Correct - all operations in same transaction
await ductape.graph.executeTransaction(async (tx) => {
  const user = await ductape.graph.createNode({ /* ... */ }, tx);
  const profile = await ductape.graph.createNode({ /* ... */ }, tx);
  await ductape.graph.createRelationship({ /* ... */ }, tx);
});

// ❌ Wrong - missing tx parameter means not in transaction
await ductape.graph.executeTransaction(async (tx) => {
  const user = await ductape.graph.createNode({ /* ... */ }, tx);
  const profile = await ductape.graph.createNode({ /* ... */ }); // Missing tx!
  await ductape.graph.createRelationship({ /* ... */ }, tx);
});
```

### 6. Retry on Deadlocks

```ts
async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      if (error.message.includes('deadlock') && i < maxRetries - 1) {
        console.log(`Deadlock detected, retry ${i + 1}/${maxRetries}`);
        await new Promise(resolve => setTimeout(resolve, 100 * (i + 1)));
        continue;
      }
      throw error;
    }
  }
  throw new Error('Max retries exceeded');
}

// Usage
await withRetry(() =>
  ductape.graph.executeTransaction(async (tx) => {
    // operations that might deadlock
  })
);
```

## Database-Specific Behavior

### Neo4j

- Supports full ACID transactions
- Deadlock detection and prevention
- Optimistic locking

### AWS Neptune

- Supports transactions via Gremlin and openCypher
- Eventual consistency for read replicas

### ArangoDB

- Multi-document transactions supported
- ACID across collections

### Memgraph

- Full transaction support
- ACID compliance

## Next Steps

- [Indexes & Constraints](./indexing) - Optimize performance and data integrity
- [Best Practices](./best-practices) - Graph database optimization
- [Nodes](./nodes) - Working with graph nodes
- [Relationships](./relationships) - Managing connections

## See Also

* [Graph Overview](./overview) - Full API reference
* [Error Handling](./errors) - Managing errors effectively
