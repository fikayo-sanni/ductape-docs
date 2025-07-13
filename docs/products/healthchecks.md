---
sidebar_position: 7
---

# Healthchecks

Healthchecks in Ductape allow you to automatically monitor the health and responsiveness of your product's app integrations. You can schedule recurring checks on any app action, ensuring your critical integrations are always working as expected.

## What Are Healthchecks?

A healthcheck is a scheduled execution of an app action in a specific environment. Healthchecks help you:
- Detect downtime or failures in third-party APIs or internal endpoints
- Validate that app actions return expected results
- Automate alerting and recovery workflows

Healthchecks are defined for product apps and can be configured per environment (e.g., `dev`, `prd`).

## Creating Healthchecks

To create a healthcheck, use the `product.apps.health.create` function:

```typescript
import ductape from './ductapeClient';
import { IActionRequest } from 'ductape-sdk/dist/types';

const healthcheck = {
  name: 'Healthcheck',
  description: 'healthcheck for myapp',
  tag: 'app health check',
  app: 'my-app', // App access tag
  event: 'ping',    // Action tag to run
  interval: 60000, // Run every 60 seconds
  retries: 3, // number of retries per failure
  envs: [
    {
      slug: 'prd',
      inputs: {
        query: { url: 'https://api.example.com/ping' },
        // ...other IActionRequest fields as needed
      },
      // ...other env-specific config
    },
    {
      slug: 'dev',
      inputs: {
        query: { url: 'https://dev.api.example.com/ping' },
      },
    }
  ],
};

await ductape.product.apps.health.create(healthcheck);
```

| Field        | Type                        | Description                                                                 |
|--------------|-----------------------------|-----------------------------------------------------------------------------|
| `name`    | `string`                    | The access name of the check.                                         |
| `description`    | `string`                    | The description for the check.                                         |
| `tag`    | `string`                    | The unique identifier for the health check.                                         |
| `app`    | `string`                    | The access tag of the app to check.                                         |
| `event`     | `string`                    | The tag of the app action to execute.                                       |
| `envs`       | `Array<EnvHealthConfig>`    | List of environments and their healthcheck config (see below).              |
| `interval`  | `number` (milliseconds)     | Interval between healthcheck executions.                                    |
| `retries`    | `number`                    | Number of retries on failure.                                               |

**EnvHealthConfig**:

| Field     | Type            | Description                                                      |
|-----------|-----------------|------------------------------------------------------------------|
| `slug`    | `string`        | Environment slug (e.g., `prd`, `dev`).                           |
| `inputs`  | `IActionRequest`| Inputs for the action, matching the `IActionRequest` interface.   |

**IActionRequest** fields:
```typescript
{
  query?: Record<string, unknown>;
  params?: Record<string, unknown>;
  body?: Record<string, unknown>;
  headers?: Record<string, unknown>;
  input?: Record<string, unknown>;
}
```

## Fetching Healthchecks

To retrieve all healthchecks for a product app:

```typescript
const healthchecks = await ductape.product.apps.health.fetchAll('my-app');
```

To fetch a specific healthcheck:

```typescript
const healthcheck = await ductape.product.apps.health.fetch('my-app', 'ping');
```

## Updating Healthchecks

To update an existing healthcheck, use the `update` function with the app tag, action tag, and updated details:

```typescript
await ductape.product.apps.health.update('my-app', 'ping', { intervals: 120000 });
```

## Fetching Healthcheck Status

To get the latest healthcheck status for an app in a specific environment:

```typescript
const status = await ductape.product.apps.health.status('my-app', 'prd');
console.log(status);
// Example output:
// {
//   status: 'healthy',
//   lastChecked: 1712345678901,
//   response: {...},
//   ...other result fields
// }
```

## Use Cases
- Monitor third-party APIs or internal endpoints for downtime
- Alert on failed healthchecks or slow responses
- Automate fallback or recovery logic for app integrations
- Track health trends for each app action over time

## Best Practices
- Set intervals (e.g., 1-5 minutes) for critical checks
- Use retries to handle transient failures
- Monitor healthcheck status in your dashboard or via API
- Use healthcheck results to trigger alerts or automated recovery

Healthchecks help you ensure your product's app integrations are always running smoothly. For advanced usage, see the SDK reference or contact support for help with custom healthcheck logic. 