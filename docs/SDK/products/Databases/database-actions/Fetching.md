---
sidebar_position: 5
---
# Fetching Database Actions

### Fetch All Database Actions

Use the `fetchDatabaseActions` function with the database tag to retrieve all actions.

```typescript
const actions = await product.fetchDatabaseActions('mongo');
```

### Fetch a Single Database Action

Use the `fetchDatabaseAction` function with both the database tag and the action tag to fetch a specific action.

```typescript
const action = await product.fetchDatabaseAction('mongo:create-user');
```