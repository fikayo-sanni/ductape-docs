---
sidebar_position: 7
---

# Fallbacks

Fallback events in Ductape enable resilient workflows by automatically switching to backup providers if the primary one fails. Unlike manual fallback logic, you simply define the input for the event, and Ductape handles provider selection and failover behind the scenes.

## What is a Fallback Event?

A fallback event is defined similarly to a feature event, using the `IFeatureEvent` type from the SDK, but with `type` set to `FeatureEventTypes.FALLBACK`. You provide the required input, and Ductape manages which provider to use based on availability and health.

## IFeatureEvent Structure (Fallback)

```typescript
interface IFeatureEvent {
  type: FeatureEventTypes;         // Required: Should be FeatureEventTypes.FALLBACK
  event: string;                  // Required: The tag of the fallback resource to use
  input: Record<string, unknown>; // Required: Input data for the fallback event
  retries: number;                // Required: Number of retry attempts if the fallback operation fails
  allow_fail: boolean;            // Required: Whether the event can fail without affecting the overall sequence
  // ...other optional fields
}
```

## Properties

| Property     | Type                      | Required | Description                                                                                       |
|--------------|---------------------------|----------|---------------------------------------------------------------------------------------------------|
| `type`       | `FeatureEventTypes`       | Yes      | Should be `FeatureEventTypes.FALLBACK`.                                                           |
| `event`      | `string`                  | Yes      | The tag of the fallback resource to use.                                                          |
| `input`      | `Record<string, unknown>` | Yes      | Input data for the fallback event.                                                                |
| `retries`    | `number`                  | Yes      | Number of retry attempts allowed if the fallback operation fails.                                  |
| `allow_fail` | `boolean`                 | Yes      | Whether the event can fail without affecting the overall sequence.                                 |

## Example: Fallback Event

```typescript
const fallbackEvent: IFeatureEvent = {
  type: FeatureEventTypes.FALLBACK,
  event: 'payment_fallback',
  input: {
    amount: 1000,
    currency: 'USD',
    userId: '$Input{userId}',
  },
  retries: 2,
  allow_fail: false,
};
```

## How Fallback Works
- You define the fallback event and its input as you would for a feature event.
- Ductape automatically tries the primary provider and, if it fails, switches to the next available provider according to your product configuration.
- No need to specify fallback options in the event itself—this is managed in the product setup.

## Best Practices
- Use fallback events for critical operations where high availability is required.
- Keep input definitions clear and consistent with your feature events.
- Set `retries` and `allow_fail` thoughtfully to control error handling and resilience.
- Document the purpose and expected result of each fallback event for maintainability.

## See Also
- [Features Overview](../../../getting-started.md)
- [Event Types Overview](/category/event-types)
- [Data Piping](../data-piping.md) 