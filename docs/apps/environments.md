---
sidebar_position: 3
---

# Environments Setup

Ductape allows you to provision apps and services in multiple environments. For example, a single application can have **production**, **staging**, and **development** environments.

Environments enable seamless development workflows when building products. Ductape also provides default workspace environments that are created each time an application is provisioned. These default environments can be updated in the Ductape web platform under the application or product tabs.

## Creating an App Environment

```ts
import { DataFormats } from "ductape-sdk/types";

const data = {
  env_name: "develop",
  slug: "dev",
  description: "Development environment",
  active: true,
  base_url: "https://dev.example.app",
  request_type: DataFormats.JSON
};

const environments = await ductape.app.environments.create(data);
```

### Required Fields

- **env_name:** The name of the environment (required).
- **slug:** A 3-letter identifier in lowercase that serves as a unique identifier for the environment (required).
- **description:** A description of the environment.
- **active:** A boolean indicating if the environment is active (defaults to `false`).
- **base_url:** The base URL of the environment.
- **request_type:** The type of requests accepted by the environment, using a value from the `DataFormats` enum.

## Request Type Data Formats

| Key            | Value                             |
|----------------|-----------------------------------|
| **JSON**       | application/json                  |
| **URLENCODED** | application/x-www-form-urlencoded |
| **FORMDATA**   | multipart/form-data               |
| **SOAP**       | SOAP                              |
| **HTML**       | html                              |

## Updating an App Environment

```ts
import { DataFormats } from "ductape-sdk/types";

const slug = "prd";

const data = {
  env_name: "production",
  description: "Production environment",
  active: true,
  base_url: "https://prd.example.app",
  request_type: DataFormats.JSON
};

const environments = await ductape.app.environments.update(slug, data);
```

## Fetching Environments

```ts
const environments = await ductape.app.environments.fetchAll();
```

## Fetching a Single Environment

```ts
const slug = "prd";
const environment = await ductape.app.environments.fetch(slug);
```

## See Also

* [Getting Started with Apps](./getting-started.md)
* [App Instance Management](./app-instance.md)
* [Constants & Variables](./constants-variables.md)