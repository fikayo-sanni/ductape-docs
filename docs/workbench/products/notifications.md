---
title: Setting up Notifications
description: Configure notification channels so your product can send alerts and messages across multiple platforms.
---

# Setting up Notifications

Notifications allow your product to send messages to users or systems through multiple communication channels. You can configure one or more channels such as **Email**, **SMS**, **Push notifications**, or integrations like **Slack** and **Discord**.

Once configured, your product can send notifications through the selected channels during workflows and actions.

---

## Step 1: Open the Notifications Section

1. Navigate to your **Workspace**.
2. Open the **Product** you want to configure.
3. In the sidebar, locate the **Resources** section.
4. Click **Notifications**.

![Product sidebar showing notifications under resources](/img/screens/product-notifications-sidebar.png)

---

## Step 2: Click "Add"

1. On the **Notifications** page, click the **Add** button.
2. A configuration form will appear.

![Add notification button on notifications page](/img/screens/notifications-add-button.png)

---

## Step 3: Fill in Basic Information

Provide the basic details for the notification configuration.

| Field | Description |
|---|---|
| **Name** | Human-readable name for the notification configuration |
| **Tag** | Auto-generated unique identifier (editable) |
| **Description** | Optional description |

![Notification configuration form showing name, tag, and description fields](/img/screens/notifications-config-form.png)

---

## Step 4: Select Notification Channels

Choose one or more channels that the notification system should support.

Available channels include:

- **Push**
- **Email**
- **SMS**
- **Callbacks**
- **Discord**
- **Slack**

You can select **multiple channels** for a single notification configuration.

![Notification channels selection showing push email sms callbacks discord slack](/img/screens/notifications-channel-selection.png)

---

## Step 5: Configure Each Channel

After selecting channels, you must provide the required configuration for each one.

### Push Notifications

Supported providers:

- **Firebase**
- **Expo**

Configuration typically includes provider credentials and project information.

![Push notification configuration showing firebase and expo options](/img/screens/notifications-push-config.png)

---

### Email

Supported providers:

- **SMTP**
- **Mailgun**
- **Sendgrid**
- **Postmark**
- **Brevo**

Provide the necessary credentials such as API keys or SMTP connection details.

---

### SMS

Supported providers:

- **Twilio**
- **Next**
- **Plivo**

Provide the required API credentials and sender configuration.

![SMS provider configuration showing twilio next and plivo options](/img/screens/notifications-sms-config.png)

---

### Callbacks

Callbacks allow you to trigger an external webhook when a notification event occurs.

Required configuration:

| Field | Description |
|---|---|
| **URL** | Endpoint that will receive the callback |
| **Expected Body** | The payload structure that will be sent |

![Callback configuration showing url and expected body fields](/img/screens/notifications-callback-config.png)

---

### Discord

Discord notifications require the webhook URL and connection details.


---

### Slack

Slack notifications require the webhook URL and connection information.

---

## Step 6: Save the Notification Configuration

1. After configuring the required channels, click **Submit**.
2. The notification configuration will appear in the **Product Notifications list**.

Your product can now send notifications using the configured channels.

![Notifications list showing newly created notification configuration](/img/screens/notifications-added-success.png)

---

## Step 7: Open Templates

1. On the **Notifications list**, locate your notification configuration.
2. Click the **Templates (Count)** button.

Initially, the templates list will be **empty**.

![Notification templates list showing empty state](/img/screens/notification-templates-list.png)

---

## Step 8: Click "Create Template"

1. Click the **+ Create Template** button.
2. A **new tab** will open for creating notification templates.

---

## Step 9: Create Templates for Channels

Inside the template editor, you can create **message templates for each channel** supported by the notification configuration.

Each template defines the **message format and payload** that will be sent when the notification is triggered.

![Notification template editor showing channel-specific template fields](/img/screens/notification-template-editor.png)

---

## Step 10: Use Variables in Templates

Templates support **dynamic variables** using the `{{variable}}` syntax.

These variables are replaced with actual values when the notification is sent.

Example email template:

```
Hello {{name}},

Your order {{order_id}} has been successfully processed.

Thank you for using our service.
```

In this example:

- `{{name}}` will be replaced with the recipient's name
- `{{order_id}}` will be replaced with the order identifier

You can use variables across **Email, SMS, Push, Slack, Discord, and Callback templates**.

---

## Step 11: Save the Template

1. Fill in the required template fields.
2. Click **Save Template**.

Your notification configuration is now fully set up and ready to send messages through the configured channels.

---


## Next Steps

- [Setting up Messaging](/workbench/products/messaging)
- [Setting up Sessions](/workbench/products/sessions)
- [Setting up Caching](/workbench/products/caching)