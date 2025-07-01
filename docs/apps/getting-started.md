---
sidebar_position: 1
---

# Getting Started with Apps

An **App** in Ductape is an integration with a third-party or internal service that provides specific functionality to your product. Apps are the building blocks for adding features like payments, messaging, or custom business logic.

## Types of Apps

- **Private Apps:** Internal services used only within your workspace. These can be microservices or standalone services your team develops.
- **Public Apps:** Services published to the Ductape marketplace and made available to other workspaces. These allow external developers to build on top of your app's functionality.

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

- [Actions](./actions/)
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
