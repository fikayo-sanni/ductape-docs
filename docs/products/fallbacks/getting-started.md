---
sidebar_position: 1
---

# Fallbacks in Ductape

Fallbacks in Ductape help your workflows stay reliable even when something goes wrong. 
You can define a list of providers or actions in the order that you want them tried. If one fails, for example if a payments API goes down, Ductape will automatically try the next one and keep going until one succeeds or all options are exhausted. 

## What is a Fallback?
A fallback is defined at the product level and includes:
- A unique `tag`, `name`, and optional `description`.
- An `input` schema describing the expected input fields and their types (using `DataTypes`).
- An `options` array, where each option represents a provider or action to attempt, with its own event, input/output mapping, retries, and type.

**Full Fallback Structure Example:**
```typescript
const paymentFallback = {
  tag: 'payments',
  name: 'Payments',
  description: 'Paystack and Flutterwave Fallback',
  input: {
    firstname: { type: DataTypes.STRING },
    lastname: { type: DataTypes.STRING },
    amount: { type: DataTypes.NUMBER_STRING },
    accountNumber: { type: DataTypes.NUMBER_STRING },
    bankCode: { type: DataTypes.NUMBER_STRING },
    narration: { type: DataTypes.STRING },
    paystack_type: { type: DataTypes.NOSPACES_STRING, maxlength: 3, minlength: 3 },
    currency: { type: DataTypes.NOSPACES_STRING, maxlength: 3, minlength: 3 },
    reference: { type: DataTypes.UUID }
  },
  options: [
    {
      event: 'paystack-funds-transfer',
      input: {
        firstname: '$Input{firstname}',
        lastname: '$Input{lastname}',
        accountNumber: '$Input{accountNumber}',
        bankCode: '$Input{bankCode}',
        currency: '$Uppercase($Input{currency})',
        type: '$Input{paystack_type}',
        amount: '$Input{amount}',
        narration: '$Input{narration}',
      },
      output: {
        provider: 'paystack',
        amount: '$Input{amount}',
        currency: '$Uppercase($Input{currency})',
        transactionId: '$Response{transfer_code}',
      },
      retries: 1,
      type: FeatureEventTypes.FEATURE
    },
    {
      app: 'ductape:flutterwave:ductape',
      type: FeatureEventTypes.ACTION,
      event: 'initiate_a_transfer',
      input: {
        params: {},
        body: {
          account_bank: '$Input{bankCode}',
          account_number: '$Input{accountNumber}',
          amount: '$Input{amount}',
          narration: '$Input{narration}',
          currency: '$Uppercase($Input{currency})',
          reference: '$Input{reference}',
          callback_url: '',
          debit_currency: '$Uppercase($Input{currency})',
        },
        query: {},
        headers: {
          'Content-Type': 'application/json',
          Authorization: '$Auth{bearer_token}{headers}{Authorization}'
        }
      },
      output: {
        provider: 'flutterwave',
        amount: '$Input{amount}',
        currency: '$Uppercase($Input{currency})',
        transactionId: '$Response{initiate_a_transfer}{data}{id}',
      },
      retries: 1
    }
  ]
};
```

## How Fallbacks Are Used in Workflows
- You define the fallback in your product configuration as above.
- In your event sequence, reference the fallback by its `tag` in a fallback event.
- Ductape will attempt each option in order, using the input/output mappings and retry logic you define.

## See Also
- [Fallback Event Type](../features/events/event-types/fallbacks.md)
- [Defining Inputs for Fallbacks](input.md)
- [Defining Outputs for Fallbacks](output.md)