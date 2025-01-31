---
sidebar_position: 1
---

# Managing Databases

Ductape allows you to set up different databases for your project, you can define the database for each of the environments you are building on. We currently support the following database types:

- **MongoDB:** `DatabaseTypes.MONGODB`
- **PostgreSQL:** `DatabaseTypes.POSTGRES`
- **MySQL:** `DatabaseTypes.MYSQL`

## Creating Databases

To create a database use the `createDatabase` function of the product instance. It takes the database object and a boolean field which determines whether an existing database is updated when the tag exists or an error is thrown.

```typescript
import { DatabaseTypes } from 'ductape-sdk/types';

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

const database = await ductape.product.databases.create(data);
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
const data = {
  envs: [
    {
      env_slug: 'stg',
      connection_url: 'mongodb://localhost:27017/staging'
    }
  ],
  name: 'Mongo database details'
};

const database = await ductape.product.databases.update("postgres-db-tag",data);
```

## Fetch Databases

To fetch the databases for a product use the `fetchAll` function of the `product.databases` interface.

```typescript
const databases = ductape.product.databases.fetchAll()
```

## Fetch Database

To fetch a single database use the `fetch` function of the `product.databases` interface. It takes in the database tag.

```typescript

const databases = ductape.product.databases.fetch('mongo-db-tag')
```
