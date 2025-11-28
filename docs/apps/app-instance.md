---
sidebar_position: 2
---

# App Instance Management

To work with apps and services, start by using the App Builder interface to initialize the app you created in the previous step.

Initializing the app retrieves the application instance, enabling interaction in subsequent steps.

```typescript
// Fetch the app instance by its tag for further interaction
await ductape.app.init(app);

```
Once initialized, the `productBuilder` instance becomes accessible, exposing various management interfaces.

## App Management Interface

The app management interface provides methods for managing various aspects of an application, including variables, constants, actions, authentication methods, webhooks, environments, and validation updates.

### Variables

Manage application-level variables:

- `create(data: IAppVariables)`: Creates a new variable.
- `fetchAll()`: Retrieves all variables.
- `fetch(tag: string)`: Retrieves a specific variable by tag.
- `update(tag: string, data: Partial<IAppVariables>)`: Updates a variable.

### Constants

Manage application constants:

- `create(data: IAppConstants)`: Creates a new constant.
- `fetchAll()`: Retrieves all constants.
- `fetch(tag: string)`: Retrieves a specific constant by tag.
- `update(tag: string, data: Partial<IAppConstants>)`: Updates a constant.

### Actions

Import actions into the application:

- `import({ file, type, app?, updateIfExists? })`: Imports actions from a file.
  - `file`: The file buffer containing action definitions.
  - `type`: The type of import (e.g., JSON, YAML).
  - `app`: (Optional) The tag of the app to associate with the actions.
  - `updateIfExists`: (Optional) If `true`, updates existing actions instead of rejecting the import.

### Authentications

Manage authentication configurations:

- `create(data: IAppVariables)`: Creates a new authentication method.
- `fetchAll()`: Retrieves all authentication methods.
- `fetch(tag: string)`: Retrieves a specific authentication method by tag.
- `update(tag: string, data: Partial<IAppVariables>)`: Updates an authentication method.

### Webhooks

Manage webhooks and webhook events:

- `create(data: IAppWebhook)`: Creates a new webhook.
- `fetchAll()`: Retrieves all webhooks.
- `fetch(tag: string)`: Retrieves a specific webhook by tag.
- `update(tag: string, data: Partial<IAppWebhook>)`: Updates a webhook.

### Webhook Events

- `events.create(data: IAppWebhookEvent)`: Creates a webhook event.
- `events.fetchAll(webhookTag: string)`: Retrieves all events for a webhook.
- `events.fetch(tag: string)`: Retrieves a specific webhook event by tag.
- `events.update(tag: string, data: Partial<IAppWebhookEvent>)`: Updates a webhook event.

### Environments

Manage application environments:

- `create(data: IAppEnv)`: Creates a new environment.
- `fetchAll()`: Retrieves all environments.
- `fetch(slug: string)`: Retrieves a specific environment.
- `update(slug: string, data: Partial<IAppEnv>)`: Updates an environment.

### Update Validation

- `updateValidation(tag, update)`: Updates data validation rules for the app components.

## Summary

This interface allows applications to manage variables, constants, actions, authentication, webhooks, environments, and validation updates efficiently.

## See Also

* [Getting Started with Apps](./getting-started.md)
* [Constants & Variables](./constants-variables.md)
* [Environments Setup](./environments.md)
