---
sidebar_position: 1
---

# Features

A Feature is a workflow that chains multiple operations together. Instead of writing separate code for API calls, database writes, and notifications, you define them once as a feature and run it with a single call.

## What Can Features Do?

A single feature can:

- **Call external APIs** via your connected apps
- **Read and write to databases**
- **Send notifications** (email, SMS, push)
- **Upload files** to cloud storage
- **Publish messages** to message brokers
- **Run other features** for complex workflows
- **Apply quotas and fallbacks** for resilience

## How Features Work

Every feature has three parts:

1. **Input** - What data does this feature need?
2. **Sequence** - What operations should run, and in what order?
3. **Output** - What result should be returned?

```
Input → [Event 1] → [Event 2] → [Event 3] → Output
```

---

## Creating a Feature

```typescript
await ductape.feature.create({
  name: 'Process Order',
  tag: 'process-order',
  description: 'Validates order, charges payment, sends confirmation',
  input_type: 'JSON',
  input: {
    orderId: { type: 'STRING' },
    amount: { type: 'FLOAT' },
    customerEmail: { type: 'EMAIL_STRING' }
  },
  sequence: [
    {
      tag: 'main',
      events: [
        // Event 1: Validate order via API
        {
          type: 'action',
          app: 'orders-api',
          event: 'validate-order',
          input: {
            body: { orderId: '$Input{orderId}' }
          },
          retries: 2,
          allow_fail: false
        },
        // Event 2: Charge payment
        {
          type: 'action',
          app: 'stripe',
          event: 'create-charge',
          input: {
            body: {
              amount: '$Input{amount}',
              currency: 'usd'
            }
          },
          retries: 3,
          allow_fail: false
        },
        // Event 3: Send confirmation email
        {
          type: 'notification',
          event: 'order-confirmed',
          input: {
            email: {
              recipients: ['$Input{customerEmail}'],
              subject: { orderId: '$Input{orderId}' },
              template: { orderId: '$Input{orderId}' }
            }
          },
          retries: 1,
          allow_fail: true
        }
      ]
    }
  ],
  output: {
    orderId: '$Input{orderId}',
    chargeId: '$Sequence{main}{create-charge}{id}',
    status: 'completed'
  }
});
```

---

## Event Types

Each event in a sequence has a `type` that determines what it does:

| Type | What It Does | Example Use |
|------|--------------|-------------|
| `action` | Calls an API from a connected app | Payment processing, data fetching |
| `database_action` | Runs a database operation | Insert user, query orders |
| `notification` | Sends a notification | Email, SMS, push notification |
| `storage` | Uploads or reads files | Store receipts, profile images |
| `publish` | Sends to a message broker | Queue background jobs |
| `feature` | Runs another feature | Compose complex workflows |
| `quota` | Applies rate limiting | Limit API calls per user |
| `fallback` | Provides backup options | Switch providers on failure |

### Action Event

Call an API from a connected app:

```typescript
{
  type: 'action',
  app: 'stripe',           // Your app's access tag
  event: 'create-charge',  // The action to call
  input: {
    body: { amount: '$Input{amount}' }
  },
  retries: 3,
  allow_fail: false
}
```

### Database Event

Run a database operation:

```typescript
{
  type: 'database_action',
  event: 'users-db:insert-user',  // database-tag:action-tag
  input: {
    data: {
      email: '$Input{email}',
      name: '$Input{name}'
    }
  },
  retries: 1,
  allow_fail: false
}
```

### Notification Event

Send an email, SMS, or push notification:

```typescript
{
  type: 'notification',
  event: 'email-service:welcome-email',
  input: {
    email: {
      recipients: ['$Input{email}'],
      subject: { name: '$Input{name}' },
      template: { name: '$Input{name}' }
    }
  },
  retries: 2,
  allow_fail: true
}
```

### Storage Event

Upload a file to cloud storage:

```typescript
{
  type: 'storage',
  event: 's3-storage:user-uploads',
  input: {
    buffer: '$Input{fileData}',
    fileName: '$Input{fileName}',
    mimeType: 'image/png'
  },
  retries: 2,
  allow_fail: false
}
```

### Publish Event

Send a message to a broker:

```typescript
{
  type: 'publish',
  event: 'order-events:new-orders',
  input: {
    message: {
      orderId: '$Input{orderId}',
      status: 'created'
    }
  },
  retries: 2,
  allow_fail: true
}
```

---

## Data Piping

Pass data between events using special notation:

| Syntax | Description | Example |
|--------|-------------|---------|
| `$Input{field}` | Value from feature input | `$Input{email}` |
| `$Sequence{seq}{event}{field}` | Result from a previous event | `$Sequence{main}{create-charge}{id}` |
| `$Variable{app}{key}` | App variable value | `$Variable{stripe}{api_version}` |
| `$Constant{app}{key}` | App constant value | `$Constant{config}{currency}` |
| `$Session{tag}{field}` | Session data value | `$Session{user}{id}` |

### Example: Chaining Results

```typescript
sequence: [
  {
    tag: 'main',
    events: [
      // First event creates a user
      {
        type: 'database_action',
        event: 'users-db:create-user',
        input: { data: { email: '$Input{email}' } },
        retries: 1,
        allow_fail: false
      },
      // Second event uses the created user's ID
      {
        type: 'action',
        app: 'email-service',
        event: 'send-welcome',
        input: {
          body: {
            userId: '$Sequence{main}{create-user}{id}',  // References first event's result
            email: '$Input{email}'
          }
        },
        retries: 2,
        allow_fail: true
      }
    ]
  }
]
```

---

## Event Options

Every event can have these options:

| Option | Type | Description |
|--------|------|-------------|
| `retries` | number | How many times to retry on failure |
| `allow_fail` | boolean | If `true`, continue even if this event fails |
| `return` | boolean | If `true`, return this event's result in the output |
| `cache` | string | Cache tag to store/retrieve results |

---

## Best Practices

1. **Start simple** - Begin with 2-3 events, add complexity gradually
2. **Use descriptive tags** - `process-order` is better than `po1`
3. **Handle failures** - Set `allow_fail: true` for non-critical events like notifications
4. **Use retries wisely** - More retries for unreliable external APIs
5. **Keep inputs flat** - Avoid nested objects in your input schema

## See Also

- [Running Features](./run) - How to execute features
- [Defining Inputs](./inputs) - Input validation and types
- [Defining Outputs](./output) - Output mapping syntax
- [Jobs](../jobs/overview) - Schedule features to run automatically
