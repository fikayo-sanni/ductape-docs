---
sidebar_position: 3
---

# Querying Vectors

Learn how to search and retrieve vectors from your vector database using similarity search.

## Basic Query

Find vectors similar to a query vector:

```typescript
const results = await ductape.vector.query({
  product: 'my-product',
  env: 'dev',
  tag: 'my-vectors',
  vector: queryVector,  // Array of numbers
  topK: 10,             // Number of results to return
});

console.log('Matches:', results.matches);
```

## Query Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `vector` | number[] | Required | Query vector |
| `topK` | number | 10 | Maximum results to return |
| `filter` | object | - | Metadata filter |
| `includeMetadata` | boolean | false | Include metadata in results |
| `includeValues` | boolean | false | Include vector values in results |
| `namespace` | string | 'default' | Namespace to search in |
| `minScore` | number | - | Minimum similarity score threshold |

## Including Metadata

Retrieve metadata with results:

```typescript
const results = await ductape.vector.query({
  product: 'my-product',
  env: 'dev',
  tag: 'my-vectors',
  vector: queryVector,
  topK: 5,
  includeMetadata: true,
});

results.matches.forEach((match) => {
  console.log(`ID: ${match.id}`);
  console.log(`Score: ${match.score}`);
  console.log(`Title: ${match.metadata?.title}`);
  console.log(`Category: ${match.metadata?.category}`);
});
```

## Filtering Results

### Exact Match

```typescript
const results = await ductape.vector.query({
  product: 'my-product',
  env: 'dev',
  tag: 'my-vectors',
  vector: queryVector,
  topK: 10,
  filter: {
    category: 'electronics',
  },
  includeMetadata: true,
});
```

### Multiple Conditions (AND)

```typescript
const results = await ductape.vector.query({
  product: 'my-product',
  env: 'dev',
  tag: 'my-vectors',
  vector: queryVector,
  topK: 10,
  filter: {
    category: 'electronics',
    in_stock: true,
  },
});
```

### Comparison Operators

```typescript
// Price less than 100
const results = await ductape.vector.query({
  product: 'my-product',
  env: 'dev',
  tag: 'my-vectors',
  vector: queryVector,
  topK: 10,
  filter: {
    price: { $lt: 100 },
  },
});

// Rating greater than or equal to 4
const results = await ductape.vector.query({
  product: 'my-product',
  env: 'dev',
  tag: 'my-vectors',
  vector: queryVector,
  topK: 10,
  filter: {
    rating: { $gte: 4 },
  },
});
```

### Available Operators

| Operator | Description | Example |
|----------|-------------|---------|
| `$eq` | Equal to | `{ status: { $eq: 'active' } }` |
| `$ne` | Not equal to | `{ status: { $ne: 'deleted' } }` |
| `$gt` | Greater than | `{ price: { $gt: 50 } }` |
| `$gte` | Greater than or equal | `{ rating: { $gte: 4 } }` |
| `$lt` | Less than | `{ price: { $lt: 100 } }` |
| `$lte` | Less than or equal | `{ quantity: { $lte: 10 } }` |
| `$in` | In array | `{ category: { $in: ['books', 'media'] } }` |
| `$nin` | Not in array | `{ status: { $nin: ['deleted', 'archived'] } }` |

### Complex Filters

```typescript
const results = await ductape.vector.query({
  product: 'my-product',
  env: 'dev',
  tag: 'my-vectors',
  vector: queryVector,
  topK: 10,
  filter: {
    $and: [
      { category: 'electronics' },
      { price: { $lt: 500 } },
      { rating: { $gte: 4 } },
    ],
  },
});

const results = await ductape.vector.query({
  product: 'my-product',
  env: 'dev',
  tag: 'my-vectors',
  vector: queryVector,
  topK: 10,
  filter: {
    $or: [
      { category: 'electronics' },
      { category: 'computers' },
    ],
  },
});
```

## Minimum Score Threshold

Only return results above a similarity threshold:

```typescript
const results = await ductape.vector.query({
  product: 'my-product',
  env: 'dev',
  tag: 'my-vectors',
  vector: queryVector,
  topK: 10,
  minScore: 0.7,  // Only results with 70%+ similarity
  includeMetadata: true,
});
```

## Namespaces

Query within a specific namespace:

```typescript
// Query in 'products' namespace
const productResults = await ductape.vector.query({
  product: 'my-product',
  env: 'dev',
  tag: 'my-vectors',
  vector: queryVector,
  topK: 10,
  namespace: 'products',
});

// Query in 'articles' namespace
const articleResults = await ductape.vector.query({
  product: 'my-product',
  env: 'dev',
  tag: 'my-vectors',
  vector: queryVector,
  topK: 10,
  namespace: 'articles',
});
```

## Understanding Similarity Scores

Scores depend on your distance metric:

### Cosine Similarity
- Range: 0 to 1 (higher is more similar)
- 1.0 = identical direction
- 0.0 = orthogonal (unrelated)

### Euclidean Distance
- Range: 0 to infinity (lower is more similar)
- 0.0 = identical
- Results often converted to similarity score

### Dot Product
- Range: varies (higher is more similar)
- Best with normalized vectors

## Query Patterns

### Semantic Search

```typescript
async function semanticSearch(query: string, limit: number = 10) {
  const queryVector = await getEmbedding(query);

  const results = await ductape.vector.query({
    product: 'my-product',
    env: 'dev',
    tag: 'my-vectors',
    vector: queryVector,
    topK: limit,
    includeMetadata: true,
  });

  return results.matches.map((match) => ({
    id: match.id,
    score: match.score,
    content: match.metadata?.content,
  }));
}

const articles = await semanticSearch('machine learning tutorials');
```

### Find Similar Items

```typescript
async function findSimilar(itemId: string, limit: number = 5) {
  // Fetch the item's vector
  const item = await ductape.vector.fetchVectors({
    product: 'my-product',
    env: 'dev',
    tag: 'my-vectors',
    ids: [itemId],
  });
  const vector = item.vectors[itemId].values;

  // Query for similar items, excluding the original
  const results = await ductape.vector.query({
    product: 'my-product',
    env: 'dev',
    tag: 'my-vectors',
    vector,
    topK: limit + 1,  // +1 to account for the item itself
    includeMetadata: true,
  });

  // Filter out the original item
  return results.matches
    .filter((match) => match.id !== itemId)
    .slice(0, limit);
}

const similarProducts = await findSimilar('prod-123');
```

### Hybrid Search

Combine vector similarity with metadata filters:

```typescript
async function hybridSearch(
  query: string,
  category: string,
  priceRange: { min: number; max: number }
) {
  const queryVector = await getEmbedding(query);

  const results = await ductape.vector.query({
    product: 'my-product',
    env: 'dev',
    tag: 'my-vectors',
    vector: queryVector,
    topK: 20,
    filter: {
      category,
      price: {
        $gte: priceRange.min,
        $lte: priceRange.max,
      },
    },
    includeMetadata: true,
  });

  return results.matches;
}

const products = await hybridSearch(
  'wireless headphones',
  'electronics',
  { min: 50, max: 200 }
);
```

## Next Steps

- [Metadata Filtering](./filtering) - Advanced filtering patterns
- [Using with Agents](./agent-integration) - Connect vectors to AI agents
- [Best Practices](./best-practices) - Optimization tips
