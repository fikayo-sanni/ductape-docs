---
sidebar_position: 5
---

# Vector Database Best Practices

Optimize your vector database usage for performance, cost, and accuracy.

## Embedding Best Practices

### Choose the Right Embedding Model

| Model | Dimensions | Speed | Quality | Cost | Best For |
|-------|------------|-------|---------|------|----------|
| text-embedding-ada-002 | 1536 | Fast | Good | Low | General purpose |
| text-embedding-3-small | 1536 | Fast | Better | Low | Cost-effective |
| text-embedding-3-large | 3072 | Slow | Best | High | High accuracy |
| all-MiniLM-L6-v2 | 384 | Very Fast | Good | Free | Low latency |

### Normalize Your Vectors

For cosine similarity, ensure vectors are normalized:

```typescript
function normalizeVector(vector: number[]): number[] {
  const magnitude = Math.sqrt(vector.reduce((sum, v) => sum + v * v, 0));
  return vector.map((v) => v / magnitude);
}
```

### Batch Embedding Generation

Process embeddings in batches for efficiency:

```typescript
async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  const batchSize = 100;
  const embeddings: number[][] = [];

  for (let i = 0; i < texts.length; i += batchSize) {
    const batch = texts.slice(i, i + batchSize);
    const batchEmbeddings = await embeddingProvider.embedBatch(batch);
    embeddings.push(...batchEmbeddings);
  }

  return embeddings;
}
```

---

## Data Management

### Use Meaningful IDs

```typescript
// Good - meaningful, queryable IDs
await ductape.vector.upsert({
  product: 'my-product',
  env: 'dev',
  tag: 'my-vectors',
  vectors: [
    { id: 'doc:product:12345', values: [...], metadata: {...} },
    { id: 'doc:article:67890', values: [...], metadata: {...} },
  ],
});

// Bad - random IDs that can't be reconstructed
await ductape.vector.upsert({
  product: 'my-product',
  env: 'dev',
  tag: 'my-vectors',
  vectors: [
    { id: crypto.randomUUID(), values: [...], metadata: {...} },
  ],
});
```

### Structure Metadata for Filtering

Design metadata to support your query patterns:

```typescript
// Good - filterable, typed metadata
{
  id: 'doc-123',
  values: [...],
  metadata: {
    type: 'article',           // Categorical - exact match
    category: 'technology',    // Categorical - exact match
    published_at: 1703980800,  // Numeric - range queries
    word_count: 1500,          // Numeric - range queries
    tags: ['ai', 'ml'],        // Array - $in queries
    is_featured: true,         // Boolean - exact match
  },
}
```

### Avoid Storing Large Data in Metadata

```typescript
// Good - store references, not full content
{
  id: 'doc-123',
  values: [...],
  metadata: {
    title: 'Introduction to ML',
    summary: 'A brief overview of...',  // Short summary
    content_id: 'cms:article:123',      // Reference to full content
    url: '/articles/intro-to-ml',
  },
}

// Bad - storing full content in metadata
{
  id: 'doc-123',
  values: [...],
  metadata: {
    title: 'Introduction to ML',
    full_content: '... 10,000 words ...', // Too large!
  },
}
```

---

## Performance Optimization

### Use Namespaces for Data Isolation

```typescript
// Separate data by tenant, user, or category
await ductape.vector.upsert({
  product: 'my-product',
  env: 'dev',
  tag: 'my-vectors',
  namespace: `tenant:${tenantId}`,
  vectors: [...],
});

// Query within namespace
const results = await ductape.vector.query({
  product: 'my-product',
  env: 'dev',
  tag: 'my-vectors',
  namespace: `tenant:${tenantId}`,
  vector: queryVector,
  topK: 10,
});
```

### Optimize TopK

Return only what you need:

```typescript
// Start conservative
const results = await ductape.vector.query({
  product: 'my-product',
  env: 'dev',
  tag: 'my-vectors',
  vector: queryVector,
  topK: 5,  // Start small
  minScore: 0.7,  // Filter low-quality results
});

// Only increase if needed
if (results.matches.length < 5) {
  // Expand search with lower threshold
}
```

### Use Filters to Reduce Search Space

```typescript
// Good - filter before similarity search
const results = await ductape.vector.query({
  product: 'my-product',
  env: 'dev',
  tag: 'my-vectors',
  vector: queryVector,
  topK: 10,
  filter: {
    category: 'electronics',
    price: { $lt: 500 },
  },
});

// Less efficient - filter after retrieval
const results = await ductape.vector.query({
  product: 'my-product',
  env: 'dev',
  tag: 'my-vectors',
  vector: queryVector,
  topK: 1000,  // Over-fetch
});
const filtered = results.matches.filter(
  (m) => m.metadata?.category === 'electronics'
);
```

### Batch Operations

```typescript
// Good - batch upserts
await ductape.vector.upsert({
  product: 'my-product',
  env: 'dev',
  tag: 'my-vectors',
  vectors: allVectors,  // Up to 100 vectors at once
});

// Bad - individual upserts
for (const vector of allVectors) {
  await ductape.vector.upsert({
    product: 'my-product',
    env: 'dev',
    tag: 'my-vectors',
    vectors: [vector],
  });
}
```

---

