---
sidebar_position: 2
---

# Push Notifications

A push notification has three parts

- **title:** the title of the push notifications **required
- **body:** the body of the push notifications **required
- **data:** the data been sent with the push notification, if any (**optional json)


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