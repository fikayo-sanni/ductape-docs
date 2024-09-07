---
sidebar_position: 2
---

# Create Product

To create a product you need use the product builder interface's `createProduct` function

``` typescript

import Ductape from 'ductape'; // import ductape sdk

const credentials = { // initialize ductape credentials
    user_id: process.env.DUCTAPE_USER_ID,
    workspace_id: process.env.DUCTAPE_WORKSPACE_ID,
    private_key: process.env.DUCTAPE_PRIVATE_KEY
};

const ductape = new Ductape(credentials); // initialize ductape sdk

const productBuilder = await ductape.getProductBuilder(); // initialize product builder

const details = {
    name: "Product Name",
    description: "You can add a product description here",
}

const integration = await ductape.createProduct(details)

```