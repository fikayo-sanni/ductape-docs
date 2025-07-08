---
sidebar_position: 3
---

# Data Piping

Data piping in Ductape enables dynamic referencing and transfer of data between feature inputs, event sequences, and outputs. It is a core mechanism for building flexible, reusable, and maintainable workflows. Data piping is used throughout the SDK, especially in `IFeatureEvent` and output mapping.

## Supported Data Piping Notations

You can use the following notations to reference data dynamically in your feature definitions:

| Notation                           | Description                                                              |
|------------------------------------|--------------------------------------------------------------------------|
| `$Input{field}`                    | Retrieves a value directly from the feature's input                      |
| `$Sequence{sequence}{event}{key}`  | Accesses a specific key from an event within a sequence                  |
| `$Variable{app_tag}{key}`          | References a variable associated with the app identified by `app_tag`    |
| `$Constant{app_tag}{key}`          | Accesses a constant defined for the app identified by `app_tag`          |
| `$Auth{auth_tag}{context}{token}`  | Retrieves an authentication token for secure communications              |

## How Data Piping Works

- **Inputs**: Use `$Input{field}` to reference initial feature input values.
- **Event Sequences**: Use `$Sequence{sequence}{event}{key}` to pass data between events in a sequence.
- **Variables & Constants**: Use `$Variable{app_tag}{key}` and `$Constant{app_tag}{key}` for dynamic and static values defined at the app level.
- **Authentication**: Use `$Auth{auth_tag}{context}{token}` to inject tokens into event inputs or headers.
- **Outputs**: Map results using any of the above notations to build structured, dynamic feature outputs.

## Example: Data Piping in Action

```typescript
const featureEvent: IFeatureEvent = {
  type: FeatureEventTypes.ACTION,
  event: 'process_payment',
  input: {
    userId: `$Input{user_id}`,
    orderId: `$Sequence{order_flow}{create_order}{order_id}`,
    token: `$Auth{bearer_access}{header}{token}`,
    email: `$Variable{user_service}{email}`,
    currency: `$Constant{payments}{currency_code}`,
  },
  retries: 2,
  allow_fail: false,
};
```

## Best Practices
- Use data piping to keep your features dynamic and reusable.
- Reference only the data you need to keep event inputs and outputs concise.
- Use variables and constants to avoid hardcoding values.
- Document your data piping usage for maintainability.
- Test your data flows to ensure correct resolution of all references.

## See Also
- [Features Overview](../../getting-started.md)
- [Sequencing Events](./event-sequences.md)
- [Event Types Overview](/category/event-types/)
