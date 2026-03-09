---
title: Logs and Overview
description: Monitor your product's activity with real-time logs and usage metrics.
---

# Logs and Overview

The **Logs** section in Ductape gives you a real-time view of all operations executed through your product — including SDK calls, database queries, storage uploads, and messaging events.

---

## Step 1: Open the Logs Section

1. Go to your workspace and open the **Product** you want to monitor.
2. Click the **Logs** tab in the product's sidebar.

---

## Step 2: Read the Overview Dashboard

The overview panel shows key metrics at a glance:

| Metric | Description |
|---|---|
| **Total Requests** | Total SDK operations in the selected time range |
| **Success Rate** | Percentage of operations that succeeded |
| **Avg Latency** | Average time taken per operation |
| **Error Count** | Number of failed operations |

![Product overview dashboard showing request count, success rate, latency, and error metrics](/img/workspace-list.png)

---

## Step 3: Browse Audit Logs

The audit log table shows a per-request breakdown:

| Column | Description |
|---|---|
| **Timestamp** | When the operation occurred |
| **User** | The user or API key that triggered it |
| **Module** | SDK module used (e.g., `databases`, `storage`) |
| **Method** | SDK method called (e.g., `create`, `upload`) |
| **Status** | `SUCCESS` or `FAILED` |
| **Latency** | Time taken in milliseconds |

![Audit log table showing timestamp, user, module, method, status, and latency columns](/img/workspace-list.png)

---

## Step 4: Filter Logs

Use the filter bar to narrow down logs:

- **Date range** — View logs from a specific period
- **Module** — Filter by SDK module (databases, storage, messaging, etc.)
- **Status** — Show only failures or successes
- **User** — Filter by a specific user ID

---

## Step 5: View Log Details

1. Click any row in the audit log table to open the detail panel.
2. You'll see the full request parameters, response, error messages, and stack traces (if applicable).

---

## Next Steps

- [Managing Team Members](/workbench/team-management)
- [Managing Secrets](/workbench/secrets)
