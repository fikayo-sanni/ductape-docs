---
sidebar_position: 2
---

# Querying Data

Learn how to read data from your database using Ductape's query API. This guide covers filtering, sorting, pagination, relationships, and advanced query patterns.

## Quick Example

```ts
const users = await ductape.database.query({
  table: 'users',
  where: { status: 'active' },
  orderBy: { column: 'created_at', order: 'DESC' },
  limit: 10,
});

console.log('Active users:', users.data);
console.log('Total count:', users.count);
```

## Basic Queries

### Simple Query

Fetch all records from a table:

```ts
const result = await ductape.database.query({
  table: 'users',
});
```

### Query with Connection Parameters

If you haven't called `connect()`, specify the connection:

```ts
const result = await ductape.database.query({
  env: 'prd',
  product: 'my-app',
  database: 'users-db',
  table: 'users',
});
```

### Select Specific Columns

Fetch only the columns you need:

```ts
const result = await ductape.database.query({
  table: 'users',
  select: ['id', 'email', 'name', 'created_at'],
});
```

## Filtering with WHERE

### Simple Equality

```ts
const result = await ductape.database.query({
  table: 'users',
  where: {
    status: 'active',
    role: 'admin',
  },
});
```

### Comparison Operators

Use `$`-prefixed operators for advanced filtering:

```ts
const result = await ductape.database.query({
  table: 'products',
  where: {
    price: { $GT: 10 },        // Greater than
    stock: { $GTE: 5 },        // Greater than or equal
    discount: { $LT: 50 },     // Less than
    rating: { $LTE: 4.5 },     // Less than or equal
    status: { $NE: 'deleted' }, // Not equal
  },
});
```

### Available Operators

| Operator | Description | Example |
|----------|-------------|---------|
| `$GT` | Greater than | `{ age: { $GT: 18 } }` |
| `$GTE` | Greater than or equal | `{ age: { $GTE: 18 } }` |
| `$LT` | Less than | `{ price: { $LT: 100 } }` |
| `$LTE` | Less than or equal | `{ price: { $LTE: 100 } }` |
| `$NE` or `$NOT` | Not equal | `{ status: { $NE: 'deleted' } }` |
| `$IN` | In array | `{ status: { $IN: ['active', 'pending'] } }` |
| `$NOT_IN` | Not in array | `{ status: { $NOT_IN: ['deleted', 'banned'] } }` |
| `$LIKE` | Pattern match | `{ email: { $LIKE: '%@gmail.com' } }` |
| `$IS_NULL` | Is null | `{ deleted_at: { $IS_NULL: true } }` |
| `$IS_NOT_NULL` | Is not null | `{ verified_at: { $IS_NOT_NULL: true } }` |
| `$BETWEEN` | Between values | `{ created_at: { $BETWEEN: [start, end] } }` |

### IN Operator

Match any value in an array:

```ts
const result = await ductape.database.query({
  table: 'orders',
  where: {
    status: { $IN: ['pending', 'processing', 'shipped'] },
  },
});
```

### Pattern Matching (LIKE)

```ts
const result = await ductape.database.query({
  table: 'users',
  where: {
    email: { $LIKE: '%@gmail.com' },
    name: { $LIKE: 'John%' },
  },
});
```

### NULL Checks

```ts
const result = await ductape.database.query({
  table: 'users',
  where: {
    deleted_at: { $IS_NULL: true },    // Not deleted
    verified_at: { $IS_NOT_NULL: true }, // Verified
  },
});
```

### BETWEEN

```ts
const result = await ductape.database.query({
  table: 'orders',
  where: {
    created_at: {
      $BETWEEN: [new Date('2024-01-01'), new Date('2024-12-31')],
    },
    total: { $BETWEEN: [100, 500] },
  },
});
```

## Logical Operators

### AND Conditions

All conditions must match:

```ts
const result = await ductape.database.query({
  table: 'products',
  where: {
    $AND: {
      price: { $GTE: 10, $LTE: 100 },
      category: { $IN: ['electronics', 'gadgets'] },
      stock: { $GT: 0 },
      deleted_at: { $IS_NULL: true },
    },
  },
});
```

