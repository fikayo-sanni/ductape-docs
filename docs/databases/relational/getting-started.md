---
sidebar_position: 1
---

# Getting Started with Databases

This guide walks you through setting up your first database connection in Ductape, from installation to executing your first query.

## Prerequisites

Before you begin, make sure you have:

1. A Ductape account and workspace
2. A product created in your workspace
3. Access to a database (PostgreSQL, MySQL, MongoDB, or DynamoDB)
4. The Ductape SDK installed in your project

## Step 1: Install the SDK

Install the Ductape SDK:

```bash
npm install @ductape/sdk
```

The SDK includes all database drivers (PostgreSQL, MySQL, MongoDB, DynamoDB) out of the box.

## Step 2: Initialize the SDK

Set up the Ductape SDK with your credentials:

```ts
import Ductape from '@ductape/sdk';

const ductape = new Ductape({
  accessKey: 'your-access-key',
});
```

## Step 3: Register a Database

Register your database with environment-specific connection strings:

```ts
await ductape.databases.create({
  product_tag: 'my-app',
  name: 'User Database',
  tag: 'users-db',
  type: 'postgresql',
  description: 'Stores user accounts and profiles',
  envs: [
    {
      slug: 'dev',
      connection_url: 'postgresql://localhost:5432/myapp_dev',
    },
    {
      slug: 'staging',
      connection_url: 'postgresql://staging-host:5432/myapp_staging',
    },
    {
      slug: 'prd',
      connection_url: 'postgresql://prod-host:5432/myapp_prod',
    },
  ],
});
```

### Database Configuration Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `product_tag` | string | Yes | Product identifier to associate the database with |
| `name` | string | Yes | Human-readable display name |
| `tag` | string | Yes | Unique identifier for the database |
| `type` | string | Yes | Database type: `postgresql`, `mysql`, `mongodb`, or `dynamodb` |
| `description` | string | No | Description of what the database stores |
| `envs` | array | Yes | Environment-specific connection configurations |

### Environment Configuration

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `slug` | string | Yes | Environment identifier (e.g., `dev`, `staging`, `prd`) |
| `connection_url` | string | Yes | Database connection string |
| `description` | string | No | Environment-specific notes |

## Step 4: Connect to Your Database

Before running queries, establish a connection:

```ts
const result = await ductape.databases.connect({
  env: 'dev',
  product: 'my-app',
  database: 'users-db',
});

console.log('Connected:', result.connected);
console.log('Database Version:', result.version);
console.log('Latency:', result.latency, 'ms');
```

Once connected, subsequent operations inherit the connection context. You no longer need to specify `env`, `product`, and `database` for every query.

## Step 5: Run Your First Query

With the connection established, you can query your database:

```ts
// Query all active users
const result = await ductape.databases.find({
  table: 'users',
  where: { status: 'active' },
  limit: 10,
});

console.log('Found users:', result.records);
console.log('Total count:', result.count);
```

## Step 6: Insert Data

Add new records to your database:

```ts
const result = await ductape.databases.insert({
  table: 'users',
  records: [{
    name: 'Jane Doe',
    email: 'jane@example.com',
    status: 'active',
    created_at: new Date(),
  }],
  returning: true,
});

console.log('Inserted user ID:', result.insertedIds[0]);
console.log('Inserted data:', result.records);
```

## Complete Example

Here's a complete example bringing it all together:

```ts
import Ductape from '@ductape/sdk';

async function main() {
  // Initialize SDK
  const ductape = new Ductape({
    accessKey: 'your-access-key',
  });

  // Register database (usually done once during setup)
  await ductape.databases.create({
    product_tag: 'my-app',
    name: 'User Database',
    tag: 'users-db',
    type: 'postgresql',
    envs: [
      { slug: 'dev', connection_url: 'postgresql://localhost:5432/myapp_dev' },
      { slug: 'prd', connection_url: 'postgresql://prod-host:5432/myapp_prod' },
    ],
  });

  // Connect to database
  await ductape.databases.connect({
    env: 'dev',
    product: 'my-app',
    database: 'users-db',
  });

  // Insert a new user
  const insertResult = await ductape.databases.insert({
    table: 'users',
    records: [{
      name: 'John Doe',
      email: 'john@example.com',
      status: 'active',
    }],
    returning: true,
  });

  console.log('Created user:', insertResult.records);

  // Query users
  const queryResult = await ductape.databases.find({
    table: 'users',
    where: { status: 'active' },
    orderBy: [{ column: 'created_at', order: 'DESC' }],
    limit: 10,
  });

  console.log('Active users:', queryResult.records);

  // Count total users
  const count = await ductape.databases.count({
    table: 'users',
  });

  console.log('Total users:', count);

  // Close connections when done
  await ductape.databases.closeAll();
}

main().catch(console.error);
```

