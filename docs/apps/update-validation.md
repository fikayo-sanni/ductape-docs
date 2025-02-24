---
sidebar_position: 7 
---
# Data Validation

In Ductape, you can update the validation rules for different input data points for actions in your application. These rules ensure data consistency and integrity across your app.


## **Validation Properties**

| **Property**        | **Type**                           | **Description**                                                |
|---------------------|------------------------------------|----------------------------------------------------------------|
| `description`       | `string`                           | Explanation of the data point's purpose.                       |
| `required`          | `boolean`                          | Determines if the field is mandatory.                          |
| `maxLength`         | `number`                           | Maximum allowed length for strings.                            |
| `minLength`         | `number`                           | Minimum allowed length for strings.                            |
| `decorator`         | `string`                           | Text or symbol displayed alongside the value.                  |
| `decoratorPosition` | [`DecoratorPositions`](#decorator-positions) | Position of the decorator relative to the value.              |
| `type`              | [`DataTypes`](#data-types)         | Defines the data type and format.                              |
| `defaultValue`      | `string \| number \| boolean`       | Default value if none is provided.                             |
| `sampleValue`       | `string \| number \| object`       | Example demonstrating the expected data format.                |


---

## **Decorator Positions**

The `decoratorPosition` property determines where the decorator appears relative to the value.

| **Enum**  | **Value**   | **Description**                     | **Example** |
|-----------|-------------|-------------------------------------|-------------|
| `APPEND`  | "append"    | Decorator appears **after** the value. | `100$`      |
| `PREPEND` | "prepend"   | Decorator appears **before** the value. | `$100`      |
| `UNSET`   | ""          | No decorator applied.                | `100`       |

---

## **Data Types**

The `type` property defines the expected data format.

| **Enum**              | **Value**        | **Description**            | **Example**                          |
|-----------------------|------------------|----------------------------|--------------------------------------|
| `STRING`              | "string"         | General string.             | "Hello World"                       |
| `NOSPACES_STRING`     | "nospaces_string"| String without spaces.     | "NoSpaces"                          |
| `EMAIL_STRING`        | "email_string"   | Valid email format.        | "user@example.com"                  |
| `NUMBER_STRING`       | "numberstring"   | Number in string format.   | "12345"                             |
| `INTEGER`             | "number"         | Whole number.              | 42                                   |
| `FLOAT`               | "float"          | Floating-point number.     | 3.14                                 |
| `DOUBLE`              | "double"         | Double-precision number.   | 123.456789                           |
| `UUID`                | "uuid"           | UUID format.               | "550e8400-e29b-41d4-a716-446655440000" |
| `ARRAY`               | "array"          | General array.             | [1, "text", true]                    |
| `OBJECT`              | "object"         | Object structure.          |  object                              |
| `BOOLEAN`             | "boolean"        | Boolean value.             | true                                 |
| `STRING_ARRAY`        | "array-string"   | Array of strings.          | ["apple", "banana"]                 |
| `INTEGER_ARRAY`       | "array-number"   | Array of integers.         | [1, 2, 3]                            |
| `FLOAT_ARRAY`         | "array-float"    | Array of floats.           | [1.1, 2.2, 3.3]                      |
| `DOUBLE_ARRAY`        | "array-double"   | Array of doubles.          | [1.123456, 2.654321]                 |
| `UUID_ARRAY`          | "array-uuid"     | Array of UUIDs.            | ["550e8400-e29b-41d4-a716-446655440000"] |
| `BOOLEAN_ARRAY`       | "array-boolean"  | Array of booleans.         | [true, false, true]                  |

---

## **Updating Data Validation with Ductape**

You can update data validation rules using the `ductape.apps.validation` function:

### **Function Signature**

```ts
await ductape.apps.validation(selector: string, update: Partial<IParsedSample>);
```

- **`selector`**: A string that identifies the data point you want to update. The available selector formats are:
  - `$Body{action_tag}{...}{key}`  
  - `$Query{action_tag}{...}{key}`  
  - `$Param{action_tag}{...}{key}`  
  - `$Header{action_tag}{...}{key}`  
- **`update`**: A partial object of `IParsedSample` containing the validation properties you wish to modify. All fields are optional.  

---

### **Example Usage**

#### **Example 1: Update Username Field Validation**

```ts
await ductape.apps.validation("$Body{createUser}{user}{username}", {
  description: "Username of the new user",
  required: true,
  type: "nospaces_string",
  maxLength: 30,
  minLength: 3,
  defaultValue: "",
});
```

**Explanation:**  
- Requires a username without spaces between 3 and 30 characters.  
- Provides a default value of an empty string.  

---

#### **Example 2: Set Validation for Product Price Field**

```ts
await ductape.apps.validation("$Body{createProduct}{product}{price}", {
  description: "Price of the product in USD",
  required: true,
  type: "float",
  decorator: "$",
  decoratorPosition: "prepend",
  defaultValue: 0.0,
});
```

**Explanation:**  
- Requires a floating-point number for price.  
- Prepends a `$` symbol.  
- Defaults to `0.0` if no value is provided.  

---

#### **Example 3: Update Tags Field to Accept String Arrays**

```ts
await ductape.apps.validation("$Body{createBlogPost}{post}{tags}", {
  description: "Tags associated with the blog post",
  type: "array-string",
  defaultValue: [],
});
```

**Explanation:**  
- Ensures tags are stored as an array of strings.  
- Default value is an empty array.  

---

#### **Example 4: Make UUID Required**

```ts
await ductape.apps.validation("$Param{getUser}{id}", {
  type: "uuid",
  required: true,
  description: "Unique identifier for the user",
});
```

**Explanation:**  
- Enforces a valid UUID format.  
- Field is required with no default value.  

---

## **Tips & Best Practices**  
- Use `maxLength` and `minLength` to prevent data overflow or underflow.  
- Apply decorators (like `$` or `%`) to enhance field clarity.  
- Set `defaultValue` for optional fields to ensure predictable data handling.  
- Always use the correct `type` to prevent data inconsistencies.  

