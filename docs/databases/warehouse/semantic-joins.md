---
sidebar_position: 3
---

# Semantic Joins

Semantic joins use vector similarity to match records based on meaning rather than exact field values. This is essential for AI applications that work with embeddings.

## Overview

Traditional joins match on exact field values (e.g., `user.id = order.userId`). Semantic joins match based on vector similarity - finding records with similar embeddings.

Use cases:
- **RAG (Retrieval Augmented Generation)** - Find similar documents for context
- **Recommendation systems** - Match products based on description similarity
- **Content enrichment** - Link database records with semantically similar vectors
- **Duplicate detection** - Find similar records across sources

## Basic Semantic Join

```ts
const result = await ductape.warehouse.query({
  operation: 'select',
  from: {
    type: 'database',
    tag: 'products-postgres',
    entity: 'products',
    alias: 'p'
  },
  fields: [
    'p.id',
    'p.name',
    'p.description',
    's.score',
    's.metadata'
  ],
  join: [{
    type: 'semantic',
    source: {
      type: 'vector',
      tag: 'product-embeddings',
      entity: 'products',
      alias: 's'
    },
    semantic: {
      embedField: 'p.description',
      similarityThreshold: 0.8,
      topK: 5
    }
  }],
  limit: 100
});
```

## Configuration Options

### Semantic Join Options

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `embedField` | string | Yes | Field to generate embedding from |
| `similarityThreshold` | number | No | Minimum similarity score (0-1, default: 0.7) |
| `topK` | number | No | Maximum similar vectors per record (default: 10) |
| `vector` | number[] | No | Pre-computed vector (alternative to embedField) |

### Using Pre-computed Vectors

If you already have embeddings, pass them directly:

```ts
const queryEmbedding = await generateEmbedding('wireless headphones');

const result = await ductape.warehouse.query({
  operation: 'select',
  from: {
    type: 'database',
    tag: 'products-postgres',
    entity: 'products',
    alias: 'p'
  },
  join: [{
    type: 'semantic',
    source: {
      type: 'vector',
      tag: 'product-embeddings',
      entity: 'products',
      alias: 's'
    },
    semantic: {
      vector: queryEmbedding,
      similarityThreshold: 0.75,
      topK: 20
    }
  }],
  limit: 10
});
```

## RAG Pattern: Document Retrieval

A common pattern for RAG applications - retrieve relevant documents and enrich with metadata:

```ts
async function retrieveContext(query: string) {
  const queryEmbedding = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: query
  });

  const result = await ductape.warehouse.query({
    operation: 'select',
    from: {
      type: 'vector',
      tag: 'document-embeddings',
      entity: 'chunks',
      alias: 'v'
    },
    fields: [
      'v.id',
      'v.score',
      'd.title',
      'd.content',
      'd.source',
      'd.createdAt'
    ],
    join: [{
      type: 'inner',
      source: {
        type: 'database',
        tag: 'documents-postgres',
        entity: 'documents',
        alias: 'd'
      },
      on: { left: 'v.documentId', right: 'd.id' }
    }],
    where: {
      'v': {
        $similar: {
          vector: queryEmbedding.data[0].embedding,
          threshold: 0.7,
          topK: 5
        }
      }
    }
  });

  return result.data;
}
```

## Similarity Search with Filters

Combine semantic similarity with traditional filters:

```ts
const result = await ductape.warehouse.query({
  operation: 'select',
  from: {
    type: 'vector',
    tag: 'product-embeddings',
    entity: 'products',
    alias: 'v'
  },
  fields: ['v.id', 'v.score', 'p.name', 'p.price', 'p.category'],
  join: [{
    type: 'inner',
    source: {
      type: 'database',
      tag: 'products-postgres',
      entity: 'products',
      alias: 'p'
    },
    on: { left: 'v.productId', right: 'p.id' }
  }],
  where: {
    $and: [
      {
        'v': {
          $similar: {
            vector: searchEmbedding,
            threshold: 0.6,
            topK: 50
          }
        }
      },
      { 'p.category': { $eq: 'electronics' } },
      { 'p.price': { $lte: 500 } },
      { 'p.inStock': { $eq: true } }
    ]
  },
  orderBy: [{ field: 'v.score', order: 'DESC' }],
  limit: 10
});
```

