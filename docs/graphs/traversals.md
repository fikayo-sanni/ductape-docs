---
sidebar_position: 4
---

# Graph Traversals & Pathfinding

Learn how to traverse your graph, find paths between nodes, explore neighborhoods, and discover connections. Graph traversals unlock the true power of graph databases.

## Quick Example

```ts
// Find shortest path between two users
const path = await ductape.graph.shortestPath({
  startNodeId: aliceId,
  endNodeId: charlieId,
  relationshipTypes: ['FRIENDS_WITH'],
});

if (path.path) {
  console.log(`Distance: ${path.path.length} hops`);
  console.log('Path:', path.path.nodes.map(n => n.properties.name).join(' → '));
}

// Explore a user's network
const network = await ductape.graph.traverse({
  startNodeId: aliceId,
  direction: 'OUTGOING',
  relationshipTypes: ['FRIENDS_WITH', 'WORKS_WITH'],
  maxDepth: 2,
});

console.log(`Found ${network.paths.length} connections within 2 hops`);
```

## Graph Traversal

Traverse explores the graph starting from a node, following relationships up to a specified depth.

### Basic Traversal

```ts
const result = await ductape.graph.traverse({
  startNodeId: userId,
  direction: 'OUTGOING',
  relationshipTypes: ['FRIENDS_WITH'],
  maxDepth: 3,
});

console.log(`Found ${result.paths.length} paths`);

// Explore each path
result.paths.forEach(path => {
  console.log('Path length:', path.nodes.length);
  console.log('Nodes:', path.nodes.map(n => n.properties.name));
  console.log('Relationships:', path.relationships.map(r => r.type));
});
```

### Traversal Directions

#### Outgoing (default)
Follow relationships from start node to connected nodes:

```ts
// Find all people this user follows
const result = await ductape.graph.traverse({
  startNodeId: userId,
  direction: 'OUTGOING',
  relationshipTypes: ['FOLLOWS'],
  maxDepth: 1,
});
```

#### Incoming
Follow relationships pointing to the start node:

```ts
// Find all people who follow this user (followers)
const result = await ductape.graph.traverse({
  startNodeId: userId,
  direction: 'INCOMING',
  relationshipTypes: ['FOLLOWS'],
  maxDepth: 1,
});
```

#### Both
Follow relationships in both directions:

```ts
// Find all connected users (friends, followers, following)
const result = await ductape.graph.traverse({
  startNodeId: userId,
  direction: 'BOTH',
  relationshipTypes: ['FRIENDS_WITH', 'FOLLOWS'],
  maxDepth: 2,
});
```

### Multiple Relationship Types

Traverse across different types of relationships:

```ts
const result = await ductape.graph.traverse({
  startNodeId: userId,
  direction: 'OUTGOING',
  relationshipTypes: ['FRIENDS_WITH', 'WORKS_WITH', 'LIVES_NEAR'],
  maxDepth: 2,
});
```

### Depth Control

#### Direct Connections (Depth 1)

```ts
// Only immediate connections
const result = await ductape.graph.traverse({
  startNodeId: userId,
  maxDepth: 1,
});
```

#### Extended Network (Depth 2-3)

```ts
// Friends of friends
const result = await ductape.graph.traverse({
  startNodeId: userId,
  relationshipTypes: ['FRIENDS_WITH'],
  maxDepth: 2,
});

// Friends of friends of friends
const extended = await ductape.graph.traverse({
  startNodeId: userId,
  relationshipTypes: ['FRIENDS_WITH'],
  maxDepth: 3,
});
```

### Filter Traversal Results

```ts
const result = await ductape.graph.traverse({
  startNodeId: userId,
  relationshipTypes: ['FRIENDS_WITH'],
  maxDepth: 2,
  nodeFilter: {
    labels: ['Person'],
    where: { age: { $GTE: 18 }, status: 'active' },
  },
  relationshipFilter: {
    where: { closeness: { $IN: ['high', 'very high'] } },
  },
});
```

## Shortest Path

Find the shortest path between two nodes.

### Basic Shortest Path

