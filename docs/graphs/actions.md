---
sidebar_position: 9
---

# Graph Actions

Create reusable graph query templates that can be executed with different input parameters. Graph actions allow you to define graph operations once and reuse them across your application with variable interpolation.

## Quick Example

```ts
// Create a graph action template
await ductape.graph.action.create({
  name: 'Find User Friends',
  tag: 'social-graph:find-user-friends',
  operation: GraphActionTypes.FIND_RELATIONSHIPS,
  description: 'Get all friends of a user with pagination',
  template: {
    startNodeId: '{{userId}}',
    type: 'FRIENDS_WITH',
    direction: 'OUTGOING',
    limit: '{{limit}}',
    skip: '{{offset}}',
  },
});

// Execute the action with different inputs
const friends = await ductape.graph.execute({
  product: 'my-product',
  env: 'prd',
  graph: 'social-graph',
  action: 'find-user-friends',
  input: {
    userId: 'user-123',
    limit: 20,
    offset: 0,
  },
});
```

## Why Use Graph Actions?

**Benefits:**
- **Reusability** - Define graph operations once, use everywhere
- **Type Safety** - Template validation at creation time
- **Variable Interpolation** - Dynamic queries with `{{placeholder}}` syntax
- **Maintainability** - Update logic in one place
- **Consistency** - Standardize graph access patterns
- **Testing** - Easy to test query templates

## Action Types

### Node Operations

#### CREATE_NODE - Create Nodes

```ts
await ductape.graph.action.create({
  name: 'Create User Node',
  tag: 'social-graph:create-user',
  operation: GraphActionTypes.CREATE_NODE,
  template: {
    labels: ['User', 'Person'],
    properties: {
      name: '{{name}}',
      email: '{{email}}',
      age: '{{age}}',
      status: 'active',
      createdAt: '{{createdAt}}',
    },
  },
});

// Execute
const user = await ductape.graph.execute({
  product: 'my-product',
  env: 'prd',
  graph: 'social-graph',
  action: 'create-user',
  input: {
    name: 'Alice Johnson',
    email: 'alice@example.com',
    age: 28,
    createdAt: new Date().toISOString(),
  },
});
```

#### FIND_NODES - Query Nodes

```ts
await ductape.graph.action.create({
  name: 'Find Users by City',
  tag: 'social-graph:find-users-by-city',
  operation: GraphActionTypes.FIND_NODES,
  template: {
    labels: ['User'],
    where: {
      city: '{{city}}',
      age: { $GTE: '{{minAge}}' },
      status: 'active',
    },
    limit: '{{limit}}',
    skip: '{{offset}}',
  },
});

// Execute
const users = await ductape.graph.execute({
  product: 'my-product',
  env: 'prd',
  graph: 'social-graph',
  action: 'find-users-by-city',
  input: {
    city: 'New York',
    minAge: 18,
    limit: 50,
    offset: 0,
  },
});
```

#### FIND_NODE_BY_ID - Get Single Node

```ts
await ductape.graph.action.create({
  name: 'Get User by ID',
  tag: 'social-graph:get-user-by-id',
  operation: GraphActionTypes.FIND_NODE_BY_ID,
  template: {
    id: '{{userId}}',
  },
});

// Execute
const user = await ductape.graph.execute({
  product: 'my-product',
  env: 'prd',
  graph: 'social-graph',
  action: 'get-user-by-id',
  input: {
    userId: 'user-123',
  },
});
```

#### UPDATE_NODE - Modify Nodes

```ts
await ductape.graph.action.create({
  name: 'Update User Profile',
  tag: 'social-graph:update-user-profile',
  operation: GraphActionTypes.UPDATE_NODE,
  template: {
    id: '{{userId}}',
    properties: {
      name: '{{name}}',
      bio: '{{bio}}',
      avatar: '{{avatar}}',
      updatedAt: '{{updatedAt}}',
    },
  },
});

// Execute
await ductape.graph.execute({
  product: 'my-product',
  env: 'prd',
  graph: 'social-graph',
  action: 'update-user-profile',
  input: {
    userId: 'user-123',
    name: 'Alice Smith',
    bio: 'Software Engineer',
    avatar: 'https://...',
    updatedAt: new Date().toISOString(),
  },
});
```

