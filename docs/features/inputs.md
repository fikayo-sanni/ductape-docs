---
sidebar_position: 2
---

# Defining Inputs

Inputs define what data your feature needs to run. Ductape validates incoming data against your input schema before executing the feature.

## Basic Structure

Each input field needs a `type` and can optionally have length constraints:

```typescript
input: {
  email: { type: 'EMAIL_STRING' },
  username: { type: 'STRING', minlength: 3, maxlength: 20 },
  age: { type: 'INTEGER' }
}
```

---

## Data Types

| Type | What It Accepts | Example |
|------|-----------------|---------|
| `STRING` | Any text | `"Hello world"` |
| `EMAIL_STRING` | Valid email format | `"user@example.com"` |
| `NOSPACES_STRING` | Text without spaces | `"username123"` |
| `NUMBER_STRING` | Number as text | `"12345"` |
| `DATE_STRING` | Date as text | `"2024-01-15"` |
| `INTEGER` | Whole numbers | `42` |
| `FLOAT` | Decimal numbers | `3.14` |
| `BOOLEAN` | True or false | `true` |
| `UUID` | UUID format | `"550e8400-e29b-41d4-a716-446655440000"` |
| `ARRAY` | List of items | `[1, 2, 3]` |
| `OBJECT` | JSON object | `{ "key": "value" }` |

### Array Types

For typed arrays, use these:

| Type | Contents |
|------|----------|
| `STRING_ARRAY` | Array of strings |
| `INTEGER_ARRAY` | Array of integers |
| `FLOAT_ARRAY` | Array of decimals |
| `BOOLEAN_ARRAY` | Array of booleans |
| `UUID_ARRAY` | Array of UUIDs |

---

## Length Constraints

Add `minlength` and `maxlength` to enforce size limits:

```typescript
input: {
  password: {
    type: 'STRING',
    minlength: 8,    // At least 8 characters
    maxlength: 100   // No more than 100 characters
  },
  tags: {
    type: 'STRING_ARRAY',
    minlength: 1,    // At least 1 item
    maxlength: 10    // No more than 10 items
  }
}
```

---

## Complete Example

```typescript
await ductape.product.features.create({
  name: 'Create User',
  tag: 'create-user',
  description: 'Creates a new user account',
  input_type: 'JSON',
  input: {
    email: { type: 'EMAIL_STRING' },
    username: { type: 'NOSPACES_STRING', minlength: 3, maxlength: 20 },
    password: { type: 'STRING', minlength: 8 },
    age: { type: 'INTEGER' },
    newsletter: { type: 'BOOLEAN' }
  },
  sequence: [/* ... */],
  output: {/* ... */}
});
```

When running this feature:

```typescript
// This will pass validation
await ductape.feature.run({
  env: 'prd',
  product: 'my-app',
  tag: 'create-user',
  input: {
    email: 'john@example.com',
    username: 'johndoe',
    password: 'securepass123',
    age: 25,
    newsletter: true
  }
});

// This will fail - email is invalid
await ductape.feature.run({
  env: 'prd',
  product: 'my-app',
  tag: 'create-user',
  input: {
    email: 'not-an-email',  // Invalid!
    username: 'johndoe',
    password: 'securepass123',
    age: 25,
    newsletter: true
  }
});
```

---

## Tips

1. **Keep inputs flat** - Nested objects aren't supported; use separate fields instead
2. **Use specific types** - `EMAIL_STRING` catches invalid emails automatically
3. **Set reasonable limits** - Prevent abuse with `minlength` and `maxlength`
4. **Use descriptive names** - `customerEmail` is clearer than `e`

## See Also

- [Features Overview](./overview) - How features work
- [Defining Outputs](./output) - Map results to your response
- [Running Features](./run) - Execute features with input data
