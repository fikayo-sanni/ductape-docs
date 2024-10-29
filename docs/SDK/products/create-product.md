---
sidebar_position: 2
---

# Create Product

To create a product you need use the product builder interface's `createProduct` function

``` typescript

// ... ductape instance

const productBuilder = await ductape.getProductBuilder(); // initialize product builder

const details = {
    name: "Product Name",
    description: "You can add a product description here",
}

const product = await productBuilder.createProduct(details)

```