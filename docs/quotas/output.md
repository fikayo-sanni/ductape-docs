---
sidebar_position: 3
---

# Defining Outputs for Quotas

The output of a quota event in Ductape provides information about the result of the quota check or increment. This typically includes whether the operation was successful, the remaining quota, and if the limit was reached.

## Example Output
```typescript
output: {
  success: true,
  remaining: 500,
  limit: 1000,
  period: 'month',
}
```

## Referencing Quota Outputs
You can reference the output of a quota event in subsequent workflow steps using the quota tag and the correct variable syntax:

```typescript
const nextEvent = {
  input: {
    remainingQuota: '$Sequence{monthly_api_limit}{remaining}',
    limit: '$Sequence{monthly_api_limit}{limit}',
    period: '$Sequence{monthly_api_limit}{period}',
  }
};
```

## Best Practices
- Use output fields to make decisions in your workflow (e.g., block actions if quota is exceeded).
- Document the output structure for each quota for clarity and maintainability. 