#### DELETE_NODE - Remove Nodes

```ts
await ductape.graph.action.create({
  name: 'Delete User',
  tag: 'social-graph:delete-user',
  operation: GraphActionTypes.DELETE_NODE,
  template: {
    id: '{{userId}}',
    detach: true, // Also delete relationships
  },
});

// Execute
await ductape.graph.execute({
  product: 'my-product',
  env: 'prd',
  graph: 'social-graph',
  action: 'delete-user',
  input: {
    userId: 'user-123',
  },
});
```

#### MERGE_NODE - Upsert Nodes

```ts
await ductape.graph.action.create({
  name: 'Merge User',
  tag: 'social-graph:merge-user',
  operation: GraphActionTypes.MERGE_NODE,
  template: {
    labels: ['User'],
    matchProperties: {
      email: '{{email}}',
    },
    onCreate: {
      name: '{{name}}',
      email: '{{email}}',
      createdAt: '{{createdAt}}',
    },
    onMatch: {
      lastSeen: '{{lastSeen}}',
    },
  },
});

// Execute
await ductape.graph.execute({
  product: 'my-product',
  env: 'prd',
  graph: 'social-graph',
  action: 'merge-user',
  input: {
    email: 'alice@example.com',
    name: 'Alice Johnson',
    createdAt: new Date().toISOString(),
    lastSeen: new Date().toISOString(),
  },
});
```

### Relationship Operations

#### CREATE_RELATIONSHIP - Create Connections

```ts
await ductape.graph.action.create({
  name: 'Create Friendship',
  tag: 'social-graph:create-friendship',
  operation: GraphActionTypes.CREATE_RELATIONSHIP,
  template: {
    type: 'FRIENDS_WITH',
    startNodeId: '{{userId1}}',
    endNodeId: '{{userId2}}',
    properties: {
      since: '{{since}}',
      closeness: '{{closeness}}',
    },
  },
});

// Execute
await ductape.graph.execute({
  product: 'my-product',
  env: 'prd',
  graph: 'social-graph',
  action: 'create-friendship',
  input: {
    userId1: 'user-123',
    userId2: 'user-456',
    since: '2024-01-15',
    closeness: 'high',
  },
});
```

#### FIND_RELATIONSHIPS - Query Connections

```ts
await ductape.graph.action.create({
  name: 'Get User Followers',
  tag: 'social-graph:get-user-followers',
  operation: GraphActionTypes.FIND_RELATIONSHIPS,
  template: {
    endNodeId: '{{userId}}',
    type: 'FOLLOWS',
    direction: 'INCOMING',
    where: {
      active: true,
    },
    limit: '{{limit}}',
  },
});

// Execute
const followers = await ductape.graph.execute({
  product: 'my-product',
  env: 'prd',
  graph: 'social-graph',
  action: 'get-user-followers',
  input: {
    userId: 'user-123',
    limit: 100,
  },
});
```

#### UPDATE_RELATIONSHIP - Modify Connections

```ts
await ductape.graph.action.create({
  name: 'Update Friendship',
  tag: 'social-graph:update-friendship',
  operation: GraphActionTypes.UPDATE_RELATIONSHIP,
  template: {
    id: '{{relationshipId}}',
    properties: {
      closeness: '{{closeness}}',
      lastInteraction: '{{lastInteraction}}',
    },
  },
});
```

#### DELETE_RELATIONSHIP - Remove Connections

```ts
await ductape.graph.action.create({
  name: 'Remove Friendship',
  tag: 'social-graph:remove-friendship',
  operation: GraphActionTypes.DELETE_RELATIONSHIP,
  template: {
    id: '{{relationshipId}}',
  },
});
```

### Traversal Operations

#### TRAVERSE - Explore Graph

