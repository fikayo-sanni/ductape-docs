---
sidebar_position: 3
---

# Create Product Instance

You can create a reusable product instance which can be used for interacting with the productBuilder interface

```typescript
import Ductape from 'ductape'; // import ductape sdk

const credentials = { // initialize ductape credentials
    user_id: process.env.DUCTAPE_USER_ID,
    workspace_id: process.env.DUCTAPE_WORKSPACE_ID,
    private_key: process.env.DUCTAPE_PRIVATE_KEY
};

const product_tag = process.env.DUCTAPE_PRODUCT_TAG // assumes you've stored the PRODUCT_TAG in the .env

const ductape = new Ductape(credentials); // initialize ductape sdk

const productBuilder = await ductape.getProductBuilder(); // initialize productBuilder

export const product = await appBuilder.initializeProductByTag(product_tag); // fetch product instance by id

```

This provides an interface to the appBuilder class and makes it available 