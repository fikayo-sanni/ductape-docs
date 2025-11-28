---
sidebar_position: 10
---

# Database Actions

Create reusable query templates that can be executed with different input parameters. Database actions allow you to define queries once and reuse them across your application with variable interpolation.

## Quick Example

```ts
// Create an action template
await ductape.database.action.create({
  name: 'Get Users Paginated',
  tag: 'postgresdb:get-users-paginated',
  tableName: 'users',
  operation: DatabaseActionTypes.QUERY,
  description: 'Fetch paginated list of active users',
  template: {
    where: {
      is_active: true,
    },
    limit: '{{limit}}',
    offset: '{{offset}}',
    orderBy: [
      {
        column: '{{orderColumn}}',
        order: '{{orderDirection}}',
      },
    ],
  },
});

// Execute the action with different inputs
const users = await ductape.database.execute({
  product: 'my-product',
  env: 'prd',
  database: 'postgresdb',
  action: 'get-users-paginated',
  input: {
    limit: 25,
    offset: 0,
    orderColumn: 'created_at',
    orderDirection: 'DESC',
  },
});
```

## Why Use Actions?

**Benefits:**
- **Reusability** - Define query logic once, use everywhere
- **Type Safety** - Template validation at creation time
- **Variable Interpolation** - Dynamic queries with `{{placeholder}}` syntax
- **Maintainability** - Update query logic in one place
- **Security** - Centralized query management
- **Testing** - Easy to test query templates

## Action Types

### QUERY - Read Data

Fetch records from a table:

```ts
await ductape.database.action.create({
  name: 'Get Active Users',
  tag: 'postgresdb:get-active-users',
  tableName: 'users',
  operation: DatabaseActionTypes.QUERY,
  template: {
    where: {
      status: '{{status}}',
      created_at: { $GTE: '{{startDate}}' },
    },
    select: ['id', 'name', 'email', 'created_at'],
    limit: '{{limit}}',
    orderBy: [{ column: 'created_at', order: 'DESC' }],
  },
});

// Execute
const users = await ductape.database.execute({
  product: 'my-product',
  env: 'prd',
  database: 'postgresdb',
  action: 'get-active-users',
  input: {
    status: 'active',
    startDate: '2024-01-01',
    limit: 50,
  },
});
```

### INSERT - Create Records

Insert new records:

```ts
await ductape.database.action.create({
  name: 'Create User',
  tag: 'postgresdb:create-user',
  tableName: 'users',
  operation: DatabaseActionTypes.INSERT,
  template: {
    records: [
      {
        name: '{{name}}',
        email: '{{email}}',
        status: 'active',
        created_at: '{{createdAt}}',
      },
    ],
  },
});

// Execute
await ductape.database.execute({
  product: 'my-product',
  env: 'prd',
  database: 'postgresdb',
  action: 'create-user',
  input: {
    name: 'Alice Johnson',
    email: 'alice@example.com',
    createdAt: new Date().toISOString(),
  },
});
```

### UPDATE - Modify Records

Update existing records:

```ts
await ductape.database.action.create({
  name: 'Update User Status',
  tag: 'postgresdb:update-user-status',
  tableName: 'users',
  operation: DatabaseActionTypes.UPDATE,
  template: {
    status: '{{status}}',
    updated_at: '{{updatedAt}}',
  },
  filterTemplate: {
    id: '{{userId}}',
  },
});

// Execute
await ductape.database.execute({
  product: 'my-product',
  env: 'prd',
  database: 'postgresdb',
  action: 'update-user-status',
  input: {
    userId: 123,
    status: 'suspended',
    updatedAt: new Date().toISOString(),
  },
});
```

### DELETE - Remove Records

Delete records:

```ts
await ductape.database.action.create({
  name: 'Delete Old Sessions',
  tag: 'postgresdb:delete-old-sessions',
  tableName: 'sessions',
  operation: DatabaseActionTypes.DELETE,
  filterTemplate: {
    expires_at: { $LT: '{{expirationDate}}' },
  },
});

// Execute
await ductape.database.execute({
  product: 'my-product',
  env: 'prd',
  database: 'postgresdb',
  action: 'delete-old-sessions',
  input: {
    expirationDate: new Date().toISOString(),
  },
});
```

### UPSERT - Insert or Update

Insert new record or update if exists:

