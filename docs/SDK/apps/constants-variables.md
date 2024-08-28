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
import { app } from "app-instance" // app instance file 

const details = {
    key: "user_type",
    value: "user",
    type: DataTypes.STRING,
    description: "The User Type field, to be used during user registration"
}

const constants = await app.createConstant(details);
```

The following fields are allowed

- **key**: the unique identifier field 

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
import { app } from "app-instance" // app instance file 

const details = {
    value: "user",
    type: DataTypes.STRING,
    description: "The User Type field, to be used during user registration"
}

const constants = await app.createConstant(details);
```

The DataTypes are below

Here is the `DataTypes` enum converted into a markdown table:
