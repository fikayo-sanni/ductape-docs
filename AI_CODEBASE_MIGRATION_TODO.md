# Ductape AI Codebase Migration — Exhaustive TODO

Last updated: 2026-07-26

## Status legend

- [x] Implemented and covered by current validation/tests.
- [~] Partially implemented; limitations are listed beneath the item.
- [ ] Not implemented.
- `[BLOCKED]` requires a platform/API capability or explicit product decision.

## Non-negotiable principles

- [x] The migration scanner is advisory evidence, not a codemod.
- [x] Application code is written contextually by the AI using normal editing tools.
- [x] Scanner findings never become architectural decisions automatically.
- [x] The AI must inspect source, callers, callees, tests, configuration, installed SDK types, and runtime effects.
- [x] The AI must not invent or change interfaces, types, DTOs, event schemas, serialization, errors, or lifecycle contracts without explicit authorization.
- [x] Interface, functional, and operational parity are tracked separately.
- [x] Unverified parity blocks strict readiness.
- [x] The workflow must never promise mathematical “100% parity” from finite evidence.
- [x] MCP must never accept, read, or forward `DUCTAPE_ACCESS_KEY`.
- [x] Secret values must not enter MCP arguments or output.
- [x] Scripts must not generate or rewrite application source.
- [x] Scripts must not execute database migrations or destructive runtime operations.
- [x] The workflow starts by creating/completing and passing project-level E2E tests against the original codebase.
- [x] The workflow ends by running the migrated codebase against the unchanged original E2E suite.
- [x] The original E2E suite, fixtures, command, environment, and evidence are checksum-bound before migration.
- [x] CLI records E2E evidence but never executes arbitrary project test commands.
- [x] `new-codebase` is the default; `in-place` requires an explicit selection.

## 1. Repository discovery and review bootstrap

- [x] Detect TypeScript/JavaScript, Go, Java, and .NET repositories.
- [x] Detect NestJS, Express, Spring, ASP.NET Core, Gin, Echo, Next.js, React, Vue, Angular, and Svelte hints.
- [x] Ignore common dependency, build, coverage, IDE, and generated-output directories.
- [x] Detect environment names from filenames and recognized configuration markers.
- [x] Normalize common environment aliases such as production → `prd`, staging → `stg`, and sandbox → `snd`.
- [x] Extract `.env` key names while redacting values.
- [x] Exclude `.env` contents from deterministic hint generation.
- [x] Inventory possible database schema and migration files.
- [x] Checksum migration-file evidence.
- [x] Identify low-confidence database and external-host navigation hints.
- [x] Label every deterministic hint low-confidence and require AI review.
- [x] Produce a relevant-file review queue.
- [x] Include a per-file inspection checklist.
- [x] Support `in-place` and separate `new-codebase` guidance destinations.
- [x] Require a passing, checksum-valid original E2E baseline before migration inspection can start.
- [x] Write guidance only under `ductape/migration-guidance`.
- [x] Avoid creating `src`, executable migrations, or authoritative Ductape schemas.
- [x] Detect Bazel, Buck, Pants, Nx, Turborepo, Maven, Gradle, and .NET solution/project boundary evidence explicitly.
- [x] Inventory nested module manifests, associate their nearest boundary evidence, and require contextual ownership review.
- [x] Detect generated-source hints through generated paths/names and generator headers without treating them as authoritative exclusions.
- [x] Never follow repository symlinks; report skipped symlinks so cycles cannot recurse silently.
- [x] Detect and report Git submodules explicitly from `.gitmodules`.
- [x] Add configurable maximum file-size and binary-file exclusion policies.
- [x] Add repository-specific include/exclude glob rules with per-file audit reasons.

## 2. Product and environment planning

- [x] Derive a default product tag without automatically treating it as confirmed.
- [x] Fetch the product before optional creation.
- [x] Create a product only when a genuine not-found result is returned.
- [x] Keep product creation behind explicit `ensure_product`.
- [x] Record product/service/environment boundary evidence in migration slices.
- [x] Prevent the guidance from assuming one repository equals one product or service.
- [x] Detect and reconcile likely environments.
  - [x] Reconcile detected environments with an exported authenticated product-environment inventory.
  - [x] Report matched, missing, extra, and ambiguously normalized environments.
  - [x] Add idempotent administrative environment create/update CLI routes with post-write verification.
