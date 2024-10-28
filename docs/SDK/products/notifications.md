---
sidebar_position: 5
---

# Notifications

In your Ductape product, you can send out notifications to your customers using our notifications functionality. We broadly cater to three types of notifications:

- **Push Notifications**
- **Email Notifications**
- **Webhooks/Callback Notifications**

### Push Notifications
Push Notifications are simple, clickable messages sent directly to users' devices from your products. They appear in real-time and can be used to notify users about important updates, alerts, or promotional offers. Users must opt-in to receive these notifications, and they can be sent even when the user isn't actively using the app.

### Email Notifications
Email Notifications allow you to communicate with your users via email. These can be used for account-related information, marketing campaigns, or transactional emails like purchase confirmations. You can customize the content and layout of the email to suit your product’s needs.

### Webhooks/Callback Notifications
Webhooks or Callback Notifications are used to send real-time data to third-party systems or other apps. When a specific event occurs in your product, the system can trigger a callback to a specified URL, allowing seamless integration with external services. This is ideal for syncing data or triggering automated workflows in other systems.

## Managing Notifications

To create a notification, use the `createNotification` function of the product instance.

### Creating a Firebase Push Notification

```typescript
import { Notifiers } from "ductape-sdk/dist/types/enums";
import { IProductNotification } from "ductape-sdk/dist/types/productsBuilder.types";

// ... product builder instance

const notifications = { // Optional: Define a push notification
    type: Notifiers.FIREBASE, // FIREBASE or EXPO
    credentials: { // Optional: Define only when using FIREBASE
        // FIREBASE CREDENTIALS OBJECT
    },
    databaseUrl: "FIREBASE_DATABASE_URL", // Optional: Define only when using FIREBASE
    template: {
        title: '{{sender_username}} sent you {{currency}} {{amount}}',
        body: 'Congratulations {{receiver_username}}! You have received {{currency}} {{amount}} from {{sender_username}}',
    }
}

const details: IProductNotification = {
    tag: 'notify_payment',
    name: 'Notify Payment',
    description: 'Notify users when a payment happens',
    notifications,
}

const notification = await productBuilder.createNotification(details);
```

In the example above, `{{sender_username}}`, `{{currency}}`, `{{amount}}`, and `{{receiver_name}}` are all variables that can be dynamically populated in your notification template using the `{{}}` wrapper.

### Creating an Expo Push Notification

To work with Expo notifications, you can modify the `notifications` object as shown below:

```typescript
const notifications = { // Optional: Define a push notification
    type: Notifiers.EXPO, // Expo notification type
    template: {
        title: '{{sender_username}} sent you {{currency}} {{amount}}',
        body: 'Congratulations {{receiver_username}}! You have received {{currency}} {{amount}} from {{sender_username}}',
    }
}

const details = {
    tag: 'notify_payment',
    name: 'Notify Payment',
    description: 'Notify users when a payment happens',
    notifications,
}

const notification = await productBuilder.createNotification(details);
```

In both Firebase and Expo examples, the notification's content can be customized with placeholders for dynamic values, making it flexible for various use cases.


### Creating Email Notification

You can extend the `details` object to also handle email notifications by adding your email config.

``` typescript
const details: IProductNotification = {
    ...details,
    emails: {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        sender_email: process.env.SMTP_SENDER_EMAIL, // the smtp sender email
        auth: {
            user: process.env.SMTP_USER, // the smtp username
            pass: process.env.SMTP_PASSWORD, // the smtp password
        },
        secure: false, // true for 465, false for other ports
        tls: {
            rejectUnauthorized: false, // do not fail on invalid certs, set true to fail on invalid certs
        },
        template: "<html><header>{{sender_name}}</header<body><div><h1>{{receiver_name}}</h1><p>{{url}}</p></div></body></html>"
    }
}
```

The `template` value allows you to define a html template with variables that can be inputted and processed to customize messages per user. In the above template, `{{sender_name}}`, `{{receiver_name}}` and `{{url}}` are variables

### Creating Webhook Notification


You can extend the `details` object to also handle webhook notifications by adding your callback url.

```typescript
const details: IProductNotification = {
    ...details,
    webhook: {
        url: '',
        method: HttpMethods.POST,
        query: {},
        params: {},
        body: {},
    }
}
```