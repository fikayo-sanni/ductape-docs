---
sidebar_position: 2
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
- **[Set Up Notification Channels](../setting-up.md):** Learn how to configure channels like push, email, and SMS.
- **[Message Template Guides](./):** Explore guides for other notification message types.
- **[Notification Types](../notifications.md):** See all supported notification types and their use cases.


``` typescript
const push_notification: {
    title: "Credit Alert From {{username}}",
    body: "{{username}} sent you {{amount}} {{currency}}",
    data: {
        transaction_id: "{{transactionId}}",
        bank_code: "{{bankCode}}"
    }
}
```

## Templates in Push Notifications

The above sample code shows you how to create templates in push notifications, the template above defines the data input required to send a push notification. A sample data expected when sending the above push notifications would look like this

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

This expected data would automatically replace the template variables marked with `{{}}` and generate a notification body as follows

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

This is important to note when processing push notifications in subsequent sections