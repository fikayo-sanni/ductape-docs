---
sidebar_position: 4
---

# Callback Notifications

A callback notification has the same structure as an action request, it has 4 parts

- **body:** the body of the http request **optional
- **params:** if any path params **optional
- **query:** the data been sent with the push notification, ** optional
- **headers:** if any headers


``` typescript
const push_notification: {
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
    headers: {},
}
```

## Templates in Email Notifications

The above sample code shows you how to create templates in callback notifications, the template above defines the data input required to send a callback notification. A sample data expected when sending the above push notifications would look like this

```typescript
const data = {
    body: {
        transactionId: "111292929-1-18288282",
        bankCode: "039",
        username: "Thomas",
        eventName: "credit-success",
        amount: "50",
    },
    params: {
        notificationId: "81829292-1-1992922",  
    },
    query: {
        currency: "GBP"
    },
    headers: {}
}
```

This expected data would automatically replace the template variables marked with `{{}}` and generate a callback request as follows

```typescript
{
    body: {
        transaction_id: "111292929-1-18288282",
        bank_code: "039",
        username: "Thomas",
        event_name: "credit-success",
        amount: "50",
    },
    params: {
        notification_id: "81829292-1-1992922",  
    },
    query: {
        currency: "GBP"
    },
    headers: {}
}
```

This is important to note when processing callback notifications in subsequent sections

*Also note that you would not need to provide authentication data as part of the callback template as that is usually covered with the auth field when performing the Notification Setup, except there are unique circumstances in your use case*