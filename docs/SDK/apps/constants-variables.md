---
sidebar_position: 6 
---

# Constants And Variables

Ductape provides interfaces for managing the constants and variables being used in your service.

## Constants
**Constants** are values that do not change, and can be reused across multiple actions with your application. 


### Create Constants
To create a constant, refer to the example below

``` typescript
import { DataTypes } from "ductape/types/enums";

// ... app builder instance

const details = {
    key: "USER_TYPE",
    value: "user",
    type: DataTypes.STRING,
    description: "The User Type field, to be used during user registration"
}

const constants = await appBuilder.createConstant(details);
```

The following fields are allowed

- **key**: the unique identifier field 
- **value**: the value to be stored
- **type**: the Data Type, further description provided below 
- **description**: a description of the field and what it entails *optional*

The DataTypes are below

Here is the `DataTypes` enum converted into a markdown table:

| Key          | Value      |
|--------------|------------|
| **STRING**   | string     |
| **NUMBER_STRING** | numberstring |
| **INTEGER**  | number     |
| **FLOAT**    | float      |
| **DOUBLE**   | double     |
| **UUID**     | uuid       |
| **ARRAY**    | array      |
| **OBJECT**   | object     |
| **BOOLEAN**  | boolean    |

### Update Constants
To update an existing constant, refer to the example below

``` typescript
import { DataTypes } from "ductape/types/enums";

// ... app builder instance

const details = {
    value: "user",
    type: DataTypes.STRING,
    description: "The User Type field, to be used during user registration"
}

const constant = await appBuilder.updateConstant(details);
```


### Fetch Constants

``` typescript
const constants = appBuilder.fetchConstants(); // fetch all app constants
```

``` typescript
const key = "USER_TYPE"
const constant = appBuilder.fetchConstant(key) // fetch single variable
```

## Variables

**Variables** are values that are meant to be supplied by third parties, and can be reused across multiple actions with your application. 
Defining variables is similar to defining constants, but the values are not going to be set by you, but instead by your customers

### Create Variables

To create a variable, refer to the example below

``` typescript
import { DataTypes } from "ductape/types/enums";
import { app } from "app-instance" // app instance file 

const details = {
    key: "PUBLIC_KEY"
    type: DataTypes.UUID,
    description: "The User's Public Key"
}

const variable = await app.createVariable(details);
```

### Update Variables

To update an existing variables, refer to the example below

``` typescript
import { DataTypes } from "ductape/types/enums";
import { app } from "app-instance" // app instance file 

const key = "PUBLIC_KEY"
const update = {
    type: DataTypes.STRING,
    description: "The User's Public Key"
}

const variable = await app.updateVariable(key, update);
```

### Fetch Variables

``` typescript
const variables = await app.fetchVariables(); // fetch all app constants
```

``` typescript
const key = "USER_TYPE"
const variable = await app.fetchVariable(key) // fetch single app
```