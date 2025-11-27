---
sidebar_position: 3
---

# Sending Notifications

Send push notifications, emails, SMS, or webhook callbacks using `ductape.notification.send()`.

## Quick Example

```ts
await ductape.notification.send({
  env: 'prd',
  product_tag: 'my-app',
  event: 'welcome_user',
  input: {
    slug: 'welcome',
    email: {
      to: ['john@example.com'],
      subject: { en: 'Welcome to MyApp!' },
      template: { en: '<h1>Hello John!</h1><p>Thanks for joining us.</p>' }
    }
  }
});
```

## Notification Types

Ductape supports multiple notification channels. You can send one or multiple at the same time:

### Email

```ts
await ductape.notification.send({
  env: 'prd',
  product_tag: 'my-app',
  event: 'order_confirmation',
  input: {
    slug: 'order_email',
    email: {
      to: ['customer@example.com'],
      subject: { en: 'Your order is confirmed!' },
      template: { en: '<h1>Order #12345</h1><p>Thank you for your purchase.</p>' }
    }
  }
});
```

### Push Notification

```ts
await ductape.notification.send({
  env: 'prd',
  product_tag: 'my-app',
  event: 'new_message',
  input: {
    slug: 'push_message',
    push_notification: {
      title: { en: 'New Message' },
      body: { en: 'You have a new message from Sarah' },
      data: { messageId: 'msg_123', senderId: 'user_456' },
      device_token: 'ExponentPushToken[xxxxx]'
    }
  }
});
```

### SMS

```ts
await ductape.notification.send({
  env: 'prd',
  product_tag: 'my-app',
  event: 'otp_code',
  input: {
    slug: 'sms_otp',
    sms: {
      phone: '+1234567890',
      message: 'Your verification code is 123456'
    }
  }
});
```

### Webhook Callback

```ts
await ductape.notification.send({
  env: 'prd',
  product_tag: 'my-app',
  event: 'payment_received',
  input: {
    slug: 'webhook_payment',
    callback: {
      body: { orderId: '12345', amount: 99.99, status: 'paid' },
      headers: { 'X-Webhook-Secret': 'secret123' }
    }
  }
});
```

## Sending Multiple Channels at Once

```ts
await ductape.notification.send({
  env: 'prd',
  product_tag: 'my-app',
  event: 'order_shipped',
  input: {
    slug: 'shipping_notification',
    email: {
      to: ['customer@example.com'],
      subject: { en: 'Your order has shipped!' },
      template: { en: '<p>Track your package: ABC123</p>' }
    },
    push_notification: {
      title: { en: 'Order Shipped!' },
      body: { en: 'Your order is on its way' },
      data: { trackingNumber: 'ABC123' },
      device_token: 'device_token_here'
    },
    sms: {
      phone: '+1234567890',
      message: 'Your order has shipped! Track: ABC123'
    }
  }
});
```

## Using Session Data

Inject user-specific data from sessions using `$Session{key}{field}`:

```ts
await ductape.notification.send({
  env: 'prd',
  product_tag: 'my-app',
  event: 'welcome_user',
  input: {
    slug: 'welcome',
    push_notification: {
      title: { en: 'Welcome!' },
      body: { en: 'Hi $Session{user}{firstName}, thanks for joining!' },
      data: { userId: '$Session{user}{id}' },
      device_token: '$Session{user}{deviceToken}'
    }
  },
  session: {
    tag: 'user-session',
    token: 'eyJhbGciOi...'
  }
});
```

## Optional Parameters

| Parameter | What it does |
|-----------|--------------|
| `retries` | Number of retry attempts if sending fails |
| `cache` | Cache tag to avoid duplicate sends |
| `session` | Session object for dynamic value injection |

```ts
await ductape.notification.send({
  env: 'prd',
  product_tag: 'my-app',
  event: 'daily_digest',
  input: { slug: 'digest', /* ... */ },
  retries: 3,
  cache: 'daily-digest-user123'
});
```

---

## Reference

### INotificationProcessorInput

```ts
interface INotificationProcessorInput {
  env: string;
  product_tag: string;
  event: string;
  input: INotificationRequest;
  retries?: number;
  cache?: string;
  session?: ISession;
}
```

### INotificationRequest

```ts
interface INotificationRequest {
  slug: string;
  push_notification?: {
    title: Record<string, string>;
    body: Record<string, string>;
    data: Record<string, unknown>;
    device_token: string;
  };
  email?: {
    to: string[];
    subject: Record<string, string>;
    template: Record<string, string>;
  };
  sms?: Record<string, unknown>;
  callback?: {
    query?: Record<string, unknown>;
    params?: Record<string, unknown>;
    body?: Record<string, unknown>;
    headers?: Record<string, unknown>;
  };
}
```

### ISession

```ts
interface ISession {
  tag: string;   // Session identifier
  token: string; // Encrypted session token
}
```

## See Also

* [Setting Up Notifications](./setup)
* [Notification Templates](./templates/manage-messages)
* [Sessions](../sessions/overview)