```ts
const result = await ductape.graph.shortestPath({
  startNodeId: aliceId,
  endNodeId: bobId,
  relationshipTypes: ['FRIENDS_WITH'],
});

if (result.path) {
  console.log(`Distance: ${result.path.length} hops`);
  console.log('Nodes in path:', result.path.nodes.length);
  console.log('Relationships:', result.path.relationships.length);

  // Print the path
  const pathStr = result.path.nodes
    .map(n => n.properties.name)
    .join(' → ');
  console.log('Path:', pathStr);
} else {
  console.log('No path found');
}
```

### Weighted Shortest Path

Use relationship properties as weights:

```ts
const result = await ductape.graph.shortestPath({
  startNodeId: cityA,
  endNodeId: cityB,
  relationshipTypes: ['ROAD'],
  weightProperty: 'distance', // Use distance property as weight
});

if (result.path) {
  const totalDistance = result.path.relationships
    .reduce((sum, rel) => sum + rel.properties.distance, 0);

  console.log(`Total distance: ${totalDistance} km`);
}
```

### Maximum Depth Limit

Prevent expensive searches:

```ts
const result = await ductape.graph.shortestPath({
  startNodeId: aliceId,
  endNodeId: bobId,
  relationshipTypes: ['FRIENDS_WITH'],
  maxDepth: 5, // Only search up to 5 hops
});

if (!result.path) {
  console.log('No path found within 5 hops');
}
```

### Directed vs Undirected

```ts
// Directed - follow relationship direction
const result = await ductape.graph.shortestPath({
  startNodeId: aliceId,
  endNodeId: bobId,
  relationshipTypes: ['FOLLOWS'],
  directed: true,
});

// Undirected - ignore relationship direction
const result2 = await ductape.graph.shortestPath({
  startNodeId: aliceId,
  endNodeId: bobId,
  relationshipTypes: ['FRIENDS_WITH'],
  directed: false,
});
```

## All Paths

Find all paths between two nodes.

### Basic All Paths

```ts
const result = await ductape.graph.allPaths({
  startNodeId: aliceId,
  endNodeId: charlieId,
  maxDepth: 4,
  limit: 10, // Return at most 10 paths
});

console.log(`Found ${result.paths.length} paths`);

result.paths.forEach((path, index) => {
  console.log(`Path ${index + 1}: ${path.nodes.length} hops`);
  console.log(path.nodes.map(n => n.properties.name).join(' → '));
});
```

### Filter by Path Length

```ts
// Find all paths of exactly 3 hops
const result = await ductape.graph.allPaths({
  startNodeId: aliceId,
  endNodeId: charlieId,
  minDepth: 3,
  maxDepth: 3,
});
```

### Relationship Type Constraints

```ts
// Find paths using only certain relationship types
const result = await ductape.graph.allPaths({
  startNodeId: aliceId,
  endNodeId: charlieId,
  relationshipTypes: ['FRIENDS_WITH', 'WORKS_WITH'],
  maxDepth: 4,
  limit: 20,
});
```

## Neighborhood Exploration

Get all nodes within a certain distance from a starting node.

### Basic Neighborhood

```ts
const result = await ductape.graph.getNeighborhood({
  nodeId: userId,
  depth: 2,
  direction: 'BOTH',
});

console.log('Nodes in neighborhood:', result.nodes.length);
console.log('Relationships:', result.relationships.length);

// Group nodes by depth
const byDepth: Record<number, any[]> = {};
result.nodes.forEach(node => {
  const depth = node.distance || 0;
  byDepth[depth] = byDepth[depth] || [];
  byDepth[depth].push(node);
});

console.log('Depth 0 (start):', byDepth[0]?.length || 0);
console.log('Depth 1 (direct):', byDepth[1]?.length || 0);
console.log('Depth 2 (extended):', byDepth[2]?.length || 0);
```

### Filtered Neighborhood

```ts
const result = await ductape.graph.getNeighborhood({
  nodeId: userId,
  depth: 2,
  relationshipTypes: ['FRIENDS_WITH'],
  nodeFilter: {
    labels: ['Person'],
    where: {
      city: 'San Francisco',
      age: { $GTE: 25 },
    },
  },
});

console.log(`Found ${result.nodes.length} friends in SF over 25`);
```

