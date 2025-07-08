---
sidebar_position: 1
---

# Actions

Action events in Ductape are used to interact with APIs and services, both internal and external. They enable your feature to perform operations such as creating, retrieving, updating, or deleting resources by making API calls or invoking service actions.

## What is an Action Event?

An action event is defined using the `IFeatureEvent` type from the SDK, with `type` set to `FeatureEventTypes.ACTION`. It specifies the parameters for an API call, manages authentication, and defines the input structure for the event.

## IFeatureEvent Structure (Action)

```typescript
interface IFeatureEvent {
  app: string;                   // Required: The app access tag
  type: FeatureEventTypes;       // Required: Should be FeatureEventTypes.ACTION
  event: string;                 // Required: The action tag for the operation
  input: {
    query?: Record<string, unknown>;
    params?: Record<string, unknown>;
    body?: Record<string, unknown>;
    headers?: Record<string, unknown>;
  };
  retries: number;               // Required: Number of retry attempts if the action fails
  allow_fail: boolean;           // Required: Whether the event can fail without affecting the overall sequence
  // ...other optional fields
}
```

## Properties

| Property     | Type                                    | Required | Description                                                                                     |
|--------------|-----------------------------------------|----------|-------------------------------------------------------------------------------------------------|
| `app`        | `string`                                | Yes      | The app tag that identifies the application context for the event.                              |
| `type`       | `FeatureEventTypes`                     | Yes      | Should be `FeatureEventTypes.ACTION`.                                                           |
| `event`      | `string`                                | Yes      | The action tag that uniquely identifies the specific action being performed.                    |
| `input`      | `{ query?, params?, body?, headers? }`  | Yes      | Input parameters for the event.                                                                 |
| `retries`    | `number`                                | Yes      | Number of retry attempts allowed if the action fails.                                           |
| `allow_fail` | `boolean`                               | Yes      | Whether the event can fail without affecting the overall sequence.                              |

## Example: Action Event

```typescript
const makePaymentEvent: IFeatureEvent = {
  app: 'payment_service',
  type: FeatureEventTypes.ACTION,
  event: 'process_payment',
  input: {
    query: {
      userId: '12345',
      amount: 100.00,
      currency: 'USD',
    },
    params: {
      paymentMethodId: 'card_67890',
    },
    body: {
      orderId: 'order_abc123',
      description: 'Payment for order abc123',
    },
    headers: {
      Authorization: `$Auth{bearer_access}{header}{token}`,
      'Content-Type': 'application/json',
    },
  },
  retries: 3,
  allow_fail: false,
};
```

## Best Practices
- Use descriptive action tags and app tags for clarity.
- Leverage data piping in input fields to dynamically reference data from previous events or feature inputs.
- Set `retries` and `allow_fail` thoughtfully to control error handling and resilience.
- Document the purpose and expected result of each action event for maintainability.

## See Also
- [Features Overview](../../../getting-started.md)
- [Event Types Overview](/category/event-types)
- [Data Piping](../data-piping.md)