```ts
await ductape.graph.action.create({
  name: 'Get User Network',
  tag: 'social-graph:get-user-network',
  operation: GraphActionTypes.TRAVERSE,
  template: {
    startNodeId: '{{userId}}',
    direction: 'OUTGOING',
    relationshipTypes: ['FRIENDS_WITH', 'WORKS_WITH'],
    maxDepth: '{{maxDepth}}',
    nodeFilter: {
      labels: ['User'],
      where: {
        status: 'active',
      },
    },
  },
});

// Execute
const network = await ductape.graph.execute({
  product: 'my-product',
  env: 'prd',
  graph: 'social-graph',
  action: 'get-user-network',
  input: {
    userId: 'user-123',
    maxDepth: 2,
  },
});
```

#### SHORTEST_PATH - Find Paths

```ts
await ductape.graph.action.create({
  name: 'Find Connection Path',
  tag: 'social-graph:find-connection-path',
  operation: GraphActionTypes.SHORTEST_PATH,
  template: {
    startNodeId: '{{userId1}}',
    endNodeId: '{{userId2}}',
    relationshipTypes: ['FRIENDS_WITH', 'KNOWS'],
    maxDepth: 6,
  },
});

// Execute
const path = await ductape.graph.execute({
  product: 'my-product',
  env: 'prd',
  graph: 'social-graph',
  action: 'find-connection-path',
  input: {
    userId1: 'user-123',
    userId2: 'user-789',
  },
});

if (path.path) {
  console.log(`${path.path.length} degrees of separation`);
}
```

## Variable Interpolation

### Basic Placeholders

Use `{{variableName}}` syntax:

```ts
template: {
  labels: ['User'],
  properties: {
    name: '{{name}}',
    email: '{{email}}',
    age: '{{age}}',
  },
}
```

### Nested Placeholders

Work in nested structures:

```ts
template: {
  where: {
    $AND: {
      city: '{{city}}',
      age: { $GTE: '{{minAge}}', $LTE: '{{maxAge}}' },
      status: { $IN: ['{{status1}}', '{{status2}}'] },
    },
  },
}
```

### Filter Placeholders

Use in complex filters:

```ts
template: {
  startNodeId: '{{userId}}',
  relationshipTypes: ['{{relType1}}', '{{relType2}}'],
  nodeFilter: {
    where: {
      city: '{{city}}',
      age: { $GT: '{{minAge}}' },
    },
  },
}
```

## Managing Actions

### Create Action

```ts
await ductape.graph.action.create({
  name: 'Action Name',
  tag: 'graph-tag:action-tag', // Format: graph:action
  operation: GraphActionTypes.FIND_NODES,
  description: 'Optional description',
  template: {
    // Your operation template
  },
});
```

**Required Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Display name for the action |
| `tag` | string | Unique identifier (format: `graph:action`) |
| `operation` | GraphActionTypes | Action operation (FIND_NODES, etc.) |
| `template` | object | Operation template with placeholders |

**Optional Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `description` | string | Action description |
| `filterTemplate` | object | Additional filter criteria |

### Update Action

```ts
await ductape.graph.action.update({
  tag: 'social-graph:find-users',
  template: {
    // Updated template
    labels: ['User'],
    where: {
      status: '{{status}}',
    },
  },
});
```

### Fetch Action

```ts
const action = await ductape.graph.action.fetch('social-graph:find-users');
console.log('Action:', action);
```

### List Actions for Graph

```ts
const actions = await ductape.graph.action.fetchAll('social-graph');
console.log(`Found ${actions.length} actions`);

actions.forEach(action => {
  console.log(`${action.tag}: ${action.name} (${action.type})`);
});
```

## Execute Actions

### Basic Execution

```ts
const result = await ductape.graph.execute({
  product: 'my-product',
  env: 'prd',
  graph: 'social-graph',
  action: 'find-users',
  input: {
    city: 'New York',
    limit: 50,
  },
});
```

### With Type Safety

```ts
interface User {
  id: string;
  name: string;
  email: string;
  city: string;
}

const users = await ductape.graph.execute<User[]>({
  product: 'my-product',
  env: 'prd',
  graph: 'social-graph',
  action: 'find-users',
  input: { city: 'New York' },
});

// TypeScript knows users is User[]
users.forEach(user => {
  console.log(`${user.name} - ${user.city}`);
});
```

### Error Handling

