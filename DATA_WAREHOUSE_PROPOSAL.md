# Ductape Data Warehouse - Unified Cross-Database Interface

## Implementation Status

| Component | Status | Location |
|-----------|--------|----------|
| Query Types & Interfaces | ✅ Complete | `sdk/ts/src/warehouse/types/` |
| Data Source Registry | ✅ Complete | `sdk/ts/src/warehouse/registry/` |
| Query Parser & Validator | ✅ Complete | `sdk/ts/src/warehouse/parser/` |
| Single-Source Executor | ✅ Complete | `sdk/ts/src/warehouse/executor/single-source-executor.ts` |
| Join Executor (Hash, Nested Loop, Sort-Merge) | ✅ Complete | `sdk/ts/src/warehouse/executor/joins/join-executor.ts` |
| Semantic Join Executor | ✅ Complete | `sdk/ts/src/warehouse/executor/joins/semantic-join.ts` |
| Saga Orchestrator | ✅ Complete | `sdk/ts/src/warehouse/transactions/saga-orchestrator.ts` |
| Main Warehouse Service | ✅ Complete | `sdk/ts/src/warehouse/warehouse.service.ts` |
| Integration Testing | 🔄 Pending | Needs type fixes for existing service interfaces |

**Next Steps:**
1. Fix TypeScript type mismatches with existing service interfaces (DatabaseService, GraphService, VectorDatabaseService)
2. Add integration tests
3. Export from main SDK index.ts

---

## Executive Summary

This document proposes a unified data warehouse interface for Ductape that enables cross-database queries, joins, writes, updates, and deletes across **graphs**, **vectors**, and **traditional databases** using a single JSON interface.

---

## Current State Analysis

### Existing Query Interfaces

#### 1. Database Queries
**Location:** [databases.service.ts](sdk/ts/src/database/databases.service.ts)

| Feature | Interface | Supported DBs |
|---------|-----------|---------------|
| Query | `IQueryOptions` | PostgreSQL, MySQL, MariaDB, MongoDB, DynamoDB, Cassandra |
| Where Clauses | `IWhereClause`, `IComparisonOperator` | All |
| Relationships | `IInclude` (one-to-one, one-to-many, many-to-many) | SQL databases |
| Aggregations | `count`, `sum`, `avg`, `min`, `max`, `groupBy` | All |
| Transactions | Full ACID support | PostgreSQL, MySQL, MongoDB |

**Query Structure:**
```typescript
interface IQueryOptions {
  table: string;
  select?: string[];
  where?: IWhereClause;
  orderBy?: IOrderBy[];
  limit?: number;
  offset?: number;
  include?: IInclude[];  // Relationships
  connection?: string;
}
```

#### 2. Graph Queries
**Location:** [graphs.service.ts](sdk/ts/src/graph/graphs.service.ts)

| Feature | Interface | Supported DBs |
|---------|-----------|---------------|
| Node Operations | `IFindNodesOptions` | Neo4j, Neptune, ArangoDB, Memgraph |
| Traversals | `ITraverseOptions`, `IShortestPathOptions` | All |
| Raw Queries | Cypher, Gremlin, AQL | Database-specific |
| Vector Search | `IVectorSearchOptions` | Neo4j, ArangoDB |

**Query Structure:**
```typescript
interface IFindNodesOptions {
  labels?: string[];
  where?: IGraphWhereClause;
  limit?: number;
  orderBy?: { property: string; order: 'ASC' | 'DESC' }[];
}
```

#### 3. Vector Queries
**Location:** [vector.service.ts](sdk/ts/src/vector/vector.service.ts)

| Feature | Interface | Supported DBs |
|---------|-----------|---------------|
| Similarity Search | `IQueryVectorsOptions` | Pinecone, Qdrant, Weaviate, Chroma, Milvus, pgvector |
| Metadata Filtering | `IMetadataFilter`, `IMetadataFilterGroup` | All |
| Hybrid Search | `sparseVector`, `alpha` blending | Pinecone, Qdrant |
| Namespaces | Logical partitioning | All |

**Query Structure:**
```typescript
interface IQueryVectorsOptions {
  vector: number[];
  topK: number;
  namespace?: string;
  filter?: IMetadataFilter | IMetadataFilterGroup;
  minScore?: number;
  includeMetadata?: boolean;
  includeValues?: boolean;
}
```

### Existing Patterns We Can Leverage

