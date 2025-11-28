---
sidebar_position: 3
---

# Working with Relationships

Learn how to create, query, update, and delete relationships between nodes in your graph database. Relationships define connections and enable powerful graph traversals.

## Quick Example

```ts
// Create a relationship
const friendship = await ductape.graph.createRelationship({
  type: 'FRIENDS_WITH',
  startNodeId: aliceId,
  endNodeId: bobId,
  properties: {
    since: 2020,
    closeness: 'high',
  },
});

// Find relationships
const friendships = await ductape.graph.findRelationships({
  type: 'FRIENDS_WITH',
  startNodeId: aliceId,
});

// Update a relationship
await ductape.graph.updateRelationship({
  id: friendship.relationship.id,
  properties: { closeness: 'very high', lastContact: new Date() },
});
```

## Creating Relationships

### Basic Relationship Creation

Connect two nodes with a typed relationship:

```ts
const result = await ductape.graph.createRelationship({
  type: 'WORKS_WITH',
  startNodeId: aliceId,
  endNodeId: bobId,
  properties: {
    team: 'Engineering',
    since: 2023,
    role: 'colleague',
  },
});

console.log('Created relationship ID:', result.relationship.id);
console.log('Type:', result.relationship.type);
console.log('Properties:', result.relationship.properties);
```

### Relationship Types

Use descriptive, UPPERCASE names for relationship types:

```ts
// Social relationships
await ductape.graph.createRelationship({
  type: 'FRIENDS_WITH',
  startNodeId: user1Id,
  endNodeId: user2Id,
  properties: { since: 2020 },
});

// Hierarchical relationships
await ductape.graph.createRelationship({
  type: 'MANAGES',
  startNodeId: managerId,
  endNodeId: employeeId,
  properties: { since: new Date('2023-01-01') },
});

// Ownership relationships
await ductape.graph.createRelationship({
  type: 'OWNS',
  startNodeId: userId,
  endNodeId: productId,
  properties: { purchasedAt: new Date(), price: 299.99 },
});

// Action relationships
await ductape.graph.createRelationship({
  type: 'LIKED',
  startNodeId: userId,
  endNodeId: postId,
  properties: { timestamp: new Date() },
});
```

### Relationships with Properties

Relationships can store rich metadata:

```ts
const result = await ductape.graph.createRelationship({
  type: 'PURCHASED',
  startNodeId: customerId,
  endNodeId: productId,
  properties: {
    // Transaction details
    orderId: 'ORD-2024-12345',
    quantity: 2,
    price: 599.98,
    discount: 50,
    finalPrice: 549.98,

    // Timestamps
    purchasedAt: new Date(),
    deliveredAt: null,

    // Status
    status: 'pending',
    paymentMethod: 'credit_card',

    // Additional metadata
    notes: 'Gift wrapped',
    giftMessage: 'Happy Birthday!',
  },
});
```

## Finding Relationships

### Find All Relationships of a Type

```ts
const result = await ductape.graph.findRelationships({
  type: 'FRIENDS_WITH',
});

console.log('Found relationships:', result.relationships.length);
```

### Find Outgoing Relationships

Find relationships starting from a specific node:

```ts
const result = await ductape.graph.findRelationships({
  type: 'FOLLOWS',
  startNodeId: userId,
});

console.log(`User follows ${result.relationships.length} people`);
```

### Find Incoming Relationships

Find relationships ending at a specific node:

```ts
const result = await ductape.graph.findRelationships({
  type: 'FOLLOWS',
  endNodeId: userId,
});

console.log(`User has ${result.relationships.length} followers`);
```

### Find All Relationships of a Node

Find both incoming and outgoing:

```ts
const outgoing = await ductape.graph.findRelationships({
  startNodeId: userId,
});

const incoming = await ductape.graph.findRelationships({
  endNodeId: userId,
});

const total = outgoing.relationships.length + incoming.relationships.length;
console.log(`User has ${total} total relationships`);
```

### Find with Filters

Filter relationships by properties:

```ts
const result = await ductape.graph.findRelationships({
  type: 'PURCHASED',
  startNodeId: customerId,
  where: {
    status: 'completed',
    finalPrice: { $GT: 100 },
    purchasedAt: { $GTE: new Date('2024-01-01') },
  },
});
```

