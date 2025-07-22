---
title: "Automating Workflows with Features"
sidebar_position: 7
---

# Automating Workflows with Features

**Goal:**  
Create a feature that chains multiple actions (e.g., payment + notification).

**Prerequisites:**  
- Ductape product and apps set up

---

## Step 1: Define a Feature

```typescript
const feature = await ductape.product.features.create({
  name: "Payment and Notify",
  tag: "payment_notify",
  input: {
    userId: { type: "string" },
    amount: { type: "number" }
  },
  sequence: [
    {
      type: "ACTION",
      event: "charge_card",
      input: { userId: "$Input{userId}", amount: "$Input{amount}" },
      retries: 1,
      allow_fail: false
    },
    {
      type: "NOTIFICATION",
      event: "send_payment_receipt",
      input: { userId: "$Input{userId}" },
      retries: 1,
      allow_fail: true
    }
  ],
  output: {
    result: "$Sequence{payment_notify}{charge_card}{result}"
  }
});
```

## Step 2: Run the Feature

```typescript
const result = await ductape.processor.feature.run({
  env: "prd",
  product: "payments_service",
  feature: "payment_notify",
  input: {
    userId: "12345",
    amount: 1000
  }
});
console.log(result);
```

**Best Practices:**  
- Use features to encapsulate business logic.
- Chain actions and notifications for end-to-end workflows.

**Next Steps:**  
- [Handling Failures with Fallbacks](./fallbacks.md) 