```ts
try {
  const users = await ductape.graph.execute({
    product: 'my-product',
    env: 'prd',
    graph: 'social-graph',
    action: 'find-users',
    input: { city: 'New York' },
  });
} catch (error) {
  if (error.message.includes('not found')) {
    console.error('Action not found');
  } else if (error.message.includes('validation')) {
    console.error('Invalid input parameters');
  } else {
    console.error('Execution failed:', error.message);
  }
}
```

## Common Patterns

### Social Network - Friend Suggestions

```ts
await ductape.graph.action.create({
  name: 'Get Friend Suggestions',
  tag: 'social-graph:friend-suggestions',
  operation: GraphActionTypes.TRAVERSE,
  description: 'Find friends of friends who are not already friends',
  template: {
    startNodeId: '{{userId}}',
    relationshipTypes: ['FRIENDS_WITH'],
    maxDepth: 2,
    nodeFilter: {
      labels: ['User'],
      where: {
        status: 'active',
      },
    },
  },
});

// Execute and filter
const suggestions = await ductape.graph.execute({
  product: 'my-product',
  env: 'prd',
  graph: 'social-graph',
  action: 'friend-suggestions',
  input: { userId: 'user-123' },
});
```

### E-Commerce - Product Recommendations

```ts
await ductape.graph.action.create({
  name: 'Get Product Recommendations',
  tag: 'commerce-graph:product-recommendations',
  operation: GraphActionTypes.TRAVERSE,
  template: {
    startNodeId: '{{userId}}',
    direction: 'OUTGOING',
    relationshipTypes: ['PURCHASED', 'VIEWED'],
    maxDepth: 3,
    nodeFilter: {
      labels: ['Product'],
      where: {
        in_stock: true,
        category: '{{category}}',
      },
    },
    limit: '{{limit}}',
  },
});
```

### Knowledge Graph - Related Articles

```ts
await ductape.graph.action.create({
  name: 'Find Related Articles',
  tag: 'knowledge-graph:related-articles',
  operation: GraphActionTypes.TRAVERSE,
  template: {
    startNodeId: '{{articleId}}',
    direction: 'BOTH',
    relationshipTypes: ['HAS_TOPIC', 'CITES', 'WRITTEN_BY'],
    maxDepth: 2,
    nodeFilter: {
      labels: ['Article'],
      where: {
        status: 'published',
      },
    },
    limit: '{{limit}}',
  },
});
```

### Organization - Reporting Chain

```ts
await ductape.graph.action.create({
  name: 'Get Reporting Chain',
  tag: 'org-graph:reporting-chain',
  operation: GraphActionTypes.TRAVERSE,
  template: {
    startNodeId: '{{employeeId}}',
    direction: 'OUTGOING',
    relationshipTypes: ['REPORTS_TO'],
    maxDepth: 10,
  },
});
```

### User Activity - Recent Interactions

```ts
await ductape.graph.action.create({
  name: 'Get Recent Interactions',
  tag: 'social-graph:recent-interactions',
  operation: GraphActionTypes.FIND_RELATIONSHIPS,
  template: {
    startNodeId: '{{userId}}',
    type: ['LIKED', 'COMMENTED', 'SHARED'],
    direction: 'OUTGOING',
    where: {
      created_at: { $GTE: '{{sinceDate}}' },
    },
    limit: '{{limit}}',
  },
});
```

## Best Practices

### 1. Use Descriptive Names

```ts
// ✅ Good - clear purpose
await ductape.graph.action.create({
  name: 'Find Mutual Friends Between Users',
  tag: 'social-graph:find-mutual-friends',
  // ...
});

// ❌ Avoid - vague
await ductape.graph.action.create({
  name: 'Find Friends',
  tag: 'social-graph:friends',
  // ...
});
```

### 2. Add Descriptions

```ts
await ductape.graph.action.create({
  name: 'Get User Influence Score',
  tag: 'social-graph:user-influence',
  description: 'Calculate influence score based on follower count, engagement, and network reach',
  // ...
});
```

### 3. Limit Traversal Depth