```ts
await ductape.database.action.create({
  name: 'Upsert User Preferences',
  tag: 'postgresdb:upsert-user-prefs',
  tableName: 'user_preferences',
  operation: DatabaseActionTypes.UPSERT,
  template: {
    records: [
      {
        user_id: '{{userId}}',
        theme: '{{theme}}',
        notifications: '{{notifications}}',
        updated_at: '{{updatedAt}}',
      },
    ],
    conflictColumns: ['user_id'],
  },
});

// Execute
await ductape.database.execute({
  product: 'my-product',
  env: 'prd',
  database: 'postgresdb',
  action: 'upsert-user-prefs',
  input: {
    userId: 123,
    theme: 'dark',
    notifications: true,
    updatedAt: new Date().toISOString(),
  },
});
```

### COUNT - Count Records

Count matching records:

```ts
await ductape.database.action.create({
  name: 'Count Active Users',
  tag: 'postgresdb:count-active-users',
  tableName: 'users',
  operation: DatabaseActionTypes.COUNT,
  template: {
    where: {
      status: 'active',
      created_at: { $GTE: '{{startDate}}' },
    },
  },
});

// Execute
const result = await ductape.database.execute({
  product: 'my-product',
  env: 'prd',
  database: 'postgresdb',
  action: 'count-active-users',
  input: {
    startDate: '2024-01-01',
  },
});
console.log('Active users:', result.count);
```

### AGGREGATE - Complex Aggregations

Perform aggregations:

```ts
await ductape.database.action.create({
  name: 'Sales Summary',
  tag: 'postgresdb:sales-summary',
  tableName: 'orders',
  operation: DatabaseActionTypes.AGGREGATE,
  template: {
    where: {
      status: 'completed',
      created_at: {
        $GTE: '{{startDate}}',
        $LTE: '{{endDate}}',
      },
    },
    groupBy: ['{{groupColumn}}'],
    aggregates: [
      { function: 'SUM', column: 'total', as: 'total_sales' },
      { function: 'COUNT', column: '*', as: 'order_count' },
      { function: 'AVG', column: 'total', as: 'avg_order_value' },
    ],
  },
});

// Execute
const summary = await ductape.database.execute({
  product: 'my-product',
  env: 'prd',
  database: 'postgresdb',
  action: 'sales-summary',
  input: {
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    groupColumn: 'category',
  },
});
```

### RAW_SQL - Custom Queries

Execute raw SQL:

```ts
await ductape.database.action.create({
  name: 'Complex User Report',
  tag: 'postgresdb:complex-user-report',
  tableName: 'users', // Required but not used for raw SQL
  operation: DatabaseActionTypes.RAW_SQL,
  template: {
    query: `
      SELECT
        u.id,
        u.name,
        COUNT(o.id) as order_count,
        SUM(o.total) as total_spent
      FROM users u
      LEFT JOIN orders o ON u.id = o.user_id
      WHERE u.status = $1
        AND o.created_at >= $2
      GROUP BY u.id, u.name
      HAVING COUNT(o.id) > $3
      ORDER BY total_spent DESC
      LIMIT $4
    `,
    params: ['{{status}}', '{{startDate}}', '{{minOrders}}', '{{limit}}'],
  },
});

// Execute
const report = await ductape.database.execute({
  product: 'my-product',
  env: 'prd',
  database: 'postgresdb',
  action: 'complex-user-report',
  input: {
    status: 'active',
    startDate: '2024-01-01',
    minOrders: 5,
    limit: 100,
  },
});
```

## Variable Interpolation

### Basic Placeholders

Use `{{variableName}}` syntax:

```ts
template: {
  where: {
    status: '{{status}}',
    age: { $GT: '{{minAge}}' },
  },
  limit: '{{limit}}',
}
```

### Nested Placeholders

Placeholders work in nested structures:

```ts
template: {
  where: {
    $OR: {
      email: '{{email}}',
      username: '{{username}}',
    },
  },
  select: ['{{field1}}', '{{field2}}', '{{field3}}'],
}
```

### Array Placeholders

Use in arrays:

```ts
template: {
  where: {
    status: { $IN: ['{{status1}}', '{{status2}}', '{{status3}}'] },
  },
}
```

### Default Values

Provide defaults in input:

```ts
await ductape.database.execute({
  product: 'my-product',
  env: 'prd',
  database: 'postgresdb',
  action: 'get-users',
  input: {
    limit: 50, // Default limit
    offset: 0, // Default offset
  },
});
```

## Managing Actions

### Create Action

```ts
await ductape.database.action.create({
  name: 'Action Name',
  tag: 'database-tag:action-tag', // Format: database:action
  tableName: 'table_name',
  operation: DatabaseActionTypes.QUERY,
  description: 'Optional description',
  template: {
    // Your query template
  },
});
```

