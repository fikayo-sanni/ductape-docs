---
sidebar_position: 4
---

# Aggregations

Learn how to perform calculations on your data using Ductape's aggregation API. This guide covers counting, summing, averaging, grouping, and multi-aggregation operations.

## Quick Example

```ts
const stats = await ductape.database.aggregate({
  table: 'orders',
  operations: {
    total_orders: { $COUNT: '*' },
    total_revenue: { $SUM: 'total' },
    avg_order_value: { $AVG: 'total' },
    min_order: { $MIN: 'total' },
    max_order: { $MAX: 'total' },
  },
  where: { status: 'completed' },
});

console.log('Total Orders:', stats.total_orders);
console.log('Total Revenue:', stats.total_revenue);
console.log('Average Order:', stats.avg_order_value);
```

## Aggregation Syntax

Ductape uses a clean, object-based syntax for aggregations:

```ts
{
  alias_name: { $FUNCTION: 'column_name' }
}
```

### Supported Functions

| Function | Description | Example |
|----------|-------------|---------|
| `$COUNT` | Count records | `{ total: { $COUNT: '*' } }` |
| `$SUM` | Sum of values | `{ revenue: { $SUM: 'amount' } }` |
| `$AVG` | Average value | `{ avg_price: { $AVG: 'price' } }` |
| `$MIN` | Minimum value | `{ lowest: { $MIN: 'price' } }` |
| `$MAX` | Maximum value | `{ highest: { $MAX: 'price' } }` |
| `$STRING_AGG` | Concatenate strings (PostgreSQL) | `{ names: { $STRING_AGG: 'name' } }` |
| `$GROUP_CONCAT` | Concatenate strings (MySQL) | `{ names: { $GROUP_CONCAT: 'name' } }` |
| `$ARRAY_AGG` | Collect into array | `{ ids: { $ARRAY_AGG: 'id' } }` |

## Count

Count records with optional filtering:

### Simple Count

```ts
const total = await ductape.database.count({
  table: 'users',
});

console.log('Total users:', total);
```

### Count with Filter

```ts
const activeUsers = await ductape.database.count({
  table: 'users',
  where: { status: 'active' },
});
```

### Count Distinct Values

```ts
const uniqueCategories = await ductape.database.count({
  table: 'products',
  column: 'category',
  distinct: true,
});
```

### Count Specific Column

Count non-null values in a column:

```ts
const usersWithEmail = await ductape.database.count({
  table: 'users',
  column: 'email', // Only counts rows where email is not null
});
```

## Sum

Calculate the sum of numeric values:

```ts
const totalRevenue = await ductape.database.sum({
  table: 'orders',
  column: 'total',
  where: { status: 'completed' },
});

console.log('Total revenue:', totalRevenue);
```

### Sum with Complex Filters

```ts
const monthlyRevenue = await ductape.database.sum({
  table: 'orders',
  column: 'total',
  where: {
    $AND: {
      status: 'completed',
      created_at: {
        $GTE: new Date('2024-01-01'),
        $LT: new Date('2024-02-01'),
      },
    },
  },
});
```

## Average

Calculate the average of numeric values:

```ts
const avgOrderValue = await ductape.database.avg({
  table: 'orders',
  column: 'total',
  where: { status: 'completed' },
});

console.log('Average order value:', avgOrderValue);
```

## Min / Max

Find minimum or maximum values:

```ts
// Minimum value
const lowestPrice = await ductape.database.min({
  table: 'products',
  column: 'price',
  where: { status: 'active' },
});

// Maximum value
const highestPrice = await ductape.database.max({
  table: 'products',
  column: 'price',
  where: { status: 'active' },
});

console.log('Price range:', lowestPrice, '-', highestPrice);
```

## Multi-Aggregation

Perform multiple aggregations in a single query:

```ts
const stats = await ductape.database.aggregate({
  table: 'orders',
  operations: {
    total_orders: { $COUNT: '*' },
    total_revenue: { $SUM: 'total' },
    avg_order_value: { $AVG: 'total' },
    min_order: { $MIN: 'total' },
    max_order: { $MAX: 'total' },
  },
  where: { status: 'completed' },
});

console.log('Statistics:', stats);
// {
//   total_orders: 1234,
//   total_revenue: 98765.43,
//   avg_order_value: 80.04,
//   min_order: 10.00,
//   max_order: 500.00
// }
```

