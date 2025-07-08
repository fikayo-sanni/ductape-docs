---
sidebar_position: 2
---

# Notifications

Notification events in Ductape are used to communicate important information to users or systems through channels such as push notifications, emails, or webhooks. They enable your feature to notify stakeholders, ensuring that essential updates and messages are delivered effectively.

## What is a Notification Event?

A notification event is defined using the `IFeatureEvent` type from the SDK, with `type` set to `FeatureEventTypes.NOTIFICATION`. It specifies the parameters for sending notifications, including the content and target audience.

## IFeatureEvent Structure (Notification)

```typescript
interface IFeatureEvent {
  type: FeatureEventTypes;     // Required: Should be FeatureEventTypes.NOTIFICATION
  event: string;              // Required: The action tag for the notification
  input: {
    slug: string;             // Required: Unique identifier for the notification event
    push_notification: {
      title: Record<string, unknown>;
      body: Record<string, unknown>;
      data: Record<string, unknown>;
      device_token: string;
    };
    email?: Record<string, unknown>;
    webhook?: {
      query: Record<string, unknown>;
      params: Record<string, unknown>;
      body: Record<string, unknown>;
    };
  };
  retries: number;            // Required: Number of retry attempts if the notification fails
  allow_fail: boolean;        // Required: Whether the event can fail without affecting the overall sequence
  // ...other optional fields
}
```

## Properties

| Property     | Type                                    | Required | Description                                                                                     |
|--------------|-----------------------------------------|----------|-------------------------------------------------------------------------------------------------|
| `type`       | `FeatureEventTypes`                     | Yes      | Should be `FeatureEventTypes.NOTIFICATION`.                                                     |
| `event`      | `string`                                | Yes      | The action tag that uniquely identifies the notification.                                       |
| `input`      | `{ slug, push_notification, email?, webhook? }` | Yes | Input parameters for the notification.                                                          |
| `retries`    | `number`                                | Yes      | Number of retry attempts allowed if the notification fails.                                     |
| `allow_fail` | `boolean`                               | Yes      | Whether the event can fail without affecting the overall sequence.                              |

## Example: Notification Event

```typescript
const sendPushNotificationEvent: IFeatureEvent = {
  type: FeatureEventTypes.NOTIFICATION,
  event: 'send_push_notification',
  input: {
    slug: `$Variable{notification_service}{slug}`,
    push_notification: {
      title: {
        en: `$Variable{notification_service}{title_en}`,
        es: `$Variable{notification_service}{title_es}`,
      },
      body: {
        en: `$Variable{notification_service}{body_en}`,
        es: `$Variable{notification_service}{body_es}`,
      },
      data: {
        orderId: `$Sequence{order_processing}{process_order}{order_id}`,
        status: 'shipped',
      },
      device_token: `$Variable{notification_service}{device_token}`,
    },
    email: {
      to: `$Variable{notification_service}{recipient_email}`,
      subject: `$Variable{notification_service}{email_subject}`,
      body: `$Variable{notification_service}{email_body}`,
    },
    webhook: {
      query: {
        notificationId: `$Sequence{notification_processing}{send_notification}{notification_id}`,
      },
      params: {
        eventId: `$Variable{notification_service}{event_id}`,
      },
      body: {
        message: `$Variable{notification_service}{webhook_message}`,
      },
    },
  },
  retries: 3,
  allow_fail: false,
};
```

## Best Practices
- Use descriptive event tags and slugs for clarity.
- Leverage data piping in input fields to dynamically reference data from previous events or feature inputs.
- Set `retries` and `allow_fail` thoughtfully to control error handling and resilience.
- Document the purpose and expected result of each notification event for maintainability.

## See Also
- [Features Overview](../../../getting-started.md)
- [Event Types Overview](/category/event-types)
- [Data Piping](../data-piping.md)
