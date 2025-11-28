---
sidebar_position: 2
---

# Working with Nodes

Learn how to create, query, update, and delete nodes in your graph database. This guide covers all node operations with practical examples and best practices.

## Quick Example

```ts
// Create a node
const user = await ductape.graph.createNode({
  labels: ['Person', 'User'],
  properties: {
    name: 'Alice Johnson',
    email: 'alice@example.com',
    age: 28,
  },
});

// Find nodes
const adults = await ductape.graph.findNodes({
  labels: ['Person'],
  where: { age: { $GTE: 18 } },
  limit: 10,
});

// Update a node
await ductape.graph.updateNode({
  id: user.node.id,
  properties: { age: 29, lastLogin: new Date() },
});
```

## Creating Nodes

### Basic Node Creation

Create a node with labels and properties:

```ts
const result = await ductape.graph.createNode({
  labels: ['Person'],
  properties: {
    name: 'Bob Smith',
    email: 'bob@example.com',
    age: 32,
    city: 'New York',
    joined: new Date(),
  },
});

console.log('Created node ID:', result.node.id);
console.log('Node properties:', result.node.properties);
```

### Multiple Labels

Nodes can have multiple labels for classification:

```ts
const result = await ductape.graph.createNode({
  labels: ['Person', 'Employee', 'Engineer'],
  properties: {
    name: 'Charlie Davis',
    email: 'charlie@company.com',
    role: 'Senior Engineer',
    department: 'Engineering',
    salary: 120000,
  },
});
```

### Complex Properties

Nodes support various property types:

```ts
const result = await ductape.graph.createNode({
  labels: ['Product'],
  properties: {
    // Strings
    name: 'Laptop Pro',
    sku: 'LPT-2024-001',

    // Numbers
    price: 1299.99,
    stock: 45,

    // Booleans
    inStock: true,
    featured: false,

    // Dates
    releaseDate: new Date('2024-01-15'),
    lastUpdated: new Date(),

    // Arrays
    tags: ['electronics', 'computers', 'premium'],
    colors: ['silver', 'space gray'],

    // Objects (stored as JSON strings in most graph DBs)
    specs: {
      cpu: 'M3 Pro',
      ram: '16GB',
      storage: '512GB SSD',
    },
  },
});
```

## Finding Nodes

### Find All Nodes with Label

```ts
const result = await ductape.graph.findNodes({
  labels: ['Person'],
});

console.log('Found nodes:', result.nodes.length);
result.nodes.forEach(node => {
  console.log(`${node.properties.name} - ID: ${node.id}`);
});
```

### Find with Filters

Use the `where` clause to filter nodes:

```ts
const result = await ductape.graph.findNodes({
  labels: ['Person'],
  where: {
    city: 'San Francisco',
    age: { $GT: 25 },
  },
  limit: 10,
});
```

### Available Filter Operators

| Operator | Description | Example |
|----------|-------------|---------|
| `$GT` | Greater than | `{ age: { $GT: 18 } }` |
| `$GTE` | Greater than or equal | `{ age: { $GTE: 18 } }` |
| `$LT` | Less than | `{ price: { $LT: 100 } }` |
| `$LTE` | Less than or equal | `{ price: { $LTE: 100 } }` |
| `$NE` | Not equal | `{ status: { $NE: 'deleted' } }` |
| `$IN` | In array | `{ role: { $IN: ['admin', 'moderator'] } }` |
| `$NOT_IN` | Not in array | `{ status: { $NOT_IN: ['banned', 'suspended'] } }` |
| `$CONTAINS` | String contains | `{ email: { $CONTAINS: '@gmail.com' } }` |
| `$STARTS_WITH` | String starts with | `{ name: { $STARTS_WITH: 'Dr.' } }` |
| `$ENDS_WITH` | String ends with | `{ email: { $ENDS_WITH: '.edu' } }` |
| `$EXISTS` | Property exists | `{ verified: { $EXISTS: true } }` |

### Complex Filters

Combine multiple conditions:

```ts
const result = await ductape.graph.findNodes({
  labels: ['Product'],
  where: {
    $AND: {
      price: { $GTE: 50, $LTE: 500 },
      inStock: true,
      category: { $IN: ['electronics', 'gadgets'] },
    },
  },
  limit: 20,
});
```

### OR Conditions

```ts
const result = await ductape.graph.findNodes({
  labels: ['Person'],
  where: {
    $OR: {
      role: 'admin',
      isSuper user: true,
      department: 'Security',
    },
  },
});
```

### Nested AND/OR

```ts
const result = await ductape.graph.findNodes({
  labels: ['Order'],
  where: {
    $AND: {
      total: { $GT: 100 },
      status: { $IN: ['pending', 'processing'] },
      $OR: {
        priority: 'high',
        expressShipping: true,
      },
    },
  },
});
```

### Pattern Matching

