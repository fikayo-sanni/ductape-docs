---
sidebar_position: 2
---

# Defining Inputs

Feature inputs in Ductape allow you to define and enforce validation rules for data that flows into a feature. Expected in JSON format, these inputs enable you to specify data types and apply constraints like minimum and maximum length, ensuring data consistency and reliability.

## Basic Format for Defining Data Inputs

The basic structure for defining a feature input includes specifying the data type, along with optional constraints like minimum and maximum length. This structure is expressed as follows:

```typescript
{
    [key]: {
        type: DataTypes,       // Required: Specifies the expected data type
        minlength: number,     // Optional: Minimum length of the value
        maxlength: number,     // Optional: Maximum length of the value
    }
}
```

## Example of a Feature Input Definition

Here’s an example of how feature inputs can be defined in a Ductape feature:

```typescript
{
    username: {
        type: DataTypes.NOSPACES_STRING,  // Username must be a string without spaces
        minlength: 3,                     // Minimum length of 3 characters
        maxlength: 10,                    // Maximum length of 10 characters
    },
    email: {
        type: DataTypes.EMAIL_STRING,     // Must follow a valid email format
    },
    house_number: {
        type: DataTypes.INTEGER           // Expected to be an integer
    },
    country: {
        type: DataTypes.STRING            // Free-form text for country name
    },
    state: {
        type: DataTypes.STRING            // Free-form text for state name
    }
}
```

> **Note:** The current version of the Ductape SDK supports only flat objects for inputs, meaning nested objects are not accepted.

## Available `DataTypes` Options

The following `DataTypes` are available for defining feature inputs:

| Type              | Description                                     |
|-------------------|-------------------------------------------------|
| `STRING`          | Free-form text                                  |
| `NOSPACES_STRING` | String without spaces                           |
| `EMAIL_STRING`    | String in a valid email format                  |
| `NUMBER_STRING`   | String representing a number                    |
| `INTEGER`         | Integer value                                   |
| `FLOAT`           | Floating-point number                           |
| `DOUBLE`          | Double-precision floating-point number          |
| `UUID`            | Universally Unique Identifier (UUID)            |
| `ARRAY`           | Array of items                                  |
| `OBJECT`          | JSON object                                     |
| `BOOLEAN`         | Boolean value (`true` or `false`)               |

By defining inputs with these options, you ensure that data flowing into your feature is structured, validated, and matches the expected format. This prevents errors due to invalid data and maintains consistency in feature input handling.