---
sidebar_position: 2
---

# Managing an App

## Creating an App

To create an app you need use the app builder interface's `create` function

``` typescript

const details = {
    name: "App Name",
    description: "You can add a product description here",
}

const product = await ductape.app.create(details)

```

## Updating an App

To update a product you need use the product builder interface's `update` function

``` typescript

const tag = "product_tag";

const details = {
    description: "You can add a product description here",
}

const product = await ductape.app.update(tag, details)

```

## Fetching a Product

To fetch a product by tag you need use the product builder interface's `fetch` function

``` typescript

const tag = "product_tag";

const product = await ductape.product.fetch(tag)
```