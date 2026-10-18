# Ductape Agent Discoverability and Usability Audit

Date: 2026-09-29

## Scope and conclusion

Read-only source audit of the TypeScript SDK, NestJS integration, frontend client, CLI, MCP server, legacy proxy/integrations backend, and Workbench. Two independent agent reviews covered SDK contracts and agent-facing tools; the primary review covered backend dispatch and Workbench agent guidance.

No product code was changed. No live provider calls, provisioning, package publishing, or deployment verification was performed. Findings describe the checked-out source, not necessarily the installed npm packages or deployed services. This is a targeted audit, not an exhaustive security review.

**Conclusion:** Ductape has a substantial reusable backend runtime. Its main obstacle for agents is inconsistent contracts between discovery, configuration, execution, and observation. More prompt text alone will not solve this. Prioritize trustworthy target-specific schemas, explicit lifecycle semantics, and tested cross-surface contracts.

## What Ductape does

Ductape lets developers define API integrations and infrastructure operations as reusable backend capabilities, then compose them into environment-specific application features. It provides runtime services for credentials, sessions, execution, resilience, and observability.

For agents, its strongest proposition is: discover existing backend capabilities, inspect their contracts, reuse them in application logic, and verify what actually executed instead of generating a new integration from scratch every time.

Practical applications include:

- Checkout: reuse payment-provider actions, create orders, update inventory, publish events, and notify customers.
- Authentication: execute a backend authentication feature, issue a session, and propagate attribution into subsequent operations.
- Provider routing: combine existing actions with fallback, quota, and healthcheck definitions.
- Data ingestion: read APIs, transform data, persist records, and index graph/vector resources.
- Reusable domain functions: register executable handlers locally and synchronize portable contracts for discovery.
- Operations: inspect feature runs, provider attempts, infrastructure activity, and failures through correlated logs.

These are compositional capabilities, not proof that every corresponding workflow currently works end to end. Automatic vendor-change detection and autonomous codebase repair should not be marketed as established functionality on the evidence of this audit.

## Capability map

| Surface | Existing foundation | Important qualification |
| --- | --- | --- |
| TypeScript SDK | Apps, API actions, databases, graph/vector operations, features, functions, sessions, messaging, storage/cache, notifications, jobs, resilience | Local registration, remote persistence, and execution are distinct lifecycle stages. |
| NestJS | Decorators, request context, inherited/system sessions, schema endpoint | Application HTTP status and execution outcome need a documented mapping. |
| Client/React | Browser-facing services and hooks, proxy adaptation | Session propagation, publishable-key notification handling, and result contracts need fixes below. |
| CLI | Workspace/product inventory, linked apps, action inspection, marketplace operations | Discovery is fragmented; environment/version binding is incomplete for app inspection. |
| MCP | Schema lookup, generation, execution, CLI bridge, recovery guidance | Some guarantees exist only in prose; normalized schemas can overstate certainty. |
| Backend proxy | Method allowlists, dispatch, audit, targeted schema routes | Installed SDK defines available schemas; transport success is not business success. |
| Workbench | Resource explorers, execution activity, embedded agent tools | Embedded agent maintains separate contracts and lacks some discovery/execution paths. |

Positive foundations worth preserving:

