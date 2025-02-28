---
sidebar_position: 1
---

# Registering for Webhooks  
Webhooks in Ductape enable seamless communication between providers and your application.

Ductape acts as a middleware between the provider’s webhook emitter and your receiver endpoint. This ensures you can monitor webhook events, track their status, and gain insights into their execution.

There are two ways to set up webhook registrations in Ductape:  

1. **Full Registration** – You manually provide details for all environments where your product operates.  
2. **Generating a Registration Link** – You register a single environment and receive a generated endpoint to input into the provider’s dashboard.  


## 1. Full Registration
_Full Registration requires you to provide complete details for all environments._  

### Required Data Fields  
To register a webhook, you must provide:  

- **`product_tag`** – Identifier for the product.  
- **`access_tag`** – Identifies the access level.  
- **`webhook_tag`** – Identifies the specific webhook.  
- **`envs`** – List of environments where the webhook should be registered, including:  
  - **`slug`** – Environment identifier.  
  - **`url`** – The receiver’s webhook endpoint.  
  - **`method`** – HTTP method (`POST`, `GET`, etc.).  
  - **`auth`** – Authentication details for the request.  

### Example Usage

```ts
await ductape.processor.webhook.enable({
  product_tag: "my_product",
  access_tag: "admin",
  webhook_tag: "order_created",
  envs: [
    {
      slug: "prd",
      url: "https://api.example.com/webhooks/orders",
      method: HttpMethods.POST,
      auth: {
        query: {};
        params: {};
        body: {};
        headers: {
            Authorization: "Bearer <<token>>"
        };
      }
    },
    {
      slug: "stg",
      url: "https://staging.example.com/webhooks/orders",
      method: HttpMethods.POST,
      auth: {
        query: {};
        params: {};
        body: {};
        headers: {
            Authorization: "Bearer <<token>>"
        };
      }
    }
  ]
});
```

**Key Points**  
- You must register webhooks for all required environments.  
- Each environment has a unique `url`, `method`, and `auth` details.  


## 2. Generating a Registration Link  
_This method allows you to generate a registration link for a single environment._  

### Required Data Fields
- **`product_tag`** – Identifier for the product.  
- **`access_tag`** – Identifies the access level.  
- **`webhook_tag`** – Identifies the specific webhook.  
- **`product_env`** – Environment for which the webhook is registered.  
- **`url`** – Your receiver’s webhook endpoint.  
- **`method`** – HTTP method for the endpoint (`POST`, `GET`, etc.).  

### Example Usage

```ts
const link = await ductape.processor.webhook.generateLink({
  product_tag: "my_product",
  access_tag: "admin",
  webhook_tag: "order_created",
  product_env: "production",
  url: "https://api.example.com/webhooks/orders",
  method: HttpMethods.POST
});

console.log("Register this link in your provider dashboard:", link);
```

**Key Points**  
- This method is environment-specific—one registration link per environment.  
- The generated link must be manually inputted into the provider’s webhook configuration.  

## Choosing the Right Approach
| Method                      | Use Case |
|-----------------------------|----------|
| **Full Registration** | The provider provides an endpoint for registration outside their dashboard, and you can  setup for all environments in all environments at one go|
| **Generating a Link** | Use when the provider requires you to manually enter the webhook URL in their dashboard. And you need the interaction monitored |