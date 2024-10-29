---
sidebar_position: 2
---

# Notifications

Notifications in the Features context are specifically designed for communicating important information to users or systems through various channels such as push notifications, emails, or webhooks. They allow you to define how your feature will notify stakeholders, ensuring that essential updates and messages are conveyed effectively.

## Overview of Notification Events

A **Notification Event** allows you to specify the necessary parameters for sending notifications, including the content and target audience. It plays a crucial role in ensuring that notifications are delivered accurately and efficiently, leveraging the data piping methodology previously discussed.

### Notification Event Interface

```typescript
interface IFeatureEvent {
  type: FeatureEventTypes;     // Required: Specifies the type of event (should be FeatureEventTypes.NOTIFICATION).
  event: string;               // Required: The action tag that uniquely identifies the specific notification being sent.
  input: {                     // Required: Input parameters for the notification.
    slug: string;              // Required: A unique identifier for the notification event.
    push_notification: {       // Required: Parameters for sending push notifications.
      title: Record<string, unknown>;   // Required: The title of the push notification.
      body: Record<string, unknown>;    // Required: The body content of the push notification.
      data: Record<string, unknown>;    // Required: Additional data associated with the push notification.
      device_token: string;    // Required: The device token for targeting the recipient device.
    };
    email?: Record<string, unknown>; // Optional: Parameters for sending email notifications.
    webhook?: {               // Optional: Parameters for sending webhook notifications.
      query: Record<string, unknown>; // Required: Query parameters for the webhook.
      params: Record<string, unknown>; // Required: Route parameters for the webhook.
      body: Record<string, unknown>;   // Required: Body of the request for the webhook.
    };  
  };
  retries: number;            // Required: Number of retry attempts if the notification fails.
  allow_fail: boolean;        // Required: Indicates if the event can fail without affecting the overall sequence.
}
```

### Properties Table

| Property       | Type                                    | Required | Description                                                                                     |
|----------------|-----------------------------------------|----------|-------------------------------------------------------------------------------------------------|
| `type`         | `FeatureEventTypes`                     | Yes      | Specifies the type of event, should be `FeatureEventTypes.NOTIFICATION`.                       |
| `event`        | `string`                                | Yes      | The action tag that uniquely identifies the specific notification being sent.                   |
| `input`        | `{ slug, push_notification, email?, webhook? }` | Yes      | Input parameters for the notification, which can include: <br/>- `slug`: Required unique identifier for the notification.<br/>- `push_notification`: Required parameters for sending push notifications.<br/>- `email`: Optional parameters for email notifications.<br/>- `webhook`: Optional parameters for webhook notifications. |
| `retries`      | `number`                                | Yes      | The number of retry attempts allowed if the notification fails.                                 |
| `allow_fail`   | `boolean`                               | Yes      | Indicates whether the event can fail without affecting the overall sequence.                    |

### Sample Notification Event

Here is an example of a sample notification event for sending a push notification, using data piping variables to demonstrate data flow:

```typescript
const sendPushNotificationEvent: IFeatureEvent = {
    type: FeatureEventTypes.NOTIFICATION, // The event type.
    event: 'send_push_notification', // The action tag for sending push notifications.
    input: {
        slug: `$Variable{notification_service}{slug}`, // A unique identifier for the notification event from the variable.
        push_notification: {
            title: {
                en: `$Variable{notification_service}{title_en}`, // Title in English from the variable.
                es: `$Variable{notification_service}{title_es}`, // Title in Spanish from the variable.
            },
            body: {
                en: `$Variable{notification_service}{body_en}`, // Body in English from the variable.
                es: `$Variable{notification_service}{body_es}`, // Body in Spanish from the variable.
            },
            data: {
                orderId: `$Sequence{order_processing}{process_order}{order_id}`, // Additional data associated with the push notification.
                status: 'shipped', // Status of the order.
            },
            device_token: `$Variable{notification_service}{device_token}`, // Device token for targeting the recipient device from the variable.
        },
        email: {
            to: `$Variable{notification_service}{recipient_email}`, // Recipient email address from the variable.
            subject: `$Variable{notification_service}{email_subject}`, // Subject of the email from the variable.
            body: `$Variable{notification_service}{email_body}`, // Body content of the email from the variable.
        },
        webhook: {
            query: {
                notificationId: `$Sequence{notification_processing}{send_notification}{notification_id}`, // Query parameter for the webhook from a sequence.
            },
            params: {
                eventId: `$Variable{notification_service}{event_id}`, // Route parameter for the webhook from the variable.
            },
            body: {
                message: `$Variable{notification_service}{webhook_message}`, // Body of the request for the webhook from the variable.
            },
        },
    },
    retries: 3, // Number of retry attempts if the notification fails.
    allow_fail: false, // The notification cannot fail without affecting the overall sequence.
};
```

### Conclusion

By using Notification Events and integrating data piping variables, you can effectively manage how your features communicate important information through various channels, ensuring proper delivery and error handling in the process. This structure facilitates the creation of robust, reliable notification systems that enhance user experience and system interaction.