**Required Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Display name for the action |
| `tag` | string | Unique identifier (format: `database:action`) |
| `tableName` | string | Table to operate on |
| `operation` | DatabaseActionTypes | Action operation (QUERY, INSERT, etc.) |
| `template` | object | Query template with placeholders |

**Optional Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `description` | string | Action description |
| `filterTemplate` | object | Filter criteria (for UPDATE/DELETE) |

### Update Action

```ts
await ductape.database.action.update({
  tag: 'postgresdb:get-users',
  template: {
    // Updated template
    where: {
      status: '{{status}}',
    },
    limit: '{{limit}}',
  },
});
```

### Fetch Action

```ts
const action = await ductape.database.action.fetch('postgresdb:get-users');
console.log('Action:', action);
```

### List Actions for Database

```ts
const actions = await ductape.database.action.fetchAll('postgresdb');
console.log(`Found ${actions.length} actions`);

actions.forEach(action => {
  console.log(`${action.tag}: ${action.name} (${action.type})`);
});
```

## Execute Actions

### Basic Execution

```ts
const result = await ductape.database.execute({
  product: 'my-product',
  env: 'prd',
  database: 'postgresdb',
  action: 'get-users',
  input: {
    status: 'active',
    limit: 50,
  },
});
```

### With Type Safety

```ts
interface User {
  id: number;
  name: string;
  email: string;
  status: string;
}

const users = await ductape.database.execute<User[]>({
  product: 'my-product',
  env: 'prd',
  database: 'postgresdb',
  action: 'get-users',
  input: { status: 'active' },
});

// TypeScript knows users is User[]
users.forEach(user => {
  console.log(`${user.name} - ${user.email}`);
});
```

### Error Handling

```ts
try {
  const users = await ductape.database.execute({
    product: 'my-product',
    env: 'prd',
    database: 'postgresdb',
    action: 'get-users',
    input: { status: 'active' },
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

### Paginated Queries

```ts
await ductape.database.action.create({
  name: 'Get Products Paginated',
  tag: 'postgresdb:get-products-paginated',
  tableName: 'products',
  operation: DatabaseActionTypes.QUERY,
  template: {
    where: {
      category: '{{category}}',
      in_stock: true,
    },
    select: ['id', 'name', 'price', 'stock'],
    limit: '{{limit}}',
    offset: '{{offset}}',
    orderBy: [
      { column: '{{sortBy}}', order: '{{sortOrder}}' },
    ],
  },
});

// Pagination helper
async function getProductsPage(
  category: string,
  page: number = 1,
  pageSize: number = 20
) {
  return ductape.database.execute({
    product: 'my-product',
    env: 'prd',
    database: 'postgresdb',
    action: 'get-products-paginated',
    input: {
      category,
      limit: pageSize,
      offset: (page - 1) * pageSize,
      sortBy: 'name',
      sortOrder: 'ASC',
    },
  });
}
```

### Search Actions

```ts
await ductape.database.action.create({
  name: 'Search Users',
  tag: 'postgresdb:search-users',
  tableName: 'users',
  operation: DatabaseActionTypes.QUERY,
  template: {
    where: {
      $OR: {
        name: { $CONTAINS: '{{query}}' },
        email: { $CONTAINS: '{{query}}' },
      },
      status: 'active',
    },
    limit: '{{limit}}',
  },
});
```

### Batch Inserts

```ts
await ductape.database.action.create({
  name: 'Bulk Create Orders',
  tag: 'postgresdb:bulk-create-orders',
  tableName: 'orders',
  operation: DatabaseActionTypes.INSERT,
  template: {
    records: '{{orders}}', // Array of order objects
  },
});