### OR Conditions

Any condition can match:

```ts
const result = await ductape.database.query({
  table: 'users',
  where: {
    $OR: {
      role: 'admin',
      is_superuser: true,
    },
  },
});
```

### Nested AND/OR

Combine AND and OR for complex queries:

```ts
const result = await ductape.database.query({
  table: 'orders',
  where: {
    $AND: {
      total: { $GT: 100 },
      status: { $IN: ['pending', 'processing'] },
      $OR: {
        priority: 'high',
        express_shipping: true,
      },
    },
  },
});
```

## Sorting

### Single Column Sort

```ts
import { SortOrder } from '@ductape/sdk';

const result = await ductape.database.query({
  table: 'users',
  orderBy: { column: 'created_at', order: SortOrder.DESC },
});
```

### Multiple Column Sort

```ts
const result = await ductape.database.query({
  table: 'products',
  orderBy: [
    { column: 'category', order: 'ASC' },
    { column: 'price', order: 'DESC' },
  ],
});
```

## Pagination

### Limit and Offset

```ts
const page = 1;
const pageSize = 20;

const result = await ductape.database.query({
  table: 'users',
  limit: pageSize,
  offset: (page - 1) * pageSize,
});

console.log('Page data:', result.data);
console.log('Total records:', result.count);
console.log('Total pages:', Math.ceil(result.count / pageSize));
```

## Relationships (Include)

Fetch related data in a single query using the `include` option.

### Many-to-One Relationship

Fetch a record with its related parent:

```ts
const result = await ductape.database.query({
  table: 'users',
  where: { id: 1 },
  include: {
    relation: 'profile',
    type: 'many-to-one',
    foreignKey: 'profile_id',
    primaryKey: 'id',
    select: ['bio', 'avatar_url'],
  },
});

// Result:
// {
//   id: 1,
//   name: 'John Doe',
//   email: 'john@example.com',
//   profile: { bio: '...', avatar_url: '...' }
// }
```

### One-to-Many Relationship

Fetch a record with its related children:

```ts
const result = await ductape.database.query({
  table: 'users',
  where: { id: 1 },
  include: {
    relation: 'posts',
    type: 'one-to-many',
    foreignKey: 'user_id',
    primaryKey: 'id',
    select: ['id', 'title', 'created_at'],
    where: { published: true },
    orderBy: { column: 'created_at', order: 'DESC' },
    limit: 10,
  },
});

// Result:
// {
//   id: 1,
//   name: 'John Doe',
//   posts: [
//     { id: 1, title: 'First Post', created_at: '...' },
//     { id: 2, title: 'Second Post', created_at: '...' },
//   ]
// }
```

### Many-to-Many Relationship

Fetch records through a junction table:

```ts
const result = await ductape.database.query({
  table: 'users',
  where: { id: 1 },
  include: {
    relation: 'roles',
    type: 'many-to-many',
    through: 'user_roles',
    throughForeignKey: 'user_id',
    throughRelatedKey: 'role_id',
    select: ['name', 'permissions'],
  },
});

// Result:
// {
//   id: 1,
//   name: 'John Doe',
//   roles: [
//     { name: 'admin', permissions: ['read', 'write', 'delete'] },
//     { name: 'editor', permissions: ['read', 'write'] },
//   ]
// }
```

### Multiple Includes

Include multiple relationships in one query:

```ts
const result = await ductape.database.query({
  table: 'users',
  where: { id: 1 },
  include: [
    {
      relation: 'profile',
      type: 'many-to-one',
      select: ['bio', 'avatar_url'],
    },
    {
      relation: 'posts',
      type: 'one-to-many',
      foreignKey: 'author_id',
      where: { published: true },
      limit: 5,
    },
    {
      relation: 'comments',
      type: 'one-to-many',
      foreignKey: 'user_id',
      select: ['content', 'created_at'],
      limit: 10,
    },
  ],
});
```

### Nested Includes

Load deeply nested relationships:

```ts
const result = await ductape.database.query({
  table: 'users',
  where: { id: 1 },
  include: {
    relation: 'posts',
    type: 'one-to-many',
    select: ['id', 'title'],
    include: {
      relation: 'comments',
      type: 'one-to-many',
      foreignKey: 'post_id',
      select: ['content', 'author_name'],
      limit: 3,
    },
  },
});

// Result:
// {
//   id: 1,
//   name: 'John Doe',
//   posts: [
//     {
//       id: 1,
//       title: 'First Post',
//       comments: [
//         { content: 'Great post!', author_name: 'Jane' },
//         { content: 'Thanks!', author_name: 'Bob' },
//       ]
//     }
//   ]
// }
```

## Raw Queries

For complex queries that can't be expressed with the query builder:

### PostgreSQL

```ts
const result = await ductape.database.raw({
  query: 'SELECT * FROM users WHERE created_at > $1 AND status = $2',
  params: [new Date('2024-01-01'), 'active'],
});

console.log('Rows:', result.data);
console.log('Fields:', result.fields);
```

### MySQL

```ts
const result = await ductape.database.raw({
  query: 'SELECT * FROM users WHERE created_at > ? AND status = ?',
  params: [new Date('2024-01-01'), 'active'],
});
```

### MongoDB

```ts
const result = await ductape.database.raw({
  query: {
    status: 'active',
    created_at: { $gte: new Date('2024-01-01') },
  },
  collection: 'users',
});
```

## Query Result Structure

All query operations return a consistent result structure:

```ts
interface IQueryResult<T> {
  data: T[];           // Array of matching records
  count: number;       // Total count (useful for pagination)
  fields?: string[];   // Column names (for raw queries)
}
```

## Query Options Reference

| Option | Type | Description |
|--------|------|-------------|
| `table` | string | Table or collection name |
| `select` | string[] | Columns to return |
| `where` | object | Filter conditions |
| `orderBy` | object \| object[] | Sort configuration |
| `limit` | number | Maximum records to return |
| `offset` | number | Records to skip |
| `include` | object \| object[] | Relationship includes |
| `env` | string | Environment (if not connected) |
| `product` | string | Product tag (if not connected) |
| `database` | string | Database tag (if not connected) |

## Examples by Use Case

### Find One Record

```ts
const user = await ductape.database.query({
  table: 'users',
  where: { id: userId },
  limit: 1,
});

const singleUser = user.data[0];
```

### Search with Pagination

```ts
async function searchUsers(query: string, page: number, pageSize: number) {
  const result = await ductape.database.query({
    table: 'users',
    where: {
      $OR: {
        name: { $LIKE: `%${query}%` },
        email: { $LIKE: `%${query}%` },
      },
    },
    orderBy: { column: 'name', order: 'ASC' },
    limit: pageSize,
    offset: (page - 1) * pageSize,
  });

  return {
    users: result.data,
    total: result.count,
    page,
    pageSize,
    totalPages: Math.ceil(result.count / pageSize),
  };
}
```

### Recent Records

```ts
const recentOrders = await ductape.database.query({
  table: 'orders',
  where: {
    created_at: { $GTE: new Date(Date.now() - 24 * 60 * 60 * 1000) },
  },
  orderBy: { column: 'created_at', order: 'DESC' },
  limit: 50,
});
```

### Filtered Dashboard Data

```ts
const dashboardData = await ductape.database.query({
  table: 'orders',
  select: ['id', 'customer_name', 'total', 'status', 'created_at'],
  where: {
    $AND: {
      status: { $IN: ['pending', 'processing'] },
      total: { $GTE: 100 },
      created_at: { $GTE: new Date('2024-01-01') },
    },
  },
  orderBy: [
    { column: 'status', order: 'ASC' },
    { column: 'created_at', order: 'DESC' },
  ],
  limit: 100,
});
```

## Next Steps

- [Writing Data](./writing-data) - Insert, update, and delete records
- [Aggregations](./aggregations) - Count, sum, and group data
- [Transactions](./transactions) - Execute queries atomically
- [Direct Queries](./direct-queries) - Advanced query patterns

## See Also

* [Writing Data](./writing-data)
* [Operators Reference](../operators/operators)
