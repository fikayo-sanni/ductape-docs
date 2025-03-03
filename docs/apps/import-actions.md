---
sidebar_position: 3
---

# Importing Actions

To get started, you need to import your app actions. Actions are individual endpoints that perform specific functions (e.g., sending money from one user to another). You can import your actions from existing API documentation from the following sources:

- **Postman V2.1**
- **Postman V2.0** (*currently unavailable*)
- **OpenAPI 3.0** (*currently unavailable*)

## Importing Actions

To import actions into an existing app

```typescript
import { ImportDocTypes } from "ductape-sdk/types"

const file: Buffer = ""// file buffer or blob here
const appTag = "app_tag"
await ductape.app.actions.import({ file, type: ImportDocTypes.postmanV21, appTag });
```

To import and create a new app

```typescript
import { ImportDocTypes } from "ductape-sdk/types"

const file: Buffer = ""// file buffer or blob here
await ductape.app.actions.import({ file, type: ImportDocTypes.postmanV21 });
```