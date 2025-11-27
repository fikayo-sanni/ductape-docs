---
sidebar_position: 2
---

# Defining Inputs for Fallbacks

The input schema for a fallback in Ductape specifies the fields and types required by all fallback options. This schema is defined using `DataTypes` and can include constraints such as `maxlength`, `minlength`, etc.

## Example Input Schema
```typescript
const input = {
  firstname: { type: DataTypes.STRING },
  lastname: { type: DataTypes.STRING },
  amount: { type: DataTypes.NUMBER_STRING },
  accountNumber: { type: DataTypes.NUMBER_STRING },
  bankCode: { type: DataTypes.NUMBER_STRING },
  narration: { type: DataTypes.STRING },
  paystack_type: { type: DataTypes.NOSPACES_STRING, maxlength: 3, minlength: 3 },
  currency: { type: DataTypes.NOSPACES_STRING, maxlength: 3, minlength: 3 },
  reference: { type: DataTypes.UUID }
};
```

## How Input Is Used
- Each fallback option can map these input fields to its own input structure using Ductape's variable syntax (e.g., `$Input{field}`).
- Ductape validates the input against the schema before executing the fallback.

## Best Practices
- Define all fields required by any fallback option in the input schema.
- Use constraints to ensure data quality and prevent errors.
- Document each field's purpose for maintainability. 