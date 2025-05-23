---
sidebar_position: 5
---

# Executing Database Actions  

Database actions are executed using `db.execute(data)` of the `ductape.processor` interface.  

This method runs a database action within the Ductape system, handling a request based on the provided environment, product tag, and other parameters.  

## Function Signature  
```typescript
await ductape.processor.db.execute(data: IDBActionProcessorInput)
```

## Parameters  

### `IDBActionProcessorInput`  
An object containing details for executing the database action.  

#### Properties:  
- **`env`** (`string`, **required**) – The slug of the environment where the database action should run (e.g., `"dev"`, `"prd"`).  
- **`product_tag`** (`string`, **required**) – A unique identifier for the product associated with the database action.  
- **`event`** (`string`, **required**) – The tag of the database action to execute.  
- **`cache`**(`string`, **optional**) - The tag of the cache, if applicable. only to be used when caching request
- **`input`** (`IDbActionRequest`, **required**) – Contains the data and optional filter criteria for the database action.  
- **`retries`** (`number`, **optional**) – The number of retry attempts in case of failure.  

## `IDbActionRequest` Schema  
The `input` property follows the `IDbActionRequest` schema:  
```typescript
export interface IDbActionRequest {
  data: Record<string, unknown>;
  filter?: Record<string, unknown>;
}
```
- **`data`** (`Record<string, unknown>`, **required**) – The data to be used in the database action.  
- **`filter`** (`Record<string, unknown>`, **optional**) – Criteria for selecting records when applicable (e.g., for updates or deletions).  

If `filter` is empty or `undefined`, it should be set as an empty object `{}`.  

## Returns  
A `Promise<unknown>` that resolves with the result of the database action execution. The response structure depends on the specific database action being executed.  

## Example Usage  
```typescript
const data: IDBActionProcessorInput = {
  env: 'dev',
  product_tag: 'my-product',
  event: 'postgres-db-tag:update_user',
  input: {
    data: { name: 'John Doe', email: 'john@example.com' },
    filter: { userId: '123' }
  },
  retries: 2
};

const res = await ductape.processor.db.execute(data);
```