## Group By

Group records and aggregate within each group:

### Basic Group By

```ts
const result = await ductape.database.groupBy({
  table: 'orders',
  groupBy: ['status'],
  aggregate: {
    count: { $COUNT: '*' },
    total: { $SUM: 'total' },
  },
});

result.forEach((group) => {
  console.log(`${group.status}: ${group.count} orders, $${group.total}`);
});

// pending: 50 orders, $2500
// completed: 200 orders, $15000
// cancelled: 10 orders, $500
```

### Multiple Group By Columns

```ts
const result = await ductape.database.groupBy({
  table: 'orders',
  groupBy: ['status', 'payment_method'],
  aggregate: {
    total_orders: { $COUNT: '*' },
    total_amount: { $SUM: 'total' },
    avg_amount: { $AVG: 'total' },
  },
});

result.forEach((group) => {
  console.log('Status:', group.status);
  console.log('Payment Method:', group.payment_method);
  console.log('Total Orders:', group.total_orders);
  console.log('Total Amount:', group.total_amount);
  console.log('---');
});
```

### Group By with Filters

```ts
const result = await ductape.database.groupBy({
  table: 'orders',
  groupBy: ['category'],
  aggregate: {
    count: { $COUNT: '*' },
    revenue: { $SUM: 'total' },
  },
  where: {
    created_at: { $GTE: new Date('2024-01-01') },
    status: 'completed',
  },
});
```

### Group By with HAVING

Filter groups after aggregation:

```ts
const result = await ductape.database.groupBy({
  table: 'orders',
  groupBy: ['customer_id'],
  aggregate: {
    order_count: { $COUNT: '*' },
    total_spent: { $SUM: 'total' },
  },
  having: {
    order_count: { $GT: 10 },      // Customers with more than 10 orders
    total_spent: { $GTE: 1000 },   // Who spent at least $1000
  },
});
```

### Group By with Ordering

```ts
const result = await ductape.database.groupBy({
  table: 'products',
  groupBy: ['category'],
  aggregate: {
    product_count: { $COUNT: '*' },
    avg_price: { $AVG: 'price' },
  },
  orderBy: { column: 'product_count', order: 'DESC' },
  limit: 10, // Top 10 categories
});
```

## Database-Specific Functions

### PostgreSQL

```ts
// String aggregation
const result = await ductape.database.groupBy({
  table: 'orders',
  groupBy: ['customer_id'],
  aggregate: {
    order_ids: { $STRING_AGG: 'id' },    // "1, 2, 3, 4"
    products: { $ARRAY_AGG: 'product_id' }, // [1, 2, 3, 4]
  },
});
```

### MySQL

```ts
// Group concatenation
const result = await ductape.database.groupBy({
  table: 'orders',
  groupBy: ['customer_id'],
  aggregate: {
    product_names: { $GROUP_CONCAT: 'product_name' }, // "Product A,Product B,Product C"
  },
});
```

### MongoDB

```ts
// Push to array (equivalent to $ARRAY_AGG)
const result = await ductape.database.groupBy({
  table: 'orders', // Collection name
  groupBy: ['customer_id'],
  aggregate: {
    order_ids: { $ARRAY_AGG: '_id' },
    total_spent: { $SUM: 'total' },
  },
});
```

## Use Cases

### Dashboard Statistics

```ts
async function getDashboardStats() {
  const [orderStats, userStats, productStats] = await Promise.all([
    ductape.database.aggregate({
      table: 'orders',
      operations: {
        total_orders: { $COUNT: '*' },
        total_revenue: { $SUM: 'total' },
        avg_order: { $AVG: 'total' },
      },
      where: {
        created_at: { $GTE: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      },
    }),

    ductape.database.count({
      table: 'users',
      where: {
        created_at: { $GTE: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      },
    }),

    ductape.database.count({
      table: 'products',
      where: { status: 'active' },
    }),
  ]);

  return {
    orders: orderStats,
    newUsers: userStats,
    activeProducts: productStats,
  };
}
```

