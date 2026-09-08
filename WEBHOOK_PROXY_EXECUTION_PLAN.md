# Product App Webhook Proxy: Assessment and Execution Plan

## Goal

Let a product register webhooks exposed by one of its connected apps, give the third-party provider a stable Ductape URL, receive provider events at that URL, securely forward them to the product's endpoint, and expose the complete delivery lifecycle in Workspace Logs and the Workbench webhook explorer.

The target relationship is:

```text
Product
  -> connected app (app_access)
    -> app version
      -> webhook definition
        -> product environment registration
          -> Ductape ingress URL
            -> product destination URL
```

## What Exists Today

### TypeScript SDK

The TypeScript SDK already implements most of the registration orchestration in `sdk/ts/src/processor/services/processor.service.ts`:

- `registerWebhook()` resolves a product, its `app_access`, app version, webhook definition, and environment mappings.
- It creates a stable UUID-based Ductape URL.
- It can call a provider's webhook-registration API when the app definition contains a registration sample.
- It persists registrations through `POST /webhooks/v1/register`.
- `generateWebhookLink()` creates or reuses a proxy URL and associates it with a user destination URL.
- The public SDK surface is available under `products.apps.webhooks`.

### Legacy Webhook Service

`backend/webhooks` currently exposes:

- `POST /webhooks/v1/process/:id` as the public ingress.
- `POST /webhooks/v1/register`.
- `POST /webhooks/v1/generate-link`.
- `GET /webhooks/v1/webhooks`.

It resolves webhook events, forwards the request with Axios, records success/failure documents directly in the shared `logs` MongoDB collection, and marks a registration active after a successful delivery.

### Nest Webhook Service

`platform/nest/apps/webhooks` has equivalent routes and basic forwarding, but it is behind the legacy service:

- It prepares log objects but does not persist them.
- It does not perform the same event matching.
- Its failure path can append an undefined base log.
- Its activation update is not awaited.

### Workbench

The Workbench already has:

- A product app webhook registration panel.
- Registration listing and environment mapping helpers.
- A webhook explorer and metrics components.
- Workspace Logs support for `type: webhook`.

However, its metrics currently derive totals from a limited page of log rows and filter with `parent_tag = webhookTag`. That contract is not consistently produced by the backend.

### MCP and CLI

The MCP describes app webhook **definitions** (`webhooks.create`, `webhooks.update`, and webhook event methods) but does not expose a complete, deterministic product registration and delivery workflow. The CLI has no first-class webhook operations today; it only inspects webhook definitions while describing apps. Neither surface currently guides a user through discovering an existing registration, creating or updating it, testing delivery, inspecting logs, and repairing a failed setup.

The platform must keep these two concepts explicit:

- **App authoring:** an app owner defines which webhooks and events an app version supports.
- **Product operation:** a product owner registers one of those supported webhooks through a connected `app_access`, receives a Ductape ingress URL, and manages its delivery lifecycle.

## Material Gaps

1. **Two divergent backends.** The legacy and Nest implementations do not have feature parity.
2. **Incorrect or ambiguous log ownership.** Existing logs use the app publisher as `workspace_id` and the product workspace as `recipient_workspace_id`. Normal workspace queries can therefore hide events from the product receiving them.
3. **Inconsistent log tags.** Workbench filtering and backend-produced `parent_tag` values do not share a documented contract.
4. **Direct Mongo logging.** Webhook execution bypasses the SDK logging path, including its encryption, redaction, retry, and activity conventions.
5. **No durable delivery.** Provider receipt is coupled to the destination endpoint. There is no durable queue/outbox, retry policy, dead-letter state, or replay.
6. **Weak ingress security.** Raw bodies are not retained for signature verification, the stored private key is unused, and forwarded headers are not sanitized.
7. **SSRF exposure.** Destination URLs are accepted and called without a private-network and metadata-endpoint policy.
8. **Unknown URLs succeed.** The legacy service returns success when a UUID is not found, hiding invalid registrations.
9. **Incomplete lifecycle.** Update, disable, rotate, delete, test, delivery history, and replay are not consistently available.
10. **Insufficient indexes and validation.** There is no enforced unique registration key or UUID index, and the backend trusts too much client-supplied product/app metadata.
11. **Metrics use sampled rows.** Counts can max out at the requested log limit rather than use server-provided totals.
12. **Consumer decorators are not connected.** Nest consumer metadata does not currently establish the remote proxy registration by itself.

## Target Architecture

### Control Plane

The canonical webhook registration record belongs to the webhook service and contains:

- Product workspace, product tag, and product environment.
- Connected `app_access` tag, resolved app/version, app environment, and webhook tag.
- Stable public endpoint ID and lifecycle status.
- Encrypted destination URL and method.
- Signature-verification strategy and secret references, never raw secrets.
- Provider registration ID/status where applicable.
- Retry, timeout, response-mode, and revision configuration.
- Created/updated/disabled timestamps.

The logical registration key is:

```text
(product_workspace_id, product_tag, product_env, access_tag, webhook_tag)
```

The endpoint UUID and logical key must both be uniquely indexed. Updating a destination must preserve the public UUID unless the user explicitly rotates it.

### Data Plane

The provider request flow should be:

1. Accept the provider request at the stable UUID URL.
2. Resolve an active registration from cache, falling back to storage.
3. Preserve the raw body, parsed body, query, content type, and approved headers.
4. Verify the provider signature using app-version webhook metadata and Secrets Manager references.
5. Match the event definition.
6. Persist an immutable receipt and delivery job before acknowledging the provider.
7. Return the provider-required success response quickly.
8. Deliver asynchronously to the product endpoint.
9. Retry transient failures with bounded exponential backoff and jitter.
10. Move exhausted jobs to a dead-letter state that can be replayed.

Synchronous forwarding should be an explicit compatibility mode only for providers that require the downstream response. Verification/challenge endpoints should have a separate documented path.

### Logging Contract

Delivery state is operational truth and must live in webhook delivery records. Activity logs are an observable projection and must use the SDK `LogsService`, not direct collection writes.

Every receipt gets one `invocation_id`. Lifecycle logs use:

- `workspace_id`: the product workspace receiving the webhook.
- `type`: `webhook`.
- `parent_tag`: the webhook tag, matching the current explorer contract.
- `child_tag`: the matched event tag, or `unmatched`.
- Product tag/environment and connected app access tag as explicit metadata.
- Stages: `received`, `verified`, `queued`, `delivery-attempt`, `delivered`, `failed`, `dead-lettered`, and `replayed`.

The SDK logger must apply the same encryption, secret redaction, resilient `void publish`, and workspace-log conventions used elsewhere. Payloads should be size-limited and sensitive headers, tokens, signatures, and configured sensitive fields must be redacted.

## Execution Plan

### Phase 1: Freeze the Contract

1. Write an ADR naming the Nest webhook service as the canonical implementation.
2. Define the registration, receipt, delivery, event, and log schemas.
3. Define exact ownership and tag semantics used by the Logs API and Workbench.
4. Define response modes, retryable statuses, timeouts, payload limits, and provider challenge behavior.
5. Add versioned SDK schemas before changing runtime behavior.

**Exit criteria:** backend, SDK, Workbench, CLI, and MCP consume the same documented contract.

### Phase 2: Consolidate and Migrate Registration

1. Extract shared registration/event-resolution logic into a reusable backend module.
2. Bring Nest to parity and route legacy service behavior through the shared module during migration.
3. Validate product ownership, `app_access`, app version, webhook definition, and environment mapping on the server.
4. Add update, disable, rotate, and delete operations.
5. Add unique indexes and migration scripts while preserving every existing UUID URL.
6. Remove or formally use the currently unused private-key field.

**Exit criteria:** duplicate registration attempts are idempotent, existing provider URLs continue working, and invalid cross-workspace registrations are rejected.

### Phase 3: Secure and Durable Ingress

1. Capture raw request bodies before JSON parsing.
2. Add provider-specific and generic signature-verification metadata to app webhook definitions.
3. Resolve verification secrets through Secrets Manager with short-lived in-memory caching.
4. Add request-size, method, content-type, rate-limit, and timestamp/replay protections.
5. Sanitize forwarded headers, stripping host, content length, connection, and other hop-by-hop headers while retaining explicitly required signature headers.
6. Enforce SSRF protection when saving and resolving destinations.
7. Persist receipt and delivery jobs through an outbox/queue before returning success.
8. Return 404 or 410 for unknown, disabled, or rotated endpoints rather than silently accepting them.

**Exit criteria:** an accepted webhook survives service restarts and is either delivered or visibly dead-lettered.

### Phase 4: Delivery Worker and Replay

1. Implement bounded retry with exponential backoff and jitter.
2. Treat network errors, timeouts, 408, 425, 429, and selected 5xx responses as retryable; make policy configurable.
3. Add idempotency/deduplication using provider event IDs where available and a bounded request fingerprint otherwise.
4. Define per-registration concurrency and ordering behavior.
5. Add dead-letter inspection and manual replay.
6. Track complete attempt timing, sanitized request/response summaries, and final disposition.

