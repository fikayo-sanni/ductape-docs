---
sidebar_position: 4
---

# Product Environments

Ductape allows you to set up environments for your product projects, where you can define and configure the specific environments you are building on. Product environments enable you to coordinate different app environments, allowing them to work together seamlessly. This setup is essential for building complex functionalities, ensuring that your products run exactly as you need them to in different contexts.


## Creating Product Environments

``` typescript
import { DataFormats } from "ductape/types/enums"
import { product } from "product-instance" // product instance file 

const data =  { // environment details
    env_name: "develop",
    slug: "dev",
    description: "development environment",
}
const environments = await product.createEnv(data) // create app env
```

The fields required to creat an app are as below

- **env_name:** name of environment ***required*** *
- **slug:** 3 letter slug, in small letters that serves as unique identifier for environment ***required*** *
- **description:** environment description text



## Update Product Environment

``` typescript
import { DataFormats } from "ductape/types/enums"
import { product } from "product-instance" // product instance file

const slug = "prd"; // environment slug
const data =  { // updated environment details
    env_name: "production",
    description: "production environment",
}
const environments  = await product.updateEnv(slug, data) // update product env
```

## Fetch Environments

``` typescript
const environments  = product.fetchEnvs() // fetch product envs
```

## Fetch Single Environment

``` typescript

const slug = "prd";
const environment = product.fetchEnv(slug) // fetch product envs
```

