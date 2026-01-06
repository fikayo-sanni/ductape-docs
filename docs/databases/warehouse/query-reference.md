---
sidebar_position: 5
---

# Query Reference

Complete reference for the Warehouse query language syntax.

## Query Structure

```ts
interface IWarehouseQuery {
  operation: 'select' | 'insert' | 'update' | 'delete' | 'upsert';
  from: IDataSource;
  fields?: string[];
  join?: IJoinClause[];
  where?: IWhereClause;
  orderBy?: IOrderBy[];
  groupBy?: string[];
  having?: IWhereClause;
  limit?: number;
  offset?: number;
  data?: Record<string, any> | Record<string, any>[];
  returning?: boolean;
}
```

## Data Source

Specifies which database, graph, or vector store to query:

```ts
interface IDataSource {
  type: 'database' | 'graph' | 'vector';
  tag: string;
  entity: string;
  alias?: string;
  env?: string;
  product?: string;
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `type` | string | Yes | Source type: `database`, `graph`, or `vector` |
| `tag` | string | Yes | Your data source tag |
| `entity` | string | Yes | Table, node label, or collection name |
| `alias` | string | No | Alias for field references |
| `env` | string | No | Environment (defaults to SDK context) |
| `product` | string | No | Product (defaults to SDK context) |

## Operations

### Select

Read data from one or more sources:

```ts
const result = await ductape.warehouse.query({
  operation: 'select',
  from: { type: 'database', tag: 'users-db', entity: 'users', alias: 'u' },
  fields: ['u.id', 'u.name', 'u.email'],
  where: { 'u.status': { $eq: 'active' } },
  orderBy: [{ field: 'u.createdAt', order: 'DESC' }],
  limit: 100,
  offset: 0
});
```

### Insert

Add new records:

```ts
// Single record
await ductape.warehouse.query({
  operation: 'insert',
  from: { type: 'database', tag: 'users-db', entity: 'users' },
  data: { name: 'John', email: 'john@example.com' },
  returning: true
});

