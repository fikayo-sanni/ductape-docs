---
sidebar_position: 2
---

# Managing Products


## Creating a Product

To create a product you need use the product builder interface's `create` function

``` typescript

import ductape from './ductapeClient';

const details = {
    name: "Product Name",
    description: "You can add a product description here",
}

const product = await ductape.product.create(details)

```

## Updating a Product

To update a product you need use the product builder interface's `update` function

``` typescript
import ductape from './ductapeClient';

const tag = "product_tag";

const details = {
    description: "You can add a product description here",
}

const product = await ductape.product.update(tag, details)

```

## Fetching a Product

To fetch a product by tag you need use the product builder interface's `fetch` function

``` typescript
import ductape from './ductapeClient';

const tag = "product_tag";

const product = await ductape.product.fetch(tag)
```