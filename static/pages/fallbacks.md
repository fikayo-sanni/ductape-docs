---
title: "Handling Failures with Fallbacks"
sidebar_position: 9
---

# Handling Failures with Fallbacks

**Goal:**  
Set up a fallback between two providers (e.g., Paystack and Flutterwave).

**Prerequisites:**  
- Ductape product and multiple provider apps set up

---

## Step 1: Define a Fallback

```typescript
const fallback = await ductape.product.fallbacks.create({
  tag: "payments",
  name: "Payments Fallback",
  input: {
    amount: { type: "number" },
    currency: { type: "string" }
  },
  options: [
    {
      type: "ACTION",
      event: "paystack_charge",
      input: { amount: "$Input{amount}", currency: "$Input{currency}" },
      retries: 1,
      allow_fail: true
    },
    {
      type: "ACTION",
      event: "flutterwave_charge",
      input: { amount: "$Input{amount}", currency: "$Input{currency}" },
      retries: 1,
      allow_fail: false
    }
  ]
});
```

## Step 2: Use the Fallback in a Feature

```typescript
const feature = await ductape.product.features.create({
  name: "Resilient Payment",
  tag: "resilient_payment",
  input: { amount: { type: "number" }, currency: { type: "string" } },
  sequence: [
    {
      type: "FALLBACK",
      event: "payments",
      input: { amount: "$Input{amount}", currency: "$Input{currency}" },
      retries: 1,
      allow_fail: false
    }
  ],
  output: { result: "$Sequence{resilient_payment}{payments}{result}" }
});
```

**Best Practices:**  
- Use allow_fail to control when to proceed to the next fallback.
- Monitor fallback usage to optimize provider selection.

**Next Steps:**  
- [Rate Limiting with Quotas](./quotas.md) 