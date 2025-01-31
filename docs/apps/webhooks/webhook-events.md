---
sidebar_position: 2
---

# Managing Webhook Events  

Ductape allows you to handle webhook events efficiently. Each webhook serves as a single point of registration for multiple events emitted by your app. You can define multiple events within a webhook that your partners will receive.  

## Setting Up Webhook Events  

To create a webhook event in Ductape, use the `create` function of the `app.webhooks.events` interface.  

### Example  

```typescript
const event = await ductape.app.webhooks.events.create({
    name: "New Event",
    tag: "new-webhook:new-event",
    description: "Notify customer of great things",
    sample: {
        headers: {},
        query: {},
        body: {
            event: "new-transaction",
            transaction_id: "1229100110101-192920101",
            event_id: "119100101020201-1919010101"
        },
        params: {},
    }
});
```

## Webhook Event Fields  

| Field         | Type                    | Description |
|--------------|-------------------------|-------------|
| `name`       | `string`                 | A human-readable name for the webhook event. |
| `tag`        | `string`                 | A unique identifier combining the webhook and event (`webhook-tag:event-tag`). |
| `description`| `string`                 | A brief explanation of the event’s purpose. |
| `sample`     | `WebhookSample`          | A sample payload structure for testing the event. |

### `WebhookSample` Fields  

| Field      | Type                      | Description |
|-----------|---------------------------|-------------|
| `headers` | `Record<string, string>`   | HTTP headers sent with the event request. |
| `query`   | `Record<string, any>`      | Query parameters included in the request. |
| `body`    | `Record<string, any>`      | The request body, typically containing event details. |
| `params`  | `Record<string, any>`      | URL parameters included in the event request. |


## Updating Webhook Events  

To update a webhook event, use the `update` function of the `app.webhooks.events` interface.  

### Example  

```typescript
const updatedEvent = await ductape.app.webhooks.events.update("new-webhook:new-event", {
    sample: {
        headers: {},
        query: {},
        body: {
            event: "new-transaction",
            transaction_id: "1229100110101-192920101",
            event_id: "119100101020201-1919010101",
            username: "Jane Jameson"
        },
        params: {},
    }
});
```

## Fetching Webhook Events  

To retrieve all events in a webhook, use the `fetchAll` function.  

### Example  

```typescript
const events = await ductape.app.webhooks.events.fetchAll("new-webhook");
```


## Fetching a Single Webhook Event  

To retrieve a specific webhook event, use the `fetch` function, passing the event tag.  

### Example  

```typescript
const event = await ductape.app.webhooks.events.fetch("new-webhook:new-event");
```