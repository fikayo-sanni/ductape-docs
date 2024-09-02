---
sidebar_position: 4
---

# Environments Setup

Ductape allows you to provision apps & services in multiple environments, for example, a single application can have **production**, **staging** and **development** environments

Environments allow you to have a seamless development environment when building products

Ductape allows you to have default workspace environments that get created each time an application is created, these default workspace environments can be updated on the ductape web platform on either the application or integration tabs


## Create App Environment

``` typescript
import { DataFormats } from "ductape/types/enums"
import { app } from "app-instance" // app instance file 

const data =  { // environment details
    env_name: "develop",
    slug: "dev",
    description: "development environment",
    active: true,
    base_url: "https://dev.example.app",
    reqest_type: DataFormats.JSON
}
const environments = await app.createEnvs(data) // create app env
```

The fields required to creat an app are as below

- **env_name:** name of environment ***required*** *
- **slug:** 3 letter slug, in small letters that serves as unique identifier for environment ***required*** *
- **description:** environment description text
- **active:** boolean field, set as true if the environment is active and false if not (defaulted to false)
- **base_url:** the base url of the environment
- **request type:** the type of request accepted by environment, you are expected to choose a value from the DataFormats enum

### Request Type Data Formats

Here are the options available in the DataFormats enum
| Key            | Value                             |
|----------------|-----------------------------------|
| **JSON**       | application/json                  |
| **URLENCODED** | application/x-www-form-urlencoded |
| **FORMDATA**   | multipart/form-data               |
| **SOAP**       | SOAP                              |
| **HTML**       | html                              |



## Update App Environment

``` typescript

import { DataFormats } from "ductape/types/enums"
import { app } from "app-instance" // app instance file

const slug = "prd"; // environment slug
const data =  { // updated environment details
    env_name: "production",
    description: "production environment",
    active: true,
    base_url: "https://prd.example.app",
    reqest_type: DataFormats.JSON
}
const environments  = await app.updateEnv(slug, data) // update app env
```

## Fetch Environements

``` typescript
const environments  = app.fetchEnvs() // fetch app envs
```

## Fetch Single Environment

``` typescript
const environments = app.fetchEnvs() // fetch app envs
```

