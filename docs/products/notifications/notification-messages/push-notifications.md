---
sidebar_position: 1
---

# Push Notifications

Push notifications in Ductape let you send parameterized alerts to your users' devices through your configured push provider. Use push notifications for real-time alerts, confirmations, or updates.

## What Is a Push Notification?
A push notification consists of:
- **title**: The title of the push notification (**required**). Can include template variables (e.g., `{{username}}`).
- **body**: The body of the push notification (**required**). Can include template variables.
- **data**: Additional data sent with the notification (**optional**, JSON object). Can include template variables.

## Push Notification Structure
- **title**: The notification title, with optional template variables.
- **body**: The notification body, with optional template variables.
- **data**: Optional JSON object with additional data, with optional template variables.

**Example Template:**
```typescript
const push_notification = {
  title: "Credit Alert From {{username}}",
  body: "{{username}} sent you {{amount}} {{currency}}",
  data: {
    transaction_id: "{{transactionId}}",
    bank_code: "{{bankCode}}"
  }
}
```

## Using Template Variables
Template variables in any part of the push notification are enclosed in `{{ }}` and replaced with actual values when the notification is sent.

> **Note:** All template variables in your title, body, and data must be provided in the data object when sending the notification. If a variable is missing, the placeholder will remain unreplaced in the final notification.

## Example Input Data
```typescript
const data = {
  title: {
    username: "Thomas"
  },
  body: {
    username: "Thomas",
    amount: "50",
    currency: "GBP"
  },
  data: {
    transactionId: "111292929-1-18288282",
    bankCode: "039"
  }
}
```

## Generated Push Notification
The system will automatically replace the placeholders to produce:

```typescript
{
  title: "Credit Alert From Thomas",
  body: "Thomas sent you 50 GBP",
  data: {
    transaction_id: "111292929-1-18288282",
    bank_code: "039"
  }
}
```

**Key Points:**
- All template variables are required at send time.
- Unmatched placeholders will remain in the message.
- Choose and configure your push provider in your notification environment settings.

**Next Steps:**
- [Set Up Notification Channels](../setting-up.md)
- [Message Template Guides](/category/notification-messages)
- [Notification Types](../notifications.md)