---
title: "Your First Ductape Product: From Zero to Action"
sidebar_position: 1
---

# Your First Ductape Product: From Zero to Action

**Goal:**  
Create a product, add an app, configure environments, and run your first action.

**Prerequisites:**  
- Node.js installed  
- Ductape account ([Sign up here](https://cloud.ductape.app/auth/login))  
- Ductape SDK installed (`npm install @ductape/sdk`)

---

## Step 1: Create a Product

```typescript
const product = await ductape.product.create({
  name: "Payments Service",
  tag: "payments_service",
  description: "Handles all payment processing"
});
```

## Step 2: Add an App

```typescript
const app = await ductape.app.create({
  app_name: "Email Service",
  description: "Send transactional emails",
  tag: "email_service"
});
```

## Step 3: Configure Environments

```typescript
await ductape.product.environments.create({
  name: "Development",
  slug: "dev",
  base_url: "https://dev.api.example.com"
});
await ductape.product.environments.create({
  name: "Production",
  slug: "prd",
  base_url: "https://api.example.com"
});
```

## Step 4: Run Your First Action

```typescript
const result = await ductape.processor.action.run({
  env: "dev",
  product: "payments_service",
  app: "email_service",
  event: "send_email",
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
- Use environment variables for secrets and URLs.
- Keep your product and app tags unique and descriptive.

**Next Steps:**  
- [Importing and Using a Public App](./import-public-app.md) 