---
sidebar_position: 3
---

# Agent Tools

Tools are functions that agents can invoke to interact with external systems, retrieve data, or perform actions. This guide covers how to create, configure, and manage tools.

## Tool Anatomy

Every tool has these components:

```typescript
{
  tag: 'tool-identifier',           // Unique identifier
  name: 'Human Readable Name',      // Optional display name
  description: 'What this tool does', // LLM uses this to decide when to call
  parameters: {                     // Input schema
    param1: {
      type: 'string',
      description: 'Parameter description',
      required: true,
    },
  },
  handler: async (ctx, params) => { // Implementation
    return result;
  },
  requiresConfirmation: false,      // Needs human approval?
  timeout: 30000,                   // Timeout in ms
  retries: 2,                       // Retry on failure
  costEstimate: 0.01,               // Estimated cost per call
}
```

## Parameter Types

### String

```typescript
parameters: {
  name: {
    type: 'string',
    description: 'User name',
    required: true,
  },
  email: {
    type: 'string',
    description: 'Email address',
    required: true,
  },
}
```

### Number

```typescript
parameters: {
  amount: {
    type: 'number',
    description: 'Amount in dollars',
    required: true,
  },
  quantity: {
    type: 'number',
    description: 'Number of items',
    default: 1,
  },
}
```

### Boolean

```typescript
parameters: {
  includeArchived: {
    type: 'boolean',
    description: 'Include archived items in results',
    default: false,
  },
}
```

### Enum (Constrained Values)

```typescript
parameters: {
  status: {
    type: 'string',
    description: 'Order status',
    enum: ['pending', 'processing', 'shipped', 'delivered'],
    required: true,
  },
  priority: {
    type: 'string',
    description: 'Priority level',
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
  },
}
```

### Array

```typescript
parameters: {
  tags: {
    type: 'array',
    description: 'List of tags to apply',
    items: { type: 'string' },
  },
  productIds: {
    type: 'array',
    description: 'List of product IDs',
    items: { type: 'number' },
    required: true,
  },
}
```

### Object

```typescript
parameters: {
  address: {
    type: 'object',
    description: 'Shipping address',
    properties: {
      street: { type: 'string', description: 'Street address' },
      city: { type: 'string', description: 'City' },
      state: { type: 'string', description: 'State/Province' },
      zip: { type: 'string', description: 'ZIP/Postal code' },
      country: { type: 'string', description: 'Country' },
    },
    required: true,
  },
}
```

---

## Tool Handler Context

The handler receives a context object with access to Ductape resources:

```typescript
handler: async (ctx, params) => {
  // Execution metadata
  ctx.executionId;    // Unique execution ID
  ctx.agentTag;       // Agent tag
  ctx.env;            // Environment (dev, staging, prd)
  ctx.product;        // Product tag
  ctx.iteration;      // Current iteration number
  ctx.sessionId;      // Session ID for memory

  // Input data
  ctx.input;          // Original user input

  // History
  ctx.conversationHistory;  // Message history
  ctx.toolCallHistory;      // Previous tool calls

  // Custom state
  ctx.state;          // Agent state object
  ctx.setState(key, value);
  ctx.getState(key);

  // Ductape resources (see below)
  ctx.action;
  ctx.database;
  ctx.graph;
  ctx.storage;
  ctx.notification;
  ctx.publish;
  ctx.feature;

  // Memory operations
  ctx.remember(data);  // Store in vector memory
  ctx.recall(query);   // Query vector memory
}
```

---

## Accessing Ductape Resources

### Actions (External APIs)

```typescript
handler: async (ctx, params) => {
  const response = await ctx.action.run({
    app: 'stripe',
    event: 'create-charge',
    input: {
      amount: params.amount * 100,
      currency: 'usd',
      customer: params.customerId
    },
    retries: 3,
    timeout: 10000,
  });

  return { chargeId: response.id, status: response.status };
}
```

The `input` uses **flat format** - fields are automatically resolved to body, params, query, or headers based on the action's schema. For explicit placement, use prefixes like `'headers:X-Custom': 'value'`.

