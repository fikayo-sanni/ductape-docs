---
sidebar_position: 6
---

# Constants and Variables

Ductape provides interfaces for managing the constants and variables used in your service.

## Constants

Constants are values that do not change and can be reused across multiple actions within your application.

### Creating Constants

```ts
import { DataTypes } from "@ductape/sdk/types";

const details = {
  key: "USER_TYPE",
  value: "user",
  type: DataTypes.STRING,
  description: "The User Type field, to be used during user registration"
};

const constants = await ductape.app.constant.create(details);
```

#### Fields
- **key**: The unique identifier field
- **value**: The value to be stored
- **type**: The data type (see table below)
- **description**: A description of the field and what it entails (optional)

#### DataTypes Enum

| Key            | Value      |
|----------------|------------|
| **STRING**     | string     |
| **NUMBER_STRING** | numberstring |
| **INTEGER**    | number     |
| **FLOAT**      | float      |
| **DOUBLE**     | double     |
| **UUID**       | uuid       |
| **ARRAY**      | array      |
| **OBJECT**     | object     |
| **BOOLEAN**    | boolean    |

### Updating Constants

```ts
import { DataTypes } from "@ductape/sdk/types";

const details = {
  value: "user",
  type: DataTypes.STRING,
  description: "The User Type field, to be used during user registration"
};

const constant = await ductape.app.constant.update(details);
```

### Fetching Constants

```ts
const constants = await ductape.app.constant.fetchAll();
```

```ts
const key = "USER_TYPE";
const constant = await ductape.app.constant.fetch(key);
```

## Variables

Variables are values that are meant to be supplied by third parties and can be reused across multiple actions within your application. Defining variables is similar to defining constants, but the values are not set by you, but instead by your customers.

### Creating Variables

```ts
import { DataTypes } from "@ductape/sdk/types";

const details = {
  key: "PUBLIC_KEY",
  type: DataTypes.UUID,
  description: "The User's Public Key"
};

const variable = await ductape.app.variable.create(details);
```

### Updating Variables

```ts
import { DataTypes } from "@ductape/sdk/types";

const key = "PUBLIC_KEY";
const update = {
  type: DataTypes.STRING,
  description: "The User's Public Key"
};

const variable = await ductape.app.variable.update(key, update);
```

### Fetching Variables

```ts
const variables = await ductape.app.variable.fetchAll();
```

```ts
const key = "USER_TYPE";
const variable = await ductape.app.variable.fetch(key);
```

## See Also

* [App Instance Management](./app-instance.md)
* [Environments Setup](./environments.md)