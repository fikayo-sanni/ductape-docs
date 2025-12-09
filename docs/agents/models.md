---
sidebar_position: 3
---

# LLM Models

LLM Models allow you to define reusable model configurations that agents can reference by tag. This approach provides centralized management of API keys, model settings, and environment-specific configurations.

## Why Use Model Tags?

Instead of embedding LLM configuration directly in each agent:

```typescript
// Inline configuration (not recommended for production)
const agent = await ductape.agents.define({
  product: 'my-product',
  tag: 'my-agent',
  model: {
    provider: 'anthropic',
    model: 'claude-sonnet-4-20250514',
    temperature: 0.7,
    apiKey: 'sk-ant-...',  // API key in code
  },
  // ...
});
```

You can create a model configuration once and reference it:

```typescript
// Reference by tag (recommended)
const agent = await ductape.agents.define({
  product: 'my-product',
  tag: 'my-agent',
  model: 'claude-sonnet',  // References the model tag
  // ...
});
```

### Benefits

- **Security**: API keys are encrypted and stored separately from agent definitions
- **Centralized Management**: Update model settings in one place, all agents using that model are updated
- **Environment Flexibility**: Different API keys per environment (dev, staging, production)
- **Clean Code**: Agent definitions focus on behavior, not infrastructure

---

## Creating Models

### Using the SDK

```typescript
import Ductape from '@ductape/sdk';

const ductape = new Ductape({ ... });

// Create a model configuration
await ductape.model.create({
  product: 'my-product',
  tag: 'claude-sonnet',
  name: 'Claude Sonnet',
  description: 'Claude Sonnet for general-purpose tasks',
  provider: 'anthropic',
  model: 'claude-sonnet-4-20250514',
  temperature: 0.7,
  maxTokens: 4096,
  envs: [
    {
      slug: 'dev',
      apiKey: 'sk-ant-dev-...',
      active: true,
    },
    {
      slug: 'stg',
      apiKey: 'sk-ant-staging-...',
      active: true,
    },
    {
      slug: 'prd',
      apiKey: 'sk-ant-production-...',
      active: true,
    },
  ],
});
```

### Configuration Options

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `product` | string | Yes | Product tag |
| `tag` | string | Yes | Unique identifier for the model |
| `name` | string | Yes | Human-readable name |
| `description` | string | No | Description of the model's purpose |
| `provider` | string | Yes | LLM provider (`anthropic`, `openai`, `google`, `cohere`, `custom`) |
| `model` | string | Yes | Model identifier (e.g., `claude-sonnet-4-20250514`, `gpt-4-turbo`) |
| `temperature` | number | No | Sampling temperature (0-2, default: 0.7) |
| `maxTokens` | number | No | Maximum tokens in response |
| `topP` | number | No | Top-p sampling (0-1) |
| `stopSequences` | string[] | No | Stop sequences |
| `timeout` | number | No | Request timeout in milliseconds |
| `envs` | array | Yes | Environment-specific configurations |

### Environment Configuration

Each environment has its own API key and optional settings:

```typescript
envs: [
  {
    slug: 'dev',           // Environment slug (must match product env)
    apiKey: 'sk-...',      // API key (automatically encrypted)
    baseUrl: 'https://...',// Optional: custom base URL
    active: true,          // Whether this env is active
    description: 'Dev environment',
  },
]
```

---

## Supported Providers

### Anthropic

```typescript
await ductape.model.create({
  product: 'my-product',
  tag: 'claude-opus',
  name: 'Claude Opus',
  provider: 'anthropic',
  model: 'claude-opus-4-20250514',
  envs: [
    { slug: 'prd', apiKey: process.env.ANTHROPIC_API_KEY },
  ],
});
```

### OpenAI

```typescript
await ductape.model.create({
  product: 'my-product',
  tag: 'gpt-4-turbo',
  name: 'GPT-4 Turbo',
  provider: 'openai',
  model: 'gpt-4-turbo',
  envs: [
    { slug: 'prd', apiKey: process.env.OPENAI_API_KEY },
  ],
});
```

### Google (Gemini)

```typescript
await ductape.model.create({
  product: 'my-product',
  tag: 'gemini-pro',
  name: 'Gemini Pro',
  provider: 'google',
  model: 'gemini-pro',
  envs: [
    { slug: 'prd', apiKey: process.env.GOOGLE_API_KEY },
  ],
});
```

### Custom Providers

For self-hosted or alternative endpoints:

```typescript
await ductape.model.create({
  product: 'my-product',
  tag: 'local-llama',
  name: 'Local Llama',
  provider: 'custom',
  model: 'llama-3-70b',
  envs: [
    {
      slug: 'dev',
      baseUrl: 'http://localhost:8080',
      apiKey: 'optional-key',
    },
  ],
});
```

---

## Using Models in Agents

### Reference by Tag

```typescript
const agent = await ductape.agents.define({
  product: 'my-product',
  tag: 'customer-support',
  name: 'Customer Support Agent',
  model: 'claude-sonnet',  // Reference the model tag
  systemPrompt: 'You are a helpful customer support agent...',
  tools: [...],
});
```

### Environment Resolution

When an agent runs, the model configuration is resolved based on the execution environment:

```typescript
// Running in production
await ductape.agents.run({
  product: 'my-product',
  env: 'prd',  // Uses the 'prd' API key from the model
  tag: 'customer-support',
  input: { ... },
});
```

The system:
1. Looks up the model by tag
2. Finds the environment-specific configuration
3. Decrypts the API key
4. Creates the LLM provider with the resolved settings

