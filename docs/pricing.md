---
sidebar_position: 15
slug: /pricing
title: Pricing in Ductape
---

# How Ductape’s Per‑Action Pricing Works

Ductape’s pricing is built around a modular, per‑action model. Every operation you perform using our platform is counted as an “action.” Each pricing tier includes a monthly base fee along with defined quotas for different types of actions. When you exceed those quotas, you’re charged a fixed fee for each additional action. This approach ensures that you only pay for what you use while giving you a clear, predictable cost structure as your usage scales.

## Key Concepts
- **Base Fee & Quotas:**
Each tier (Free, Beginner, Startup, and Enterprise) comes with a fixed monthly fee that includes specific quotas for key actions—such as API requests, file transfer, and operations for various modules.

- **Overage Charges:**
When you exceed the included quotas, additional usage is billed per action at a fixed rate. For example, API requests beyond the monthly quota or file transfers beyond the allowance incur a small per‑action fee.

- **Defining an “Action”:**
An “action” is a discrete operation within one of our modules. Depending on the component, an action might be a single API request, one gigabyte of file transfer, or one operational call on a module (like a cache operation or a database query). This standardized metric allows you to compare usage across different features.


## How Each Component Is Measured
Below, each key component that factors into the per‑action pricing is explained:


### **API Requests**
**What It Is:**
Every time an API call is made through Ductape, it counts as one action.
**How It’s Measured:**

**Free Tier:** Includes 20,000 API requests per month.

**Beginner Plan:** Includes 50,000 API requests per month.

**Startup Plan:** Includes 100,000 API requests per month.

**Overage Rates:**

**Free:** $0.000025 per extra request

**Beginner:** $0.00002 per extra request

**Startup:** $0.000015 per extra request

Each API request beyond the included quota is billed at the respective rate.


### **File Transfer**
**What It Is:** File transfer measures the data (in GB) that is moved in or out of Ductape’s storage resources.

**How It’s Measured:**

***Free Tier:** 2 GB per month.

**Beginner Plan:** 10 GB per month.

**Startup Plan:** 50 GB per month.

**Overage Rates:**

**Free:** $0.0125 per additional GB

**Beginner:** $0.010 per additional GB

**Startup:** $0.008 per additional GB

Usage above the allotted GB is charged per gigabyte.


###  **Product Limits (Resources)**
**What They Are:**
These limits define how many operational “actions” you can perform within various Ductape resources. These include:

**Caches & Databases:** Each tier offers a set number of caches and databases, each with a fixed number of actions available per month (e.g., in the Free Tier, you get 1 cache and 1 database with 4 actions each; in the Beginner Plan, you get 5 caches and 5 databases with 20 actions each; in the Startup Plan, you get 10 caches and 10 databases with 40 actions each).

**Storage Units, Message Brokers, Notifiers, Jobs, and Cloud Functions:** Similarly, these resources are available in limited quantities per tier (for example, the Free Tier includes 1 storage unit, 1 message broker, 1 notifier, 1 job, and 2 cloud function calls; the Beginner and Startup plans increase these limits).

**How They’re Measured:** An “action” in these modules might refer to an operation such as a cache query, a database operation, or a job execution. The limits are set as a total number of actions per month for each module. If your usage exceeds these limits, you may need to upgrade your tier or consider additional capacity add-ons.


### **Users & Apps (API Definitions)**
**What They Are:**
Users: The number of individuals who can access and operate within your Ductape workspace.
Apps (API Definitions): The number of APIs or apps you can import into your workspace.

**How They’re Measured:**
These are provided as flat limits per tier rather than per action. For instance:

**Free Tier:** Up to 2 users and 2 API definitions.

**Beginner Plan:** Up to 5 users and 10 API definitions.

**Startup Plan:** Up to 10 users and 50 API definitions.

Exceeding these numbers would require an upgrade or an add-on.


### **Logs & Usage Data Retention**
**What It Is:**
This is the duration for which Ductape stores your logs and usage metrics.
**How It’s Measured:**

**Free Tier:** Retains logs/usage data for 1 week.

**Beginner Plan:** Retains logs/usage data for 1 month.

**Startup Plan:** Retains logs/usage data for 3 months.

Retention periods are fixed per tier, providing more historical data as you move to higher tiers.


### **Marketplace Access**
**What It Is:**
Marketplace access determines if you can publish your apps or products to Ductape’s App Store, along with the associated revenue retention percentage.

**How It’s Measured:**

**Free Tier:** No publishing allowed.

**Beginner Plan:** Can publish, but you retain 60% of the revenue.

**Startup Plan:** Can publish, with 80% revenue retention.

This component is a qualitative feature rather than a per-action metric, but it is crucial for monetizing your applications.

## **Summary**
**Base Fee & Quotas:** Each tier provides a monthly base fee with set quotas for different action types (API requests, file transfers, module operations, etc.).

**Overage Pricing:** If you exceed the included quotas, you pay a fixed fee per additional action—ensuring a pay‑as‑you‑go model that scales with your usage.

**Action Definition:** An “action” is defined by the operation in question—whether it’s an API call, a gigabyte of file transfer, or a module-specific operation.

**Component Measurements:** Each key component is measured with a specific quota and overage rate, giving you a predictable cost structure and the flexibility to scale.

This modular, per‑action pricing approach ensures transparency and allows customers to pay only for what they use, making Ductape an efficient and scalable solution for API and cloud service integration.

