---
sidebar_position: 1
---

# MongoDB Database Actions

A **Database Action** in Ductape defines a reusable MongoDB operation (such as create, read, update, or delete) that can be performed on your product's MongoDB database. Database actions let you centralize and manage your database logic, making it easy to reuse, update, and secure queries across your application.

> **Note:** Database Action tags should follow the format: `databaseTag:dbActionTag`. This ensures clarity and prevents conflicts across different databases and their actions.

## Supported Action Types

| **Action Type** | **MongoDB Operation**         | **Description**                                 |
|-----------------|------------------------------|-------------------------------------------------|
| Read            | `find`, `findOne`            | Retrieve documents from the collection          |
| Count           | `countDocuments`, `estimatedDocumentCount` | Count documents in the collection |
| Create          | `insertOne`, `insertMany`    | Add new documents to the collection             |
| Update          | `updateOne`, `updateMany`    | Modify existing documents                       |
| Delete          | `deleteOne`, `deleteMany`    | Remove documents from the collection            |
| Aggregate       | `aggregate`                  | Perform aggregation pipelines                   |

## Data Validation
You can define data validation for each input using the following pattern:

```typescript
'{{key:type:minlength:maxlength:unique}}'
```
- `key`: The input field name (required)
- `type`: Data type (optional, default: `string`)
- `minlength`: Minimum length/size (optional, default: 1)
- `maxlength`: Maximum length/size (optional, default: unlimited)
- `unique`: Whether the value must be unique (optional, default: false)

**Example:**
```typescript
'{{username:STRING:3:20:true}}' // username must be a unique string, 3-20 characters
'{{age:INTEGER:1:3}}'           // age must be an integer, 1-3 digits
'{{email:EMAIL_STRING}}'        // email must be a valid email string
```

> Data validation patterns are used in your action templates to ensure inputs meet your requirements before executing the operation.

### Available Data Types

| Type              | Description                                     |
|-------------------|-------------------------------------------------|
| `STRING`          | Free-form text                                  |
| `NOSPACES_STRING` | String without spaces                           |
| `EMAIL_STRING`    | String in a valid email format                  |
| `DATE_STRING`     | String in a valid date format                   |
| `NUMBER_STRING`   | String representing a number                    |
| `INTEGER`         | Integer value                                   |
| `DATE`            | Date value                                      |
| `FLOAT`           | Floating-point number                           |
| `DOUBLE`          | Double-precision floating-point number          |
| `UUID`            | Universally Unique Identifier (UUID)            |
| `ARRAY`           | Array of items                                  |
| `OBJECT`          | JSON object                                     |
| `BOOLEAN`         | Boolean value (`true` or `false`)               |

---

## Creating MongoDB Database Actions

Below are examples of how to create different types of actions. Each action object should include all required fields:
- `name`: Human-readable name for the action
- `tag`: Unique identifier for the action (use `databaseTag:dbActionTag` format)
- `tableName`: Name of the MongoDB collection
- `type`: Action type (see above)
- `template`: MongoDB operation template (see below)
- `description`: (Optional) Description of the action

### Create Operation (insertOne)
```typescript
import { IProductDatabaseAction, DatabaseActionTypes, DataTypes } from '@ductape/sdk/types';

const data: IProductDatabaseAction = {
  name: 'Create User',
  tag: 'mongo-db-tag:create-user',
  tableName: 'users',
  type: DatabaseActionTypes.CREATE,
  template: {
    insertOne: {
      username: `{{username:${DataTypes.NOSPACES_STRING}:3:20:true}}`,
      firstname: `{{firstname:${DataTypes.STRING}}}`,
      lastname: `{{lastname:${DataTypes.STRING}}}`,
      dateOfBirth: `{{dateOfBirth:${DataTypes.DATE_STRING}}}`,
      address: `{{address:${DataTypes.STRING}}}`,
      occupation: `{{occupation:${DataTypes.STRING}}}`
    }
  },
  description: 'Create a new user in MongoDB'
};

const action = await ductape.product.databases.actions.create(data);
```

### Create Operation (insertMany)
```typescript
import { IProductDatabaseAction, DatabaseActionTypes, DataTypes } from '@ductape/sdk/types';

const data: IProductDatabaseAction = {
  name: 'Create Multiple Users',
  tag: 'mongo-db-tag:create-users',
  tableName: 'users',
  type: DatabaseActionTypes.CREATE,
  template: {
    insertMany: [
      {
        username: `{{username:${DataTypes.NOSPACES_STRING}:3:20:true}}`,
        firstname: `{{firstname:${DataTypes.STRING}}}`,
        lastname: `{{lastname:${DataTypes.STRING}}}`,
        dateOfBirth: `{{dateOfBirth:${DataTypes.DATE_STRING}}}`,
        address: `{{address:${DataTypes.STRING}}}`,
        occupation: `{{occupation:${DataTypes.STRING}}}`
      }
    ]
  },
  description: 'Create multiple users in MongoDB'
};

const action = await ductape.product.databases.actions.create(data);
```

### Read Operation (findOne)
```typescript
import { IProductDatabaseAction, DatabaseActionTypes } from '@ductape/sdk/types';

const data: IProductDatabaseAction = {
  name: 'Read User',
  tag: 'mongo-db-tag:read-user',
  tableName: 'users',
  type: DatabaseActionTypes.READ,
  template: {
    findOne: {
      username: '{{username}}'
    }
  },
  description: 'Read a user from MongoDB'
};

const action = await ductape.product.databases.actions.create(data);
```

### Update Operation (updateOne)
```typescript
import { IProductDatabaseAction, DatabaseActionTypes, DataTypes } from '@ductape/sdk/types';

const data: IProductDatabaseAction = {
  name: 'Update User',
  tag: 'mongo-db-tag:update-user',
  tableName: 'users',
  type: DatabaseActionTypes.UPDATE,
  template: {
    updateOne: {
      set: {
        firstname: `{{firstname:${DataTypes.STRING}}}`,
        lastname: `{{lastname:${DataTypes.STRING}}}`,
        address: `{{address:${DataTypes.STRING}}}`
      }
    }
  },
  filterTemplate: {
    where: {
      username: '{{username}}'
    }
  },
  description: 'Update a user in MongoDB'
};

const action = await ductape.product.databases.actions.create(data);
```

### Delete Operation (deleteOne)
```typescript
import { IProductDatabaseAction, DatabaseActionTypes } from '@ductape/sdk/types';

const data: IProductDatabaseAction = {
  name: 'Delete User',
  tag: 'mongo-db-tag:delete-user',
  tableName: 'users',
  type: DatabaseActionTypes.DELETE,
  template: {
    deleteOne: {
      username: '{{username}}'
    }
  },
  description: 'Delete a user from MongoDB'
};

const action = await ductape.product.databases.actions.create(data);
```

---

## Updating and Fetching Actions
- To update an existing action, use the `update` function. See [Updating Database Actions](./updating.md).
- To fetch actions, use the `fetch` or `list` functions. See [Fetching Database Actions](./Fetching.md).

---

**Tip:** Always ensure your `template` matches the syntax and requirements of your target database. Use parameter placeholders (e.g., `{{username}}`) to safely inject user input.

## Next Steps
- [Updating Database Actions](./updating.md)
- [Fetching Database Actions](./Fetching.md)
- [Managing Databases](../database.md)
- [Migrations](../migrations/)