---
sidebar_position: 3
---

# PostgreSQL Database Actions

A **Database Action** in Ductape defines a reusable SQL query or operation (such as create, read, update, or delete) that can be performed on your product's PostgreSQL database. Database actions let you centralize and manage your database logic, making it easy to reuse, update, and secure queries across your application.

> **Note:** Database Action tags should follow the format: `databaseTag:dbActionTag`. This ensures clarity and prevents conflicts across different databases and their actions.

## Supported Action Types

| **Action Type** | **SQL Query Type** | **Description** |
|-----------------|-------------------|-----------------|
| Read            | SELECT            | Retrieve data from the database |
| Create          | INSERT            | Add new records to the database |
| Update          | UPDATE            | Modify existing records |
| Delete          | DELETE            | Remove records from the database |
| Aggregate       | SELECT (agg)      | Perform calculations like COUNT, SUM, etc. |

## Data Validation
You can define data validation for each input using the following pattern:

```typescript
'{{key:type:minlength:maxlength}}'
```
- `key`: The input field name (required)
- `type`: Data type (optional, default: `string`)
- `minlength`: Minimum length/size (optional, default: 1)
- `maxlength`: Maximum length/size (optional, default: unlimited)

**Example:**
```typescript
'{{username:STRING:3:20}}' // username must be a string, 3-20 characters
'{{age:INTEGER:1:3}}'      // age must be an integer, 1-3 digits
'{{email:EMAIL_STRING}}'   // email must be a valid email string
```

> Data validation patterns are used in your action templates to ensure inputs meet your requirements before executing the query.

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

## Creating PostgreSQL Database Actions

Below are examples of how to create different types of actions. Each action object should include all required fields:
- `name`: Human-readable name for the action
- `tag`: Unique identifier for the action (use `databaseTag:dbActionTag` format)
- `tableName`: Name of the database table
- `type`: Action type (see above)
- `template`: SQL query template (with placeholders)
- `description`: (Optional) Description of the action

### Create Operation
```typescript
import { IProductDatabaseAction, DatabaseActionTypes } from '@ductape/sdk/types';

const data: IProductDatabaseAction = {
  name: 'Create User',
  tag: 'postgres-db-tag:create-user',
  tableName: 'users',
  type: DatabaseActionTypes.CREATE,
  template: `
    INSERT INTO users (username, firstname, lastname, date_of_birth, address, occupation)
    VALUES ('{{username}}', '{{firstname}}', '{{lastname}}', '{{dateOfBirth}}', '{{address}}', '{{occupation}}')
    RETURNING *;
  `,
  description: 'Create a new user in PostgreSQL'
};

const action = await ductape.product.databases.actions.create(data);
```

### Read Operation
```typescript
import { IProductDatabaseAction, DatabaseActionTypes } from '@ductape/sdk/types';

const data: IProductDatabaseAction = {
  name: 'Read User',
  tag: 'postgres-db-tag:read-user',
  tableName: 'users',
  type: DatabaseActionTypes.READ,
  template: `
    SELECT * FROM users WHERE username = '{{username}}';
  `,
  description: 'Read a user from PostgreSQL'
};

const action = await ductape.product.databases.actions.create(data);
```

### Update Operation
```typescript
import { IProductDatabaseAction, DatabaseActionTypes } from '@ductape/sdk/types';

const data: IProductDatabaseAction = {
  name: 'Update User',
  tag: 'postgres-db-tag:update-user',
  tableName: 'users',
  type: DatabaseActionTypes.UPDATE,
  template: `
    UPDATE users
    SET firstname = '{{firstname}}', lastname = '{{lastname}}', address = '{{address}}'
    WHERE username = '{{username}}'
    RETURNING *;
  `,
  description: 'Update a user in PostgreSQL'
};

const action = await ductape.product.databases.actions.create(data);
```

### Delete Operation
```typescript
import { IProductDatabaseAction, DatabaseActionTypes } from '@ductape/sdk/types';

const data: IProductDatabaseAction = {
  name: 'Delete User',
  tag: 'postgres-db-tag:delete-user',
  tableName: 'users',
  type: DatabaseActionTypes.DELETE,
  template: `
    DELETE FROM users WHERE username = '{{username}}' RETURNING *;
  `,
  description: 'Delete a user in PostgreSQL'
};

const action = await ductape.product.databases.actions.create(data);
```

## Updating and Fetching Actions
- To update an existing action, use the `update` function. See [Updating Database Actions](./updating.md).
- To fetch actions, use the `fetch` or `list` functions. See [Fetching Database Actions](./Fetching.md).

**Tip:** Always ensure your `template` matches the syntax and requirements of your target database. Use parameter placeholders (e.g., `{{username}}`) to safely inject user input.

## Next Steps
- [Updating Database Actions](./updating.md)
- [Fetching Database Actions](./Fetching.md)
- [Managing Databases](../database.md)
- [Migrations](../migrations/)