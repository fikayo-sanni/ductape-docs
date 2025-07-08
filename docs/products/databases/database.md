---
sidebar_position: 1
---

# Managing Databases

A **Database** in Ductape is a data store (such as MongoDB, PostgreSQL, or MySQL) that your product can connect to and use for queries, transactions, and workflows. Each database can be configured for different environments and supports reusable actions and migrations.

## Database Structure
| Field         | Type     | Required | Description                                         | Example                        |
|--------------|----------|----------|-----------------------------------------------------|---------------------------------|
| name         | string   | Yes      | Name of the database                                | Mongo database                  |
| tag          | string   | Yes      | Unique identifier for this database                 | mongo                          |
| type         | string   | Yes      | Database type (mongodb, postgresql, mysql)          | mongodb                        |
| envs         | array    | Yes      | List of environment configs (see below)             | `[{"slug": "dev", ...}]`      |
| description  | string   | No       | Description of the database                         | Main DB for app                 |
| actions      | array    | No       | Reusable database actions                           |                                 |
| migrations   | array    | No       | Database migrations                                 |                                 |

**Environment Config Structure**
| Field           | Type     | Required | Description                        | Example                        |
|----------------|----------|----------|------------------------------------|---------------------------------|
| slug           | string   | Yes      | Environment slug                   | dev                             |
| connection_url | string   | Yes      | Database connection string         | mongodb://localhost:27017/dev   |
| description    | string   | No       | Description of this environment    | Dev DB                          |

## Creating a Database
To create a database, use the `create` function of the product's databases interface.

**Example:**
```typescript
const database = await ductape.product.databases.create({
  type: "mongodb",
  tag: "mongo",
  envs: [
    { slug: "dev", connection_url: "mongodb://localhost:27017/dev" },
    { slug: "prd", connection_url: "mongodb://localhost:27017/prod" }
  ],
  name: "Mongo database"
});
```

## Updating a Database
To update a database, use the `update` function with the database tag and update payload.

**Example:**
```typescript
const updated = await ductape.product.databases.update("mongo", {
  name: "Mongo database details",
  envs: [
    { slug: "dev", connection_url: "mongodb://localhost:27017/dev-updated" }
  ]
});
```

## Fetching Databases
Fetch all databases for a product:
```typescript
const databases = ductape.product.databases.fetchAll();
```
Fetch a single database by tag:
```typescript
const database = ductape.product.databases.fetch("mongo");
```

## Why Use Databases?
- Centralize and manage your product's data
- Support multiple environments with different configs
- Define reusable actions and migrations for automation

## Next Steps
- [Database Actions](/category/database-actions/)
- [Migrations](/category/database-migrations/)
- [Products](../getting-started.md)
- [Environments](../environments.md)
