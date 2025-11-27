---
sidebar_position: 3
---

# Callback Notifications

Callback notifications in Ductape let you send HTTP requests (webhooks) to external systems when certain events occur. Use callback notifications to trigger workflows or notify other services in real time.

## What Is a Callback Notification?
A callback notification is an HTTP request with up to four parts:
- **body**: The body of the HTTP request (optional). Can include template variables (e.g., `{{transactionId}}`).
- **params**: Path parameters for the request (optional).
- **query**: Query parameters for the request (optional).
- **headers**: HTTP headers for the request (optional).

## Callback Message Structure
- **body**: The main payload of your callback, with optional template variables.
- **params**: Path parameters, with optional template variables.
- **query**: Query parameters, with optional template variables.
- **headers**: HTTP headers, with optional template variables.

**Example Template:**
```typescript
const callback = {
  body: {
    transaction_id: "{{transactionId}}",
    bank_code: "{{bankCode}}",
    username: "{{username}}",
    event_name: "{{eventName}}",
    amount: "{{amount}}"
  },
  params: {
    notification_id: "{{notificationId}}"
  },
  query: {
    currency: "{{currency}}"
  },
  headers: {}
}
```

## Using Template Variables
Template variables in any part of the callback are enclosed in `{{ }}` and replaced with actual values when the callback is sent.

> **Note:** All template variables in your callback must be provided in the data object when sending the notification. If a variable is missing, the placeholder will remain unreplaced in the final request.

## Example Input Data
```typescript
const data = {
  body: {
    transactionId: "111292929-1-18288282",
    bankCode: "039",
    username: "Thomas",
    eventName: "credit-success",
    amount: "50"
  },
  params: {
    notificationId: "81829292-1-1992922"
  },
  query: {
    currency: "GBP"
  },
  headers: {}
}
```

## Generated Callback Request
The system will automatically replace the placeholders to produce:

```typescript
{
  body: {
    transaction_id: "111292929-1-18288282",
    bank_code: "039",
    username: "Thomas",
    event_name: "credit-success",
    amount: "50"
  },
  params: {
    notification_id: "81829292-1-1992922"
  },
  query: {
    currency: "GBP"
  },
  headers: {}
}
```

**Key Points:**
- All template variables are required at send time.
- Unmatched placeholders will remain in the message.
- You do not need to provide authentication data as part of the callback template. Authentication is handled in the notification environment setup, unless your use case requires otherwise.

**Next Steps:**
- [Set Up Notification Channels](../setup.md)
- [Message Template Guides](./manage-messages)
- [Notification Types](../overview.md)

