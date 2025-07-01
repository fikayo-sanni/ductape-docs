---
sidebar_position: 4
---

# Updating Database Actions

A **Database Action** in Ductape defines a reusable query or operation (such as create, read, update, or delete) that can be performed on your product's database. You may want to update a database action to change its logic, template, or parameters as your application evolves.

## When to Update a Database Action
- You need to change the query or operation performed by an action
- You want to update the template or parameters for a specific environment or use case
- You need to fix or enhance an existing action

## Database Action Structure

| Field           | Type                | Required | Description                                      | Example                        |
|-----------------|---------------------|----------|--------------------------------------------------|---------------------------------|
| name            | string              | Yes      | Name of the action                               | Create User                    |
| tag             | string              | Yes      | Unique identifier for this action                | create-user                    |
| tableName       | string              | Yes      | Name of the database table                       | users                          |
| type            | string (enum)       | Yes      | Action type (`read`, `count`, `create`, `update`, `delete`, `aggregate`) | create |
| template        | string \| object    | Yes      | Query or operation template                      | `{"insertOne": {"username": "{{username}}"}}` or SQL string |
| description     | string              | No       | Description of the action                        | Create a new user              |
| data            | array               | No       | Sample input data                                |                               |
| filterData      | array               | No       | Sample filter data                               |                               |
| filterTemplate  | string \| object    | No       | Filter template for the action                   |                               |

## How to Update a Database Action
To update an existing database action, use the `update` function with the database tag and action tag (in the format `database-tag:action-tag`), along with the updated action object.

### Example: Updating a MongoDB Action
```typescript
import { IProductDatabaseAction, DatabaseActionTypes } from '@ductape/sdk/types';

const updateData: IProductDatabaseAction = {
  name: 'Create User',
  tag: 'create-user',
  tableName: 'users',
  type: DatabaseActionTypes.CREATE,
  template: {
    insertOne: {
      username: '{{username}}',
      firstname: '{{firstname}}',
      middlename: '{{middlename}}',
      lastname: '{{lastname}}',
      dateOfBirth: '{{dateOfBirth}}',
      address: '{{address}}',
      occupation: '{{occupation}}'
    }
  },
  description: 'Create a new user in MongoDB'
};

const action = await ductape.product.databases.actions.update('mongo-db-tag:create-user', updateData);
```

### Example: Updating a MySQL Action
```typescript
import { IProductDatabaseAction, DatabaseActionTypes } from '@ductape/sdk/types';

const updateData: IProductDatabaseAction = {
  name: 'Create User',
  tag: 'create-user',
  tableName: 'users',
  type: DatabaseActionTypes.CREATE,
  template: `
    INSERT INTO users (username, firstname, middlename, lastname, date_of_birth, address, occupation)
    VALUES ('{{username}}', '{{firstname}}', '{{middlename}}', '{{lastname}}', '{{dateOfBirth}}', '{{address}}', '{{occupation}}')
  `,
  description: 'Create a new user in MySQL'
};

const action = await ductape.product.databases.actions.update('mysql-db-tag:create-user', updateData);
```

### Example: Updating a PostgreSQL Action
```typescript
import { IProductDatabaseAction, DatabaseActionTypes } from '@ductape/sdk/types';

const updateData: IProductDatabaseAction = {
  name: 'Create User',
  tag: 'create-user',
  tableName: 'users',
  type: DatabaseActionTypes.CREATE,
  template: `
    INSERT INTO users (username, firstname, middlename, lastname, date_of_birth, address, occupation)
    VALUES ('{{username}}', '{{firstname}}', '{{middlename}}', '{{lastname}}', '{{dateOfBirth}}', '{{address}}', '{{occupation}}')
  `,
  description: 'Create a new user in PostgreSQL'
};

const action = await ductape.product.databases.actions.update('postgres-db-tag:create-user', updateData);
```

**Tip:** Always ensure your `template` matches the syntax and requirements of your target database.

## Next Steps
- [Fetching Database Actions](./Fetching.md)
- [Managing Databases](../database.md)
- [Migrations](../migrations/)
