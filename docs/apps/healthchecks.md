---
sidebar_position: 7
---

# Healthchecks

Healthchecks in Ductape monitor the availability and performance of your app integrations by automatically executing actions at regular intervals. This helps you detect downtime, track response times, and ensure your critical integrations are always operational.

## What Are Healthchecks?

A healthcheck is a scheduled monitoring task that:
- Executes a specific app action at defined intervals
- Tracks success/failure status across multiple environments
- Measures response latency and availability
- Automatically retries failed checks before marking as unhealthy
- Maintains historical performance data per environment

Healthchecks are perfect for monitoring third-party APIs, internal services, or any app action that needs continuous availability tracking.

## Creating a Healthcheck

To create a healthcheck, use `ductape.health.create()`:

```typescript
import Ductape from '@ductape/sdk';

const ductape = new Ductape({
  accessKey: 'your-access-key',
});



await ductape.health.create({
  name: 'API Health Monitor',
  description: 'Monitors main API endpoint availability',
  tag: 'api-health-check',
  app: 'my-app',           // App access tag
  event: 'ping-endpoint',  // Action tag to execute
  interval: 60000,         // Check every 60 seconds
  retries: 3,              // Retry 3 times before marking as failed
  envs: [
    {
      slug: 'prd',
      input: {
        query: { url: 'https://api.example.com/ping' },
      },
    },
    {
      slug: 'dev',
      input: {
        query: { url: 'https://dev.api.example.com/ping' },
      },
    },
  ],
});
```

### Healthcheck Fields

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Display name for the healthcheck |
| `description` | string | Description of what's being monitored |
| `tag` | string | Unique identifier for this healthcheck |
| `app` | string | The access tag of the app containing the action |
| `event` | string | The tag of the app action to execute |
| `interval` | number | Time between checks in milliseconds |
| `retries` | number | Number of retry attempts on failure |
| `envs` | CheckEnvStatus[] | Environment-specific configurations |

### Environment Configuration (CheckEnvStatus)

Each environment in the `envs` array can have:

| Field | Type | Description |
|-------|------|-------------|
| `slug` | string | Environment slug (e.g., 'prd', 'dev', 'stg') |
| `input` | any | Input parameters for the action execution |
| `status` | string | Current health status (set automatically) |
| `lastAvailable` | string | Timestamp of last successful check (set automatically) |
| `lastChecked` | string | Timestamp of most recent check (set automatically) |
| `lastLatency` | string | Response time of last check in ms (set automatically) |
| `averageLatency` | string | Average response time (set automatically) |

**Note:** Status and performance fields are automatically populated by Ductape as healthchecks run.

## How Healthchecks Work

1. **Scheduling:** Ductape executes the specified action at the defined interval
2. **Execution:** The action runs with the environment-specific input parameters
3. **Retry Logic:** If the action fails, it retries up to the specified retry count
4. **Status Update:** Success/failure and performance metrics are recorded
5. **Environment Tracking:** Each environment maintains its own status and metrics

## Fetching Healthchecks

### Get All Healthchecks for an App

```typescript
const healthchecks = await ductape.health.fetchAll('my-app');

healthchecks.forEach(check => {
  console.log(`${check.name}: ${check.tag}`);
  console.log(`Interval: ${check.interval}ms`);
  check.envs.forEach(env => {
    console.log(`  ${env.slug}: ${env.status} (${env.lastLatency}ms)`);
  });
});
```

### Get a Specific Healthcheck

```typescript
const healthcheck = await ductape.health.fetch('my-app', 'api-health-check');

console.log('Healthcheck:', healthcheck.name);
console.log('App:', healthcheck.app);
console.log('Action:', healthcheck.event);
console.log('Interval:', healthcheck.interval);
console.log('Environments:');
healthcheck.envs.forEach(env => {
  console.log(`  ${env.slug}:`);
  console.log(`    Status: ${env.status}`);
  console.log(`    Last Checked: ${env.lastChecked}`);
  console.log(`    Latency: ${env.lastLatency}ms`);
  console.log(`    Average Latency: ${env.averageLatency}ms`);
});
```

## Updating Healthchecks

Update healthcheck configuration using `ductape.health.update()`:

```typescript
await ductape.health.update('api-health-check', {
  interval: 120000,  // Change to every 2 minutes
  retries: 5,        // Increase retries
  envs: [
    {
      slug: 'prd',
      input: {
        query: { url: 'https://api.example.com/v2/ping' },
      },
    },
  ],
});
```

## Use Cases

- **API Monitoring:** Continuously verify third-party API availability
- **Service Health:** Track internal microservice responsiveness
- **Endpoint Validation:** Ensure critical endpoints return expected responses
- **Performance Tracking:** Monitor response times and detect degradation
- **Alerting:** Use healthcheck status to trigger notifications or fallback actions

## Example: Comprehensive Healthcheck Setup

```typescript
import Ductape from '@ductape/sdk';

const ductape = new Ductape({
  accessKey: 'your-access-key',
});

await ductape.product.init('payment-system');

// Create healthcheck for payment gateway
await ductape.health.create({
  name: 'Stripe Gateway Health',
  description: 'Monitors Stripe API availability',
  tag: 'stripe-health',
  app: 'stripe-integration',
  event: 'check-connection',
  interval: 30000,  // Every 30 seconds
  retries: 2,
  envs: [
    {
      slug: 'prd',
      input: {
        headers: { 'X-Health-Check': 'true' },
      },
    },
    {
      slug: 'stg',
      input: {
        headers: { 'X-Health-Check': 'true' },
      },
    },
  ],
});

// Fetch and display status
const health = await ductape.health.fetch('stripe-integration', 'stripe-health');
console.log(`Stripe Health: ${health.envs.find(e => e.slug === 'prd')?.status}`);
```

## Best Practices

- Set appropriate intervals—too frequent may overwhelm services, too infrequent may miss issues
- Use retries to handle transient failures without false alarms
- Monitor production and staging environments separately
- Keep healthcheck actions lightweight and fast
- Use healthcheck status to trigger automated alerts or fallback systems
- Review average latency trends to detect performance degradation

## See Also

- [App Actions](/actions/overview) - Learn about creating actions to monitor
- [Fallbacks](/fallbacks/overview) - Automatically switch providers on healthcheck failures
- [Jobs](/jobs/overview) - Schedule recurring tasks
