---
sidebar_position: 4
---

# Pre-Save Operations

Pre-save operations are transformations applied to your data **before** it's written to the database. They provide a powerful way to handle encryption, hashing, validation, sanitization, and custom transformations directly in your database operations.

## Overview

Pre-save operations support:

- **Encryption** - AES-256 encryption for sensitive data
- **Hashing** - One-way hashing for passwords (bcrypt, argon2, SHA)
- **Masking** - Mask sensitive data (credit cards, SSN, emails)
- **Validation** - Validate data before insert
- **Transformation** - Custom transformations
- **Sanitization** - Remove HTML/script tags
- **Normalization** - Normalize emails, phone numbers
- **Computed Fields** - Generate slugs, UUIDs, timestamps

## Basic Usage

### Insert with Pre-Save Operations

```typescript
import { PreSave } from '@ductape/sdk';

// Insert a user with password hashing and email normalization
const result = await ductape.databases.insert({
  table: 'users',
  data: {
    name: 'John Doe',
    email: 'John.Doe@Example.COM',
    password: 'secret123',
  },
  preSave: [
    PreSave.hash('password', { algorithm: 'bcrypt', saltRounds: 12 }),
    PreSave.normalizeEmail('email'),
    PreSave.trim('name'),
  ],
  returning: true,
});

// Result: password is hashed, email is "john.doe@example.com"
```

### Update with Pre-Save Operations

```typescript
await ductape.databases.update({
  table: 'users',
  data: {
    password: 'newpassword',
    bio: '<script>alert("xss")</script>My bio',
  },
  where: { id: userId },
  preSave: [
    PreSave.hash('password'),
    PreSave.sanitize('bio'),
  ],
});
```

## Available Operations

### Encryption

Encrypt sensitive data using AES-256. The encrypted value can be decrypted later.

```typescript
// Encrypt a field
await ductape.databases.insert({
  table: 'secrets',
  data: {
    api_key: 'sk_live_abc123',
    user_id: 1,
  },
  preSave: [
    PreSave.encrypt('api_key', {
      key: process.env.ENCRYPTION_KEY,
      algorithm: 'aes-256-gcm', // default
    }),
  ],
  preSaveConfig: {
    encryptionKey: process.env.ENCRYPTION_KEY, // Or set globally
  },
});
```

**Decrypting data:**

```typescript
import { decrypt } from '@ductape/sdk';

const result = await ductape.databases.query({
  table: 'secrets',
  where: { user_id: 1 },
});

const decryptedKey = decrypt(result.data[0].api_key, {
  key: process.env.ENCRYPTION_KEY,
});
```

### Hashing (Passwords)

One-way hashing for passwords and sensitive data that doesn't need to be decrypted.

```typescript
// Hash with bcrypt (recommended for passwords)
PreSave.hash('password', { algorithm: 'bcrypt', saltRounds: 12 })

// Hash with SHA-256 (for checksums, etc.)
PreSave.hash('checksum', { algorithm: 'sha256' })

// Available algorithms: 'bcrypt', 'argon2', 'sha256', 'sha512', 'md5'
```

**Verifying hashed passwords:**

```typescript
import { verifyHash } from '@ductape/sdk';

const user = await ductape.databases.query({
  table: 'users',
  where: { email: 'john@example.com' },
});

const isValid = verifyHash('user_password', user.data[0].password);
if (isValid) {
  // Password matches
}
```

### Masking

Mask sensitive data while preserving partial visibility.

```typescript
// Credit card: **** **** **** 1234
PreSave.mask('card_number', 'credit-card')

// SSN: ***-**-1234
PreSave.mask('ssn', 'ssn')

// Phone: ******1234
PreSave.mask('phone', 'phone')

// Email: j***@example.com
PreSave.mask('email', 'email')

// Custom masking
PreSave.mask('account', 'custom', {
  showFirst: 2,
  showLast: 4,
  maskChar: 'X',
})
// "AB12345678" → "ABXXXX5678"
```

**Store original value:**

```typescript
PreSave.mask('card_number', 'credit-card', {
  storeOriginalIn: 'card_number_encrypted',
})
// Original goes to card_number_encrypted (encrypt it too!)
```

### Validation

Validate data before it's written to the database.

```typescript
await ductape.databases.insert({
  table: 'users',
  data: {
    email: 'invalid-email',
    age: 15,
    role: 'superadmin',
  },
  preSave: [
    PreSave.validate('email', [
      { type: 'required' },
      { type: 'email', message: 'Please enter a valid email' },
    ]),
    PreSave.validate('age', [
      { type: 'min', value: 18, message: 'Must be 18 or older' },
      { type: 'max', value: 120 },
    ]),
    PreSave.validate('role', [
      { type: 'enum', value: ['user', 'admin', 'moderator'] },
    ]),
  ],
});
// Throws: "Validation failed: email: Please enter a valid email, age: Must be 18 or older"
```