- [x] Build and validate a service-to-product mapping artifact covering every discovered workspace unit exactly once.
- [x] Validate that every required asset has inventory evidence and configuration for every target environment.
- [x] Model per-product phased environment promotions with entry, validation, and rollback requirements.

## 3. Secret discovery and migration

- [x] Inventory `.env` variable names without returning values.
- [x] Import one local `.env` value through the standalone CLI.
- [x] Keep the secret value out of CLI arguments.
- [x] Redact secret material from CLI output.
- [x] Document actual `$Secret{tag}` references.
- [x] Detect names-only Docker Compose environment/secret references.
- [x] Detect Kubernetes secret references.
  - [x] Detect `secretKeyRef` key names.
  - [x] Detect ExternalSecret `remoteRef` and SealedSecret `encryptedData` key names without reading payloads.
  - [x] Detect `envFrom.secretRef`, secret volumes, and CSI `secretProviderClass` identifiers.
- [x] Detect CI/CD secret references.
  - [x] Detect GitHub Actions, GitLab secret-like variables, and Jenkins credential identifiers.
  - [x] Detect CircleCI secret-like variables and Azure DevOps secret-like variable references.
  - [x] Detect bracket-form GitHub secrets, GitLab Vault paths, and Jenkins `credentialsId`.
- [x] Detect framework, IaC, and cloud secret references.
  - [x] Detect Spring placeholders, .NET configuration keys, Terraform variables, and AWS/GCP/Azure secret-manager identifiers.
  - [x] Detect .NET `UserSecretsId` metadata.
  - [x] Detect common provider-specific variants including AWS dynamic references/ARNs, GCP resource names, and Azure Key Vault references; retain contextual AI review for unknown provider syntax.
- [x] Classify every discovered secret reference by environment, service, provider, sensitivity, and rotation owner.
- [x] Detect low-confidence potentially committed credentials using file/line/category and a non-reversible truncated fingerprint without returning matched material.
- [x] Reconcile every secret classification with inventory evidence and reuse/create/update/blocked action.
- [x] Require rotation strategy, validation, and rollback plans for every migrated credential.
- [x] Reject value-bearing credential fields from secret migration definitions and artifacts.

## 4. Contextual review ledger

- [x] Initialize a persistent review ledger from the review queue.
- [x] Record file purpose, dependencies, interfaces, findings, and references.
- [x] Classify findings as observed, inferred, proposed, or confirmed.
- [x] Support import, caller, callee, implementation, event, test, config, and schema references.
- [x] Add newly discovered follow-up files to the ledger.
- [x] Require internal reference targets to be reviewed or explicitly excluded.
- [x] Record interface, functional, and operational parity independently.
- [x] Require evidence for `verified` parity.
- [x] Require a reason for `not_applicable` parity.
- [x] Snapshot reviewed files with SHA-256 checksums.
- [x] Detect reviews made stale by later file changes.
- [x] Reopen reviews explicitly.
- [x] Validate progress and strict readiness.
- [x] Reject path traversal and absolute repository-file paths.
- [x] Require valid source start/end line provenance for every contextual review finding.
- [x] Require symbol kind/name (and optional qualified name) provenance for every finding.
- [x] Detect probable file moves by reviewed checksum and provide a checksum-verified ledger move operation.
- [x] Invalidate reviewed dependents transitively when referenced or follow-up files become stale.
- [x] Record actor, CLI identity, and CLI version on every ledger mutation.
- [x] Maintain revisioned append-only ledger events for every structured mutation.
- [x] Chain audit events with SHA-256 hashes and bind the latest event to current ledger state.
- [x] Reject concurrent reviewer writes with an exclusive lock and stale revision conflict detection.
- [x] Record protocol-asserted MCP client identity as explicitly unverified, and record that a server-verifiable AI model identity is unavailable rather than trusting caller-supplied claims.
- [x] Add detached Ed25519 signatures backed by a trusted external signing identity.
- [x] Add common-base semantic merge assistance for non-overlapping parallel reviews with explicit conflicts.

## 5. Generated, vendor, build, and snapshot files

- [x] Require an exclusion classification and reason.
- [x] Support generated, vendor, build, snapshot, and other classifications.
- [x] Require generator and regeneration-test evidence for generated exclusions.
- [x] Prevent silent exclusion of internally referenced files.
- [x] Detect generated public contracts that require compatibility testing.
- [x] Verify regeneration commands through recorded passing clean-workspace evidence without executing arbitrary commands.
- [x] Compare regenerated output with checked-in output.
- [x] Track generator version and input checksums.
- [x] Distinguish vendored source that is locally modified.
- [x] Validate UI snapshots and generated API clients as contracts where applicable.

