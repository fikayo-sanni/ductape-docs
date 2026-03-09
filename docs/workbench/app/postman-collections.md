---
title: Uploading App Documentation
description: Import your existing API documentation into Ductape using a Postman collection or OpenAPI specification.
---

# Uploading App Documentation

Ductape lets you quickly populate your app with API endpoints by uploading existing API documentation. This is the fastest way to generate Actions for your app.

---

## Step 1: Navigate to Your App

1. Open your workspace and click on the **App** you want to configure (or create one first via **+ New App**).
2. If the app has no Actions yet, you will immediately see a **setup modal** with two options:
   - **Import App Docs**
   - **Add Request**

![App setup modal showing Import App Docs and Add Request options](/img/screens/import-app-options.png)

---

## Step 2: Click "Import App Docs"

1. In the setup modal, click **Import App Docs**.
2. Select the documentation format you want to upload:
   - **Postman Collection**
   - **OpenAPI Specification**

Ductape supports **Postman Collection v2.1** and **OpenAPI 3.0** formats.

![Import documentation screen showing Postman and OpenAPI options](/img/screens/import-app-modal.png)

---

## Step 3: Upload Your Documentation File

1. Click **Browse Files** in the upload screen.
2. Select a valid **JSON file** from your computer.

> **Tip:** To export from Postman, open your collection → click the `...` menu → **Export** → choose **Collection v2.1**.

![Documentation upload screen with file selector](/img/screens/import-app-view.png)

---

## Step 4: Import the Documentation

1. Click the **Import** button.
2. Ductape automatically parses the file and detects the available endpoints.

All detected endpoints will be automatically added as **Actions** in your app.

![Imported endpoints appearing as actions in the app](/img/screens/populated-app-dashboard.png)

---

## Next Steps

- [Adding Individual Requests](/workbench/app/individual-requests)
- [Adding Shared Variables](/workbench/app/shared-variables)
- [Making Your App Ready for Use](/workbench/app/app-visibility)