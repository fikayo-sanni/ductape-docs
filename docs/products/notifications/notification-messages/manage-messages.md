---
sidebar_position: 2
---

# Managing Notification Messages

Ductape allows you to manage notification messages efficiently. Notification messages serve as a way to inform users about important events via various channels such as push notifications, callbacks, and emails.

> **Note:** Notifiation Message tags are expected to follow the format: `notificationTag:messageTag`. This convention ensures clarity and prevents conflicts across different notifiers and messages.

## Setting Up Notification Messages  

To create a notification message in Ductape, use the `create` function of the `product.notifications.messages` interface.  

### Example  

```typescript
const message = await ductape.product.notifications.messages.create({
    name: "New Notification",
    tag: "notify-users:new-message",
    description: "Notify customer of great things",
    push_notification,
    callback,
    email,
});
```

## Updating Notification Messages  

To update a notification message, use the `update` function of the `product.notifications.messages` interface.  

### Example  

```typescript
const updatedMessage = await ductape.product.notifications.messages.update("notify-users:new-message", {
    push_notification,
    callback
});
```

## Fetching Notification Messages  

To retrieve all messages in a notification category, use the `fetchAll` function.  

### Example  

```typescript
const messages = await ductape.product.notifications.messages.fetchAll("notify-users");
```

## Fetching a Single Notification Message  

To retrieve a specific notification message, use the `fetch` function, passing the message tag.  

### Example  

```typescript
const message = await ductape.product.notifications.messages.fetch("notify-users:new-message");
```