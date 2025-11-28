---
sidebar_position: 1
---

# Quotas

Quotas in Ductape enforce usage limits and track resource consumption across your product. They allow you to define maximum usage thresholds and automatically manage access based on consumption.

## What is a Quota?

A quota is a usage limit system that:
- Defines maximum usage thresholds for resources or features
- Tracks consumption across multiple quota options (tiers, plans, etc.)
- Supports both execution (runtime checking) and configuration (CRUD operations)
- Can integrate with features and actions
- Maintains usage counters and enforces limits

Use quotas for:
- **Rate limiting** - Limit API calls per user/tenant
- **Subscription tiers** - Enforce plan-specific usage limits
- **Resource management** - Control access to premium features
- **Fair usage** - Prevent abuse and ensure equitable access

## Creating a Quota

Create a quota using `ductape.quota.create()`:

```typescript
import Ductape from '@ductape/sdk';
import { FeatureEventTypes, DataTypes } from '@ductape/types';

const ductape = new Ductape({
  workspace_id: 'your-workspace-id',
  user_id: 'your-user-id',
  private_key: 'your-private-key',
});



await ductape.quota.create({
  name: 'API Call Quota',
  tag: 'api-calls',
  description: 'Limits API calls per subscription tier',
  input: {
    userId: { type: DataTypes.STRING },
    plan: { type: DataTypes.STRING },
  },
  total_quota: 10000,  // Total quota across all options
  total_init: 10000,   // Initial total quota value
  options: [
    {
      quota: 1000,           // Free tier: 1000 calls
      uses: 0,               // Current usage (tracked automatically)
      type: FeatureEventTypes.ACTION,
      event: 'check-free-tier',
      app: 'billing-service',
      input: { userId: '$Input{userId}' },
      output: { remaining: '$Response{remaining}' },
      retries: 1,
    },
    {
      quota: 10000,          // Pro tier: 10000 calls
      uses: 0,
      type: FeatureEventTypes.ACTION,
      event: 'check-pro-tier',
      app: 'billing-service',
      input: { userId: '$Input{userId}' },
      output: { remaining: '$Response{remaining}' },
      retries: 1,
    },
  ],
});
```

### Quota Fields

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Display name for the quota |
| `tag` | string | Unique identifier |
| `description` | string | Description of what the quota limits |
| `input` | Record&lt;string, IFeatureInput&gt; | Input schema definition |
| `total_quota` | number | Maximum total quota across all options |
| `total_init` | number | Initial quota value |
| `options` | IQuotaOptions[] | Array of quota tiers/options |

### Quota Option Fields

Each option in the `options` array has:

| Field | Type | Description |
|-------|------|-------------|
| `quota` | number | Maximum allowed usage for this option |
| `uses` | number | Current usage count (tracked automatically) |
| `type` | FeatureEventTypes | Type of action to execute (ACTION or FEATURE) |
| `event` | string | Tag of the action/feature to execute |
| `app` | string | App tag (if type is ACTION) |
| `input` | object | Input mapping for the action |
| `output` | object | Output mapping from the action |
| `retries` | number | Number of retry attempts |
| `healthcheck` | string | Optional healthcheck tag |

## Running a Quota

Execute quota checks at runtime using `ductape.quota.run()`:

```typescript
const result = await ductape.quota.run({
  env: 'prd',
  product: 'my-product',
  tag: 'api-calls',
  input: {
    userId: 'user123',
    plan: 'free',
  },
  session: {
    tag: 'user-session',
    token: 'session-token',
  },
  cache: 'quota-cache',  // Optional: cache quota checks
});

console.log('Quota result:', result);
// Check if quota exceeded
if (result.exceeded) {
  console.log('Quota limit reached!');
} else {
  console.log(`Remaining: ${result.remaining}`);
}
```

### Run Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `env` | string | Environment (e.g., 'dev', 'prd') |
| `product` | string | Product tag |
| `tag` | string | Quota tag to execute |
| `input` | object | Input data for quota check |
| `session` | object | Optional session information |
| `cache` | string | Optional cache tag |

## Fetching Quotas

### Get All Quotas

```typescript
const quotas = await ductape.quota.fetchAll();

quotas.forEach(quota => {
  console.log(`${quota.name} (${quota.tag})`);
  console.log(`Total: ${quota.total_quota}`);
  quota.options.forEach((option, i) => {
    console.log(`  Option ${i}: ${option.uses}/${option.quota}`);
  });
});
```

### Get a Specific Quota

```typescript
const quota = await ductape.quota.fetch('api-calls');

console.log('Quota:', quota.name);
console.log('Description:', quota.description);
console.log('Total Quota:', quota.total_quota);
console.log('Options:', quota.options.length);
```

## Updating Quotas

