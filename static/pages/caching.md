---
title: "Using Caching for Faster APIs"
sidebar_position: 5
---

# Using Caching for Faster APIs

**Goal:**  
Add a cache resource, enable caching for an action, and observe the difference.

**Prerequisites:**  
- Redis or other supported cache backend

---

## Step 1: Add a Cache Resource

```typescript
await ductape.product.caches.create({
  name: "Main Cache",
  tag: "main_cache",
  expiry: 60000, // 1 minute
  description: "Cache for API call results"
});
```

## Step 2: Enable Caching for an Action

```typescript
const result = await ductape.processor.action.run({
  env: "dev",
  product: "payments_service",
  app: "email_service",
  event: "send_email",
  cache: "main_cache",
  input: {
    body: {
      to: "user@example.com",
      subject: "Hello from Ductape!",
      body: "This is a test email."
    }
  }
});
console.log(result);
```

**Best Practices:**  
- Use caching for expensive or frequently called operations.
- Set appropriate expiry times.

**Next Steps:**  
- [Building a Multi-Environment Workflow](./multi-environment.md) 