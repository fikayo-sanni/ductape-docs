---
title: SDK Readiness
sidebar_label: SDK Readiness
---

# SDK readiness

Comparison for choosing a server SDK in production. TypeScript (`@ductape/sdk`) remains the reference implementation.

## Summary

| | TypeScript | Java | Go | .NET |
|---|------------|------|-----|------|
| **Current version** | 0.1.8 | 0.1.8 | v0.1.8 | 0.1.8 |
| **Production readiness** | Reference | Highest | High | Moderate |
| **Package** | `@ductape/sdk` | Maven `app.ductape:sdk` | `go get github.com/ductape/ductape/sdk/go` | NuGet `Ductape.Sdk` |
| **Release** | npm | OSSRH → Maven Central | Git tag `sdk/go/vX.Y.Z` | NuGet on GitHub Release |
| **Workflow/agent engines** | Full TS executors | Local executor seams | Default executors (bounded) | Seams + minimal defaults |

## Strengths

**Java** — Release runbook, OWASP/Snyk/license CI, OpenTelemetry, Resilience4j, Bucket4j, Neo4j Bolt, Redisson jobs/monitor, Spring Boot support.

**Go** — Broadest verified parity map, smoke tests ported from TS, BullMQ/Redis monitor options, live adapters (pgx, Bolt, Neptune, Arango).

**.NET** — ASP.NET Core integration, 400+ non-live tests, many opt-in live provider tests, flat service API.

## Known gaps (all SDKs)

- Full TS **workflow-executor** and **agent-executor** engines are not ported; use local executors or stay on TypeScript.
- Full fluent **ProductBuilder** DSL (~7k TS lines) is deferred; use flat product APIs or TS for builder-heavy setup.
- Live vector/graph vendor edge cases require credentials and opt-in live tests.

## Publishing credentials (maintainers)

| Registry | Secrets / setup |
|----------|-----------------|
| Maven Central | `OSSRH_USERNAME`, `OSSRH_PASSWORD`, `SIGNING_KEY`, `SIGNING_PASSWORD` |
| NuGet | `NUGET_API_KEY` |
| Go module proxy | Public repo + git tag only (no API key) |

See [Roadmap](/roadmap) and `sdk/PARITY_MASTER_TODO.md` in the repository for the full green checklist.