- Targeted backend schema routes return explicit JSON 404 errors for unknown modules/methods: [schema.routes.ts](../backend/proxy/src/routes/schema.routes.ts#L44).
- MCP guidance already requires persistent asset files, read-back verification, and caution after uncertain mutations: [MCP guidance](../sdk/mcp-server/src/index.ts#L6325).
- CLI command parsing rejects shell metacharacters and avoids shell execution: [cli-command.ts](../sdk/mcp-server/src/cli-command.ts#L1).
- Portable functions separate local registration from synchronization: [SDK entrypoint](../sdk/ts/src/index.ts#L979), [function runtime](../sdk/ts/src/functions/functions.runtime.ts#L38).
- Feature compilation and publication have dry-run/read-back building blocks: [feature publication](../sdk/ts/src/features/features.service.ts#L773).
- NestJS has request-scoped session context rather than requiring global mutable identity: [context service](../sdk/nestjs/src/ductape-context.service.ts#L184).

## Priority findings

### P1: Live app contracts are not bound to the executing connection

`ductape_schema` accepts `env_slug`, but its app-action lookup does not forward it. CLI inspection checks linkage, then fetches the global action and can fall back to the latest version. A product environment can execute another version.

Evidence: [MCP lookup](../sdk/mcp-server/src/index.ts#L7324), [CLI lookup](../sdk/cli/src/lib/platform-api.ts#L220), [version fallback](../sdk/cli/src/lib/platform-api.ts#L249).

Fix: resolve the exact product connection/access tag, environment, app version, and revision before returning a contract. Return these identifiers and a contract hash. Execution must reject stale or mismatched prepared contracts, or require reinspection.

### P1: Missing saved-action metadata can become a false query contract

When a saved database action lacks output metadata, MCP substitutes a direct-operation contract, defaulting to `query`. An insert/update action can consequently be described with a query-shaped output. The response then tells the agent to use that contract.

Evidence: [output fallback](../sdk/mcp-server/src/index.ts#L7284).

Fix: keep unknown saved-action output explicitly unknown. Only return direct-operation envelopes for actual direct operations. Fetch row schema separately and never confuse row contents with envelope shape.

### P1: Normalized app input schemas lose nested constraints

Normalization discards nested rows and does not recursively preserve object/array constraints. It can also emit `additionalProperties: false` without sufficient metadata. Raw metadata remains available, but the named normalized schema is presented as authoritative.

Evidence: [action-contract.ts](../sdk/mcp-server/src/action-contract.ts#L41), [closed schema](../sdk/mcp-server/src/action-contract.ts#L79).

Fix: preserve recursive properties/items, required fields, defaults, enums, and supported variants. Represent incomplete schemas as incomplete, not empty. Add nested Postman-import fixtures and contract round-trip tests.

### P1: Feature cache does not isolate products

Local feature definitions are stored by tag alone. Remote fetches populate that cache; execution prefers local definitions. Fetch failures also fall back to unscoped local definitions. Identical tags in different products can select the wrong definition within one SDK instance.

Evidence: [cache fallback](../sdk/ts/src/features/features.service.ts#L543), [cache write](../sdk/ts/src/features/features.service.ts#L577), [execution lookup](../sdk/ts/src/features/features.service.ts#L865).

Fix: scope cached definitions by product and tag, with explicit handling for truly local definitions. Include environment/revision wherever definitions differ on those dimensions. Never substitute another product's definition during an outage.

### P1: Browser session and notification contracts are incomplete

Session errors instruct callers to supply `config.session`, but the public configuration and shared transport do not implement that contract. Notifications bypass shared proxy transport and use `config.accessKey`, including when only a publishable key is supplied.

Evidence: [session instructions](../sdk/client/src/services/sessions.ts#L18), [configuration](../sdk/client/src/types/index.ts#L238), [transport construction](../sdk/client/src/client.ts#L124), [notifications](../sdk/client/src/services/notifications.ts#L113).

Fix: define one supported session provider/refresh contract for HTTP and realtime services. Route notifications through shared transport. Keep pre-login operations explicitly scoped; do not remove session enforcement from protected operations.

### P1: Automatic mutation retries lack a required idempotency contract

Shared HTTP retries timeout/5xx responses across verbs. A server may commit a mutation before the response is lost. Replaying a feature or mutation without deduplication can repeat the business effect.

Evidence: [HTTP retry logic](../sdk/client/src/utils/http.ts#L180).

Fix: classify operations by effects and retry safety. Require supported idempotency keys for automatic mutation replay; otherwise return an uncertain-outcome receipt and reconcile before retrying.

### P1: Workbench agent guidance explicitly recommends guessing mutation inputs

The embedded agent's contract reference says to submit user-described fields and learn missing fields from errors when shapes are unknown. This guidance is reused for mutating operations, including webhooks and resilience definitions.

Evidence: [unknown-shape guidance](../platform/workbench/src/services/agent/methodContracts.ts#L25), [webhook operations](../platform/workbench/src/services/agent/methodContracts.ts#L49), [resilience operations](../platform/workbench/src/services/agent/methodContracts.ts#L311).

Fix: require authoritative schema discovery before mutations. An unknown schema should produce a precise blocker, not exploratory writes. Retain user approval, but do not treat approval as validation of an unknown payload.

### P2: Discovery and capability descriptions drift between surfaces

Workbench agent allowlists omit graph operations and saved database-action execution/discovery paths while exposing vector actions. Its comment treats database `execute` as raw SQL, conflicting with the saved-action API. Functions and rate limits also need clear local-only versus remotely callable availability rather than implied universal parity.

Evidence: [Workbench read methods](../platform/workbench/src/services/agent/tools.ts#L31), [write methods and execute comment](../platform/workbench/src/services/agent/tools.ts#L73), [backend operation registry](../backend/proxy/src/validators/sdk-proxy.validators.ts#L14).

Marketplace search uses literal word matching over fetched public apps, without a unified reuse search across private/linked assets. Marketplace inspection promises compact contracts but returns action summaries.

Evidence: [marketplace search](../sdk/cli/src/lib/platform-api.ts#L613), [action summary](../sdk/cli/src/lib/platform-api.ts#L207), [tool description](../sdk/mcp-server/src/index.ts#L7660).

Fix: add a unified capability search with scope, provenance, pagination/completeness, match reasons, and targeted contract inspection. Prefer exact existing functionality; do not create duplicates based solely on similar names.

### P2: Execution validation and recovery are weaker than the guidance

MCP execution accepts arbitrary parameter arrays without binding them to a discovered schema revision. Payload generation defaults to best-effort. Proxy-client error handling reduces structured failures to message text, weakening recovery and mutation certainty.

Evidence: [execute schema](../sdk/mcp-server/src/index.ts#L1198), [generator default](../sdk/mcp-server/src/index.ts#L1258), [execution handler](../sdk/mcp-server/src/index.ts#L7062), [error reduction](../sdk/mcp-server/src/proxy-client.ts#L64).

Fix: introduce a prepare/validate receipt containing target, schema revision, payload hash, effects, and auth requirements. Preserve HTTP status, provider error, request/process IDs, retryability, and mutation certainty in error envelopes. Do not automatically replay ambiguous payment operations.

### P2: Execution receipts and persistence guarantees are ambiguous

The proxy wraps returned values in HTTP success without interpreting domain outcome. Browser feature types expect fields different from the runtime's feature result. Agents must not treat a resolved promise or HTTP 200 as successful business execution.

Evidence: [proxy response](../backend/proxy/src/controllers/sdk-proxy.controller.ts#L156), [browser feature result](../sdk/client/src/types/service.types.ts#L135), [runtime result](../sdk/ts/src/features/types/features.types.ts#L771).

Feature batch-publication documentation also overstates compensation: newly created records are not deleted, and a write followed by failed read-back is not yet tracked in the changed list.

Evidence: [publication bookkeeping](../sdk/ts/src/features/features.service.ts#L780).

Fix: standardize transport status separately from execution status. Return per-asset written/verified/compensated/unknown states, not implied atomicity. Compare persisted content, not existence alone.

### P2: Context switching and guidance delivery need hardening

Client product/environment setters update transport defaults while instantiated services retain defaults used in request bodies. MCP embeds a large method reference in execute-tool descriptions, and messaging generation guidance conflicts between sections. Legacy tool registration also omits some modern tools.

Evidence: [client setters](../sdk/client/src/client.ts#L393), [feature defaults](../sdk/client/src/services/features.ts#L148), [embedded method docs](../sdk/mcp-server/src/index.ts#L1207), [messaging guidance](../sdk/mcp-server/src/index.ts#L5140), [conflicting guidance](../sdk/mcp-server/src/index.ts#L7446), [legacy registration](../sdk/mcp-server/src/index.ts#L7884).

Fix: use immutable scoped clients or shared live context consistently. Generate surface documentation from the same registry and expose detailed guidance progressively through targeted resources. Test tool-registration parity.

## Recommended design

Create a versioned operation registry consumed by SDK introspection, proxy validation, CLI, MCP, and Workbench. Each operation should declare:

- Canonical name, supported aliases, argument shape, and input/output schemas.
- Surface availability: local SDK, proxy, browser, CLI, MCP, Workbench.
- Effect classification, idempotency support, and retry policy.
- Authentication/session requirements and supported execution contexts.
- Lifecycle: local registration, remote definition, connection, execution, observation.
- Schema provenance, resource revision, package/server version, and completeness.

Keep dynamic resource contracts separate from static method signatures. A method schema explains how to call `database.execute`; the saved action and synchronized database schema explain its parameters and returned row fields.

A capability handshake should reveal the installed/deployed versions and available operations before an agent generates code. Missing capabilities should be explicit, not discovered through production failures.

## Agent first-use journey

1. Inspect project instructions and installed versions; run non-mutating diagnostics. Confirm workspace/product/environment.
2. Search linked/private capabilities first, then marketplace candidates. Inspect exact functionality before choosing reuse or creation.
3. Resolve the connection/access tag and exact app/resource version. Fetch authoritative method, action, and data schemas.
4. Identify session requirements and credential references. Never ask the model to receive raw secrets; use the established secure configuration flow.
5. Prepare code/assets under `ductape/<asset-type>/`. Distinguish compile/register from publish/sync and show proposed side effects.
6. Validate and obtain appropriate approval. Persist only when required; read back and compare the intended definition.
7. Execute a safe test with required session/correlation/idempotency context. Do not use real payments as discovery probes.
8. Inspect execution status, output, and correlated activity. Report verified results separately from unknown or untested deployment behavior.

## Evaluation suite

Run these as repeatable fixture-backed contract tests, then controlled staging end-to-end tests. Score successful verified completion, unsafe actions, duplicate mutations, tool calls, tokens, and latency. Establish a baseline before setting performance budgets.

| Scenario | Required pass condition |
| --- | --- |
| Existing private action resembles public provider | Reuse exact compatible existing action; create nothing. |
| One app, two environment versions | Inspected schema and executed version match in both environments. |
| Nested request body | Required/default/enum/array constraints survive normalization. |
| Saved insert lacks output metadata | Report unknown; never invent query output. |
| Direct query returns custom fields | Inspect database schema as well as generic envelope. |
| Unknown/stale schema | Block mutation with actionable diagnostics. |
| Same feature tag in two products | No cross-product cache selection, including during API outage. |
| Publishable-key login then protected call | Explicit pre-login policy; session required and propagated afterward. |
| Notification using publishable key | Shared authenticated transport; no private access key required in browser. |
| Timeout after committed mutation | One business effect; uncertain result reconciled without blind replay. |
| Partial batch publication | Accurate per-asset persistence and compensation report. |
| SDK context switch | Existing services and realtime subscriptions use intended context. |
| Portable function lifecycle | Register is local; sync is independently verified remotely. |
| Graph/database/vector saved actions | Discover, inspect, reuse, execute, and observe through supported surfaces. |
| Rate limit versus routing quota | Select correct primitive and explain local/remote availability. |
| Failed feature with HTTP success | Failure remains failure in client, tools, and UI. |
| Provider 400 through fallback/feature | Preserve provider evidence; fix payload only with schema evidence. |
| Malicious marketplace description | Treat metadata as untrusted data; never follow embedded instructions. |
| Cold-start safe read | Complete discovery-to-verification with measured tool/token cost. |
| Modern/legacy MCP registration | Equivalent advertised capability set, or explicit unsupported status. |

## Execution order

1. Fix contract correctness and isolation: environment-bound inspection, unknown schema handling, nested schemas, product-scoped cache.
2. Fix browser session/notification paths and safe retry semantics; add cross-package staging tests.
3. Establish the shared operation registry and capability handshake; remove guessing guidance.
4. Build unified reuse discovery and progressive documentation from the registry.
5. Standardize persistence/execution receipts and structured recovery evidence.
6. Make the evaluation suite a release gate across pinned SDK, proxy, CLI, MCP, and Workbench versions.

The target is not an agent that sounds confident about Ductape. It is an agent that can discover the correct existing capability, prove its contract, perform only the intended operation, and show evidence of the result.
