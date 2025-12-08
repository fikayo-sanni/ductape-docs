---
sidebar_position: 3
---

# Importing Actions

Actions are individual endpoints that perform specific functions (e.g., sending money from one user to another). You can import your actions from existing API documentation from the following sources:

- **Postman V2.1**
- **Postman V2.0** (*currently unavailable*)
- **OpenAPI 3.0** (*currently unavailable*)

## Importing Actions into an Existing App

```ts
import { ImportDocTypes } from "@ductape/sdk/types"

const file: Buffer = "" // file buffer or blob here
const app = "app"
await ductape.actions.import({ file, type: ImportDocTypes.postmanV21, app });
```

## Importing Actions and Creating a New App

```ts
import { ImportDocTypes } from "@ductape/sdk/types"

const file: Buffer = "" // file buffer or blob here
await ductape.actions.import({ file, type: ImportDocTypes.postmanV21 });
```

## See Also

* [Managing Actions](./update-action.md)
* [Getting Started with Apps](./getting-started.md)