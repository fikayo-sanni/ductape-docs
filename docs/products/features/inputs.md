---
sidebar_position: 2
---

# Defining Inputs

Feature inputs in Ductape allow you to define and enforce validation rules for data that flows into a feature. Inputs are expected in JSON format and are described using the `IFeatureInput` type from the SDK. This enables you to specify data types and apply constraints like minimum and maximum length, ensuring data consistency and reliability.

## IFeatureInput Structure

Each input field is defined as an entry in a flat object, where the key is the input name and the value is an `IFeatureInput` object:

```typescript
interface IFeatureInput {
  type: DataTypes | FileType; // Required: Specifies the expected data type
  minlength?: number;         // Optional: Minimum length of the value
  maxlength?: number;         // Optional: Maximum length of the value
}
```

> **Note:** Only flat objects are supported for feature inputs. Nested objects are not accepted.

## Example: Feature Input Definition

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

## IFeatureInput Fields

| Field        | Type                | Required | Description                                 |
|--------------|---------------------|----------|---------------------------------------------|
| `type`       | `DataTypes`\|`FileType` | Yes      | The expected data type for the input.        |
| `minlength`  | `number`            | No       | Minimum length (for strings/arrays).         |
| `maxlength`  | `number`            | No       | Maximum length (for strings/arrays).         |

## Available `DataTypes`

The following `DataTypes` are available for defining feature inputs:

| Type              | Description                                     |
|-------------------|-------------------------------------------------|
| `STRING`          | Free-form text                                  |
| `NOSPACES_STRING` | String without spaces                           |
| `EMAIL_STRING`    | String in a valid email format                  |
| `NUMBER_STRING`   | String representing a number                    |
| `DATE_STRING`     | String in a valid date format                   |
| `INTEGER`         | Integer value                                   |
| `FLOAT`           | Floating-point number                           |
| `DOUBLE`          | Double-precision floating-point number          |
| `UUID`            | Universally Unique Identifier (UUID)            |
| `DATE`            | Date value                                      |
| `ARRAY`           | Array of items                                  |
| `OBJECT`          | JSON object                                     |
| `BOOLEAN`         | Boolean value (`true` or `false`)               |
| `STRING_ARRAY`    | Array of strings                                |
| `INTEGER_ARRAY`   | Array of integers                               |
| `FLOAT_ARRAY`     | Array of floats                                 |
| `DOUBLE_ARRAY`    | Array of doubles                                |
| `UUID_ARRAY`      | Array of UUIDs                                  |
| `BOOLEAN_ARRAY`   | Array of booleans                               |

> **Tip:** Use the most specific `DataTypes` possible to ensure robust validation.

## Best Practices
- Use descriptive and consistent input field names.
- Choose the most restrictive `DataTypes` that match your requirements.
- Set `minlength` and `maxlength` for strings and arrays to enforce data quality.
- Avoid nested objects; keep input schemas flat for compatibility.
- Document each input field's purpose for maintainability.

## See Also
- [Defining Output](./output.md)
- [Features Overview](./getting-started.md)
- [Event Types Overview](/category/event-types)