**Available validation rules:**

| Rule | Value | Description |
|------|-------|-------------|
| `required` | - | Field must not be null/empty |
| `email` | - | Valid email format |
| `url` | - | Valid URL format |
| `minLength` | number | Minimum string length |
| `maxLength` | number | Maximum string length |
| `min` | number | Minimum numeric value |
| `max` | number | Maximum numeric value |
| `pattern` | regex | Match regex pattern |
| `enum` | array | Value must be in array |
| `type` | string | JavaScript type ('string', 'number', etc.) |
| `integer` | - | Must be an integer |
| `positive` | - | Must be positive number |
| `negative` | - | Must be negative number |
| `custom` | function | Custom validation function |

**Custom validation:**

```typescript
PreSave.validate('username', [
  {
    type: 'custom',
    validator: (value, record) => {
      return /^[a-z0-9_]+$/.test(value) && !value.startsWith('admin');
    },
    message: 'Username must be lowercase alphanumeric and cannot start with "admin"',
  },
])
```

### String Operations

```typescript
// Trim whitespace
PreSave.trim('name')

// Convert to lowercase
PreSave.lowercase('email')

// Convert to uppercase
PreSave.uppercase('country_code')

// Sanitize HTML (remove script tags, etc.)
PreSave.sanitize('bio')

// Truncate to max length
PreSave.truncate('description', 200, {
  suffix: '...',
  wordBoundary: true
})
```

### Normalization

```typescript
// Normalize email (lowercase, trim)
PreSave.normalizeEmail('email')
// "  John.Doe@EXAMPLE.COM  " → "john.doe@example.com"

// Normalize phone (remove formatting)
PreSave.normalizePhone('phone')
// "(555) 123-4567" → "5551234567"
// "+1 (555) 123-4567" → "+15551234567"
```

### Number Operations

```typescript
// Round to decimal places
PreSave.round('price', 2) // 19.999 → 20.00
PreSave.round('score', 0, 'floor') // 4.9 → 4
PreSave.round('rating', 1, 'ceil') // 4.01 → 4.1

// Clamp to range
PreSave.clamp('quantity', 0, 100) // -5 → 0, 150 → 100
```

### Generated Fields

```typescript
// Generate UUID
PreSave.uuid('id')

// Generate timestamp
PreSave.timestamp('created_at')

// Generate slug from another field
PreSave.slug('slug', 'title', {
  separator: '-',
  lowercase: true,
  maxLength: 50,
})
// "Hello World! This is Amazing" → "hello-world-this-is-amazing"
```

### Custom Transformations

```typescript
// Simple transformation
PreSave.transform('tags', (value) => {
  return value.split(',').map(t => t.trim().toLowerCase());
})

// With access to full record
PreSave.transform('full_name', (value, record) => {
  return `${record.first_name} ${record.last_name}`;
})

// Computed field from other fields
PreSave.compute('total', (record) => {
  return record.quantity * record.unit_price;
})
```

### Default Values

```typescript
// Static default
PreSave.default('status', 'pending')

// Dynamic default (using generator function)
{
  field: 'expires_at',
  type: PreSaveOperationType.DEFAULT,
  generator: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
}
```

## Configuration

### Global Configuration

Set default configuration for all pre-save operations:

```typescript
await ductape.databases.insert({
  table: 'users',
  data: userData,
  preSave: [...],
  preSaveConfig: {
    encryptionKey: process.env.ENCRYPTION_KEY,
    defaultHashAlgorithm: 'bcrypt',
    defaultSaltRounds: 12,
    throwOnValidationError: true, // default
  },
});
```

### Conditional Operations

Skip operations based on conditions:

```typescript
{
  field: 'password',
  type: PreSaveOperationType.HASH,
  algorithm: 'bcrypt',
  // Only hash if password is being updated
  condition: (record) => record.password !== undefined,
  skipIfNull: true,
  skipIfEmpty: true,
}
```

## Complete Example

Here's a complete example combining multiple pre-save operations:

```typescript
import { PreSave, PreSaveOperationType } from '@ductape/sdk';

// Create a user with comprehensive pre-save processing
const result = await ductape.databases.insert({
  table: 'users',
  data: {
    first_name: '  John  ',
    last_name: '  Doe  ',
    email: 'John.Doe@EXAMPLE.COM',
    password: 'secretpassword123',
    phone: '(555) 123-4567',
    bio: '<script>alert("xss")</script>I am a developer.',
    website: 'https://example.com',
    age: 25,
    credit_card: '4111111111111111',
  },
  preSave: [
    // Validation first
    PreSave.validate('email', [
      { type: 'required' },
      { type: 'email' },
    ]),
    PreSave.validate('password', [
      { type: 'minLength', value: 8, message: 'Password must be at least 8 characters' },
    ]),
    PreSave.validate('age', [
      { type: 'min', value: 18 },
    ]),
    PreSave.validate('website', [
      { type: 'url' },
    ]),

    // String normalization
    PreSave.trim('first_name'),
    PreSave.trim('last_name'),
    PreSave.normalizeEmail('email'),
    PreSave.normalizePhone('phone'),
    PreSave.sanitize('bio'),

    // Security
    PreSave.hash('password', { algorithm: 'bcrypt', saltRounds: 12 }),
    PreSave.mask('credit_card', 'credit-card', {
      storeOriginalIn: 'credit_card_encrypted',
    }),
    PreSave.encrypt('credit_card_encrypted'),

    // Generated fields
    PreSave.uuid('public_id'),
    PreSave.timestamp('created_at'),
    PreSave.slug('username', 'email', { maxLength: 30 }),

    // Computed fields
    PreSave.compute('full_name', (record) =>
      `${record.first_name} ${record.last_name}`
    ),
  ],
  preSaveConfig: {
    encryptionKey: process.env.ENCRYPTION_KEY,
  },
  returning: true,
});

console.log(result.data[0]);
// {
//   first_name: 'John',
//   last_name: 'Doe',
//   full_name: 'John Doe',
//   email: 'john.doe@example.com',
//   password: '$pbkdf2$12$...',  // hashed
//   phone: '5551234567',
//   bio: 'I am a developer.',
//   website: 'https://example.com',
//   age: 25,
//   credit_card: '************1111',  // masked
//   credit_card_encrypted: 'abc123...', // encrypted original
//   public_id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
//   username: 'john-doe-example-com',
//   created_at: '2024-01-15T10:30:00.000Z',
// }
```

## Operation Execution Order

Pre-save operations are automatically sorted and executed in this order:

1. **Default values** - Apply defaults first
2. **Computed fields** - Calculate derived values
3. **Validation** - Validate before transformations
4. **String operations** - trim, lowercase, uppercase, normalize
5. **Sanitization** - Clean HTML/scripts
6. **Truncation** - Limit string lengths
7. **Slug generation** - Generate slugs
8. **Number operations** - round, clamp
9. **JSON parsing** - Parse/stringify JSON
10. **UUID/Timestamp** - Generate identifiers
11. **Custom transforms** - Apply transformations
12. **Masking** - Mask sensitive data
13. **Hashing** - Hash passwords (one-way)
14. **Encryption** - Encrypt data (last, after all transforms)

## Best Practices

### 1. Always Hash Passwords

Never store plain-text passwords. Use bcrypt with appropriate salt rounds:

```typescript
PreSave.hash('password', { algorithm: 'bcrypt', saltRounds: 12 })
```

### 2. Encrypt Sensitive Data

Encrypt API keys, tokens, and PII that needs to be retrieved later:

```typescript
PreSave.encrypt('api_key')
PreSave.encrypt('ssn')
```

### 3. Validate at the Database Layer

Don't rely solely on frontend validation:

```typescript
PreSave.validate('email', [
  { type: 'required' },
  { type: 'email' },
  { type: 'maxLength', value: 255 },
])
```

### 4. Sanitize User Input

Always sanitize user-generated content to prevent XSS:

```typescript
PreSave.sanitize('comment')
PreSave.sanitize('bio')
```

### 5. Normalize Before Unique Checks

Normalize emails and other unique fields to prevent duplicates:

```typescript
PreSave.normalizeEmail('email') // Before unique constraint check
```

### 6. Use Masking for Display Data

When you need to show partial sensitive data:

```typescript
PreSave.mask('card_number', 'credit-card', {
  storeOriginalIn: 'card_number_full', // Store encrypted original
})
```

## TypeScript Support

All pre-save operations are fully typed:

```typescript
import {
  PreSave,
  PreSaveOperationType,
  IPreSaveOperation,
  IValidationRule,
} from '@ductape/sdk';

// Type-safe operation creation
const operations: IPreSaveOperation[] = [
  PreSave.hash('password'),
  PreSave.validate('email', [
    { type: 'email' } as IValidationRule,
  ]),
];
```

## See Also

- [Writing Data](./writing-data) - Basic insert and update operations
- [Table Management](./table-management) - Schema definition with field constraints
- [Best Practices](./best-practices) - Security and performance guidelines