### Databases

```typescript
handler: async (ctx, params) => {
  // Query
  const users = await ctx.database.query({
    database: 'users-db',
    event: 'find-users',
    params: { status: 'active' },
  });

  // Insert
  const newUser = await ctx.database.insert({
    database: 'users-db',
    event: 'create-user',
    data: { email: params.email, name: params.name },
  });

  // Update
  await ctx.database.update({
    database: 'users-db',
    event: 'update-user',
    where: { id: params.userId },
    data: { status: 'verified' },
  });

  // Delete
  await ctx.database.delete({
    database: 'users-db',
    event: 'delete-user',
    where: { id: params.userId },
  });

  return { success: true };
}
```

### Graph Databases

```typescript
handler: async (ctx, params) => {
  // Create node
  const node = await ctx.graph.createNode({
    graph: 'social-graph',
    labels: ['User'],
    properties: { name: params.name },
  });

  // Create relationship
  await ctx.graph.createRelationship({
    graph: 'social-graph',
    from: node.id,
    to: params.friendId,
    type: 'FRIENDS_WITH',
  });

  // Query
  const friends = await ctx.graph.query({
    graph: 'social-graph',
    action: 'find-friends',
    params: { userId: params.userId },
  });

  return { friends };
}
```

### Storage

```typescript
handler: async (ctx, params) => {
  // Upload
  const file = await ctx.storage.upload({
    storage: 'documents',
    event: 'upload-file',
    input: {
      buffer: params.fileData,
      fileName: params.fileName,
      mimeType: params.mimeType,
    },
  });

  // Download
  const download = await ctx.storage.download({
    storage: 'documents',
    event: 'get-file',
    input: { file_key: params.fileKey },
  });

  // Delete
  await ctx.storage.delete({
    storage: 'documents',
    event: 'remove-file',
    input: { file_key: params.fileKey },
  });

  return { url: file.url };
}
```

### Notifications

```typescript
handler: async (ctx, params) => {
  // Email
  await ctx.notification.email({
    notification: 'transactional',
    event: 'order-confirmation',
    recipients: [params.email],
    subject: { orderId: params.orderId },
    template: { orderId: params.orderId, items: params.items },
  });

  // SMS
  await ctx.notification.sms({
    notification: 'alerts',
    event: 'shipping-update',
    phones: [params.phone],
    message: { trackingNumber: params.tracking },
  });

  // Push
  await ctx.notification.push({
    notification: 'mobile',
    event: 'new-message',
    tokens: [params.deviceToken],
    title: { sender: params.senderName },
    body: { preview: params.messagePreview },
  });

  return { sent: true };
}
```

### Message Publishing

```typescript
handler: async (ctx, params) => {
  await ctx.publish.send({
    broker: 'order-events',
    event: 'order-created',
    input: {
      message: {
        orderId: params.orderId,
        customerId: params.customerId,
        items: params.items,
      },
    },
    retries: 3,
  });

  return { published: true };
}
```

### Features (Workflows)

```typescript
handler: async (ctx, params) => {
  const result = await ctx.feature.run({
    feature: 'process-order',
    input: {
      orderId: params.orderId,
      action: 'fulfill',
    },
  });

  return result;
}
```

---

## Vector Memory Operations

### Remember (Store)

```typescript
handler: async (ctx, params) => {
  await ctx.remember({
    content: params.information,
    metadata: {
      type: 'user_preference',
      userId: ctx.sessionId,
      category: params.category,
      timestamp: new Date().toISOString(),
    },
  });

  return { stored: true };
}
```

### Recall (Query)

```typescript
handler: async (ctx, params) => {
  const memories = await ctx.recall({
    query: params.query,
    topK: 5,
    filter: {
      userId: ctx.sessionId,
      type: 'user_preference',
    },
    minScore: 0.7,
  });

  return {
    found: memories.matches.length,
    results: memories.matches.map((m) => m.metadata),
  };
}
```

---

## Portable Tools with handlerRef

For tools that should work when loaded from the database, use `handlerRef` instead of inline handlers:

```typescript
tools: [
  {
    tag: 'process-payment',
    description: 'Process a payment',
    parameters: {
      amount: { type: 'number', required: true },
      customerId: { type: 'string', required: true },
    },
    handlerRef: 'action:stripe:create-charge',
  },
  {
    tag: 'get-customer',
    description: 'Look up customer information',
    parameters: {
      customerId: { type: 'string', required: true },
    },
    handlerRef: 'database:customers-db:find-customer',
  },
  {
    tag: 'run-checkout',
    description: 'Run checkout workflow',
    parameters: {
      cartId: { type: 'string', required: true },
    },
    handlerRef: 'feature:checkout-flow',
  },
]
```

### handlerRef Format

`type:tag:event`

| Type | Format | Description |
|------|--------|-------------|
| `action` | `action:app-tag:event` | Call an app action |
| `database` | `database:db-tag:event` | Database query |
| `graph` | `graph:graph-tag:action` | Graph operation |
| `storage` | `storage:storage-tag:event` | Storage operation |
| `notification` | `notification:notif-tag:event` | Send notification |
| `publish` | `publish:broker-tag:event` | Publish message |
| `feature` | `feature:feature-tag` | Run feature |

---

## Tool Options

### Timeout

Set maximum execution time:

```typescript
{
  tag: 'slow-operation',
  description: 'A slow operation',
  timeout: 60000,  // 60 seconds
  handler: async (ctx, params) => {
    // Long-running operation
  },
}
```

### Retries

Automatically retry on failure:

```typescript
{
  tag: 'unreliable-api',
  description: 'Call an unreliable API',
  retries: 3,  // Retry up to 3 times
  handler: async (ctx, params) => {
    // May fail occasionally
  },
}
```

### Human Approval

Require confirmation before execution:

```typescript
{
  tag: 'delete-account',
  description: 'Permanently delete a user account',
  requiresConfirmation: true,
  handler: async (ctx, params) => {
    // Destructive operation
  },
}
```

### Cost Estimation

Track estimated costs:

```typescript
{
  tag: 'expensive-operation',
  description: 'An operation that costs money',
  costEstimate: 0.10,  // $0.10 per call
  handler: async (ctx, params) => {
    // Paid API call
  },
}
```

---

## Best Practices

### 1. Write Clear Descriptions

The LLM uses descriptions to decide when to use tools:

```typescript
// Good - specific and actionable
description: 'Search for products by name, category, or price range. Returns matching products with prices and availability.'

// Bad - vague
description: 'Search products'
```

### 2. Use Descriptive Parameter Names

```typescript
// Good
parameters: {
  customerEmail: { type: 'string', description: 'Customer email address' },
  orderDateFrom: { type: 'string', description: 'Start date for order search (YYYY-MM-DD)' },
}

// Bad
parameters: {
  e: { type: 'string' },
  d: { type: 'string' },
}
```

### 3. Return Structured Data

```typescript
// Good - structured, informative
handler: async (ctx, params) => {
  const order = await getOrder(params.orderId);
  return {
    found: true,
    order: {
      id: order.id,
      status: order.status,
      total: order.total,
      items: order.items.length,
    },
  };
}

// Bad - unstructured
handler: async (ctx, params) => {
  return await getOrder(params.orderId);
}
```

### 4. Handle Errors Gracefully

```typescript
handler: async (ctx, params) => {
  try {
    const result = await riskyOperation(params);
    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      suggestion: 'Try with different parameters',
    };
  }
}
```

### 5. Validate Inputs

```typescript
handler: async (ctx, params) => {
  // Validate email format
  if (!isValidEmail(params.email)) {
    return { error: 'Invalid email format' };
  }

  // Validate amount
  if (params.amount <= 0) {
    return { error: 'Amount must be positive' };
  }

  // Proceed with operation
  return await processPayment(params);
}
```

## Next Steps

- [Memory](./memory) - Configure agent memory
- [Human-in-the-Loop](./human-in-loop) - Add approval workflows
- [Examples](./examples) - See tools in action
