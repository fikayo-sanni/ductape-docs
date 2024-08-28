---
sidebar_position: 3
---

# Create an App Instance

You can create a reusable app instance which can be used for interacting with the app interface

```typescript
import Ductape from 'ductape'; // import ductape sdk
import { app } from "app-instance" // app instance file 

const credentials = { // initialize ductape credentials
    user_id: process.env.DUCTAPE_USER_ID,
    workspace_id: process.env.DUCTAPE_WORKSPACE_ID,
    private_key: process.env.DUCTAPE_PRIVATE_KEY
};

const app_tag = process.env.DUCTAPE_APP_TAG // assumes you've stored the APP_TAG in the 

const ductape = new Ductape(credentials); // initialize ductape sdk

const appBuilder = await ductape.getAppBuilder(); // initialize appBuilder

export const app = await appBuilder.initializeAppByTag(app_tag); // fetch  app instance by id

```

This provides an interface to the appBuilder class and makes it available 