---
sidebar_position: 2
---

# Managing App Webhooks

Ductape allows product teams to manage webhooks registered by apps using the `ductape.products.webhooks` interface. This enables a product to track and control how its apps integrate webhooks across environments.

## Overview

```ts
ductape.products.webhooks
```

## `fetchAll`

Fetch all webhooks registered by an app using its `accessTag`.

```ts
const webhooks = await ductape.products.webhooks.fetchAll("my-access-tag");
```

### Parameters

| Name         | Type     | Description                              |
|--------------|----------|------------------------------------------|
| `accessTag`  | `string` | The unique access tag for the target app |

### Returns

Returns an array of registered webhooks associated with the given access tag.

## `enable`

Register or activate a webhook for a specific product and app in a given environment.

```ts
const result = await ductape.products.webhooks.enable({
  product: "my-product",
  access_tag: "my-access-tag",
  webhook_tag: "new-webhook",
  envs: [
    {
      slug: "prd",
      url: "https://webhooks.target.com/register",
      method: HttpMethods.POST,
      auth: {
        headers: {
          Authorization: "Bearer mytoken"
        },
        query: {},
        body: {},
        params: {}
      }
    }
  ]
});
```

### Parameters

| Name           | Type                                | Description                                |
|----------------|-------------------------------------|--------------------------------------------|
| `product`      | `string`                            | The product slug                           |
| `access_tag`   | `string`                            | The app's access tag                       |
| `webhook_tag`  | `string`                            | The tag of the webhook being registered    |
| `envs`         | `IProductBuilderRegisterWebhookEnvs[]` | Environment-specific webhook configurations |

### `IProductBuilderRegisterWebhookEnvs`

| Field     | Type                  | Description                        |
|-----------|-----------------------|------------------------------------|
| `slug`    | `string`              | Environment slug (`prd`, `snd`, etc.) |
| `url`     | `string`              | Webhook registration URL           |
| `method`  | `HttpMethods`         | HTTP method used (`POST`, `GET`)   |
| `auth`    | `IActionRequest`      | Authentication and request structure |

## `generateLink`

Generate a Ductape link for a webhook in a specific environment. This is used when the app provides its own link and the product wants to wrap it in a Ductape-generated tracking URL.

```ts
const link = await ductape.products.webhooks.generateLink({
  product: "my-product",
  access_tag: "my-access-tag",
  webhook_tag: "new-webhook",
  env: "prd",
  url: "https://webhooks.target.com/register",
  method: HttpMethods.POST
});
```

### Parameters

| Name           | Type           | Description                                      |
|----------------|----------------|--------------------------------------------------|
| `product`      | `string`       | The product slug                                |
| `access_tag`   | `string`       | The access tag of the app                       |
| `webhook_tag`  | `string`       | The tag of the webhook being linked             |
| `env`          | `string`       | The environment slug                            |
| `url`          | `string`       | The original URL to be wrapped                  |
| `method`       | `HttpMethods`  | The HTTP method (`POST`, `GET`, etc.)           |

### Returns

Returns a Ductape-generated link that the app can use for webhook registration.