// Multiple records
await ductape.warehouse.query({
  operation: 'insert',
  from: { type: 'database', tag: 'users-db', entity: 'users' },
  data: [
    { name: 'John', email: 'john@example.com' },
    { name: 'Jane', email: 'jane@example.com' }
  ]
});
```

### Update

Modify existing records:

```ts
await ductape.warehouse.query({
  operation: 'update',
  from: { type: 'database', tag: 'users-db', entity: 'users' },
  data: { status: 'inactive', updatedAt: new Date() },
  where: { id: { $eq: 123 } },
  returning: true
});
```

### Delete

Remove records:

```ts
await ductape.warehouse.query({
  operation: 'delete',
  from: { type: 'database', tag: 'users-db', entity: 'users' },
  where: { status: { $eq: 'deleted' } },
  returning: true
});
```

### Upsert

Insert or update based on key:

```ts
await ductape.warehouse.query({
  operation: 'upsert',
  from: { type: 'database', tag: 'users-db', entity: 'users' },
  data: { id: 123, name: 'John', email: 'john@example.com' },
  returning: true
});
```

## Field Selection

### Basic Fields

```ts
fields: ['id', 'name', 'email']
```

### With Alias Reference

```ts
fields: ['u.id', 'u.name', 'u.email']
```

### Field Aliasing

```ts
fields: [
  'u.id',
  'u.name',
  'u.email as userEmail',
  'o.total as orderTotal'
]
```

### Wildcard

```ts
fields: ['*']  // All fields from primary source
fields: ['u.*', 'o.total']  // All from u, specific from o
```

## Where Clauses

### Comparison Operators

| Operator | Description | Example |
|----------|-------------|---------|
| `$eq` | Equal | `{ status: { $eq: 'active' } }` |
| `$ne` | Not equal | `{ status: { $ne: 'deleted' } }` |
| `$gt` | Greater than | `{ age: { $gt: 18 } }` |
| `$gte` | Greater than or equal | `{ age: { $gte: 18 } }` |
| `$lt` | Less than | `{ age: { $lt: 65 } }` |
| `$lte` | Less than or equal | `{ age: { $lte: 65 } }` |

```ts
where: {
  'u.age': { $gte: 18, $lt: 65 },
  'u.status': { $eq: 'active' }
}
```

### Logical Operators

| Operator | Description | Example |
|----------|-------------|---------|
| `$and` | Logical AND | `{ $and: [cond1, cond2] }` |
| `$or` | Logical OR | `{ $or: [cond1, cond2] }` |
| `$not` | Logical NOT | `{ $not: condition }` |

```ts
where: {
  $and: [
    { 'u.status': { $eq: 'active' } },
    {
      $or: [
        { 'u.role': { $eq: 'admin' } },
        { 'u.role': { $eq: 'moderator' } }
      ]
    }
  ]
}
```

### Array Operators

| Operator | Description | Example |
|----------|-------------|---------|
| `$in` | In array | `{ role: { $in: ['admin', 'mod'] } }` |
| `$nin` | Not in array | `{ role: { $nin: ['banned'] } }` |
| `$contains` | Array contains | `{ tags: { $contains: 'featured' } }` |
| `$containsAll` | Contains all | `{ tags: { $containsAll: ['a', 'b'] } }` |
| `$containsAny` | Contains any | `{ tags: { $containsAny: ['a', 'b'] } }` |

```ts
where: {
  'u.roles': { $in: ['admin', 'moderator'] },
  'u.tags': { $containsAll: ['verified', 'premium'] }
}
```

### String Operators

| Operator | Description | Example |
|----------|-------------|---------|
| `$like` | Pattern match | `{ email: { $like: '%@company.com' } }` |
| `$ilike` | Case-insensitive like | `{ name: { $ilike: 'john%' } }` |
| `$regex` | Regular expression | `{ email: { $regex: '^[a-z]+@' } }` |
| `$startsWith` | Starts with | `{ name: { $startsWith: 'John' } }` |
| `$endsWith` | Ends with | `{ email: { $endsWith: '.com' } }` |

```ts
where: {
  'u.email': { $like: '%@company.com' },
  'u.name': { $ilike: 'john%' }
}
```

### Null Operators

| Operator | Description | Example |
|----------|-------------|---------|
| `$null` | Is null | `{ deletedAt: { $null: true } }` |
| `$exists` | Field exists | `{ metadata: { $exists: true } }` |

```ts
where: {
  'u.deletedAt': { $null: true },
  'u.profile': { $exists: true }
}
```

### Vector Operators

| Operator | Description | Example |
|----------|-------------|---------|
| `$similar` | Vector similarity | `{ $similar: { vector: [...], threshold: 0.7 } }` |
| `$near` | Distance-based | `{ $near: { vector: [...], maxDistance: 0.5 } }` |

```ts
where: {
  'v': {
    $similar: {
      vector: queryEmbedding,
      threshold: 0.7,
      topK: 10
    }
  }
}
```

## Join Clauses

### Standard Join

```ts
join: [{
  type: 'inner' | 'left' | 'right',
  source: IDataSource,
  on: { left: string, right: string },
  where?: IWhereClause
}]
```

### Graph Join

```ts
join: [{
  type: 'left',
  source: { type: 'graph', tag: 'social-neo4j', entity: 'Person', alias: 'f' },
  graph: {
    relationship: 'FRIENDS_WITH',
    direction: 'outgoing' | 'incoming' | 'both',
    minDepth?: number,
    maxDepth?: number
  },
  on: { left: 'u.id', right: 'f.userId' }
}]
```

### Semantic Join

```ts
join: [{
  type: 'semantic',
  source: { type: 'vector', tag: 'embeddings', entity: 'items', alias: 's' },
  semantic: {
    embedField?: string,
    vector?: number[],
    similarityThreshold?: number,
    topK?: number
  }
}]
```

## Ordering

```ts
orderBy: [
  { field: 'createdAt', order: 'DESC' },
  { field: 'name', order: 'ASC' }
]
```

## Pagination

```ts
{
  limit: 20,
  offset: 40  // Skip first 40 records
}
```

## Aggregations

### Group By

```ts
{
  operation: 'select',
  from: { type: 'database', tag: 'orders-db', entity: 'orders', alias: 'o' },
  fields: [
    'o.status',
    { $count: '*', as: 'count' },
    { $sum: 'o.total', as: 'totalAmount' },
    { $avg: 'o.total', as: 'avgAmount' }
  ],
  groupBy: ['o.status'],
  having: { 'count': { $gt: 10 } }
}
```

### Aggregate Functions

| Function | Description | Example |
|----------|-------------|---------|
| `$count` | Count records | `{ $count: '*', as: 'total' }` |
| `$sum` | Sum values | `{ $sum: 'amount', as: 'total' }` |
| `$avg` | Average | `{ $avg: 'rating', as: 'avgRating' }` |
| `$min` | Minimum | `{ $min: 'price', as: 'minPrice' }` |
| `$max` | Maximum | `{ $max: 'price', as: 'maxPrice' }` |

## Update Operators

Special operators for update operations:

| Operator | Description | Example |
|----------|-------------|---------|
| `$increment` | Add to value | `{ count: { $increment: 1 } }` |
| `$decrement` | Subtract from value | `{ stock: { $decrement: 1 } }` |
| `$multiply` | Multiply value | `{ price: { $multiply: 1.1 } }` |
| `$push` | Add to array | `{ tags: { $push: 'new' } }` |
| `$pull` | Remove from array | `{ tags: { $pull: 'old' } }` |

```ts
await ductape.warehouse.query({
  operation: 'update',
  from: { type: 'database', tag: 'products-db', entity: 'products' },
  data: {
    viewCount: { $increment: 1 },
    stock: { $decrement: quantity },
    tags: { $push: 'bestseller' }
  },
  where: { id: { $eq: productId } }
});
```

## Result Structure

```ts
interface IWarehouseResult<T> {
  data: T[];
  count?: number;
  affectedRows?: number;
  metadata: {
    executionTime: number;
    sourcesQueried: number;
    sourceStats: ISourceStats[];
    cached: boolean;
  };
}
```

## Examples

### Complex Query

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
    'u.id',
    'u.name',
    'u.email',
    'o.orderId',
    'o.total',
    'p.name as productName',
    'r.rating'
  ],
  join: [
    {
      type: 'left',
      source: { type: 'database', tag: 'orders-mongo', entity: 'orders', alias: 'o' },
      on: { left: 'u.id', right: 'o.userId' },
      where: { 'o.status': { $eq: 'completed' } }
    },
    {
      type: 'inner',
      source: { type: 'database', tag: 'products-postgres', entity: 'products', alias: 'p' },
      on: { left: 'o.productId', right: 'p.id' }
    },
    {
      type: 'left',
      source: { type: 'database', tag: 'reviews-mongo', entity: 'reviews', alias: 'r' },
      on: { left: 'p.id', right: 'r.productId' }
    }
  ],
  where: {
    $and: [
      { 'u.status': { $eq: 'active' } },
      { 'u.createdAt': { $gte: new Date('2024-01-01') } },
      {
        $or: [
          { 'o.total': { $gte: 100 } },
          { 'r.rating': { $gte: 4 } }
        ]
      }
    ]
  },
  orderBy: [
    { field: 'o.total', order: 'DESC' },
    { field: 'u.name', order: 'ASC' }
  ],
  limit: 50,
  offset: 0
});
```

### Aggregation Query

```ts
const result = await ductape.warehouse.query({
  operation: 'select',
  from: {
    type: 'database',
    tag: 'orders-postgres',
    entity: 'orders',
    alias: 'o'
  },
  fields: [
    'o.userId',
    { $count: '*', as: 'orderCount' },
    { $sum: 'o.total', as: 'totalSpent' },
    { $avg: 'o.total', as: 'avgOrder' },
    { $max: 'o.total', as: 'largestOrder' }
  ],
  where: {
    'o.createdAt': { $gte: new Date('2024-01-01') },
    'o.status': { $eq: 'completed' }
  },
  groupBy: ['o.userId'],
  having: { 'orderCount': { $gte: 5 } },
  orderBy: [{ field: 'totalSpent', order: 'DESC' }],
  limit: 100
});
```
