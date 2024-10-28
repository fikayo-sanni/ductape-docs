---
sidebar_position: 2
---

# Import Actions

To get started, you need to import your app actions. Actions are individual endpoints that perform specific functions (e.g., sending money from one user to another). You can import your actions from existing API documentation from the following sources:

- **Postman V2.1**
- **Postman V2.0** (*currently unavailable*)
- **OpenAPI 3.0** (*currently unavailable*)

## Importing Postman V2.1

To import Postman V2.1 documentation:

```typescript

import postmanV21 from './postman_docs_v2.1'; // JSON file containing exported Postman documentation

// ... Ductape instance

const importer = await ductape.getActionImporter();

await importer.importPostmanV21(postmanV21, true);
```

For more details about the Action Importer and the `importPostmanV21` function, refer to our glossary.

## Importing Postman V2.0

*Currently unavailable*

```typescript
import postmanV20 from './postman_docs_v2.0'; // JSON file containing exported Postman documentation

// ... Ductape instance

const importer = await ductape.getActionImporter();

await importer.importPostmanV20(postmanV20, true);
```

For more details about the Action Importer and the `importPostmanV21` function, refer to our glossary.

## Importing OpenAPI 3.0

*Currently unavailable*

```typescript
import openApi30 from './open_api_3.0'; // JSON file containing exported OpenAPI documentation

// ... Ductape instance

const importer = await ductape.getActionImporter();

await importer.importOpenApi30(openApi30, true);

```

For more details about the Action Importer and the `importPostmanV21` function, refer to our glossary.