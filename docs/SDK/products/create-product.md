---
sidebar_position: 2
---

# Create Product

To create a product you need use the product builder interface's `createProduct` function

``` typescript

import ductape from './ductapeClient';

const details = {
    name: "Product Name",
    description: "You can add a product description here",
}

const product = await ductape.product.create(details)

```