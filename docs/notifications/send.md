---
sidebar_position: 3
---

# Sending Notifications

Send push notifications, emails, SMS, or webhook callbacks using dedicated methods on `ductape.notifications`.

## Channel-Specific Methods

### Push Notification

```ts
const result = await ductape.notifications.push({
  product: 'my-app',
  env: 'prd',
  notification: 'alerts:welcome',
  input: {
    device_tokens: ['device-token-1', 'device-token-2'],
    title: { name: 'John' },
    body: { message: 'Welcome to our app!' },
    data: { action: 'open_home' },
  },
});

console.log(result.success); // true
console.log(result.messageId); // unique ID
```

### Email

```ts
const result = await ductape.notifications.email({
  product: 'my-app',
  env: 'prd',
  notification: 'emails:order-confirmation',
  input: {
    recipients: ['customer@example.com', 'admin@example.com'],
    subject: { orderId: '12345' },
    template: {
      customerName: 'John Doe',
      orderTotal: '$99.99',
    },
  },
});

console.log(result.success); // true
```

### SMS

```ts
const result = await ductape.notifications.sms({
  product: 'my-app',
  env: 'prd',
  notification: 'sms:verification',
  input: {
    recipients: ['+1234567890', '+0987654321'],
    body: { code: '123456' },
  },
});

console.log(result.success); // true
```

### Webhook Callback

```ts
const result = await ductape.notifications.callback({
  product: 'my-app',
  env: 'prd',
  notification: 'webhooks:order-created',
  input: {
    body: {
      orderId: '12345',
      status: 'created',
      timestamp: Date.now(),
    },
    headers: {
      'X-Custom-Header': 'value',
    },
  },
});

console.log(result.success); // true
```

## Multi-Channel Send

Send to multiple channels at once using `send()`:

```ts
const result = await ductape.notifications.send({
  product: 'my-app',
  env: 'prd',
  notification: 'alerts:order-shipped',
  push_notification: {
    device_tokens: ['token1'],
    title: { status: 'Order Shipped!' },
    body: { message: 'Your order is on its way' },
    data: { trackingNumber: 'ABC123' },
  },
  email: {
    recipients: ['customer@example.com'],
    subject: { orderId: '12345' },
    template: { trackingUrl: 'https://track.example.com/ABC123' },
  },
  sms: {
    recipients: ['+1234567890'],
    body: { tracking: 'ABC123' },
  },
});

// Check results per channel
console.log(result.success); // true if at least one succeeded
console.log(result.channels.push?.success);
console.log(result.channels.email?.success);
console.log(result.channels.sms?.success);
```

## Scheduling Notifications

Schedule notifications for later using `dispatch()`:

```ts
const result = await ductape.notifications.dispatch({
  product: 'my-app',
  env: 'prd',
  notification: 'reminders:payment-due',
  push_notification: {
    device_tokens: ['token1'],
    title: { name: 'Payment' },
    body: { message: 'Your payment is due' },
  },
  schedule: {
    start_at: Date.now() + 86400000, // 24 hours from now
  },
  retries: 3,
});

console.log(result.jobId); // unique job ID
console.log(result.status); // 'queued'
```

### Schedule Options

| Option | Type | Description |
|--------|------|-------------|
| `start_at` | number/string | Timestamp when to send |
| `cron` | string | Cron expression for recurring |
| `every` | number | Interval in milliseconds |
| `limit` | number | Max number of sends |
| `endDate` | number/string | When to stop recurring |
| `tz` | string | Timezone for scheduling |

## Using Session Data

Include session context for user-specific data:

```ts
await ductape.notifications.push({
  product: 'my-app',
  env: 'prd',
  notification: 'alerts:personalized',
  input: {
    device_tokens: ['token1'],
    title: { greeting: 'Hi there!' },
    body: { message: 'Check out your personalized recommendations' },
  },
  session: {
    tag: 'user-session',
    token: 'eyJhbGciOi...',
  },
});
```

## Optional Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `session` | object | Session for authenticated requests |
| `cache` | string | Cache tag to avoid duplicate sends |

---

## Reference

### IPushOptions

```ts
interface IPushOptions {
  product: string;
  env: string;
  notification: string;  // format: notification_tag:message_tag
  input: {
    device_tokens: string[];
    title?: Record<string, unknown>;
    body?: Record<string, unknown>;
    data?: Record<string, unknown>;
  };
  session?: { tag: string; token: string };
  cache?: string;
}
```

### IEmailOptions

```ts
interface IEmailOptions {
  product: string;
  env: string;
  notification: string;
  input: {
    recipients: string[];
    subject?: Record<string, unknown>;
    template?: Record<string, unknown>;
  };
  session?: { tag: string; token: string };
  cache?: string;
}
```

### ISmsOptions

```ts
interface ISmsOptions {
  product: string;
  env: string;
  notification: string;
  input: {
    recipients: string[];
    body?: Record<string, unknown>;
  };
  session?: { tag: string; token: string };
  cache?: string;
}
```

### ICallbackOptions

```ts
interface ICallbackOptions {
  product: string;
  env: string;
  notification: string;
  input: {
    query?: Record<string, unknown>;
    headers?: Record<string, unknown>;
    params?: Record<string, unknown>;
    body?: Record<string, unknown>;
  };
  session?: { tag: string; token: string };
  cache?: string;
}
```

### INotificationResult

```ts
interface INotificationResult {
  success: boolean;
  channel: 'push' | 'email' | 'sms' | 'callback';
  messageId?: string;
  error?: string;
}
```

### IMultiChannelNotificationResult

```ts
interface IMultiChannelNotificationResult {
  success: boolean;  // true if at least one channel succeeded
  channels: {
    push?: INotificationResult;
    email?: INotificationResult;
    sms?: INotificationResult;
    callback?: INotificationResult;
  };
}
```

## See Also

* [Setting Up Notifications](./setup)
* [Notification Templates](./templates/manage-messages)
* [Sessions](../sessions/overview)
