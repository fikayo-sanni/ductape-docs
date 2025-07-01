---
sidebar_position: 8
---

# Quotas

Quota events in Ductape are used to enforce usage limits and track consumption of resources or features within your product. They help prevent overuse, manage rate limits, and ensure fair access to services by defining and checking quotas as part of your workflow.

## What is a Quota Event?

A quota event is defined using the `IFeatureEvent` type from the SDK, with `type` set to `FeatureEventTypes.QUOTA`. You specify the quota resource to check or increment, and Ductape automatically manages the logic for quota enforcement and tracking.

## IFeatureEvent Structure (Quota)

```typescript
interface IFeatureEvent {
  type: FeatureEventTypes;         // Required: Should be FeatureEventTypes.QUOTA
  event: string;                  // Required: The tag of the quota resource to use
  input: Record<string, unknown>; // Required: Input data for the quota event (e.g., userId, amount)
  retries: number;                // Required: Number of retry attempts if the quota check fails
  allow_fail: boolean;            // Required: Whether the event can fail without affecting the overall sequence
  // ...other optional fields
}
```

## Properties

| Property     | Type                      | Required | Description                                                                                       |
|--------------|---------------------------|----------|---------------------------------------------------------------------------------------------------|
| `type`       | `FeatureEventTypes`       | Yes      | Should be `FeatureEventTypes.QUOTA`.                                                              |
| `event`      | `string`                  | Yes      | The tag of the quota resource to check or increment.                                              |
| `input`      | `Record<string, unknown>` | Yes      | Input data for the quota event (e.g., userId, amount, resource).                                  |
| `retries`    | `number`                  | Yes      | Number of retry attempts allowed if the quota operation fails.                                     |
| `allow_fail` | `boolean`                 | Yes      | Whether the event can fail without affecting the overall sequence.                                 |

## Example: Quota Event

```typescript
const quotaEvent: IFeatureEvent = {
  type: FeatureEventTypes.QUOTA,
  event: 'monthly_api_limit',
  input: {
    userId: '$Input{userId}',
    amount: 1, // Number of units to consume
  },
  retries: 1,
  allow_fail: false,
};
```

## How Quota Events Work
- You define the quota event and its input as you would for a feature event.
- Ductape checks or increments the specified quota resource for the given input (e.g., user, team, or API key).
- If the quota is exceeded, the event can fail or trigger fallback logic, depending on your configuration.

## Best Practices
- Use quota events to enforce fair usage and prevent abuse of your product's features.
- Clearly define quota resources and document their intended limits.
- Set `retries` and `allow_fail` based on your tolerance for quota failures.
- Monitor quota usage and adjust limits as needed to balance user experience and resource constraints.

## See Also
- [Features Overview](../../../getting-started.md)
- [Event Types Overview](../)
- [Data Piping](../data-piping.md) 