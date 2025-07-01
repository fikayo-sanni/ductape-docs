# SMS Notifications

SMS notifications in Ductape let you send parameterized text messages to your users through your configured SMS provider. Use SMS notifications to deliver important alerts, confirmations, or updates directly to a user's phone.

## What Is an SMS Notification?
An SMS notification is a plain string message that can include dynamic placeholders for personalized content. These placeholders are enclosed in `{{ }}` and are replaced with actual values when the message is sent.

> **Note:** All template variables in your message must be provided in the data object when sending the SMS. If a variable is missing, the placeholder will remain unreplaced in the final message.

## SMS Message Structure
- **message**: The content of your SMS, with optional template variables (e.g., `{{firstname}}`).

**Example Template:**
```typescript
const sms_message = "Welcome to our platform {{firstname}} {{lastname}}. Your username is {{username}}."
```

## Sending an SMS Notification with a Template
When sending an SMS notification, supply a data object with values for each template variable:

**Example Input Data:**
```typescript
const data = {
  firstname: "Thomas",
  lastname: "Shelby",
  username: "thomas_shelby"
}
```

The system will automatically replace the placeholders to produce:

**Generated SMS:**
```
Welcome to our platform Thomas Shelby. Your username is thomas_shelby.
```

## Provider Setup
SMS notifications are sent through the SMS provider configured for your environment (such as Twilio, Nexmo/Vonage, or Plivo). See [Notification Environment Setup](../setting-up#sms-notifications) for details on configuring your provider.

**Key Points:**
- All template variables are required at send time.
- Unmatched placeholders will remain in the message.
- Choose and configure your SMS provider in your notification environment settings.

**Next Steps:**
- **[Set Up Notification Channels](../setting-up.md):** Learn how to configure channels like SMS, email, and push.
- **[Message Template Guides](./):** Explore guides for other notification message types.
- **[Notification Types](../notifications.md):** See all supported notification types and their use cases.

