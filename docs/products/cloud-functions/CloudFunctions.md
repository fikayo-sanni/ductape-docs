---
sidebar_position: 1
---

# Managing Cloud Functions

Ductape allows you to manage and execute **serverless Cloud Functions** that enable your application to interact with other services through HTTP requests. These functions are designed to handle various use cases like API integrations, data processing, and automation workflows—all without the need to manage infrastructure.

> **Note:** While Ductape manages the configuration and invocation of Cloud Functions, the actual function code must be hosted externally. These could be serverless functions deployed on platforms like AWS Lambda, Google Cloud Functions, Vercel, or any service exposing an HTTP endpoint.

## Understanding Cloud Functions
A Cloud Function in Ductape consists of essential information like its name, tag, HTTP method, environment configurations, and sample requests. These serverless functions are executed on-demand, making them ideal for lightweight, event-driven operations.

### Fields Explained
- **name**: A descriptive name for the cloud function.
- **tag**: A unique identifier following the format `category:action`, e.g., `user:create`.
- **description**: A brief explanation of what the cloud function does.
- **method**: The HTTP method to be used when invoking the function.
- **envs**: An array of environment configurations where the function can be executed.
  - **slug**: The environment slug (e.g., `dev`, `prd`).
  - **url**: The endpoint where the cloud function code is hosted.
  - **auth**: An `IActionRequest` object containing authentication details and headers.
- **sample**: An `IActionRequest` object providing an example of the request payload.
- **sampleResponse**: A sample JSON response demonstrating the expected output.

## Creating a Cloud Function
To define a new cloud function, use the `create` function from the `product.cloud.functions` interface. Ensure the function code is already deployed and accessible at the provided URL.

### Example
```typescript
const cloudFunction = await ductape.product.cloud.functions.create({
  name: "Create User",
  tag: "user:create",
  description: "Creates a new user in the external user management system.",
  method: HttpMethods.POST,
  envs: [
    {
      slug: "prd",
      url: "https://api.example.com/users",
      auth: {
        headers: {
          Authorization: "Bearer <token>"
        }
      }
    }
  ],
  sample: {
    headers: {
      "Content-Type": "application/json"
    },
    body: {
      name: "John Doe",
      email: "john.doe@example.com"
    },
    params: {},
    query: {}
  },
  sampleResponse: {
    id: "user_12345",
    name: "John Doe",
    email: "john.doe@example.com",
    status: "created"
  }
});
```

## Updating a Cloud Function
To update an existing cloud function, use the `update` function, passing the function's tag and the updated details.

### Example
```typescript
const updatedFunction = await ductape.product.cloud.functions.update("user:create", {
  description: "Updated description for creating users.",
  sample: {
    headers: {
      "Content-Type": "application/json"
    },
    body: {
      name: "Jane Smith",
      email: "jane.smith@example.com"
    },
    params: {},
    query: {}
  }
});
```

## Fetching Cloud Functions

### Fetch All Cloud Functions in a Category
Use the `fetchAll` function to retrieve all cloud functions under a specific category (e.g., `user`).

```typescript
const functions = await ductape.product.cloud.functions.fetchAll("user");
```

### Fetch a Single Cloud Function
Retrieve a specific cloud function by its tag:

```typescript
const cloudFunction = await ductape.product.cloud.functions.fetch("user:create");
```

This returns the complete configuration for the requested cloud function, including environments and sample payloads.

## Best Practices
- Host your cloud function code on a reliable platform (e.g., AWS Lambda, Vercel) and ensure it is accessible via the provided URLs.
- Use meaningful tags that follow the `category:action` format for consistency.
- Provide comprehensive descriptions for better understanding and maintenance.
- Include valid sample requests and responses to assist in debugging and testing.
- Always define authentication details in the `auth` field when interacting with secured services.

By leveraging Ductape's **serverless Cloud Functions**, you can streamline service interactions and ensure consistent, reliable communication between your application and other services, without worrying about server management or scalability.

