---
sidebar_position: 3
---

# Data Piping

Data piping is a methodology used in Ductape to enable seamless communication and data exchange between various elements of your application, including inputs, sequences, events, and outputs. It allows for dynamic data manipulation, ensuring that information flows correctly through your system.

## Overview of Data Piping

In the context of Ductape, data piping serves the following purposes:

- **Dynamic Data Management**: Allows the system to reference and use variable data dynamically.
- **Inter-component Communication**: Facilitates the exchange of information between different components such as events, actions, and notifications.
- **Error Handling**: Ensures that systems can manage failures and retries gracefully through defined structures.
- **Scalability and Flexibility**: Provides a flexible framework that can adapt to various feature requirements and use cases.

## Key Components of Data Piping

Data piping involves several key components:

1. **Variables**: Represent dynamic data elements that can be referenced throughout the application. They can hold values such as user input, API responses, or system-generated data.

   **Syntax**: 
   - `$Variable{app_tag}{key}`: Fetches a variable defined in the context of a specific application.
   - Example: `$Variable{payment_service}{transaction_id}`.

2. **Constants**: Fixed values that do not change during the execution of the application. Constants can be used for predefined settings or configurations.

   **Syntax**:
   - `$Constant{app_tag}{key}`: Fetches a constant value defined in the application context.
   - Example: `$Constant{email_service}{support_email}`.

3. **Authentication**: Mechanism to generate and manage authentication tokens for secure communications.

   **Syntax**:
   - `$Auth{auth_tag}{context}{token}`: Retrieves an authentication token based on the specified context.
   - Example: `$Auth{bearer_access}{header}{token}`.

4. **Sequences**: Represent ordered sets of events that can pass data between each other, allowing for more complex interactions.

   **Syntax**:
   - `$Sequence{sequence_name}{event_name}{data_key}`: Fetches data from a specific event within a sequence.
   - Example: `$Sequence{order_processing}{process_order}{order_id}`.

5. **Events**: Actions or occurrences that can trigger specific behaviors in the application, such as notifications or API calls.

   **Event Types**: 
   - Action Events
   - Notification Events
   - Database Events
   - Job Events

## Data Flow Examples

### Example 1: Using Variables in Action Events

In an action event, you can utilize data piping to manage input parameters dynamically:

```typescript
const makePaymentEvent: IFeatureEvent = {
    app: 'payment_service',
    type: FeatureEventTypes.ACTION,
    event: 'process_payment',
    input: {
        query: {
            userId: `$Variable{user_service}{current_user_id}`, // Fetching current user ID dynamically
            amount: 100.00,
            currency: 'USD',
        },
        params: {
            paymentMethodId: `$Variable{payment_service}{preferred_payment_method_id}`, // Fetching preferred payment method dynamically
        },
        body: {
            orderId: `$Sequence{order_processing}{create_order}{order_id}`, // Fetching order ID from a sequence
            description: 'Payment for order', 
        },
        headers: {
            Authorization: `$Auth{bearer_access}{header}{token}`, // Authorization token
        },
    },
    retries: 3,
    allow_fail: false,
};
```

### Example 2: Using Constants in Notification Events

Constants can be used to ensure consistent values across notifications:

```typescript
const sendNotificationEvent: IFeatureEvent = {
    type: FeatureEventTypes.NOTIFICATION,
    event: 'send_email_notification',
    input: {
        slug: `$Variable{notification_service}{slug}`,
        email: {
            to: `$Variable{user_service}{user_email}`, // Fetching user email dynamically
            subject: `$Constant{email_service}{default_subject}`, // Using a constant subject
            body: {
                message: `Hello, your order #${$Sequence{order_processing}{order_status}{order_id}} is being processed.` // Combining sequence and variables
            },
        },
    },
    retries: 2,
    allow_fail: true,
};
```

### Example 3: Utilizing Sequences for Data Flow

Sequences enable complex data flow through multiple events:

```typescript
const orderProcessingSequence = [
    {
        type: FeatureEventTypes.ACTION,
        event: 'validate_order',
        input: {
            body: {
                orderId: `$Variable{order_service}{current_order_id}`,
            },
        },
        retries: 1,
        allow_fail: false,
    },
    {
        type: FeatureEventTypes.NOTIFICATION,
        event: 'send_confirmation_email',
        input: {
            email: {
                to: `$Variable{user_service}{user_email}`,
                subject: `$Constant{email_service}{confirmation_subject}`,
                body: {
                    message: `Your order #${$Sequence{order_processing}{validate_order}{validated_order_id}} has been validated.`,
                },
            },
        },
        retries: 2,
        allow_fail: false,
    },
];
```

## Conclusion

Data piping in Ductape provides a robust and flexible framework for managing data flow within your applications. By using variables, constants, authentication tokens, sequences, and events, developers can create dynamic, responsive systems that ensure data integrity and facilitate communication across various components. This methodology not only enhances functionality but also improves maintainability and scalability in application design.
