---
sidebar_position: 1
---

# Quotas

Enforce usage limits and track resource consumption.

## Quick Example

```ts
await ductape.product.quotas.create({
  tag: 'monthly-api-limit',
  name: 'Monthly API Limit',
  description: 'Limits API calls per user per month',
  limit: 10000,
  period: 'month'
});
```

## What is a Quota?

A quota limits how often a resource or feature can be used. Use them for:
- Rate limiting API calls
- Subscription usage caps
- Fair access enforcement

## Creating a Quota

```ts
await ductape.product.quotas.create({
  tag: 'daily-exports',
  name: 'Daily Exports',
  description: 'Limits exports per day',
  limit: 100,
  period: 'day'
});
```

### Quota Fields

| Field | Type | Description |
|-------|------|-------------|
| `tag` | string | Unique identifier |
| `name` | string | Display name |
| `description` | string | What the quota limits |
| `limit` | number | Maximum allowed uses |
| `period` | string | Reset period (`day`, `month`, etc.) |

## Using Quotas in Workflows

Reference quotas in your feature workflows:

```ts
const quotaEvent = {
  type: FeatureEventTypes.QUOTA,
  event: 'monthly-api-limit',
  input: {
    userId: '$Input{userId}',
    amount: 1
  }
};
```

Access quota data in subsequent events:

```ts
const nextEvent = {
  input: {
    remaining: '$Sequence{monthly-api-limit}{remaining}',
    limit: '$Sequence{monthly-api-limit}{limit}'
  }
};
```

## See Also

* [Processing Quotas](./use)
* [Quota Event Type](../features/events/event-types/quotas)
* [Defining Inputs](./input)
* [Defining Outputs](./output)
