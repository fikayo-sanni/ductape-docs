---
sidebar_position: 2
---
# Nesting Operators
Ductape Operators can be nested to perform complex transformations in a single expression.

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

✅ **Tip:** Nesting operators enables powerful data transformations in a concise format. Make sure to validate data types to avoid runtime errors.

