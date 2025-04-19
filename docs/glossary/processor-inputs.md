---
sidebar_position: 3
---

# Processor Inputs  

This glossary provides a detailed reference for all processor input interfaces used within the `ductape.processor` system.  

## IJobProcessorInput  
Represents a general job processor request. It can handle multiple types of inputs, such as database actions, function execution, notifications, and storage tasks.  

```typescript
interface IJobProcessorInput {
  env: string;
  product_tag: string;
  app?: string;
  input: IActionRequest | INotificationRequest | IDbActionRequest | IFunctionRequest | IStorageRequest | Record<string, unknown>;
  event: string;
  start_at?: number;
}
```

| Property     | Type       | Required | Description                                          |
|--------------|------------|----------|------------------------------------------------------|
| env          | string     | Yes      | Environment where the job should be executed (e.g., `"dev"`, `"prd"`). |
| product_tag  | string     | Yes      | Unique identifier for the product associated with the job. |
| app          | string     | No       | The name of the application related to the job.      |
| input        | object     | Yes      | The job input data, which can be one of multiple specific request types. |
| event        | string     | Yes      | The tag of the job event to be triggered.            |
| start_at     | number     | No       | Unix timestamp of when to start the job. Set to 0 to start immediately. |

## IFunctionProcessorInput  
Represents a request for invoking a cloud function.  

```typescript
interface IFunctionProcessorInput {
  env: string;
  product_tag: string;
  input: IFunctionRequest;
  event: string;
  retries?: number;
}
```

| Property     | Type       | Required | Description                                          |
|--------------|------------|----------|------------------------------------------------------|
| env          | string     | Yes      | Execution environment.                               |
| product_tag  | string     | Yes      | Product identifier.                                  |
| event        | string     | Yes      | Function event tag.                                  |
| input        | IFunctionRequest | Yes  | Function request data.                               |
| retries      | number     | No       | Number of retry attempts in case of failure.         |

### IFunctionRequest  
Represents the input for a function request, extending `IActionRequest`.  

```typescript
interface IFunctionRequest extends IActionRequest {
  payload: Record<string, any>;
}
```

| Property     | Type       | Required | Description                                          |
|--------------|------------|----------|------------------------------------------------------|
| payload      | object     | Yes      | Additional input data for the function.             |


## IDBActionProcessorInput  
Represents a request for performing database actions.  

```typescript
interface IDBActionProcessorInput {
  env: string;
  product_tag: string;
  input: IDbActionRequest;
  event: string;
  retries?: number;
}
```

| Property     | Type       | Required | Description                                          |
|--------------|------------|----------|------------------------------------------------------|
| env          | string     | Yes      | Execution environment.                               |
| product_tag  | string     | Yes      | Product identifier.                                  |
| event        | string     | Yes      | Database action event tag.                           |
| input        | IDbActionRequest | Yes  | Database request data.                               |
| retries      | number     | No       | Number of retry attempts in case of failure.         |


### IDbActionRequest  
Represents the request data for database actions.  

```typescript
interface IDbActionRequest {
  data: Record<string, unknown>;
  filter?: Record<string, unknown>;
}
```

| Property     | Type       | Required | Description                                          |
|--------------|------------|----------|------------------------------------------------------|
| data         | object     | Yes      | Data to be inserted, updated, or deleted.           |
| filter       | object     | No       | Conditions for selecting records.                    |

## IProcessorInput  
Represents a request for running a feature processor.  

```typescript
interface IProcessorInput {
  product_tag: string;
  env: string;
  input: Record<string, unknown>;
  feature_tag: string;
}
```

| Property     | Type       | Required | Description                                          |
|--------------|------------|----------|------------------------------------------------------|
| env          | string     | Yes      | Execution environment.                               |
| product_tag  | string     | Yes      | Product identifier.                                  |
| feature_tag  | string     | Yes      | Feature event tag.                                   |
| input        | object     | Yes      | Input parameters.                                    |

## IStorageProcessorInput  
Represents a request for performing storage operations.  

```typescript
interface IStorageProcessorInput {
  env: string;
  product_tag: string;
  app?: string;
  input: IStorageRequest;
  event: string;
  retries?: number;
}
```

| Property     | Type       | Required | Description                                          |
|--------------|------------|----------|------------------------------------------------------|
| env          | string     | Yes      | Execution environment.                               |
| product_tag  | string     | Yes      | Product identifier.                                  |
| event        | string     | Yes      | Storage event tag.                                   |
| app          | string     | No       | Application name.                                    |
| input        | IStorageRequest | Yes  | Storage request data.                                |
| retries      | number     | No       | Number of retry attempts in case of failure.         |

### IStorageRequest  
Represents the request data for storage operations.  

```typescript
interface IStorageRequest {
  buffer: Buffer;
  mimeType?: string;
  fileName?: string;
}
```

| Property     | Type       | Required | Description                                          |
|--------------|------------|----------|------------------------------------------------------|
| buffer       | Buffer     | Yes      | File data to be stored.                              |
| mimeType     | string     | No       | MIME type of the file.                               |
| fileName     | string     | No       | File name for storage.                               |

## INotificationProcessorInput  
Represents a request for sending notifications.  

```typescript
interface INotificationProcessorInput {
  env: string;
  product_tag: string;
  input: INotificationRequest;
  event: string;
  retries?: number;
}
```

| Property     | Type       | Required | Description                                          |
|--------------|------------|----------|------------------------------------------------------|
| env          | string     | Yes      | Execution environment.                               |
| product_tag  | string     | Yes      | Product identifier.                                  |
| event        | string     | Yes      | Notification event tag.                              |
| input        | INotificationRequest | Yes  | Notification request data.                           |
| retries      | number     | No       | Number of retry attempts in case of failure.         |

### INotificationRequest  
Represents the request data for sending notifications.  

```typescript
interface INotificationRequest extends IActionRequest {
  slug: string;
  push_notification: {
    title: Record<string, unknown>;
    body: Record<string, unknown>;
    data: Record<string, unknown>;
    device_token: string;
  };
  email?: {
    to: Array<string>;
    subject: Record<string, unknown>;
    template: Record<string, unknown>;
  };
  callback?: {
    query: Record<string, unknown>;
    params: Record<string, unknown>;
    body: Record<string, unknown>;
    headers: Record<string, unknown>;
  };
}
```

| Property     | Type       | Required | Description                                          |
|--------------|------------|----------|------------------------------------------------------|
| slug         | string     | Yes      | Unique identifier for the notification.              |
| push_notification | object  | Yes      | Push notification details.                           |
| email        | object     | No       | Email details.                                       |
| callback     | object     | No       | Callback request details.                            |