## Accuracy Optimization

### Chunk Documents Appropriately

Break large documents into meaningful chunks:

```typescript
function chunkDocument(
  content: string,
  chunkSize: number = 500,
  overlap: number = 50
): string[] {
  const chunks: string[] = [];
  let start = 0;

  while (start < content.length) {
    const end = Math.min(start + chunkSize, content.length);
    chunks.push(content.slice(start, end));
    start = end - overlap;
  }

  return chunks;
}

// Better - chunk by semantic boundaries
function chunkBySentences(content: string, maxChunkSize: number): string[] {
  const sentences = content.split(/[.!?]+/);
  const chunks: string[] = [];
  let currentChunk = '';

  for (const sentence of sentences) {
    if ((currentChunk + sentence).length > maxChunkSize) {
      chunks.push(currentChunk.trim());
      currentChunk = sentence;
    } else {
      currentChunk += sentence + '. ';
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}
```

### Include Context in Chunks

```typescript
// Add document context to each chunk
function createChunksWithContext(doc: Document): VectorRecord[] {
  const chunks = chunkDocument(doc.content);

  return chunks.map((chunk, index) => ({
    id: `${doc.id}:chunk:${index}`,
    values: generateEmbedding(chunk),
    metadata: {
      document_id: doc.id,
      document_title: doc.title,
      chunk_index: index,
      total_chunks: chunks.length,
      content: chunk,
      // Add surrounding context
      context: `From "${doc.title}": ${chunk}`,
    },
  }));
}
```

### Use Hybrid Search

Combine vector similarity with keyword matching:

```typescript
async function hybridSearch(query: string) {
  // 1. Get semantic results
  const semanticResults = await ductape.vector.query({
    product: 'my-product',
    env: 'dev',
    tag: 'my-vectors',
    vector: await generateEmbedding(query),
    topK: 20,
    includeMetadata: true,
  });

  // 2. Boost results that contain exact keywords
  const keywords = query.toLowerCase().split(' ');
  const boostedResults = semanticResults.matches.map((match) => {
    const content = match.metadata?.content?.toLowerCase() || '';
    const keywordMatches = keywords.filter((k) => content.includes(k)).length;
    const boost = 1 + (keywordMatches / keywords.length) * 0.2;

    return {
      ...match,
      score: match.score * boost,
    };
  });

  // 3. Re-rank by boosted score
  return boostedResults.sort((a, b) => b.score - a.score).slice(0, 10);
}
```

---

## Cost Management

### Monitor Usage

```typescript
// Track vector operations
const metrics = {
  upserts: 0,
  queries: 0,
  vectorsStored: 0,
};

// Wrap operations with tracking
async function trackedQuery(options: QueryOptions) {
  metrics.queries++;
  return ductape.vector.query(options);
}
```

### Clean Up Old Data

```typescript
// Delete old vectors by metadata
async function cleanupOldVectors(olderThanDays: number) {
  const cutoffDate = Date.now() - olderThanDays * 24 * 60 * 60 * 1000;

  // Fetch IDs of old vectors
  const oldVectors = await ductape.vector.query({
    product: 'my-product',
    env: 'dev',
    tag: 'my-vectors',
    vector: [/* any vector */],
    topK: 10000,
    filter: {
      created_at: { $lt: cutoffDate },
    },
  });

  // Delete in batches
  const ids = oldVectors.matches.map((m) => m.id);
  for (let i = 0; i < ids.length; i += 100) {
    await ductape.vector.deleteVectors({
      product: 'my-product',
      env: 'dev',
      tag: 'my-vectors',
      ids: ids.slice(i, i + 100),
    });
  }
}
```

### Use Appropriate Index Settings

Choose index settings based on your needs:

| Setting | Performance | Accuracy | Cost |
|---------|-------------|----------|------|
| High recall | Slower | Higher | Higher |
| Balanced | Medium | Medium | Medium |
| High speed | Faster | Lower | Lower |

---

## Security

### Don't Store Sensitive Data in Vectors

```typescript
// Good - store reference to sensitive data
{
  id: 'user-123',
  values: [...],
  metadata: {
    user_id: 'usr_abc123',  // Reference only
    preferences_summary: 'Tech enthusiast, prefers email',
  },
}

// Bad - sensitive data in vectors
{
  id: 'user-123',
  values: [...],
  metadata: {
    email: 'user@example.com',  // PII!
    ssn: '123-45-6789',         // Sensitive!
  },
}
```

### Use Namespaces for Access Control

```typescript
// Isolate data by organization
await ductape.vector.upsert({
  product: 'my-product',
  env: 'dev',
  tag: 'my-vectors',
  namespace: `org:${organizationId}`,
  vectors: [...],
});

// Enforce namespace in queries
async function searchWithAccessControl(query: string, user: User) {
  return ductape.vector.query({
    product: 'my-product',
    env: 'dev',
    tag: 'my-vectors',
    namespace: `org:${user.organizationId}`,  // Enforce tenant isolation
    vector: await generateEmbedding(query),
    topK: 10,
  });
}
```

## Next Steps

- [Getting Started](./getting-started) - Set up your first vector database
- [Querying](./querying) - Advanced query patterns
- [Using with Agents](./agent-integration) - Connect vectors to AI agents
