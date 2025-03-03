---
sidebar_position: 5
---

# Managing Actions  
After importing Actions, ductape allows you to update and fetch actions using the `ductape.app.actions` interface

## Updating Actions  

To update an action, use the `update` function. You can modify its **description, resource, name, or method** while ensuring data validation.  

```typescript
const update = await ductape.app.actions.update("send-email", {
    description: "Updated email action",
    resource: "/api/send-email",
    method: "POST",
});
``` 

## Fetching Actions  

To retrieve all available actions within the current application version, use the `fetchAll` function:  

```typescript
const actions = await ductape.app.actions.fetchAll();
```  

To fetch a specific action by its **tag** use the `fetch` function:  

```typescript
const action = await ductape.app.actions.fetch("send-email");
```  