### Find Multiple Relationship Types

```ts
const result = await ductape.graph.findRelationships({
  type: ['FRIENDS_WITH', 'WORKS_WITH', 'LIVES_NEAR'],
  startNodeId: userId,
});
```

## Finding Relationships by ID

### Single Relationship Lookup

```ts
const relationship = await ductape.graph.findRelationshipById('rel-id-123');

if (relationship) {
  console.log('Type:', relationship.type);
  console.log('From:', relationship.startNodeId);
  console.log('To:', relationship.endNodeId);
  console.log('Properties:', relationship.properties);
}
```

### With Type Safety

```ts
interface PurchaseProperties {
  orderId: string;
  quantity: number;
  price: number;
  purchasedAt: Date;
}

const purchase = await ductape.graph.findRelationshipById<PurchaseProperties>('rel-id-123');

if (purchase) {
  console.log(`Order ${purchase.properties.orderId} - Qty: ${purchase.properties.quantity}`);
}
```

## Updating Relationships

### Update Properties

Add or modify properties on an existing relationship:

```ts
const result = await ductape.graph.updateRelationship({
  id: relationshipId,
  properties: {
    closeness: 'very high',
    lastContact: new Date(),
    meetingCount: { $INCREMENT: 1 },
  },
});

console.log('Updated:', result.relationship.properties);
```

### Update by Filter

Update multiple relationships matching criteria:

```ts
const result = await ductape.graph.updateRelationship({
  type: 'PURCHASED',
  where: {
    status: 'pending',
    purchasedAt: { $LT: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
  },
  properties: {
    status: 'expired',
  },
});

console.log('Updated relationships:', result.updatedCount);
```

### Increment Counters

```ts
// Track interaction frequency
await ductape.graph.updateRelationship({
  id: relationshipId,
  properties: {
    interactions: { $INCREMENT: 1 },
    lastInteraction: new Date(),
  },
});
```

## Deleting Relationships

### Delete by ID

```ts
const result = await ductape.graph.deleteRelationship({
  id: relationshipId,
});

console.log('Deleted:', result.deleted);
```

### Delete by Type and Nodes

Delete specific relationship between two nodes:

```ts
const result = await ductape.graph.deleteRelationship({
  type: 'FRIENDS_WITH',
  startNodeId: aliceId,
  endNodeId: bobId,
});
```

### Delete All Relationships of a Type

```ts
const result = await ductape.graph.deleteRelationship({
  type: 'TEMP_LINK',
  where: {
    createdAt: { $LT: new Date(Date.now() - 24 * 60 * 60 * 1000) },
  },
});

console.log('Deleted relationships:', result.deletedCount);
```

### Delete All Relationships of a Node

```ts
// Delete all outgoing relationships
await ductape.graph.deleteRelationship({
  startNodeId: userId,
});

// Delete all incoming relationships
await ductape.graph.deleteRelationship({
  endNodeId: userId,
});
```

## Merge Relationships

Merge creates a relationship if it doesn't exist, or updates it if it does.

### Basic Merge

```ts
const result = await ductape.graph.mergeRelationship({
  type: 'FRIENDS_WITH',
  startNodeId: aliceId,
  endNodeId: bobId,
  onCreate: {
    since: new Date(),
    interactions: 1,
  },
  onMatch: {
    interactions: { $INCREMENT: 1 },
    lastInteraction: new Date(),
  },
});

if (result.created) {
  console.log('Created new friendship');
} else {
  console.log('Updated existing friendship');
}
```

### Idempotent Operations

Merge is perfect for operations that should be idempotent:

```ts
// This can be called multiple times safely
async function followUser(followerId: string, followedId: string) {
  const result = await ductape.graph.mergeRelationship({
    type: 'FOLLOWS',
    startNodeId: followerId,
    endNodeId: followedId,
    onCreate: {
      followedAt: new Date(),
      active: true,
    },
    onMatch: {
      // Ensure it's active (in case it was unfollowed before)
      active: true,
      refollowedAt: new Date(),
    },
  });

  return result;
}
```

## Common Relationship Patterns

### One-to-Many: User Posts

