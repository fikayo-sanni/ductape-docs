---
sidebar_position: 3
---

# Defining Outputs

Outputs define what data your feature returns after execution. You map values from your inputs and event results into a structured response.

## Basic Structure

```typescript
output: {
  userId: '$Sequence{main}{create-user}{id}',
  email: '$Input{email}',
  status: 'success'
}
```

---

## Mapping Syntax

Use these patterns to pull values from different sources:

| Syntax | What It Does | Example |
|--------|--------------|---------|
| `$Input{field}` | Gets a value from the input | `$Input{email}` |
| `$Sequence{seq}{event}{field}` | Gets a result from an event | `$Sequence{main}{create-user}{id}` |
| `$Variable{app}{key}` | Gets an app variable | `$Variable{stripe}{api_version}` |
| `$Constant{app}{key}` | Gets an app constant | `$Constant{config}{currency}` |
| `$Session{tag}{field}` | Gets session data | `$Session{user}{name}` |

---

## Examples

### Simple Output

Return the input email and a result from the first event:

```typescript
output: {
  email: '$Input{email}',
  userId: '$Sequence{main}{create-user}{id}'
}
```

### Nested Output

Create a structured response with nested objects:

```typescript
output: {
  user: {
    id: '$Sequence{main}{create-user}{id}',
    email: '$Input{email}'
  },
  payment: {
    chargeId: '$Sequence{main}{charge-card}{id}',
    amount: '$Input{amount}',
    currency: '$Constant{payments}{default_currency}'
  },
  status: 'completed'
}
```

### Using Event Results

When an event runs, its response is stored and can be referenced:

```typescript
// If the create-user event returns: { id: 'usr_123', created_at: '2024-01-15' }

output: {
  userId: '$Sequence{main}{create-user}{id}',           // 'usr_123'
  createdAt: '$Sequence{main}{create-user}{created_at}' // '2024-01-15'
}
```

---

## Complete Example

```typescript
await ductape.product.features.create({
  name: 'Process Order',
  tag: 'process-order',
  description: 'Creates order and charges payment',
  input_type: 'JSON',
  input: {
    customerId: { type: 'STRING' },
    amount: { type: 'FLOAT' },
    items: { type: 'ARRAY' }
  },
  sequence: [
    {
      tag: 'main',
      events: [
        {
          type: 'database_action',
          event: 'orders-db:create-order',
          input: {
            data: {
              customer_id: '$Input{customerId}',
              total: '$Input{amount}'
            }
          },
          retries: 1,
          allow_fail: false
        },
        {
          type: 'action',
          app: 'stripe',
          event: 'create-charge',
          input: {
            body: { amount: '$Input{amount}' }
          },
          retries: 3,
          allow_fail: false
        }
      ]
    }
  ],
  output: {
    order: {
      id: '$Sequence{main}{create-order}{id}',
      customerId: '$Input{customerId}'
    },
    payment: {
      chargeId: '$Sequence{main}{create-charge}{id}',
      amount: '$Input{amount}'
    },
    status: 'success'
  }
});
```

---

## Tips

1. **Only include what you need** - Don't expose internal data unnecessarily
2. **Use clear field names** - Match your API contract
3. **Static values work too** - `status: 'success'` is valid
4. **Nest for clarity** - Group related fields together

## See Also

- [Features Overview](./overview) - How features work
- [Defining Inputs](./inputs) - Input validation and types
- [Running Features](./run) - Execute features and get results
