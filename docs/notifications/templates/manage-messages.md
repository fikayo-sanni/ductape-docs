---
sidebar_position: 1
---

# Managing Notification Messages

Ductape lets you manage notification messages across all your channels push, email, callbacks, and more. Notification messages help you keep users informed about important events in your product, and you can easily create, update, and fetch them using the SDK.

> **Note:** Notification message tags should follow the format `notificationTag:messageTag` (for example, `notify-users:new-message`). This keeps your tags organized and prevents conflicts across different notifiers and messages.

## What Are Notification Messages?
Notification messages are reusable templates that define how you communicate with users for specific events. Each message can include content for multiple channels (push, email, callback, SMS), making it easy to keep your notifications consistent and manageable.

## Notification Message Structure
| Field                   | Type                       | Description                                                      |
|-------------------------|----------------------------|------------------------------------------------------------------|
| `_id`                   | ObjectId (optional)        | Unique identifier (auto-generated)                               |
| `name`                  | string                     | Display name for your message                                    |
| `tag`                   | string                     | Unique tag for this message (see note above)                     |
| `description`           | string                     | Short description of what this message is for                    |
| `push_notification`     | object (optional)          | Push notification template (see push docs)                       |
| `push_notification_data`| array (optional)           | Data samples for push notification                               |
| `email`                 | object (optional)          | Email template (see email docs)                                  |
| `email_data`            | array (optional)           | Data samples for email                                           |
| `callback`              | object (optional)          | Callback template (see callback docs)                            |
| `callback_data`         | array (optional)           | Data samples for callback                                        |
| `sms`                   | string (optional)          | SMS template (see SMS docs)                                      |
| `sms_data`              | array (optional)           | Data samples for SMS                                             |

## Creating a Notification Message
To create a notification message, use the `create` function from the `product.notifications.messages` interface:

```typescript
const message = await ductape.notifications.message.create({
  name: "New Notification",
  tag: "notify-users:new-message",
  description: "Notify customer of great things",
  push_notification,
  callback,
  email,
  sms,
});
```

## Updating a Notification Message
To update an existing notification message, use the `update` function:

```typescript
const updatedMessage = await ductape.notifications.message.update("notify-users:new-message", {
  push_notification,
  callback,
  email,
  sms,
});
```

You can update any of the fields or channels as needed.

## Fetching Notification Messages
To get all messages in a notification category, use the `fetchAll` function:

```typescript
const messages = await ductape.notifications.message.fetchAll("notify-users");
```

## Fetching a Single Notification Message
To get a specific message by its tag, use the `fetch` function:

```typescript
const message = await ductape.notifications.message.fetch("notify-users:new-message");
```

**Key Points:**
- Notification messages are reusable templates for all notification channels.
- Tags should be unique and follow the `notificationTag:messageTag` format.
- Each message can include templates for push, email, callback, and SMS.
- Data samples help you test and preview your templates.

**Next Steps:**
- [Set Up Notification Channels](../setup.md)
- [Message Template Guides](./manage-messages)
- [Notification Types](../overview.md)