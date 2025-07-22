---
title: "Setting Up Notifications (Email, SMS, Webhook)"
sidebar_position: 4
---

# Setting Up Notifications (Email, SMS, Webhook)

**Goal:**  
Configure notification channels and trigger a notification from a workflow.

**Prerequisites:**  
- Notification provider credentials (e.g., SendGrid, Twilio)

---

## Step 1: Add a Notification Resource

```typescript
await ductape.product.notifications.create({
  name: "Email Notifications",
  tag: "email_notifications",
  type: "email",
  provider: "sendgrid",
  api_key: process.env.SENDGRID_API_KEY
});
```

## Step 2: Define a Notification Action

```typescript
await ductape.product.notifications.actions.create({
  notification_tag: "email_notifications",
  name: "Send Welcome Email",
  tag: "send_welcome_email",
  template: {
    subject: "Welcome!",
    body: "Hello, welcome to our service."
  }
});
```

## Step 3: Trigger the Notification

```typescript
const result = await ductape.processor.notification.send({
  env: "dev",
  product: "payments_service",
  notification: "email_notifications",
  event: "send_welcome_email",
  input: {
    to: "user@example.com"
  }
});
console.log(result);
```

**Best Practices:**  
- Use templates for consistent messaging.
- Monitor delivery and bounce rates.

**Next Steps:**  
- [Using Caching for Faster APIs](./caching.md) 