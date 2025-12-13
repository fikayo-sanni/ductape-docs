---
sidebar_position: 4
---

# Retry Strategies

Configure how Ductape handles job failures with automatic retries, backoff strategies, and error handling.

## Basic Retry Configuration

Every dispatch method accepts a `retries` parameter that specifies how many times a job should be retried if it fails:

```ts
const job = await ductape.actions.dispatch({
  env: 'prd',
  product: 'my-app',
  app: 'payment-service',
  event: 'process_payment',
  input: { body: { orderId: 'order_123' } },
  retries: 3  // Retry up to 3 times on failure
});
```

## Retry Behavior

When a job fails, Ductape automatically:

1. Captures the error details
2. Increments the retry counter
3. Schedules a retry after the backoff delay
4. Repeats until success or max retries reached

### Default Behavior

| Setting | Default Value |
|---------|---------------|
| Max retries | 0 (no retries) |
| Initial delay | 1 second |
| Backoff strategy | Exponential |
| Max delay | 5 minutes |

## Retry Options

Configure advanced retry behavior with the `retryConfig` option:

```ts
const job = await ductape.actions.dispatch({
  env: 'prd',
  product: 'my-app',
  app: 'email-service',
  event: 'send_email',
  input: { body: { to: 'user@example.com' } },
  retries: 5,
  retryConfig: {
    initialDelay: 2000,        // Start with 2 second delay
    maxDelay: 300000,          // Cap at 5 minutes
    backoffMultiplier: 2,      // Double delay each retry
    retryableErrors: ['TIMEOUT', 'RATE_LIMITED']
  }
});
```

### Retry Configuration Options

```ts
interface IRetryConfig {
  initialDelay?: number;      // Initial delay in ms (default: 1000)
  maxDelay?: number;          // Maximum delay in ms (default: 300000)
  backoffMultiplier?: number; // Multiplier for exponential backoff (default: 2)
  retryableErrors?: string[]; // Only retry on these error types
  nonRetryableErrors?: string[]; // Never retry on these error types
}
```

## Backoff Strategies

### Exponential Backoff (Default)

Delays increase exponentially with each retry:

```
Retry 1: 1s → Retry 2: 2s → Retry 3: 4s → Retry 4: 8s → Retry 5: 16s
```

```ts
const job = await ductape.actions.dispatch({
  env: 'prd',
  product: 'my-app',
  app: 'api-client',
  event: 'fetch_data',
  input: { body: {} },
  retries: 5,
  retryConfig: {
    initialDelay: 1000,
    backoffMultiplier: 2
  }
});
```

### Linear Backoff

Use a fixed delay between retries by setting `backoffMultiplier: 1`:

```ts
const job = await ductape.actions.dispatch({
  env: 'prd',
  product: 'my-app',
  app: 'notification-service',
  event: 'send_push',
  input: { body: {} },
  retries: 3,
  retryConfig: {
    initialDelay: 5000,
    backoffMultiplier: 1  // Fixed 5 second delay between retries
  }
});
```

### Custom Backoff with Jitter

Add randomness to prevent thundering herd:

```ts
const job = await ductape.actions.dispatch({
  env: 'prd',
  product: 'my-app',
  app: 'sync-service',
  event: 'sync_data',
  input: { body: {} },
  retries: 5,
  retryConfig: {
    initialDelay: 1000,
    backoffMultiplier: 2,
    jitter: true,          // Add random jitter (0-50% of delay)
    jitterPercent: 0.3     // Custom jitter percentage (30%)
  }
});
```

## Error-Based Retry Logic

### Retry Only Specific Errors

```ts
const job = await ductape.actions.dispatch({
  env: 'prd',
  product: 'my-app',
  app: 'payment-service',
  event: 'charge_card',
  input: { body: { amount: 99.99 } },
  retries: 3,
  retryConfig: {
    retryableErrors: [
      'TIMEOUT',
      'RATE_LIMITED',
      'SERVICE_UNAVAILABLE',
      'CONNECTION_ERROR'
    ]
  }
});
```

### Never Retry Certain Errors

```ts
const job = await ductape.actions.dispatch({
  env: 'prd',
  product: 'my-app',
  app: 'payment-service',
  event: 'charge_card',
  input: { body: { amount: 99.99 } },
  retries: 3,
  retryConfig: {
    nonRetryableErrors: [
      'INVALID_CARD',
      'INSUFFICIENT_FUNDS',
      'CARD_DECLINED',
      'FRAUD_DETECTED',
      'VALIDATION_ERROR'
    ]
  }
});
```

### Common Error Types

| Error Type | Description | Should Retry? |
|------------|-------------|---------------|
| `TIMEOUT` | Request timed out | Yes |
| `RATE_LIMITED` | Rate limit exceeded | Yes (with delay) |
| `SERVICE_UNAVAILABLE` | Service temporarily down | Yes |
| `CONNECTION_ERROR` | Network connectivity issue | Yes |
| `VALIDATION_ERROR` | Invalid input data | No |
| `NOT_FOUND` | Resource doesn't exist | No |
| `UNAUTHORIZED` | Authentication failed | No |
| `FORBIDDEN` | Permission denied | No |

## Retry Patterns by Use Case

### External API Calls

