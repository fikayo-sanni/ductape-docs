---
sidebar_position: 3
---


# Create Product Instance

As a first step towards building your product after creating it, you cneed create a reusable product instance to interact with the `productBuilder` interface. A product instance enables interaction with the `productBuilder` interface, allowing you to manage different aspects of the product, such as apps, environments, storage, cloud functions, and more.  

## Initializing a Product Instance  

```typescript
// Initialize a product instance
await ductape.product.init(product_tag);
```

Once initialized, the `productBuilder` instance becomes accessible, exposing various management interfaces.  

## Available Interfaces  

### Apps  

The `apps` interface allows you to setup and manage applications associated with the product:  

- `connect(app_tag)`: Creates an access tag to connect an existing app.  
- `add(app)`: Adds a new app to the product.  
- `fetchAll()`: Retrieves all apps linked to the product.  
- `fetch(tag)`: Retrieves details of a specific app.  
- `update(accessTag, data)`: Updates an app’s details.  
- `webhook.register(access_tag)`: Registers a webhook for an app.  
- `webhook.fetchAppWebhooks(access_tag)`: Fetches registered webhooks for an app.  

### Update Validation  

- `updateValidation(tag, update)`: Updates data validation rules for product components.  

### Environments  

The `environments` interface allows you to setup and manage environments configurations associated with the product: 

- `create(data)`: Creates a new environment.  
- `fetchAll()`: Retrieves all environments.  
- `fetch(slug)`: Retrieves a specific environment.  
- `update(slug, data)`: Updates an environment’s settings.  

### Storage  

The `storage` interface allows you to setup and manage storage configurations and processes associated with the product:  

- `create(data)`: Creates a storage instance.  
- `fetchAll()`: Retrieves all storage instances.  
- `fetch(tag)`: Retrieves a specific storage instance.  
- `update(tag, data)`: Updates a storage instance.  

### Cloud Functions  

The `cloudFunctions` interface allows you to setup and manage cloud functions associated with the product: 

- `create(data)`: Creates a cloud function.  
- `fetchAll()`: Retrieves all cloud functions.  
- `fetch(tag)`: Retrieves a specific cloud function.  
- `update(tag, data)`: Updates a cloud function.  

### Message Brokers  

The `messageBroker` interface allows you to setup and manage messageBrokers, queues and events associated with the product: 

- `create(data)`: Creates a new message broker.  
- `fetchAll()`: Retrieves all message brokers.  
- `fetch(tag)`: Retrieves a specific message broker.  
- `update(tag, data)`: Updates a message broker.  

### Notifications  

The `notifications` interface allows you to setup and manage notification configurations associated with the product:  

- `create(data)`: Creates a notification.  
- `fetchAll()`: Retrieves all notifications.  
- `fetch(tag)`: Retrieves a specific notification.  
- `update(tag, data)`: Updates a notification.  

#### Notification Messages  

The `notifications.messages` interface allows you to setup and manage notification messages configurations and templates associated with each notification setup:

- `messages.create(data)`: Creates a notification message.  
- `messages.fetchAll(notificationTag)`: Retrieves all messages for a notification.  
- `messages.fetch(tag)`: Retrieves a specific notification message.  
- `messages.update(tag, data)`: Updates a notification message.  

### Databases  

The `databases` interface allows you to setup and manage database configurations associated with the product:  

- `create(data)`: Creates a new database.  
- `fetchAll()`: Retrieves all databases.  
- `fetch(tag)`: Retrieves a specific database.  
- `update(tag, data)`: Updates a database.  

#### Database Actions  

The `databases.actions` interface allows you to setup and manage reusable CRUD actions of individual databases operating within the product:

- `actions.create(data)`: Creates a database action.  
- `actions.fetchAll(databaseTag)`: Retrieves all actions for a database.  
- `actions.fetch(tag)`: Retrieves a specific database action.  
- `actions.update(tag, data)`: Updates a database action.  

### Jobs  

The `jobs` interface allows you to setup and manage background jobs associated with the product:

- `create(data)`: Creates a new job.  
- `fetchAll()`: Retrieves all jobs.  
- `fetch(tag)`: Retrieves a specific job.  
- `update(tag, data)`: Updates a job.  

### Caches  

The `jobs` interface allows you to setup and manage data caches within the product:

- `create(data)`: Creates a new cache instance.  
- `fetchAll()`: Retrieves all cache instances.  
- `fetch(tag)`: Retrieves a specific cache instance.  
- `update(tag, data)`: Updates a cache instance.  

### Features  

The `jobs` interface allows you to setup and manage features and workflows within the product:

- `create(data)`: Creates a new feature.  
- `fetchAll()`: Retrieves all features.  
- `fetch(tag)`: Retrieves a specific feature.  
- `update(tag, data)`: Updates a feature.  

## Summary  

By initializing a product instance, you gain access to the `productBuilder` interface, which enables seamless management of apps, environments, storage, cloud functions, notifications, databases, jobs, caches, and features within the product. 