---
sidebar_position: 2
---

# File Reading

The `readFile` function reads the contents of a file from the specified path, encodes the file content as a base64 string, and returns essential file metadata, including the file's MIME type and name.  

This function is useful for processing files before uploading them to storage, ensuring that files are properly handled with necessary metadata.

## Function Signature  
```typescript
await ductape.processor.storage.readFile(path: string): Promise<IFileReadResult>
```

## Parameters  

### `path`  
A `string` representing the path of the file to be read. This is **required**.

## Returns  
A `IFileReadResult` that resolves with the following object:

### `IFileReadResult` Schema  
```typescript
interface IFileReadResult {
  buffer: string;        // The file content encoded as a base64 string
  fileName: string;      // The name of the file
  mimeType: string;      // The MIME type of the file
}
```

- **`buffer`** (`string`) – The base64-encoded content of the file.
- **`fileName`** (`string`) – The name of the file, extracted from the file path.
- **`mimeType`** (`string`) – The MIME type of the file, inferred from its extension or returned as an empty string if the MIME type cannot be determined.

If the MIME type cannot be identified, an empty string is returned. This can be helpful for handling files where the type is unknown or cannot be reliably determined.

## Example Usage  
```typescript
const filePath = 'path/to/file.txt';
const { buffer, fileName, mimeType } = await ductape.processor.storage.readFile(filePath);

const data: IStorageProcessorInput = {
  env: "dev",
  product_tag: "my-product",
  event: "upload_file",
  input: {
    buffer,
    mimeType
  },
  retries: 2
};

const res = await ductape.processor.storage.run(data);
```

## Error Handling  
If an error occurs during the file reading process (such as the file not existing or being inaccessible), the function will log the error and throw it. This allows you to handle the error further up the stack as needed.