1. **Adapter Factory Pattern** - Already used for all three data types
2. **MongoDB-style Operators** - Consistent `$eq`, `$gt`, `$and`, `$or` across all interfaces
3. **Base Adapter Classes** - Abstract interfaces with database-specific implementations
4. **Transaction Support** - Exists for databases and graphs
5. **Feature Detection** - `DatabaseFeature`, `GraphFeature`, `VectorFeature` enums

---

## Proposed Data Warehouse Architecture

### Core Concept

Create a **unified query language** that:
- Uses a single JSON schema for all data operations
- Supports cross-database joins via a virtual execution layer
- Handles heterogeneous data sources transparently
- Provides consistent transaction semantics where possible

### Unified Query Interface

```typescript
interface IWarehouseQuery {
  // Operation type
  operation: 'select' | 'insert' | 'update' | 'delete' | 'upsert';

  // Primary data source
  from: IDataSource;

  // Fields to return (select) or data to write (insert/update)
  fields?: string[] | IFieldMapping[];
  data?: Record<string, any> | Record<string, any>[];

  // Cross-database joins
  join?: IJoinClause[];

  // Unified where clause (works across all data types)
  where?: IUnifiedWhereClause;

  // Aggregations
  aggregate?: IAggregation[];
  groupBy?: string[];

  // Pagination & sorting
  orderBy?: IOrderBy[];
  limit?: number;
  offset?: number;

  // Transaction context (optional)
  transaction?: ITransactionContext;

  // Execution hints
  hints?: IExecutionHints;
}

interface IDataSource {
  // Source type
  type: 'database' | 'graph' | 'vector';

  // Reference to configured data source
  tag: string;  // e.g., "users-postgres", "knowledge-neo4j", "embeddings-pinecone"

  // Entity within the source
  entity: string;  // table name, node label, or index name

  // Alias for use in joins
  alias?: string;
}

interface IJoinClause {
  // Join type
  type: 'inner' | 'left' | 'right' | 'cross' | 'semantic';

  // Data source to join
  source: IDataSource;

  // Join condition
  on?: IJoinCondition;

  // For semantic joins (vector similarity)
  semantic?: {
    embedField: string;      // Field containing embedding or text to embed
    similarityThreshold?: number;
    topK?: number;
  };
}

interface IJoinCondition {
  // Standard equality join
  left: string;   // "alias.field"
  right: string;  // "alias.field"
  operator?: '=' | '!=' | '>' | '<' | '>=' | '<=';
}

interface IUnifiedWhereClause {
  // Logical operators
  $and?: IUnifiedWhereClause[];
  $or?: IUnifiedWhereClause[];
  $not?: IUnifiedWhereClause;

  // Field conditions (field path -> condition)
  [fieldPath: string]: ICondition | IUnifiedWhereClause[] | IUnifiedWhereClause | undefined;
}

interface ICondition {
  $eq?: any;
  $ne?: any;
  $gt?: any;
  $gte?: any;
  $lt?: any;
  $lte?: any;
  $in?: any[];
  $nin?: any[];
  $like?: string;
  $ilike?: string;
  $contains?: any;
  $exists?: boolean;
  $regex?: string;

  // Vector-specific
  $similar?: {
    vector: number[];
    threshold: number;
  };

  // Graph-specific
  $connected?: {
    to: string;  // node ID or label
    via?: string;  // relationship type
    maxDepth?: number;
  };
}
```

### Example Queries

#### 1. Simple Cross-Database Join (User + Graph Relationships)

```json
{
  "operation": "select",
  "from": {
    "type": "database",
    "tag": "users-postgres",
    "entity": "users",
    "alias": "u"
  },
  "fields": ["u.id", "u.name", "u.email", "f.name as friend_name"],
  "join": [
    {
      "type": "inner",
      "source": {
        "type": "graph",
        "tag": "social-neo4j",
        "entity": "Person",
        "alias": "p"
      },
      "on": { "left": "u.id", "right": "p.userId" }
    },
    {
      "type": "left",
      "source": {
        "type": "graph",
        "tag": "social-neo4j",
        "entity": "Person",
        "alias": "f"
      },
      "on": {
        "left": "p",
        "right": "f",
        "operator": "FRIENDS_WITH"
      }
    }
  ],
  "where": {
    "u.status": { "$eq": "active" }
  },
  "limit": 100
}
```

#### 2. Semantic Join (Database + Vector Similarity)

