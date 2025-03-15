---
sidebar_position: 1
---

# MongoDB Database Actions

> **Note:** Database Action tags are expected to follow the format: `databaseTag:dbActionTag`. This convention ensures clarity and prevents conflicts across different databases and their actions.

| **Action Type** | **MongoDB Operations**                     |
|------------------|--------------------------------------------|
| Read             | `find`, `findOne`                         |
| Count            | `countDocuments`, `estimatedDocumentCount`|
| Create           | `insertOne`, `insertMany`                 |
| Update           | `updateOne`, `updateMany`                 |
| Delete           | `deleteOne`, `deleteMany`                 |
| Aggregate        | `aggregate`                               |


## MongoDB Database Actions Creation

Please note that in MongoDB, the templates are  defined as

``` typescript
  template: {
    [MongoDB Opertation]: {
      // template
    }
  }
```

## Data Validation
To define data validation for each datapoint you can follow the pattern
```typescript
'{{key:type:minlength:maxlength}}'
```

All fields asides the key are optional

e.g

```typescript
'{{key}}' is valid
```

When the non key values are not defined

The default values are 
- type - (string)
- minlength - (1) one
- maxlength - (0) unlimited

### Available `DataTypes` Options

The following `DataTypes` are available for defining feature inputs:

| Type              | Description                                     |
|-------------------|-------------------------------------------------|
| `STRING`          | Free-form text                                  |
| `NOSPACES_STRING` | String without spaces                           |
| `EMAIL_STRING`    | String in a valid email format                  |
| `DATE _STRING`    | String in a valid date format                   |
| `NUMBER_STRING`   | String representing a number                    |
| `INTEGER`         | Integer value                                   |
| `DATE`            | Date value                                      |
| `FLOAT`           | Floating-point number                           |
| `DOUBLE`          | Double-precision floating-point number          |
| `UUID`            | Universally Unique Identifier (UUID)            |
| `ARRAY`           | Array of items                                  |
| `OBJECT`          | JSON object                                     |
| `BOOLEAN`         | Boolean value (`true` or `false`)               |

### Create Operation

```typescript
const data: IProductDatabaseAction = {
  tag: 'mongo-db-tag:create-user',
  tableName: 'users',
  type: DatabaseActionTypes.CREATE,
  template: {
    insertOne: {
      username: `{{username:${DataTypes.NOSPACES_STRING}:3:20}}`,
      firstname: `{{firstname:${DataTypes.STRING}}}`,
      lastname: `{{lastname:string:${DataTypes.STRING}}}`,
      dateOfBirth: `{{dateOfBirth:date_string${DataTypes.DATE_STRING}}}`,
      address: `{{address:string:${DataTypes.STRING}}}`,
      occupation: `{{occupation:${DataTypes.STRING}}}`
    }
  }
};
```

The above shows an `insertOne` create action, you can also use create many with `insertMany` instead and expect an array of values like

``` typescript
const data: IProductDatabaseAction = {
  tag: 'mongo-db-tag:create-users',
  tableName: 'users',
  type: DatabaseActionTypes.CREATE,
  template: {
    insertMany: [{
      username: `{{username:${DataTypes.NOSPACES_STRING}:3:20}}`,
      firstname: `{{firstname:${DataTypes.STRING}}}`,
      lastname: `{{lastname:string:${DataTypes.STRING}}}`,
      dateOfBirth: `{{dateOfBirth:date_string${DataTypes.DATE_STRING}}}`,
      address: `{{address:string:${DataTypes.STRING}}}`,
      occupation: `{{occupation:${DataTypes.STRING}}}`
    }]
  }
};

```

``` typescript
const action = await ductape.product.databases.actions.create(data);
```

### Read Operation

```typescript
const data: IProductDatabaseAction = {
  tag: 'mongo-db-tag:read-user',
  tableName: 'users',
  type: DatabaseActionTypes.READ,
  template: {
    findOne: {
      username: '{{username}}'
    }
  }
};

const action = await ductape.product.databases.actions.create('mongo', data);
```

### Update Operation

```typescript
const data: IProductDatabaseAction = {
  tag: 'mongo-db-tag:update-user',
  tableName: 'users',
  type: DatabaseActionTypes.UPDATE,
  template: {
    updateOne: {
      set: {
        username: `{{username:${DataTypes.NOSPACES_STRING}:3:20}}`,
        firstname: `{{firstname:${DataTypes.STRING}}}`,
        lastname: `{{lastname:string:${DataTypes.STRING}}}`,
      }
    }
  },
  filterTemplate: {
    where: {
      username: '{{username}}'
    }
  }
};

const action = await ductape.product.databases.actions.create(data);
```

### Delete Operation

```typescript
const data: IProductDatabaseAction = {
  tag: 'mongo-db-tag:delete-user',
  tableName: 'users',
  type: DatabaseActionTypes.DELETE,
  template: {
    deleteOne: {
      username: '{{username}}'
    }
  }
};

const action = await ductape.product.databases.actions.create(data);
```