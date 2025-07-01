---
sidebar_position: 2
---

# Defining Inputs for Quotas

When triggering a quota event in Ductape, you provide an input object that specifies the context for the quota check or increment. The structure of this input depends on your quota's purpose and what you want to limit or track.

## Example Input
```typescript
const quotaInput = {
  userId: '$Input{userId}',
  amount: 1, // Number of units to consume
};
```

## How Input Is Used
- The input fields are used to identify the subject of the quota (e.g., user, team, API key) and the amount to check or increment.
- Ductape validates the input and applies the quota logic accordingly.

## Best Practices
- Always include a unique identifier (e.g., userId) to scope the quota.
- Use the `amount` field to specify how much of the quota to consume (default is usually 1).
- Document the input structure for each quota for clarity and maintainability. 