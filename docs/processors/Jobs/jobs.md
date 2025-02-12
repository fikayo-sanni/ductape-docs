---
sidebar_position: 5
---

# Scheduling Jobs

Scheduling jobs is done using `job.schedule(data)` of the `ductape.processor` interface.  

This method allows for scheduling and executing various types of background jobs within the Ductape system, including function execution, database operations, notifications, and storage tasks.  

## Function Signature  
```typescript
await ductape.processor.job.schedule(data: IJobProcessorInput)
```

## Parameters  

### `IJobProcessorInput`  
An object containing details for executing a job processor.  

#### Properties:  
- **`env`** (`string`, **required**) – The slug of the environment where the job should be executed (e.g., `"dev"`, `"prd"`).  
- **`product_tag`** (`string`, **required**) – A unique identifier for the product associated with the job.  
- **`event`** (`string`, **required**) – The tag of the job event to be triggered.  
- **`app`** (`string`, **optional**) – The name of the application that the job is related to.  
- **`input`** (`object`, **required**) – The job input data, which can be one of the following types:  
  - `IActionRequest`- When job schedules an app action
  - `INotificationRequest`- When job schedules a notification  
  - `IDbActionRequest` - When job schedules a database action
  - `IFunctionRequest` - When job schedules a cloud function call
  - `IStorageRequest` - When job schedules file storage
  - `Record<string, unknown>` - When job schedules a feature
- **start_at** (`number`, **required**) - Unix timestamp of what time to start the job. Set to 0 to start immediately


## Returns  
A `Promise<unknown>` that resolves with the result of the job execution. The response structure depends on the specific job being processed.  

## Example Usage  
```typescript
import { ductape } from 'ductape-sdk';

const data: IJobProcessorInput = {
  env: "prd",
  product_tag: "my-product",
  event: "send_notification",
  input: {
    slug: "order_update",
    push_notification: {
      title: { en: "Order Shipped" },
      body: { en: "Your order #12345 has been shipped!" },
      data: { trackingId: "XYZ987" },
      device_token: "abcdef123456"
    }
  },
  start_at: 198766789,
};

const res = await ductape.processor.job.schedule(data);
``` 