## 6. Large codebases and context preservation

- [x] Partition a repository into bounded, non-overlapping review groups.
- [x] Record an explicit context budget for each partition.
- [x] Persist partition summaries.
- [x] Compute file-checksum provenance for partition summaries.
- [x] Invalidate portfolio readiness when partition provenance becomes stale.
- [x] Require every ledger file to appear in exactly one partition.
- [x] Reject unknown and duplicate partition files.
- [x] Validate every referenced migration slice.
- [x] Record evidenced cross-slice provider/consumer contracts.
- [x] Provide repository-wide strict portfolio validation.
- [x] Automatically propose dependency-ordered partitions with explicit `advisory_only` authority.
- [x] Add configurable token/byte estimates per proposed partition.
- [x] Split dependency graphs on strongly connected components and flag indivisible oversized SCCs without unsafe splitting.
- [x] Build durable service/package summary evidence with exact source-range citations and checksums.
- [x] Transitively invalidate cited summaries when declared verification dependencies become stale.
- [x] Add evidenced resumable checkpoints and progress records.
- [x] Support cited evidence from multiple absolute repository roots in one verification matrix.
- [x] Validate cross-repository contract and version-compatibility evidence.

## 7. Migration slices and cutover gates

- [x] Initialize vertical migration slices from reviewed files.
- [x] Define slices through validated JSON evidence.
- [x] Require interface contracts.
- [x] Require functional requirements.
- [x] Require operational requirements.
- [x] Require exact product/service/environment boundary evidence.
- [x] Require exact installed SDK package/version/capability evidence.
- [x] Require Ductape asset inventory evidence.
- [x] Support asset actions: reuse, create, update, or blocked.
- [x] Block readiness on unresolved assets.
- [x] Require tests, failure tests, runtime evidence, and sandbox smoke checks.
- [x] Require cutover and rollback conditions.
- [x] Require current file-review checksums and parity evidence.
- [x] Validate slices independently and through portfolios.
- [x] Track slice implementation commits and deployment versions.
- [x] Track feature-flag, dual-run, and traffic-percentage state.
- [x] Record explicit no-return points and mitigations.
- [x] Add timed observation windows and success thresholds.
- [x] Integrate monitoring/alert evidence into cutover readiness.
- [x] Require recorded executed rollback rehearsal evidence.

## 8. Functional and operational parity

- [x] Prohibit assuming functionality from names, patterns, comments, documentation, or hints.
- [x] Require characterization tests when existing behavior is unclear.
- [x] Require preservation of inputs, outputs, validation, domain results, state changes, side effects, errors, events, and user-visible behavior.
- [x] Require preservation of ordering, concurrency, transactions, retries, idempotency, authorization, privacy, observability, lifecycle, recovery, and degraded behavior.
- [x] Require the final E2E command to exactly match the baseline command.
- [x] Reject final readiness when an original E2E test/fixture is changed or missing.
- [x] Verify the migrated suite root contains byte-identical copies of every original E2E test/fixture.
- [x] Keep migration-specific tests additive; they do not replace the original acceptance suite.
- [x] Support parity evidence categories:
  - [x] Characterization
  - [x] Contract
  - [x] Golden fixture
  - [x] Side-effect comparison
  - [x] Database-state comparison
  - [x] Event-order comparison
  - [x] Failure injection
  - [x] Load/concurrency
  - [x] Safe shadow comparison
- [x] State explicitly that compilation and happy-path tests are insufficient.
- [x] Stop cutover when parity cannot be demonstrated.
- [x] Define structured verification records for every parity category instead of accepting descriptive strings alone.
- [x] Require recorded before/after harness commands and normalized comparison outputs.
- [x] Capture tolerances, nondeterministic fields, and approved differences.
- [x] Require test-strength evidence covering weak tests, excessive mocking, and missing assertions.
- [x] Add mutation testing or equivalent recorded test-strength signals.
- [x] Add production-safe shadow/dual-run orchestration evidence.
- [x] Aggregate residual uncertainty into an authority-backed cutover decision.

## 9. Frontend migration

