---
sidebar_position: 4
---

# Defining Output

Defining the output structure of a feature in Ductape specifies the expected result or data format produced by a feature's execution. The output is described using the `output` field of `IProductFeature`:

```typescript
output: Record<string, string | Record<string, string | object>>
```

Outputs can dynamically reference values generated during the feature's event sequence, allowing you to map results from inputs, events, variables, and constants into a structured output object.

## Output Mapping Syntax

You can use special notations to reference values from different sources:

| Notation                           | Description                                                              |
|------------------------------------|--------------------------------------------------------------------------|
| `$Input{field}`                    | Retrieves a value directly from the feature's input                      |
| `$Sequence{sequence}{event}{key}`  | Accesses a specific key from an event within a sequence                  |
| `$Variable{app_tag}{key}`          | References a variable associated with the app identified by `app_tag`    |
| `$Constant{app_tag}{key}`          | Accesses a constant defined for the app identified by `app_tag`          |

## Example: Output Definition

```typescript
{
  name: `$Input{name}`,   // Retrieves the "name" field from the initial input
  details:  {
    transaction_id: `$Sequence{process_payments}{debit_payment}{trx_id}`,
    timestamp: `$Sequence{process_payments}{settle_payment}{timestamp}`,
    user_role: `$Variable{user_service}{role}`,
    currency: `$Constant{payments}{currency_code}`
  }
}
```

In this example:
- **`$Input{name}`**: References a value from the initial feature input (`name` field).
- **`$Sequence{process_payments}{debit_payment}{trx_id}`**: Retrieves `trx_id` from a specific event within a sequence.
- **`$Variable{user_service}{role}`**: Pulls the `role` value from a variable defined within the `user_service` app.
- **`$Constant{payments}{currency_code}`**: Retrieves a constant value from the `payments` app.

> **Tip:** You can nest objects in the output to create structured results, but the values should be mapped using the supported notations above.

## Best Practices
- Use clear and descriptive output field names that match your API or business requirements.
- Map only the necessary values to the output to keep responses concise.
- Use the output mapping notations to dynamically reference data from inputs, events, variables, and constants.
- Document the purpose of each output field for maintainability.

## See Also
- [Defining Inputs](./inputs.md)
- [Features Overview](./getting-started.md)
- [Event Types Overview](./events/event-types/)