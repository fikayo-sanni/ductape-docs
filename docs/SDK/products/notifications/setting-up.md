---
sidebar_position: 2
---
# Setting Up Notification Environments

In ductape, you can set up Credentials for each Environment. This means that your sandbox/develop environments can have different credentials and channels and optionally exclude certain behavior from certain environments

``` typescript
await ductape.product.notifications.create({
    name: "Notify Users",
    tag: "notify-users",
    description: "Create Notifications",
    envs: [{
        slug: 'prd',
        push_notifications,
        callbacks,
        emails
    }, {
        slug: 'snd',
        push_notifications,
        callbacks,
        emails
    }]
});

```

The interfaces for each credential are described below

## Push Notifications

Ductape Supports 2 `types` of Push Notifications

- Firebase Cloud Messanger: `Notifiers.Expo`
- Expo: `Notifiers.EXPO`

An environment can have either, but not both

### Expo Setup
``` typescript
import { Notifiers } from 'ductape-sdk/types';

const push_notifications = {
    type: Notifiers.FIREBASE
};
```

To setup `Expo` notifiers in an environment, you just need to set the type field of in the push_notification object to `Notifiers.EXPO`, no additional credentials or setup is required

### Firebase Cloud Messanger Setup
``` typescript
import { Notifiers } from 'ductape-sdk/types';

const push_notifications = {
    type: Notifiers.FIREBASE
    credentials: {
        type: "service_account",
        project_id: "my-firebase-project-id",
        private_key_id: "123abc456def789ghi012jkl345mno678pqr901stu234vwx567yz",
        private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASC...\n-----END PRIVATE KEY-----\n",
        client_email: "firebase-adminsdk-abc123@my-firebase-project-id.iam.gserviceaccount.com",
        client_id: "123456789012345678901",
        auth_uri: "https://accounts.google.com/o/oauth2/auth",
        token_uri: "https://oauth2.googleapis.com/token",
        auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
        client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-abc123%40my-firebase-project-id.iam.gserviceaccount.com"
    },
    databaseUrl: 'https://my-firebase-project-id.firebaseio.com',
};
```

To setup `Firebase` notifiers in an environment, you  need to set the type field of in the push_notification object to `Notfiers.FIREBASE` and append the credentials in your serviceAccount.json for fcm to the `credentials` object and append the `databaseUrl`

## Email Notifications

To setup email notifications, you need to provide the smtp connection details

``` typescript
const emails = {
    host: 'smtp.elasticemail.com',
    port: '2524',
    sender_email: 'noreply@ductape.app',
    auth: {
        user: 'fikayo@ductape.app',
        pass: 'FE2ACEF1C1393E8.........'
    },
    secure: false,
}
```
The `sender_email` is the email that would be appended to all emails sent using this configuration

## Callback Notifications

``` typescript
import { HttpMethods } from "ductape-sdk/types"

 const callbacks = {
    url: 'https://test.apicall.com/send-message',
    method: HttpMethods.POST,
    auth: {
        headers: { Authorization: "Bearer 271393188f72b78b4c3486b9dc9333dd62e676b2" },
        body: {},
        query: {},
        params: {},
    }
}
```

The following fields are required
- **url:** the url to call in the environment callback, use :param name to define any path params. E.G https://test.apicall.com/:id/send-message
- **method:** the method of the url call. defined with the HttpMethods enum
- **auth:** define the authentication values (if any) for the callback calls
- **auth.headers:**  the auth headers values to append to the request headers
- **auth.body:** the auth body values to append to request body
- **auth.query:** the auth query values to append to request query
- **auth.params:** the auth params values to append to request params
