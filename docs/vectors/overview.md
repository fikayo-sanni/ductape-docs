# Vector Databases in Ductape

Vector databases have become essential infrastructure for modern AI applications, powering everything from semantic search to recommendation systems and RAG (Retrieval-Augmented Generation) pipelines. Ductape provides a unified, provider-agnostic interface for working with vector databases, allowing you to switch between providers without changing your application code.

## Why Vector Databases Matter

Traditional databases excel at exact matches and structured queries, but they struggle with semantic similarity. When you need to find "documents similar to this one" or "products related to this search query," you need vector databases.

Vector databases store high-dimensional embeddings—numerical representations of text, images, or other data—and enable lightning-fast similarity searches across millions of vectors.

## Supported Providers

Ductape supports multiple vector database providers out of the box:

| Provider | Best For | Key Features |
|----------|----------|--------------|
| **Pinecone** | Production workloads | Fully managed, scales automatically |
| **Qdrant** | Self-hosted deployments | Open source, rich filtering |
| **Weaviate** | Hybrid search | Built-in ML models, GraphQL API |
| **In-Memory** | Development & testing | Zero configuration, instant setup |

## Getting Started

### 1. Define Your Vector Database

First, create a vector database configuration in your Ductape product:

```typescript
import Ductape from '@ductape/sdk';

const ductape = new Ductape({
  workspace_id: 'your-workspace-id',
  private_key: 'your-private-key',
});

await ductape.product.init('my-product');

// Create a vector database configuration
await ductape.vector.create({
  product: 'my-product',
  tag: 'document-embeddings',
  name: 'Document Embeddings',
  type: 'pinecone',
  dimensions: 1536, // OpenAI ada-002 embedding size
  metric: 'cosine',
  envs: [
    {
      slug: 'prd',
      apiKey: '{{PINECONE_API_KEY}}', // Use secrets
      endpoint: 'https://my-index.pinecone.io',
    },
  ],
});
```

### 2. Connect and Use

Once configured, connecting and querying is straightforward:

```typescript
// Upsert vectors
await ductape.vector.upsert({
  product: 'my-product',
  env: 'prd',
  tag: 'document-embeddings',
  vectors: [
    {
      id: 'doc-1',
      values: embedding, // Your embedding array
      metadata: {
        title: 'Introduction to Machine Learning',
        category: 'tech',
        author: 'Jane Doe',
      },
    },
  ],
  namespace: 'articles',
});

// Query for similar vectors
const results = await ductape.vector.query({
  product: 'my-product',
  env: 'prd',
  tag: 'document-embeddings',
  vector: queryEmbedding,
  topK: 10,
  namespace: 'articles',
  filter: {
    field: 'category',
    operator: '$eq',
    value: 'tech',
  },
  includeMetadata: true,
});

console.log(results.matches);
// [
//   { id: 'doc-1', score: 0.95, metadata: { title: '...', ... } },
//   { id: 'doc-7', score: 0.89, metadata: { title: '...', ... } },
//   ...
// ]
```

## Key Features

### Environment-Based Configuration

Like all Ductape resources, vector databases support environment-specific configurations. Use different providers or credentials for development, staging, and production:

```typescript
envs: [
  { slug: 'dev', type: 'memory' }, // In-memory for development
  { slug: 'stg', type: 'qdrant', endpoint: 'http://qdrant-staging:6333' },
  { slug: 'prd', type: 'pinecone', apiKey: '{{PINECONE_API_KEY}}' },
]
```

### Namespace Isolation

Organize vectors into namespaces for logical separation:

```typescript
// User-specific embeddings
await ductape.vector.upsert({
  ...options,
  namespace: `user-${userId}`,
  vectors: userDocuments,
});

// Query only within a user's namespace
const results = await ductape.vector.query({
  ...options,
  namespace: `user-${userId}`,
  vector: queryVector,
});
```

### Metadata Filtering

Combine vector similarity with metadata filters for precise results:

```typescript
const results = await ductape.vector.query({
  product: 'my-product',
  env: 'prd',
  tag: 'products',
  vector: queryEmbedding,
  topK: 20,
  filter: {
    operator: '$and',
    filters: [
      { field: 'category', operator: '$eq', value: 'electronics' },
      { field: 'price', operator: '$lte', value: 500 },
      { field: 'in_stock', operator: '$eq', value: true },
    ],
  },
});
```

