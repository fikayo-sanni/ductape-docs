---
sidebar_position: 1
---
# Understanding Operators

## What Are Operators?

Operators in Ductape are built-in data transformation functions that enable you to manipulate, format, and combine data within your workflows. They are a core part of Ductape's **declarative data referencing system**, allowing you to transform data without writing custom code.

## Ductape's Data Referencing Philosophy

Ductape uses a **string-based placeholder syntax** for referencing and transforming data. Instead of writing JavaScript functions or imperative code, you declare what data you want and how to transform it using special placeholders and operators.

### Why String-Based Placeholders?

This approach provides several key benefits:

1. **Platform Independence** - Your workflows are defined as pure data structures (JSON), not executable code. This makes them:
   - Portable across different environments
   - Easily serializable and storable in databases
   - Inspectable and analyzable without code execution
   - Versionable and diffable as configuration

2. **Security** - No arbitrary code execution means:
   - No risk of code injection attacks
   - Controlled transformation operations
   - Safe to store user-defined workflows
   - Auditable data transformations

3. **Predictability** - String-based transformations are:
   - Deterministic and testable
   - Easy to debug and trace
   - Cacheable and optimizable
   - Simple to understand at a glance

4. **Visual Tooling** - String syntax enables:
   - Visual workflow builders
   - Auto-completion in configuration
   - Validation before execution
   - Clear documentation of data flow

### The Data Reference System

Ductape provides multiple ways to reference data within your workflows:

| Reference Type | Syntax | Purpose | Example |
|----------------|--------|---------|---------|
| **Input** | `$Input{field}` | Access feature input values | `$Input{email}` |
| **Sequence** | `$Sequence{seq}{event}{field}` | Get results from previous events | `$Sequence{main}{create-user}{id}` |
| **Variable** | `$Variable{app}{key}` | Access app-level variables | `$Variable{stripe}{api_version}` |
| **Constant** | `$Constant{app}{key}` | Access app constants | `$Constant{config}{currency}` |
| **Session** | `$Session{tag}{field}` | Get session data | `$Session{user}{name}` |
| **Response** | `$Response{field}` | Access current action response | `$Response{id}` |
| **Token** | `$Secret{key}` | Access workspace secrets | `$Secret{api_key}` |
| **Auth** | `$Auth{field}` | Access app authentication data | `$Auth{access_token}` |
| **Default** | `$Default` | Provide default/fallback values | `$Default` |
| **Size** | `$Size{reference}` | Get size of object (number of keys) | `$Size{$Input{user}}` |
| **Length** | `$Length{reference}` | Get length of array or string | `$Length{$Input{items}}` |

### How Operators Fit In

Operators extend this reference system by providing **transformation capabilities**. You can wrap any data reference with operators to manipulate the data:

```typescript
// Basic reference
email: '$Input{email}'

// With operator transformation
emailUpper: '$Uppercase($Input{email})'

// Multiple operators
fullName: '$Trim($Concat([$Input{firstName}, $Input{lastName}], " "))'

// Complex nesting with sequences
userId: '$Substring($Sequence{main}{create-user}{id}, 0, 8)'
```

## When to Use Operators

Use operators when you need to:

- **Format data** - Convert dates, change case, trim whitespace
- **Combine values** - Join strings, merge arrays, concatenate data
- **Extract portions** - Get substrings, pick array elements, filter lists
- **Calculate values** - Add numbers, perform arithmetic
- **Transform responses** - Shape API responses to match your needs

## Practical Examples

### Example 1: User Registration with Formatting

```typescript
await ductape.features.create({
  tag: 'register-user',
  name: 'User Registration',
  input: {
    firstName: { type: DataTypes.STRING },
    lastName: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING },
  },
  events: [
    {
      type: FeatureEventTypes.ACTION,
      event: 'create-user',
      app: 'user-service',
      input: {
        // Combine and trim names
        fullName: '$Trim($Concat([$Input{firstName}, $Input{lastName}], " "))',
        // Normalize email to lowercase
        email: '$Lowercase($Trim($Input{email}))',
      },
    },
  ],
  output: {
    userId: '$Sequence{main}{create-user}{id}',
    displayName: '$Uppercase($Pick($Input{firstName}, 0))$Substring($Input{firstName}, 1)',
  },
});
```