### Sales by Category

```ts
async function getSalesByCategory(startDate: Date, endDate: Date) {
  return ductape.database.groupBy({
    table: 'order_items',
    groupBy: ['category'],
    aggregate: {
      units_sold: { $SUM: 'quantity' },
      revenue: { $SUM: 'total' },
      avg_price: { $AVG: 'unit_price' },
    },
    where: {
      created_at: { $BETWEEN: [startDate, endDate] },
    },
    orderBy: { column: 'revenue', order: 'DESC' },
  });
}
```

### Top Customers

```ts
async function getTopCustomers(limit: number = 10) {
  return ductape.database.groupBy({
    table: 'orders',
    groupBy: ['customer_id'],
    aggregate: {
      order_count: { $COUNT: '*' },
      total_spent: { $SUM: 'total' },
      avg_order: { $AVG: 'total' },
      first_order: { $MIN: 'created_at' },
      last_order: { $MAX: 'created_at' },
    },
    where: { status: 'completed' },
    orderBy: { column: 'total_spent', order: 'DESC' },
    limit,
  });
}
```

### Daily Revenue Report

```ts
async function getDailyRevenue(days: number = 30) {
  // Note: Date grouping requires raw query for some databases
  return ductape.database.raw({
    query: `
      SELECT
        DATE(created_at) as date,
        COUNT(*) as order_count,
        SUM(total) as revenue,
        AVG(total) as avg_order
      FROM orders
      WHERE created_at >= $1 AND status = 'completed'
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `,
    params: [new Date(Date.now() - days * 24 * 60 * 60 * 1000)],
  });
}
```

## Aggregation Options Reference

### Count Options

| Option | Type | Description |
|--------|------|-------------|
| `table` | string | Table name |
| `column` | string | Column to count (default: `*`) |
| `where` | object | Filter conditions |
| `distinct` | boolean | Count distinct values |

### Sum/Avg/Min/Max Options

| Option | Type | Description |
|--------|------|-------------|
| `table` | string | Table name |
| `column` | string | Column to aggregate |
| `where` | object | Filter conditions |

### Aggregate Options

| Option | Type | Description |
|--------|------|-------------|
| `table` | string | Table name |
| `operations` | object | Aggregation operations |
| `where` | object | Filter conditions |
| `groupBy` | string[] | Group by columns |
| `having` | object | Filter aggregated groups |

### Group By Options

| Option | Type | Description |
|--------|------|-------------|
| `table` | string | Table name |
| `groupBy` | string[] | Columns to group by |
| `aggregate` | object | Aggregation operations |
| `where` | object | Filter conditions (before grouping) |
| `having` | object | Filter conditions (after grouping) |
| `orderBy` | object | Sort configuration |
| `limit` | number | Maximum groups to return |
| `offset` | number | Groups to skip |

## Performance Considerations

### DynamoDB Warning

DynamoDB does not support native aggregations. Ductape emulates aggregations by scanning the entire table into memory. For large tables, this can be:

- **Slow** - Full table scan required
- **Expensive** - Consumes read capacity
- **Memory intensive** - All data loaded into memory

For DynamoDB, consider:
- Maintaining pre-computed aggregates
- Using AWS Athena for analytics
- Limiting aggregations to filtered subsets

### Indexing

Ensure columns used in `WHERE` and `GROUP BY` are properly indexed:

```ts
// Create index for common aggregation patterns
await ductape.database.createIndex({
  table: 'orders',
  index: {
    name: 'idx_orders_status_created',
    table: 'orders',
    columns: [
      { name: 'status' },
      { name: 'created_at', order: 'DESC' },
    ],
  },
});
```

## Next Steps

- [Transactions](./transactions) - Use aggregations within transactions
- [Best Practices](./best-practices) - Performance optimization tips
- [Direct Queries](./direct-queries) - Raw SQL for complex aggregations

## See Also

* [Querying Data](./querying)
* [Direct Queries](./direct-queries)
