---
sidebar_position: 5
---

# SMS Notifications

An SMS notification in Ductape is a **parameterised string message** sent through a configured SMS provider in a notification environment.

An SMS notification has:

- **message:** The content of the SMS message with optional template variables enclosed in `{{}}`.


## SMS Message Structure

The message is a plain string with placeholders for dynamic values.  
Placeholders follow the syntax `{{variableName}}`, which will be replaced by values provided when sending the notification.

**Example Template**

```typescript
const sms_message = "Welcome to our platform {{firstname}} {{lastname}}. Your username is {{username}}."
````

## Templates in SMS Notifications

When sending an SMS notification using a template, you must supply a **data object** containing the values for each template variable.

**Example Input Data**

```typescript
const data = {
  firstname: "Thomas",
  lastname: "Shelby",
  username: "thomas_shelby"
}
```

The system will automatically replace the placeholders with the corresponding values in the data object to produce:

**Generated SMS**

```
Welcome to our platform Thomas Shelby. Your username is thomas_shelby.
```

## Notes

* **All template variables are required at the time of sending** — ensure the data object contains values for every `{{variable}}` present in your message string.
* If a variable is missing in the data object, the placeholder will remain unreplaced in the final SMS message.
* SMS notifications are sent through the SMS provider configured for the environment (Twilio, Nexmo/Vonage, or Plivo — see [Notification Environment Setup](../setting-up#sms-notifications)).

