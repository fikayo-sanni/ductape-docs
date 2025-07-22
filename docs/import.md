---
sidebar_position: 2
---

# Quickstart: Adding Apps

Follow these steps to add and configure a new app (e.g., Paystack) in Ductape:


### 1. **Sign Up or Log In**
   - Go to [https://cloud.ductape.app](https://cloud.ductape.app/auth/login) and sign up or log in (Google sign-in supported).

### 2. **Create Workspace**
   If you're logging in for the first time, you will be prompted to create a workspace. Workspaces hold your apps and products in the Ductape ecosystem.

   ![Create Workspace](/img/workspace.png)

### 3. **Access Your Dashboard**
   - Once logged in, you’ll see your dashboard. Click on **Apps** in the sidebar.
   ![Dashboard](/img/dashboard.png)

### 4. **Create a New App**
   - Click the **New App** button.
   - Enter your desired app name (e.g., `Paystack`).
   - Click **Create** to add the app.

   ![Dashboard](/img/app.png)

### 5. **Open and Set Up Your App**
   - Click on your new app in the list to open its setup page.

### 6. **Import Actions from Postman**
   - Select **Postman v2.1** as the import type.
   - Click **Browse** and upload your Postman collection file for Paystack. **[⭐️Paystack Postman Collection!](https://drive.google.com/file/d/1PPqTgXlpgAyaP8AwOC4AZYQPjUUk6TWB/view?usp=share_link)**

   ![Import Paystack](/img/import.png)

### 7. **Configure Environments**
   - Enter the base URL for each environment:
     - **Production:** `https://api.paystack.co`
     - **Sandbox:** (if available, use the appropriate URL or duplicate production for testing)

   ![Setup Envs](/img/envs.png)

### 8. **Set Up Authorization**
   - Choose the type of authorization:
     - **Credential Access:** For expiring tokens (not typical for Paystack).
     - **Token Access:** For non-expiring tokens (recommended for Paystack).
   - For Paystack, select **Token Access**. Fill out the form to specify where your token should be attached in requests (e.g., in the `headers` as `Authorization`).

> **Tip:** Paystack uses non-expiring secret keys, so Token Access is the best choice. Make sure to paste your secret key in the correct field and select `headers` as the location.

![Setup Auth](/img/auths.png)

You’ve now added and configured your Paystack app in Ductape! Continue to set up resources, connect to products, and automate workflows as needed.