**Exit criteria:** failures are explainable, retryable, and replayable without creating duplicate uncontrolled deliveries.

### Phase 5: SDK and Nest Developer Experience

1. Standardize the TypeScript surface under `products.apps.webhooks` for list, register, update, disable, rotate, test, deliveries, and replay.
2. Move the reusable execution logger and schemas into the SDK.
3. Make Nest `@Webhook.Consumer` either register its deployed route during bootstrap or explicitly require a registration call; do not leave it as misleading metadata.
4. Add typed event payloads from app-version webhook schemas.
5. Add integration tests covering product -> app_access -> webhook resolution and environment mapping.

**Exit criteria:** a Nest or TypeScript product can register and consume a webhook without constructing internal service payloads manually.

### Phase 6: Workbench

1. Show registration state per product environment, stable proxy URL, destination, verification state, and delivery health.
2. Add edit, disable, rotate, send-test-event, and replay controls.
3. Show invocations and per-attempt timelines using the established Feature Runs visual language.
4. Display sanitized input/output for receipt, verification, and each delivery attempt.
5. Use analytics metadata for total/success/failed counts rather than counting a limited page of rows.
6. Ensure refresh invalidates the exact registration, delivery, metrics, and workspace-log queries.

**Exit criteria:** a user can diagnose a failed webhook entirely from the Workbench.

### Phase 7: MCP, CLI, and Documentation

1. Add schema-first MCP guidance for discovering the app access and webhook definition.
2. Require reuse of an existing logical registration before creating another one.
3. Guide agents through environment mapping, destination setup, signature secrets, test delivery, log verification, and repair.
4. Store webhook asset JSON under `ductape/webhooks/`.
5. Add first-class CLI commands for list, register/update, disable, rotate, test, deliveries, and replay.
6. Document provider registration versus generated-link modes and webhook verification/challenge flows.

**Exit criteria:** the same workflow can be completed reliably through Workbench, MCP, or CLI.

## Required MCP Guidance

The MCP must expose product webhook operations as schemas/tools, not merely describe them in prose. Before every mutating operation, the agent must fetch the exact method schema and inspect existing state.

### Mandatory Decision Flow

For a product webhook request, MCP guidance must instruct the agent to:

1. Resolve the active workspace and product.
2. Fetch the product and its environment list.
3. List connected apps and resolve the exact `app_access`; never substitute a marketplace app tag for an access tag.
4. Inspect the access environment mappings and resolve the app version actually connected to the product.
5. List/fetch the app version's webhook definition and event selectors.
6. List existing product webhook registrations using product tag, access tag, webhook tag, and product environment.
7. Reuse or update an exact logical match. Create only when no matching registration exists.
8. Inspect the exact schema for the selected register/update operation.
9. Use secret references for verification credentials and shared configuration; never write secret values into asset JSON.
10. Save the requested asset under `ductape/webhooks/<tag>.json` before applying it with the CLI.
11. Register or update the destination and report the stable proxy URL.
12. Send a test event when the operation supports it.
13. Inspect delivery state and Workspace Logs using the returned invocation/delivery ID.
14. On failure, distinguish registration, signature, event matching, destination, timeout, and delivery failures before proposing a repair.

### MCP Operations

The product module should expose schema-backed methods equivalent to:

```text
product.apps.webhooks.list
product.apps.webhooks.fetch
product.apps.webhooks.register
product.apps.webhooks.update
product.apps.webhooks.disable
product.apps.webhooks.rotate
product.apps.webhooks.test
product.apps.webhooks.deliveries.list
product.apps.webhooks.deliveries.fetch
product.apps.webhooks.deliveries.replay
```

App-authoring methods remain under the app/webhooks module and must be described as definition operations, not receiving-endpoint registration operations.

### MCP Guardrails

- Never create a webhook definition when the user is asking to connect an existing app webhook to a product.
- Never create duplicate registrations for the same logical key.
- Never guess webhook/event selectors, signature algorithms, required headers, environment mappings, or provider registration payloads.
- Never use scratch or temporary JSON as the source asset passed to the CLI.
- Never place raw secrets, OAuth access tokens, or signature keys in generated files or command arguments.
- Preserve an existing proxy UUID during update unless rotation is explicitly requested.
- Verify the registration and at least one corresponding log/delivery record before declaring setup complete.
- For provider errors, fetch the webhook and app-action schemas again before changing payloads.

## Required CLI Operations

