---
sidebar_position: 3
---

# Email Notifications

An notification has two parts

- **subject:** the email subject of the email notifications **required
- **template:** the html template that of the  email notifications **required


``` typescript
const push_notification: {
    subject: "Credit Alert From {{username}}",
    template: "<html><body><p>{{username}} sent you {{amount}} {{currency}}</p></body></html>",
}
```

## Templates in Emails Notifications

The above sample code shows you how to create templates in push notifications, the template above defines the data input required to send a push notification. A sample data expected when sending the above push notifications would look like this

```typescript
const data = {
    subject: {
        username: "Thomas"
    },
    template: {
        username: "Thomas",
        amount: "50",
        currency: "GBP"
    }
}
```

## Generated Request

This expected data would automatically replace the template variables marked with `{{}}` and generate a notification body as follows

```typescript
{
    subject: "Credit Alert From Thomas",
    body: "<html><body><p>Thomas sent you 50 GBP</p></body></html>",
}
```

This is important to note when processing email notifications in subsequent sections