```ts
// API calls often fail due to rate limits or temporary issues
const job = await ductape.actions.dispatch({
  env: 'prd',
  product: 'integrations',
  app: 'stripe-service',
  event: 'create_subscription',
  input: {
    body: { customer_id: 'cus_123', plan: 'premium' }
  },
  retries: 5,
  retryConfig: {
    initialDelay: 2000,
    maxDelay: 60000,
    backoffMultiplier: 2,
    retryableErrors: ['TIMEOUT', 'RATE_LIMITED', 'SERVICE_UNAVAILABLE']
  }
});
```

### Email Delivery

```ts
// Email services may have temporary issues
const job = await ductape.notifications.dispatch({
  env: 'prd',
  product: 'notifications',
  notification: 'user-emails',
  event: 'send_welcome',
  input: {
    email: { recipients: ['user@example.com'] }
  },
  retries: 3,
  retryConfig: {
    initialDelay: 5000,
    backoffMultiplier: 2,
    nonRetryableErrors: ['INVALID_EMAIL', 'UNSUBSCRIBED']
  }
});
```

### Database Operations

```ts
// Database deadlocks and timeouts can be retried
const job = await ductape.databases.action.dispatch({
  env: 'prd',
  product: 'my-app',
  database: 'main-db',
  event: 'process_batch',
  input: { query: {}, data: { batch_id: 'batch_123' } },
  retries: 3,
  retryConfig: {
    initialDelay: 1000,
    retryableErrors: ['DEADLOCK', 'TIMEOUT', 'CONNECTION_LOST']
  }
});
```

### Message Publishing

```ts
// Message brokers may be temporarily unavailable
const job = await ductape.events.dispatch({
  env: 'prd',
  product: 'messaging',
  broker: 'kafka-main',
  event: 'order_created',
  input: {
    message: { orderId: 'order_123', status: 'created' }
  },
  retries: 5,
  retryConfig: {
    initialDelay: 500,
    maxDelay: 30000,
    backoffMultiplier: 2
  }
});
```

## Handling Final Failures

When a job exhausts all retries, you can handle the failure:

### Using Webhooks

```ts
// Configure webhook for failed jobs
await ductape.jobs.setWebhook({
  url: 'https://api.example.com/webhooks/job-failed',
  events: ['job.failed'],
  secret: 'your-secret'
});
```

### Polling for Failed Jobs

```ts
// Check for failed jobs and handle them
const failedJobs = await ductape.jobs.list({
  status: 'failed',
  from: Date.now() - 3600000  // Last hour
});

for (const job of failedJobs.jobs) {
  console.log(`Job ${job.id} failed after ${job.retry_count} attempts`);
  console.log(`Error: ${job.last_error}`);

  // Decide whether to retry manually or escalate
  if (job.retry_count < 10 && isRetryable(job.last_error)) {
    await ductape.jobs.retry(job.id, { delay: 60000 });
  } else {
    await escalateToSupport(job);
  }
}
```

### Dead Letter Queue Pattern

Store failed jobs for later analysis:

```ts
// When setting up webhooks
await ductape.jobs.setWebhook({
  url: 'https://api.example.com/webhooks/dead-letter',
  events: ['job.failed'],
  secret: 'your-secret'
});

// In your webhook handler
async function handleDeadLetter(payload) {
  // Store in dead letter collection
  await ductape.database.insert({
    table: 'dead_letter_queue',
    data: {
      job_id: payload.job.id,
      namespace: payload.job.namespace,
      product: payload.job.product,
      error: payload.job.error,
      failed_at: payload.timestamp,
      payload: JSON.stringify(payload.job)
    }
  });

  // Alert operations team
  await alertOps({
    message: `Job ${payload.job.id} moved to dead letter queue`,
    error: payload.job.error
  });
}
```

## Retry Monitoring

### View Retry Status

```ts
const job = await ductape.jobs.get('job_abc123');

console.log('Total retries configured:', job.retries);
console.log('Retries attempted:', job.retry_count);
console.log('Status:', job.status);
console.log('Last error:', job.last_error);
```

### Get Retry Statistics

```ts
const stats = await ductape.jobs.getStats({
  product: 'my-app',
  from: Date.now() - 86400000  // Last 24 hours
});

console.log('Total jobs:', stats.total);
console.log('Completed on first try:', stats.completed_first_try);
console.log('Completed after retry:', stats.completed_after_retry);
console.log('Failed after retries:', stats.failed);
console.log('Average retry count:', stats.avg_retry_count);
```

## Best Practices

### 1. Set Appropriate Retry Counts

| Job Type | Recommended Retries |
|----------|---------------------|
| Critical business logic | 5-10 |
| Email/notifications | 3-5 |
| External API calls | 3-5 |
| Data sync operations | 3-5 |
| Analytics/logging | 1-2 |

### 2. Use Exponential Backoff

Always use exponential backoff for external services to:
- Avoid overwhelming recovering services
- Respect rate limits
- Allow time for transient issues to resolve

### 3. Categorize Errors

Properly categorize errors to avoid:
- Retrying unrecoverable errors (wastes resources)
- Not retrying recoverable errors (misses opportunities)

### 4. Set Maximum Delays

Always set a `maxDelay` to ensure jobs don't wait too long:

```ts
retryConfig: {
  initialDelay: 1000,
  backoffMultiplier: 2,
  maxDelay: 300000  // Never wait more than 5 minutes
}
```

### 5. Monitor and Alert

Set up monitoring for:
- Jobs that fail after all retries
- High retry rates (may indicate systemic issues)
- Unusual error patterns

## See Also

* [Scheduling Jobs](./scheduling-jobs) - Create and schedule jobs
* [Job Management](./job-management) - Monitor and control jobs
* [Examples](./examples) - Real-world retry patterns
