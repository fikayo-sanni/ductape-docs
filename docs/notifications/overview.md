---
sidebar_position: 1
---

# Notifications

Send notifications to users via push, email, SMS, or webhooks using `ductape.notifications`.

## Quick Example

```ts
// Send a push notification
await ductape.notifications.push({
  product: 'my-app',
  env: 'prd',
  notification: 'alerts:welcome',
  input: {
    device_tokens: ['device-token-1'],
    title: { name: 'John' },
    body: { message: 'Welcome to our app!' },
  },
});

// Send an email
await ductape.notifications.email({
  product: 'my-app',
  env: 'prd',
  notification: 'emails:order-confirmation',
  input: {
    recipients: ['john@example.com'],
    subject: { orderId: '12345' },
    template: { orderDetails: '...' },
  },
});

// Send an SMS
await ductape.notifications.sms({
  product: 'my-app',
  env: 'prd',
  notification: 'sms:verification',
  input: {
    recipients: ['+1234567890'],
    body: { code: '123456' },
  },
});

// Send a webhook callback
await ductape.notifications.callback({
  product: 'my-app',
  env: 'prd',
  notification: 'webhooks:order-created',
  input: {
    body: { orderId: '12345', status: 'created' },
  },
});
```

## Notification Methods

| Method | Description | Use cases |
|--------|-------------|-----------|
| `push()` | Send push notifications via Firebase/Expo | Alerts, updates, promotions |
| `email()` | Send emails via SMTP | Account info, transactions |
| `sms()` | Send SMS via Twilio/Nexmo/Plivo | OTPs, alerts, status updates |
| `callback()` | Send HTTP webhooks | Integrations, automation |
| `send()` | Send to multiple channels at once | Multi-channel campaigns |
| `dispatch()` | Schedule notifications for later | Delayed/scheduled sends |

## Notification Tag Format

Notifications use a tag format of `notification_tag:message_tag`:

```ts
notification: 'alerts:welcome'  // notification_tag: 'alerts', message_tag: 'welcome'
notification: 'emails:order-confirmation'  // notification_tag: 'emails', message_tag: 'order-confirmation'
```

## Multi-Channel Notifications

Send to multiple channels at once:

```ts
const result = await ductape.notifications.send({
  product: 'my-app',
  env: 'prd',
  notification: 'alerts:order-placed',
  push_notification: {
    device_tokens: ['token1'],
    title: { order: 'New Order' },
    body: { message: 'Order #12345 placed' },
  },
  email: {
    recipients: ['user@example.com'],
    subject: { orderId: '12345' },
    template: { orderDetails: '...' },
  },
  sms: {
    recipients: ['+1234567890'],
    body: { message: 'Order #12345 placed' },
  },
});

console.log(result.channels.push?.success);
console.log(result.channels.email?.success);
console.log(result.channels.sms?.success);
```

## Best Practices

- Use clear, actionable language
- Personalize with user-specific data
- Test in development before production
- Respect user opt-in/opt-out preferences
- Monitor delivery metrics
- Use `dispatch()` for scheduled notifications

## See Also

* [Setting Up Notifications](./setup)
* [Sending Notifications](./send)
* [Message Templates](./templates/manage-messages)
