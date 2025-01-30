---
sidebar_position: 4
---

# Updating Database Actions

To update an existing database action, use the `updateDatabaseAction` function. This requires the **database_tag:existing_action_tag** within the **updated database action object**.

## Updating MongoDB Action

The same rules with regards `insertOne` and `insertMany` and other templating rules are expected to still be observed. In templating you can set new templates as you wish

```typescript
import { IProductDatabaseAction } from 'ductape-sdk/types';

const updateData: IProductDatabaseAction = {
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

const action = await ductape.product.databases.actions.update('mongo-db-tag:create-user', updateData);
```

## Updating MySQL Action

```typescript
import { IProductDatabaseAction } from 'ductape-sdk/types';

const updateData: IProductDatabaseAction = {
  tableName: 'users',
  type: DatabaseActionTypes.CREATE,
  template: `
    INSERT INTO users (username, firstname, middlename, lastname, date_of_birth, address, occupation)
    VALUES ('{{username}}', '{{firstname}}', '{{middlename}}', '{{lastname}}', '{{dateOfBirth}}', '{{address}}', '{{occupation}}')
  `
}

const action = await ductape.product.databases.actions.update('mysql-db-tag:create-user', updateData);
```


## Updating PostgresSQL Action

```typescript
import { IProductDatabaseAction } from 'ductape-sdk/types';

const updateData: IProductDatabaseAction = {
  tableName: 'users',
  type: DatabaseActionTypes.CREATE,
  template: `
    INSERT INTO users (username, firstname, middlename, lastname, date_of_birth, address, occupation)
    VALUES ('{{username}}', '{{firstname}}', '{{middlename}}', '{{lastname}}', '{{dateOfBirth}}', '{{address}}', '{{occupation}}')
  `
}

const action = await ductape.product.databases.actions.update('postgres-db-tag:create-user', updatedData);
```