- [x] Detect React, Vue, Angular, Svelte, and Next.js hints.
- [x] Mark frontend/backend/worker slice surfaces.
- [x] Require frontend parity evidence for:
  - [x] Routes and navigation
  - [x] Loading, empty, error, and success states
  - [x] Forms and validation
  - [x] Accessibility
  - [x] Responsive behavior
  - [x] Browser storage
  - [x] Authentication transitions
  - [x] SSR and hydration
  - [x] Realtime reconnect/resubscription
  - [x] Analytics and privacy
  - [x] Performance budgets
  - [x] Visual regression
  - [x] Cross-browser behavior
- [x] Require installed `@ductape/client`, `@ductape/react`, or `@ductape/vue` capability evidence.
- [x] Document identity, `clearSession`, pageviews, trace correlation, privacy masking, and hidden-state safety.
- [x] Preserve domain state separately from analytics.
- [x] Add Angular- and Svelte-specific Ductape integration evidence requirements.
- [x] Add browser automation evidence collection.
- [x] Add accessibility tooling integration and severity thresholds.
- [x] Add visual baseline capture and authority-backed approved-difference workflow.
- [x] Add Core Web Vitals and bundle-size comparison evidence.
- [x] Add browser/version support matrices.
- [x] Validate offline, background-tab, reconnect, and duplicate-subscription behavior through recorded automation.
- [x] Validate CSP, CORS, cookie, storage, and SSR security behavior.
- [x] Cover native/mobile clients explicitly.

## 10. Database baseline

- [x] Create `database-baseline.json`.
- [x] Require database tag, owners, and provider evidence.
- [x] Require code-schema evidence.
- [x] Require source migration-history evidence.
- [x] Require applied-history evidence.
- [x] Require live sandbox schema evidence.
- [x] Require proposed Ductape schema evidence.
- [x] Require drift, object, security, topology, compatibility, and performance evidence.
- [x] Validate baseline fields with typed semantic checks.
  - [x] Validate baseline field schemas semantically.
  - [x] Add checksum provenance and stale-evidence detection.
  - [x] Compare code, migration, applied, live, and proposed schema structure hashes with explicit difference approval.
- [x] Require tested relational/table/collection field-model evidence including types, nullability, defaults, identities, and sequences.
- [x] Require index, compound/partial index, constraint, foreign-key, and check evidence.
- [x] Require views, materialized views, triggers, stored procedures, and function evidence.
- [x] Require MongoDB nested document, array, validator, index, and replica-set evidence.
- [x] Require RLS, grants, users, roles, encryption, and audit evidence.
- [x] Require tenant, schema, partition, shard, and routing-key evidence.
- [x] Require time-zone, collation, encoding, and numeric-precision evidence.
- [x] Capture normalized query-plan and performance-baseline evidence.
- [x] Validate multiple-database dependency nodes, edges, and order.

## 11. Database data-migration plan

- [x] Create `database-data.json`.
- [x] Require transformations, batching, checkpoints, idempotency, resume strategy, validation, reconciliation, recovery, PII, retention, and seed-data evidence.
- [x] Validate data-plan fields with typed semantic checks.
  - [x] Validate versioned transformation schemas and source/target field mappings.
  - [x] Validate positive batch sizes, concurrency, memory, and timeout limits.
  - [x] Validate atomic checkpoint persistence and replay-test evidence.
- [x] Define and test row/document selection and deterministic ordering.
- [x] Define and test backfill concurrency and throttling.
- [x] Define retry ownership and poison-record handling.
- [x] Define duplicate prevention and idempotency keys.
- [x] Define transformation versioning.
- [x] Define data-quality thresholds for counts, checksums, nulls, duplicates, and referential integrity.
- [x] Define PII masking and least-privilege access.
- [x] Define large-object and binary-data handling.
- [x] Define CDC/outbox coordination during backfill.
- [x] Add pause, resume, abort, and recovery drill evidence.
- [x] Add resumable execution evidence without letting MCP perform the mutation.

## 12. Database cutover

- [x] Create `database-cutover.json`.
- [x] Require expand, backfill, dual compatibility, contract, deployment order, locks, backup, restore test, rollback, irreversible changes, monitoring, reconciliation, and approval.
- [x] Validate cutover fields with typed semantic checks.
  - [x] Validate unique positive phase ordering and existing prerequisites.
  - [x] Validate migration identity and database-tag consistency across baseline, data, and cutover.
