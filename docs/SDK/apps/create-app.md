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

To update an app you need use the app builder interface's `update` function

``` typescript
const tag = "app_tag";

const details = {
    description: "You can add a product description here",
}

const product = await ductape.app.update(tag, details)

```

## Fetching an App

To fetch an app by tag you need use the app builder interface's `fetch` function

``` typescript
const tag = "app_tag";

const product = await ductape.app.fetch(tag)
```