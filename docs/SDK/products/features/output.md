---
sidebar_position: 4
---

# Defining Output

In Ductape, defining the output structure of a feature is essential for specifying the expected result or data format produced by a feature's execution. Outputs in Ductape can dynamically reference values generated during the feature's event sequence, using a specific notation to retrieve values from inputs and previous events in the sequence.

## Sample Output Definition

The following example demonstrates a typical output structure:

```typescript
{
    name: `$Input{name}`,   // Retrieves the "name" field from the initial input
    details:  {
        transaction_id: `$Sequence{process_payments}{debit_payment}{trx_id}`,   // From event within sequence
        timestamp: `$Sequence{process_payments}{settle_payment}{timestamp}`,   // From another sequence event
        user_role: `$Variable{user_sercice}{role}`,    // Dynamic value from 'user_service' app variable
        currency: `$Constant{payments}{currency_code}`    // Constant value from 'payments' app
    }
}
```

In this example:

- **`$Input{name}`**: References a value from the initial feature input (`name` field).
- **`$Sequence{process_payments}{debit_payment}{trx_id}`**: Retrieves `trx_id` from a specific event (`debit_payment`) within a sequence (`process_payments`).
- **`$Sequence{process_payments}{settle_payment}{timestamp}`**: Accesses `timestamp` from the `settle_payment` event within the `process_payments` sequence.
- **`$Variable{user_service}{role}`**: Pulls the `role` value from a variable defined within the `user_service` app, which can dynamically change depending on the app’s state or configuration.
- **`$Constant{payments}{currency_code}`**: Retrieves the `currency_code` value, which is a constant defined in the `payments` app, remaining static across uses.

## Output Notation and Structure

| Notation                           | Description                                                              |
|------------------------------------|--------------------------------------------------------------------------|
| `$Input{field}`                    | Retrieves a value directly from the feature's input                      |
| `$Sequence{sequence}{event}{key}`  | Accesses a specific key from an event within a sequence                  |
| `$Variable{app_tag}{key}`          | References a variable associated with the app identified by `app_tag`    |
| `$Constant{app_tag}{key}`          | Accesses a constant defined for the app identified by `app_tag`          |

By using `$Variable` and `$Constant` along with `$Input` and `$Sequence`, you can configure feature outputs to include dynamically set values and fixed constants, making output definitions both adaptable and predictable. This enables robust, complex outputs that adapt to varying conditions and setups within Ductape’s environment.