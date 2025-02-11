---
sidebar_position: 4
---

# Processor Inputs  

This glossary provides a detailed reference for all processor input interfaces used within the `ductape.processor` system.  

## IJobProcessorInput  
Represents a general job processor request. It can handle multiple types of inputs, such as database actions, function execution, notifications, and storage tasks.  

```typescript
export interface IJobProcessorInput {
  env: string;
  product_tag: string;
  app?: string;
  input: IActionRequest | INotificationRequest | IDbActionRequest | IFunctionRequest | IStorageRequest | Record<string, unknown>;
  event: string;
}
```
### Properties:  
- **env** (`string`, **required**) – Environment where the job should be executed (e.g., `"dev"`, `"prd"`).  
- **product_tag** (`string`, **required**) – Unique identifier for the product associated with the job.  
- **event** (`string`, **required**) – The tag of the job event to be triggered.  
- **app** (`string`, **optional**) – The name of the application related to the job.  
- **input** (`object`, **required**) – The job input data, which can be one of multiple specific request types.  

---

## IFunctionProcessorInput  
Represents a request for invoking a cloud function.  

```typescript
export interface IFunctionProcessorInput {
  env: string;
  product_tag: string;
  input: IFunctionRequest;
  event: string;
  retries?: number;
}
```
### Properties:  
- **env** (`string`, **required**) – Execution environment.  
- **product_tag** (`string`, **required**) – Product identifier.  
- **event** (`string`, **required**) – Function event tag.  
- **input** (`IFunctionRequest`, **required**) – Function request data.  
- **retries** (`number`, **optional**) – Number of retry attempts in case of failure.  

#### IFunctionRequest  
```typescript
export interface IFunctionRequest extends IActionRequest {
  payload: Record<string, any>;
}
```
- **payload** (`Record<string, any>`, **required**) – Additional input data for the function.  

---

## IDBActionProcessorInput  
Represents a request for performing database actions.  

```typescript
export interface IDBActionProcessorInput {
  env: string;
  product_tag: string;
  input: IDbActionRequest;
  event: string;
  retries?: number;
}
```
### Properties:  
- **env** (`string`, **required**) – Execution environment.  
- **product_tag** (`string`, **required**) – Product identifier.  
- **event** (`string`, **required**) – Database action event tag.  
- **input** (`IDbActionRequest`, **required**) – Database request data.  
- **retries** (`number`, **optional**) – Number of retry attempts in case of failure.  

#### IDbActionRequest  
```typescript
export interface IDbActionRequest {
  data: Record<string, unknown>;
  filter?: Record<string, unknown>;
}
```
- **data** (`Record<string, unknown>`, **required**) – Data to be inserted, updated, or deleted.  
- **filter** (`Record<string, unknown>`, **optional**) – Conditions for selecting records.  

---

## IProcessorInput  
Represents a request for running a feature processor.  

```typescript
export interface IProcessorInput {
  product_tag: string;
  env: string;
  input: Record<string, unknown>;
  feature_tag: string;
}
```
### Properties:  
- **env** (`string`, **required**) – Execution environment.  
- **product_tag** (`string`, **required**) – Product identifier.  
- **feature_tag** (`string`, **required**) – Feature event tag.  
- **input** (`Record<string, unknown>`, **required**) – Input parameters.  

---

## IStorageProcessorInput  
Represents a request for performing storage operations.  

```typescript
export interface IStorageProcessorInput {
  env: string;
  product_tag: string;
  app?: string;
  input: IStorageRequest;
  event: string;
  retries?: number;
}
```
### Properties:  
- **env** (`string`, **required**) – Execution environment.  
- **product_tag** (`string`, **required**) – Product identifier.  
- **event** (`string`, **required**) – Storage event tag.  
- **app** (`string`, **optional**) – Application name.  
- **input** (`IStorageRequest`, **required**) – Storage request data.  
- **retries** (`number`, **optional**) – Number of retry attempts in case of failure.  

#### IStorageRequest  
```typescript
export interface IStorageRequest {
  blob: Blob;
  mimeType?: string;
}
```
- **blob** (`Blob`, **required**) – File data to be stored.  
- **mimeType** (`string`, **optional**) – MIME type of the file.  

---

## INotificationProcessorInput  
Represents a request for sending notifications.  

```typescript
export interface INotificationProcessorInput {
  env: string;
  product_tag: string;
  input: INotificationRequest;
  event: string;
  retries?: number;
}
```
### Properties:  
- **env** (`string`, **required**) – Execution environment.  
- **product_tag** (`string`, **required**) – Product identifier.  
- **event** (`string`, **required**) – Notification event tag.  
- **input** (`INotificationRequest`, **required**) – Notification request data.  
- **retries** (`number`, **optional**) – Number of retry attempts in case of failure.  

#### INotificationRequest  
```typescript
export interface INotificationRequest extends IActionRequest {
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
- **slug** (`string`, **required**) – Unique identifier for the notification.  
- **push_notification** (`object`, **required**) – Push notification details.  
- **email** (`object`, **optional**) – Email details.  
- **callback** (`object`, **optional**) – Callback request details.  