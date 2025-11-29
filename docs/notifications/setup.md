---
sidebar_position: 3
---

# Setting Up Notification Environments

In Ductape, you can set up **credentials for each Environment**. This means your sandbox, staging, and production environments can have different credentials, channels, and optionally exclude certain behavior from specific environments.

## Example: Creating a Notification Environment
```typescript
await ductape.notification.create({
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

Ductape supports **5 email providers: SMTP, SendGrid, Mailgun, Postmark, and AWS SES**. Configure them by setting the appropriate fields based on your chosen provider.

#### Common Fields
| Field          | Type          | Required | Description         |
| :------------- | :------------ | :------- | :------------------ |
| `provider`     | `EmailProvider` | Yes    | Email service provider. |
| `sender_email` | `string`      | Yes      | From email address. |

#### SMTP Configuration
| Field          | Type      | Required | Description         |
| :------------- | :-------- | :------- | :------------------ |
| `host`         | `string`  | Yes      | SMTP server host.   |
| `port`         | `string`  | Yes      | SMTP port.          |
| `auth.user`    | `string`  | Yes      | SMTP auth username. |
| `auth.pass`    | `string`  | Yes      | SMTP auth password. |
| `secure`       | `boolean` | Optional | Use SSL/TLS.        |
| `tls`          | `object`  | Optional | TLS configuration.  |

**SMTP Example**
```typescript
const emails = {
  provider: 'smtp',
  sender_email: 'noreply@ductape.app',
  host: 'smtp.elasticemail.com',
  port: '2524',
  auth: {
    user: 'fikayo@ductape.app',
    pass: '***'
  },
  secure: false,
  tls: {
    rejectUnauthorized: false
  }
};
```

#### SendGrid Configuration
| Field     | Type     | Required | Description        |
| :-------- | :------- | :------- | :----------------- |
| `apiKey`  | `string` | Yes      | SendGrid API key.  |

**SendGrid Example**
```typescript
const emails = {
  provider: 'sendgrid',
  sender_email: 'noreply@ductape.app',
  apiKey: 'SG.xxxxxxxxxxxxxxxxxxxxx'
};
```

#### Mailgun Configuration
| Field    | Type     | Required | Description                                    |
| :------- | :------- | :------- | :--------------------------------------------- |
| `apiKey` | `string` | Yes      | Mailgun API key.                               |
| `domain` | `string` | Yes      | Mailgun domain.                                |
| `url`    | `string` | Optional | API base URL (for EU region, use https://api.eu.mailgun.net). |

**Mailgun Example**
```typescript
const emails = {
  provider: 'mailgun',
  sender_email: 'noreply@ductape.app',
  apiKey: 'key-xxxxxxxxxxxxxxxxxxxxx',
  domain: 'mg.ductape.app',
  url: 'https://api.eu.mailgun.net' // Optional - for EU region
};
```

#### Postmark Configuration
| Field         | Type     | Required | Description          |
| :------------ | :------- | :------- | :------------------- |
| `serverToken` | `string` | Yes      | Postmark server token. |

**Postmark Example**
```typescript
const emails = {
  provider: 'postmark',
  sender_email: 'noreply@ductape.app',
  serverToken: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
};
```

#### AWS SES Configuration
| Field             | Type     | Required | Description            |
| :---------------- | :------- | :------- | :--------------------- |
| `region`          | `string` | Yes      | AWS region.            |
| `accessKeyId`     | `string` | Yes      | AWS access key ID.     |
| `secretAccessKey` | `string` | Yes      | AWS secret access key. |

**AWS SES Example**
```typescript
const emails = {
  provider: 'aws_ses',
  sender_email: 'noreply@ductape.app',
  region: 'us-east-1',
  accessKeyId: 'AKIAXXXXXXXXXX',
  secretAccessKey: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
};
```

#### EmailProvider Enum Values
| Enum Value  | Description                    |
| :---------- | :----------------------------- |
| `smtp`      | Traditional SMTP email server  |
| `sendgrid`  | SendGrid email service         |
| `mailgun`   | Mailgun email service          |
| `postmark`  | Postmark email service         |
| `aws_ses`   | Amazon Simple Email Service    |

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
* Push Notifications support **only one type per environment**   either Expo or Firebase.
* SMS providers require specific credential fields   ensure you supply what's needed based on your chosen provider.

## Next Steps
- [Notifications Overview](./overview.md)
- [Notification Message Templates](./templates/manage-messages/)
- [Managing Databases](../databases/overview.md)