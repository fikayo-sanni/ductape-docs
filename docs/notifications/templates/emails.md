---
sidebar_position: 2
---

# Email Notifications

Email notifications in Ductape let you send parameterized emails to your users through your configured email provider. Use email notifications for alerts, confirmations, or updates that require rich formatting and longer content.

## What Is an Email Notification?
An email notification consists of two required parts:
- **subject**: The subject line of the email. Can include template variables (e.g., `{{username}}`).
- **template**: The HTML body of the email. Can include template variables for dynamic content.

## Email Message Structure
- **subject**: The subject of your email, with optional template variables.
- **template**: The HTML body of your email, with optional template variables.

**Example Template:**
```typescript
const email = {
  subject: "Credit Alert From {{username}}",
  template: "<html><body><p>{{username}} sent you {{amount}} {{currency}}</p></body></html>"
}
```

## Using Template Variables
Template variables in the subject or template are enclosed in `{{ }}` and replaced with actual values when the email is sent.

> **Note:** All template variables in your subject and template must be provided in the data object when sending the email. If a variable is missing, the placeholder will remain unreplaced in the final email.

## Example Input Data
```typescript
const data = {
  username: "Thomas",
  amount: "50",
  currency: "GBP"
}
```

## Generated Email
The system will automatically replace the placeholders to produce:

```typescript
{
  subject: "Credit Alert From Thomas",
  body: "<html><body><p>Thomas sent you 50 GBP</p></body></html>"
}
```

## Provider Setup
Email notifications are sent through the email provider configured for your environment (such as SendGrid, Mailgun, or SES). See [Notification Environment Setup](../setup#email-notifications) for details on configuring your provider.

**Key Points:**
- All template variables are required at send time.
- Unmatched placeholders will remain in the message.
- Choose and configure your email provider in your notification environment settings.

**Next Steps:**
- [Set Up Notification Channels](../setup.md)
- [Message Template Guides](./manage-messages)
- [Notification Types](../overview.md)
