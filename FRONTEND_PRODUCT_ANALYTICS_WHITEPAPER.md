# Frontend Product Analytics & End-to-End Session Tracking

## Whitepaper — Possibilities, Architecture, and Tradeoffs

**Status:** Proposal / exploration (no implementation committed)  
**Audience:** Product, platform, and SDK engineers  
**Goal:** Enable PostHog-style frontend observability (sessions, clicks, custom events) correlated with existing backend SDK logs — all keyed by Ductape session identity.

---

**Status:** Implemented (Phase 1 MVP)

| Component | Status | Location |
|-----------|--------|----------|
| `FRONTEND` log type | Done | `sdk/ts/src/logs/logs.types.ts` |
| `visitor_id` on logs | Done | logs model + ingest |
| Proxy ingest `POST /proxy/v1/analytics/track` | Done | `backend/proxy`, `platform/nest/apps/proxy` |
| `@ductape/client` analytics module | Done | `clients/client/src/services/analytics.ts` |
| React / Vue hooks | Done | `useAnalytics` |
| Workbench log filter | Done | `type=frontend` in Logs tab |
| Anonymous pre-login tracking | Done | `visitor_id` in localStorage |

---

## Executive Summary

**Yes, this is possible — and Ductape already has most of the plumbing.**

Today, Ductape sessions are JWT-based, backend SDK operations write structured rows to the shared `logs` collection with `session_id`, `session_tag`, and `session_user_id`, and the Workbench already surfaces session users, dashboards, and activity timelines. What is **missing** is a first-class **frontend event ingestion path** (page views, clicks, custom product analytics) and a **correlation layer** that stitches “user clicked Checkout” to “database.insert on orders” in one timeline.

This document explores how client SDKs (`@ductape/client`, `@ductape/react`, `@ductape/vue`) could capture frontend behavior, persist it to the same logs backend (or a sibling store), and join it with server-side execution logs via session key — without jumping straight to implementation.

**Recommended direction (high level):** Extend the existing logs pipeline with a new event family (`frontend` / `product_analytics`), add a lightweight `track()` API on client SDKs, optionally auto-capture DOM events behind an explicit opt-in, and introduce a shared **`trace_id`** header so a single user gesture can link to downstream proxy/SDK logs.

---

## 1. Problem Statement

Product teams want to answer questions like:

- Which users started checkout but never completed payment?
- What did the user do in the UI *before* this failed `actions.run`?
- How many clicks on “Upgrade” convert to a successful backend write?
- Is latency on the frontend (time-to-interactive) correlated with API errors?

PostHog, Mixpanel, Amplitude, and FullStory solve this with client SDKs, event batching, session identity, and analytics UI. Ductape already owns **sessions**, **structured logs**, and **Workbench analytics** for backend operations — the opportunity is to **close the loop on the frontend** using the same session key rather than bolting on a third-party tool (though that remains an option).

---

## 2. Current State (What Exists Today)

### 2.1 Sessions

| Capability | Status | Location |
|------------|--------|----------|
| Session create / verify / refresh / revoke | ✅ | `sdk/ts/src/sessions/` (+ Java, Go, .NET parity) |
| JWT token format `tag:jwt` | ✅ | Sessions docs, resolver |
| Encrypted session payload (`data` schema per product) | ✅ | Workbench session config |
| Publishable-key frontend flow (session required on every request) | ✅ | `@ductape/client`, `FRONTEND_ACCESS_KEY_STRATEGIES.md` |
| Session users, user details, dashboard metrics | ✅ | `ductape.sessions.fetchUsers`, Workbench `sessionUsersService` |

**Frontend constraint (important):** With a **publishable key**, the browser must pass `session` on every Ductape call; session lifecycle APIs are **backend-only**. The frontend already receives a session token from the product’s own auth/BFF — that token is the natural **correlation key**.

### 2.2 Logs table & backend correlation

The `logs` MongoDB collection already includes session fields:

