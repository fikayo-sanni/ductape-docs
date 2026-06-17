---
title: Changelog
slug: /changelog
---

# Changelog

Release notes for the Ductape platform and SDKs are maintained in each package repository.

## 2026-05-19 — SDK 0.1.8

- **TypeScript (`@ductape/sdk` 0.1.8):** Constructor-only `product` / `env` runtime defaults; app action runtime renamed to `ductape.api` (was `ductape.actions`); see [SDK runtime defaults](/sdk/runtime-defaults).
- **Frontend (`@ductape/client`, `@ductape/react`, `@ductape/vue`):** `ductape.api` is the primary surface for running app actions (`run`, `oauth`, `share`, etc.); `ductape.actions` remains as a deprecated getter alias. Service class renamed to `ApiService` (`ActionService` alias kept).
- **Java, Go, .NET:** Version aligned to **0.1.8** (Go module tag `sdk/go/v0.1.8` when published).

## SDKs

| SDK | Changelog |
|-----|-----------|
| TypeScript (`@ductape/sdk`) | [sdk/ts/CHANGELOG.md](https://github.com/ductape/ductape/blob/main/sdk/ts/CHANGELOG.md) |
| Java | [sdk/java/CHANGELOG.md](https://github.com/ductape/ductape/blob/main/sdk/java/CHANGELOG.md) |
| Go | [sdk/go/CHANGELOG.md](https://github.com/ductape/ductape/blob/main/sdk/go/CHANGELOG.md) |
| .NET | Track releases via [GitHub Releases](https://github.com/ductape/ductape/releases) and `sdk/dotnet/PARITY_COMPLETION.md` |

## CLI

| Package | Changelog |
|---------|-----------|
| `@ductape/cli` | [cli/CHANGELOG.md](https://github.com/ductape/ductape/blob/main/cli/CHANGELOG.md) |

## Documentation

Site documentation changes ship with the [ductape-docs](https://github.com/ductape/ductape/tree/main/docs) folder in the monorepo.
