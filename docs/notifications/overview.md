---
sidebar_position: 1
---

# Notifications

Send notifications to users via push, email, SMS, or webhooks using `ductape.notifications`.

## Quick Example

Use channel-specific APIs (`.email`, `.push`, `.sms`, `.callback`) with `.send()` to target a single channel:

```ts
// Send a push notification
await ductape.notifications.push.send({
  notification: 'alerts:welcome',
  input: {
    device_tokens: ['device-token-1'],
    title: { name: 'John' },
    body: { message: 'Welcome to our app!' },
  },
});

// Send an email
await ductape.notifications.email.send({
  notification: 'emails:order-confirmation',
  input: {
    recipients: ['john@example.com'],
    subject: { orderId: '12345' },
    template: { orderDetails: '...' },
  },
});

// Send an SMS
await ductape.notifications.sms.send({
  notification: 'sms:verification',
  input: {
    recipients: ['+1234567890'],
    body: { code: '123456' },
  },
});

// Send a webhook callback
await ductape.notifications.callback.send({
  notification: 'webhooks:order-created',
  input: {
    body: { orderId: '12345', status: 'created' },
  },
});
```

## Notification Methods

| API | Description | Use cases |
|-----|-------------|-----------|
| `notifications.email.send()` | Send via email channel only | Account info, transactions |
| `notifications.push.send()` | Send via push (Firebase/Expo) only | Alerts, updates, promotions |
| `notifications.sms.send()` | Send via SMS only | OTPs, alerts, status updates |
| `notifications.callback.send()` | Send via HTTP webhook only | Integrations, automation |
| `notifications.send()` | Send to multiple channels at once | Multi-channel campaigns |
| `notifications.dispatch()` | Schedule notifications for later | Delayed/scheduled sends |
| `notifications.getMessages()` | Fetch notification message logs with time filters | Send history, reprocessing, debugging |

## Notification Tag Format

Notifications use a tag format of `notification_tag:message_tag`:

```ts
notification: 'alerts:welcome'  // notification_tag: 'alerts', message_tag: 'welcome'
notification: 'emails:order-confirmation'  // notification_tag: 'emails', message_tag: 'order-confirmation'
```

## Multi-Channel Notifications

Send to multiple channels at once with `notifications.send()` (single `input` object with multiple channel keys):

```ts
const result = await ductape.notifications.send({
  event: 'alerts:order-placed',
  input: {
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
  },
});

console.log(result.channels?.push?.success);
console.log(result.channels?.email?.success);
console.log(result.channels?.sms?.success);
```

## Notification message logs

Every send is logged server-side with **status** (`pending`, `sent`, `failed`, `reprocessing`) and **type** (channel: `email`, `push`, `sms`, `callback`, or `notification`). Use `notifications.getMessages()` to fetch send history with time filters and optional filters by product, env, status, and type. Logs include the full input used for each send so you can reprocess failed or specific notifications.

```ts
const { items, total, hasMore } = await ductape.notifications.getMessages({
  product_tag: 'my-app',
  start_date: new Date(Date.now() - 7 * 864e5).toISOString(),
  end_date: new Date().toISOString(),
  status: 'failed',
  page: 1,
  limit: 50,
});
```

See [Notification Message Logs](./message-logs) for query options, response shape, and reprocessing.

## Best Practices

- Use clear, actionable language
- Personalize with user-specific data
- Test in development before production
- Respect user opt-in/opt-out preferences
- Monitor delivery metrics
- Use `dispatch()` for scheduled notifications
- Use `getMessages()` with time filters to audit sends and reprocess failures

## See Also

* [Setting Up Notifications](./setup)
* [Sending Notifications](./send)
* [Notification Message Logs](./message-logs)
* [Message Templates](./templates/manage-messages)
