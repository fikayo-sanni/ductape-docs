# Database Triggers

Triggers are automated actions that execute in response to database events. They integrate seamlessly with Ductape primitives including storage, actions, notifications, brokers, workflows, cache, quotas, fallbacks, and more.

Triggers are stored on the Ductape backend, allowing them to be managed across your team and environments.

## Overview

Triggers allow you to:
- Execute actions before or after database operations
- Send notifications when data changes
- Publish events to message brokers
- Update cache entries
- Execute workflows
- Run AI agents
- Make HTTP calls
- Persist trigger configurations to the backend
- And much more

## Quick Start

```typescript
import ductape from './ductape';

const { databases } = ductape;

// Connect to your database
const db = await databases.connect({
  env: 'prd',
  product: 'my-product',
  database: 'my-db',
});

// Create a trigger (persisted to backend)
await db.triggers.create({
  tag: 'send-welcome-email',
  name: 'Send Welcome Email',
  description: 'Send welcome email after user registration',
  events: ['afterInsert'],
  tables: ['users'],
  actions: [{
    type: 'notification.email',
    name: 'send-email',
    config: {
      notification: 'emails:welcome-message',
      recipients: ['{{record.email}}'],
      subject: { userName: '{{record.name}}' },
      template: {
        name: '{{record.name}}',
        email: '{{record.email}}',
      },
    },
  }],
});

// Load triggers from backend into memory
await db.triggers.load();

// Set Ductape instance for action execution
db.triggers.setDuctapeInstance(ductape);
```

## Trigger Events

| Event | Description |
|-------|-------------|
| `BEFORE_INSERT` | Before a record is inserted |
| `AFTER_INSERT` | After a record is inserted |
| `BEFORE_UPDATE` | Before a record is updated |
| `AFTER_UPDATE` | After a record is updated |
| `BEFORE_DELETE` | Before a record is deleted |
| `AFTER_DELETE` | After a record is deleted |
| `BEFORE_WRITE` | Before any write operation |
| `AFTER_WRITE` | After any write operation |

## Trigger Actions

Triggers can execute various action types that integrate with Ductape primitives:

### Database Actions

```typescript
// Insert into another table
Trigger.database.insert('audit_logs', {
  action: 'user_created',
  user_id: '{{record.id}}',
  timestamp: '{{timestamp}}',
});

// Update related records
Trigger.database.update(
  'user_stats',
  { login_count: { $INC: 1 } },
  { user_id: '{{record.id}}' }
);

// Delete related records
Trigger.database.delete('temp_data', {
  user_id: '{{record.id}}',
});
```

### Storage Actions

```typescript
// Upload a file
Trigger.storage.upload('my-storage', '/users/{{record.id}}/avatar.png', {
  dataField: 'avatarBase64',
  mimeType: 'image/png',
});

// Delete a file
Trigger.storage.delete('my-storage', '/users/{{record.id}}/avatar.png');

// Copy a file
Trigger.storage.copy(
  'my-storage',
  '/templates/default-avatar.png',
  '/users/{{record.id}}/avatar.png'
);
```

### Notification Actions

Notification actions match the Ductape notification primitives API. The `notification` parameter uses the format `notification_tag:message_tag`.

```typescript
// Send email
// - recipients: array of email addresses
// - subject: template variables for email subject
// - template: template variables for email body
Trigger.notification.email('emails:welcome-message', ['{{record.email}}'], {
  subject: { userName: '{{record.name}}' },
  template: {
    name: '{{record.name}}',
    activationLink: '{{record.activation_url}}'
  },
});

// Send SMS
// - recipients: array of phone numbers
// - body: template variables for message body
Trigger.notification.sms('sms:verification-code', ['{{record.phone}}'], {
  body: { code: '{{record.verification_code}}' },
});

// Send push notification
// - device_tokens: array of device tokens
// - title: template variables for notification title
// - body: template variables for notification body
// - data: additional payload data
Trigger.notification.push('push:new-message', {
  device_tokens: ['{{record.device_token}}'],
  title: { sender: '{{record.sender_name}}' },
  body: { preview: '{{record.message_preview}}' },
  data: { messageId: '{{record.id}}', conversationId: '{{record.conversation_id}}' },
});

// Send callback/webhook
Trigger.notification.callback('webhooks:order-created', {
  callback: {
    body: {
      orderId: '{{record.id}}',
      customerEmail: '{{record.customer_email}}',
      total: '{{record.total}}',
    },
    headers: {
      'X-Order-Id': '{{record.id}}',
    },
  },
});
```