// Execute with array
await ductape.database.execute({
  product: 'my-product',
  env: 'prd',
  database: 'postgresdb',
  action: 'bulk-create-orders',
  input: {
    orders: [
      { user_id: 1, total: 99.99, status: 'pending' },
      { user_id: 2, total: 149.99, status: 'pending' },
      { user_id: 3, total: 79.99, status: 'pending' },
    ],
  },
});
```

### Conditional Updates

```ts
await ductape.database.action.create({
  name: 'Deactivate Inactive Users',
  tag: 'postgresdb:deactivate-inactive-users',
  tableName: 'users',
  operation: DatabaseActionTypes.UPDATE,
  template: {
    status: 'inactive',
    deactivated_at: '{{deactivatedAt}}',
  },
  filterTemplate: {
    last_login: { $LT: '{{cutoffDate}}' },
    status: 'active',
  },
});
```

### Reporting Actions

```ts
await ductape.database.action.create({
  name: 'Monthly Revenue Report',
  tag: 'postgresdb:monthly-revenue',
  tableName: 'orders',
  operation: DatabaseActionTypes.AGGREGATE,
  template: {
    where: {
      status: 'completed',
      created_at: {
        $GTE: '{{startDate}}',
        $LTE: '{{endDate}}',
      },
    },
    groupBy: ['EXTRACT(MONTH FROM created_at)'],
    aggregates: [
      { function: 'SUM', column: 'total', as: 'revenue' },
      { function: 'COUNT', column: 'id', as: 'order_count' },
      { function: 'AVG', column: 'total', as: 'avg_order_value' },
    ],
  },
});
```

## Best Practices

### 1. Use Descriptive Names

```ts
// ✅ Good - clear purpose
await ductape.database.action.create({
  name: 'Get Active Users Created This Month',
  tag: 'postgresdb:get-active-users-this-month',
  // ...
});

// ❌ Avoid - vague
await ductape.database.action.create({
  name: 'Get Users',
  tag: 'postgresdb:users',
  // ...
});
```

### 2. Add Descriptions

```ts
await ductape.database.action.create({
  name: 'Get Overdue Invoices',
  tag: 'postgresdb:get-overdue-invoices',
  description: 'Fetches all unpaid invoices past their due date for reminder emails',
  // ...
});
```

### 3. Validate Input

```ts
function validateInput(input: any) {
  if (!input.limit || input.limit > 1000) {
    throw new Error('Limit must be between 1 and 1000');
  }
  if (input.offset < 0) {
    throw new Error('Offset must be non-negative');
  }
}

const users = await ductape.database.execute({
  product: 'my-product',
  env: 'prd',
  database: 'postgresdb',
  action: 'get-users',
  input: validateInput(userInput),
});
```

### 4. Use Consistent Naming

```ts
// ✅ Good - consistent pattern
'postgresdb:get-users'
'postgresdb:create-user'
'postgresdb:update-user'
'postgresdb:delete-user'

// ❌ Avoid - inconsistent
'postgresdb:getUsers'
'postgresdb:user-create'
'postgresdb:UpdateUser'
'postgresdb:del_user'
```

### 5. Keep Actions Focused

```ts
// ✅ Good - single purpose
await ductape.database.action.create({
  name: 'Get User Orders',
  tag: 'postgresdb:get-user-orders',
  operation: DatabaseActionTypes.QUERY,
  // ... fetch only orders
});

// ❌ Avoid - too complex
await ductape.database.action.create({
  name: 'Get User Complete Profile',
  tag: 'postgresdb:get-user-profile',
  operation: DatabaseActionTypes.RAW_SQL,
  template: {
    query: `
      SELECT users.*, orders.*, addresses.*, payments.*
      FROM users
      LEFT JOIN orders ...
      LEFT JOIN addresses ...
      LEFT JOIN payments ...
      -- Too many joins, should be separate actions
    `,
  },
});
```

### 6. Limit Result Sets

```ts
// ✅ Always include limit
template: {
  where: { status: '{{status}}' },
  limit: '{{limit}}', // Prevent unbounded queries
}
```

### 7. Test Actions

```ts
// Test action with various inputs
describe('get-users-paginated', () => {
  it('should fetch first page', async () => {
    const users = await ductape.database.execute({
      product: 'test-product',
      env: 'test',
      database: 'testdb',
      action: 'get-users-paginated',
      input: { limit: 10, offset: 0 },
    });

    expect(users).toHaveLength(10);
  });

  it('should respect offset', async () => {
    const page2 = await ductape.database.execute({
      product: 'test-product',
      env: 'test',
      database: 'testdb',
      action: 'get-users-paginated',
      input: { limit: 10, offset: 10 },
    });

    expect(page2[0].id).toBeGreaterThan(10);
  });
});
```

## Next Steps

- [Querying Data](./querying) - Direct database queries
- [Writing Data](./writing-data) - Insert, update, delete operations
- [Transactions](./transactions) - Ensure data consistency
- [Best Practices](./best-practices) - Database optimization

## See Also

* [Database Overview](./getting-started) - Getting started with databases
* [Direct Queries](./direct-queries) - Execute raw SQL
* [Aggregations](./aggregations) - Complex data analysis