---

## Model Configuration Overrides

While models define default settings, you can override specific parameters at various levels without creating new model entities.

### Agent-Level Overrides

Override model settings for all executions of a specific agent:

```typescript
const agent = await ductape.agents.define({
  product: 'my-product',
  tag: 'creative-agent',
  name: 'Creative Agent',
  model: 'claude-sonnet',  // Base model settings
  modelConfig: {
    temperature: 0.9,      // Override: Higher for creativity
    maxTokens: 8000,       // Override: Longer responses
  },
  systemPrompt: 'You are a creative writer...',
  tools: [...],
});
```

### Environment-Level Overrides

Override settings for specific environments:

```typescript
const agent = await ductape.agents.define({
  product: 'my-product',
  tag: 'smart-agent',
  model: 'claude-sonnet',
  modelConfig: {
    temperature: 0.7,  // Default override
  },
  envs: [
    {
      slug: 'dev',
      modelConfig: {
        maxTokens: 1000,  // Limit tokens in dev
      },
    },
    {
      slug: 'prd',
      modelConfig: {
        maxTokens: 4000,  // More tokens in production
      },
    },
  ],
  // ...
});
```

### Runtime Overrides

Override settings at execution time:

```typescript
await ductape.agents.run({
  product: 'my-product',
  env: 'prd',
  tag: 'smart-agent',
  input: { ... },
  modelConfig: {
    temperature: 0.2,  // Lower temperature for this specific run
    maxTokens: 2000,
  },
});
```

### Override Precedence

Settings are merged with the following precedence (highest to lowest):

1. **Runtime** `options.modelConfig` - Applied per execution
2. **Environment** `agent.envs[].modelConfig` - Per environment
3. **Agent** `agent.modelConfig` - Agent-level defaults
4. **Model Entity** - Base model settings

```typescript
// Example: Final temperature would be 0.2 (runtime override wins)
// Model entity: temperature = 0.7
// Agent modelConfig: temperature = 0.5
// Env modelConfig: temperature = 0.3
// Runtime modelConfig: temperature = 0.2
```

### Available Overrides

| Option | Type | Description |
|--------|------|-------------|
| `temperature` | number | Sampling temperature (0-2) |
| `maxTokens` | number | Maximum tokens in response |
| `topP` | number | Top-p sampling (0-1) |
| `stopSequences` | string[] | Stop sequences |
| `timeout` | number | Request timeout in milliseconds |

---

## Managing Models

### Update Model

```typescript
await ductape.model.update({
  product: 'my-product',
  tag: 'claude-sonnet',
  temperature: 0.5,  // Update default temperature
  envs: [
    {
      slug: 'prd',
      apiKey: 'sk-ant-new-key...',  // Rotate API key
    },
  ],
});
```

### Fetch Models

```typescript
// Fetch all models
const models = await ductape.model.fetchAll({
  product: 'my-product',
});

// Fetch specific model
const model = await ductape.model.fetch({
  product: 'my-product',
  tag: 'claude-sonnet',
});
```

### Delete Model

```typescript
await ductape.model.delete({
  product: 'my-product',
  tag: 'claude-sonnet',
});
```

---

## API Key Security

API keys are automatically encrypted using the product's private key:

1. **At Rest**: Keys are encrypted in the database
2. **In Transit**: Only encrypted keys are transmitted
3. **At Runtime**: Keys are decrypted only when needed for LLM calls
4. **Per Environment**: Each environment can have different keys

```typescript
// Keys are automatically encrypted when you create/update
await ductape.model.create({
  product: 'my-product',
  tag: 'my-model',
  name: 'My Model',
  provider: 'anthropic',
  model: 'claude-sonnet-4-20250514',
  envs: [
    {
      slug: 'prd',
      apiKey: 'sk-ant-api03-...',  // Stored encrypted
    },
  ],
});
```

---

## Best Practices

### 1. One Model Per Use Case

```typescript
// Different models for different purposes
await ductape.model.create({
  product: 'my-product',
  tag: 'claude-fast',
  name: 'Claude Fast',
  provider: 'anthropic',
  model: 'claude-haiku-3-20250514',
  temperature: 0.3,  // Lower for factual tasks
  envs: [...],
});

await ductape.model.create({
  product: 'my-product',
  tag: 'claude-creative',
  name: 'Claude Creative',
  provider: 'anthropic',
  model: 'claude-sonnet-4-20250514',
  temperature: 0.9,  // Higher for creative tasks
  envs: [...],
});
```

### 2. Environment-Specific Settings

```typescript
await ductape.model.create({
  product: 'my-product',
  tag: 'main-model',
  name: 'Main Model',
  provider: 'anthropic',
  model: 'claude-sonnet-4-20250514',
  envs: [
    {
      slug: 'dev',
      apiKey: process.env.ANTHROPIC_DEV_KEY,
      // Use cheaper model in dev if needed
    },
    {
      slug: 'prd',
      apiKey: process.env.ANTHROPIC_PROD_KEY,
    },
  ],
});
```

### 3. Descriptive Tags

```typescript
// Good: Descriptive and consistent
'claude-sonnet-support'
'gpt-4-analysis'
'gemini-summarization'

// Avoid: Generic or unclear
'model1'
'llm'
'ai'
```

## Next Steps

- [Getting Started](./getting-started) - Create your first agent
- [Tools](./tools) - Add capabilities to your agents
- [Examples](./examples) - See models in action