### Broker Actions

```typescript
// Publish to message broker
Trigger.broker.publish('kafka:user-events', {
  type: 'user.created',
  userId: '{{record.id}}',
  email: '{{record.email}}',
  timestamp: '{{timestamp}}',
});
```

### Cache Actions

```typescript
// Set cache value
Trigger.cache.set('redis-cache', 'user:{{record.id}}', '{{record}}', 3600);

// Invalidate cache
Trigger.cache.invalidate('redis-cache', 'user:*');

// Delete cache key
Trigger.cache.delete('redis-cache', 'user:{{record.id}}');
```

### Workflow Actions

```typescript
// Execute workflow and wait for completion
Trigger.workflow.execute('onboarding-workflow', {
  userId: '{{record.id}}',
  email: '{{record.email}}',
});

// Dispatch workflow asynchronously
Trigger.workflow.dispatch('background-sync', {
  recordId: '{{record.id}}',
});
```

### App Action Execution

```typescript
// Execute an app action
Trigger.action.execute('stripe', 'create-customer', {
  email: '{{record.email}}',
  name: '{{record.name}}',
});
```

### AI Agent Actions

```typescript
// Run an AI agent
Trigger.agent.run('support-agent',
  'Analyze this new user registration and suggest personalized onboarding steps',
  { userData: '{{record}}' }
);
```

### HTTP Actions

```typescript
// Make HTTP requests
Trigger.http.post('https://api.example.com/webhooks', {
  event: 'user.created',
  data: '{{record}}',
}, {
  headers: { 'X-API-Key': 'your-api-key' },
});

Trigger.http.get('https://api.example.com/validate?email={{record.email}}');
```

### Log Actions

```typescript
// Create log entries
Trigger.log.info('New user registered: {{record.email}}', {
  userId: '{{record.id}}',
  source: 'trigger',
});

Trigger.log.error('Failed validation for {{record.email}}', {
  errors: '{{record.validation_errors}}',
});
```

### Custom Function Actions

```typescript
// Execute custom logic
Trigger.custom(async (context) => {
  const { record, previousRecord, changedFields } = context;

  // Your custom logic here
  console.log('Processing record:', record.id);

  return { processed: true };
});
```

## Conditions

Triggers support conditions to control when they execute:

### Simple Conditions

```typescript
db.triggers.register('orders', {
  name: 'notify-high-value-order',
  events: [TriggerEvent.AFTER_INSERT],
  condition: {
    field: 'record.total',
    operator: ConditionOperator.GREATER_THAN,
    value: 1000,
  },
  actions: [
    Trigger.notification.email('admin-notifications', 'admin@company.com', {
      subject: 'High Value Order: ${{record.total}}',
    }),
  ],
});
```

### Compound Conditions

```typescript
// Using the condition builder
const { Trigger } = db.triggers;

db.triggers.register('users', {
  name: 'premium-user-welcome',
  events: [TriggerEvent.AFTER_INSERT],
  condition: Trigger.when.and(
    Trigger.when.field('record.subscription').equals('premium'),
    Trigger.when.field('record.verified').equals(true)
  ),
  actions: [
    Trigger.notification.email('premium-emails', '{{record.email}}', {
      subject: 'Welcome to Premium!',
    }),
  ],
});

// OR conditions
condition: Trigger.when.or(
  Trigger.when.field('record.role').equals('admin'),
  Trigger.when.field('record.role').equals('superadmin')
)

// NOT conditions
condition: Trigger.when.not(
  Trigger.when.field('record.status').equals('deleted')
)
```

### Condition Operators

