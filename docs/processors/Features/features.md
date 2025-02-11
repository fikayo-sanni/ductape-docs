---
sidebar_position: 1
---

# Processing Features

Feature processing is done using `feature.run(data)` of the `ductape.processor` interface.  

This method triggers and executes a feature processor within the Ductape system, handling a feature request based on the provided environment, product tag, and other parameters.  

## Function Signature  
```typescript
await ductape.processor.feature.run(data: IProcessorInput)
```

## Parameters  

### `IProcessorInput`  
An object containing details for executing the feature processor.  

#### Properties:  
- **`product_tag`** (`string`, **required**) – A unique identifier for the product associated with the feature.  
- **`env`** (`string`, **required**) – The slug of the environment where the feature should be processed (e.g., `"dev"`, `"prd"`).  
- **`feature_tag`** (`string`, **required**) – The tag of the feature to be executed.  
- **`input`** (`Record<string, unknown>`, **required**) – A JSON object containing the feature-specific input parameters.  

If `input` is empty or `undefined`, it should be set as an empty object `{}`.  

## Returns  
A `Promise<unknown>` that resolves with the result of the feature execution. The response structure depends on the specific feature being processed.  

## Example Usage  
```typescript
import { ductape } from 'ductape-sdk';

const data: IProcessorInput = {
  product_tag: "my-product",
  env: "prd",
  feature_tag: "deploy_auction_and_bid",
  input: {
    time: 5000,
    beneficiary: "0xe48f2E87f5535ABE82b499E2a501Ce207231cEdA",
    amount: 40
  }
};

const res = await ductape.processor.feature.run(data);
```