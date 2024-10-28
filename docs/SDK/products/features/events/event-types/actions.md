---
sidebar_position: 1
---

# Actions

Actions in the Features context are specifically designed for communicating with the resources of APIs and services, both internal and external. They allow you to define how your feature interacts with other systems, facilitating data exchange and execution of operations such as creating, retrieving, updating, or deleting resources.

## Overview of Action Events

An **Action Event** specifies the necessary parameters for external API calls, manages authentication, and defines the input structure. It plays a crucial role in ensuring smooth data flow between your feature and external systems, leveraging the data piping methodology established earlier.

### Action Event Interface

``` typescript
interface IFeatureEvent {
  app: string;                   // Required: The app tag identifying the application context for the event.
  type: FeatureEventTypes;       // Required: Specifies the type of event (should be FeatureEventTypes.ACTION).
  event: string;                 // Required: The action tag that uniquely identifies the specific action being performed.
  input: {                       // Required: Input parameters for the event, sample can be fetched from CLI.
    query?: Record<string, unknown>;   // Optional: Query parameters for the event.
    params?: Record<string, unknown>;  // Optional: Route parameters for the event.
    body?: Record<string, unknown>;    // Optional: Body of the request for the event.
    headers?: Record<string, unknown>; // Optional: Headers for the event.
  };
  retries: number;               // Required: Number of retry attempts if the action fails.
  allow_fail: boolean;           // Required: Indicates if the event can fail without affecting the overall sequence.
}
```

### Properties Table

| Property    | Type                                    | Required | Description                                                                                     |
|-------------|-----------------------------------------|----------|-------------------------------------------------------------------------------------------------|
| `app`       | `string`                               | Yes      | The app tag that identifies the application context for the event.                             |
| `type`      | `FeatureEventTypes`                    | Yes      | Specifies the type of event, should be `FeatureEventTypes.ACTION`.                             |
| `event`     | `string`                               | Yes      | The action tag that uniquely identifies the specific action being performed.                    |
| `input`     | `{ query?, params?, body?, headers? }` | Yes      | Input parameters for the event, which can include:<br/>- `query`: Optional query parameters.<br/>- `params`: Optional route parameters.<br/>- `body`: Optional body of the request.<br/>- `headers`: Optional headers for the event. |
| `retries`   | `number`                               | Yes      | The number of retry attempts allowed if the action fails.                                      |
| `allow_fail`| `boolean`                              | Yes      | Indicates whether the event can fail without affecting the overall sequence.                   |

### Sample Action Event

Here is an example of a sample action event for processing a payment:

```typescript
const makePaymentEvent: IFeatureEvent = {
    app: 'payment_service', // The app tag for the payment service.
    type: FeatureEventTypes.ACTION, // The event type.
    event: 'process_payment', // The action tag for processing payments.
    input: {
        query: {
            userId: '12345', // Query parameter identifying the user.
            amount: 100.00,  // Amount to be charged.
            currency: 'USD', // Currency of the payment.
        },
        params: {
            paymentMethodId: 'card_67890', // Route parameter for the payment method.
        },
        body: {
            orderId: 'order_abc123', // Order ID for the transaction.
            description: 'Payment for order abc123', // Description of the transaction.
        },
        headers: {
            Authorization: `$Auth{bearer_access}{header}{token}`, // Authorization token for the payment service.
            'Content-Type': 'application/json', // Content type for the request.
        },
    },
    retries: 3, // Number of retry attempts if the action fails.
    allow_fail: false, // The action cannot fail without affecting the overall sequence.
};
```

### Conclusion

By using Action Events, you can effectively manage how your features interact with external services, ensuring proper data exchange and error handling in the process. This structure facilitates the creation of robust, reliable features that seamlessly integrate with other systems.