### Neighborhood Statistics

```ts
const result = await ductape.graph.getNeighborhood({
  nodeId: userId,
  depth: 2,
});

// Analyze the neighborhood
const nodesByLabel: Record<string, number> = {};
result.nodes.forEach(node => {
  node.labels.forEach(label => {
    nodesByLabel[label] = (nodesByLabel[label] || 0) + 1;
  });
});

console.log('Node distribution:', nodesByLabel);
```

## Connected Components

Find groups of connected nodes in the graph.

### Find Components

```ts
const result = await ductape.graph.findConnectedComponents({
  relationshipTypes: ['FRIENDS_WITH'],
  labels: ['Person'],
});

console.log(`Found ${result.components.length} connected groups`);

result.components.forEach((component, index) => {
  console.log(`Group ${index + 1}: ${component.nodes.length} people`);
});
```

### Largest Component

```ts
const result = await ductape.graph.findConnectedComponents({
  relationshipTypes: ['FRIENDS_WITH'],
});

// Sort by size
const sorted = result.components.sort((a, b) => b.nodes.length - a.nodes.length);
const largest = sorted[0];

console.log(`Largest group has ${largest.nodes.length} members`);
```

## Use Case Examples

### Social Network: Degrees of Separation

```ts
async function degreesOfSeparation(user1Id: string, user2Id: string) {
  const path = await ductape.graph.shortestPath({
    startNodeId: user1Id,
    endNodeId: user2Id,
    relationshipTypes: ['FRIENDS_WITH'],
    maxDepth: 6, // Six degrees of separation
  });

  if (path.path) {
    const degrees = path.path.length;
    console.log(`${degrees} degree${degrees !== 1 ? 's' : ''} of separation`);

    // Show the connection path
    const names = path.path.nodes.map(n => n.properties.name);
    console.log(names.join(' knows '));

    return degrees;
  } else {
    console.log('Not connected within 6 degrees');
    return null;
  }
}
```

### Recommendation: Friend Suggestions

```ts
async function suggestFriends(userId: string) {
  // Find friends of friends
  const network = await ductape.graph.traverse({
    startNodeId: userId,
    relationshipTypes: ['FRIENDS_WITH'],
    maxDepth: 2,
  });

  // Get direct friends
  const directFriends = await ductape.graph.traverse({
    startNodeId: userId,
    relationshipTypes: ['FRIENDS_WITH'],
    maxDepth: 1,
  });

  const directFriendIds = new Set(directFriends.paths.map(p => p.nodes[p.nodes.length - 1].id));

  // Find friends of friends who aren't direct friends
  const suggestions = network.paths
    .map(p => p.nodes[p.nodes.length - 1])
    .filter(node => node.id !== userId && !directFriendIds.has(node.id));

  // Count mutual friends
  const mutualCounts = new Map<string, number>();
  suggestions.forEach(suggestion => {
    const count = mutualCounts.get(suggestion.id as string) || 0;
    mutualCounts.set(suggestion.id as string, count + 1);
  });

  // Sort by mutual friends
  const sorted = Array.from(new Set(suggestions))
    .sort((a, b) => {
      const countA = mutualCounts.get(a.id as string) || 0;
      const countB = mutualCounts.get(b.id as string) || 0;
      return countB - countA;
    });

  return sorted.slice(0, 10); // Top 10 suggestions
}
```

### Organization: Reporting Chain

```ts
async function getReportingChain(employeeId: string) {
  const path = await ductape.graph.traverse({
    startNodeId: employeeId,
    direction: 'OUTGOING',
    relationshipTypes: ['REPORTS_TO'],
    maxDepth: 10, // Prevent infinite loops
  });

  // Get the longest path (to top of org)
  const chainToTop = path.paths
    .sort((a, b) => b.nodes.length - a.nodes.length)[0];

  if (chainToTop) {
    console.log('Reporting chain:');
    chainToTop.nodes.forEach((node, index) => {
      const indent = '  '.repeat(index);
      console.log(`${indent}${node.properties.name} - ${node.properties.title}`);
    });
  }

  return chainToTop;
}
```

