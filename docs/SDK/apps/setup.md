---
sidebar_position: 2
---

# Importing Actions

To get started, you need to import your app actions, actions are individual endpoints that perform a piece of functionality. E.G send money from one user to another. You can import your Actions from an existing API documentation from the following source

- **Postman V2.1**
- **Postman V2.0** *currently unavailable*
- **OpenApi 3.0** *currently unavailable*

## Importing Postman V2.1

To import Postman V2.1 docs

```typescript

import Ductape from 'ductape';
import postmanV21 from './postman_docs_v2.1'; //  json file containing exported postman documentation

const credentials = {
    user_id: process.env.DUCTAPE_USER_ID,
    workspace_id: process.env.DUCTAPE_WORKSPACE_ID,
    private_key: process.env.DUCTAPE_PRIVATE_KEY
};

const ductape = new Ductape(credentials);

const importer = await ductape.getActionImporter();

await importer.importPostmanV21(postmanV21, true);
```

For more information about the Action Importer and the importPostmanV21 function, check our glossary


## Importing Postman V2.0

To import Postman V2.0 docs *currently unavailable*

```typescript

import Ductape from 'ductape';
import postmanV20 from './postman_docs_v2.0'; //  json file containing exported postman documentation

const credentials = {
    user_id: process.env.DUCTAPE_USER_ID,
    workspace_id: process.env.DUCTAPE_WORKSPACE_ID,
    private_key: process.env.DUCTAPE_PRIVATE_KEY
};

const ductape = new Ductape(credentials);

const importer = await ductape.getActionImporter();

await importer.importPostmanV20(postmanV20, true);
```

For more information about the Action Importer and the importPostmanV21 function, check our glossary

## Importing OpenApi 3.0

To import OpenApi 3.0 *currently unavailable*

```typescript

import Ductape from 'ductape';
import openApi30 from './open_api_3.0'; //  json file containing exported open api documentation

const credentials = {
    user_id: process.env.DUCTAPE_USER_ID,
    workspace_id: process.env.DUCTAPE_WORKSPACE_ID,
    private_key: process.env.DUCTAPE_PRIVATE_KEY
};

const ductape = new Ductape(credentials);

const importer = await ductape.getActionImporter();

await importer.importOpenApi30(openApi30, true);
```

For more information about the Action Importer and the importPostmanV21 function, check our glossary