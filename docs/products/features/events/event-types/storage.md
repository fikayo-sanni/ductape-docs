---
sidebar_position: 6
---

# Storage

Storage events in Ductape are used to handle file or blob storage operations, such as uploading files to cloud storage providers (AWS S3, GCP, Azure, etc.). They enable your feature to store, retrieve, or process files as part of an event sequence.

## What is a Storage Event?

A storage event is defined using the `IFeatureEvent` type from the SDK, with `type` set to `FeatureEventTypes.STORAGE`. The input should match the `IStorageRequest` interface, specifying the file buffer, file name, and optional MIME type.

## IFeatureEvent Structure (Storage)

```typescript
interface IFeatureEvent {
  type: FeatureEventTypes;         // Required: Should be FeatureEventTypes.STORAGE
  event: string;                  // Required: The tag of the storage resource to use
  input: {
    buffer: string;               // Required: File data as a base64-encoded string
    fileName: string;             // Required: Name of the file to store
    mimeType?: string;            // Optional: MIME type of the file
  };
  retries: number;                // Required: Number of retry attempts if the storage operation fails
  allow_fail: boolean;            // Required: Whether the event can fail without affecting the overall sequence
  // ...other optional fields
}
```

## Properties

| Property     | Type                      | Required | Description                                                                                       |
|--------------|---------------------------|----------|---------------------------------------------------------------------------------------------------|
| `type`       | `FeatureEventTypes`       | Yes      | Should be `FeatureEventTypes.STORAGE`.                                                            |
| `event`      | `string`                  | Yes      | The tag of the storage resource to use.                                                           |
| `input`      | `{ buffer, fileName, mimeType? }` | Yes | File data and metadata for the storage operation.                                                  |
| `retries`    | `number`                  | Yes      | Number of retry attempts allowed if the storage operation fails.                                   |
| `allow_fail` | `boolean`                 | Yes      | Whether the event can fail without affecting the overall sequence.                                 |

## Example: Storage Event

```typescript
const uploadFileEvent: IFeatureEvent = {
  type: FeatureEventTypes.STORAGE,
  event: 'user_files',
  input: {
    buffer: '$Input{file_buffer}',
    fileName: '$Input{file_name}',
    mimeType: '$Input{mime_type}',
  },
  retries: 2,
  allow_fail: false,
};
```

## Best Practices
- Use storage events for file uploads, downloads, or processing as part of your feature workflow.
- Ensure the buffer is a valid base64-encoded string and the fileName is unique if needed.
- Set `retries` and `allow_fail` thoughtfully to control error handling and resilience.
- Document the purpose and expected result of each storage event for maintainability.

## See Also
- [Features Overview](../../../getting-started.md)
- [Event Types Overview](/category/event-types)
- [Data Piping](../data-piping.md) 