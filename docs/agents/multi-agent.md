---
sidebar_position: 7
---

# Multi-Agent Orchestration

Multi-agent orchestration allows you to create systems where multiple specialized agents work together. A "manager" agent can delegate tasks to specialized agents, enabling complex workflows that combine different capabilities.

## Overview

Ductape supports multi-agent patterns through the `asTool()` method, which converts any agent into a tool that can be used by another agent.

```
┌─────────────────────────────────────────────────┐
│               Manager Agent                      │
│  "Coordinate research and writing tasks"         │
└───────────────┬───────────────────┬─────────────┘
                │                   │
        ┌───────▼───────┐   ┌───────▼───────┐
        │ Research Agent│   │ Writer Agent  │
        │ "Find info"   │   │ "Create docs" │
        └───────────────┘   └───────────────┘
```

---

## Creating Agent Tools

### Using `asTool()`

Convert an agent into a tool with the `asTool()` method:

```typescript
// Define specialized agents first
const researchAgent = await ductape.agents.define({
  product: 'my-product',
  tag: 'research-agent',
  name: 'Research Specialist',
  model: { provider: 'anthropic', model: 'claude-sonnet-4-20250514' },
  systemPrompt: `You are a research specialist.
Your job is to find accurate information and provide well-sourced answers.
Focus on facts and cite your sources.`,
  tools: [
    {
      tag: 'search-knowledge',
      description: 'Search the knowledge base',
      parameters: { query: { type: 'string', required: true } },
      handler: async (ctx, params) => ctx.recall({ query: params.query, topK: 5 }),
    },
  ],
});

const writerAgent = await ductape.agents.define({
  product: 'my-product',
  tag: 'writer-agent',
  name: 'Writing Specialist',
  model: { provider: 'anthropic', model: 'claude-sonnet-4-20250514' },
  systemPrompt: `You are a writing specialist.
Your job is to create clear, engaging content based on the information provided.
Focus on clarity, structure, and readability.`,
  tools: [],
});

// Create a manager agent that can delegate to specialists
const managerAgent = await ductape.agents.define({
  product: 'my-product',
  tag: 'project-manager',
  name: 'Project Manager',
  model: { provider: 'anthropic', model: 'claude-sonnet-4-20250514' },
  systemPrompt: `You are a project manager coordinating a team of specialists.

Your team:
- Research Specialist: Finds and verifies information
- Writing Specialist: Creates polished content

For complex tasks:
1. Break down the task into research and writing components
2. Delegate research tasks to the research specialist
3. Use research results to inform writing tasks
4. Delegate writing to the writing specialist
5. Review and synthesize the final output`,
  tools: [
    // Convert agents to tools
    ductape.agents.asTool({
      agentTag: 'research-agent',
      product: 'my-product',
      options: {
        toolTag: 'delegate-research',
        toolDescription: 'Delegate research tasks to the Research Specialist. Use for finding facts, verifying information, and gathering data.',
      },
    }),
    ductape.agents.asTool({
      agentTag: 'writer-agent',
      product: 'my-product',
      options: {
        toolTag: 'delegate-writing',
        toolDescription: 'Delegate writing tasks to the Writing Specialist. Provide research results and requirements for the content.',
      },
    }),
  ],
});

// Run the manager agent
const result = await ductape.agents.run({
  product: 'my-product',
  env: 'dev',
  tag: 'project-manager',
  input: 'Create a blog post about the benefits of microservices architecture',
});
```

---

## `asTool()` Options

| Option | Type | Description |
|--------|------|-------------|
| `toolTag` | string | Custom tool tag (defaults to `agent:${agentTag}`) |
| `toolName` | string | Custom tool name (defaults to agent name) |
| `toolDescription` | string | Custom description for the LLM |
| `requiresConfirmation` | boolean | Require human approval before calling |
| `timeout` | number | Timeout for agent execution (ms) |
| `retries` | number | Number of retry attempts |
| `inputSchema` | object | Custom input parameter schema |
| `inputTransform` | function | Transform input before passing to agent |
| `outputTransform` | function | Transform agent output before returning |
| `includeDetails` | boolean | Include full execution details in output |

