---
sidebar_position: 1
---

# Managing Webhooks

Ductape allows you to automatically handle webhooks and their associated logic. Each webhook can have multiple events attached to it, acting as a single point of registration for the events your app emits. You can manage multiple webhooks and configure the events your partners will receive.

## Setting Up Webhooks

There are two main ways to set up webhooks:

- Generating a link for use in a dashboard
- Registering directly with Ductape

To create a webhook in Ductape, use the `create` function from the `app.webhooks` interface. Each webhook must be configured with appropriate settings depending on the registration method and environment.

### Example: Users Register Directly with Ductape

```ts
const webhook = await ductape.app.webhook.create({
  name: "New Webhook",
  tag: "new-webhook",
  description: "New Webhook Description",
  envs: [
    {
      slug: "prd",
      registration_url: "https://api.webhook.com/register",
      method: HttpMethods.POST,
      sample: {
        headers: {
          Authorization: "Bearer ehwywjwjsnsnsnsnsns",
        },
        query: {},
        body: {},
        params: {},
      },
    },
    {
      slug: "snd",
      registration_url: "https://sandbox.webhook.com/register",
      method: HttpMethods.POST,
      sample: {
        headers: {
          Authorization: "Bearer ehwywjwjsnsnsnsnsns",
        },
        query: {},
        body: {},
        params: {},
      },
    },
  ],
});
```

In this example, you provide the full registration flow details: the API URL, HTTP method, and the data structure expected from the user.

### Example: Users Generate a Link and Supply It to a Dashboard

```ts
const webhook = await ductape.app.webhook.create({
  name: "New Webhook",
  tag: "new-webhook",
  description: "New Webhook Description",
  envs: [
    { slug: "prd" },
    { slug: "snd" },
  ],
});
```

In this case, you only provide the environment slugs. Ductape will generate a webhook link that users can supply to their dashboard.

**Note:** You can mix both methods. The example below is valid and combines both approaches:

```ts
const webhook = await ductape.app.webhook.create({
  name: "New Webhook",
  tag: "new-webhook",
  description: "New Webhook Description",
  envs: [
    { slug: "prd" },
    {
      slug: "snd",
      registration_url: "https://sandbox.webhook.com/register",
      method: HttpMethods.POST,
      sample: {
        headers: {
          Authorization: "Bearer ehwywjwjsnsnsnsnsns",
        },
        query: {},
        body: {},
        params: {},
      },
    },
  ],
});
```

## Webhook Fields

| Field         | Type              | Description                                         |
|---------------|-------------------|-----------------------------------------------------|
| `name`        | `string`          | A human-readable name for the webhook.              |
| `tag`         | `string`          | A unique identifier for the webhook.                |
| `description` | `string`          | A brief description of what the webhook does.       |
| `envs`        | `EnvConfig[]`     | An array of environment-specific configurations.    |

### `EnvConfig` Fields

| Field              | Type             | Description                                                  |
|--------------------|------------------|--------------------------------------------------------------|
| `slug`             | `string`         | Environment identifier (e.g., `"prd"` for production).       |
| `registration_url` | `string`         | URL for registering the webhook.                            |
| `method`           | `HttpMethods`    | HTTP method used for registration (e.g., `POST`, `GET`).     |
| `sample`           | `WebhookSample`  | A sample payload structure used for webhook testing.         |

### `WebhookSample` Fields

| Field      | Type                     | Description                                              |
|------------|--------------------------|----------------------------------------------------------|
| `headers`  | `Record<string, string>` | HTTP headers to be sent with the webhook request.        |
| `query`    | `Record<string, any>`    | Query parameters to be included in the webhook request.  |
| `body`     | `Record<string, any>`    | Request body to be sent with the webhook.                |
| `params`   | `Record<string, any>`    | URL parameters to be included in the webhook request.    |

## Updating Webhooks

To update an existing webhook, use the `update` function from the `app.webhooks` interface. You can modify environment-specific configurations, including URLs, methods, and payload samples.

### Example

```ts
const updatedWebhook = await ductape.app.webhook.update("new-webhook", {
  envs: [
    {
      slug: "prd",
      registration_url: "https://live.webhook.com/register",
      method: HttpMethods.POST,
      sample: {
        headers: {
          Authorization: "Bearer ehwywjwjsnsnsnsnsns",
        },
        query: {},
        body: {},
        params: {},
      },
    },
  ],
});
```

## Fetching Webhooks

To retrieve all webhooks associated with your app, use the `fetchAll` function:

```ts
const webhooks = await ductape.app.webhook.fetchAll();
```

## Fetching a Single Webhook

To retrieve a specific webhook, use the `fetch` function and pass the webhook's tag:

```ts
const webhook = await ductape.app.webhook.fetch("new-webhook");
```

## See Also

* [Managing Webhook Events](./webhook-events.md)
* [App Instance Management](../app-instance.md)
* [Getting Started with Apps](../getting-started.md)