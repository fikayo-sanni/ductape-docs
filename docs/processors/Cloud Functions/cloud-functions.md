---
sidebar_position: 6
---

# Invoking Cloud Functions  

Cloud functions are invoked using `cloudFunction.invoke(data)` of the `ductape.processor` interface.  

This method triggers a cloud function within the Ductape system, handling a request based on the provided environment, product tag, and other parameters.  

## Function Signature

```typescript
await ductape.processor.cloudFunction.invoke(data: IFunctionProcessorInput)
```

## Parameters  

### `IFunctionProcessorInput`  
An object containing details for invoking the cloud function.  

#### Properties:  
- **`env`** (`string`, **required**) – The slug of the environment where the cloud function should run (e.g., `"dev"`, `"prd"`).  
- **`product_tag`** (`string`, **required**) – A unique identifier for the product associated with the cloud function.  
- **`event`** (`string`, **required**) – The tag of the cloud function to invoke.  
- **`input`** (`IFunctionRequest`, **required**) – Contains a `payload` object with the cloud function arguments in JSON format.  
- **`retries`** (`number`, **optional**) – The number of retry attempts in case of failure.  

## `IFunctionRequest` Schema  
The `input` property follows the `IFunctionRequest` schema: 

```typescript
export interface IFunctionRequest {
  payload: Record<string, any>;
}
```
- **`payload`** (`Record<string, any>`, **required**) – The cloud function arguments.  

If `payload` is empty or `undefined`, it should be set as an empty object `{}`.  

## Returns  
A `Promise<unknown>` that resolves with the result of the cloud function invocation. The response structure depends on the specific cloud function being invoked.  

## Example Usage

```typescript
const data: IFunctionProcessorInput = {
  env: 'dev',
  product_tag: 'my-product',
  event: 'calculate_discount',
  input: {
    payload: { 
        discountCode: 'SUMMER50',
        userId: '123',
        cartTotal: 100
    }
  },
  retries: 2
};

const res = await ductape.processor.cloudFunction.invoke(data);
```