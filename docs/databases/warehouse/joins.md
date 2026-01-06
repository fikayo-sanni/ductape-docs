---
sidebar_position: 2
---

# Cross-Database Joins

The Warehouse enables you to join data across different data sources - databases, graphs, and vector stores - using a unified query interface.

## Overview

Cross-database joins allow you to combine data from:
- PostgreSQL + MongoDB
- MySQL + Neo4j
- Any database + Any vector store
- Graph databases + Traditional databases

The Warehouse handles the complexity of fetching data from different sources and joining them in memory using optimized algorithms.

## Basic Join Syntax

```ts
const result = await ductape.warehouse.query({
  operation: 'select',
  from: {
    type: 'database',
    tag: 'primary-db',
    entity: 'users',
    alias: 'u'
  },
  fields: ['u.name', 'o.total', 'o.status'],
  join: [{
    type: 'left',
    source: {
      type: 'database',
      tag: 'orders-db',
      entity: 'orders',
      alias: 'o'
    },
    on: { left: 'u.id', right: 'o.userId' }
  }],
  limit: 100
});
```

## Join Types

### Inner Join

Returns only records that have matching values in both sources:

```ts
join: [{
  type: 'inner',
  source: { type: 'database', tag: 'orders-db', entity: 'orders', alias: 'o' },
  on: { left: 'u.id', right: 'o.userId' }
}]
```

### Left Join

Returns all records from the left source, and matched records from the right:

```ts
join: [{
  type: 'left',
  source: { type: 'database', tag: 'orders-db', entity: 'orders', alias: 'o' },
  on: { left: 'u.id', right: 'o.userId' }
}]
```

### Right Join

Returns all records from the right source, and matched records from the left:

```ts
join: [{
  type: 'right',
  source: { type: 'database', tag: 'orders-db', entity: 'orders', alias: 'o' },
  on: { left: 'u.id', right: 'o.userId' }
}]
```

## Database-to-Database Joins

Join data between any two databases, even if they're different types:

```ts
// PostgreSQL users joined with MongoDB orders
const result = await ductape.warehouse.query({
  operation: 'select',
  from: {
    type: 'database',
    tag: 'users-postgres',
    entity: 'users',
    alias: 'u'
  },
  fields: ['u.id', 'u.name', 'u.email', 'o.orderId', 'o.total', 'o.createdAt'],
  join: [{
    type: 'left',
    source: {
      type: 'database',
      tag: 'orders-mongo',
      entity: 'orders',
      alias: 'o'
    },
    on: { left: 'u.id', right: 'o.userId' }
  }],
  where: { 'u.status': { $eq: 'active' } },
  orderBy: [{ field: 'o.createdAt', order: 'DESC' }],
  limit: 50
});
```

## Database-to-Graph Joins

Join relational data with graph traversals:

```ts
// Get users and their social connections from Neo4j
const result = await ductape.warehouse.query({
  operation: 'select',
  from: {
    type: 'database',
    tag: 'users-postgres',
    entity: 'users',
    alias: 'u'
  },
  fields: [
    'u.id',
    'u.name',
    'friends.name as friendName',
    'friends.connectionDate'
  ],
  join: [{
    type: 'left',
    source: {
      type: 'graph',
      tag: 'social-neo4j',
      entity: 'Person',
      alias: 'friends'
    },
    graph: {
      relationship: 'FRIENDS_WITH',
      direction: 'both',
      minDepth: 1,
      maxDepth: 1
    },
    on: { left: 'u.id', right: 'friends.userId' }
  }],
  where: { 'u.status': { $eq: 'active' } }
});
```

### Graph Join Configuration

| Option | Type | Description |
|--------|------|-------------|
| `relationship` | string | The relationship type to traverse |
| `direction` | 'outgoing' \| 'incoming' \| 'both' | Direction of the relationship |
| `minDepth` | number | Minimum traversal depth (default: 1) |
| `maxDepth` | number | Maximum traversal depth (default: 1) |

## Multiple Joins

Chain multiple joins to combine data from several sources:

```ts
const result = await ductape.warehouse.query({
  operation: 'select',
  from: {
    type: 'database',
    tag: 'users-postgres',
    entity: 'users',
    alias: 'u'
  },
  fields: [
    'u.name',
    'u.email',
    'o.total',
    'p.name as productName',
    'r.rating'
  ],
  join: [
    // First join: users -> orders
    {
      type: 'left',
      source: {
        type: 'database',
        tag: 'orders-mongo',
        entity: 'orders',
        alias: 'o'
      },
      on: { left: 'u.id', right: 'o.userId' }
    },
    // Second join: orders -> products
    {
      type: 'inner',
      source: {
        type: 'database',
        tag: 'products-postgres',
        entity: 'products',
        alias: 'p'
      },
      on: { left: 'o.productId', right: 'p.id' }
    },
    // Third join: products -> reviews
    {
      type: 'left',
      source: {
        type: 'database',
        tag: 'reviews-mongo',
        entity: 'reviews',
        alias: 'r'
      },
      on: { left: 'p.id', right: 'r.productId' }
    }
  ],
  where: { 'o.status': { $eq: 'completed' } },
  limit: 100
});
```

## Filtering Joined Data

Apply filters to specific sources or across all joined data:

```ts
const result = await ductape.warehouse.query({
  operation: 'select',
  from: {
    type: 'database',
    tag: 'users-postgres',
    entity: 'users',
    alias: 'u'
  },
  fields: ['u.name', 'o.total'],
  join: [{
    type: 'inner',
    source: {
      type: 'database',
      tag: 'orders-mongo',
      entity: 'orders',
      alias: 'o'
    },
    on: { left: 'u.id', right: 'o.userId' },
    // Filter on the joined source
    where: { 'o.status': { $eq: 'completed' } }
  }],
  // Filter on the combined result
  where: {
    $and: [
      { 'u.status': { $eq: 'active' } },
      { 'o.total': { $gte: 100 } }
    ]
  }
});
```

## Join Strategies

The Warehouse automatically selects the optimal join strategy based on data size:

| Strategy | Best For | Description |
|----------|----------|-------------|
| **Hash Join** | Large datasets | Builds hash table for faster lookups |
| **Nested Loop** | Small right dataset | Simple iteration, low memory |
| **Sort-Merge** | Pre-sorted data | Efficient for ordered data |

The strategy is selected automatically, but you can observe which was used in the result metadata:

```ts
const result = await ductape.warehouse.query({...});
console.log(result.metadata.sourceStats);
// Shows execution stats including join strategy used
```

## Performance Tips

1. **Use aliases** - Always provide aliases for cleaner field references
2. **Filter early** - Apply where clauses on individual sources when possible
3. **Limit results** - Use limit/offset to paginate large result sets
4. **Select specific fields** - Don't use `*` for large joins
5. **Consider cardinality** - Put the smaller dataset on the right side when possible

## Next Steps

- [Semantic Joins](./semantic-joins.md) - Learn about AI-powered vector similarity joins
- [Transactions](./transactions.md) - Execute distributed transactions
- [Query Reference](./query-reference.md) - Complete syntax documentation