### Supply Chain: Find Suppliers

```ts
async function traceProductOrigin(productId: string) {
  const supplyChain = await ductape.graph.traverse({
    startNodeId: productId,
    direction: 'INCOMING',
    relationshipTypes: ['SUPPLIES', 'MANUFACTURES', 'PROVIDES'],
    maxDepth: 5,
  });

  // Find all unique suppliers
  const suppliers = new Set();
  supplyChain.paths.forEach(path => {
    path.nodes.forEach(node => {
      if (node.labels.includes('Supplier')) {
        suppliers.add(node);
      }
    });
  });

  console.log(`Product supplied by ${suppliers.size} entities`);
  return Array.from(suppliers);
}
```

### Knowledge Graph: Related Articles

```ts
async function findRelatedArticles(articleId: string, maxResults: number = 10) {
  // Find articles connected through shared topics, authors, or references
  const related = await ductape.graph.traverse({
    startNodeId: articleId,
    direction: 'BOTH',
    relationshipTypes: ['HAS_TOPIC', 'WRITTEN_BY', 'CITES'],
    maxDepth: 2,
  });

  // Score articles by number of connections
  const scores = new Map<string, number>();

  related.paths.forEach(path => {
    const targetNode = path.nodes[path.nodes.length - 1];

    if (targetNode.labels.includes('Article') && targetNode.id !== articleId) {
      const score = scores.get(targetNode.id as string) || 0;
      scores.set(targetNode.id as string, score + 1);
    }
  });

  // Sort by score and return top results
  const sorted = Array.from(scores.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxResults);

  return sorted.map(([id, score]) => ({ id, score }));
}
```

### Route Finding: Shortest Route

```ts
async function findShortestRoute(startCityId: string, endCityId: string) {
  const result = await ductape.graph.shortestPath({
    startNodeId: startCityId,
    endNodeId: endCityId,
    relationshipTypes: ['ROAD', 'HIGHWAY'],
    weightProperty: 'distance',
  });

  if (result.path) {
    // Calculate total distance and time
    let totalDistance = 0;
    let totalTime = 0;

    result.path.relationships.forEach(road => {
      totalDistance += road.properties.distance || 0;
      totalTime += road.properties.travelTime || 0;
    });

    console.log('Route:', result.path.nodes.map(n => n.properties.name).join(' → '));
    console.log(`Total distance: ${totalDistance} km`);
    console.log(`Estimated time: ${Math.round(totalTime / 60)} hours`);

    return {
      path: result.path,
      distance: totalDistance,
      time: totalTime,
    };
  }

  return null;
}
```

## Performance Tips

### 1. Limit Traversal Depth

```ts
// Good - reasonable depth
await ductape.graph.traverse({
  startNodeId: userId,
  maxDepth: 3,
});

// Careful - may be expensive
await ductape.graph.traverse({
  startNodeId: userId,
  maxDepth: 10, // Can explore many nodes
});
```

### 2. Filter Early

```ts
// Filter at query time, not after
await ductape.graph.traverse({
  startNodeId: userId,
  maxDepth: 2,
  nodeFilter: {
    labels: ['Person'],
    where: { status: 'active' },
  },
});
```

### 3. Limit Results

```ts
// Use limit for allPaths
await ductape.graph.allPaths({
  startNodeId: aliceId,
  endNodeId: bobId,
  maxDepth: 4,
  limit: 100, // Stop after finding 100 paths
});
```

### 4. Use Specific Relationship Types

```ts
// Better - specific types
await ductape.graph.traverse({
  relationshipTypes: ['FRIENDS_WITH', 'WORKS_WITH'],
});

// Slower - all relationships
await ductape.graph.traverse({
  // No relationship type filter
});
```

## Next Steps

- [Advanced Querying](./querying) - Pattern matching and complex queries
- [Work with Relationships](./relationships) - Create and manage relationships
- [Use Transactions](./transactions) - Ensure data consistency
- [Best Practices](./best-practices) - Performance optimization

## See Also

* [Graph Overview](./overview) - Full API reference
* [Best Practices](./best-practices) - Performance tips
