---
sidebar_position: 2
---

# Managing an App

## Creating an App

To create an app, use the app builder interface's `create` function:

```ts
const details = {
    name: "App Name",
    description: "You can add a product description here",
}

const product = await ductape.app.create(details)

```

## Updating an App

To update an app, use the app builder interface's `update` function:

```ts
const tag = "app";

const details = {
    description: "You can add a product description here",
}

const product = await ductape.app.update(tag, details)

```

## Fetching an App

To fetch an app by tag, use the app builder interface's `fetch` function:

```ts
const tag = "app";

const product = await ductape.app.fetch(tag)
```

## See Also

* [Getting Started with Apps](./getting-started.md)
* [App Instance Management](./app-instance.md)