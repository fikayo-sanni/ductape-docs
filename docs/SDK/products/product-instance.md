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

## Product Management Interface  

### Apps  

The `apps` interface allows you to setup and manage applications associated with the product:  

- `connect(app_tag: string)`: Creates an access tag to connect an existing app.  
- `add(app: IProductApp)`: Adds a new app to the product.  
- `fetchAll()`: Retrieves all apps linked to the product.  
- `fetch(tag: string)`: Retrieves details of a specific app.  
- `update(accessTag: string, data: Partial<IProductApp>)`: Updates an app’s details.  
- `webhook.register(access_tag: string)`: Registers a webhook for an app.  
- `webhook.fetchAppWebhooks(access_tag: string)`: Fetches registered webhooks for an app.  

### Update Validation  

- `updateValidation(tag, update)`: Updates data validation rules for product components.  

### Environments  

The `environments` interface allows you to setup and manage environments configurations associated with the product: 

- `create(data: IProductEnv)`: Creates a new environment.  
- `fetchAll()`: Retrieves all environments.  
- `fetch(slug: string)`: Retrieves a specific environment.  
- `update(slug: string, data: Partial<IProductEnv>)`: Updates an environment’s settings.  

### Storage  

The `storage` interface allows you to setup and manage storage configurations and processes associated with the product:  

- `create(data: IProductStorage)`: Creates a storage instance.  
- `fetchAll()`: Retrieves all storage instances.  
- `fetch(tag: string)`: Retrieves a specific storage instance.  
- `update(tag: string, data: Partial<IProductStorage>)`: Updates a storage instance.  

### Cloud Functions  

The `cloudFunctions` interface allows you to setup and manage cloud functions associated with the product: 

- `create(data: IProductStorage)`: Creates a cloud function.  
- `fetchAll()`: Retrieves all cloud functions.  
- `fetch(tag)`: Retrieves a specific cloud function.  
- `update(tag, data: Partial<IProductStorage>)`: Updates a cloud function.  

### Message Brokers  

The `messageBroker` interface allows you to setup and manage messageBrokers, queues and events associated with the product: 

- `create(data: IProductMessageBroker)`: Creates a new message broker.  
- `fetchAll()`: Retrieves all message brokers.  
- `fetch(tag: string)`: Retrieves a specific message broker.  
- `update(tag: string, data: Partial<IProductMessageBroker>)`: Updates a message broker.  

### Notifications  

The `notifications` interface allows you to setup and manage notification configurations associated with the product:  

- `create(data: IProductNotification)`: Creates a notification.  
- `fetchAll()`: Retrieves all notifications.  
- `fetch(tag: string)`: Retrieves a specific notification.  
- `update(tag: string, data: Partial<IProductNotification>)`: Updates a notification.  

#### Notification Messages  

The `notifications.messages` interface allows you to setup and manage notification messages configurations and templates associated with each notification setup:

- `messages.create(data: IProductNotificationTemplate)`: Creates a notification message.  
- `messages.fetchAll(notificationTag: string)`: Retrieves all messages for a notification.  
- `messages.fetch(tag: string)`: Retrieves a specific notification message.  
- `messages.update(tag: string, data: Partial<IProductNotificationTemplate>)`: Updates a notification message.  

### Databases  

The `databases` interface allows you to setup and manage database configurations associated with the product:  

- `create(data: IProductDatabase)`: Creates a new database.  
- `fetchAll()`: Retrieves all databases.  
- `fetch(tag: string)`: Retrieves a specific database.  
- `update(tag: string, data: Partial<IProductDatabase>)`: Updates a database.  

#### Database Actions  

The `databases.actions` interface allows you to setup and manage reusable CRUD actions of individual databases operating within the product:

- `actions.create(data: IProductDatabaseAction)`: Creates a database action.  
- `actions.fetchAll(databaseTag: string)`: Retrieves all actions for a database.  
- `actions.fetch(tag: string)`: Retrieves a specific database action.  
- `actions.update(tag: string, data: IProductDatabaseAction)`: Updates a database action.  

### Jobs  

The `jobs` interface allows you to setup and manage background jobs associated with the product:

- `create(data: IProductJobs)`: Creates a new job.  
- `fetchAll()`: Retrieves all jobs.  
- `fetch(tag: string)`: Retrieves a specific job.  
- `update(tag: string, data: Partial<IProductJobs>)`: Updates a job.  

### Caches  

The `jobs` interface allows you to setup and manage data caches within the product:

- `create(data: IProductCache)`: Creates a new cache instance.  
- `fetchAll()`: Retrieves all cache instances.  
- `fetch(tag: string)`: Retrieves a specific cache instance.  
- `update(tag: string, data: Partial<IProductCache>)`: Updates a cache instance.  

### Features  

The `features` interface allows you to setup and manage features and workflows within the product:

- `create(data: IProductFeature)`: Creates a new feature.  
- `fetchAll()`: Retrieves all features.  
- `fetch(tag: string)`: Retrieves a specific feature.  
- `update(tag: string, data: Partial<IProductFeature>)`: Updates a feature.  

## Summary  

By initializing a product instance, you gain access to the `ProductBuilder` interface, which enables seamless management of apps, environments, storage, cloud functions, notifications, databases, jobs, caches, and features within the product. 