```json
{
  "operation": "select",
  "from": {
    "type": "database",
    "tag": "products-postgres",
    "entity": "products",
    "alias": "p"
  },
  "fields": ["p.id", "p.name", "p.price", "similar.score"],
  "join": [
    {
      "type": "semantic",
      "source": {
        "type": "vector",
        "tag": "product-embeddings-pinecone",
        "entity": "products",
        "alias": "similar"
      },
      "semantic": {
        "embedField": "p.description",
        "similarityThreshold": 0.8,
        "topK": 10
      }
    }
  ],
  "where": {
    "p.category": { "$eq": "electronics" }
  }
}
```

#### 3. Graph Traversal + Database Enrichment

```json
{
  "operation": "select",
  "from": {
    "type": "graph",
    "tag": "knowledge-neo4j",
    "entity": "Document",
    "alias": "d"
  },
  "fields": ["d.title", "d.content", "author.name", "author.email"],
  "join": [
    {
      "type": "left",
      "source": {
        "type": "database",
        "tag": "users-postgres",
        "entity": "users",
        "alias": "author"
      },
      "on": { "left": "d.authorId", "right": "author.id" }
    }
  ],
  "where": {
    "d": {
      "$connected": {
        "to": "Topic:AI",
        "via": "RELATES_TO",
        "maxDepth": 2
      }
    }
  }
}
```

#### 4. Cross-Database Write with Transaction

```json
{
  "operation": "insert",
  "from": {
    "type": "database",
    "tag": "orders-postgres",
    "entity": "orders"
  },
  "data": {
    "userId": "user_123",
    "total": 99.99,
    "status": "pending"
  },
  "transaction": {
    "id": "txn_abc123",
    "operations": [
      {
        "operation": "insert",
        "from": { "type": "graph", "tag": "activity-neo4j", "entity": "Activity" },
        "data": {
          "type": "ORDER_PLACED",
          "userId": "user_123",
          "timestamp": "2025-01-15T10:30:00Z"
        }
      },
      {
        "operation": "upsert",
        "from": { "type": "vector", "tag": "user-behavior-pinecone", "entity": "behaviors" },
        "data": {
          "id": "user_123_order",
          "vector": [0.1, 0.2, 0.3],
          "metadata": { "action": "order", "value": 99.99 }
        }
      }
    ]
  }
}
```

---

## Architecture Components

### 1. Query Parser & Planner

```
┌─────────────────────────────────────────────────────────────────┐
│                    Unified Query Interface                       │
│                     (JSON Query Input)                           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       Query Parser                               │
│  • Validates query schema                                        │
│  • Resolves data source references                               │
│  • Builds abstract syntax tree (AST)                             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Query Planner                               │
│  • Analyzes join dependencies                                    │
│  • Determines execution order                                    │
│  • Optimizes cross-database operations                           │
│  • Creates execution plan                                        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Execution Engine                              │
│  • Executes sub-queries in parallel where possible               │
│  • Performs in-memory joins                                      │
│  • Handles streaming for large datasets                          │
│  • Manages distributed transactions (2PC/Saga)                   │
└─────────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
        ┌──────────┐   ┌──────────┐   ┌──────────┐
        │ Database │   │  Graph   │   │  Vector  │
        │ Adapter  │   │ Adapter  │   │ Adapter  │
        └──────────┘   └──────────┘   └──────────┘
              │               │               │
              ▼               ▼               ▼
        ┌──────────┐   ┌──────────┐   ┌──────────┐
        │PostgreSQL│   │  Neo4j   │   │ Pinecone │
        │  MySQL   │   │ Neptune  │   │  Qdrant  │
        │ MongoDB  │   │ ArangoDB │   │ Weaviate │
        │   ...    │   │   ...    │   │   ...    │
        └──────────┘   └──────────┘   └──────────┘
```

### 2. Cross-Database Join Strategies

| Join Type | Strategy | Use Case |
|-----------|----------|----------|
| **Hash Join** | Load smaller dataset into memory, hash on join key | Equality joins between databases |
| **Nested Loop** | Iterate outer, query inner per row | Small outer datasets, indexed inner |
| **Sort-Merge** | Sort both sides, merge | Large sorted datasets |
| **Semantic Join** | Vector similarity between embeddings | AI/ML similarity matching |
| **Graph Traversal Join** | Traverse graph, enrich with relational data | Knowledge graphs + business data |

### 3. Transaction Management

#### Option A: Saga Pattern (Recommended for cross-database)