## Multi-Vector Search

Search across multiple vector stores and combine results:

```ts
const result = await ductape.warehouse.query({
  operation: 'select',
  from: {
    type: 'database',
    tag: 'articles-postgres',
    entity: 'articles',
    alias: 'a'
  },
  fields: [
    'a.id',
    'a.title',
    'a.summary',
    'title_match.score as titleScore',
    'content_match.score as contentScore'
  ],
  join: [
    // Match against title embeddings
    {
      type: 'left',
      source: {
        type: 'vector',
        tag: 'title-embeddings',
        entity: 'articles',
        alias: 'title_match'
      },
      semantic: {
        vector: queryEmbedding,
        similarityThreshold: 0.6,
        topK: 20
      },
      on: { left: 'a.id', right: 'title_match.articleId' }
    },
    // Match against content embeddings
    {
      type: 'left',
      source: {
        type: 'vector',
        tag: 'content-embeddings',
        entity: 'articles',
        alias: 'content_match'
      },
      semantic: {
        vector: queryEmbedding,
        similarityThreshold: 0.5,
        topK: 20
      },
      on: { left: 'a.id', right: 'content_match.articleId' }
    }
  ],
  where: {
    $or: [
      { 'title_match.score': { $gte: 0.7 } },
      { 'content_match.score': { $gte: 0.6 } }
    ]
  }
});
```

## Combining with Graph Relationships

Find semantically similar items within a user's social network:

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
    'friend.name as friendName',
    'rec.name as recommendation',
    'rec_vec.score as matchScore'
  ],
  join: [
    // Get friends from graph
    {
      type: 'inner',
      source: {
        type: 'graph',
        tag: 'social-neo4j',
        entity: 'Person',
        alias: 'friend'
      },
      graph: {
        relationship: 'FOLLOWS',
        direction: 'outgoing'
      },
      on: { left: 'u.id', right: 'friend.userId' }
    },
    // Get friends' interests
    {
      type: 'inner',
      source: {
        type: 'database',
        tag: 'interests-postgres',
        entity: 'interests',
        alias: 'interest'
      },
      on: { left: 'friend.userId', right: 'interest.userId' }
    },
    // Find semantically similar recommendations
    {
      type: 'inner',
      source: {
        type: 'vector',
        tag: 'item-embeddings',
        entity: 'items',
        alias: 'rec_vec'
      },
      semantic: {
        embedField: 'interest.description',
        similarityThreshold: 0.75,
        topK: 5
      }
    },
    // Get recommendation details
    {
      type: 'inner',
      source: {
        type: 'database',
        tag: 'items-postgres',
        entity: 'items',
        alias: 'rec'
      },
      on: { left: 'rec_vec.itemId', right: 'rec.id' }
    }
  ],
  where: { 'u.id': { $eq: currentUserId } },
  limit: 20
});
```

## Performance Considerations

1. **Vector Index** - Ensure your vector store has appropriate indexes (HNSW, IVF)
2. **topK Limits** - Start with smaller topK values and increase as needed
3. **Threshold Tuning** - Adjust similarity threshold based on your embedding model
4. **Pre-filter** - Use metadata filters in the vector store when possible
5. **Batch Queries** - For multiple lookups, batch them together

## Similarity Operators Reference

| Operator | Description | Example |
|----------|-------------|---------|
| `$similar` | Vector similarity search | `{ $similar: { vector: [...], threshold: 0.7 } }` |
| `$near` | Distance-based search | `{ $near: { vector: [...], maxDistance: 0.5 } }` |

## Next Steps

- [Transactions](./transactions.md) - Distributed transactions with saga pattern
- [Query Reference](./query-reference.md) - Complete query syntax
- [Getting Started](./getting-started.md) - Basic warehouse usage
