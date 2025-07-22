---
title: "Rate Limiting with Quotas"
sidebar_position: 8
---

# Rate Limiting with Quotas

**Goal:**  
Add a quota to an action and test enforcement.

**Prerequisites:**  
- Ductape product set up

---

## Step 1: Define a Quota

```typescript
const quota = await ductape.product.quotas.create({
  tag: "monthly_api_limit",
  name: "Monthly API Limit",
  limit: 10000,
  period: "month"
});
```

## Step 2: Reference the Quota in a Workflow

```typescript
const quotaEvent = {
  type: "QUOTA",
  event: "monthly_api_limit",
  input: { userId: "$Input{userId}", amount: 1 },
  retries: 1,
  allow_fail: false
};
```

**Best Practices:**  
- Use quotas to prevent abuse and manage costs.
- Combine quotas with features for advanced rate limiting.

**Next Steps:**  
- [Handling Failures with Fallbacks](./fallbacks.md) 