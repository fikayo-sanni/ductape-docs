---
title: Dashboard and Platform Health
description: The state of every system, what is failing, and how each resource is being used, on the first page of the Workbench.
---

# Dashboard and Platform Health

The dashboard is the first item in the sidebar and the page the Workbench opens on. The logs are the second item, one click away. Tabs you had open stay open behind the dashboard.

## Deployments and cloud connections

Below Activity by type, two summaries show what is deployed and where.

**Deployments** counts every deployment in the workspace (the latest 200) by state: active, in progress, and needing attention (failed or rolled back). It breaks them down by environment and by where they run (Cloud Run, AWS Lambda, Fargate, and so on), and lists what needs attention first, or the latest changes when nothing does. It also shows plans waiting for a person to approve them, blocked plans, builds that are running or have failed, and anything the deploy server says about itself (changes switched off, no worker running, approval email codes not set up).

**Cloud connections** counts the workspace's connected cloud accounts by provider and status, and lists each one with whether deployments can go through it today. A connection that is not ready says why: setup not finished, or not created with the deploy scope. Each shows how many deployments went through it.

## Platform health

The top of the dashboard shows the state of every system your workspace uses, for the period you choose (24 hours to a year), each compared with the period just before it.

- **Summary.** One sentence on how the platform is: every system healthy, some degraded, or some failing.
- **Calls, error rate and latency.** Totals for the period, with the change since the period before. Latency is shown as p50 (the typical call), p95 (the slowest 5%) and p99 (the slowest 1%), because an average hides the slow calls people notice.
- **Alerts.** What the numbers add up to, worst first. Open one to see the logs behind it.
- **Latest errors.** The most recent failures, with the system, the operation, the product and the message.
- **A card for every active system.** Calls, error rate and p95 with their changes, a chart of calls over time with the failed share marked, the most common error, and buttons to open that system's logs or only its failures. Systems with no activity in the period are listed in one line.

The systems are Actions, Functions, Features, Databases, Storage, Cache, Sessions, Events and queues, Notifications, Webhooks, Jobs, Graphs, Vectors, Quotas and fallbacks, and Health checks. A log type that is not one of these is shown as a system of its own, under its own name (a type called `quantum_thing` is "Quantum thing"); nothing is put in a catch-all. A log with no type is not counted, and frontend analytics events (clicks and page views) are not calls, so they are not counted.

### When an alert is raised

An alert needs at least 20 calls in the period, so a handful of calls never decides a rate.

| Alert | When |
|-------|------|
| Failing (critical) | 20% or more of calls failed |
| High error rate (warning) | 5% or more of calls failed |
| Errors rising (warning) | The error rate at least doubled since the period before, by at least 2 points, while still under 5% |
| Slow (warning) | p95 is 5 seconds or more |
| Got slower (warning) | p95 grew by half or more since the period before, and by at least 100 ms |
| Traffic dropped (notice) | Calls fell to a fifth or less of a period that had at least 50 |

A system is **Failing** when it has a critical alert, **Degraded** when it has a warning, **Healthy** when it has calls and none of these, and **No activity** when it has no calls.

## Resource usage

A table of every kind of resource: how many exist (databases, buckets, caches and queues), how much each was called with its share of all calls, its error rate, p95 latency and cost, and the one thing particular to it: data written for storage, hit rate for the cache, and calls over your plan. Open a row to see the busiest operations, which products use it, and its most common errors. **Usage by product** below it ranks products by how much they used the platform.

A product or app filter on the dashboard narrows all of this. Updates arrive every 30 seconds; if one fails, the last good answer stays on screen and says so.

## How it is measured

Everything comes from the workspace's own logs. Only finished calls are counted (a call that is still running is not counted twice), and percentiles are approximate over every measured call, not a sample. What you can see is limited by how long your plan keeps usage data. The read is `GET /log/v1/platform-health/<workspace>` with `time_range` (`1h`, `24h`, `7d`, `30d`, `90d`, `1y`) or `start_date` and `end_date`, and optional `product_tag`, `env` and `app_id`.
