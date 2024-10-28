---
sidebar_position: 3
---

# Create Product Instance

You can create a reusable product instance which can be used for interacting with the productBuilder interface

```typescript
// ... ductape instance

const productBuilder = await ductape.getProductBuilder(); // initialize productBuilder

await productBuilder.initializeProductByTag(product_tag); // fetch product instance by id

```

This provides an interface to the productBuilder class and makes it available 