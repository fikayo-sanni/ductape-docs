---
sidebar_position: 1
---

# Getting Started with Warehouse

The Ductape Warehouse provides a unified interface for querying and writing data across databases, graphs, and vector stores using a single JSON-based query language. It enables cross-database joins, semantic similarity searches, and distributed transactions.

## Overview

Traditional applications often use multiple data stores:
- **Databases** (PostgreSQL, MySQL, MongoDB) for structured data
- **Graph databases** (Neo4j, Neptune) for relationship-heavy data
- **Vector stores** (Pinecone, Qdrant) for embeddings and similarity search

The Warehouse unifies these into a single query interface, allowing you to:
- Query across different data source types
- Join data between databases, graphs, and vectors
- Execute distributed transactions with automatic rollback
- Use semantic (vector-based) joins for AI applications

All your product's databases, graphs, and vectors are **automatically available** - no registration required.

## Prerequisites

Before using the Warehouse, ensure you have:

1. A Ductape account and workspace
2. At least one data source configured (database, graph, or vector store)
3. The Ductape SDK installed

```bash
npm install @ductape/sdk
```

## Quick Start

### Step 1: Initialize the SDK

```ts
import Ductape from '@ductape/sdk';

const ductape = new Ductape({
  accessKey: 'your-access-key',
});
```

### Step 2: Execute a Query

All your product's databases, graphs, and vectors are automatically available:

```ts
// Query from a database
const result = await ductape.warehouse.query({
  product: 'my-app',
  env: 'production',
  query: {
    operation: 'select',
    from: {
      type: 'database',
      tag: 'users-postgres',
      entity: 'users',
      alias: 'u'
    },
    fields: ['u.id', 'u.name', 'u.email'],
    where: { 'u.status': { $eq: 'active' } },
    limit: 100
  }
});

console.log(result.data); // Array of user records
console.log(result.metadata.executionTime); // Query execution time in ms
```

### Step 3: Cross-Database Join

Join data from different sources seamlessly:

```ts
const result = await ductape.warehouse.query({
  product: 'my-app',
  env: 'production',
  query: {
    operation: 'select',
    from: {
      type: 'database',
      tag: 'users-postgres',
      entity: 'users',
      alias: 'u'
    },
    fields: ['u.name', 'u.email', 'friends.name as friend_name'],
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
        direction: 'both'
      },
      on: { left: 'u.id', right: 'friends.userId' }
    }],
    where: { 'u.status': { $eq: 'active' } },
    limit: 100
  }
});
```

## Core Concepts

### Data Sources

A data source references any database, graph, or vector store in your product:

```ts
interface IDataSource {
  type: 'database' | 'graph' | 'vector';
  tag: string;           // Your data source tag (e.g., 'users-postgres')
  entity: string;        // Table, node label, or collection name
  alias?: string;        // Optional alias for use in joins and field references
}
```

### Query Operations

The Warehouse supports these operations:

| Operation | Description |
|-----------|-------------|
| `select` | Read data from one or more sources |
| `insert` | Add new records |
| `update` | Modify existing records |
| `delete` | Remove records |
| `upsert` | Insert or update based on key |

### Where Clauses

Use MongoDB-style operators for filtering:

```ts
// Simple equality
{ 'u.status': { $eq: 'active' } }

// Comparison operators
{ 'u.age': { $gte: 18, $lt: 65 } }

// Logical operators
{
  $and: [
    { 'u.status': { $eq: 'active' } },
    { 'u.verified': { $eq: true } }
  ]
}

// Array operators
{ 'u.roles': { $in: ['admin', 'moderator'] } }

// Pattern matching
{ 'u.email': { $like: '%@company.com' } }

// Null checks
{ 'u.deletedAt': { $null: true } }
```

## Convenience Methods

For simple operations, use the convenience methods:

```ts
// Select with options
const users = await ductape.warehouse.select({
  product: 'my-app',
  env: 'production',
  source: { type: 'database', tag: 'users-postgres', entity: 'users', alias: 'u' },
  fields: ['id', 'name'],
  where: { status: { $eq: 'active' } },
  orderBy: [{ field: 'createdAt', order: 'DESC' }],
  limit: 10
});

// Insert
await ductape.warehouse.insert({
  product: 'my-app',
  env: 'production',
  source: { type: 'database', tag: 'users-postgres', entity: 'users' },
  data: { name: 'John', email: 'john@example.com' }
});

// Update
await ductape.warehouse.update({
  product: 'my-app',
  env: 'production',
  source: { type: 'database', tag: 'users-postgres', entity: 'users' },
  data: { status: 'inactive' },
  where: { id: { $eq: 123 } }
});

// Delete
await ductape.warehouse.delete({
  product: 'my-app',
  env: 'production',
  source: { type: 'database', tag: 'users-postgres', entity: 'users' },
  where: { status: { $eq: 'deleted' } }
});

// Upsert
await ductape.warehouse.upsert({
  product: 'my-app',
  env: 'production',
  source: { type: 'database', tag: 'users-postgres', entity: 'users' },
  data: { id: 123, name: 'John', email: 'john@example.com' }
});
```

## What's Next

- [Cross-Database Joins](./joins.md) - Learn how to join data across different sources
- [Semantic Joins](./semantic-joins.md) - Use vector similarity for AI-powered joins
- [Transactions](./transactions.md) - Execute distributed transactions with saga pattern
- [Query Reference](./query-reference.md) - Complete query syntax reference
