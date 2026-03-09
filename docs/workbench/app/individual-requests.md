---
title: Adding Individual Requests
description: Manually add API requests (actions) to your app one at a time.
---

# Adding Individual Requests

If you want to add an endpoint manually, you can create a request directly from the Workbench. This allows you to test the request first and then save it as an Action inside an app.

---

## Step 1: Click "+ New"

1. In the top navigation bar, click the **+ New** button.
2. A dropdown menu will appear showing a list of assets that can be created.

![New asset dropdown showing Request option](/img/screens/select-individual-request.png)

---

## Step 2: Select "Request"

1. From the dropdown list, click **Request**.
2. You will be prompted to choose where the request should be saved.

Options include:
- **Select an existing App**
- **Create a new App**

![Select app screen showing existing apps and create new option](/img/screens/select-app-request.png)

---

## Step 3: Open the New Request Screen

1. After selecting an app, the **New Request** screen will appear.
2. Paste the API endpoint URL into the **URL field**.

Example:

```
https://jsonplaceholder.typicode.com/todos/1
```

3. Click **Send** to execute the request and view the response.

![Request editor showing URL field, method selector, and Send button](/img/screens/new-request-tab.png)

---

## Step 4: Save the Request

1. After receiving a response, click the **Save** button.
2. A modal will appear asking for additional information.

Fill in the following fields:

| Field | Description |
|---|---|
| **Name** | Human-readable name for the request |
| **Tag** | Auto-generated unique identifier (editable) |
| **Description** | Optional explanation of the request |

![Save action modal showing name, tag, and description fields](/img/screens/save-request-modal.png)

---

## Step 5: Save the Action

1. Click **Save Action**.
2. Once saved successfully, you will be redirected to the **App's Actions tab** where the new request appears in the list.

![Actions list showing the newly created request](/img/screens/individual-request-success.png)

---

## Next Steps

- [Adding Shared Variables](/workbench/app/shared-variables)
- [Making Your App Ready for Use](/workbench/app/app-visibility)