```ts
// Create multiple posts for a user
for (const postData of posts) {
  const post = await ductape.graph.createNode({
    labels: ['Post'],
    properties: postData,
  });

  await ductape.graph.createRelationship({
    type: 'AUTHORED',
    startNodeId: userId,
    endNodeId: post.node.id,
    properties: { publishedAt: new Date() },
  });
}
```

### Many-to-Many: User Roles

```ts
// Assign multiple roles to a user
for (const roleId of roleIds) {
  await ductape.graph.createRelationship({
    type: 'HAS_ROLE',
    startNodeId: userId,
    endNodeId: roleId,
    properties: {
      assignedAt: new Date(),
      assignedBy: adminId,
    },
  });
}
```

### Hierarchical: Organization Chart

```ts
// Create management hierarchy
await ductape.graph.createRelationship({
  type: 'MANAGES',
  startNodeId: managerId,
  endNodeId: employeeId,
  properties: {
    since: new Date('2023-01-01'),
    department: 'Engineering',
  },
});

await ductape.graph.createRelationship({
  type: 'REPORTS_TO',
  startNodeId: employeeId,
  endNodeId: managerId,
  properties: {
    reportingLevel: 1,
  },
});
```

### Temporal: Event Timeline

```ts
// Connect events in chronological order
await ductape.graph.createRelationship({
  type: 'FOLLOWED_BY',
  startNodeId: event1Id,
  endNodeId: event2Id,
  properties: {
    timeDelta: 3600, // seconds between events
    sequence: 1,
  },
});
```

### Weighted: Social Network

```ts
// Friendship with strength
await ductape.graph.createRelationship({
  type: 'FRIENDS_WITH',
  startNodeId: user1Id,
  endNodeId: user2Id,
  properties: {
    strength: 0.85, // 0-1 scale
    mutualFriends: 15,
    interactions: 247,
  },
});
```

## Bidirectional Relationships

### Creating Bidirectional Links

```ts
// Create symmetric friendship
async function createFriendship(user1Id: string, user2Id: string) {
  // User1 -> User2
  await ductape.graph.createRelationship({
    type: 'FRIENDS_WITH',
    startNodeId: user1Id,
    endNodeId: user2Id,
    properties: { since: new Date() },
  });

  // User2 -> User1
  await ductape.graph.createRelationship({
    type: 'FRIENDS_WITH',
    startNodeId: user2Id,
    endNodeId: user1Id,
    properties: { since: new Date() },
  });
}
```

### Asymmetric Relationships

```ts
// Following is asymmetric - Alice can follow Bob without Bob following Alice
await ductape.graph.createRelationship({
  type: 'FOLLOWS',
  startNodeId: aliceId,
  endNodeId: bobId,
  properties: { followedAt: new Date() },
});
```

## Relationship Structure

### Relationship Object

```ts
interface IRelationship<T = RelationshipProperties> {
  id: string | number;           // Database-specific ID
  type: string;                   // Relationship type
  startNodeId: string | number;   // Source node ID
  endNodeId: string | number;     // Target node ID
  properties: T;                  // Relationship properties
  elementId?: string;             // Neo4j 5.x element ID
}
```

### Result Types

**Create Result:**
```ts
interface ICreateRelationshipResult<T> {
  relationship: IRelationship<T>;
  created: boolean;
}
```

**Find Result:**
```ts
interface IFindRelationshipsResult<T> {
  relationships: IRelationship<T>[];
  count: number;
}
```

**Update Result:**
```ts
interface IUpdateRelationshipResult<T> {
  relationship?: IRelationship<T>;
  relationships?: IRelationship<T>[];
  updatedCount: number;
}
```

**Delete Result:**
```ts
interface IDeleteRelationshipResult {
  deleted: boolean;
  deletedCount: number;
}
```

**Merge Result:**
```ts
interface IMergeRelationshipResult<T> {
  relationship: IRelationship<T>;
  created: boolean;
}
```

## Use Case Examples

### Social Network

