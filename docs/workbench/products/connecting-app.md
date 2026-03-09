---
title: Connecting an App to a Product
description: Connect an app to a product so its actions can be used inside the product.
---

# Connecting an App to a Product

Once you have created an **App** and a **Product**, you can connect them so the app's actions become available inside the product.

Apps can be connected from either the **Product Overview page** or the **Connected Apps tab**.

---

## Step 1: Open the Product

1. Navigate to your **Workspace**.
2. Open the **Product** you want to configure.

This will take you to the **Product Overview page**.

![Product overview page showing quick actions section](/img/screens/product-overview.png)

---

## Step 2: Start the Connect App Flow

You can start the connection process in two ways.

### Option 1: From Quick Actions

1. On the **Product Overview** page, locate **Quick Actions**.
2. Click **Connect App**.

### Option 2: From the Connected Apps Tab

1. Click **Connected Apps** in the product sidebar.
2. Click the **Add** button.

![Connected apps tab showing add button](/img/screens/product-connected-apps.png)

---

## Step 3: Choose How to Add the App

You will see three options for adding an app:

| Option | Description |
|---|---|
| **Add Workspace App** | Connect an app that already exists in your workspace |
| **Import App** | Import a new app by uploading API documentation |
| **Add from Marketplace** | Browse and install apps from the Ductape Marketplace |

![Add app options showing workspace app, import app, and marketplace](/img/screens/add-app-options.png)

---

## Step 4: Select or Import the App

Depending on the option you choose:

- **Add Workspace App** → A modal appears showing your internal apps, with the option to create a new one.
- **Import App** → Opens the **Import App Docs** modal.
- **Add from Marketplace** → Redirects you to the **Ductape Marketplace**.

After selecting or importing an app, you will be taken to the **App Overview page**.

![Workspace apps modal showing selectable apps](/img/screens/select-workspace-app.png)

---

## Step 5: Click Integrate

1. On the **App Overview page**, click the **Integrate** button.
2. A modal will appear asking which **Product** you want to connect the app to.

![Integrate button on app overview page](/img/screens/select-product.png)

3. Select the product and click **Next**.

![Integrate button on app overview page](/img/screens/app-integrate-button.png)

---

## Step 6: Map Environments

Next, map the **product environments** to the **app environments**.

This ensures requests from the product are routed to the correct environment of the app.

| Product Environment | App Environment |
|---|---|
| Production | Production |
| Sandbox | Sandbox |

1. Select the appropriate mappings.
2. Click **Finish**.

![Environment mapping modal showing product and app environments](/img/screens/environment-mapping.png)

---

## Step 7: Confirm the Connection

1. A **success modal** will appear confirming the integration.

![Connected apps list showing newly connected app](/img/screens/connected-app-success-modal.png)

2. Close the modal.

To verify the connection:

1. Return to the **Product Sidebar**.
2. Click the **Refresh** button.
3. Open **Connected Apps**.

Your app should now appear in the connected apps list.

![Connected apps list showing newly connected app](/img/screens/connected-app-success.png)

---

## Next Steps

- [Setting up a Database](/workbench/products/database)
- [Setting up Notifications](/workbench/products/notifications)