- [x] Validate old and new application versions against the expanded schema through recorded tests.
- [x] Validate dual-read/write conflict-resolution evidence.
- [x] Validate migration locks and concurrent deployment behavior.
- [x] Require backup identity, timestamp, scope, encryption, and retention evidence.
- [x] Require an executed restore rehearsal in an authorized environment.
- [x] Require authority-backed approval for irreversible/data-loss operations.
- [x] Define monitoring thresholds and observation windows.
- [x] Define post-cutover reconciliation and acceptance thresholds.
- [x] Link database readiness into slice and portfolio verification evidence.
- [x] Coordinate schema changes with Events, Features, outbox, CDC, and consumer deployment order.
- [x] Enforce sandbox/read-only evidence and explicit authorization for live inspection.

## 13. Ductape component mapping

- [x] Guide internal asynchronous boundaries toward Events.
- [x] Guide reusable external HTTP integrations toward Apps/Actions.
- [x] Cover Databases, Cache, Storage, Notifications, Graph, Vector, Sessions, Features, and Resilience.
- [x] Keep deterministic domain calculations and validation in application code.
- [x] Require explicit topic creation and canonical NestJS decorators.
- [x] Require session handling appropriate to immediate versus durable work.
- [x] Require idempotent consumers and bounded retry ownership.
- [x] Create contextual, AI-authored asset-design verification records for every component type.
- [x] Reconcile proposed assets with recorded live product inventory.
- [x] Detect and test cross-environment asset configuration gaps.
- [x] Validate provider-specific capability and limitation matrices.
- [x] Validate generated payloads against installed SDK types and platform schemas through recorded automation.
- [x] Validate dependency nodes, edges, and order for product, environments, secrets, cloud connections, Apps, resources, Events, Features, and runtime deployment.

## 14. Third-party APIs

- [x] Identify low-confidence external host/method/path hints.
- [x] Require contextual call-chain inspection.
- [x] Recommend one reusable App per stable external API boundary.
- [x] Require Actions for stable operations and `$Secret{tag}` authentication references.
- [x] Prefer OpenAPI/Postman import when available.
- [x] Require cited contextual review records for Axios, Fetch, Java clients, .NET `HttpClient`, Go HTTP, GraphQL, gRPC, and generated clients.
- [x] Require contextual evidence for base URLs, auth, headers, timeout, retry, pagination, rate limits, and error normalization.
- [x] Require inspected wrapper-chain evidence for repeated or hidden calls.
- [x] Provide structured AI-authored App/Action design verification records.
- [x] Validate functional and operational evidence and tests for every recorded replaced call path.
- [x] Validate webhook/callback verification and replay evidence.

## 15. Sessions, Features, and Resilience

- [x] Require full session token propagation for immediate user work.
- [x] Prohibit indefinite durable storage of raw JWTs.
- [x] Support system context or approved delegated actor metadata for durable work.
- [x] Guide durable multi-step work toward code-first Features.
- [x] Use installed `ctx.events.produce` rather than assuming `ctx.messaging`.
- [x] Cover retry, fallback, quota, and health-check decisions.
- [x] Add session-flow contract artifacts across frontend, backend, Events, Features, and scheduled work.
- [x] Validate token refresh, revocation, logout, account switching, and expiry behavior through required test evidence.
- [x] Validate duplicate delivery, signal handling, compensation, and restart recovery evidence for Features.
- [x] Validate retry budgets across layered SDK, provider, queue, and application retries.
- [x] Validate actor audit metadata without treating it as authorization.

## 16. Graph, vector, storage, cache, notifications, and analytics

- [x] Covered by MCP guidance, generic slice evidence, and a strict repository assurance artifact.
- [x] Add graph-specific schema, edge, index, traversal, and reconciliation artifacts.
- [x] Add vector-specific dimensions, metric, embedding version, metadata schema, batching, and recall/quality evidence.
- [x] Add storage-specific object key, metadata, ACL, encryption, retention, multipart, and checksum evidence.
- [x] Add cache-specific key, TTL, invalidation, stampede, consistency, and fallback evidence.
- [x] Add notification-specific template, channel, provider, suppression, retry, delivery, and privacy evidence.
- [x] Add analytics-specific event schema, identity, consent, masking, delivery, and dashboard parity evidence.
- [x] Add provider migration and bulk-data resumability plans for each component.

## 17. Runtime evidence and observability

- [x] Require runtime evidence and failure tests in slices.
- [x] Require sandbox smoke checks.
- [x] Include logging, tracing, privacy, lifecycle, and degraded behavior in operational parity.
- [x] Define safe runtime-observation procedures per supported language.
- [x] Capture request, query, Event, Feature, and external-effect correlation evidence.
- [x] Add trace/log schema compatibility checks.
- [x] Add load, concurrency, retry, and duplicate-delivery harness evidence.
- [x] Add startup, shutdown, cancellation, and restart-recovery harness evidence.
- [x] Add observation redaction checks.
- [x] Add monitoring dashboards and alert thresholds as cutover evidence.

