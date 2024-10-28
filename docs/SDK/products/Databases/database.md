---
sidebar_position: 1
---

# Databases

Ductape allows you to set up different databases for your project, you can define the database for each of the environments you are building on. We support the following database types:

- **Mongo**
- **PostgreSQL**

## Creating Databases

To create a database use the `createDatabase` function of the product instance. It takes the database object and a boolean field which determines whether an existing database is updated when the tag exists or an error is thrown.

```typescript
import { DatabaseTypes } from 'ductape/types/productsBuilder.types';
import { product } from 'product-instance'; // product instance file

const data = {
  type: DatabaseTypes.MONG0DB,
  tag: 'mongo',
  envs: [
    {
      env_slug: 'stg',
      connection_url: 'mongodb://localhost:27017/staging-db'
    },
    {
      env_slug: 'prd',
      connection_url: 'mongodb://localhost:27017/prod-db'
    }
  ],
  name: 'Mongo database'
};

const database = await builder.createDatabase(data, true);
```

The fields required to create a database are as below

- **name:** name of the database. ***required*** *
- **tag:** the unique identifier for this database. ***required*** *
- **type:** the database type. The currently supported types are mongo and posgresql. ***required*** *
- **envs.env_slug:** environment slug of an existing environment. ***required*** *
- **envs.connection_url:** the url which contains the connection string to access the database. ***required*** *

## Update Database

To update a database use the `updateDatabase` function of the product instance. It takes the database tag and the update payload.

```typescript
import { product } from 'product-instance'; // product instance file

const data = {
  envs: [
    {
      env_slug: 'stg',
      connection_url: 'mongodb://localhost:27017/staging'
    }
  ],
  name: 'Mongo database details'
};

const database = await builder.updateDatabase('postgres', data);
```

## Fetch Databases

To fetch the databases for a product use the `fetchDatabases` function of the product intsance.

```typescript
import { product } from 'product-instance'; // product instance file

const databases = product.fetchDatabases()
```

## Fetch Database

To fetch a single database use the `fetchDatabase` function of the product instance. It takes in the database tag.

```typescript
import { product } from 'product-instance'; // product instance file

const databases = product.fetchDatabase('mongo')
```
