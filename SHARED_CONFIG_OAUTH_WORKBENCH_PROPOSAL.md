# Persistent Shared Config and OAuth Through Workbench

## Status

Proposal only. This document describes an extension of Ductape's existing shared configuration,
OAuth, product App mapping, Workbench connection, and runtime snapshot paths. It deliberately does
not introduce a parallel App Connection resource.

## Objective

Allow a user to configure shared App variables, credentials, and OAuth once while connecting or
editing an App in Workbench. The configuration must persist on the existing product-to-App
environment mapping, load automatically into every SDK instance through the product runtime
snapshot, refresh safely, and never need to be repeated in each codebase.

Application code should only provide business input:

```ts
await ductape.api.run({
  app: 'salesforce',
  action: 'get-contacts',
  input: { limit: 10 },
});
```

## Existing Foundation

Ductape already has most of the required concepts:

1. `ductape.api.config()` stores shared credentials in `CredentialManager`, keyed by
   `product:app:env`. The processor merges them into action input.
2. `ductape.api.oauth()` stores OAuth state in `OAuthManager`, using the same
   `product:app:env` scope. It supports Secrets references, expiry, single-process refresh locking,
   credential construction, and token updates.
3. Product App environment mappings already support:

   ```ts
   {
     app_env_slug,
     product_env_slug,
     variables,
     auth: { auth_tag, data, values?, expiry? }
   }
   ```

4. The Workbench marketplace connection wizard already collects environment mappings, variables,
   and auth fields in `StepFour.tsx`, then persists them through `productBuilder.apps.add()`.
5. `app_access` is already the authoritative mapping from `access_tag` to App ID and version.
6. Runtime snapshots already resolve connected App versions and include each action's
   `product_env_mapping` in the action bootstrap entry.

The missing bridge is hydration: persisted `variables` and `auth` are not currently registered
into the SDK's shared config and OAuth managers when a runtime snapshot is loaded. As a result,
codebases still call `api.config()` or `api.oauth()` themselves.

## Design Principle

Keep ownership where it exists today:

- `app_access`: App identity, ownership, access tag, and selected version.
- Product `apps[].envs[]`: product-specific environment mapping, variables, and auth configuration.
- Workspace Secrets: secret values and OAuth tokens.
- App version auth definitions: supported auth strategy, token locations, refresh action, and input
  contract.
- Runtime snapshot: distribution mechanism.
- `CredentialManager` and `OAuthManager`: runtime resolution and merging mechanism.

No `app_connections` collection or second connection abstraction is required.

## Proposed Runtime Flow

```text
Workbench connect/edit
  -> save variables/auth on product.apps[].envs[]
  -> save sensitive values in Workspace Secrets
  -> increment connectionRevision and runtimeRevision
  -> SDK poll detects changed runtimeRevision
  -> SDK fetches updated runtime snapshot
  -> hydrate CredentialManager and OAuthManager
  -> future App actions use persisted configuration locally
```

The SDK keeps the existing input precedence:

```text
explicit action input > OAuth credentials > shared/static config
```

This preserves current behavior while removing mandatory setup code.

## Persisted Mapping Shape

Retain the existing environment mapping and make its runtime contract explicit:

```json
{
  "app_env_slug": "production",
  "product_env_slug": "prd",
  "variables": [
    {
      "key": "headers:X-Account-Id",
      "value": "account_123",
      "type": "header"
    },
    {
      "key": "headers:Authorization",
      "value": "$Secret{SALESFORCE_PRD_ACCESS_TOKEN}",
      "type": "header"
    }
  ],
  "auth": {
    "auth_tag": "salesforce-oauth",
    "data": {
      "accessToken": "$Secret{SALESFORCE_PRD_ACCESS_TOKEN}",
      "refreshToken": "$Secret{SALESFORCE_PRD_REFRESH_TOKEN}"
    },
    "expiry": 1788120000000
  }
}
```

The precise field shapes should remain compatible with `IEnvsMapping`, `IProductAppEnvs`, and
`IProductAppAuth`. Any schema additions must extend these types rather than replace them.

## Workbench Experience

### Connect flow

Reuse and complete the existing marketplace wizard:

1. Select product and App.
2. Select the App version through the existing `app_access` path.
3. Map every selected product environment to an App environment.
4. Display the App version's shared variables and auth definitions.
5. Collect values once globally or override them per mapped environment.
6. Render sensitive fields as secret inputs.
7. For OAuth, present **Connect account** rather than raw token fields when the App auth definition
   supports an authorization flow.
8. Validate required fields and optionally test the connection.
9. Save through the existing product App add/update path.

### Existing connection flow

Add **Configuration** and **Authentication** views to an already connected App. These edit the
same `product.apps[].envs[]` records created by the connection wizard. Users must be able to:

- Review global and environment-specific shared variables.
- Change a non-sensitive value.
- Replace or rotate a secret without displaying its current value.
- Connect, reconnect, or disconnect OAuth.
- See token status without seeing tokens: connected, expiring, refresh failed, or reconnect needed.
- Test the selected environment.
- Save all mappings atomically.

The connection wizard and edit screen must use one form model and one persistence service to avoid
the two flows drifting.

## Secret Handling

The current Workbench flow can assemble raw values inside `variables` and `auth.data`. It must be
hardened before this becomes the perpetual configuration path:

1. Mark sensitive variable/auth fields in the App auth/variable definition.
2. Send sensitive values to the existing Workspace Secrets API.
3. Store only `$Secret{KEY}` references on the product App environment mapping.
4. Never return resolved values to Workbench, runtime snapshots, logs, or MCP output.
5. Rotating a value updates the Secret while retaining the mapping reference when possible.
6. Removing a connection must not automatically delete a shared Secret without explicit user
   confirmation and a reference check.

Non-sensitive defaults such as currency, account region, or callback mode can remain plain values.

## OAuth Without Persisting Code Callbacks

The current `IOAuthConfig` accepts two functions:

- `credentials(tokens)`
- `onExpiry(tokens)`

Functions cannot be persisted safely in Workbench. They must be represented using existing App
metadata instead of serialized JavaScript:

1. The App auth definition identifies the token/refresh action through its existing `action_tag`.
2. Token fields and their request locations come from the auth definition's existing token schema.
3. The persisted product environment `auth.data` contains Secret references and expiry metadata.
4. OAuth credential construction is declarative: map token fields to headers/query/body/params.
5. Refresh invokes the declared App action using the persisted refresh-token references.
6. Refresh output fields are mapped back to access token, optional refresh token, and expiry.

Add only the metadata that is genuinely absent from the current App auth definition, for example:

```ts
interface PersistedOAuthRules {
  refresh_action_tag: string;
  credential_mappings: Array<{
    token: string;
    target: `headers:${string}` | `query:${string}` | `body:${string}` | `params:${string}`;
    template?: string;
  }>;
  refresh_input_mappings: Record<string, string>;
  refresh_output_mappings: {
    access_token: string;
    refresh_token?: string;
    expires_in?: string;
    expires_at?: string;
  };
  refresh_buffer_ms?: number;
}
```

This metadata belongs on the existing App version auth definition. Product mappings store only
the selected `auth_tag`, environment-specific values, Secret references, and current expiry.

## OAuth Authorization Flow

For Apps with an authorization-code flow:

1. Workbench asks the existing Apps backend to begin OAuth for `product + access_tag + env`.
2. The backend creates signed state and PKCE values where required.
3. The provider redirects to a Ductape callback.
4. The backend validates state and exchanges the code.
5. Tokens are written to Workspace Secrets.
6. Secret references and expiry are written into the existing product App environment `auth`.
7. `connectionRevision` and `runtimeRevision` advance.
8. Workbench displays the updated connection status.

No access or refresh token should be returned to browser JavaScript after exchange.

## Runtime Snapshot Hydration

Extend snapshot application in the TypeScript SDK:

1. Resolve the connected App's environment mapping from each action bootstrap entry.
2. Convert `mapping.variables` into the flat credential format already accepted by
   `CredentialManager.share()`.
3. Register or replace the `product:access_tag:product_env` credential entry.
4. Read `mapping.auth` and the selected App version auth definition.
5. Hydrate `OAuthManager` using declarative persisted rules and Secret references.
6. Replace manager entries atomically with the new snapshot.
7. Remove manager entries for deleted/disconnected mappings.
8. Do not resolve Secrets during polling. Resolve them only on execution or refresh.

The runtime snapshot must include auth definitions needed for hydration, but never resolved secret
or token values. The existing action entry already contains `product_env_mapping`; extend the
snapshot only where the selected auth definition is missing.

## Revision Behavior

The runtime system already has the correct distribution mechanism:

- Updating variables or auth changes `connectionRevision`.
- Because `runtimeRevision` is authoritative, it must change at the same time.
- OAuth token rotation should change `secretRevision`; it need not rebuild unrelated assets.
- Changing an App auth definition or selected App version changes `runtimeRevision` and the
  connected App dependency hash.
- SDK instances use conditional polling and retain last-known-good state after refresh failure.

Writes should update the product mapping and revision metadata in one transaction or one atomic
document update so an SDK cannot observe a revision that points to incomplete configuration.

## SDK API Compatibility

Keep both existing APIs:

```ts
ductape.api.config(...)
await ductape.api.oauth(...)
```

They become optional runtime overrides and migration tools rather than mandatory application
bootstrap code.

Recommended precedence and policy:

1. Persisted Workbench values load automatically.
2. `api.config()` can override persisted shared config within the current process.
3. `api.oauth()` can override the persisted OAuth registration within the current process.
4. Explicit action input remains highest priority.
5. Emit a development warning when code registers the exact same values already supplied by the
   persisted mapping.

Do not silently write code-level overrides back to Workbench.

## Backend Work

1. Validate `variables` and `auth` on product App environment add/update.
2. Add or complete an environment-scoped product App update endpoint if the existing update method
   cannot safely patch one mapping.
3. Store sensitive submissions through Workspace Secrets and replace them with references.
4. Add OAuth start/callback/reconnect/disconnect operations that update existing mapping auth data.
5. Return masked configuration/status for Workbench editing.
6. Ensure runtime snapshots contain the selected App auth definition and persisted mapping.
7. Advance `connectionRevision`, `secretRevision`, and `runtimeRevision` correctly.
8. Apply the same behavior to the current Nest backend and legacy backend until the latter retires.

## Workbench Work

1. Extract the state and submission logic currently in marketplace `StepFour.tsx` into a shared
   App configuration form/service.
2. Reuse it in marketplace connection, direct App connection, and existing connection editing.
3. Replace local-only sensitive form persistence with masked server state; never store secret
   values in `localStorage`.
4. Add environment tabs, global defaults, per-environment overrides, validation, test connection,
   OAuth connect/reconnect, and save states.
5. Refetch product connection data after a successful update.

## SDK Work

1. Add snapshot-to-`CredentialManager` hydration.
2. Add declarative persisted OAuth hydration to `OAuthManager` without removing its callback API.
3. Resolve Secrets lazily during action execution.
4. Preserve current merge precedence.
5. Atomically replace and remove hydrated manager entries on snapshot refresh.
6. Ensure synchronous run, dispatch, and Feature action execution share the same hydrated path.
7. Add status telemetry without returning credential values.

## MCP and CLI Work

The MCP should instruct agents to:

- Reuse persisted Workbench App configuration by default.
- Never generate repeated `api.config()` or `api.oauth()` setup when the connection is configured.
- Ask the user to configure or reconnect the App in Workbench when required values are absent.
- Never place OAuth tokens or provider credentials in source files or temporary JSON.
- Treat code-level configuration as an explicit process override.

CLI inspection may expose connection completeness and masked status, but it must not return secret
values. Mutation can remain Workbench-first initially.

## Migration

1. Add hydration while retaining current code setup unchanged.
2. Ship the Workbench edit flow.
3. Provide a one-time migration assistant that identifies `api.config()` and `api.oauth()` calls,
   lists field names without reading secret values, and guides the user through saving them.
4. After persisted setup succeeds, remove repeated initialization from application code.
5. Add non-blocking duplicate-configuration warnings.
6. Deprecate mandatory code setup only after runtime parity is proven.

## Testing

Required automated and end-to-end coverage:

- Shared config persists across browser sessions and application deployments.
- Every mapped environment receives the correct values.
- Explicit action input overrides OAuth and shared config.
- OAuth overrides static config.
- Secret values never appear in product documents, snapshots, browser state, logs, or MCP output.
- OAuth refresh is single-flight under concurrent action execution.
- Refresh-token rotation updates Secrets and expiry safely.
- Failed OAuth refresh preserves previous state and marks reconnect required.
- Snapshot polling propagates config edits and removes disconnected mappings.
- Connected App version changes hydrate the correct auth definition.
- Feature action steps, direct `api.run()`, and dispatch use identical configuration.
- Current Nest and legacy backend contracts remain compatible.

## Delivery Phases

### Phase 1: Persistence and safe editing

- Reuse `product.apps[].envs[].variables/auth` as the canonical store.
- Harden secret submission and add existing-connection editing in Workbench.
- Add revision updates.

### Phase 2: Runtime hydration

- Hydrate `CredentialManager` from runtime snapshots.
- Verify direct actions, dispatch, and Features no longer require code config.

### Phase 3: Declarative OAuth

- Extend existing App auth metadata with missing declarative refresh mappings.
- Add OAuth start/callback/reconnect and hydrate `OAuthManager`.

### Phase 4: Migration and guidance

- Add migration assistance, MCP guidance, masked CLI inspection, documentation, and telemetry.

## Acceptance Criteria

The proposal is complete when:

1. A user connects an App in Workbench and supplies shared config/OAuth once.
2. A newly deployed SDK instance initialized only with access key, product, and environment can run
   the App action successfully after `ready()`.
3. No application-level `api.config()` or `api.oauth()` call is required.
4. Editing or rotating the connection propagates through runtime polling without a redeploy.
5. No secret or OAuth token is exposed outside the existing Secrets boundary.
6. Existing code-level config and OAuth remain compatible as explicit process overrides.
7. The implementation uses the existing product App environment mapping, App auth definitions,
   `app_access`, managers, and runtime snapshot rather than a parallel connection model.