## Testing Your Connection

Use the `testConnection` method to verify connectivity without performing operations:

```ts
const result = await ductape.databases.testConnection({
  env: 'dev',
  product: 'my-app',
  database: 'users-db',
});

if (result.connected) {
  console.log('Connection successful!');
  console.log('Version:', result.version);
  console.log('Latency:', result.latency, 'ms');
} else {
  console.error('Connection failed:', result.error);
}
```

## Managing Multiple Databases

You can register and use multiple databases in a single product:

```ts
// Register multiple databases
await ductape.databases.create({
  product_tag: 'my-app',
  name: 'User Database',
  tag: 'users-db',
  type: 'postgresql',
  envs: [{ slug: 'dev', connection_url: '...' }],
});

await ductape.databases.create({
  product_tag: 'my-app',
  name: 'Analytics Database',
  tag: 'analytics-db',
  type: 'mongodb',
  envs: [{ slug: 'dev', connection_url: '...' }],
});

await ductape.databases.create({
  product_tag: 'my-app',
  name: 'Session Store',
  tag: 'sessions-db',
  type: 'dynamodb',
  envs: [{ slug: 'dev', connection_url: '...' }],
});

// Switch between databases by connecting to each
await ductape.databases.connect({
  env: 'dev',
  product: 'my-app',
  database: 'users-db',
});

// Query users database
const users = await ductape.databases.find({ table: 'users' });

// Connect to a different database
await ductape.databases.connect({
  env: 'dev',
  product: 'my-app',
  database: 'analytics-db',
});

// Query analytics database
const events = await ductape.databases.find({ table: 'events' });
```

## Updating Database Configuration

Update an existing database configuration:

```ts
await ductape.databases.update('my-app', 'users-db', {
  name: 'User Database v2',
  description: 'Updated user storage',
  envs: [
    { slug: 'dev', connection_url: 'postgresql://new-dev-host:5432/myapp' },
    { slug: 'prd', connection_url: 'postgresql://new-prod-host:5432/myapp' },
  ],
});
```

## Fetching Database Information

Retrieve information about your registered databases:

```ts
// Get all databases in the product
const databases = await ductape.databases.fetchAll('my-app');

databases.forEach((database) => {
  console.log(`${database.name} (${database.tag}): ${database.type}`);
});

// Get a specific database
const usersDb = await ductape.databases.fetch('my-app', 'users-db');
console.log('Database:', usersductape.databases.name);
console.log('Type:', usersductape.databases.type);
console.log('Environments:', usersductape.databases.envs);
```

## Connection String Formats

### PostgreSQL
```
postgresql://username:password@host:port/database
postgresql://user:pass@localhost:5432/myapp
```

### MySQL
```
mysql://username:password@host:port/database
mysql://user:pass@localhost:3306/myapp
```

### MongoDB
```
mongodb://username:password@host:port/database
mongodb://user:pass@localhost:27017/myapp
mongodb+srv://user:pass@cluster.mongoductape.databases.net/myapp
```

### DynamoDB
```
dynamodb://region/access-key-id/secret-access-key
# Or use AWS credential configuration
dynamodb://us-east-1
```

## Next Steps

Now that you have your database set up, learn how to:

- [Query Data](./querying) - Read data with filters, sorting, and pagination
- [Write Data](./writing-data) - Insert, update, and delete records
- [Use Aggregations](./aggregations) - Perform calculations on your data
- [Manage Transactions](./transactions) - Ensure data consistency
- [Schema Migrations](./migrations) - Manage schema changes

## See Also

* [Direct Queries](./direct-queries) - Full API reference
* [Best Practices](./best-practices) - Production patterns