Update quota configuration using `ductape.quota.update()`:

```typescript
await ductape.quota.update('api-calls', {
  total_quota: 50000,  // Increase total quota
  options: [
    {
      quota: 5000,  // Increase free tier
      type: FeatureEventTypes.ACTION,
      event: 'check-free-tier',
      app: 'billing-service',
      input: { userId: '$Input{userId}' },
      output: { remaining: '$Response{remaining}' },
      retries: 1,
    },
    {
      quota: 50000,  // Increase pro tier
      type: FeatureEventTypes.ACTION,
      event: 'check-pro-tier',
      app: 'billing-service',
      input: { userId: '$Input{userId}' },
      output: { remaining: '$Response{remaining}' },
      retries: 1,
    },
  ],
});
```

## Using Quotas in Features

Reference quotas in your feature workflows to enforce limits:

```typescript
import { FeatureEventTypes, DataTypes } from '@ductape/types';

await ductape.feature.create({
  tag: 'send-notification',
  name: 'Send Notification with Quota',
  input: {
    userId: { type: DataTypes.STRING },
    message: { type: DataTypes.STRING },
  },
  events: [
    // Check quota first
    {
      type: FeatureEventTypes.QUOTA,
      event: 'notification-quota',
      input: {
        userId: '$Input{userId}',
      },
    },
    // If quota allows, send notification
    {
      type: FeatureEventTypes.ACTION,
      event: 'send-push',
      app: 'notification-service',
      input: {
        userId: '$Input{userId}',
        message: '$Input{message}',
      },
      condition: {
        left: '$Sequence{notification-quota}{exceeded}',
        operator: 'equals',
        right: false,
      },
    },
  ],
});
```

Access quota results in subsequent events using sequence syntax:

```typescript
{
  type: FeatureEventTypes.ACTION,
  event: 'log-quota-status',
  input: {
    remaining: '$Sequence{notification-quota}{remaining}',
    limit: '$Sequence{notification-quota}{limit}',
    exceeded: '$Sequence{notification-quota}{exceeded}',
  },
}
```

## Example: Multi-Tier API Quota

```typescript
import Ductape from '@ductape/sdk';
import { FeatureEventTypes, DataTypes } from '@ductape/types';

const ductape = new Ductape({
  workspace_id: 'your-workspace-id',
  user_id: 'your-user-id',
  private_key: 'your-private-key',
});

await ductape.product.init('api-platform');

// Create quota with multiple tiers
await ductape.quota.create({
  name: 'Monthly API Requests',
  tag: 'monthly-api-quota',
  description: 'API request limits per subscription plan',
  input: {
    userId: { type: DataTypes.STRING },
    tier: { type: DataTypes.STRING },
  },
  total_quota: 1000000,
  total_init: 1000000,
  options: [
    {
      quota: 1000,    // Hobby: 1K/month
      uses: 0,
      type: FeatureEventTypes.ACTION,
      event: 'check-tier',
      app: 'quota-service',
      input: { tier: 'hobby' },
      output: { allowed: '$Response{allowed}' },
      retries: 2,
    },
    {
      quota: 10000,   // Starter: 10K/month
      uses: 0,
      type: FeatureEventTypes.ACTION,
      event: 'check-tier',
      app: 'quota-service',
      input: { tier: 'starter' },
      output: { allowed: '$Response{allowed}' },
      retries: 2,
    },
    {
      quota: 100000,  // Pro: 100K/month
      uses: 0,
      type: FeatureEventTypes.ACTION,
      event: 'check-tier',
      app: 'quota-service',
      input: { tier: 'pro' },
      output: { allowed: '$Response{allowed}' },
      retries: 2,
    },
  ],
});

// Run quota check
const check = await ductape.quota.run({
  env: 'prd',
  product: 'api-platform',
  tag: 'monthly-api-quota',
  input: {
    userId: 'user123',
    tier: 'starter',
  },
});

if (check.exceeded) {
  console.log('API quota exceeded - upgrade required');
} else {
  console.log(`Quota OK - ${check.remaining} requests remaining`);
}
```

## Best Practices

- Define clear quota limits based on your product tiers
- Use meaningful tier names in quota options
- Monitor quota usage to detect abuse or upgrade opportunities
- Set appropriate retry counts for quota checks
- Cache quota checks when possible to reduce overhead
- Reset quota counters periodically (daily, monthly, etc.)
- Provide clear feedback to users when quotas are exceeded
- Use quotas in combination with features for automated limit enforcement

## See Also

- [Features](/features/overview) - Integrate quotas into feature workflows
- [Fallbacks](/fallbacks/overview) - Handle quota exceeded scenarios
- [Jobs](/jobs/overview) - Schedule quota reset tasks