```text
session_tag      — session configuration tag (e.g. user-session)
session_id       — unique session instance ID
session_user_id  — user identifier from session payload (selector field)
identifier       — (legacy/alternate user id on some models)
process_id       — groups related log lines for one operation
type             — LogEventTypes enum (database, storage, session, workflow, …)
parent_tag       — component tag (database name, session tag, app tag, …)
child_tag        — operation (insert, create, upload, …)
data             — JSON payload (supports data_encrypted)
latency, status, timestamp, env, product_tag, …
```

When backend SDK methods receive a `session` parameter, `processSessionForExecution()` verifies the JWT and injects `sessionLogFields` into every log line written by that request. **Backend → logs correlation by session already works.**

### 2.3 Client SDKs

| Package | Role | Analytics today |
|---------|------|-----------------|
| `@ductape/sdk` | Full server SDK | Logs via `LogsService` on operations |
| `@ductape/client` | Browser / publishable key | No `track()` / analytics module |
| `@ductape/react`, `@ductape/vue` | React/Vue wrappers | Hooks for actions, no analytics hooks |

### 2.4 Workbench & observability UI

| UI | What it shows |
|----|----------------|
| Logs tab | Per-request audit log (module, method, status, latency) |
| Activity timeline service | Aggregated ops by component kind (database, storage, session, …) |
| Session activity dashboard | User counts, active sessions, session history |
| Session user details | Per-user session list with `session_id` |

**Gap:** No Workbench view for “frontend events” or unified **session journey** (UI events + API logs interleaved).

### 2.5 What PostHog has that Ductape does not (yet)

- Client-side `capture(event, properties)` with batching
- Automatic pageview / click / rage-click capture
- Session replay (DOM recording)
- Feature flags & experiments tied to events
- Built-in funnels, retention, paths
- Identity merge (`anonymous` → `identified`)

---

## 3. Vision: End-to-End Session Timeline

```text
┌─────────────────────────────────────────────────────────────────────────┐
│  Browser (@ductape/client)                                              │
│  ┌──────────────┐   track('button_click')   ┌─────────────────────────┐ │
│  │ Session JWT  │ ─────────────────────────►│ Analytics ingest (proxy)│ │
│  │ (from BFF)   │   + trace_id              └───────────┬─────────────┘ │
│  └──────┬───────┘                                       │               │
│         │ session on API calls                          ▼               │
│         ▼                                    logs (type: frontend)      │
│  ┌──────────────┐                                       │               │
│  │ databases.   │ ── proxy ──► SDK ──► logs (database)  │               │
│  │ query(...)   │     same session_id + trace_id        │               │
│  └──────────────┘                                       │               │
└─────────────────────────────────────────────────────────┼───────────────┘
                                                          ▼
                                              Workbench: Session Journey
                                              (merge by session_id / trace_id)
```

**User story:** In Workbench, open a session user → see chronological mix of `$pageview`, `$click`, `checkout_started`, then `database.insert`, then `actions.run` success/fail — all filterable by env and product.

---

## 4. Architectural Options

### Option A — Extend the existing `logs` collection (recommended baseline)

Add a new `LogEventTypes` value, e.g. `FRONTEND` or `PRODUCT_ANALYTICS`, and write frontend events as log rows with the same session fields.

| Pros | Cons |
|------|------|
| Reuses ingestion API, encryption, Workbench fetch | `logs` schema not optimized for high-volume click streams |
| Single query surface for session journey | May need TTL / archival sooner |
| Consistent auth (publishable key + session) | Mixing ops audit logs with product analytics semantically |

**Shape of a frontend log row:**

