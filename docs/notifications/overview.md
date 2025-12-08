---
sidebar_position: 1
---

# Notifications

Send notifications to users via push, email, SMS, or webhooks.

## Quick Example

```ts
// Send an email notification
await ductape.notifications.send({
  env: 'prd',
  product: 'my-app',
  event: 'welcome_email',
  input: {
    to: 'john@example.com',
    subject: 'Welcome!',
    body: 'Thanks for signing up.'
  }
});
```

## Notification Types

| Type | What it does | Use cases |
|------|--------------|-----------|
| **Push** | Real-time device notifications | Alerts, updates, promotions |
| **Email** | Messages to user inboxes | Account info, transactions |
| **SMS** | Text messages to phones | OTPs, alerts, status updates |
| **Webhook** | HTTP callbacks to external systems | Integrations, automation |

## Setting Up Notifications

### Push Notifications

```ts
await ductape.notifications.create({
  name: 'Order Update',
  tag: 'order-update',
  type: 'push',
  // ... provider config
});
```

### Email Notifications

```ts
await ductape.notifications.create({
  name: 'Welcome Email',
  tag: 'welcome-email',
  type: 'email',
  // ... provider config
});
```

### SMS Notifications

```ts
await ductape.notifications.create({
  name: 'OTP Code',
  tag: 'otp-code',
  type: 'sms',
  // ... provider config
});
```

### Webhooks

```ts
await ductape.notifications.create({
  name: 'Order Webhook',
  tag: 'order-webhook',
  type: 'webhook',
  // ... provider config
});
```

## Best Practices

- Use clear, actionable language
- Personalize with user-specific data
- Test in development before production
- Respect user opt-in/opt-out preferences
- Monitor delivery metrics

## See Also

* [Setting Up Notifications](./setup)
* [Sending Notifications](./send)
* [Message Templates](./templates/manage-messages)
