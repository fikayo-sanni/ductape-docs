---
sidebar_position: 1
---

# Sending Notifications  

Sending notifications is done using `notification.send(data)` of the `ductape.processor` interface.  

This method triggers notifications within the Ductape system, handling push notifications, emails, and callbacks based on the provided environment, product tag, and other parameters.  

## Function Signature  
```typescript
await ductape.processor.notification.send(data: INotificationProcessorInput)
```

## Parameters  

### `INotificationProcessorInput`  
An object containing details for executing the notification processor.  

#### Properties:  
- **`env`** (`string`, **required**) – The slug of the environment where the notification should be sent (e.g., `"dev"`, `"prd"`).  
- **`product_tag`** (`string`, **required**) – A unique identifier for the product associated with the notification.  
- **`event`** (`string`, **required**) – The tag of the notification event to be triggered.
- **`cache`**(`string`, **optional**) - The tag of the cache, if applicable. only to be used when caching requests
- **`input`** (`INotificationRequest`, **required**) – Contains notification details, including push notifications, emails, and callbacks.  
- **`retries`** (`number`, **optional**) – The number of retry attempts in case of failure.  

## `INotificationRequest` Schema  
The `input` property follows the `INotificationRequest` schema:  
```typescript
export interface INotificationRequest {
  slug: string;
  push_notification: {
    title: Record<string, unknown>;
    body: Record<string, unknown>;
    data: Record<string, unknown>;
    device_token: string;
  };
  email?: {
    to: Array<string>;
    subject: Record<string, unknown>;
    template: Record<string, unknown>;
  };
  callback?: {
    query: Record<string, unknown>;
    params: Record<string, unknown>;
    body: Record<string, unknown>;
    headers: Record<string, unknown>;
  };
}
```
- **`slug`** (`string`, **required**) – A unique identifier for the notification.  
- **`push_notification`** (`object`, **required**) – Details for sending a push notification.  
  - **`title`** (`Record<string, unknown>`, **required**) – The notification title.  
  - **`body`** (`Record<string, unknown>`, **required**) – The notification message.  
  - **`data`** (`Record<string, unknown>`, **required**) – Additional metadata for the notification.  
  - **`device_token`** (`string`, **required**) – The recipient's device token.  
- **`email`** (`object`, **optional**) – Email notification details.  
  - **`to`** (`Array<string>`, **required**) – List of email recipients.  
  - **`subject`** (`Record<string, unknown>`, **required**) – The email subject.  
  - **`template`** (`Record<string, unknown>`, **required**) – The email template body.  
- **`callback`** (`object`, **optional**) – Callback request details for external API notifications.  
  - **`query`** (`Record<string, unknown>`, **optional**) – Query parameters.  
  - **`params`** (`Record<string, unknown>`, **optional**) – Route parameters.  
  - **`body`** (`Record<string, unknown>`, **optional**) – Request body.  
  - **`headers`** (`Record<string, unknown>`, **optional**) – Request headers.  

If any optional fields are empty or `undefined`, they should be set as empty objects `{}`.  

## Returns  
A `Promise<unknown>` that resolves with the result of the notification action. The response structure depends on the specific notification being processed.  

## Example Usage  
```typescript
import { ductape } from 'ductape-sdk';

const data: INotificationProcessorInput = {
  env: "prd",
  product_tag: "my-product",
  event: "user_welcome",
  input: {
    slug: "welcome_notification",
    push_notification: {
      title: { en: "Welcome!" },
      body: { en: "Thanks for signing up!" },
      data: { action: "open_dashboard" },
      device_token: "abcdef123456"
    },
    email: {
      to: ["user@example.com"],
      subject: { en: "Welcome to our platform!" },
      template: { en: "<h1>Hello!</h1><p>Thanks for joining us.</p>" }
    },
    callback: {
      query: { userId: "123" },
      body: { event: "welcome_sent" },
      headers: { Authorization: "Bearer token" }
    }
  },
  retries: 3
};

const res = await ductape.processor.notification.send(data);
```