```typescript
interface ISagaTransaction {
  id: string;
  steps: ISagaStep[];
  compensations: ICompensation[];  // Rollback actions
  status: 'pending' | 'executing' | 'committed' | 'compensating' | 'failed';
}

interface ISagaStep {
  order: number;
  operation: IWarehouseQuery;
  compensation: IWarehouseQuery;  // Undo operation
}
```

#### Option B: Two-Phase Commit (For supported databases)

```typescript
interface I2PCTransaction {
  id: string;
  participants: IDataSource[];
  prepareStatus: Map<string, 'prepared' | 'failed'>;
  status: 'preparing' | 'prepared' | 'committing' | 'committed' | 'aborting' | 'aborted';
}
```

### 4. Data Type Mapping

| Source Type | Native Types | Warehouse Type |
|-------------|--------------|----------------|
| PostgreSQL | `integer`, `varchar`, `timestamp` | `number`, `string`, `datetime` |
| MongoDB | `ObjectId`, `ISODate` | `string`, `datetime` |
| Neo4j | `Node`, `Relationship` | `object` with `_type`, `_id` |
| Pinecone | `vector`, `metadata` | `array<number>`, `object` |

---

## Implementation Action Plan

### Phase 1: Core Infrastructure (Foundation)

#### 1.1 Define Unified Query Schema
- [ ] Create `IWarehouseQuery` interface
- [ ] Create `IDataSource` interface
- [ ] Create `IJoinClause` and `IJoinCondition` interfaces
- [ ] Create `IUnifiedWhereClause` interface
- [ ] Add validation schemas (Zod/Joi)

**Files to create:**
- `sdk/ts/src/warehouse/types/query.interface.ts`
- `sdk/ts/src/warehouse/types/join.interface.ts`
- `sdk/ts/src/warehouse/types/where.interface.ts`
- `sdk/ts/src/warehouse/types/transaction.interface.ts`

#### 1.2 Build Query Parser
- [ ] Parse JSON query into AST
- [ ] Resolve data source references
- [ ] Validate field references
- [ ] Type checking and inference

**Files to create:**
- `sdk/ts/src/warehouse/parser/query-parser.ts`
- `sdk/ts/src/warehouse/parser/ast.types.ts`
- `sdk/ts/src/warehouse/parser/validator.ts`

#### 1.3 Create Data Source Registry
- [ ] Registry for configured data sources
- [ ] Connection pooling across sources
- [ ] Health checking and failover
- [ ] Metadata caching (schemas, indexes)

**Files to create:**
- `sdk/ts/src/warehouse/registry/data-source-registry.ts`
- `sdk/ts/src/warehouse/registry/connection-pool.ts`
- `sdk/ts/src/warehouse/registry/metadata-cache.ts`

---

### Phase 2: Query Planning & Optimization

#### 2.1 Query Planner
- [ ] Dependency graph for join operations
- [ ] Cost estimation for different execution paths
- [ ] Join order optimization
- [ ] Predicate pushdown to source databases

**Files to create:**
- `sdk/ts/src/warehouse/planner/query-planner.ts`
- `sdk/ts/src/warehouse/planner/cost-estimator.ts`
- `sdk/ts/src/warehouse/planner/join-optimizer.ts`
- `sdk/ts/src/warehouse/planner/predicate-pusher.ts`

#### 2.2 Execution Plan Generator
- [ ] Convert optimized plan to execution steps
- [ ] Identify parallelizable operations
- [ ] Memory estimation for joins
- [ ] Streaming vs batch decision

**Files to create:**
- `sdk/ts/src/warehouse/planner/execution-plan.ts`
- `sdk/ts/src/warehouse/planner/parallel-analyzer.ts`

---

### Phase 3: Execution Engine

#### 3.1 Single-Source Execution
- [ ] Route to appropriate adapter (database/graph/vector)
- [ ] Transform unified query to native query
- [ ] Execute and normalize results
- [ ] Error handling and retry logic

**Files to create:**
- `sdk/ts/src/warehouse/executor/single-source-executor.ts`
- `sdk/ts/src/warehouse/executor/query-transformer.ts`
- `sdk/ts/src/warehouse/executor/result-normalizer.ts`

#### 3.2 Join Execution
- [ ] Hash join implementation
- [ ] Nested loop join implementation
- [ ] Sort-merge join implementation
- [ ] Memory management for large joins

