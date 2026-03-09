---
title: Setting up Messaging
description: Configure message brokers for your product to enable asynchronous communication between services.
---

# Setting up Messaging

Ductape allows you to connect messaging systems to your product so it can publish and consume events asynchronously. Messaging resources are configured **per environment**, allowing different brokers to be used in **Production** and **Sandbox**.

Supported brokers include **Kafka**, **RabbitMQ**, **AWS SQS**, **Redis Pub/Sub**, **NATS**, and **Google Pub/Sub**.

---

## Step 1: Open the Messaging Section

1. Navigate to your **Workspace**.
2. Open the **Product** you want to configure.
3. In the sidebar, locate the **Resources** section.
4. Click **Messaging**.

![Product sidebar showing messaging under resources](/img/screens/product-messaging-sidebar.png)

---

## Step 2: Click "Add"

1. On the **Messaging** page, click the **Add** button.
2. A configuration form will appear.
---

## Step 3: Configure the Messaging Resource

Fill in the following fields:

| Field | Description |
|---|---|
| **Configuration Name** | Human-readable name for the messaging setup |
| **Tag** | Auto-generated unique identifier (editable) |
| **Description** | Description of Configuration |

![Messaging configuration form showing name and tag fields](/img/screens/messaging-config-form.png)

---

## Step 4: Select Broker Type Per Environment

For each environment, choose the messaging broker you want to use.

Supported broker options include:

- **Kafka**
- **RabbitMQ**
- **AWS SQS**
- **Redis PubSub**
- **NATS**
- **Google PubSub**

You can configure different brokers for different environments if needed.

![Broker selection fields for sandbox and production environments](/img/screens/messaging-broker-selection.png)

---

## Step 5: Provide Connection Details

After selecting the broker type, provide the required connection details for that provider.

Examples may include:

| Broker | Example Configuration |
|---|---|
| **Kafka** | Broker URL, Topic |
| **RabbitMQ** | Connection URL, Exchange |
| **AWS SQS** | Queue URL, Access Credentials |
| **Redis PubSub** | Redis Connection URL |
| **NATS** | NATS Server URL |
| **Google PubSub** | Project ID, Service Account Credentials |

1. Fill in the required fields for each configured environment.
2. Click **Submit**.

![Messaging connection configuration fields](/img/screens/messaging-connection-details.png)

---

## Step 6: Verify the Messaging Resource

After submitting:

1. The messaging configuration will appear in the **Product Messaging list**.
2. Your product can now publish and consume messages through the configured broker.

![Messaging list showing newly added messaging configuration](/img/screens/messaging-added-success.png)

---

## Next Steps

- [Setting up a Database](/workbench/products/database)
- [Setting up Storage](/workbench/products/storage)
- [Setting up Caching](/workbench/products/caching)