### Custom Input Schema

Define specific parameters for the delegated task:

```typescript
ductape.agents.asTool({
  agentTag: 'data-analyst',
  product: 'my-product',
  options: {
    toolDescription: 'Analyze data and generate insights',
    inputSchema: {
      dataset: {
        type: 'string',
        description: 'Name of the dataset to analyze',
        required: true,
      },
      metrics: {
        type: 'array',
        description: 'Metrics to calculate',
        items: { type: 'string' },
      },
      timeRange: {
        type: 'object',
        description: 'Time range for analysis',
        properties: {
          start: { type: 'string', description: 'Start date (YYYY-MM-DD)' },
          end: { type: 'string', description: 'End date (YYYY-MM-DD)' },
        },
      },
    },
  },
});
```

### Input/Output Transforms

Transform data as it flows between agents:

```typescript
ductape.agents.asTool({
  agentTag: 'summarizer',
  product: 'my-product',
  options: {
    inputTransform: (params) => ({
      task: `Summarize the following in 3 bullet points:\n\n${params.content}`,
    }),
    outputTransform: (result) => ({
      summary: result.output,
      wordCount: result.output?.split(' ').length || 0,
    }),
  },
});
```

### Including Execution Details

Get detailed information about the sub-agent's execution:

```typescript
ductape.agents.asTool({
  agentTag: 'research-agent',
  product: 'my-product',
  options: {
    includeDetails: true,
  },
});

// Output includes:
// {
//   agent: 'research-agent',
//   status: 'completed',
//   output: '...',
//   iterations: 3,
//   toolCalls: [{ tool: 'search', success: true }],
//   executionTime: 5420
// }
```

---

## Using `handlerRef` for Portable Agent Tools

For agents stored in the database, use `handlerRef` to reference other agents:

```typescript
const managerAgent = await ductape.agents.define({
  product: 'my-product',
  tag: 'manager',
  name: 'Manager Agent',
  model: { provider: 'anthropic', model: 'claude-sonnet-4-20250514' },
  systemPrompt: '...',
  tools: [
    {
      tag: 'delegate-research',
      description: 'Delegate to research agent',
      parameters: {
        task: { type: 'string', required: true },
      },
      handlerRef: 'agent:research-agent',  // Reference by agent tag
    },
    {
      tag: 'delegate-analysis',
      description: 'Delegate to analysis agent',
      parameters: {
        task: { type: 'string', required: true },
      },
      handlerRef: 'agent:data-analyst',
    },
  ],
});
```

---

## Multi-Agent Patterns

### Hierarchical Delegation

A manager delegates to specialists:

```typescript
// Manager → Specialists pattern
const manager = await ductape.agents.define({
  tag: 'manager',
  systemPrompt: 'Coordinate work across specialists...',
  tools: [
    ductape.agents.asTool({ agentTag: 'research-specialist', product }),
    ductape.agents.asTool({ agentTag: 'code-specialist', product }),
    ductape.agents.asTool({ agentTag: 'review-specialist', product }),
  ],
});
```

### Pipeline Processing

Agents process in sequence:

```typescript
// Pipeline: Gather → Analyze → Report
const orchestrator = await ductape.agents.define({
  tag: 'orchestrator',
  systemPrompt: `Process data through the pipeline:
1. Use gather-agent to collect data
2. Pass results to analyze-agent for analysis
3. Send analysis to report-agent for final report`,
  tools: [
    ductape.agents.asTool({
      agentTag: 'gather-agent',
      product,
      options: { toolTag: 'step1-gather' },
    }),
    ductape.agents.asTool({
      agentTag: 'analyze-agent',
      product,
      options: { toolTag: 'step2-analyze' },
    }),
    ductape.agents.asTool({
      agentTag: 'report-agent',
      product,
      options: { toolTag: 'step3-report' },
    }),
  ],
});
```

### Specialist Teams

Domain experts with different capabilities:

```typescript
// Support team with specialists
const supportManager = await ductape.agents.define({
  tag: 'support-manager',
  systemPrompt: `Route customer issues to the right specialist:
- Technical issues → Tech Support Agent
- Billing questions → Billing Agent
- Account issues → Account Agent
Choose the best specialist based on the customer's question.`,
  tools: [
    ductape.agents.asTool({
      agentTag: 'tech-support',
      product,
      options: {
        toolDescription: 'Handle technical issues, bugs, and how-to questions',
      },
    }),
    ductape.agents.asTool({
      agentTag: 'billing-support',
      product,
      options: {
        toolDescription: 'Handle billing, payments, and subscription questions',
      },
    }),
    ductape.agents.asTool({
      agentTag: 'account-support',
      product,
      options: {
        toolDescription: 'Handle account access, security, and profile issues',
      },
    }),
  ],
});
```

### Review and Validation

Agents that check each other's work:

```typescript
const codeReviewSystem = await ductape.agents.define({
  tag: 'code-review-coordinator',
  systemPrompt: `Coordinate code review process:
1. Have the coder write the implementation
2. Have the reviewer check for issues
3. If issues found, send back to coder with feedback
4. Repeat until approved`,
  tools: [
    ductape.agents.asTool({
      agentTag: 'coder',
      product,
      options: {
        toolDescription: 'Write or fix code based on requirements',
        includeDetails: true,
      },
    }),
    ductape.agents.asTool({
      agentTag: 'reviewer',
      product,
      options: {
        toolDescription: 'Review code for bugs, style, and best practices',
        includeDetails: true,
      },
    }),
  ],
});
```

---

## Best Practices

### 1. Clear Role Definitions

Give each agent a specific, well-defined role:

```typescript
// Good - specific role
systemPrompt: `You are a data validation specialist.
Your only job is to verify data accuracy and completeness.
You do NOT modify data, only report issues.`

// Bad - vague role
systemPrompt: `You help with data stuff.`
```

### 2. Descriptive Tool Names

Help the manager agent choose the right specialist:

```typescript
// Good - clear when to use
toolDescription: 'Delegate legal document review. Use for contracts, terms of service, privacy policies, and compliance questions.'

// Bad - unclear
toolDescription: 'Legal agent'
```

### 3. Limit Delegation Depth

Avoid deep chains of delegation:

```typescript
// Good - flat structure
Manager → [Specialist A, Specialist B, Specialist C]

// Risky - deep chain
Manager → Coordinator → Sub-coordinator → Worker
```

### 4. Handle Failures Gracefully

Provide fallback behavior:

```typescript
const manager = await ductape.agents.define({
  tag: 'resilient-manager',
  systemPrompt: `If a specialist fails or times out:
1. Try once more with clarified instructions
2. If still failing, attempt the task yourself
3. If you can't complete it, explain what went wrong`,
  tools: [
    ductape.agents.asTool({
      agentTag: 'specialist',
      product,
      options: {
        timeout: 30000,
        retries: 1,
      },
    }),
  ],
});
```

### 5. Use Appropriate Timeouts

Sub-agents take time to run:

```typescript
// Manager needs longer timeout to accommodate sub-agents
const manager = await ductape.agents.define({
  tag: 'manager',
  termination: {
    timeout: 600000,  // 10 minutes - enough for multiple sub-agent calls
    maxIterations: 20,
  },
  tools: [
    ductape.agents.asTool({
      agentTag: 'worker',
      product,
      options: {
        timeout: 120000,  // 2 minutes per sub-agent call
      },
    }),
  ],
});
```

---

## Session Management

Sub-agents can share or isolate sessions:

```typescript
// Shared session (inherits from parent)
const result = await ductape.agents.run({
  product: 'my-product',
  env: 'dev',
  tag: 'manager',
  input: 'Process this request',
  sessionId: 'user-123',  // Sub-agents get 'user-123:agent-tag'
});

// The research-agent will have sessionId: 'user-123:research-agent'
// This allows session-based memory isolation per sub-agent
```

## Next Steps

- [Overview](./overview) - Agent fundamentals
- [Tools](./tools) - Creating custom tools
- [Memory](./memory) - Configure agent memory
- [Examples](./examples) - More agent patterns