**Files to create:**
- `sdk/ts/src/warehouse/executor/joins/hash-join.ts`
- `sdk/ts/src/warehouse/executor/joins/nested-loop-join.ts`
- `sdk/ts/src/warehouse/executor/joins/sort-merge-join.ts`
- `sdk/ts/src/warehouse/executor/joins/join-executor.ts`

#### 3.3 Semantic Join (Vector Similarity)
- [ ] Embed text fields on-the-fly (via embeddings service)
- [ ] Query vector store for similar items
- [ ] Join results with other sources
- [ ] Score-based filtering

**Files to create:**
- `sdk/ts/src/warehouse/executor/joins/semantic-join.ts`
- `sdk/ts/src/warehouse/executor/embedding-resolver.ts`

#### 3.4 Graph Traversal Execution
- [ ] Execute graph traversals
- [ ] Collect node/relationship IDs
- [ ] Join with relational data
- [ ] Path result formatting

**Files to create:**
- `sdk/ts/src/warehouse/executor/graph-traversal-executor.ts`

---

### Phase 4: Write Operations

#### 4.1 Single-Source Writes
- [ ] Insert/Update/Delete/Upsert routing
- [ ] Data transformation to native format
- [ ] Validation against schema
- [ ] Return affected rows/nodes/vectors

**Files to create:**
- `sdk/ts/src/warehouse/executor/write-executor.ts`
- `sdk/ts/src/warehouse/executor/data-transformer.ts`

#### 4.2 Cross-Database Transactions (Saga)
- [ ] Saga orchestrator
- [ ] Step execution with compensation tracking
- [ ] Rollback on failure
- [ ] Transaction state persistence

**Files to create:**
- `sdk/ts/src/warehouse/transactions/saga-orchestrator.ts`
- `sdk/ts/src/warehouse/transactions/compensation-manager.ts`
- `sdk/ts/src/warehouse/transactions/transaction-store.ts`

#### 4.3 Two-Phase Commit (Optional)
- [ ] Coordinator implementation
- [ ] Prepare/Commit/Abort protocol
- [ ] Timeout handling
- [ ] Recovery from coordinator failure

**Files to create:**
- `sdk/ts/src/warehouse/transactions/two-phase-coordinator.ts`

---

### Phase 5: Service Layer & API

#### 5.1 Warehouse Service
- [ ] Main service class
- [ ] Query execution entry point
- [ ] Transaction management
- [ ] Result streaming

**Files to create:**
- `sdk/ts/src/warehouse/warehouse.service.ts`
- `sdk/ts/src/warehouse/warehouse.types.ts`

#### 5.2 REST/GraphQL API (Server)
- [ ] REST endpoints for warehouse queries
- [ ] GraphQL schema for warehouse
- [ ] Batch query support
- [ ] Subscription for long-running queries

**Files to create:**
- `ductape-server/src/modules/warehouse/warehouse.controller.ts`
- `ductape-server/src/modules/warehouse/warehouse.module.ts`
- `ductape-server/src/modules/warehouse/warehouse.graphql.ts`

---

### Phase 6: Advanced Features

#### 6.1 Caching Layer
- [ ] Query result caching
- [ ] Cache invalidation strategies
- [ ] Materialized views (computed joins)
- [ ] Cache warming

#### 6.2 Query Analytics
- [ ] Query execution metrics
- [ ] Slow query logging
- [ ] Query plan visualization
- [ ] Cost tracking per data source

#### 6.3 Schema Management
- [ ] Virtual schema discovery
- [ ] Cross-database relationships
- [ ] Schema versioning
- [ ] Migration support

#### 6.4 Security
- [ ] Row-level security across sources
- [ ] Field-level access control
- [ ] Audit logging
- [ ] Query sanitization

---

## File Structure