```ts
// Find users with Gmail addresses
const result = await ductape.graph.findNodes({
  labels: ['User'],
  where: {
    email: { $ENDS_WITH: '@gmail.com' },
    name: { $STARTS_WITH: 'John' },
  },
});
```

## Finding Nodes by ID

### Single Node Lookup

```ts
const node = await ductape.graph.findNodeById('node-id-123');

if (node) {
  console.log('Found:', node.properties.name);
} else {
  console.log('Node not found');
}
```

### With Type Safety

```ts
interface PersonProperties {
  name: string;
  email: string;
  age: number;
}

const person = await ductape.graph.findNodeById<PersonProperties>('node-id-123');

if (person) {
  console.log(`${person.properties.name} is ${person.properties.age} years old`);
}
```

## Updating Nodes

### Update Properties

Replace or add properties to an existing node:

```ts
const result = await ductape.graph.updateNode({
  id: 'node-id-123',
  properties: {
    age: 29,
    lastLogin: new Date(),
    status: 'active',
  },
});

console.log('Updated node:', result.node.properties);
```

### Partial Updates

Only specified properties are updated; others remain unchanged:

```ts
// Original node: { name: 'Alice', email: 'alice@example.com', age: 28 }

await ductape.graph.updateNode({
  id: nodeId,
  properties: { age: 29 },
});

// Result: { name: 'Alice', email: 'alice@example.com', age: 29 }
```

### Update by Filter

Update multiple nodes matching criteria:

```ts
const result = await ductape.graph.updateNode({
  labels: ['User'],
  where: { lastLogin: { $LT: new Date('2024-01-01') } },
  properties: { status: 'inactive' },
});

console.log('Updated nodes:', result.updatedCount);
```

### Increment Values

```ts
// Increment a counter
await ductape.graph.updateNode({
  id: nodeId,
  properties: {
    loginCount: { $INCREMENT: 1 },
    reputation: { $INCREMENT: 10 },
  },
});
```

## Deleting Nodes

### Delete by ID

```ts
const result = await ductape.graph.deleteNode({
  id: 'node-id-123',
  detach: true, // Also delete connected relationships
});

console.log('Deleted:', result.deleted);
```

### Delete by Filter

Delete multiple nodes matching criteria:

```ts
const result = await ductape.graph.deleteNode({
  labels: ['TempUser'],
  where: {
    createdAt: { $LT: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }, // Older than 30 days
  },
  detach: true,
});

console.log('Deleted nodes:', result.deletedCount);
```

### Detach vs Non-Detach

**Detach Delete** (recommended):
```ts
// Deletes the node AND all its relationships
await ductape.graph.deleteNode({
  id: nodeId,
  detach: true,
});
```

**Non-Detach Delete**:
```ts
// Fails if node has relationships (ensures referential integrity)
await ductape.graph.deleteNode({
  id: nodeId,
  detach: false,
});
```

## Merge Operations

Merge creates a node if it doesn't exist, or updates it if it does (upsert operation).

### Basic Merge

```ts
const result = await ductape.graph.mergeNode({
  labels: ['Person'],
  matchProperties: { email: 'alice@example.com' },
  onCreate: {
    name: 'Alice Johnson',
    email: 'alice@example.com',
    createdAt: new Date(),
  },
  onMatch: {
    lastSeen: new Date(),
  },
});

if (result.created) {
  console.log('Created new node:', result.node.id);
} else {
  console.log('Updated existing node:', result.node.id);
}
```

### Match on Multiple Properties

```ts
const result = await ductape.graph.mergeNode({
  labels: ['Product'],
  matchProperties: {
    sku: 'LPT-2024-001',
    vendor: 'TechCorp',
  },
  onCreate: {
    name: 'Laptop Pro',
    sku: 'LPT-2024-001',
    vendor: 'TechCorp',
    price: 1299.99,
    stock: 100,
    createdAt: new Date(),
  },
  onMatch: {
    stock: { $INCREMENT: 50 },
    lastRestocked: new Date(),
  },
});
```

### Conditional Properties

```ts
const result = await ductape.graph.mergeNode({
  labels: ['User'],
  matchProperties: { email: 'bob@example.com' },
  onCreate: {
    name: 'Bob Smith',
    email: 'bob@example.com',
    role: 'user',
    createdAt: new Date(),
    loginCount: 1,
  },
  onMatch: {
    loginCount: { $INCREMENT: 1 },
    lastLogin: new Date(),
  },
});
```

## Batch Operations

### Create Multiple Nodes

```ts
const people = [
  { name: 'Alice', email: 'alice@example.com' },
  { name: 'Bob', email: 'bob@example.com' },
  { name: 'Charlie', email: 'charlie@example.com' },
];

for (const person of people) {
  await ductape.graph.createNode({
    labels: ['Person'],
    properties: person,
  });
}
```

### Efficient Batch with Transaction

