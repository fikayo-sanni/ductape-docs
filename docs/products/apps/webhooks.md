---
sidebar_position: 2
---

# Managing App Webhooks

Ductape enables product teams to manage webhook integrations across environments using the `ductape.products.webhooks` interface. Webhooks are essential for allowing third-party apps to notify your product of events in real time. Ductape acts as a middleware—offering visibility, control, and flexibility in how webhooks are registered and used.

There are two ways to set up webhook registrations in Ductape:

1. **Full Registration** – Configure webhooks across all required environments by supplying the necessary configuration up front.
2. **Generate Registration Link** – Create a Ductape-wrapped URL for a single environment and paste it into a provider dashboard.


## Full Registration

Use the `enable` method to register a webhook for multiple environments at once. This is ideal when your provider allows API-based registration or if you want to fully manage all environments centrally.

### Required Fields

| Name           | Type                                  | Description                                |
|----------------|---------------------------------------|--------------------------------------------|
| `product`      | `string`                              | Product slug                               |
| `access_tag`   | `string`                              | Unique access tag for the app              |
| `webhook_tag`  | `string`                              | Identifier for the webhook                 |
| `envs`         | `IProductBuilderRegisterWebhookEnvs[]`| List of environment-specific configurations |

### `IProductBuilderRegisterWebhookEnvs`

| Field     | Type             | Description                              |
|-----------|------------------|------------------------------------------|
| `slug`    | `string`         | Environment slug (`prd`, `stg`, etc.)    |
| `url`     | `string`         | Receiver webhook endpoint                |
| `method`  | `HttpMethods`    | HTTP method used (`POST`, `GET`)         |
| `auth`    | `IActionRequest` | Request authentication and structure     |

### Example

```ts
await ductape.products.webhooks.enable({
  product: "my-product",
  access_tag: "admin",
  webhook_tag: "order_created",
  envs: [
    {
      slug: "prd",
      url: "https://api.example.com/webhooks/orders",
      method: HttpMethods.POST,
      auth: {
        headers: {
          Authorization: "Bearer <<token>>"
        },
        query: {},
        body: {},
        params: {}
      }
    },
    {
      slug: "stg",
      url: "https://staging.example.com/webhooks/orders",
      method: HttpMethods.POST,
      auth: {
        headers: {
          Authorization: "Bearer <<token>>"
        },
        query: {},
        body: {},
        params: {}
      }
    }
  ]
});
```

## Generating a Registration Link

Use the `generateLink` method when your provider requires you to manually input the webhook URL in their dashboard. Ductape will generate a wrapped tracking link that routes through its middleware.

### Required Fields

| Name           | Type          | Description                                  |
|----------------|---------------|----------------------------------------------|
| `product`      | `string`      | Product slug                                 |
| `access_tag`   | `string`      | App's access tag                             |
| `webhook_tag`  | `string`      | Identifier for the webhook                   |
| `env`          | `string`      | Environment slug                             |
| `url`          | `string`      | Original webhook endpoint                    |
| `method`       | `HttpMethods` | HTTP method (`POST`, `GET`, etc.)            |

### Example

```ts
const link = await ductape.products.webhooks.generateLink({
  product: "my-product",
  access_tag: "admin",
  webhook_tag: "order_created",
  env: "prd",
  url: "https://api.example.com/webhooks/orders",
  method: HttpMethods.POST
});

console.log("Register this link in your provider dashboard:", link);
```

## Fetching Registered Webhooks

To see which webhooks are currently registered for an app, use the `fetchAll` method.

### Example

```ts
const webhooks = await ductape.products.webhooks.fetchAll("admin");
```

### Parameters

| Name        | Type     | Description                          |
|-------------|----------|--------------------------------------|
| `accessTag` | `string` | The access tag for the target app    |

### Returns

An array of webhook configurations associated with the given access tag.



## Choosing the Right Method

| Method                    | Best Use Case                                                                 |
|---------------------------|-------------------------------------------------------------------------------|
| **Full Registration**     | You can register webhooks programmatically across all environments at once.  |
| **Generate Registration Link** | You need a single environment-specific link to paste into a provider UI. |
