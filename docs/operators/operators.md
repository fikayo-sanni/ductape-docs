---
sidebar_position: 1
---
# Understanding Operators

Ductape Operators are powerful string and array manipulation tools designed to provide flexible data transformation capabilities. Below is the detailed documentation for each available operator, including usage, examples, and explanations.

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

---

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