| Operator | Description |
|----------|-------------|
| `EQUALS` | Equal to value |
| `NOT_EQUALS` | Not equal to value |
| `GREATER_THAN` | Greater than value |
| `GREATER_THAN_OR_EQUALS` | Greater than or equal |
| `LESS_THAN` | Less than value |
| `LESS_THAN_OR_EQUALS` | Less than or equal |
| `IN` | Value in array |
| `NOT_IN` | Value not in array |
| `CONTAINS` | String contains |
| `STARTS_WITH` | String starts with |
| `ENDS_WITH` | String ends with |
| `MATCHES` | Regex match |
| `IS_NULL` | Value is null/undefined |
| `IS_NOT_NULL` | Value is not null |
| `IS_EMPTY` | Value is empty |
| `IS_NOT_EMPTY` | Value is not empty |
| `CHANGED` | Field was changed (updates) |
| `NOT_CHANGED` | Field was not changed |
| `CHANGED_TO` | Field changed to specific value |
| `CHANGED_FROM` | Field changed from specific value |

## Template Placeholders

Triggers support template placeholders using `{{field}}` syntax:

| Placeholder | Description |
|-------------|-------------|
| `{{record.fieldName}}` | Current record field value |
| `{{previousRecord.fieldName}}` | Previous record value (updates only) |
| `{{event}}` | Trigger event name |
| `{{table}}` | Table/collection name |
| `{{database}}` | Database tag |
| `{{env}}` | Environment slug |
| `{{timestamp}}` | Current timestamp |
| `{{operation}}` | Operation type (insert/update/delete) |
| `{{user.id}}` | User ID (if available) |

## Execution Timing

Control when trigger actions execute:

```typescript
{
  type: TriggerActionType.NOTIFICATION_EMAIL,
  timing: TriggerTiming.ASYNC, // Don't block the database operation
  // ...
}
```

| Timing | Description |
|--------|-------------|
| `SYNC` | Execute synchronously, block until complete |
| `ASYNC` | Execute asynchronously, don't wait |
| `QUEUED` | Queue for background processing |

## Retry Configuration

Configure retry behavior for failed actions:

```typescript
{
  type: TriggerActionType.CUSTOM_HTTP,
  url: 'https://api.example.com/webhook',
  retry: {
    maxAttempts: 3,
    initialDelay: 1000, // 1 second
    maxDelay: 30000,    // 30 seconds
    backoffMultiplier: 2,
    retryOn: ['ECONNREFUSED', 'ETIMEDOUT'],
  },
  // ...
}
```

## Error Handling

### Continue on Error

Allow subsequent actions to execute even if one fails:

```typescript
db.triggers.register('users', {
  name: 'multi-step-trigger',
  events: [TriggerEvent.AFTER_INSERT],
  actions: [
    {
      ...Trigger.notification.email('email-service', '{{record.email}}'),
      continueOnError: true, // Continue to next action even if this fails
    },
    Trigger.log.info('User created: {{record.id}}'),
  ],
});
```

### Global Error Handler

```typescript
const processor = db.triggers.getProcessor();

processor.config.onError = (error, context, trigger) => {
  console.error(`Trigger ${trigger.name} failed:`, error.message);
  // Send to error tracking service
};
```

## Priority

Control execution order when multiple triggers match:

```typescript
db.triggers.register('users', {
  name: 'high-priority-trigger',
  priority: 1, // Lower number = higher priority
  events: [TriggerEvent.AFTER_INSERT],
  actions: [/* ... */],
});

db.triggers.register('users', {
  name: 'low-priority-trigger',
  priority: 100,
  events: [TriggerEvent.AFTER_INSERT],
  actions: [/* ... */],
});
```

## Complete Example

