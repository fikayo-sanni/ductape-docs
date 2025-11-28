---
sidebar_position: 4
---

# Data Validation

Ductape lets you define validation rules for Action inputs, ensuring data consistency and integrity before requests are sent.

## Overview

When you import Actions, Ductape automatically detects input parameters from the request body, query strings, headers, and route parameters. You can then configure validation rules to:

- Enforce required fields
- Set minimum and maximum lengths
- Define data types
- Provide default values
- Add decorators for display formatting

## Prerequisites

Before configuring validation, ensure you have:

1. The Ductape SDK installed and initialized
2. An App with imported Actions

```ts
import Ductape from '@ductape/sdk';

const ductape = new Ductape({
  workspace_id: 'your-workspace-id',
  user_id: 'your-user-id',
  private_key: 'your-public-key',
});
```

## Validation Properties

| Field | Type | Description |
|-------|------|-------------|
| `description` | string | Explanation of the field's purpose |
| `required` | boolean | Whether the field is mandatory |
| `maxLength` | number | Maximum allowed length for strings |
| `minLength` | number | Minimum allowed length for strings |
| `decorator` | string | Text or symbol displayed alongside the value |
| `decoratorPosition` | DecoratorPositions | Position of the decorator (PREPEND, APPEND, or UNSET) |
| `type` | DataTypes | The expected data type |
| `defaultValue` | string \| number \| boolean | Default value if none is provided |
| `sampleValue` | string \| number \| object | Example demonstrating expected format |

## Selector Format

To update validation, you need to specify which field you're targeting using a selector string:

| Selector | Target |
|----------|--------|
| `$Body{action_tag}{...}{key}` | Request body fields |
| `$Query{action_tag}{...}{key}` | URL query parameters |
| `$Params{action_tag}{...}{key}` | Route parameters |
| `$Header{action_tag}{...}{key}` | HTTP headers |

### Nested Fields

For nested objects, chain the keys:

```
$Body{createUser}{user}{profile}{firstName}
```

This targets `body.user.profile.firstName` in the `createUser` Action.

## Updating Validation Rules

Use `ductape.apps.validation()` to set validation rules:

```ts
await ductape.apps.validation(selector, validationRules);
```

### Example: Username Validation

```ts
await ductape.apps.validation('$Body{createUser}{user}{username}', {
  description: 'Username for the new account',
  required: true,
  type: 'nospaces_string',
  maxLength: 30,
  minLength: 3,
  defaultValue: '',
});
```

### Example: Price Field with Decorator

```ts
import { DecoratorPositions } from '@ductape/types';

await ductape.apps.validation('$Body{createProduct}{product}{price}', {
  description: 'Price of the product in USD',
  required: true,
  type: 'float',
  decorator: '$',
  decoratorPosition: DecoratorPositions.PREPEND,
  defaultValue: 0.0,
});
```

### Example: Array of Tags

```ts
await ductape.apps.validation('$Body{createBlogPost}{post}{tags}', {
  description: 'Tags associated with the blog post',
  type: 'array-string',
  defaultValue: [],
});
```

### Example: Required UUID Parameter

```ts
await ductape.apps.validation('$Params{getUser}{id}', {
  type: 'uuid',
  required: true,
  description: 'Unique identifier for the user',
});
```

## Data Types

| Type | Value | Description | Example |
|------|-------|-------------|---------|
| STRING | `"string"` | General string | `"Hello World"` |
| NOSPACES_STRING | `"nospaces_string"` | String without spaces | `"NoSpaces"` |
| EMAIL_STRING | `"email_string"` | Valid email format | `"user@example.com"` |
| NUMBER_STRING | `"numberstring"` | Number in string format | `"12345"` |
| INTEGER | `"number"` | Whole number | `42` |
| FLOAT | `"float"` | Floating-point number | `3.14` |
| DOUBLE | `"double"` | Double-precision number | `123.456789` |
| UUID | `"uuid"` | UUID format | `"550e8400-e29b-41d4..."` |
| ARRAY | `"array"` | General array | `[1, "text", true]` |
| OBJECT | `"object"` | Object structure | `{ key: "value" }` |
| BOOLEAN | `"boolean"` | Boolean value | `true` |
| STRING_ARRAY | `"array-string"` | Array of strings | `["apple", "banana"]` |
| INTEGER_ARRAY | `"array-number"` | Array of integers | `[1, 2, 3]` |
| FLOAT_ARRAY | `"array-float"` | Array of floats | `[1.1, 2.2, 3.3]` |
| DOUBLE_ARRAY | `"array-double"` | Array of doubles | `[1.123456, 2.654321]` |
| UUID_ARRAY | `"array-uuid"` | Array of UUIDs | `["550e8400-..."]` |
| BOOLEAN_ARRAY | `"array-boolean"` | Array of booleans | `[true, false]` |

## Decorator Positions

| Position | Value | Description | Example |
|----------|-------|-------------|---------|
| PREPEND | `"BEFORE"` | Decorator appears before value | `$100` |
| APPEND | `"AFTER"` | Decorator appears after value | `100$` |
| UNSET | `""` | No decorator | `100` |

## Complete Example

Here's a complete example setting up validation for a user registration Action:

```ts
import Ductape from '@ductape/sdk';
import { DecoratorPositions } from '@ductape/types';

async function setupValidation() {
  const ductape = new Ductape({
    workspace_id: 'your-workspace-id',
    user_id: 'your-user-id',
    private_key: 'your-public-key',
  });

  // Username validation
  await ductape.apps.validation('$Body{registerUser}{username}', {
    description: 'Unique username for the account',
    required: true,
    type: 'nospaces_string',
    minLength: 3,
    maxLength: 20,
  });

  // Email validation
  await ductape.apps.validation('$Body{registerUser}{email}', {
    description: 'Email address for account verification',
    required: true,
    type: 'email_string',
  });

  // Age validation
  await ductape.apps.validation('$Body{registerUser}{age}', {
    description: 'User age (must be 18 or older)',
    required: false,
    type: 'number',
    defaultValue: 18,
  });

  // Roles validation
  await ductape.apps.validation('$Body{registerUser}{roles}', {
    description: 'User roles for access control',
    required: false,
    type: 'array-string',
    defaultValue: ['user'],
  });

  console.log('Validation rules configured successfully');
}

setupValidation().catch(console.error);
```

## Best Practices

### Use Meaningful Descriptions

```ts
// Good
await ductape.apps.validation('$Body{createOrder}{total}', {
  description: 'Total order amount including tax and shipping',
});

// Avoid
await ductape.apps.validation('$Body{createOrder}{total}', {
  description: 'Total', // Too vague
});
```

### Set Appropriate Constraints

```ts
// Prevent data overflow
await ductape.apps.validation('$Body{createPost}{title}', {
  maxLength: 200,
  minLength: 1,
  required: true,
});
```

### Use Default Values for Optional Fields

```ts
await ductape.apps.validation('$Body{createUser}{status}', {
  required: false,
  defaultValue: 'pending',
});
```

### Choose the Correct Data Type

```ts
// Use specific types for better validation
await ductape.apps.validation('$Body{sendEmail}{to}', {
  type: 'email_string', // Not just 'string'
  required: true,
});
```

## Next Steps

- [Running Actions](./run-actions) - Execute Actions with validated inputs
- [Managing Actions](./managing-actions) - Update Action configuration
- [Actions Overview](./overview) - Return to Actions overview

## See Also

- [Getting Started with Apps](/apps/getting-started) - Create and configure Apps
- [Constants & Variables](/apps/constants-variables) - Dynamic configuration values
