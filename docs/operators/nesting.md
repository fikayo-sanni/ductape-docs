---
sidebar_position: 2
---
# Nesting Operators

Operators in Ductape can be **nested** to perform complex data transformations in a single expression. This enables powerful data manipulation while keeping your workflow definitions declarative and inspectable.

## Why Nest Operators?

Nesting allows you to:
- **Chain transformations** - Apply multiple operations in sequence
- **Build complex logic** - Combine simple operators to solve complex problems
- **Keep workflows concise** - Avoid intermediate steps and temporary values
- **Maintain readability** - Express intent clearly with composed operations

## How Nesting Works

Operators are evaluated **from the inside out**, just like function composition:

```typescript
$Uppercase($Trim($Input{name}))
```

Execution order:
1. Get value from `$Input{name}` → `"  john  "`
2. Apply `$Trim()` → `"john"`
3. Apply `$Uppercase()` → `"JOHN"`

## Real-World Examples with Data References

### Example 1: User Profile Formatting

```typescript
// Feature input: { firstName: "  Jane  ", lastName: "Doe", email: "JANE@EXAMPLE.COM  " }

output: {
  // Trim and concatenate names
  fullName: '$Trim($Concat([$Input{firstName}, $Input{lastName}], " "))',
  // Result: "Jane Doe"

  // Normalize and format email
  email: '$Lowercase($Trim($Input{email}))',
  // Result: "jane@example.com"

  // Create initials from names
  initials: '$Concat([$Uppercase($Pick($Input{firstName}, 0)), $Uppercase($Pick($Input{lastName}, 0))], "")',
  // Result: "JD"
}
```

### Example 2: Processing API Responses

```typescript
// Assuming create-user action returns: { id: "usr_123abc456def", created_at: "2024-07-15T10:30:00Z" }

output: {
  // Extract short user ID (first 8 chars)
  shortId: '$Substring($Sequence{main}{create-user}{id}, 4, 12)',
  // Result: "123abc45"

  // Format creation date
  createdDate: '$Dateformat($Sequence{main}{create-user}{created_at}, "DD/MM/YYYY")',
  // Result: "15/07/2024"

  // Combine formatted data
  displayText: '$Concat(["User ", $Substring($Sequence{main}{create-user}{id}, 4, 12), " created on ", $Dateformat($Sequence{main}{create-user}{created_at}, "DD/MM/YYYY")], "")',
  // Result: "User 123abc45 created on 15/07/2024"
}
```

### Example 3: Payment Processing

```typescript
// Input: { baseAmount: 100, taxRate: 0.2, discountCode: "SAVE20" }
// Sequence result: { discount: { value: 20 } }

output: {
  // Calculate tax amount
  taxAmount: '$Subtract($Input{baseAmount}, $Sequence{main}{calculate-discount}{value})',
  // Step 1: $Sequence{main}{calculate-discount}{value} → 20
  // Step 2: $Subtract(100, 20) → 80

  // Format final price with currency
  displayPrice: '$Concat(["$", $Add($Subtract($Input{baseAmount}, $Sequence{main}{calculate-discount}{value}), 0.00)], "")',
  // Result: "$80.00"
}
```

### Example 4: Array Filtering and Extraction

```typescript
// Sequence result: { orders: [
//   { id: 1, status: 'pending', amount: 50 },
//   { id: 2, status: 'completed', amount: 100 },
//   { id: 3, status: 'completed', amount: 75 }
// ]}

output: {
  // Filter and get first completed order
  firstCompleted: '$Find($Sequence{main}{fetch-orders}{orders}, "==", "completed")',
  // Result: { id: 2, status: 'completed', amount: 100 }

  // Get all completed orders and join with pending
  allOrders: '$Join([$Filter($Sequence{main}{fetch-orders}{orders}, "==", "completed"), $Sequence{main}{fetch-pending}{orders}])',
  // Combines filtered completed orders with pending orders
}
```

### Example 5: Deep Nesting with Multiple Data Sources

```typescript
// Input: { userId: "usr_123", orderDate: "2024-07-15" }
// Session: { user: { name: "John Doe", email: "john@example.com" } }
// Sequence: { create-order: { id: "ord_456", total: 250.50 } }
// Constant: { config: { currency: "USD" } }

output: {
  // Complex formatted message
  orderSummary: '$Concat([
    "Order ",
    $Substring($Sequence{main}{create-order}{id}, 4),
    " for ",
    $Uppercase($Pick($Session{user}{name}, 0)),
    $Substring($Session{user}{name}, 1),
    " on ",
    $Dateformat($Input{orderDate}, "MMM DD, YYYY"),
    " - Total: ",
    $Constant{config}{currency},
    " ",
    $Sequence{main}{create-order}{total}
  ], "")',
  // Result: "Order 456 for John Doe on Jul 15, 2024 - Total: USD 250.50"
}
```

---

## Basic Nesting Patterns

### **Examples of Nested Operators:**

1. **Nested `$Add` with `$Substring` and `$Pick`:**  
```plaintext
$Add( $Pick('12345', 0), $Substring('98765', 2, 4) )
```
- `$Pick('12345', 0)` → `'1'` → `1`
- `$Substring('98765', 2, 4)` → `'76'` → `76`
- `$Add(1, 76)` → `77`

2. **Nested `$Concat` with `$Trim` and `$Split`:**  
```plaintext
$Concat([$Trim('  hello  '), $Pick($Split('a,b,c', ','), 1)], '-')
```
- `$Trim('  hello  ')` → `'hello'`
- `$Split('a,b,c', ',')` → `['a', 'b', 'c']`
- `$Pick(['a', 'b', 'c'], 1)` → `'b'`
- `$Concat(['hello', 'b'], '-')` → `'hello-b'`

