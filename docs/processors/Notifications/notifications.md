---
sidebar_position: 1
---

# Sending Notifications

Notifications are sent using `ductape.processor.notification.send(data)` within the Ductape system. This method triggers push notifications, emails, or callbacks based on the provided environment, product tag, and other parameters.

## Function Signature

```ts
await ductape.processor.notification.send(data: INotificationProcessorInput)
````

## Parameters

### `INotificationProcessorInput`

Object containing details for executing the notification processor.

| Property      | Type                   | Required   | Description                                          |
| ------------- | ---------------------- | ---------- | ---------------------------------------------------- |
| `env`         | `string`               | ✅ Yes      | Slug of the environment (e.g., `"dev"`, `"prd"`).    |
| `product_tag` | `string`               | ✅ Yes      | Unique product identifier.                           |
| `event`       | `string`               | ✅ Yes      | Notification event tag to be triggered.              |
| `input`       | `INotificationRequest` | ✅ Yes      | Details of the notification to be sent.              |
| `retries`     | `number`               | ❌ Optional | Number of retry attempts on failure.                 |
| `cache`       | `string`               | ❌ Optional | Cache tag to enable response caching.                |
| `session`     | `ISession`      | ❌ Optional | Enables session-based dynamic injection into inputs. |



### `INotificationRequest`

Shape of the `input` object.

```ts
export interface INotificationRequest {
  slug: string;
  push_notification: {
    title: Record<string, unknown>;
    body: Record<string, unknown>;
    data: Record<string, unknown>;
    device_token: string;
  };
  email?: {
    to: string[];
    subject: Record<string, unknown>;
    template: Record<string, unknown>;
  };
  callback?: {
    query?: Record<string, unknown>;
    params?: Record<string, unknown>;
    body?: Record<string, unknown>;
    headers?: Record<string, unknown>;
  };
  sms?: Record<string, unknown>;
}
```

### `ISession`

Used for securely injecting data into the `input` via encrypted session tokens.

```ts
{
  tag: string;
  token: string;
}
```

| Field   | Type     | Required | Description                             |
| ------- | -------- | -------- | --------------------------------------- |
| `tag`   | `string` | ✅ Yes    | Session tag reference (e.g., `"user-sessions"`). |
| `token` | `string` | ✅ Yes    | Encrypted token used to resolve values. |


### Injecting Session Data into Input

You can reference session values in the `input` object using:

```ts
$Session{parent_key}{key}
```

This syntax allows injecting data from the resolved session into the request.

#### Example

```ts
push_notification: {
  title: { en: "Welcome back!" },
  body: { en: "Good to see you, $Session{details}{firstName}!" },
  data: { userId: "$Session{details}{id}" },
  device_token: "$Session{details}{deviceToken}"
}
```

## Returns

A `Promise<unknown>` resolving to the result of the notification action. Structure varies depending on the notification definition.


## Example Usage

```ts
import { ductape } from '@ductape/sdk';

const res = await ductape.processor.notification.send({
  env: "prd",
  product_tag: "my-product",
  event: "user_welcome",
  input: {
    slug: "welcome_notification",
    push_notification: {
      title: { en: "Welcome!" },
      body: { en: "Thanks for signing up, $Session{details}{firstName}!" },
      data: { action: "open_dashboard" },
      device_token: "$Session{details}{deviceToken}"
    },
    email: {
      to: ["user@example.com"],
      subject: { en: "Welcome to our platform!" },
      template: { en: "<h1>Hello!</h1><p>Thanks for joining us.</p>" }
    },
    callback: {
      query: { userId: "$Session{details}{id}" },
      body: { event: "welcome_sent" },
      headers: { Authorization: "Bearer token" }
    },
    sms: {
      firstname: { userId: "$Session{details}{firstName}" },
      lastname: { event: "$Session{details}{lastName}" },
    }
  },
  retries: 3,
  cache: "notification-user-welcome",
  session: {
    tag: "user",
    token: "eyJhbGciOi..."
  }
});
```

## Notes

* Optional fields like `email`, `callback`, or internal objects can be omitted or passed as empty `{}`.
* Use session injection to personalize notifications.
* Use cache for idempotent notification dispatches.

## Related

* [Processing Features](../feature/processing)
* [Refreshing Sessions](../sessions/refreshing)
* [Creating Sessions](../sessions/generating)
