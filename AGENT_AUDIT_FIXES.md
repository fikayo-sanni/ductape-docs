# Agent Audit Fixes

Date: 2026-09-30

This records the implementation following `AGENT_DISCOVERABILITY_AUDIT.md`. The original audit remains a historical source review. Changes are local; nothing was published, pushed, deployed, provisioned, or charged.

## Implemented

- Product-scoped TypeScript feature caches across definition, CRUD, fallback reads, and execution. Identical feature tags no longer share a cache entry across products.
- Feature batch publication verifies content, preserves new records on uncertain outcomes, attempts verified restoration of prior records, and reports per-asset persistence/compensation receipts through `FeaturePublicationError`.
- Connected app contract inspection resolves the runtime access/version/environment in both integrations backends. The CLI supports environment-bound inspection; MCP requires it. No latest-version fallback is used for MCP execution guidance.
- Nested app input schemas preserve object/array structure and constraints. Incomplete metadata is not represented as a closed empty schema. Credential values are redacted without removing header names/types.
- Saved database actions without output metadata remain explicitly unknown rather than acquiring a query output envelope.
- MCP proxy diagnostics retain redacted structured errors and unknown mutation outcomes. Recovery does not authorize blind retries.
- MCP rejects reserved generated placeholders and empty sessions before proxy execution. Payload generation defaults to strict mode.
- Exhaustive method guidance is retrieved on demand. Modern/legacy MCP tool registrations share the same path, and read-only discovery tools carry safety annotations.
- Marketplace ranking supports partial capability matches with explicit catalogue-snapshot coverage and truncation information.
- Unified bounded reuse discovery is available through `ductape capabilities search` and `ductape_search_capabilities`: selected-product features/functions, saved database/graph/vector actions, linked/private app actions, and optional marketplace candidates. Results include exact identifiers, provenance, next contract lookups, and explicit unavailable/partial inventory coverage. Other products are not silently searched.
- Both proxies expose a capability handshake derived from their existing method registry and installed SDK version. MCP exposes `ductape_capabilities`. Runtime callability remains explicitly unknown where static inspection cannot establish it.
- Browser HTTP requests inherit a configured backend-issued session, with explicit per-call overrides and logout clearing. Realtime subscription payloads also inherit the session; changing it closes old streams.
- Browser notifications use shared proxy/authentication/session transport. Single-channel failures reject; multi-channel operations report per-channel outcomes.
- Browser mutation requests are not automatically retried after timeouts or server errors. Read-only HTTP verbs retain bounded retries.
- Browser feature execution preserves runtime receipts and throws typed `FeatureExecutionError` for failed/rolled-back/timed-out/cancelled outcomes. Absent timestamps are not invented.
- Product/environment scope becomes immutable after a browser service is accessed. Callers must create a new client rather than retaining old resource connections/subscriptions under a new default scope. React recreates its client when session configuration changes.
- Workbench agent no longer probes unknown mutation contracts. Unsupported contracts fail before a request. Verified graph and saved database-action discovery paths were added; supported asynchronous database action dispatch is distinguished from synchronous execution.

## Compatibility changes

1. Deploy integrations before updating MCP/CLI: environment-bound contract lookup deliberately fails against a backend without `/integrations/v1/action-contract`.
2. Deploy proxy capability routes before relying on `ductape_capabilities`. Their manifests report each deployment's actual registry; they do not silently normalize differing deployments.
3. Build/publish the TypeScript SDK before installing it in services that need the cache/publication fixes. A local SDK build does not update container dependencies.
4. Publish/install the updated browser client before React. React was type-checked against the locally built client declarations, not the older installed package.
5. Browser callers relying on resolved failed execution/notification promises must handle rejection. Error receipts remain available for inspection.
6. Scope setters now reject after service access. Recreate clients on workspace/product/environment transitions; reconnect streams after changing identity.
7. CLI marketplace search JSON uses an explicit result/coverage envelope; its programmatic array API remains available.
8. Workbench mutations with incomplete contracts are hidden/blocked until authoritative support exists. User approval alone does not make an unknown payload valid.

## Verification

- TypeScript SDK build passed; focused product-isolation/publication tests and adjacent reconciliation tests passed.
- Browser client build and offline routing/session/retry/notification/outcome/realtime tests passed.
- React type check passed against the updated local client declarations.
- Vue feature inputs accept explicit sessions; its type check also passed against updated local client declarations.
- Existing MCP suite and added contract/preflight tests passed.
- CLI build and targeted contract/discovery tests passed.
- Legacy and Nest integrations builds/type checks and contract-sanitization tests passed.
- Legacy and Nest proxy type checks and offline capability/validation tests passed.
- Workbench type check and offline agent-contract tests passed.
- Updated MDX pages compiled successfully.

Existing test limitations: three feature definition-cache fixtures fail at compiler validation of their native control flow. An older CLI test has a stale expectation about the pre-existing connection-list implementation. Neither result is being represented as a fully green repository suite.

No live provider or staging end-to-end test was performed. Browser session forwarding is not proof that every deployed realtime resource handler authorizes sessions correctly; gateway enforcement remains a separate acceptance check.

## Still Not Guaranteed

- Prepared execution tokens bound to final payload and schema revision are not yet enforced. Placeholder checks and strict generation are not complete JSON-schema validation of every executable method.
- The capability handshake reuses authoritative allowlists but is not a single generated contract registry shared by every SDK/CLI/Workbench surface.
- Upstream marketplace pagination/completeness cannot be guaranteed by ranking a returned snapshot.
- These local fixes do not prove that any deployed environment is running the corrected versions.

The remaining execution gate must use authoritative runtime schemas before enforcing hashes or claiming validation. The safe interim behavior is to expose missing contract support, not generate a plausible substitute.
