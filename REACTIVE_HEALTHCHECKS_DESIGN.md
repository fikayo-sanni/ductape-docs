# Reactive healthchecks

Status: built. Owner: resilience.

## Problem

Healthchecks probe on a fixed interval whether or not anything is wrong. Two things multiply the cost:

1. The proxy healthcheck worker probes every check in every environment on its interval.
2. Every SDK process that has Redis also runs its own `setInterval` per check
   (`ProcessorService.startHealthcheckWorkers`, 60 s by default), so N app instances probe the same
   asset N times per interval. The proxy worker only skips a probe when it finds a fresh local record.

Most of those probes confirm "still fine". The information is in the transitions: an asset failing, and an
asset coming back. Docs examples that use 15 s and 30 s intervals make this worse.

## What already exists

- When a quota or fallback provider attempt fails, the SDK calls
  `ProcessorService.markHealthcheckUnavailable`, which writes `status: unavailable` with
  `status_source: runtime_failure` to the in-process cache and to the product healthcheck env. The code
  comment says the interval monitor is "the only path that closes it again".
- The product healthcheck env already stores `status`, `status_source`, `lastChecked`, `lastLatency`.
- The proxy worker keeps Mongo-backed schedule rows with an atomic expiring lease per
  (product, healthcheck, env), so only one replica probes at a time.
- Quota and fallback runs refresh their health snapshot from the product on every run, so a status
  written by the worker reaches every SDK process on its next call.

The failure signal and the single-prober machinery are in place. What is missing is a mode in which the
worker sleeps until that signal arrives, and a way to say which failures count.

## Design

### 1. Mode

A healthcheck has a `mode`:

| Mode | Behaviour |
| --- | --- |
| `interval` | Today's behaviour: probe every `interval` ms. This is what every stored check without a `mode` keeps doing. |
| `reactive` | Sleep. Probe on a slow heartbeat. Wake when an operation fails. Probe with backoff until the asset has recovered, then sleep again. |

New checks default to `reactive`. A check keeps `interval` when the author sets an explicit
`interval` and no mode (explicit intent wins, as it does today), or sets `mode: 'interval'`.

Fields on the healthcheck (all optional):

```ts
mode?: 'interval' | 'reactive';
/** reactive: baseline probe while healthy, ms. Default 900000 (15 min). 0 turns the baseline off. */
heartbeat?: number;
/** reactive: how probing behaves after a failure. */
recovery?: {
  initial?: number;   // first re-probe delay, ms. Default 10000.
  max?: number;       // backoff ceiling, ms. Default 60000. This is the "check every minute" setting.
  successes?: number; // consecutive good probes before the check sleeps again. Default 2.
};
```

`interval` is ignored in reactive mode. `retries` keeps its meaning: retries inside one probe.

### 2. Waking up

Health is **assumed** until a failure says otherwise. A check that has never run is healthy; quota and
fallback routing treat a never-probed provider like a healthy one; the Workbench shows "Healthy, no
failures seen". A new reactive check is not probed when it is created.

The trigger is a **probe request** on the check's environment, `probe_requested_at` (plus `probe_reason`),
written by the SDK when an operation on the watched asset fails. The proxy worker wakes the check when:

```
env.probe_requested_at > schedule.last_signal_at
```

`last_signal_at` makes each request wake the check once. A request that arrives while the check is already
probing a failure is recorded but does not restart the backoff.

**Which operations.** A healthcheck probes an asset (an app, a database, a broker, and so on, named by its
`probe`). Any failed operation on that asset requests a probe from every check that watches it:

- App actions: any action on the app failing with a 5xx, a timeout or a refused connection (`processAction`).
- Databases: a failed connection.
- Message brokers: a failed publish or subscribe.
- Quota and fallback providers that name a check: unchanged, and stronger: the check is marked unavailable at
  once (the circuit opens) and a probe is requested too.

The remaining asset types (graph, storage, notifications, vector, cache, features) are not wired yet. They plug
in with one call, `reportAssetFailure`, at the point where the operation fails.

