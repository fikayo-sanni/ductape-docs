---
sidebar_position: 4
---

# Updating Database Actions

To update an existing database action, use the `updateDatabaseAction` function. This requires the **database_tag:existing_action_tag** within the **updated database action object**.

## Updating MongoDB Action

The same rules with regards `insertOne` and `insertMany` and other templating rules are expected to still be observed. In templating you can set new templates as you wish

```typescript
const updatedData: IProductDatabaseAction = {
  tag: 'mongo-db-tag:create-user',
  tableName: 'users',
  type: DatabaseActionTypes.CREATE,
  template: {
    insertOne: {
      username: '{{username}}',
      firstname: '{{firstname}}',
      middlename: '{{middlename}}'
      lastname: '{{lastname}}',
      dateOfBirth: '{{dateOfBirth}}',
      address: '{{address}}',
      occupation: '{{occupation}}'
    }
  }
};

const action = await product.updateDatabaseAction(updatedData);
```

## Updating MySQL Action

```typescript
const data: IProductDatabaseAction = {
  tag: 'mysql-db-tag:create-user',
  tableName: 'users',
  type: DatabaseActionTypes.CREATE,
  template: `
    INSERT INTO users (username, firstname, middlename, lastname, date_of_birth, address, occupation)
    VALUES ('{{username}}', '{{firstname}}', '{{middlename}}', '{{lastname}}', '{{dateOfBirth}}', '{{address}}', '{{occupation}}')
  `
}

const action = await product.updateDatabaseAction(updatedData);
```


## Updating PostgresSQL Action

```typescript
const data: IProductDatabaseAction = {
  tag: 'postgres-db-tag:create-user',
  tableName: 'users',
  type: DatabaseActionTypes.CREATE,
  template: `
    INSERT INTO users (username, firstname, middlename, lastname, date_of_birth, address, occupation)
    VALUES ('{{username}}', '{{firstname}}', '{{middlename}}', '{{lastname}}', '{{dateOfBirth}}', '{{address}}', '{{occupation}}')
  `
}

const action = await product.updateDatabaseAction(updatedData);
```
