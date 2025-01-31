---
sidebar_position: 1
---

# Managing Webhooks  

Ductape allows you to automatically handle webhooks and their logic. Each webhook can have multiple events attached to it, serving as a single point of registration for multiple events your app emits. Ductape enables you to manage multiple webhooks and events that your partners will receive.  

## Setting Up Webhooks  

To create a webhook in Ductape, use the `create` function of the `app.webhooks` interface. Each webhook must be configured with the appropriate settings for different environments.  

### Example  

```typescript
const webhook = await ductape.app.webhooks.create({
    name: "New Webhook",
    tag: "new-webhook",
    description: "New Webhook Description"
    envs: [
        {
            slug: "prd",
            registration_url: "https://api.webhook.com/register",
            method: HttpMethods.POST,
            sample: {
                headers: {
                    Authorization: "Bearer ehwywjwjsnsnsnsnsns"
                },
                query: {},
                body: {},
                params: {}
            }
        },
        {
            slug: "snd",
            registration_url: "https://sandbox.webhook.com/register",
            method: HttpMethods.POST,
            sample: {
                headers: {
                    Authorization: "Bearer ehwywjwjsnsnsnsnsns"
                },
                query: {},
                body: {},
                params: {}
            }
        }
    ]
});
```

## Webhook Fields  

| Field              | Type                 | Description |
|--------------------|----------------------|-------------|
| `name`            | `string`             | A human-readable name for the webhook. |
| `tag`             | `string`             | A unique identifier for the webhook. |
| `description`     | `string`             | A quick description of the webhook.  |
| `envs`            | `EnvConfig[]`        | An array of environment-specific configurations. |

### `EnvConfig` Fields  

| Field              | Type                 | Description |
|--------------------|----------------------|-------------|
| `slug`            | `string`             | The environment identifier (e.g., `"prd"` for production, `"snd"` for sandbox). |
| `registration_url` | `string`             | The URL where the webhook will be registered. |
| `method`          | `HttpMethods`        | The HTTP method used for the webhook (e.g., `POST`, `GET`). |
| `sample`          | `WebhookSample`      | A sample payload structure for testing the webhook. |

### `WebhookSample` Fields  

| Field      | Type                 | Description |
|-----------|----------------------|-------------|
| `headers` | `Record<string, string>` | HTTP headers sent with the webhook request. |
| `query`   | `Record<string, any>` | Query parameters included in the webhook request. |
| `body`    | `Record<string, any>` | The request body sent with the webhook. |
| `params`  | `Record<string, any>` | URL parameters included in the webhook request. |

## Updating Webhooks  

To update an existing webhook, use the `update` function of the `app.webhooks` interface. This allows you to modify configurations for different environments.  

### Example  

```typescript
const updatedWebhook = await ductape.app.webhooks.update("new-webhook", {
    envs: [
        {
            slug: "prd",
            registration_url: "https://live.webhook.com/register",
            method: HttpMethods.POST,
            auth: {
                headers: {
                    Authorization: "Bearer ehwywjwjsnsnsnsnsns"
                },
                query: {},
                body: {},
                params: {}
            }
        }
    ]
});
```


## Fetching Webhooks  

To retrieve all webhooks for an app, use the `fetchAll` function.  

### Example  

```typescript
const webhooks = await ductape.app.webhooks.fetchAll();
```

## Fetching a Single Webhook  

To retrieve a specific webhook, use the `fetch` function, passing the webhook tag as an argument.  

### Example  

```typescript
const webhook = await ductape.app.webhooks.fetch("new-webhook");
```