```typescript
import ductape from './ductape';
const { databases } = ductape;

const db = await databases.connect({
  env: 'prd',
  product: 'ecommerce',
  database: 'orders-db',
});

const { Trigger, TriggerEvent } = db.triggers;

// Set the Ductape instance for primitive integration
db.triggers.setDuctapeInstance(ductape);

// Register order processing trigger
db.triggers.register('orders', {
  name: 'process-new-order',
  description: 'Process new orders: send confirmation, update inventory, notify warehouse',
  events: [TriggerEvent.AFTER_INSERT],
  enabled: true,
  priority: 1,
  condition: Trigger.when.field('record.status').equals('confirmed'),
  actions: [
    // 1. Send order confirmation email
    {
      ...Trigger.notification.email('order-emails', '{{record.customer_email}}', {
        subject: 'Order Confirmation #{{record.order_number}}',
        variables: {
          orderNumber: '{{record.order_number}}',
          total: '{{record.total}}',
          items: '{{record.items}}',
        },
      }),
      name: 'send-confirmation-email',
      timing: 'async',
    },

    // 2. Update inventory
    {
      ...Trigger.workflow.dispatch('update-inventory', {
        orderId: '{{record.id}}',
        items: '{{record.items}}',
      }),
      name: 'update-inventory',
    },

    // 3. Notify warehouse
    {
      ...Trigger.broker.publish('rabbitmq:warehouse-queue', {
        type: 'new-order',
        orderId: '{{record.id}}',
        shippingAddress: '{{record.shipping_address}}',
        priority: '{{record.shipping_priority}}',
      }),
      name: 'notify-warehouse',
    },

    // 4. Cache order for quick access
    {
      ...Trigger.cache.set('redis', 'order:{{record.id}}', '{{record}}', 86400),
      name: 'cache-order',
      continueOnError: true,
    },

    // 5. Log the order
    Trigger.log.info('Order {{record.order_number}} processed successfully', {
      orderId: '{{record.id}}',
      total: '{{record.total}}',
      customer: '{{record.customer_email}}',
    }),
  ],
});

// Register order cancellation trigger
db.triggers.register('orders', {
  name: 'process-order-cancellation',
  events: [TriggerEvent.AFTER_UPDATE],
  condition: Trigger.when.and(
    Trigger.when.field('record.status').changedTo('cancelled'),
    Trigger.when.field('previousRecord.status').notEquals('cancelled')
  ),
  actions: [
    // Refund payment
    Trigger.action.execute('stripe', 'refund-payment', {
      paymentIntentId: '{{record.payment_intent_id}}',
      amount: '{{record.total}}',
    }),

    // Send cancellation email
    Trigger.notification.email('order-emails', '{{record.customer_email}}', {
      subject: 'Order Cancelled #{{record.order_number}}',
    }),

    // Restore inventory
    Trigger.workflow.execute('restore-inventory', {
      orderId: '{{record.id}}',
      items: '{{record.items}}',
    }),

    // Invalidate cache
    Trigger.cache.delete('redis', 'order:{{record.id}}'),
  ],
});
```

## API Reference

### Backend Operations (Persistent)

#### `triggers.create(data)`

Create a trigger and store it on the backend.

```typescript
await db.triggers.create({
  tag: 'my-trigger',
  name: 'My Trigger',
  events: ['afterInsert'],
  tables: ['users'],
  actions: [{ type: 'log.create', config: { message: 'User created' } }],
});
```

#### `triggers.update(data)`

Update an existing trigger on the backend.

```typescript
await db.triggers.update({
  tag: 'my-trigger',
  enabled: false,
});
```

#### `triggers.fetch(triggerTag)`

Fetch a specific trigger from the backend.

```typescript
const trigger = await db.triggers.fetch('my-trigger');
```

#### `triggers.fetchAll()`

Fetch all triggers for this database from the backend.

```typescript
const triggers = await db.triggers.fetchAll();
```

#### `triggers.delete(triggerTag)`

Delete a trigger from the backend.

```typescript
await db.triggers.delete('my-trigger');
```

#### `triggers.load()`

Load all triggers from the backend and register them in memory for execution.

```typescript
await db.triggers.load();
```

### In-Memory Operations

#### `triggers.register(table, definition)`

Register a trigger in memory for the current session (does not persist to backend).

#### `triggers.unregister(table, triggerName)`

Remove a trigger from memory by name.

#### `triggers.getTriggersForEvent(table, event)`

Get all triggers that match a table and event.

#### `triggers.execute(event, context)`

Manually execute triggers for an event.

#### `triggers.setDuctapeInstance(instance)`

Set the Ductape instance for executing primitive actions.

#### `triggers.getProcessor()`

Get the underlying TriggerProcessor instance for advanced configuration.