### Caching Integration

Enable caching for repeated queries to reduce latency and costs:

```typescript
const results = await ductape.vector.query({
  product: 'my-product',
  env: 'prd',
  tag: 'document-embeddings',
  vector: queryEmbedding,
  topK: 10,
  cache: 'vector-query-cache', // Cache tag
});
```

### Built-in Logging

All vector operations are automatically logged, providing visibility into:
- Query patterns and performance
- Upsert volumes
- Error rates
- Cost tracking

View logs in the Ductape dashboard or query them programmatically:

```typescript
const logs = await ductape.logs.fetch({
  component: 'product',
  type: 'vector',
  product: 'my-product',
});
```

## Common Use Cases

### Semantic Search

Build search experiences that understand meaning, not just keywords:

```typescript
async function semanticSearch(query: string) {
  // Generate embedding for the search query
  const queryEmbedding = await generateEmbedding(query);

  // Find similar documents
  const results = await ductape.vector.query({
    product: 'my-product',
    env: 'prd',
    tag: 'documents',
    vector: queryEmbedding,
    topK: 10,
    includeMetadata: true,
  });

  return results.matches.map(match => ({
    id: match.id,
    title: match.metadata?.title,
    score: match.score,
  }));
}
```

### RAG (Retrieval-Augmented Generation)

Enhance LLM responses with relevant context:

```typescript
async function ragQuery(userQuestion: string) {
  // 1. Find relevant context
  const queryEmbedding = await generateEmbedding(userQuestion);
  const context = await ductape.vector.query({
    product: 'my-product',
    env: 'prd',
    tag: 'knowledge-base',
    vector: queryEmbedding,
    topK: 5,
    includeMetadata: true,
  });

  // 2. Build prompt with context
  const contextText = context.matches
    .map(m => m.metadata?.content)
    .join('\n\n');

  // 3. Generate response with LLM
  const response = await llm.complete({
    prompt: `Context:\n${contextText}\n\nQuestion: ${userQuestion}\n\nAnswer:`,
  });

  return response;
}
```

### Recommendation Systems

Power personalized recommendations:

```typescript
async function getRecommendations(userId: string, productId: string) {
  // Get the product's embedding
  const product = await ductape.vector.fetchVectors({
    product: 'my-product',
    env: 'prd',
    tag: 'products',
    ids: [productId],
  });

  // Find similar products
  const similar = await ductape.vector.query({
    product: 'my-product',
    env: 'prd',
    tag: 'products',
    vector: product.vectors[productId].values,
    topK: 10,
    filter: {
      field: 'id',
      operator: '$ne',
      value: productId, // Exclude the original
    },
  });

  return similar.matches;
}
```

## Best Practices

### 1. Choose the Right Dimensions

Match your embedding dimensions to your model:
- OpenAI `text-embedding-ada-002`: 1536 dimensions
- OpenAI `text-embedding-3-small`: 1536 dimensions
- OpenAI `text-embedding-3-large`: 3072 dimensions
- Cohere `embed-english-v3.0`: 1024 dimensions

### 2. Use Meaningful IDs

Use deterministic, meaningful IDs for vectors to enable easy updates:

```typescript
// Good: Deterministic ID based on content
const id = `doc-${documentId}-chunk-${chunkIndex}`;

// Avoid: Random UUIDs make updates difficult
const id = crypto.randomUUID();
```

### 3. Batch Operations

For bulk operations, use batch methods to improve performance:

```typescript
// Batch upsert
await ductape.vector.upsert({
  ...options,
  vectors: documents.map(doc => ({
    id: doc.id,
    values: doc.embedding,
    metadata: doc.metadata,
  })),
});
```

### 4. Monitor and Optimize

Use Ductape's logging to monitor:
- Query latency (aim for < 100ms p95)
- Result quality (track click-through rates)
- Index size and costs

## Conclusion

Ductape's vector database module provides a powerful, unified interface for building AI-powered applications. By abstracting away provider-specific details, you can focus on building features while maintaining the flexibility to switch providers as your needs evolve.

Whether you're building semantic search, RAG pipelines, or recommendation systems, Ductape's vector capabilities give you the tools you need to succeed.

## Next Steps

- [Configure your first vector database](/vectors/configuration)
- [Learn about metadata filtering](/vectors/filtering)
- [Explore caching strategies](/vectors/caching)
- [View the API reference](/api/vector)