```json
{
  "type": "frontend",
  "parent_tag": "analytics",
  "child_tag": "button_click",
  "product_tag": "acme:shop",
  "env": "prd",
  "session_id": "…",
  "session_tag": "user-session",
  "session_user_id": "user_123",
  "process_id": "trace_abc",
  "message": "Clicked Upgrade CTA",
  "data": {
    "event": "button_click",
    "properties": { "button_id": "upgrade-nav", "path": "/pricing" },
    "url": "https://app.example/pricing",
    "referrer": "…",
    "viewport": { "w": 1440, "h": 900 }
  },
  "status": "success",
  "timestamp": "…"
}
```

### Option B — Dedicated `product_events` collection

Separate MongoDB collection (or ClickHouse/BigQuery export) for analytics-scale events; `logs` stays operational audit.

| Pros | Cons |
|------|------|
| Independent scaling, indexing, retention | Two systems to query for full journey |
| Cleaner separation of concerns | New API, new Workbench views, migration story |

**When to choose:** >10M frontend events/day per workspace, or need columnar aggregations (funnels, retention) without impacting ops log queries.

### Option C — Hybrid (logs hot path + warehouse cold path)

Frontend events land in `logs` (or a buffer) for real-time session timeline; nightly/ streaming ETL to warehouse (see `DATA_WAREHOUSE_PROPOSAL.md`) for analytics.

| Pros | Cons |
|------|------|
| Real-time debugging + long-term analytics | More moving parts |
| Aligns with Ductape warehouse direction | ETL pipeline required |

### Option D — Export to PostHog / Segment / OpenTelemetry

Client SDK sends to Ductape **and/or** forwards to external analytics; Ductape enriches with session_id for backend correlation only.

| Pros | Cons |
|------|------|
| Best-in-class UI immediately | Another vendor, cost, data residency |
| Less platform build | Weaker “native” Workbench story |

**Pragmatic path:** Start with **Option A**, design schema so **Option B/C** can absorb overflow later without breaking client SDK contracts.

---

## 5. Client SDK Design (Possibilities)

### 5.1 Public API surface (illustrative)

```typescript
// @ductape/client — requires publishable key + session
await ductape.analytics.track({
  event: 'checkout_started',
  properties: { cart_value: 42.5, item_count: 3 },
  session: sessionToken,        // required (existing pattern)
  traceId?: 'optional-client-id' // correlates with next API calls
});

// Optional convenience
ductape.analytics.pageview({ path: '/checkout', session: sessionToken });

// Opt-in auto capture (explicit enable — privacy-sensitive)
ductape.analytics.enableAutoCapture({
  session: () => getSessionToken(),
  clicks: true,
  pageviews: true,
  rageClicks: false,
  maskTextSelectors: ['.password', '[data-private]'],
});
```

React / Vue wrappers would expose `useAnalytics()` / `useTrack()` with the same semantics.

### 5.2 Transport

| Approach | Notes |
|----------|-------|
| **Proxy route** `POST /analytics/track` (batch) | Consistent with publishable-key model; rate-limit at proxy |
| **Reuse logs ingest API** | If logs service accepts frontend type from publishable key |
| **`sendBeacon` on unload** | Reliable flush when tab closes; batch queue in memory |

**Batching:** Queue events client-side (e.g. max 10 events or 5s flush) to reduce chatter — standard PostHog pattern.

### 5.3 Trace correlation with backend logs

Introduce optional **`trace_id`** (or reuse `process_id`):

1. Client generates `trace_id` per user gesture / page navigation.
2. `analytics.track` includes `trace_id` in log row.
3. Client passes same id on subsequent SDK calls: header `x-ductape-trace-id` through proxy → SDK logs inherit it as `process_id`.
4. Workbench joins frontend + backend rows on `(session_id, process_id)`.

This yields tighter coupling than session-only correlation (which can span hours).

### 5.4 Multi-SDK parity

| SDK | Priority | Notes |
|-----|----------|-------|
| `@ductape/client` (TS) | P0 | Primary browser target |
| `@ductape/react`, `@ductape/vue` | P1 | Thin hooks |
| `@ductape/sdk` (server) | P2 | Server-side `track()` for SSR/BFF events |
| Java / Go / .NET | P3 | Only if server-side product analytics needed |

