---
sidebar_position: 3
---

# Processing Storage  

Storage processing is done using `storage.run(data)` of the `ductape.processor` interface.  

This method uploads and processes storage-related requests within the Ductape system, handling file storage operations based on the provided environment, product tag, and other parameters.  

## Function Signature  
```typescript
await ductape.processor.storage.run(data: IStorageProcessorInput)
```

## Parameters  

### `IStorageProcessorInput`  
An object containing details for executing the storage processor.  

#### Properties:  
- **`env`** (`string`, **required**) – The slug of the environment where the storage operation should be executed (e.g., `"dev"`, `"prd"`).  
- **`product_tag`** (`string`, **required**) – A unique identifier for the product associated with the storage request.  
- **`event`** (`string`, **required**) – The tag of the storage operation to be performed.  
- **`input`** (`IStorageRequest`, **required**) – Contains the file blob and optional metadata.  
- **`retries`** (`number`, **optional**) – The number of retry attempts in case of failure.  

## `IStorageRequest` Schema  
The `input` property follows the `IStorageRequest` schema:  
```typescript
export interface IStorageRequest {
  buffer: Buffer;
  mimeType?: string;
}
```
- **`blob`** (`Blob`, **required**) – The file blob to be stored.  
- **`mimeType`** (`string`, **optional**) – The MIME type of the file, if specified.  

If `mimeType` is not provided, the system will attempt to infer it based on the file contents.  

## Returns  
A `Promise<unknown>` that resolves with the result of the storage operation. The response structure depends on the specific storage action being processed.  

## Example Usage  
```typescript
import { ductape } from 'ductape-sdk';

const {buffer, fileName, mimeType} = await ductape.processor.storage.readFile(filePath)

const data: IStorageProcessorInput = {
  env: "dev",
  product_tag: "my-product",
  event: "upload_file",
  input: {
    buffer,
    fileName,
    mimeType
  },
  retries: 2
};

const res = await ductape.processor.storage.run(data);
```