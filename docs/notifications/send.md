---
sidebar_position: 3
---

# Sending Notifications

Send push notifications, emails, SMS, or webhook callbacks using channel-specific APIs on `ductape.notifications`. Each channel (`.email`, `.push`, `.sms`, `.callback`) exposes a `.send()` method so you can target that channel only.

## Channel-Specific Methods

### Push: `notifications.push.send()`

Send via the push channel only (Firebase, Expo):

```ts
const result = await ductape.notifications.push.send({
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

### Email: `notifications.email.send()`

Send via the email channel only:

```ts
const result = await ductape.notifications.email.send({
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

### SMS: `notifications.sms.send()`

Send via the SMS channel only:

```ts
const result = await ductape.notifications.sms.send({
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

### Callback: `notifications.callback.send()`

Send via the webhook/callback channel only:

```ts
const result = await ductape.notifications.callback.send({
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

Send to multiple channels at once using `notifications.send()` with an `input` object that includes multiple channel keys:

```ts
const result = await ductape.notifications.send({
  product: 'my-app',
  env: 'prd',
  event: 'alerts:order-shipped',
  input: {
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
  },
});

// Check results per channel
console.log(result.success); // true if at least one succeeded
console.log(result.channels?.push?.success);
console.log(result.channels?.email?.success);
console.log(result.channels?.sms?.success);
```

## Scheduling Notifications

Schedule notifications for later using `notifications.dispatch()`:

```ts
const result = await ductape.notifications.dispatch({
  product: 'my-app',
  env: 'prd',
  notification: 'reminders',
  event: 'payment-due',
  input: {
    push_notification: {
      device_tokens: ['token1'],
      title: { name: 'Payment' },
      body: { message: 'Your payment is due' },
    },
  },
  schedule: {
    start_at: Date.now() + 86400000, // 24 hours from now
  },
  retries: 3,
});

console.log(result.job_id); // unique job ID
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

Include session context for user-specific data. Pass `session` as a string in the format `session_tag:jwt_token`:

```ts
await ductape.notifications.push.send({
  product: 'my-app',
  env: 'prd',
  notification: 'alerts:personalized',
  input: {
    device_tokens: ['token1'],
    title: { greeting: 'Hi there!' },
    body: { message: 'Check out your personalized recommendations' },
  },
  session: 'user-session:eyJhbGciOi...',
});
```

## Optional Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `session` | string | Session in format `session_tag:jwt_token` for authenticated requests |
| `cache` | string | Cache tag to avoid duplicate sends |

---

## Reference

### Channel APIs

| API | Options type | Description |
|-----|--------------|-------------|
| `notifications.email.send(options)` | IEmailOptions | Send via email channel only |
| `notifications.push.send(options)` | IPushOptions | Send via push channel only |
| `notifications.sms.send(options)` | ISmsOptions | Send via SMS channel only |
| `notifications.callback.send(options)` | ICallbackOptions | Send via webhook/callback channel only |

### IPushOptions

Used by `notifications.push.send()`:

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
  session?: string;  // format: session_tag:jwt_token
  cache?: string;
}
```

### IEmailOptions

Used by `notifications.email.send()`:

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
  session?: string;  // format: session_tag:jwt_token
  cache?: string;
}
```

### ISmsOptions

Used by `notifications.sms.send()`:

```ts
interface ISmsOptions {
  product: string;
  env: string;
  notification: string;
  input: {
    recipients: string[];
    body?: Record<string, unknown>;
  };
  session?: string;  // format: session_tag:jwt_token
  cache?: string;
}
```

### ICallbackOptions

Used by `notifications.callback.send()`:

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
  session?: string;  // format: session_tag:jwt_token
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

## Fetching notification message logs

Use `notifications.getMessages()` to fetch send history with time filters. Results are scoped to your workspace and include **status** (`pending`, `sent`, `failed`, `reprocessing`) and **type** (channel). All query parameters are optional.

```ts
const { items, total, hasMore } = await ductape.notifications.getMessages({
  product_tag: 'my-app',
  env: 'prd',
  start_date: new Date(Date.now() - 7 * 864e5).toISOString(),
  end_date: new Date().toISOString(),
  status: 'failed',
  type: 'email',
  page: 1,
  limit: 50,
});
```

See [Notification Message Logs](./message-logs) for full query options, response shape, and reprocessing.

## See Also

* [Setting Up Notifications](./setup)
* [Notification Message Logs](./message-logs)
* [Notification Templates](./templates/manage-messages)
* [Sessions](../sessions/overview)