```ts
// ✅ Good - reasonable depth
template: {
  startNodeId: '{{userId}}',
  maxDepth: 3, // Controlled exploration
  limit: '{{limit}}',
}

// ❌ Dangerous - unbounded
template: {
  startNodeId: '{{userId}}',
  maxDepth: 10, // Could explore millions
  // No limit!
}
```

### 4. Use Specific Relationship Types

```ts
// ✅ Good - specific types
template: {
  relationshipTypes: ['FRIENDS_WITH', 'WORKS_WITH'],
}

// ❌ Slower - all relationships
template: {
  // No relationshipTypes specified
}
```

### 5. Filter Early

```ts
// ✅ Good - filter in query
template: {
  startNodeId: '{{userId}}',
  relationshipTypes: ['FRIENDS_WITH'],
  nodeFilter: {
    where: {
      status: 'active',
      age: { $GTE: 18 },
    },
  },
}

// ❌ Bad - fetch all, filter later
template: {
  startNodeId: '{{userId}}',
  relationshipTypes: ['FRIENDS_WITH'],
  // No filtering - filter in code
}
```

### 6. Keep Actions Focused

```ts
// ✅ Good - single purpose
await ductape.graph.action.create({
  name: 'Get User Friends',
  operation: GraphActionTypes.FIND_RELATIONSHIPS,
  // ... only fetches friendships
});

// ❌ Avoid - too complex
await ductape.graph.action.create({
  name: 'Get Complete User Social Graph',
  // ... tries to fetch everything
});
```

### 7. Use Consistent Naming

```ts
// ✅ Good - consistent pattern
'social-graph:get-user-friends'
'social-graph:create-friendship'
'social-graph:update-friendship'
'social-graph:delete-friendship'

// ❌ Avoid - inconsistent
'social-graph:getUserFriends'
'social-graph:friendship-create'
'social-graph:UpdateFriend'
'social-graph:del_friend'
```

### 8. Test Actions

```ts
describe('find-user-friends', () => {
  it('should fetch user friends', async () => {
    const friends = await ductape.graph.execute({
      product: 'test-product',
      env: 'test',
      graph: 'test-graph',
      action: 'find-user-friends',
      input: { userId: 'test-user-1', limit: 10 },
    });

    expect(friends).toBeDefined();
    expect(friends.length).toBeLessThanOrEqual(10);
  });

  it('should respect direction', async () => {
    const outgoing = await ductape.graph.execute({
      product: 'test-product',
      env: 'test',
      graph: 'test-graph',
      action: 'find-user-friends',
      input: { userId: 'test-user-1', direction: 'OUTGOING' },
    });

    expect(outgoing.every(f => f.startNodeId === 'test-user-1')).toBe(true);
  });
});
```

## Performance Tips

### 1. Use Indexes

Ensure indexed properties are used in filters:

```ts
// Make sure 'status' is indexed on User label
template: {
  labels: ['User'],
  where: {
    status: '{{status}}', // Uses index
  },
}
```

### 2. Limit Result Sets

Always include limits:

```ts
template: {
  startNodeId: '{{userId}}',
  relationshipTypes: ['FRIENDS_WITH'],
  limit: '{{limit}}', // Prevent unbounded results
}
```

### 3. Use Direction

Specify direction to reduce search space:

```ts
template: {
  startNodeId: '{{userId}}',
  direction: 'OUTGOING', // Only follow outgoing relationships
  relationshipTypes: ['FOLLOWS'],
}
```

### 4. Filter at Query Level

Filter in the query, not in code:

```ts
// ✅ Good - filtered in query
template: {
  nodeFilter: {
    where: { status: 'active' },
  },
}

// ❌ Bad - fetch all, filter in code
// (Requires transferring and processing more data)
```

## Next Steps

- [Traversals & Pathfinding](./traversals) - Graph exploration patterns
- [Nodes](./nodes) - Working with graph nodes
- [Relationships](./relationships) - Managing connections
- [Best Practices](./best-practices) - Optimization patterns

## See Also

* [Graph Overview](./overview) - Full API reference
* [Indexes & Constraints](./indexing) - Performance optimization
* [Transactions](./transactions) - Data consistency