### Example 2: Processing Payment Data

```typescript
{
  // Add fees to payment amount
  totalAmount: '$Add($Input{amount}, $Input{processingFee})',

  // Format date for display
  createdDate: '$Dateformat($Sequence{main}{create-charge}{created}, "DD/MM/YYYY")',

  // Extract last 4 digits of card
  cardLast4: '$Substring($Sequence{main}{get-card}{number}, -4)',

  // Filter completed transactions
  completedTransactions: '$Filter($Sequence{main}{fetch-transactions}{data}, "==", "completed")',
}
```

### Example 3: Data Aggregation

```typescript
{
  // Join multiple result arrays
  allOrders: '$Join([$Sequence{main}{fetch-pending}{data}, $Sequence{main}{fetch-completed}{data}])',

  // Get first matching order
  targetOrder: '$Find($Sequence{main}{fetch-orders}{data}, "==", $Input{orderId})',

  // Calculate total with discounts
  finalTotal: '$Subtract($Input{subtotal}, $Input{discount}, $Input{couponValue})',
}
```

### Example 4: Using Secrets, App Auth, and Utility References

```typescript
{
  // Access workspace secrets and app authentication
  apiKey: '$Secret{stripe_api_key}',                 // Workspace secret
  appToken: '$Auth{access_token}',                   // App authentication

  // Check object size and array/string length
  userFieldCount: '$Size{$Input{userData}}',        // Number of keys in userData object
  itemCount: '$Length{$Input{items}}',              // Length of items array
  nameLength: '$Length{$Input{username}}',          // Length of username string

  // Use size/length in conditional logic
  hasUserData: '$Filter([$Size{$Input{userData}}], ">", 0)',
  hasItems: '$Filter([$Length{$Input{items}}], ">", 0)',

  // Build authorization header
  authHeader: '$Concat(["Bearer ", $Auth{access_token}], "")',

  // Validate input length
  isValidUsername: '$Filter([$Length{$Input{username}}], ">=", 3)',
}
```

### Example 5: Using Secrets and App Auth in Workflows

```typescript
await ductape.features.create({
  tag: 'call-external-api',
  name: 'Call External API with Authentication',
  input: {
    endpoint: { type: DataTypes.STRING },
    data: { type: DataTypes.OBJECT },
  },
  events: [
    {
      type: FeatureEventTypes.ACTION,
      event: 'http-request',
      app: 'http-client',
      input: {
        url: '$Input{endpoint}',
        headers: {
          'Authorization': '$Concat(["Bearer ", $Secret{api_secret}], "")',     // Workspace secret
          'X-App-Token': '$Auth{access_token}',                                 // App authentication
        },
        body: '$Input{data}',
      },
    },
  ],
  output: {
    responseId: '$Sequence{main}{http-request}{id}',
    status: '$Sequence{main}{http-request}{status}',
    authenticated: '$Auth{access_token}',
  },
});
```

## Operators vs. Custom Code

Unlike traditional backends where you'd write JavaScript functions:

```javascript
// Traditional approach (NOT how Ductape works)
const fullName = user.firstName.trim() + ' ' + user.lastName.trim();
const email = user.email.toLowerCase().trim();
```

Ductape uses declarative operators:

```typescript
// Ductape approach
{
  fullName: '$Trim($Concat([$Input{firstName}, $Input{lastName}], " "))',
  email: '$Lowercase($Trim($Input{email}))'
}
```

This declarative approach means:
- Your transformations are configuration, not code
- Workflows can be stored, versioned, and migrated easily
- Visual tools can understand and edit your logic
- No deployment needed to change transformations
- Built-in validation and type safety

---

## Available Operators

Below is the complete reference for all available operators in Ductape

## 1. $Add

### **Description:**  
Adds multiple numeric values together.

### **Syntax:**
```typescript
$Add(value1, value2, ..., valueN)
```

### **Parameters:**
| **Parameter** | **Description**                |
|---------------|--------------------------------|
| `value1...N`  | Numeric values or placeholders |

