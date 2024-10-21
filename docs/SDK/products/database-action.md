---
sidebar_position: 7
---
# Database Actions

Ductape allows you to set up different database actions for the databases you have created. You can create the following actions for each of the different schemas/tables you have:

- **Read**
- **Count**
- **Create**
- **Update**
- **Delete**
- **Aggregate**

## Creating Database Actions

To create a database action use the `createDatabaseAction` function of the product instance. It takes the database tag, the database action payload and a boolean field which determines whether an existing database is updated when the tag exists or an error is thrown.

### Mongo

#### Mongo Create/Read/Delete/Aggregate/Count Actions

```typescript
import { DatabaseTypes } from 'ductape/types/productsBuilder.types';
import { product } from 'product-instance'; // product instance file

const product = await ductape.getProductBuilder();
const data: IProductDatabaseAction = {
  tag: 'create user',
  tableName: 'user',
  type: DatabaseActionTypes.CREATE,
  data: ['name', 'dateOfBirth', 'address', 'occupation', 'username'],
  template:
    '{username: {{username}}, name: {{name}}, dateOfBirth: {{dateOfBirth}}, userAddress: {{address}}, job: {{occupation}}}'
};

const action = await product.createDatabaseAction('mongo', data, true);
```

The fields required to create a database action for mongo are as below

- **tag:** the unique identifier for this database action. (This needs to be unique for each database but not across databases) **_required_** \*
- **tableName:** the name of the collection this action is to be run on. **_required_** \*
- **type:** the database action type. check above for the list of supported types. **_required_** \*
- **template:** this is the json-like structure filled with variables wrapped in `{{}}` which are dynamically populated to be passed to the mongo create method during the processing of this action. **_required_** \*
- **data:** this is an array of the fields matching the placeholders in the template above which are to be replaced with input provided to process this action. **_required_** \*

#### Mongo Update Action

Because of the structure of the update functions in mongo, there are 2 additional fields that are required to create update database actions. The fields are **filterData** and **filterTemplate**. These fields are used to construct the object to filter the collection before running the update.

```typescript
import { DatabaseTypes } from 'ductape/types/productsBuilder.types';
import { product } from 'product-instance'; // product instance file

const product = await ductape.getProductBuilder();
const data: IProductDatabaseAction = {
  tag: 'create user',
  tableName: 'user',
  type: DatabaseActionTypes.CREATE,
  data: ['name', 'dateOfBirth', 'address', 'occupation'],
  template:
    '{name: {{name}}, dateOfBirth: {{dateOfBirth}}, userAddress: {{address}}, job: {{occupation}}}',
  filterData: ['username'],
  filterTemplate: '{username: {{username}}}'
};

const action = await product.createDatabaseAction('mongo', data, true);
```

### PostgreSQL

```typescript
import { DatabaseTypes } from 'ductape/types/productsBuilder.types';
import { product } from 'product-instance'; // product instance file

const product = await ductape.getProductBuilder();
const data: IProductDatabaseAction = {
  tag: 'create user',
  tableName: 'user',
  type: DatabaseActionTypes.CREATE,
  data: ['name', 'dateOfBirth', 'address'],
  template: `INSERT INTO user (name, date_of_birth, user_address) VALUES ('{{name}}', '{{dateOfBirth}}', '{{address}}')`
};

const action = await product.createDatabaseAction('mongo', data, true);
```

The fields required to create a database action for postgres are as below

- **tag:** the unique identifier for this database action. **_required_** \*
- **tableName:** the name of the collection this action is to be run on **_required_** \*
- **type:** the database action type. check above for the list of supported types. **_required_** \*
- **template:** this is the sql query to be run for this action filled with variables wrapped in `{{}}` which are dynamically populated. **_required_** \*
- **data:** this is an array of the fields matching the placeholders in the template above which are to be replaced with input provided to process this action. **_required_** \*

## Update Database Action

To update a database action use the `updateDatabaseAction` function of the product instance. It takes the database tag and the database action object which must contain the unique action tag.

```typescript
import { product } from 'product-instance'; // product instance file
import { DatabaseActionsTypes } from 'ductape/types/productsBuilder.types';

const data: IProductDatabaseAction = {
  tag: 'create user',
  tableName: 'user',
  type: DatabaseActionTypes.CREATE,
  data: ['name', 'dateOfBirth', 'address', 'occupation'],
  template: `INSERT INTO user (name, date_of_birth, user_address, job) VALUES ('{{name}}', '{{dateOfBirth}}', '{{address}}', '{{occupation}}')`
};

const action = await product.updateDatabaseAction('mongo', data);
```

## Fetch Database Actions

To fetch a database action use the `fetchDatabaseActions` function of the product instance. It takes the database tag.

```typescript
import { product } from 'product-instance';

const actions = await product.fetchDatabaseActions('mongo');
```

## Fetch Database Action

To fetch a single database action use the `fetchDatabaseAction` function of the product instance. It takes the database tag and the tag of the database action.

```typescript
import { product } from 'product-instance';

const action = await product.fetchDatabaseAction('mongo', 'create user');
```
