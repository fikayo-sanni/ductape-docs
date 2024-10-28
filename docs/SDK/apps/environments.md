---
sidebar_position: 4
---

# Environments Setup

Ductape allows you to provision apps and services in multiple environments. For example, a single application can have **production**, **staging**, and **development** environments.

Environments enable seamless development workflows when building products. Ductape also provides default workspace environments that are created each time an application is provisioned. These default environments can be updated in the Ductape web platform under the application or product tabs.

## Create App Environment

```typescript
import { DataFormats } from "ductape/types/enums";

// ... app builder instance

const data = { // environment details
    env_name: "develop",
    slug: "dev",
    description: "Development environment",
    active: true,
    base_url: "https://dev.example.app",
    request_type: DataFormats.JSON // fixed typo here
};

const environments = await app.createEnvs(data); // create app environment
```

### Required Fields for Creating an App Environment

- **env_name:** The name of the environment (***required***).
- **slug:** A 3-letter identifier in lowercase that serves as a unique identifier for the environment (***required***).
- **description:** A description of the environment.
- **active:** A boolean indicating if the environment is active (defaults to `false`).
- **base_url:** The base URL of the environment.
- **request_type:** The type of requests accepted by the environment, using a value from the `DataFormats` enum.

### Request Type Data Formats

| Key            | Value                             |
|----------------|-----------------------------------|
| **JSON**       | application/json                  |
| **URLENCODED** | application/x-www-form-urlencoded |
| **FORMDATA**   | multipart/form-data               |
| **SOAP**       | SOAP                              |
| **HTML**       | html                              |

## Update App Environment

```typescript
import { DataFormats } from "ductape/types/enums";

// ... app builder instance

const slug = "prd"; // environment slug

const data = { // updated environment details
    env_name: "production",
    description: "Production environment",
    active: true,
    base_url: "https://prd.example.app",
    request_type: DataFormats.JSON
};

const environments = await appBuilder.updateEnv(slug, data); // update app environment
```

## Fetch Environments

```typescript
const environments = await appBuilder.fetchEnvs(); // fetch app environments
```

## Fetch a Single Environment

```typescript
const slug = "prd";
const environment = await appBuilder.fetchEnv(slug); // fetch a single app environment
```