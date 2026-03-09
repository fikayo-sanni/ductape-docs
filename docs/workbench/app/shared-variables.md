---
title: Adding Shared Variables
description: Define reusable query or header variables that can be applied across multiple actions in your app.
---

# Adding Shared Variables

Shared variables allow you to define reusable request parameters that appear across multiple actions in your app. These are useful when a value (such as an authorization header or query parameter) is required across many endpoints but was not captured in the original API documentation.

---

## Step 1: Open Your App

1. Navigate to your **Workspace**.
2. Open the **App** where you want to add the shared variable.

---

## Step 2: Click the "+" Button

1. In the app sidebar, locate the **+ button** next to the **Refresh** button.
2. Click the **+ button** to open the asset dropdown menu.

![Sidebar showing plus button next to refresh](/img/screens/sidebar-add-dropdown.png)

---

## Step 3: Select "Shared Variable"

1. From the dropdown menu, select **Shared Variable**.

Options available in the dropdown include:

- **New Action**
- **New Folder**
- **Shared Variable**

![Dropdown menu showing New Action, New Folder, and Shared Variable options](/img/screens/shared-variable-dropdown.png)

---

## Step 4: Configure the Shared Variable

After selecting **Shared Variable**, a configuration modal will appear.

Fill in the following fields:

| Field | Description |
|---|---|
| **Variable Type** | Choose where the variable should be applied: `Query` or `Header` |
| **Key** | The parameter key (e.g., `Authorization`) |
| **Sample Value** | Example value used for the parameter (e.g., `Bearer <Token>`) |

![Shared variable modal showing variable type, key, and sample value fields](/img/screens/shared-variable-modal.png)

---

## Step 5: Select Actions

1. Choose the **actions** you want the variable applied to.
2. You can:
   - Select actions individually
   - Click **Select All** to apply it to every action in the app.

![Action selection screen showing multiple endpoints with checkboxes](/img/screens/shared-variable-select-actions.png)

---

## Step 6: Add the Variable to Actions

1. Click the **Add to num Actions** button.
2. A **confirmation step** will appear asking you to confirm the action.

![Confirm action modal for adding shared variable](/img/screens/shared-variable-confirm.png)

3. Click **Confirm** to proceed.

---

## Step 7: Refresh the App

1. After the operation completes successfully, click the **Refresh** button.
2. The variable will now appear in the **Query parameters** or **Headers** of the selected actions.

![Action editor showing newly added header or query parameter](/img/screens/shared-variable-success.png)

---

## Next Steps

- [Making Your App Ready for Use](/workbench/app/app-visibility)
- [Adding Individual Requests](/workbench/app/individual-requests)