```ts
await ductape.graph.executeTransaction(async (tx) => {
  for (const person of people) {
    await ductape.graph.createNode({
      labels: ['Person'],
      properties: person,
    }, tx);
  }
});
```

## Node Structure

### Node Object

```ts
interface INode<T = NodeProperties> {
  id: string | number;           // Database-specific ID
  labels: string[];               // Node labels/types
  properties: T;                  // Node properties
  elementId?: string;             // Neo4j 5.x element ID
}
```

### Result Types

**Create Result:**
```ts
interface ICreateNodeResult<T> {
  node: INode<T>;                // The created node
  created: boolean;               // Always true for create
}
```

**Find Result:**
```ts
interface IFindNodesResult<T> {
  nodes: INode<T>[];             // Array of matching nodes
  count: number;                  // Total count (for pagination)
}
```

**Update Result:**
```ts
interface IUpdateNodeResult<T> {
  node?: INode<T>;               // Updated node (if single update)
  nodes?: INode<T>[];            // Updated nodes (if batch update)
  updatedCount: number;           // Number of nodes updated
}
```

**Delete Result:**
```ts
interface IDeleteNodeResult {
  deleted: boolean;               // Whether deletion succeeded
  deletedCount: number;           // Number of nodes deleted
}
```

**Merge Result:**
```ts
interface IMergeNodeResult<T> {
  node: INode<T>;                // The resulting node
  created: boolean;               // true if created, false if matched
}
```

## Use Case Examples

### User Registration

```ts
async function registerUser(email: string, name: string, password: string) {
  // Check if user exists
  const existing = await ductape.graph.findNodes({
    labels: ['User'],
    where: { email },
    limit: 1,
  });

  if (existing.nodes.length > 0) {
    throw new Error('User already exists');
  }

  // Create new user
  const user = await ductape.graph.createNode({
    labels: ['User'],
    properties: {
      email,
      name,
      passwordHash: hashPassword(password),
      createdAt: new Date(),
      status: 'active',
      emailVerified: false,
    },
  });

  return user.node;
}
```

### Product Catalog

```ts
async function addOrUpdateProduct(sku: string, productData: any) {
  const result = await ductape.graph.mergeNode({
    labels: ['Product'],
    matchProperties: { sku },
    onCreate: {
      ...productData,
      sku,
      createdAt: new Date(),
      views: 0,
    },
    onMatch: {
      ...productData,
      updatedAt: new Date(),
    },
  });

  return result;
}
```

### Activity Tracking

```ts
async function trackUserActivity(userId: string) {
  await ductape.graph.updateNode({
    id: userId,
    properties: {
      lastActive: new Date(),
      activityCount: { $INCREMENT: 1 },
    },
  });
}
```

### Soft Delete Pattern

```ts
async function softDeleteUser(userId: string) {
  await ductape.graph.updateNode({
    id: userId,
    properties: {
      status: 'deleted',
      deletedAt: new Date(),
    },
  });
}

async function getActiveUsers() {
  return ductape.graph.findNodes({
    labels: ['User'],
    where: {
      status: { $NE: 'deleted' },
    },
  });
}
```

## Best Practices

### 1. Use Meaningful Labels

```ts
// Good - descriptive and hierarchical
await ductape.graph.createNode({
  labels: ['Person', 'Employee', 'Engineer'],
  properties: { name: 'Alice' },
});

// Avoid - too generic
await ductape.graph.createNode({
  labels: ['Node'],
  properties: { name: 'Alice' },
});
```

### 2. Index Frequently Queried Properties

```ts
// Create an index for faster lookups
await ductape.graph.createNodeIndex({
  name: 'idx_user_email',
  label: 'User',
  properties: ['email'],
  unique: true,
});
```

### 3. Use Merge for Idempotent Operations

```ts
// Merge ensures the operation can be retried safely
const result = await ductape.graph.mergeNode({
  labels: ['User'],
  matchProperties: { email },
  onCreate: userData,
  onMatch: { lastSeen: new Date() },
});
```

### 4. Always Use Detach When Deleting

```ts
// Prevents orphaned relationships
await ductape.graph.deleteNode({
  id: nodeId,
  detach: true,
});
```

### 5. Validate Properties Before Creation

```ts
function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function createUser(data: any) {
  if (!validateEmail(data.email)) {
    throw new Error('Invalid email');
  }

  return ductape.graph.createNode({
    labels: ['User'],
    properties: data,
  });
}
```

## Next Steps

- [Manage Relationships](./relationships) - Connect nodes with relationships
- [Traverse Graphs](./traversals) - Find paths and explore neighborhoods
- [Advanced Querying](./querying) - Complex patterns and full-text search
- [Use Transactions](./transactions) - Ensure data consistency

## See Also

* [Graph Overview](./overview) - Full API reference
* [Best Practices](./best-practices) - Performance optimization
