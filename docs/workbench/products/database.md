---
title: Setting up a Database
description: Configure databases, graph databases, or vector stores for your product in the Ductape Workbench.
---

# Setting up a Database

Ductape allows you to connect different types of data stores to your product, including **relational databases**, **NoSQL databases**, **graph databases**, and **vector stores**. Once configured, your product can interact with these resources for queries, pipelines, and data operations.

---

## Step 1: Open the Database Section

1. Navigate to your **Workspace**.
2. Open the **Product** you want to configure.
3. In the sidebar, locate the **Resources** section.
4. Click **Database** (the second item under Resources).

![Product sidebar showing database under resources](/img/screens/product-database-sidebar.png)

---

## Step 2: Click "Add"

1. On the **Database** page, click the **Add** button.
2. A modal will appear showing the available resource types.

Available options include:

- **Database**
- **Graph Database**
- **Vector Store**

![Add resource modal showing database, graph database, and vector store options](/img/screens/add-resource-modal.png)

---

## Step 3: Configure the Database

1. Click **Database** from the modal.
2. A configuration form will appear.

Fill in the following fields:

| Field | Description |
|---|---|
| **Configuration Name** | Human-readable name for the database connection |
| **Tag** | Auto-generated unique identifier (editable) |
| **Database Type** | Select the database provider (e.g., PostgreSQL, MySQL, MongoDB) |

3. After filling in the required fields, click **Continue to Connection URL**.

![Database configuration form showing name, tag, and database type](/img/screens/database-config-form.png)

---

## Step 4: Provide Connection Details

Next, you will be prompted to enter the **connection URL** for the selected database type.

Example:

```
postgresql://user:password@host:5432/database
```

1. Enter the required connection information.
2. Click **Submit**.

![Connection url form for database setup](/img/screens/database-connection-url.png)

---

## Step 5: Verify the Database

After submitting:

1. The database will appear in the **Product Databases list**.
2. You can now use this database within your product.

![Product databases list showing newly added database](/img/screens/database-added-success.png)

---

## Graph Databases and Vector Stores

The setup flow is similar for other resource types.

### Graph Databases

Graph databases follow the same setup process, but depending on the provider, additional configuration fields may be required beyond the connection URL.

![Graph database or vector store configuration form](/img/screens/graph-store-config.png)

### Vector Stores

Vector stores also follow the same setup process. However, some providers require additional configuration parameters in addition to the connection URL.

![Graph database or vector store configuration form](/img/screens/vector-store-config.png)

---

## Next Steps

- [Setting up Storage](/workbench/products/storage)
- [Setting up Caching](/workbench/products/caching)