---
sidebar_position: 3
---

# PostgresSQL Database Actions

> **Note:** Database Action tags are expected to follow the format: `databaseTag:dbActionTag`. This convention ensures clarity and prevents conflicts across different databases and their actions.

| **Action Type** | **SQL Query Type**          |
|------------------|-----------------------------|
| Read             | SELECT                     |
| Create           | INSERT                     |
| Update           | UPDATE                     |
| Delete           | DELETE                     |
| Aggregate        | SELECT (for aggregations)  |

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
| `NUMBER_STRING`   | String representing a number                    |
| `INTEGER`         | Integer value                                   |
| `FLOAT`           | Floating-point number                           |
| `DOUBLE`          | Double-precision floating-point number          |
| `UUID`            | Universally Unique Identifier (UUID)            |
| `ARRAY`           | Array of items                                  |
| `OBJECT`          | JSON object                                     |
| `BOOLEAN`         | Boolean value (`true` or `false`)               |

## Creating Postgres Database Actions

### Create Operation

```typescript
const data: IProductDatabaseAction = {
  tag: 'postgres-db-tag:create-user',
  tableName: 'users',
  type: DatabaseActionTypes.CREATE,
  template: `
    INSERT INTO users (username, firstname, lastname, date_of_birth, address, occupation)
    VALUES ('{{username}}', '{{firstname}}', '{{lastname}}', '{{dateOfBirth}}', '{{address}}', '{{occupation}}')
    RETURNING *;
  `
};

const action = await ductape.product.databases.actions.create(data);
```

### Read Operation

```typescript
const data: IProductDatabaseAction = {
  tag: 'postgres-db-tag:read-user',
  tableName: 'users',
  type: DatabaseActionTypes.READ,
  template: `
    SELECT * FROM users WHERE username = '{{username}}';
  `
};

const action = await ductape.product.databases.actions.create(data);
```

### Update Operation

```typescript
const data: IProductDatabaseAction = {
  tag: 'postgres-db-tag:update-user',
  tableName: 'users',
  type: DatabaseActionTypes.UPDATE,
  template: `
    UPDATE users
    SET firstname = '{{firstname}}', lastname = '{{lastname}}', address = '{{address}}'
    WHERE username = '{{username}}'
    RETURNING *;
  `
};

const action = await ductape.product.databases.actions.create(data);
```

### Delete Operation

```typescript
const data: IProductDatabaseAction = {
  tag: 'postgres-db-tag:delete-user',
  tableName: 'users',
  type: DatabaseActionTypes.DELETE,
  template: `
    DELETE FROM users WHERE username = '{{username}}' RETURNING *;
  `
};

const action = await ductape.product.databases.actions.create(data);
```