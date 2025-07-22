---
title: "Importing and Using a Public App (e.g., Paystack, SendGrid)"
sidebar_position: 2
---

# Importing and Using a Public App (e.g., Paystack, SendGrid)

**Goal:**  
Import a public app, configure it, and trigger an action.

**Prerequisites:**  
- Ductape account and workspace  
- Public app tag (e.g., `paystack_apis`)

---

## Step 1: Import the App

- Go to **Apps** in the Ductape dashboard.
- Click **Import** and select the public app (e.g., Paystack APIs).
- Follow the prompts to add it to your workspace.

## Step 2: Connect the App to Your Product

```typescript
const appAccess = await ductape.product.apps.connect("paystack_apis");
```

## Step 3: Configure Authentication

```typescript
await ductape.product.apps.add({
  access_tag: appAccess.access_tag,
  envs: [{
    app_env_slug: "prd",
    product_env_slug: "prd",
    auth: {
      auth_tag: "bearer_token",
      data: {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
        }
      }
    }
  }]
});
```

## Step 4: Trigger an Action

```typescript
const result = await ductape.processor.action.run({
  env: "prd",
  product: "payments_service",
  app: "paystack_apis",
  event: "charge_card",
  input: {
    body: {
      amount: 1000,
      email: "customer@example.com"
    }
  }
});
console.log(result);
```

**Best Practices:**  
- Store API keys in `.env` files.
- Use the Ductape dashboard to monitor app usage.

**Next Steps:**  
- [Connecting to a Database and Running Queries](./database-queries.md) 