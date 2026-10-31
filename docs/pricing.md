---
sidebar_position: 15
slug: /pricing
title: Pricing in Ductape
---

# Pricing

Ductape is free to build with. You pay when you run production systems with a team: for projects, environments, access controls, audit logs and how long logs are kept. The current prices are on the [pricing page](https://ductape.app/pricing.html).

## What is never charged

- Component definitions, however many you create
- SDK calls, CLI commands and MCP tool calls
- Database queries and storage operations on your own infrastructure
- Code your AI agents generate

Ductape connects to the databases, storage and other infrastructure you already run; the SDK talks to them directly. Ductape stores component configuration, logs and usage information.

## Plans

| | Free | Developer | Team | Business | Enterprise |
|---|---|---|---|---|---|
| Price | $0 | $19 / month | $99 / month | $299 / month | From $599 / month |
| Projects | 1 | 3 | 10 | Unlimited | Unlimited |
| Environments | 1 | 2 | 3 | 5 | Custom |
| Log retention | 3 days | 7 days | 30 days | 90 days | Custom |
| Team collaboration | Basic | Basic | Included | Advanced | Advanced |
| Role-based access control | | | Basic | Advanced | Custom |
| Audit logs | | | Limited | Included | Advanced |
| Enterprise support | | | | Optional | Included |
| Self-hosting | | | | | Custom licence |

Enterprise prices are agreed per contract. Paying yearly takes 10% off twelve months of the monthly price, on the plans that offer it.

## Work tracker

Each plan also includes a number of agent sessions open at once, open work items, rules that open work, and keys for outside systems for the [work tracker](./work/overview). An empty limit is unlimited.

| | Free | Developer | Team, Business, Enterprise |
|---|---|---|---|
| Agent sessions at once | 3 | 10 | Unlimited |
| Open work items | 100 | Unlimited | Unlimited |
| Rules that open work | 5 | 25 | Unlimited |
| Keys for outside systems | 2 | 5 | Unlimited |

## Reaching a limit

You cannot add more projects, environments or work tracker items past your plan's limit until you upgrade. Everything you already have keeps working, and nothing is removed. Work that a rule opens because something keeps failing is never held back by a limit.

## Usage

Ductape can measure how much log data each workspace sends, by project and environment, and show it on the Workbench's billing page. It is measured only: no plan charges for it.

## Self-hosted

Ductape can run on your own infrastructure under a licence. See the [self-hosted options](https://ductape.app/self-hosted.html). If a licence lapses, what you have built keeps running; creating new things from the CLI and the Workbench is paused until it is renewed.
