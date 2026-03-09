---
title: Setting up Caching
description: Configure caches to store temporary data and improve performance across your product.
---

# Setting up Caching

Caches allow your product to temporarily store data from previous runs and reuse it while the cached data is still valid. This can significantly improve performance by avoiding repeated calls to external services or expensive computations.

Cached data remains available **until it expires or is invalidated**.

---

## Step 1: Open the Cache Section

1. Navigate to your **Workspace**.
2. Open the **Product** you want to configure.
3. In the sidebar, locate the **Resources** section.
4. Click **Caches**.

![Product sidebar showing caches under resources](/img/screens/product-caches-sidebar.png)

---

## Step 2: Click "Add"

1. On the **Caches** page, click the **Add** button.
2. A configuration form will appear.

---

## Step 3: Configure the Cache

Fill in the following fields:

| Field | Description |
|---|---|
| **Cache Name** | Human-readable name for the cache |
| **Tag** | Auto-generated unique identifier (editable) |
| **Expiry** | Duration (in milliseconds) before cached data expires |

![Cache configuration form showing name, tag, and expiry fields](/img/screens/cache-config-form.png)

Example:

```
Expiry: 60000
```

This means the cached data will remain valid for **60 seconds** before expiring.

---

## Step 4: Create the Cache

1. Click **Create**.
2. The cache configuration will appear in the **Product Caches list**.

Once created, the cache can be attached to other components in your product to store and retrieve state between runs.

![Caches list showing newly created cache configuration](/img/screens/cache-added-success.png)

---

## Next Steps

- [Setting up Messaging](/workbench/products/messaging)
- [Setting up Sessions](/workbench/products/sessions)
- [Setting up a Database](/workbench/products/database)