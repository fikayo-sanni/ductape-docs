---
sidebar_position: 2
---

# Managing Webhook Events

Ductape allows you to handle webhook events efficiently. Each webhook serves as a single point of registration for multiple events emitted by your app. You can define multiple events within a webhook that your partners or internal systems will receive.

## Setting Up Webhook Events

To create a webhook event in Ductape, use the `create` function from the `app.webhook.event` interface.

### Example

```ts
const event = await ductape.app.webhook.event.create({
  name: "New Event",
  tag: "new-webhook:new-event",
  description: "Notify customer of great things",
  selector: "$Event{identifier}",
  sample: {
    event: "new-transaction",
    transaction_id: "1229100110101-192920101",
    event_id: "119100101020201-1919010101"
  }
});
```

## Webhook Event Fields

| Field         | Type                      | Required | Description                                                                                                           |
| ------------- | ------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------- |
| `name`        | `string`                  | Yes      | A human-readable name for the webhook event.                                                                          |
| `tag`         | `string`                  | Yes      | A unique identifier combining the webhook and event (`webhook-tag:event-tag`).                                        |
| `description` | `string`                  | Yes      | A brief explanation of the event's purpose.                                                                           |
| `selector`    | `string`                  | Yes      | The key path used to identify the event type from incoming payloads. Must start with `$Event{}` e.g. `$Event{event}`. |
| `sample`      | `Record<string, unknown>` | Yes      | A sample payload structure for testing and documentation.                                                             |

## Sample Payload Example

```json
{
  "event": "new-transaction",
  "transaction_id": "1229100110101-192920101",
  "event_id": "119100101020201-1919010101",
  "customer_email": "janedoe@company.com",
  "amount": 5000,
  "currency": "USD",
  "metadata": {
    "source": "mobile-app"
  }
}
```

## Updating Webhook Events

To update a webhook event, use the `update` function from the `app.webhook.event` interface.

### Example

```ts
const updatedEvent = await ductape.app.webhook.event.update("new-webhook:new-event", {
  sample: {
    event: "new-transaction",
    transaction_id: "1229100110101-192920101",
    event_id: "119100101020201-1919010101",
    username: "Jane Jameson"
  }
});
```

## Fetching Webhook Events

To retrieve all events registered under a webhook, use the `fetchAll` function.

### Example

```ts
const events = await ductape.app.webhook.event.fetchAll("new-webhook");
```

## Fetching a Single Webhook Event

To retrieve a specific webhook event, use the `fetch` function, passing the event tag.

### Example

```ts
const event = await ductape.app.webhook.event.fetch("new-webhook:new-event");
```

## See Also

* [Managing Webhooks](./webhooks.md)
* [App Instance Management](../app-instance.md)
* [Getting Started with Apps](../getting-started.md)