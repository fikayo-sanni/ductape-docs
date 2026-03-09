---
title: Setting up Storage
description: Configure cloud storage for your product in the Ductape Workbench.
---

# Setting up Storage

Ductape allows you to connect cloud storage providers to your product so it can store and retrieve files during workflows and actions.

Supported providers include **AWS S3**, **Google Cloud Storage**, and **Azure Blob Storage**.

---

## Step 1: Open the Storage Section

1. Navigate to your **Workspace**.
2. Open the **Product** you want to configure.
3. In the sidebar, locate the **Resources** section.
4. Click **Storage**.

![Product sidebar showing storage under resources](/img/screens/product-storage-sidebar.png)

---

## Step 2: Click "Add"

1. On the **Storage** page, click the **Add** button.
2. A configuration form will appear.

---

## Step 3: Configure the Storage

Fill in the following fields:

| Field | Description |
|---|---|
| **Configuration Name** | Human-readable name for the storage connection |
| **Tag** | Auto-generated unique identifier (editable) |
| **Description** | Description of the storage connection |

![Storage configuration form showing name, tag, and storage type selector](/img/screens/storage-config-form.png)

---

## Step 4: Provide Connection Details

For each environment you have to select a provider type. After selecting the storage type, you will need to provide the required connection credentials for the provider.

Examples may include:

| Provider | Example Configuration |
|---|---|
| **AWS S3** | Access Key, Secret Key, Bucket |
| **Google Cloud Storage** | Service Account Credentials |
| **Azure Blob Storage** | Account Name, Container, Access Key |

1. Fill in the required connection details.
2. Click **Submit**.

![Storage provider configuration fields](/img/screens/storage-connection-details-2.png)

---

## Step 5: Verify the Storage

After submitting:

1. The storage configuration will appear in the **Product Storage list**.
2. Your product can now read and write files using this storage provider.

![Storage list showing newly added storage configuration](/img/screens/storage-added-success.png)

---

## Next Steps

- [Setting up a Database](/workbench/products/database)
- [Setting up Caching](/workbench/products/caching)