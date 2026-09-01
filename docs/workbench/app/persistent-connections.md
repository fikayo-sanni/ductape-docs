---
title: Persistent App connections
sidebar_label: Persistent connections
---

# Persistent App connections

Connect an App to a Product in the Workbench to configure it once for each Product environment. The connection stores:

- the App environment mapped to each Product environment;
- environment variables required by the App;
- the selected authentication method;
- encrypted authentication input and refreshed credential state.

To repair or rotate an existing connection, open the Product's **Connected Apps**, select the App, and choose **Edit connection** beside Product environments. Existing encrypted credentials are preserved unless you select **Replace credentials**. Older connections without mappings receive one editable row for every Product environment.

The same operation is available to agents and CI through the CLI. Keep the declaration at `ductape/apps/<app-tag>/connection.json`, then run:

```bash
ductape products apps configure \
  --product checkout \
  --app paystack \
  --connection-file ductape/apps/paystack/connection.json \
  --json
```

Omitting `auth` or `variables` from an environment preserves its existing saved value. Providing either field replaces that field. Connection files should contain `$Secret{KEY}` references rather than plaintext credentials; create or rotate the referenced workspace Secret separately.

Authentication is optional. Apps with formal authentication definitions use the selected auth scheme. Apps without one can use **Shared credentials** with a location and key, such as `headers:Authorization`. Leaving both sections empty creates an unauthenticated connection.

The TypeScript and NestJS SDKs fetch this configuration as part of the Product runtime snapshot when initialized with `product` and `env`.

```ts
const ductape = new Ductape({
  product: 'checkout',
  env: 'prd',
  // normal workspace authentication
});

await ductape.ready();
```

You do not need to repeat `ductape.api.config()` or `ductape.api.oauth()` in every service when the connection is configured in the Workbench. Those methods remain available as process-local overrides; explicit local values take precedence over the persisted connection.

## Reuse in runtime components

Direct App actions, Features, Quotas, Fallbacks, and App health checks use the same action processor. Reference the connected App's access tag and existing action tag in each component. Do not copy connection variables or credentials into the component definition.

```ts
await ductape.features.execute({
  product: 'checkout',
  env: 'prd',
  tag: 'initialize-payment',
  input: { amount: 5000, email: 'buyer@example.com' },
});
```

The runtime snapshot hydrates connection variables and `token_access` credentials before execution. `credential_access` login material is kept isolated to its authentication action; refreshed values continue through the encrypted auth lifecycle.

## Updates and multiple instances

Changing a connection updates the Product runtime revision. Running SDK instances detect the revision through lightweight polling, fetch the new snapshot, and atomically replace their runtime credential layer. A failed refresh keeps the last known good snapshot. Database schema and Database Action changes are covered by `databaseRevision`, which is included in the umbrella runtime revision.

## Security

Workbench connection data is persisted by the backend. Authentication payloads are validated against the App auth schema and encrypted with the Product key before storage. Never place plaintext credentials in Feature, Quota, Fallback, or health-check JSON files.