```
sdk/ts/src/warehouse/
├── index.ts
├── warehouse.service.ts
├── warehouse.types.ts
│
├── types/
│   ├── query.interface.ts
│   ├── join.interface.ts
│   ├── where.interface.ts
│   ├── transaction.interface.ts
│   ├── result.interface.ts
│   └── index.ts
│
├── parser/
│   ├── query-parser.ts
│   ├── ast.types.ts
│   ├── validator.ts
│   └── index.ts
│
├── registry/
│   ├── data-source-registry.ts
│   ├── connection-pool.ts
│   ├── metadata-cache.ts
│   └── index.ts
│
├── planner/
│   ├── query-planner.ts
│   ├── cost-estimator.ts
│   ├── join-optimizer.ts
│   ├── predicate-pusher.ts
│   ├── execution-plan.ts
│   └── index.ts
│
├── executor/
│   ├── execution-engine.ts
│   ├── single-source-executor.ts
│   ├── query-transformer.ts
│   ├── result-normalizer.ts
│   ├── write-executor.ts
│   ├── graph-traversal-executor.ts
│   │
│   └── joins/
│       ├── join-executor.ts
│       ├── hash-join.ts
│       ├── nested-loop-join.ts
│       ├── sort-merge-join.ts
│       ├── semantic-join.ts
│       └── index.ts
│
├── transactions/
│   ├── saga-orchestrator.ts
│   ├── compensation-manager.ts
│   ├── transaction-store.ts
│   ├── two-phase-coordinator.ts
│   └── index.ts
│
└── utils/
    ├── type-mapper.ts
    ├── field-resolver.ts
    └── index.ts
```

---

## API Examples

### SDK Usage

```typescript
import { Ductape } from '@ductape/sdk';

const ductape = new Ductape({ ... });

// Simple cross-database query
const results = await ductape.warehouse.query({
  operation: 'select',
  from: { type: 'database', tag: 'users-pg', entity: 'users', alias: 'u' },
  fields: ['u.id', 'u.name', 'orders.total'],
  join: [{
    type: 'left',
    source: { type: 'database', tag: 'orders-mongo', entity: 'orders', alias: 'orders' },
    on: { left: 'u.id', right: 'orders.userId' }
  }],
  where: { 'u.status': { $eq: 'active' } },
  limit: 100
});

// Semantic search with database enrichment
const semanticResults = await ductape.warehouse.query({
  operation: 'select',
  from: { type: 'vector', tag: 'docs-pinecone', entity: 'documents', alias: 'v' },
  fields: ['v.id', 'v.score', 'doc.title', 'doc.content'],
  join: [{
    type: 'inner',
    source: { type: 'database', tag: 'docs-pg', entity: 'documents', alias: 'doc' },
    on: { left: 'v.id', right: 'doc.id' }
  }],
  where: {
    'v': { $similar: { vector: queryEmbedding, threshold: 0.8 } }
  }
});

// Cross-database transaction
const txn = await ductape.warehouse.transaction();
try {
  await txn.execute({
    operation: 'insert',
    from: { type: 'database', tag: 'orders-pg', entity: 'orders' },
    data: { userId: 'u1', total: 99.99 }
  });

  await txn.execute({
    operation: 'insert',
    from: { type: 'graph', tag: 'activity-neo4j', entity: 'Event' },
    data: { type: 'ORDER', userId: 'u1' }
  });

  await txn.commit();
} catch (err) {
  await txn.rollback();
}
```

---

## Key Considerations

### Performance
- **Predicate Pushdown**: Push filters to source databases to reduce data transfer
- **Parallel Execution**: Execute independent sub-queries concurrently
- **Streaming**: Stream large result sets instead of loading into memory
- **Caching**: Cache frequent query results and metadata

### Consistency
- **Eventual Consistency**: Accept that cross-database joins may have slight inconsistencies
- **Saga Pattern**: Use compensating transactions for cross-database writes
- **Idempotency**: Ensure write operations are idempotent for retry safety

### Limitations
- **No True ACID**: Cross-database transactions use Saga (eventual consistency)
- **Performance**: Cross-database joins are slower than native joins
- **Complexity**: Semantic joins require embedding computation

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Query latency (single source) | < 100ms |
| Query latency (2-way join) | < 500ms |
| Query latency (semantic join) | < 2s |
| Transaction success rate | > 99.9% |
| Rollback success rate | 100% |

---

## Next Steps

1. **Review and approve** this proposal
2. **Prioritize phases** based on immediate needs
3. **Start Phase 1** - Core type definitions and query parser
4. **Iterate** with real use cases and feedback

---

## Appendix: Comparison with Existing Solutions

| Feature | Ductape Warehouse | Trino/Presto | Apache Drill | Denodo |
|---------|-------------------|--------------|--------------|--------|
| Vector DB support | Yes | No | No | Limited |
| Graph DB support | Yes | No | No | No |
| JSON query interface | Yes | SQL | SQL | SQL |
| Semantic joins | Yes | No | No | No |
| Cross-DB transactions | Saga | No | No | No |
| Embedded in SDK | Yes | Separate | Separate | Separate |