Add a `ductape webhooks` command group for product webhook operations. App definition CRUD should remain under app resource commands so the two lifecycles cannot be confused.

```text
ductape webhooks list --product <tag> [--access <tag>] [--env <slug>] [--json]
ductape webhooks get <webhook> --product <tag> --access <tag> --env <slug> [--json]
ductape webhooks register --file ductape/webhooks/<tag>.json [--dry-run] [--json]
ductape webhooks update <webhook> --product <tag> --access <tag> --env <slug> --file <path> [--json]
ductape webhooks disable <webhook> --product <tag> --access <tag> --env <slug> [--json]
ductape webhooks rotate <webhook> --product <tag> --access <tag> --env <slug> [--yes] [--json]
ductape webhooks test <webhook> --product <tag> --access <tag> --env <slug> [--event <tag>] [--input <path>] [--wait] [--json]
ductape webhooks deliveries <webhook> --product <tag> --access <tag> --env <slug> [--status <value>] [--page <n>] [--limit <n>] [--json]
ductape webhooks delivery <delivery-id> [--json]
ductape webhooks replay <delivery-id> [--yes] [--wait] [--json]
```

### CLI Asset Shape

A registration asset should be declarative and contain references rather than platform-generated IDs or secret values:

```json
{
  "product": "payment-processing",
  "access": "payment-processing:flutterwave",
  "webhook": "charge-events",
  "environment": "prd",
  "destination": {
    "url": "https://example.com/webhooks/flutterwave",
    "method": "POST"
  },
  "verification": {
    "strategy": "hmac-sha256",
    "secret": "$Secret{FLUTTERWAVE_WEBHOOK_SECRET}"
  },
  "delivery": {
    "timeout_ms": 5000,
    "max_attempts": 5
  }
}
```

The server resolves the product workspace, app/version, app environment, UUID, and provider registration identifiers. CLI `--json` output must be stable and include the logical key, status, proxy URL, revision, and operation/request ID.

### CLI Behavior Requirements

- `register` performs an upsert by logical key and reports whether it created, reused, or updated a registration.
- `--dry-run` validates ownership, app access, environments, webhook schema, secret references, and destination policy without registering with the provider.
- Destructive rotation and replay require explicit confirmation unless `--yes` is supplied.
- All commands honor the active profile/workspace/product link and support explicit product flags for automation.
- Operational failures return structured nonzero exits using the CLI's existing `DuctapeOperationError` conventions.
- `--wait` polls the delivery resource, not raw logs, and times out predictably.
- Secrets are accepted only as secret references or through the existing secret-management flow.
- Generated examples and `ductape apply` support use `ductape/webhooks/` as the canonical folder.

### Phase 8: Verification and Rollout

1. Unit test event matching, signature verification, header sanitization, SSRF rules, deduplication, redaction, and retry decisions.
2. Integration test success, invalid signature, unmatched event, consumer 4xx/5xx, timeout, retry, dead letter, and replay.
3. Run an end-to-end test: SDK registration -> provider request -> durable receipt -> consumer delivery -> SDK log -> Workbench display.
4. Backfill existing registrations and deploy indexes safely.
5. Shadow new logging before switching Workbench queries.
6. Roll out behind flags with metrics for ingress latency, queue age, delivery latency, success rate, retries, and dead letters.
7. Retire direct Mongo logging and then the duplicate legacy implementation after parity is proven.

## Recommended Implementation Order

The shortest safe path is:

1. Contract and workspace/tag correction.
2. Nest parity plus SDK logging.
3. Existing-registration migration and indexes.
4. Durable ingress and delivery worker.
5. Workbench deliveries/invocations.
6. SDK/Nest completion.
7. MCP, CLI, and documentation.
8. Security hardening, load testing, and controlled cutover.

Do not begin by expanding the Workbench alone. The current UI is already capable of displaying webhook activity; the primary blocker is that the backend does not produce one trustworthy, portable execution and logging model.

## Definition of Done

- A product environment can register exactly one connected-app webhook destination idempotently.
- The public Ductape URL remains stable through ordinary edits and can be explicitly rotated.
- Provider signatures are verified from raw payloads using secret references.
- Accepted events are durable before acknowledgement.
- Delivery supports retries, deduplication, dead letters, and replay.
- Product owners can see receipt and every delivery attempt in Workspace Logs and the webhook explorer.
- Logs are emitted through the SDK and contain no plaintext credentials.
- Existing registrations continue working through migration.
- Nest, TypeScript SDK, Workbench, MCP, CLI, and docs expose the same lifecycle and terminology.
