---
sidebar_position: 1
---

# Managing Message Brokers

Ductape allows you to set up different message brokers for your project, you can define the message brokers for each of the environments you are building on. We currently support the following message brokers:

- **Kafka:** `MessageBrokerTypes.KAFKA`
- **Redis:** `MessageBrokerTypes.REDIS`
- **RabbitMQ:** `MessageBrokerTypes.RABBITMQ`
- **Google PubSub:** `MessageBrokerTypes.GOOGLE_PUBSUB`
- **AWS SQS:** `MessageBrokerTypes.AWS_SQS`

Ductape provides you with a uniform interface across the multiple brokers making them easily interoperable and taking out the complexities of building with them or swapping one for the other

## Setting Up Message Brokers

In creating a message broker instance for Ductape, you use the `create` function of the `product.messageBrokers` interface. You are expected to setup each product environment with their expected configurations depending on the type of Broker to be used on it. See a sample below

``` typescript
import { MessageBrokerTypes } from "ductape-sdk/types"

const broker = await ductape.product.messageBrokers.create({
    name: "Message Bus",
    tag: "message-bus",
    description: "Message Broker for Product",
    envs: [{
        slug: "prd",
        type: MessageBrokerTypes.RABBITMQ,
        config: rabbitMQConfig,
    },{
        slug: "snd",
        type: MessageBrokerTypes.REDIS,
        config: redisConfig,
    }]
})

```

## Updating Message Brokers

To update a message broker, you use the `update` function of the `product.messageBrokers` interface. You are allowed to switch between different message providers in different environments in this step, without affecting the working order in which your application functions.

``` typescript
const update = await ductape.product.messageBrokers.update("message-bus", {
    envs: [{
        slug: "prd",
        type: MessageBrokerTypes.KAFKA,
        config: kafkaConfig,
    }]
})
```

## Fetch Message Broker

To fetch the databases for a product use the `fetchAll` function of the `product.messageBrokers` interface.

```typescript
const databases = ductape.product.messageBrokers.fetchAll()
```

## Fetch Message Broker

To fetch a single database use the `fetch` function of the `product.messageBrokers` interface. It takes in the database tag.

```typescript
const databases = ductape.product.messageBrokers.fetch('message-bus')
```
