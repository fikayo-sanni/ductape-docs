---
sidebar_position: 1
---

# MongoDB Database Actions

| **Action Type** | **MongoDB Operations**                     |
|------------------|--------------------------------------------|
| Read             | `find`, `findOne`                         |
| Count            | `countDocuments`, `estimatedDocumentCount`|
| Create           | `insertOne`, `insertMany`                 |
| Update           | `updateOne`, `updateMany`                 |
| Delete           | `deleteOne`, `deleteMany`                 |
| Aggregate        | `aggregate`                               |

---

## MongoDB Database Actions Creation

Please note that in MongoDB, the templates are  defined as

``` typescript
  template: {
    [MongoDB Opertation]: {
      // template
    }
  }
```

### Create Operation

```typescript
const data: IProductDatabaseAction = {
  tag: 'mongo-db-tag:create-user',
  tableName: 'users',
  type: DatabaseActionTypes.CREATE,
  template: {
    insertOne: {
      username: '{{username}}',
      firstname: '{{firstname}}',
      lastname: '{{lastname}}',
      dateOfBirth: '{{dateOfBirth}}',
      address: '{{address}}',
      occupation: '{{occupation}}'
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
      username: '{{username}}',
      firstname: '{{firstname}}',
      lastname: '{{lastname}}',
      dateOfBirth: '{{dateOfBirth}}',
      address: '{{address}}',
      occupation: '{{occupation}}'
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
        firstname: '{{firstname}}',
        lastname: '{{lastname}}',
        address: '{{address}}'
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