---
sidebar_position: 2
---

# Processing Actions  

Processing actions is done using `action.run(data)` of the `ductape.processor` interface.  

It executes an action processor within the Ductape system, handling an action request based on the provided environment, product tag, and other parameters.  

## Function Signature  
```typescript
await ductape.processor.action.run(data: IActionProcessorInput)
```

## Parameters  

### `IActionProcessorInput`  
An object containing details for executing the action processor.  

#### Properties:  
- **`env`** (`string`, **required**) – The slug of the environment in which the action should be executed (e.g., `"dev"`, `"prd"`).  
- **`product_tag`** (`string`, **required**) – A unique identifier for the product associated with the action.  
- **`app`** (`string`, **required**) – The **`access_tag`** of the application associated with the action.  
- **`event`** (`string`, **required**) – The tag of the action to be triggered.  
- **`input`** (`IActionRequest`, **required**) – The input request data containing query parameters, request body, headers, and other relevant input values.  
- **`retries`** (`number`, **optional**) – The number of retry attempts in case of failure.  

## `IActionRequest` Schema  
The `input` property follows the `IActionRequest` schema:  
```typescript
export interface IActionRequest {
  query?: Record<string, unknown>;
  params?: Record<string, unknown>;
  body?: Record<string, unknown>;
  headers?: Record<string, unknown>;
}
```
- **`query`** (`Record<string, unknown>`, **optional**) – Query parameters from the request.  
- **`params`** (`Record<string, unknown>`, **optional**) – Route parameters.  
- **`body`** (`Record<string, unknown>`, **optional**) – The request body.  
- **`headers`** (`Record<string, unknown>`, **optional**) – Request headers.  

If any of the above fields are empty or `undefined`, they should be set as an empty object `{}`.  

## Returns  
A `Promise<unknown>` that resolves with the result of the action execution. The response structure depends on the specific action being processed.  

## Example Usage  
```typescript
const data: IActionProcessorInput = {
  env: 'dev',
  product_tag: 'my-product',
  app: access_tag,
  event: 'user.signup',
  input: {
    query: { userId: '123' },
    body: { email: 'user@example.com' },
    headers: { Authorization: '$Auth{token_access}{token}' },
    params: {}
  },
  retries: 3
};

const res = await ductape.processor.action.run(data);
```