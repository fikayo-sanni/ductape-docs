---
sidebar_position: 5
---

# Managing Actions

After importing actions, Ductape allows you to update and fetch actions using the `ductape.app.actions` interface.

## Updating Actions

To update an action, use the `update` function. You can modify its **description, resource, name, or method** while ensuring data validation.

```ts
const update = await ductape.app.actions.update("send-email", {
  description: "Updated email action",
  resource: "/api/send-email",
  method: "POST",
});
```

## Fetching Actions

To retrieve all available actions within the current application version, use the `fetchAll` function:

```ts
const actions = await ductape.app.actions.fetchAll();
```

To fetch a specific action by its **tag** use the `fetch` function:

```ts
const action = await ductape.app.actions.fetch("send-email");
```

## See Also

* [Importing Actions](./import-actions.md)
* [Data Validation](./update-validation.md)
* [Getting Started with Apps](./getting-started.md)  