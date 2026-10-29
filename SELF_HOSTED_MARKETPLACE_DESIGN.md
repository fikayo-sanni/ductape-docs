# Self-hosted installs and the hosted marketplace

Status: the import, update, entitlement, grace period and usage reporting described below are built in the apps service
(`platform/backend/apps/src/remote-marketplace`) and tested end to end against real services. See "Built and not built".
The Workbench screens, the paid-app purchase flow, publishing from an instance, moving a cloud workspace to self-hosted,
and self-hosted support in the CLI, MCP and SDK are not finished.

## The question

Can a self-hosted Ductape import an app from the hosted marketplace into its own workspaces, with the third party
keeping ownership, given that a self-hosted install has to be self-contained? And how would paid apps work?

Yes. Importing is straightforward. Payment is the part with a real trade-off, and it is covered below.

## What already exists

- The marketplace service stores a listing as a full copy of an app definition (actions, versions, auth, webhooks,
  pricing plans), with an approval and suspension workflow.
- A workspace uses an app that someone else owns through an access record. The runtime resolves the access tag to
  the app definition and calls the third party's API with the connecting workspace's own credentials. The
  publisher never sees the buyer's requests or secrets.
- A self-hosted instance holds a licence (tier, workspace, product and user limits, expiry). The hosted pricing
  service issues, activates and validates licences. The instance now activates and re-checks its licence itself,
  server to server, once a day. That daily call is the natural place to refresh marketplace entitlements too.

## Proposed design

### 1. Browse

The instance's own marketplace service calls the hosted marketplace for the catalogue (list, detail, versions).
The browser never talks to the hosted cloud directly. If the instance is offline it shows what it has installed and
a "cannot reach the marketplace" note; nothing else breaks.

### 2. Import

Importing is an "install" request from the instance to the hosted marketplace. It sends the licence code, the
instance address, the app and the version, and nothing else. The hosted side checks the licence is valid, records
the install, and returns a **signed package**:

- the app definition for that version,
- the publisher (workspace and name), a package hash, and a signature made with a Ductape signing key,
- an entitlement: which app, which plan, and when it expires.

The instance verifies the signature with a public key it ships with and stores the app locally:

- an app document marked `origin: remote_marketplace`, with the publisher, the remote app id and the version,
- locked: its actions cannot be edited, exported or republished from the instance,
- an access record in the importing workspace, exactly like connecting to a local public app.

Because the runtime already resolves apps through the access record, calls work with no further change, and they
keep working with no internet access. The instance is self-contained at run time.

### 3. Ownership

The stored package is immutable and always shows its publisher. Updates are offered, not forced: the instance
asks for newer versions during its daily call and shows an update badge. If the publisher unpublishes the app or
Ductape suspends it, the entitlement is not renewed and the app is disabled after a grace period (it is disabled,
not deleted, so reinstating it restores it).

### 4. Paying

| App type | How it works on a self-hosted install |
| --- | --- |
| Free | Import needs only a valid licence. No entitlement expiry. |
| One-time or subscription | Bought on the hosted cloud against the licence holder's account (the existing Paystack flow). The install returns an entitlement with an expiry, renewed by the daily call. Past the 30 day grace period (see Decisions) the app is disabled until the instance reconnects and renews. |
| Metered (per call) | Needs usage reporting. The instance batches call counts (counts only, never payloads) into the daily call. This is honour-based: a modified instance can under-report. Accepted (see Decisions). |

Revenue share is handled entirely on the hosted side, because every purchase happens there. The instance never
handles money.

Suggested order: free apps first, then subscription and one-time paid apps, then metered reporting.

### 5. Security and privacy

- The signature means a publisher cannot be impersonated and a database edit cannot create an entitlement.
- An entitlement is tied to the licence and the instance address.
- Only the licence code, the instance address, the app id and the version leave the instance. No credentials, no
  request data.

## What would have to be built

- Hosted: install, updates and entitlement endpoints, and a signing key.
- Marketplace service: a remote client, the import action, an update check.
- Apps service: the `origin` and `locked` fields and the rules that follow from them.
- Workbench: a "Hosted marketplace" source in the marketplace tab, an Import button, an update badge.
- Licence tie-in: renew entitlements in the same daily call as the licence check, and add a `max_apps` limit.
- Usage reporting for metered apps, sent in the same daily call.
- Publishing from a self-hosted instance to the hosted marketplace (its own design).

## Decisions (confirmed)

1. Imported apps count toward the licence's app limit. Licences have no app limit today (only users, workspaces and
   products), so this needs a new `max_apps` limit on the licence tiers, enforced the same way as the workspace and
   product limits: server-derived from the hosted licence, checked fail-closed on import.