### **Example:**
```typescript
$Add(10, 20, 30)  # Result: 60
$Add(5, $valueFromVariable, 15)  # Result: Computed sum
```

## 2. $Subtract

### **Description:**  
Subtracts subsequent numeric values from the first value.

### **Syntax:**
```typescript
$Subtract(value1, value2, ..., valueN)
```

### **Parameters:**
| **Parameter** | **Description**            |
|---------------|----------------------------|
| `value1`      | Base number                |
| `value2...N`  | Numbers to subtract        |

### **Example:**
```typescript
$Subtract(100, 20, 30)  # Result: 50 (100 - 20 - 30)
```

## 3. $Concat

### **Description:**  
Joins multiple strings into a single string with a specified delimiter.

### **Syntax:**
```typescript
$Concat([string1, string2, ..., stringN], 'delimiter')
```

### **Parameters:**
| **Parameter** | **Description**       |
|---------------|-----------------------|
| `[strings]`   | Array of strings      |
| `'delimiter'`| String used to join   |

### **Example:**
```typescript
$Concat(["Hello", "World"], " ")  # Result: "Hello World"
$Concat(["2024", "07", "15"], "-")  # Result: "2024-07-15"
```

## 4. $Substring

### **Description:**  
Extracts a substring from a string given start and end indices.

### **Syntax:**
```typescript
$Substring(string, start, end)
```

### **Parameters:**
| **Parameter** | **Description**                |
|---------------|--------------------------------|
| `string`      | Input string                   |
| `start`       | Start index (inclusive)        |
| `end`         | End index (exclusive)          |

### **Example:**
```typescript
$Substring("Ductape", 0, 4)  # Result: "Duct"
$Substring("Operator", 2, 6)  # Result: "erat"
```

## 5. $Trim

### **Description:**  
Removes whitespace from both ends of a string.

### **Syntax:**
```typescript
$Trim(string)
```

### **Parameters:**
| **Parameter** | **Description**    |
|---------------|--------------------|
| `string`      | Input string       |

### **Example:**
```typescript
$Trim("  Ductape  ")  # Result: "Ductape"
$Trim("\nNewLine\t")  # Result: "NewLine"
```

## 6. $Split

### **Description:**  
Splits a string into an array based on a specified separator.

### **Syntax:**
```typescript
$Split(string, separator)
```

### **Parameters:**
| **Parameter** | **Description**     |
|---------------|---------------------|
| `string`      | String to split     |
| `separator`   | Delimiter used      |

### **Example:**
```typescript
$Split("apple,banana,cherry", ",")  # Result: ["apple", "banana", "cherry"]
$Split("one-two-three", "-")  # Result: ["one", "two", "three"]
```

## 7. $Pick

### **Description:**  
Retrieves a character from a string or an element from an array at the specified index.

### **Syntax:**
```typescript
$Pick(value, index)
```

### **Parameters:**
| **Parameter** | **Description**      |
|---------------|----------------------|
| `value`       | String or array       |
| `index`       | Zero-based index      |

### **Example:**
```typescript
$Pick("Hello", 1)  # Result: "e"
$Pick(["apple", "banana", "cherry"], 2)  # Result: "cherry"
```

## 8. $Join

### **Description:**  
Merges arrays of objects into a single array.

### **Syntax:**
```typescript
$Join([[objectArray1], [objectArray2], ..., [objectArrayN]])
```

### **Parameters:**
| **Parameter** | **Description**             |
|---------------|-----------------------------|
| `[[arrays]]`  | Array of object arrays      |

### **Example:**
```typescript
$Join([[{id: 1}, {id: 2}], [{id: 3}]])  # Result: [{id: 1}, {id: 2}, {id: 3}]
```

## 9. $Uppercase

### **Description:**  
Converts a string to uppercase.

### **Syntax:**
```typescript
$Uppercase(string)
```

### **Parameters:**
| **Parameter** | **Description** |
|---------------|-----------------|
| `string`      | Input string    |

### **Example:**
```typescript
$Uppercase("ductape")  # Result: "DUCTAPE"
```

## 10. $Lowercase

### **Description:**  
Converts a string to lowercase.

### **Syntax:**
```typescript
$Lowercase(string)
```

