---
title: SDK Access Keys
description: Manage SDK keys used to securely access your workspace from backend and frontend applications.
---

# SDK Access Keys

SDK keys allow your applications to securely interact with your workspace resources. These keys enable backend systems and frontend applications to communicate with your workspace APIs and services.

You can manage these keys from the **Tokens** section in your workspace.

---

## Step 1: Open the Tokens Page

1. In your workspace sidebar, click **Tokens**.
2. The Tokens page will open with three tabs:

- **Tokens** – Manage workspace tokens and secrets
- **SDK Access Key** – Access your backend SDK key
- **Publishable Key** – Manage the frontend SDK key

![Tokens page showing tabs for Tokens, SDK Access Key, and Publishable Key](/img/screens/tokens-tabs.png)

---

# SDK Access Key

The **SDK Access Key** is used by backend systems to securely access workspace resources programmatically.

Examples include:

- Server-side SDK usage
- Backend integrations
- Secure service-to-service communication

Because this key grants elevated access, it is protected behind an OTP verification step.

---

## Step 2: Reveal the SDK Access Key

1. Click the **SDK Access Key** tab.
2. You will see a password-style input field where the key is hidden.
3. Click **Reveal Key**.

![SDK access key tab showing hidden key input with reveal button](/img/screens/sdk-access-hidden.png)

Once clicked:

- A **One-Time Password (OTP)** will automatically be sent to your registered email.
- A verification modal will immediately appear.

---

## Step 3: Enter the OTP

1. Enter the OTP sent to your email.
2. Click **Verify**.

![OTP verification modal requesting code sent to user email](/img/screens/sdk-access-otp.png)

If the OTP is valid:

- The SDK access key will be revealed
- It will appear in place of the obfuscated password field

![SDK access key revealed after successful OTP verification](/img/screens/sdk-access-revealed.png)

You can now copy and use this key in your backend services.

> **Important:** Treat this key like a password. Never expose it in frontend applications or public repositories.

---

# Publishable Key

The **Publishable Key** is designed for frontend environments such as web apps, mobile apps, or client-side SDKs.

Unlike the SDK access key, this key is safe to expose in frontend code but can still be restricted.

---

## Step 4: View the Publishable Key

1. Click the **Publishable Key** tab.
2. The publishable key will immediately be displayed.

![Publishable key tab displaying the public SDK key](/img/screens/publishable-key.png)

You can copy and use it in your frontend SDK integrations.

---

## Step 5: Revoke and Regenerate the Key

You can rotate the publishable key at any time.

1. Click **Revoke Key**.
2. Confirm the action.

A new publishable key will be generated.

![Revoke publishable key confirmation modal](/img/screens/publishable-key-revoke.png)

> **Warning:** Revoking a key immediately invalidates the previous key. Any systems still using the old key will start failing.

---

## Step 6: Restrict Publishable Key Actions

You can limit what the publishable key is allowed to do.

1. Click **Blacklist Action**.
2. Select the **module** you want to restrict.
3. Select the **functionality** you want to disallow.
4. Save the restriction.

![Blacklist actions modal allowing module and functionality restrictions](/img/screens/publishable-key-blacklist.png)

You can create multiple blacklist rules to further limit access.

---

## Next Steps

- [Tokens and Secrets](/workbench/tokens-secrets)
- [Logs and Overview](/workbench/logs-overview)