---

## 6. Backend Ingestion & Security

### 6.1 Auth model (align with existing frontend strategy)

- **Publishable key** in client bundle (scoped, rate-limited).
- **`session` JWT required** on every analytics call — same as storage/database.
- Proxy validates session before accepting events (prevents anonymous spam to logs).
- **No access key in browser** — unchanged.

### 6.2 Validation & abuse prevention

| Control | Purpose |
|---------|---------|
| Rate limit per session / IP / publishable key | Prevent log flooding |
| Max payload size & property count | Bound storage cost |
| Event name allowlist (optional per product config) | Schema discipline |
| PII scrubbing hooks client-side | GDPR-friendly defaults |
| `visible: false` for high-volume noise | Hide auto-capture from default audit UI |

### 6.3 Privacy & compliance

- **Opt-in auto-capture** — never on by default; document in product privacy policy.
- **No session replay (DOM recording)** in v1 — high privacy surface; defer or integrate third-party.
- **Data minimization** — hash URLs, strip query params, mask text fields.
- **Retention policies** — shorter TTL for `type: frontend` than operational logs (configurable per workspace).
- **User deletion** — cascade delete analytics rows by `session_user_id` when user erasure requested.

### 6.4 Encryption

Existing logs support `data_encrypted` with workspace private key. Frontend events likely contain **low-sensitivity behavioral data**; encryption may be optional for analytics rows but required if properties include user-entered text.

---

## 7. Workbench & Analytics UI (Possibilities)

Building on existing `activityTimelineService`, `sessionUsersService`, and Logs tab:

### Phase 1 — Session journey view

- Filter logs by `session_id` or `session_user_id`
- Show **interleaved** timeline: `type=frontend` + `type=database|actions|…`
- Color-code: UI vs API vs error

### Phase 2 — Product analytics dashboards

- Top events, counts by `child_tag` / `data.event`
- Simple funnels (config-driven: event A → event B → backend success)
- Conversion: frontend event → `successful_execution: true` within time window

### Phase 3 — Advanced (PostHog parity subset)

- Path analysis (sankey)
- Retention cohorts by `session_user_id`
- Optional integration export to BI tools

**Note:** Workbench already filters logs by module/status/user — extending filters for `type=frontend` and `session_id` is incremental.

---

## 8. Event Taxonomy (Suggested)

### Standard auto-capture events (if enabled)

| Event | `child_tag` | Properties |
|-------|-------------|------------|
| Page view | `$pageview` | `path`, `title`, `referrer` |
| Click | `$click` | `element`, `text` (masked), `xpath` or `data-track` |
| Rage click | `$rage_click` | `element`, `click_count` |
| Session start | `$session_start` | `entry_path` |
| Session end | `$session_end` | `duration_ms` (beacon) |

### Custom product events (developer-defined)

```text
signup_started, signup_completed, plan_selected, checkout_started,
payment_failed, feature_used, …
```

Configure optional **event catalog** in Workbench (product resource) for validation and funnel builder dropdowns — similar to session schema today.

---

## 9. Comparison to PostHog

| Capability | PostHog | Ductape (proposed) |
|------------|---------|---------------------|
| Frontend event capture | ✅ Native | ✅ Via client SDK |
| Session identity | ✅ Distinct ID | ✅ Existing JWT session |
| Backend correlation | ❌ (needs custom) | ✅ **Native** via same session + trace_id |
| Ops / API audit logs | ❌ | ✅ Already in logs |
| Session replay | ✅ | ❌ Defer / partner |
| Feature flags | ✅ | 🔶 Separate concern (could link later) |
| Funnels / retention UI | ✅ Mature | 🔶 Build or export |
| Data residency / self-host | ✅ | ✅ Your MongoDB / infra |
| Pricing | Per event | Infrastructure cost only |

