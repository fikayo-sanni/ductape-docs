---
sidebar_position: 1
---

# Quotas in Ductape

Quotas in Ductape are used to enforce usage limits and track consumption of resources or features within your product. They help prevent overuse, manage rate limits, and ensure fair access to services by defining and checking quotas as part of your workflow.

## What is a Quota?
A quota is defined at the product level and includes:
- A unique `tag`, `name`, and optional `description`.
- A `limit` (number of allowed uses) and a `period` (e.g., per day, per month).
- Optionally, you can define input and output schemas for more advanced quota logic.

**Example Quota Structure:**
```typescript
const monthlyApiQuota = {
  tag: 'monthly_api_limit',
  name: 'Monthly API Limit',
  description: 'Limits the number of API calls per user per month',
  limit: 10000,
  period: 'month',
};
```

## Using Quotas in Workflows
To enforce a quota, reference its `tag` in a quota event within your workflow. Ductape will check or increment the quota for the given input (e.g., user, team, or API key) and return output fields such as `remaining`, `limit`, and `period`.

**Example Quota Event in a Workflow:**
```typescript
const quotaEvent = {
  type: FeatureEventTypes.QUOTA,
  event: 'monthly_api_limit',
  input: {
    userId: '$Input{userId}',
    amount: 1,
  },
  retries: 1,
  allow_fail: false,
};

const nextEvent = {
  input: {
    remainingQuota: '$Sequence{monthly_api_limit}{remaining}',
    limit: '$Sequence{monthly_api_limit}{limit}',
    period: '$Sequence{monthly_api_limit}{period}',
  }
};
```

## See Also
- [Quota Event Type](../features/events/event-types/quotas.md)
- [Defining Inputs for Quotas](input.md)
- [Defining Outputs for Quotas](output.md) 