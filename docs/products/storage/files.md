---
sidebar_position: 3
---

# Fetching Files

To fetch files that have been priorly uploaded, you need to call the `ductape.storage.files` function.  

This function allows you to retrieve a paginated list of files previously uploaded within your workspace, filtered by optional parameters.



## Input

| Field       | Type   | Required | Default | Description |
|:------------|:---------|:------------|:---------|:----------------|
| `page`      | `number`  | No         | `0`      | The page number to fetch. Starts from 0. |
| `limit`     | `number`  | No         | `20`     | Number of results per page. |
| `event`     | `string`  | Yes         | null   | required storage tag of bucket you want to look up. |


## Output

The data returned is an array of file metadata objects with the following structure:

| Field         | Type     | Description |
|:---------------|:------------|:----------------|
| `url`          | `string`     | The public or signed URL for accessing the file. |
| `workspace_id` | `string`     | The workspace this file belongs to. |
| `type`         | `string`     | The file type category. |
| `product`      | `string`     | The product the file is associated with. |
| `provider`     | `string`     | The cloud storage provider used for this file. E.G **gcp, azure, aws**. |
| `process_id`   | `string`     | The process run identifier this file was uploaded within. |
| `event`        | `string`     | The event that triggered this file upload (if any). |
| `env`          | `string`     | The environment this file was uploaded in. From your environments. |
| `size`         | `number`     | The file size in bytes. |