3. **Nested `$Subtract` with `$Add` and `$Pick`:**  
```plaintext
$Subtract( $Add(2, 3), $Pick('678', 1) )
```
- `$Add(2, 3)` → `5`
- `$Pick('678', 1)` → `'7'` → `7`
- `$Subtract(5, 7)` → `-2`

4. **Complex Nesting with `$Join`, `$Split`, and `$Trim`:**  
```plaintext
$Join([$Trim(' John '), $Pick($Split('Jane,Doe', ','), 1)], ' & ')
```
- `$Trim(' John ')` → `'John'`
- `$Split('Jane,Doe', ',')` → `['Jane', 'Doe']`
- `$Pick(['Jane', 'Doe'], 1)` → `'Doe'`
- `$Join(['John', 'Doe'], ' & ')` → `'John & Doe'`

5. **Deep Nesting Example:**  
```plaintext
$Concat([
  $Add( $Pick('12', 0), 5 ),
  $Substring('abcdef', 2, 5),
  $Trim(' xyz ')
], '_')
```
- `$Pick('12', 0)` → `'1'` → `1`
- `$Add(1, 5)` → `6`
- `$Substring('abcdef', 2, 5)` → `'cde'`
- `$Trim(' xyz ')` → `'xyz'`
- `$Concat(['6', 'cde', 'xyz'], '_')` → `'6_cde_xyz'`

---

## Best Practices for Nesting

### 1. Keep It Readable

While deep nesting is powerful, prioritize clarity:

**Good - Clear intent:**
```typescript
fullName: '$Trim($Concat([$Input{firstName}, $Input{lastName}], " "))'
```

**Harder to read:**
```typescript
result: '$Uppercase($Trim($Concat([$Substring($Input{first}, 0, 1), $Lowercase($Pick($Split($Input{last}, " "), 0))], "-")))'
```

### 2. Work from Inside Out

When building complex nesting, start with the innermost operation:

```typescript
// Step 1: Get the data
$Input{email}

// Step 2: Trim whitespace
$Trim($Input{email})

// Step 3: Convert to lowercase
$Lowercase($Trim($Input{email}))

// Step 4: Extract domain
$Pick($Split($Lowercase($Trim($Input{email})), "@"), 1)
```

### 3. Validate Your Data Sources

Ensure the data you're referencing exists and matches the expected type:

```typescript
// Make sure the event result has this field before extracting
userId: '$Substring($Sequence{main}{create-user}{id}, 0, 8)'

// Verify array results before filtering
activeUsers: '$Filter($Sequence{main}{fetch-users}{users}, "==", "active")'
```

### 4. Use Comments in Complex Workflows

Document your transformations, especially nested operators:

```typescript
await ductape.features.create({
  tag: 'format-order',
  output: {
    // Extract order ID prefix (first 8 chars after "ord_")
    shortOrderId: '$Substring($Sequence{main}{create-order}{id}, 4, 12)',

    // Format: "Order #123 by John D. on Jul 15"
    displaySummary: '$Concat([
      "Order #",
      $Substring($Sequence{main}{create-order}{id}, 4, 12),
      " by ",
      $Trim($Session{user}{name}),
      " on ",
      $Dateformat($Input{orderDate}, "MMM DD")
    ], "")',
  }
});
```

## Common Nesting Patterns

### Pattern 1: Clean User Input
```typescript
// Normalize and validate user input
{
  email: '$Lowercase($Trim($Input{email}))',
  name: '$Trim($Concat([$Input{firstName}, $Input{lastName}], " "))',
  phone: '$Replace($Trim($Input{phone}), "-", "")',
}
```

### Pattern 2: Format API Responses
```typescript
// Transform third-party API data
{
  userId: '$Substring($Response{id}, 0, 8)',
  createdDate: '$Dateformat($Response{created_at}, "DD/MM/YYYY")',
  displayName: '$Uppercase($Pick($Response{name}, 0))$Substring($Response{name}, 1)',
}
```

### Pattern 3: Combine Multiple Sources
```typescript
// Merge data from different sources
{
  userInfo: '$Concat([
    $Session{user}{name},
    " (",
    $Lowercase($Input{email}),
    ") - ID: ",
    $Substring($Sequence{main}{create-user}{id}, 4)
  ], "")',
}
```

### Pattern 4: Conditional Extraction
```typescript
// Extract specific data based on conditions
{
  completedOrders: '$Filter($Sequence{main}{fetch-orders}{data}, "==", "completed")',
  firstPending: '$Find($Sequence{main}{fetch-orders}{data}, "==", "pending")',
  highValueOrders: '$Filter($Sequence{main}{fetch-orders}{data}, ">", 1000)',
}
```

## Tips for Success

 **Test incrementally** - Build complex expressions step by step, testing each level

 **Use consistent spacing** - Format nested operators for readability

 **Document complex logic** - Add comments explaining the transformation intent

 **Validate data types** - Ensure operations match the data type (strings, numbers, arrays)

 **Consider sequence order** - Reference events that have already executed in the workflow

 **Keep transformations pure** - Operators should not have side effects

## Debugging Nested Operators

When a nested operator doesn't produce expected results:

1. **Check the innermost operation first** - Verify each data reference resolves correctly
2. **Inspect intermediate values** - Use simpler expressions to test each step
3. **Verify data types** - Ensure operators receive the correct input types
4. **Review execution order** - Confirm referenced events have completed
5. **Check for null/undefined** - Ensure all referenced fields exist

## See Also

- [Understanding Operators](./operators) - Complete operator reference and data referencing guide
- [Features Output](../features/output) - How to use operators in feature outputs
- [Features Overview](../features/overview) - Building workflows with events and sequences

