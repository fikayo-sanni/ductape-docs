---
title: "Connecting to a Database and Running Queries"
sidebar_position: 3
---

# Connecting to a Database and Running Queries

**Goal:**  
Add a database resource, define actions, and run a query.

**Prerequisites:**  
- Ductape product created  
- Database credentials

---

## Step 1: Add a Database Resource

```typescript
await ductape.product.databases.create({
  name: "Main DB",
  tag: "main_db",
  type: "postgres",
  connection: {
    host: process.env.DB_HOST,
    port: 5432,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
  }
});
```

## Step 2: Define a Database Action

```typescript
await ductape.product.databases.actions.create({
  database_tag: "main_db",
  name: "Fetch Users",
  tag: "fetch_users",
  query: "SELECT * FROM users WHERE active = true"
});
```

## Step 3: Run the Database Action

```typescript
const result = await ductape.processor.db.run({
  env: "dev",
  product: "payments_service",
  database: "main_db",
  event: "fetch_users",
  input: {}
});
console.log(result);
```

**Best Practices:**  
- Use parameterized queries to avoid SQL injection.
- Limit database permissions to only what’s needed.

**Next Steps:**  
- [Setting Up Notifications](./notifications.md) 