---
sidebar_position: 3
---

# Setting Up Notification Environments

In Ductape, you can set up **credentials for each Environment**. This means your sandbox, staging, and production environments can have different credentials, channels, and optionally exclude certain behavior from specific environments.

## Example: Creating a Notification Environment
```typescript
await ductape.product.notifications.create({
  name: "Notify Users",
  tag: "notify-users",
  description: "Create Notifications",
  envs: [
    {
      slug: 'prd',
      push_notifications,
      callbacks,
      emails,
      sms
    },
    {
      slug: 'snd',
      push_notifications,
      callbacks,
      emails,
      sms
    }
  ]
});
```

## Notification Credential Interfaces

### Push Notifications
| Field         | Type                                     | Required                                 | Description                       |
| :------------ | :--------------------------------------- | :--------------------------------------- | :-------------------------------- |
| `type`        | `Notifiers.EXPO` or `Notifiers.FIREBASE` | Yes                                      | Type of push notifier.            |
| `credentials` | `object`                                 | Optional for Expo, Required for Firebase | Firebase service account details. |
| `databaseUrl` | `string`                                 | Required for Firebase                    | Firebase realtime database URL.   |

**Expo Example**
```typescript
const push_notifications = {
  type: Notifiers.EXPO
};
```

**Firebase Example**
```typescript
const push_notifications = {
  type: Notifiers.FIREBASE,
  credentials: {
    type: "service_account",
    project_id: "...",
    // other service account fields
  },
  databaseUrl: "https://project.firebaseio.com"
};
```

### Email Notifications
| Field          | Type      | Required | Description         |
| :------------- | :-------- | :------- | :------------------ |
| `host`         | `string`  | Yes      | SMTP server host.   |
| `port`         | `string`  | Yes      | SMTP port.          |
| `sender_email` | `string`  | Yes      | From email address. |
| `auth.user`    | `string`  | Yes      | SMTP auth username. |
| `auth.pass`    | `string`  | Yes      | SMTP auth password. |
| `secure`       | `boolean` | Yes      | Use SSL/TLS.        |

**Example**
```typescript
const emails = {
  host: 'smtp.elasticemail.com',
  port: '2524',
  sender_email: 'noreply@ductape.app',
  auth: {
    user: 'fikayo@ductape.app',
    pass: '***'
  },
  secure: false
};
```

### Callback Notifications
| Field          | Type          | Required | Description                                       |
| :------------- | :------------ | :------- | :------------------------------------------------ |
| `url`          | `string`      | Yes      | Callback URL (use `:param` for dynamic segments). |
| `method`       | `HttpMethods` | Yes      | HTTP method.                                      |
| `auth.headers` | `object`      | Optional | Key-value headers.                                |
| `auth.body`    | `object`      | Optional | Key-value body values.                            |
| `auth.query`   | `object`      | Optional | Query parameters.                                 |
| `auth.params`  | `object`      | Optional | URL params.                                       |

**Example**
```typescript
const callbacks = {
  url: 'https://test.apicall.com/send-message',
  method: HttpMethods.POST,
  auth: {
    headers: { Authorization: "Bearer token" },
    body: {},
    query: {},
    params: {}
  }
};
```

### SMS Notifications
Ductape supports **3 SMS providers: Twilio, Plivo, and Vonage (Nexmo)**. You configure them by setting the appropriate fields based on the provider.

| Field        | Type          | Required        | Description                |
| :----------- | :------------ | :-------------- | :------------------------- |
| `provider`   | `SmsProvider` | Yes             | SMS service provider.      |
| `accountSid` | `string`      | For Twilio      | Twilio Account SID.        |
| `authToken`  | `string`      | For Twilio      | Twilio Auth Token.         |
| `apiSecret`  | `string`      | For Nexmo       | Nexmo API Secret.          |
| `apiKey`     | `string`      | For Plivo/Nexmo | API Key for provider.      |
| `sender`     | `string`      | Yes             | Sender phone number or ID. |

**Example**
```typescript
const sms = {
  provider: 'twilio',
  accountSid: 'ACxxxxxxxxxx',
  authToken: 'xxxxxxxx',
  sender: '+1415xxxxxxx'
};
```

#### SmsProvider Enum Values
| Enum Value | Description                |
| :--------- | :------------------------- |
| `twilio`   | Twilio SMS service         |
| `nexmo`    | Nexmo (Vonage) SMS service |
| `plivo`    | Plivo SMS service          |

## Notes
* You can configure one or all notification channels in each environment.
* Push Notifications support **only one type per environment** — either Expo or Firebase.
* SMS providers require specific credential fields — ensure you supply what's needed based on your chosen provider.

## Next Steps
- [Notifications Overview](./notifications.md)
- [Notification Message Templates](/category/notification-messages/)
- [Managing Databases](../databases/database.md)