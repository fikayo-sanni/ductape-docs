---
sidebar_position: 1
---

# Getting Started with Graph Databases

This guide walks you through setting up your first graph database connection in Ductape, from installation to creating your first nodes and relationships.

## Prerequisites

Before you begin, make sure you have:

1. A Ductape account and workspace
2. A product created in your workspace
3. Access to a graph database (Neo4j, AWS Neptune, ArangoDB, or Memgraph)
4. The Ductape SDK installed in your project

## Step 1: Install the SDK

Install the Ductape SDK:

```bash
npm install @ductape/sdk
```

The SDK includes all graph database drivers (Neo4j, Neptune, ArangoDB, Memgraph) out of the box.

## Step 2: Initialize the SDK

Set up the Ductape SDK with your credentials:

```ts
import Ductape from '@ductape/sdk';

const ductape = new Ductape({
  workspace_id: 'your-workspace-id',
  user_id: 'your-user-id',
  private_key: 'your-private-key',
});
```

## Step 3: Register a Graph Database

Register your graph database with environment-specific connection strings:

```ts
await ductape.graph.create({
  name: 'Social Graph',
  tag: 'social-graph',
  type: 'neo4j',
  description: 'Stores user relationships and social connections',
  envs: [
    {
      slug: 'dev',
      connection_url: 'bolt://localhost:7687',
    },
    {
      slug: 'staging',
      connection_url: 'bolt://staging-neo4j:7687',
    },
    {
      slug: 'prd',
      connection_url: 'bolt://prod-neo4j:7687',
    },
  ],
});
```

### Graph Database Configuration Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Human-readable display name |
| `tag` | string | Yes | Unique identifier for the graph database |
| `type` | string | Yes | Database type: `neo4j`, `neptune`, `arangodb`, or `memgraph` |
| `description` | string | No | Description of what the graph stores |
| `envs` | array | Yes | Environment-specific connection configurations |

### Environment Configuration

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `slug` | string | Yes | Environment identifier (e.g., `dev`, `staging`, `prd`) |
| `connection_url` | string | Yes | Graph database connection string |
| `database` | string | No | Database name (ArangoDB) |
| `graphName` | string | No | Graph name (ArangoDB) |
| `region` | string | No | AWS region (Neptune) |

## Step 4: Connect to Your Graph Database

Before running operations, establish a connection:

```ts
const result = await ductape.graph.connect({
  env: 'dev',
  product: 'my-app',
  graph: 'social-graph',
});

console.log('Connected:', result.connected);
console.log('Database Type:', result.type);
console.log('Latency:', result.latency, 'ms');
```

Once connected, subsequent operations inherit the connection context. You no longer need to specify `env`, `product`, and `graph` for every operation.

## Step 5: Create Your First Node

With the connection established, create a node in your graph:

```ts
// Create a person node
const result = await ductape.graph.createNode({
  labels: ['Person'],
  properties: {
    name: 'Alice Johnson',
    email: 'alice@example.com',
    age: 28,
    city: 'San Francisco',
    joined: new Date(),
  },
});

console.log('Created node ID:', result.node.id);
console.log('Node data:', result.node.properties);
```

## Step 6: Create a Relationship

Connect nodes with a relationship:

```ts
// Create another person
const bobResult = await ductape.graph.createNode({
  labels: ['Person'],
  properties: {
    name: 'Bob Smith',
    email: 'bob@example.com',
    age: 32,
  },
});

// Create a friendship relationship
const friendship = await ductape.graph.createRelationship({
  type: 'FRIENDS_WITH',
  startNodeId: result.node.id,     // Alice
  endNodeId: bobResult.node.id,    // Bob
  properties: {
    since: 2020,
    closeness: 'high',
    metAt: 'conference',
  },
});

console.log('Created relationship:', friendship.relationship.id);
```

## Step 7: Query Your Graph

Find nodes using filters:

```ts
// Find all people in San Francisco
const people = await ductape.graph.findNodes({
  labels: ['Person'],
  where: { city: 'San Francisco' },
  limit: 10,
});

console.log('Found people:', people.nodes.length);

people.nodes.forEach(person => {
  console.log(`${person.properties.name} - ${person.properties.email}`);
});
```

## Complete Example

Here's a complete example bringing it all together:

```ts
import Ductape from '@ductape/sdk';

async function main() {
  // Initialize SDK
  const ductape = new Ductape({
    workspace_id: 'your-workspace-id',
    user_id: 'your-user-id',
    private_key: 'your-private-key',
  });

  // Register graph database (usually done once during setup)
  await ductape.graph.create({
    name: 'Social Graph',
    tag: 'social-graph',
    type: 'neo4j',
    description: 'User relationships',
    envs: [
      { slug: 'dev', connection_url: 'bolt://localhost:7687' },
      { slug: 'prd', connection_url: 'bolt://prod-neo4j:7687' },
    ],
  });

  // Connect to graph database
  await ductape.graph.connect({
    env: 'dev',
    product: 'my-app',
    graph: 'social-graph',
  });

  // Create nodes
  const alice = await ductape.graph.createNode({
    labels: ['Person'],
    properties: {
      name: 'Alice Johnson',
      email: 'alice@example.com',
      role: 'Engineer',
    },
  });

  const bob = await ductape.graph.createNode({
    labels: ['Person'],
    properties: {
      name: 'Bob Smith',
      email: 'bob@example.com',
      role: 'Designer',
    },
  });

  // Create relationship
  await ductape.graph.createRelationship({
    type: 'WORKS_WITH',
    startNodeId: alice.node.id,
    endNodeId: bob.node.id,
    properties: { team: 'Product', since: 2023 },
  });

  // Query the graph
  const engineers = await ductape.graph.findNodes({
    labels: ['Person'],
    where: { role: 'Engineer' },
  });

  console.log('Engineers:', engineers.nodes.map(n => n.properties.name));

  // Find Alice's connections
  const connections = await ductape.graph.traverse({
    startNodeId: alice.node.id,
    direction: 'OUTGOING',
    relationshipTypes: ['WORKS_WITH'],
    maxDepth: 1,
  });

  console.log('Alice works with:', connections.paths.length, 'people');

  // Close connection when done
  await ductape.graph.disconnect();
}

main().catch(console.error);
```

