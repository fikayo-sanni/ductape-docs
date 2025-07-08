---
sidebar_position: 5
---

# Features

A Feature event in Ductape allows you to invoke another feature as a subroutine within an event sequence. This enables modular, reusable workflows and helps you compose complex logic by chaining features together.

## What is a Feature Event?

A Feature event is defined using the `IFeatureEvent` type from the SDK, with `type` set to `FeatureEventTypes.FEATURE`. It specifies the feature to invoke and the input to pass to it.

## IFeatureEvent Structure (Feature)

```typescript
interface IFeatureEvent {
  type: FeatureEventTypes;         // Required: Should be FeatureEventTypes.FEATURE
  event: string;                  // Required: The tag of the feature to invoke
  input: Record<string, unknown>; // Required: Input to pass to the feature
  retries: number;                // Required: Number of retry attempts if the feature fails
  allow_fail: boolean;            // Required: Whether the event can fail without affecting the overall sequence
  // ...other optional fields
}
```

## Properties

| Property     | Type                      | Required | Description                                                                                       |
|--------------|---------------------------|----------|---------------------------------------------------------------------------------------------------|
| `type`       | `FeatureEventTypes`       | Yes      | Should be `FeatureEventTypes.FEATURE`.                                                            |
| `event`      | `string`                  | Yes      | The tag of the feature to invoke.                                                                 |
| `input`      | `Record<string, unknown>` | Yes      | Input parameters to pass to the feature.                                                          |
| `retries`    | `number`                  | Yes      | Number of retry attempts allowed if the feature event fails.                                      |
| `allow_fail` | `boolean`                 | Yes      | Whether the event can fail without affecting the overall sequence.                                |

## Example: Feature Event

```typescript
const runSubFeatureEvent: IFeatureEvent = {
  type: FeatureEventTypes.FEATURE,
  event: 'calculate_discount', // Tag of the feature to invoke
  input: {
    userId: '$Input{user_id}',
    cartTotal: '$Input{cart_total}',
  },
  retries: 2,
  allow_fail: false,
};
```

## Best Practices
- Use feature events to encapsulate reusable logic and keep your main feature sequences clean.
- Pass only the necessary input to the sub-feature for clarity and maintainability.
- Set `retries` and `allow_fail` thoughtfully to control error handling and resilience.
- Document the purpose and expected result of each feature event for maintainability.

## See Also
- [Features Overview](../../../getting-started.md)
- [Event Types Overview](/category/event-types)
- [Data Piping](../data-piping.md)


