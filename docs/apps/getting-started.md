---
sidebar_position: 1
---

# Getting Started with Apps

In Ductape, An **App** is a collection of endpoints, usually from a single provider like Stripe, Twilio or even your own backend. 

You can import these collections into Ductape using Postman or OpenAPI, and then connect them to a **Product**. Once connected, every endpoint in the collection is callable natively, just like a function in your code. 

## Types of Apps

- **Private Apps:** Apps created fron internal services or APIs that are only accessible within your workspace. These typically represent microservices or tools that your team builds and maintains. 
- **Public Apps:** Apps that are made available to other workspaces. These expose a collection of endpoints from your service, allowing developers to integrate with, and buld on top of your functionality. 

## Creating an App

```ts
const app = await ductape.app.create({
  app_name: "Email Service",
  description: "Send transactional emails",
  tag: "email_service"
});
```

This creates a new app instance in your workspace.

## App Resources

Apps can include many types of resources. Each resource is managed and configured as part of the app:

- **Actions:** Tasks the app can perform (e.g., send an email, create a payment).
- **Authentication:** Secure access to the app (API keys, OAuth, etc.).
- **Webhooks:** Triggers for real-time updates (e.g., "Order Completed").
- **Environments:** Contexts like staging, production, or testing.
- **Variables:** Dynamic inputs passed at runtime.
- **Constants:** Static values used across environments.
- **Retry Policy:** Rules for handling failed actions and retries.

Each resource can be added, configured, and managed through the app interface, allowing you to build flexible, reusable integrations.

## Next Steps

- [Actions](./update-action)
- [Authentication](./authentication.md)
- [Webhooks](./webhooks/)
- [Environments](./environments.md)
- [Constants & Variables](./constants-variables.md)

## See Also

* [Managing an App](./create-app.md)
* [App Instance Management](./app-instance.md)
* [Importing Actions](./import-actions.md)
* [Managing Actions](./update-action.md)
* [Data Validation](./update-validation.md)
