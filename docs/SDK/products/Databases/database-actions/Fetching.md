---
sidebar_position: 5
---
# Fetching Database Actions

### Fetch All Database Actions

Use the `fetchDatabaseActions` function with the database tag to retrieve all actions.

```typescript
const actions = await ductape.product.databases.actions.fetchAll('mongo-db-tag');
```

### Fetch a Single Database Action

Use the `fetchDatabaseAction` function with both the database tag and the action tag to fetch a specific action.

```typescript
const action = await ductape.product.databases.actions.fetch('mongo-db-tag:create-user');
```