## Testing Your Connection

Use the `testConnection` method to verify connectivity without performing operations:

```ts
const result = await ductape.graph.testConnection({
  env: 'dev',
  product: 'my-app',
  graph: 'social-graph',
});

if (result.connected) {
  console.log('Connection successful!');
  console.log('Type:', result.type);
  console.log('Version:', result.version);
  console.log('Latency:', result.latency, 'ms');
} else {
  console.error('Connection failed:', result.error);
}
```

## Managing Multiple Graph Databases

You can register and use multiple graph databases in a single product:

```ts
// Register multiple graph databases
await ductape.graph.create({
  name: 'Social Graph',
  tag: 'social-graph',
  type: 'neo4j',
  envs: [{ slug: 'dev', connection_url: 'bolt://localhost:7687' }],
});

await ductape.graph.create({
  name: 'Knowledge Graph',
  tag: 'knowledge-graph',
  type: 'arangodb',
  envs: [{
    slug: 'dev',
    connection_url: 'http://localhost:8529',
    database: 'knowledge',
    graphName: 'entities',
  }],
});

await ductape.graph.create({
  name: 'Network Graph',
  tag: 'network-graph',
  type: 'memgraph',
  envs: [{ slug: 'dev', connection_url: 'bolt://localhost:7688' }],
});

// Switch between graphs by connecting to each
await ductape.graph.connect({
  env: 'dev',
  product: 'my-app',
  graph: 'social-graph',
});

// Query social graph
const users = await ductape.graph.findNodes({ labels: ['Person'] });

// Connect to different graph
await ductape.graph.connect({
  env: 'dev',
  product: 'my-app',
  graph: 'knowledge-graph',
});

// Query knowledge graph
const entities = await ductape.graph.findNodes({ labels: ['Entity'] });
```

## Updating Graph Configuration

Update an existing graph database configuration:

```ts
await ductape.graph.update('social-graph', {
  name: 'Social Graph v2',
  description: 'Updated social network graph',
  envs: [
    { slug: 'dev', connection_url: 'bolt://new-dev-host:7687' },
    { slug: 'prd', connection_url: 'bolt://new-prod-host:7687' },
  ],
});
```

## Fetching Graph Information

Retrieve information about your registered graph databases:

```ts
// Get all graphs in the product
const graphs = await ductape.graph.fetchAll();

graphs.forEach((graph) => {
  console.log(`${graph.name} (${graph.tag}): ${graph.type}`);
});

// Get a specific graph
const socialGraph = await ductape.graph.fetch('social-graph');
console.log('Graph:', socialGraph.name);
console.log('Type:', socialGraph.type);
console.log('Environments:', socialGraph.envs);
```

## Connection String Formats

### Neo4j
```
bolt://hostname:7687
bolt://username:password@hostname:7687
bolt+s://hostname:7687                    # with TLS
bolt+ssc://hostname:7687                  # with self-signed cert
neo4j://hostname:7687                     # routing
```

### AWS Neptune
```
wss://cluster.region.neptune.amazonaws.com:8182/gremlin
https://cluster.region.neptune.amazonaws.com:8182/openCypher
```

### ArangoDB
```
http://hostname:8529
https://hostname:8529
http://username:password@hostname:8529
```

### Memgraph
```
bolt://hostname:7687
bolt://username:password@hostname:7687
bolt+ssc://hostname:7687                  # with TLS
```

## Common Patterns

### Find or Create Pattern

Ensure a node exists, creating it only if needed:

```ts
const person = await ductape.graph.mergeNode({
  labels: ['Person'],
  matchProperties: { email: 'alice@example.com' },
  onCreate: {
    name: 'Alice Johnson',
    email: 'alice@example.com',
    createdAt: new Date(),
  },
  onMatch: {
    lastSeen: new Date(),
  },
});

console.log(person.created ? 'Created new node' : 'Found existing node');
```

### Batch Operations

Create multiple nodes efficiently:

```ts
const people = [
  { name: 'Alice', email: 'alice@example.com' },
  { name: 'Bob', email: 'bob@example.com' },
  { name: 'Charlie', email: 'charlie@example.com' },
];

for (const person of people) {
  await ductape.graph.createNode({
    labels: ['Person'],
    properties: person,
  });
}
```

### Finding Paths

Discover how nodes are connected:

```ts
const path = await ductape.graph.shortestPath({
  startNodeId: aliceId,
  endNodeId: charlieId,
  relationshipTypes: ['FRIENDS_WITH'],
});

if (path.path) {
  console.log(`Path length: ${path.path.length}`);
  console.log('Connected through:', path.path.nodes.map(n => n.properties.name));
}
```

## Next Steps

Now that you have your graph database set up, learn how to:

- [Work with Nodes](./nodes) - Create, update, query, and delete nodes
- [Manage Relationships](./relationships) - Connect nodes with typed relationships
- [Traverse Graphs](./traversals) - Find paths and explore neighborhoods
- [Advanced Querying](./querying) - Complex filters and pattern matching
- [Use Transactions](./transactions) - Ensure data consistency
- [Best Practices](./best-practices) - Production patterns and optimization

## See Also

* [Graph Overview](./overview) - Full API reference
* [Best Practices](./best-practices) - Performance and production patterns
