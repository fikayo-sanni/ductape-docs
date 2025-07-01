---
sidebar_position: 3
---

# Defining Outputs for Fallbacks

In Ductape, outputs are defined per option within a fallback. Each option specifies its own output mapping, which determines what data is made available if that option succeeds. Only the output of the successful (first non-failing) option is available for downstream workflow steps.

## Example: Outputs Per Option
```typescript
options: [
  {
    event: 'paystack-funds-transfer',
    // ...
    output: {
      provider: 'paystack',
      amount: '$Input{amount}',
      currency: '$Uppercase($Input{currency})',
      transactionId: '$Response{transfer_code}',
    },
    // ...
  },
  {
    app: 'ductape:flutterwave:ductape',
    // ...
    output: {
      provider: 'flutterwave',
      amount: '$Input{amount}',
      currency: '$Uppercase($Input{currency})',
      transactionId: '$Response{initiate_a_transfer}{data}{id}',
    },
    // ...
  }
]
```

## Referencing Fallback Outputs
After the fallback event runs, you can reference the output fields from the successful option using the fallback tag and the correct variable syntax:

```typescript
const nextEvent = {
  input: {
    provider: '$Sequence{payments}{provider}',
    transactionId: '$Sequence{payments}{transactionId}',
    amount: '$Sequence{payments}{amount}',
  }
};
```

> **Note:** Use `$Sequence{fallbackTag}{field}` to access the output of a fallback event in subsequent workflow steps. The old `$Fallbacks{...}` syntax is not valid for this purpose.

## Best Practices
- Define output mappings for each option to be as consistent as possible, so downstream steps can reference outputs without conditional logic.
- Document the output structure for each option for clarity and maintainability.
- Only the output of the first successful option is available for downstream use. 