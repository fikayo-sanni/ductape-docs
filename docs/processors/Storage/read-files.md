---
sidebar_position: 2
---

# File Reading

The `readFile` function reads the contents of a file from a specified path, encodes the file content as a base64 string, and returns essential metadata such as the file name and MIME type.

This function is useful for preparing files before uploading them to storage or processing them within the Ductape system.

## Usage

```ts
await ductape.processor.storage.readFile(path: string): Promise<IFileReadResult>
````

## Input

| Parameter | Type     | Required | Description                  |
| --------- | -------- | -------- | ---------------------------- |
| `path`    | `string` | ✅ Yes    | File path to read from disk. |

## Output

Returns a promise resolving with an object of type `IFileReadResult`:

```ts
interface IFileReadResult {
  buffer: string;    // Base64-encoded file content
  fileName: string;  // File name extracted from the path
  mimeType: string;  // MIME type inferred from the file extension (empty string if unknown)
}
```

| Property   | Type     | Description                                                             |
| ---------- | -------- | ----------------------------------------------------------------------- |
| `buffer`   | `string` | Base64-encoded content of the file.                                     |
| `fileName` | `string` | Name of the file extracted from the path.                               |
| `mimeType` | `string` | MIME type inferred from the file extension, or empty string if unknown. |

## Example Usage

```ts
import { ductape } from '@ductape/sdk';

const filePath = 'path/to/file.txt';
const { buffer, fileName, mimeType } = await ductape.processor.storage.readFile(filePath);

const data = {
  env: "dev",
  product_tag: "my-product",
  event: "upload_file",
  input: {
    buffer,
    mimeType,
  },
  retries: 2,
};

const res = await ductape.processor.storage.run(data);
```

## Error Handling

If the file cannot be read (e.g., file does not exist or is inaccessible), the function will log the error and throw it. You should handle these errors appropriately in your application logic.