### **Parameters:**
| **Parameter** | **Description** |
|---------------|-----------------|
| `string`      | Input string    |

### **Example:**
```typescript
$Lowercase("Ductape")  # Result: "ductape"
```

## 11. $Dateformat

### **Description:**  
Formats a date string into a specified format.

### **Syntax:**
```typescript
$Dateformat(dateString, format)
```

### **Parameters:**
| **Parameter** | **Description**       |
|---------------|-----------------------|
| `dateString`  | Date to be formatted  |
| `format`      | Desired date pattern  |

### **Valid Date Formats:**
| **Pattern** | **Type**  | **Example**       |
|-------------|-----------|-------------------|
| `YYYY`      | Year      | `2024`            |
| `YY`        | Year      | `24`              |
| `MMMM`      | Month     | `February`        |
| `MMM`       | Month     | `Feb`             |
| `MM`        | Month     | `02`              |
| `M`         | Month     | `2`               |
| `DD`        | Day       | `09`              |
| `D`         | Day       | `9`               |
| `dddd`      | Weekday   | `Wednesday`       |
| `ddd`       | Weekday   | `Wed`             |
| `HH`        | Hour (24) | `08`              |
| `H`         | Hour (24) | `8`               |
| `hh`        | Hour (12) | `08`              |
| `h`         | Hour (12) | `8`               |
| `mm`        | Minutes   | `05`              |
| `m`         | Minutes   | `5`               |
| `ss`        | Seconds   | `09`              |
| `s`         | Seconds   | `9`               |
| `A`         | AM/PM     | `PM`              |
| `a`         | am/pm     | `pm`              |

### **Example:**
```typescript
$Dateformat("2024-02-09", "DD/MM/YYYY")  # Result: "09/02/2024"
$Dateformat("2024-02-09T15:30:00", "hh:mm A")  # Result: "03:30 PM"
```

---

## 12. $Replace

### **Description:**  
Replaces occurrences of a substring within a string.

### **Syntax:**
```typescript
$Replace(string, search, replace)
```

### **Parameters:**
| **Parameter** | **Description**      |
|---------------|----------------------|
| `string`      | Input string          |
| `search`      | Substring to find     |
| `replace`     | Replacement string    |

### **Example:**
```typescript
$Replace("Hello World", "World", "Ductape")  # Result: "Hello Ductape"
$Replace("2024-02-09", "-", "/")  # Result: "2024/02/09"
```

## 13. **$Filter**

### **Description:**  
Filters an array based on a comparison operator and a value, returning all elements that satisfy the condition.

### **Syntax:**  
```typescript
$Filter(array, "operator", value)
```

### **Parameters:**  
| **Parameter** | **Type**       | **Description**                                  |
|---------------|----------------|--------------------------------------------------|
| `array`       | Array           | Array of values to be filtered.                  |
| `"operator"`  | String          | Comparison operator (`">"`, `"<"`, `">="`, `"<="`, `"=="`, `"!=="`). |
| `value`       | Any             | Value to compare each element of the array against. |

### **Example:**  
```typescript
$Filter([1, 2, 3, 4, 5], ">", 3)      # Result: [4, 5]
$Filter(["apple", "banana"], "==", "apple")  # Result: ["apple"]
```

## 14. **$Find**

### **Description:**  
Finds and returns the first element in an array that matches the given comparison operator and value.

### **Syntax:**  
```typescript
$Find(array, "operator", value)
```

### **Parameters:**  
| **Parameter** | **Type**       | **Description**                                  |
|---------------|----------------|--------------------------------------------------|
| `array`       | Array           | Array of values to search.                       |
| `"operator"`  | String          | Comparison operator (`">"`, `"<"`, `">="`, `"<="`, `"=="`, `"!=="`). |
| `value`       | Any             | Value to compare each element of the array against. |

### **Example:**  
```typescript
$Find([1, 2, 3, 4, 5], "==", 3)      # Result: 3
$Find(["apple", "banana"], "==", "banana")  # Result: "banana"
$Find([1, 4, 6], ">", 4)             # Result: 6
```

## **Final Notes:**
- Errors are thrown for invalid inputs or out-of-bounds indices.
- Operators are designed to be nestable and composable for complex transformations.