## 18. SDK language/version capability matrices

- [x] Require exact package/version/capability evidence in each slice.
- [x] Support TypeScript, Go, Java, and .NET review standards.
- [x] Avoid assuming cross-language parity.
- [x] Publish machine-readable capability matrices for every currently supported SDK language/version through `ductape migration-capabilities`, with repository source evidence and an explicit unsupported-capability policy.
- [x] Validate installed exports/types through required installed-capability evidence in the matrix.
- [x] Add language-specific migration examples and anti-patterns.
- [x] Add framework/language-specific lifecycle, DI, cancellation, and error-mapping requirements.
- [x] Add compatibility tests that exercise equivalent behavior across supported SDKs.
- [x] Define unsupported-capability escalation and fallback policy.

## 19. MCP and CLI safety

- [x] Strip `DUCTAPE_ACCESS_KEY` from MCP CLI subprocess environments.
- [x] Never read the access key in MCP.
- [x] Allow standalone CLI authentication and access-key use where necessary.
- [x] Keep local migration guidance commands usable without platform authentication.
- [x] Distinguish administrative CLI operations from publishable-key runtime execution.
- [x] Prevent secret values from being passed through MCP.
- [x] Publish Draft 2020-12 schemas for every migration artifact and accepted definition/evidence input, including substantive required top-level fields.
- [x] Add size limits and secret-material rejection across migration evidence readers.
- [x] Add atomic writes and exclusive file locking across core ledgers/manifests.
- [x] Add backups and validated recovery for mutable guidance artifacts.
- [x] Add controlled JSON artifact version migration without overwriting source evidence.
- [x] Add structured error codes for all migration commands.
  - [x] Artifact safety, locking, recovery, secret, size, and version failures use stable codes.
  - [x] Normalize remaining migration command failures through `MIGRATION_VALIDATION_FAILED` while preserving specific artifact codes.

## 20. Testing and release

- [x] CLI builds successfully.
- [x] Existing CLI suite passes with migration review, slice, and portfolio tests.
- [x] MCP builds successfully.
- [x] MCP guidance acceptance suite passes.
- [x] Manual command registration checks were performed.
- [x] Add dedicated tests for `migration-database init`.
- [x] Add dedicated table-driven tests for every required database evidence field and every structural validation branch.
- [x] Add cross-artifact database consistency tests.
- [x] Add frontend slice negative tests for every required concern.
- [x] Add portfolio overlap, missing coverage, stale summary/provenance, and cross-contract negative tests.
- [~] Add CLI end-to-end tests for every structured mutation command.
  - [x] Exercise built-CLI registration for every structured mutation and structured error propagation.
  - [ ] Execute complete success and rollback fixture flows through every mutation command rather than relying on command-level semantic tests.
- [x] Add concurrency/file-locking tests.
- [x] Add secret-leak regression tests across every catalogued artifact and suppress parser context on malformed evidence.
- [x] Add corrupted/legacy artifact compatibility tests.
- [x] Add performance tests on a large synthetic dependency graph.
- [x] Version and publish CLI (`@ductape/cli@0.3.0`).
- [x] Version and publish MCP (`@ductape/mcp@0.2.0`).
- [x] Run clean-consumer smoke tests using installed published packages.
- [x] Update public README documentation and changelogs.

## Definition of complete

The full migration capability is complete only when all of the following are true:

- [ ] A large multi-service repository can be reviewed incrementally with complete, non-stale, cited coverage.
- [ ] The AI can migrate backend, frontend, workers, databases, and every supported Ductape component without assuming behavior or changing contracts.
- [ ] Every slice has demonstrated interface, functional, and operational parity with explicit residual uncertainty.
- [ ] Database baseline, data movement, and cutover artifacts are semantically validated and linked to slice/portfolio readiness.
- [ ] All assets are reconciled against real product/environment inventory without duplication.
- [ ] Secrets remain outside MCP and are imported securely per environment.
- [ ] Cutover, monitoring, rollback, restore, and reconciliation are rehearsed in an authorized sandbox.
- [ ] Every supported SDK language/version has verified capability guidance.
- [ ] Comprehensive positive, negative, security, scale, and published-package smoke tests pass.
- [x] CLI and MCP versions are published with documentation and changelogs.