2. Support for an imported app belongs to the publisher. After importing, the owner of the instance can fetch newer
   versions on demand (a "Check for updates" action on the imported app), in addition to the daily update check.
   Updates are never applied without the owner choosing to.
3. Free apps never expire. Paid entitlements get a one-month (30 day) grace period after the entitlement lapses or
   the instance has been unable to renew it, replacing the 14 days suggested above. After the grace period the app
   is disabled, not deleted.
4. Self-hosted instances may publish apps to the hosted marketplace. This is a separate feature: the instance would
   submit an app to the hosted marketplace under the licence holder's hosted account, going through the normal
   approval workflow. It needs its own design (identity of the publisher, payouts, and what happens to the app if
   the licence lapses).
5. Metered pricing is allowed on self-hosted with honour-based reporting. The instance batches call counts (counts
   only) into the daily call, and the hosted side bills from those reports. Because the reports can be understated,
   keep the safeguards cheap and visible: report per app and per day, flag instances whose counts fall far below
   their historic pattern, and let a publisher choose to exclude metered pricing for self-hosted.

## Built and not built

Built (apps service, with licence changes in pricing and users):

- Hosted side, under `/apps/v1/remote/hub`: catalogue, app detail, install, sync (the daily call) and usage endpoints. A
  licence is checked against the licence service on every call and is bound to the instance address it was activated for.
- Signed packages and entitlements (Ed25519). The publisher's auth secrets and user ids are never in a package.
- Instance side, under `/apps/v1/remote`: browse, import, list imported, check for updates, fetch an update, and a daily
  sync that refreshes entitlements and reports metered usage. Imported apps are locked: writes are refused for any route
  that takes the app, and deleting (uninstalling) is allowed.
- App limit: licences carry `max_apps` (starter 5, team 25, business unlimited). Counted per imported app on the instance,
  checked before the download and again after the app is stored.
- Grace period: 30 days, for lapsed paid entitlements and for withdrawn apps. After it, the app stops resolving.

Not built:

- The purchase flow for paid apps. The hub issues entitlements for free apps automatically, and for paid apps only when an
  entitlement has been granted (`grantEntitlement` in `hub.service.ts`). Nothing in the platform charges a licence holder for
  a third-party app yet, so today a paid app answers 402 until someone grants it.
- Signing keys. Generate a pair with `platform/scripts/generate-marketplace-keys.mjs`, set `MARKETPLACE_SIGNING_KEY` on the
  hosted apps service and `MARKETPLACE_PUBLIC_KEY` on instances. Without the public key, importing is off.
- Billing from the usage reports (`remote_usage`), and publishing from an instance.

## Moving a cloud workspace to self-hosted

Requested: a workspace on the hosted cloud can be moved to a self-hosted instance, after paying.

1. The owner buys (or already holds) a licence with room for another workspace.
2. On the hosted cloud, the owner starts an export for that workspace and licence. The hosted side checks the licence is
   active and has a free workspace slot, then builds an export of the workspace: products, apps, environments, features,
   secrets and settings, but not logs. Encrypted fields are decrypted with the cloud key for packaging.
3. The export is encrypted for the instance (a key derived from the licence code and instance address) and signed with the
   marketplace signing key. Only that instance can open it.
4. The instance imports it, re-encrypting every field under its own ENC_KEY, and counts it against `max_workspaces`.
5. The cloud workspace is marked migrated and made read-only (not deleted). It can be reopened by support if the move fails.

Open questions: whether usage history moves, and how long the cloud copy is kept before the owner may delete it.

## CLI, MCP and SDK on a self-hosted instance

- SDK: `DUCTAPE_API_BASE_URL` already redirects every client to the instance. It needs an option in code as well.
- CLI: profiles exist, but the built-in `local` profile points at `http://localhost:4311/api`, and the Express gateway has no
  `/api` prefix. It needs a corrected self-hosted profile and a command to add one by URL.
- MCP: the base URL is hard coded to `https://api.ductape.app`. It needs a base URL setting (environment variable and
  profile) so the same tools run against an instance.

## ENC_KEY on a self-hosted install

Each install must have its own ENC_KEY, generated on that install and never shared with the cloud or other customers. It
encrypts every workspace and app private key and signs module tokens; a shared key would let one install's stored keys be
read by another. Compose already refuses to start without one, but nothing generates it. Add a first-run step that creates a
long random key and rejects empty or placeholder values. The marketplace signing key and the deploy signing keys are
separate from ENC_KEY. Moving a workspace in from the cloud re-encrypts it under the instance's key (above).