A plain asset failure only **requests a probe**. It does not change the asset's status: one failing endpoint
does not make an asset unhealthy, and the probe (the check's own health endpoint) decides.

**Which failures count** (`isInfrastructureFailure`): a failure is ignored only when it is positively
identified as the caller's fault, which means an HTTP 4xx other than 408, 425 and 429, or a validation error.
Timeouts, connection errors, 5xx, 408/425/429 and anything unrecognised still count. Quota and fallback errors
are unwrapped first, so the provider's own status is judged. This also stops a bad request from opening a
quota or fallback circuit.

**Cost control.** A check is asked to probe at most once per 15 seconds per SDK process, however many
operations fail, and a product's check list is read once per minute. Reporting never throws and never
delays the failing operation.

### 3. Probing and sleeping (proxy worker)

Each schedule row gains `mode`, `state` (`sleeping` | `probing`), `consecutive_successes`,
`last_signal_at`. State machine for a reactive row:

```
new row            -> sleeping, next_run_at = now + heartbeat   (assumed healthy: no probe on creation)
sleeping, signal   -> probing,  next_run_at = now, failures = 0, successes = 0
sleeping, probe ok -> sleeping, next_run_at = now + heartbeat   (heartbeat 0: no further probes)
sleeping, probe bad-> probing,  failures = 1, next_run_at = now + backoff(1)
probing,  probe bad-> probing,  failures++, successes = 0, next_run_at = now + backoff(failures)
probing,  probe ok -> successes++
                      successes >= recovery.successes -> sleeping, next_run_at = now + heartbeat
                      otherwise                       -> probing,  next_run_at = now + recovery.initial
backoff(n) = min(max, initial * 2^(n-1))
```

Properties:
- One prober per (product, healthcheck, env): the existing lease.
- A long outage costs at most one probe per `recovery.max`; a short one is found within `initial`.
- A flapping asset needs `successes` good probes in a row before it is trusted again.
- The worker still polls its own schedule table every `PROXY_HEALTHCHECK_POLL_INTERVAL_MS` (10 s) to
  find due rows. That is a database read, not a probe, so wake latency is at most one poll.
- The "defer to a fresh local record" shortcut is skipped for reactive rows. A runtime failure record is
  fresh by definition and must not suppress the confirming probe.

The worker also writes `monitor_state` (`sleeping` | `probing`) and `next_check_at` to the env so the
Workbench can show whether a check is idle or watching a failure.

### 4. SDK-local monitor

`ProcessorService.startHealthcheckWorkers` skips reactive checks. The proxy worker is their only prober;
SDK processes cannot coordinate with each other, which is exactly what made interval mode expensive.
Recovery reaches SDK processes through the per-run snapshot refresh described above.

### 5. Authoring

SDK:

```ts
ctx.reactive();                                            // defaults
ctx.reactive({ heartbeat: 600_000, recovery: { max: 30_000 } });
ctx.interval(60_000);                                      // explicit interval mode
```

Workbench: a "Check" selector on the healthcheck form with "When something fails (recommended)" and "On a
schedule". Reactive shows heartbeat and recovery fields; scheduled shows the interval. New checks start
reactive.

### 6. Compatibility

- A stored check without `mode` is `interval`. Nothing changes for existing checks until someone edits
  them or re-syncs a code definition that has no explicit interval.
- The tickets-hosted global scheduler skips reactive checks. The proxy worker is their only prober.
- A scheduled check also honours a probe request: it looks straight away, then carries on with its schedule.
- Quota and fallback now rank a never-probed provider with the healthy ones. Previously healthy providers
  were preferred over never-probed ones, which would have pushed a fallback's primary behind its backup.
- `canonicalHealthcheck` only includes the new fields when they are set, so unchanged definitions keep
  their revision hash.
- The NestJS mirror under `platform/nest` is not updated; it is being retired.

### 7. Not in this change

- Treating a successful real operation as a recovery signal. It needs a success report per call or a cheap
  "only when currently unavailable" gate on every SDK path.
- Transition events (healthy, down, recovered) as their own history rows. Probe rows still record each
  probe; reactive mode simply produces far fewer of them.
- Wiring the remaining asset types (graph, storage, notifications, vector, cache, features) to
  `reportAssetFailure`.
- The Workbench saves a reactive check in two steps: the old creation call, then a component update with the
  strategy. Moving creation to the current SDK would make it one step.

### 8. Risks

- The first caller to hit an outage sees the failure before routing reacts. Quotas and fallbacks fail over
  inside the same call, so this costs one attempt, not an error to the user.
- An asset nobody calls is only checked on the heartbeat. Alerts for such an asset arrive up to
  `heartbeat` late. Set a shorter heartbeat, or `interval` mode, for assets where that matters.
- Reactive checks depend on the proxy worker running. With `PROXY_HEALTHCHECK_WORKER_ENABLED=false`
  they never probe.
- The SDK writes a probe request by rewriting the check's environments, so it can race a probe result the
  worker is saving. The next probe rewrites the result. A request lost to the race is sent again by the next
  failure after the 15 second gap, so an outage that is still happening is not missed.
- Clocks: "a failure arrived during this probe" compares an SDK timestamp with the worker's clock.

## Test plan

- SDK: failure classification table; builder defaults and revision stability; monitor skips reactive.
- Proxy: pure policy tests for backoff, wake detection and every state transition above.
- Integrations: the new fields survive create and update (the schema is strict).
- Workbench: form payload for both modes.
