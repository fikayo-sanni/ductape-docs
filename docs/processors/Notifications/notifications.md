---
sidebar_position: 1
---

# Sending Notifications

Notifications are sent using `ductape.processor.notification.send(data)` within the Ductape system. This method triggers push notifications, emails, or callbacks based on the provided environment, product tag, and other parameters.

```ts
await ductape.processor.notification.send(data: INotificationProcessorInput)
```

This processes a notification event in the specified environment and application context, passing along request input, metadata, and optionally session tracking.


## Parameters

### `INotificationProcessorInput`

| Field         | Type                        | Required | Description                                          |
| ------------- | --------------------------- | -------- | ---------------------------------------------------- |
| `env`         | `string`                    | Yes      | Slug of the environment (e.g., `"dev"`, `"prd"`).   |
| `product_tag` | `string`                    | Yes      | Unique product identifier.                           |
| `event`       | `string`                    | Yes      | Notification event tag to be triggered.              |
| `input`       | [`INotificationRequest`](#inotificationrequest) | Yes | Details of the notification to be sent.              |
| `retries`     | `number`                    | No       | Number of retry attempts on failure.                 |
| `cache`       | `string`                    | No       | Cache tag to enable response caching.                |
| `session`     | [`ISession`](#isession-schema) | No   | Enables session-based dynamic injection into inputs. |

> **Note:** Optional fields like `email`, `callback`, or internal objects can be omitted or passed as empty `{}`.


## `INotificationRequest`

Shape of the `input` object:

```ts
interface INotificationRequest {
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


## `ISession` Schema

The `session` field enables optional session tracking for any notification send.

```ts
interface ISession {
  tag: string;   // session tag
  token: string; // session token (e.g. signed JWT)
}
```

| Field   | Type     | Required | Description                                   |
| ------- | -------- | -------- | --------------------------------------------- |
| `tag`   | `string` | Yes      | Session tag reference (e.g., `"user-sessions"`). |
| `token` | `string` | Yes      | Encrypted token used to resolve values.       |


## Injecting Session Data into Input

You can inject properties from the session payload into the `input` object using the `$Session{parent_key}{key}` annotation. This resolves the value dynamically from the decrypted session object.

For example:

```ts
push_notification: {
  title: { en: "Welcome back!" },
  body: { en: "Good to see you, $Session{details}{firstName}!" },
  data: { userId: "$Session{details}{id}" },
  device_token: "$Session{details}{deviceToken}"
}
```

> Ensure the session contains a matching `parent_key` and fields (e.g., `id`, `firstName`).


## Returns

A `Promise<unknown>` — resolves with the result of the notification action. The structure varies depending on the notification definition.


## Example

```ts
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


## See Also

* [Processing Features](../feature/processing)
* [Refreshing Sessions](../sessions/refreshing)
* [Session Tracking](../sessions)