```ts
// Follow a user
async function followUser(followerId: string, followedId: string) {
  const result = await ductape.graph.mergeRelationship({
    type: 'FOLLOWS',
    startNodeId: followerId,
    endNodeId: followedId,
    onCreate: {
      followedAt: new Date(),
      notificationsEnabled: true,
    },
    onMatch: {
      refollowedAt: new Date(),
    },
  });

  return result;
}

// Unfollow a user
async function unfollowUser(followerId: string, followedId: string) {
  await ductape.graph.deleteRelationship({
    type: 'FOLLOWS',
    startNodeId: followerId,
    endNodeId: followedId,
  });
}

// Get followers
async function getFollowers(userId: string) {
  const result = await ductape.graph.findRelationships({
    type: 'FOLLOWS',
    endNodeId: userId,
  });

  return result.relationships;
}
```

### E-commerce

```ts
// Add item to cart
async function addToCart(userId: string, productId: string, quantity: number) {
  await ductape.graph.mergeRelationship({
    type: 'IN_CART',
    startNodeId: userId,
    endNodeId: productId,
    onCreate: {
      quantity,
      addedAt: new Date(),
    },
    onMatch: {
      quantity: { $INCREMENT: quantity },
      updatedAt: new Date(),
    },
  });
}

// Purchase products
async function purchaseCart(userId: string) {
  // Find all cart items
  const cartItems = await ductape.graph.findRelationships({
    type: 'IN_CART',
    startNodeId: userId,
  });

  // Convert to purchases
  for (const item of cartItems.relationships) {
    await ductape.graph.createRelationship({
      type: 'PURCHASED',
      startNodeId: userId,
      endNodeId: item.endNodeId,
      properties: {
        quantity: item.properties.quantity,
        purchasedAt: new Date(),
        orderId: generateOrderId(),
      },
    });

    // Remove from cart
    await ductape.graph.deleteRelationship({ id: item.id });
  }
}
```

### Content Management

```ts
// Like a post
async function likePost(userId: string, postId: string) {
  const result = await ductape.graph.mergeRelationship({
    type: 'LIKED',
    startNodeId: userId,
    endNodeId: postId,
    onCreate: {
      likedAt: new Date(),
    },
    onMatch: {
      // Already liked, do nothing or update timestamp
      lastLikedAt: new Date(),
    },
  });

  return result;
}

// Comment on a post
async function commentOnPost(userId: string, postId: string, commentId: string) {
  await ductape.graph.createRelationship({
    type: 'COMMENTED_ON',
    startNodeId: commentId,
    endNodeId: postId,
    properties: {
      authorId: userId,
      createdAt: new Date(),
    },
  });
}
```

## Best Practices

### 1. Use Descriptive Relationship Types

```ts
// Good - clear and specific
'PURCHASED', 'FRIENDS_WITH', 'MANAGES', 'BELONGS_TO'

// Avoid - too generic
'RELATED_TO', 'LINKED', 'CONNECTED'
```

### 2. Store Relationship Metadata

```ts
// Good - rich metadata
await ductape.graph.createRelationship({
  type: 'PURCHASED',
  startNodeId: userId,
  endNodeId: productId,
  properties: {
    price: 99.99,
    quantity: 2,
    discount: 10,
    purchasedAt: new Date(),
    paymentMethod: 'credit_card',
  },
});
```

### 3. Use Merge for Idempotency

```ts
// Merge prevents duplicate relationships
await ductape.graph.mergeRelationship({
  type: 'FOLLOWS',
  startNodeId: followerId,
  endNodeId: followedId,
  onCreate: { followedAt: new Date() },
  onMatch: { lastChecked: new Date() },
});
```

### 4. Clean Up Orphaned Relationships

```ts
// When deleting nodes, use detach to clean up relationships
await ductape.graph.deleteNode({
  id: userId,
  detach: true, // Deletes all connected relationships
});
```

### 5. Index Relationship Properties

```ts
// Index frequently queried relationship properties
await ductape.graph.createRelationshipIndex({
  name: 'idx_purchase_date',
  type: 'PURCHASED',
  properties: ['purchasedAt'],
});
```

## Next Steps

- [Traverse Graphs](./traversals) - Find paths and explore neighborhoods
- [Advanced Querying](./querying) - Pattern matching and complex queries
- [Work with Nodes](./nodes) - Create and manage nodes
- [Use Transactions](./transactions) - Ensure data consistency

## See Also

* [Graph Overview](./overview) - Full API reference
* [Best Practices](./best-practices) - Performance optimization