**Ductape’s differentiator:** One session key ties **UI behavior → proxy → SDK → database/storage/actions logs** in the same product workspace — PostHog requires custom instrumentation on the backend to achieve comparable correlation.

---

## 10. Phased Rollout (Suggested)

### Phase 0 — Design & schema (1–2 weeks)

- Finalize Option A vs hybrid
- Add `FRONTEND` to `LogEventTypes` (TS + backend logs service)
- Document event schema & privacy defaults
- ADR for `trace_id` header through proxy

### Phase 1 — Manual track API (MVP)

- `@ductape/client`: `analytics.track()` + batch ingest endpoint
- Write to `logs` with session fields
- Workbench: filter `type=frontend`, session journey list view

### Phase 2 — Trace correlation

- `x-ductape-trace-id` through proxy on all client SDK calls
- Journey view groups by trace + session

### Phase 3 — Auto-capture & React/Vue hooks

- Opt-in click/pageview capture
- `useAnalytics()` hook
- Rate limits & masking

### Phase 4 — Analytics productization

- Funnels, retention (Workbench or warehouse-backed)
- Server SDK `track()` for BFF/SSR
- Java/Go/.NET if demand exists

### Phase 5 — Scale path (optional)

- Migrate high-volume frontend events to columnar store
- Real-time aggregations

---

## 11. Risks & Open Questions

| Question | Options |
|----------|---------|
| Volume: clicks generate 10–100× more rows than API logs | Sampling, batching, separate collection, TTL |
| Should frontend events bill toward quota/pricing? | Yes (fair usage) vs no (product analytics included) |
| Identity before login? | Anonymous `device_id` until session issued; merge on login |
| Single-page app navigation | `$pageview` on route change (History API hook) |
| Workbench performance querying mixed logs | Index `(session_id, timestamp)`, `(session_user_id, timestamp)` |
| Cross-product analytics | Usually scoped by `product_tag`; workspace-level rollup optional |

---

## 12. Recommendation

1. **Proceed — feasibility is high.** Sessions, log schema fields, proxy session enforcement, and Workbench activity infrastructure are already in place.

2. **Start with Option A** (frontend events as a new `logs` type) plus **`trace_id` correlation** for tight UI→API linking.

3. **Ship `@ductape/client` analytics module first** with manual `track()` only; add auto-capture only after privacy review.

4. **Do not build session replay in v1** — poor ROI vs privacy cost; link out to PostHog/FullStory if customers need it.

5. **Design the client API now** so server SDKs and warehouse export can adopt the same event envelope later.

---

## 13. Related Documents

- [Sessions overview](./docs/sessions/overview.md)
- [Session activity dashboard](./docs/sessions/activity-dashboard.md)
- [Frontend access key strategies](./FRONTEND_ACCESS_KEY_STRATEGIES.md)
- [Workbench logs overview](./docs/docs/workbench/logs-overview.md)
- [Data warehouse proposal](./DATA_WAREHOUSE_PROPOSAL.md)
- `@ductape/client` README — publishable key + session-in-params model

---

## Appendix A — Minimal event envelope (draft)

```typescript
interface IFrontendAnalyticsEvent {
  event: string;                          // e.g. button_click, $pageview
  properties?: Record<string, unknown>;
  session: string;                        // tag:jwt — required
  traceId?: string;
  timestamp?: string;                     // client clock; server overrides
  context?: {
    url?: string;
    path?: string;
    referrer?: string;
    userAgent?: string;
    locale?: string;
    screen?: { width: number; height: number };
  };
}
```

## Appendix B — Correlation keys (priority order)

1. **`trace_id` / `process_id`** — same user action chain (seconds/minutes)
2. **`session_id`** — same login session (minutes/hours)
3. **`session_user_id`** — same user across sessions (days/weeks)
4. **`product_tag` + `env`** — aggregate product health (always)

---

*Document version: 1.0 — exploratory whitepaper, not an implementation spec.*
