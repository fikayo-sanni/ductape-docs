---
sidebar_position: 4
---

# Enabling Caching

Caching is essential for improving performance, reducing redundant work, and supporting efficient jobs and healthchecks in Ductape. To enable caching, you must provide a `redis_url` when initializing your Ductape credentials. This connects Ductape to your Redis instance for fast, reliable caching.

## Why Enable Caching?
- **Performance:** Store and reuse results of expensive operations.
- **Jobs:** Jobs can use cached data to avoid unnecessary processing.
- **Healthchecks:** Caching helps track recent results and system health efficiently.

## Required Credentials
| Field         | Type   | Required | Description                                 | Example                                 |
|---------------|--------|----------|---------------------------------------------|-----------------------------------------|
| user_id       | string | Yes      | Your Ductape user ID                        | "user_123"                             |
| workspace_id  | string | Yes      | Your Ductape workspace ID                   | "workspace_456"                        |
| private_key   | string | Yes      | Your Ductape private key                    | "abcd-efgh-ijkl"                       |
| redis_url     | string | Yes      | URL to your Redis instance for caching      | "redis://default:password@host:6379"   |

## Example
```typescript
import Ductape from '@ductape/sdk';

const credentials = {
  user_id: process.env.DUCTAPE_USER_ID,
  workspace_id: process.env.DUCTAPE_WORKSPACE_ID,
  private_key: process.env.DUCTAPE_PRIVATE_KEY,
  redis_url: process.env.REDIS_URL, // Your Redis URL
};

const ductape = new Ductape(credentials);
ductape.monitor();

export default ductape;
```

- The `redis_url` should point to your authenticated Redis instance and will be used to power local caching.
- The `ductape.monitor()` function call establishes the connection to system monitoring with redis.

## Example Redis URL
```
redis://default:your_password@redis.example.com:6379
```

## Caching and Jobs
Jobs in Ductape often process large amounts of data or perform repeated operations. By enabling caching, jobs can quickly access previously computed results, avoid redundant work, and complete faster. To use caching in a job, simply reference your cache tag in the job configuration or when running the job.

## Caching and Healthchecks
Healthchecks monitor the status and responsiveness of your system. With caching enabled, healthchecks can store and retrieve recent check results, reducing the load on your services and providing a reliable snapshot of system health. This helps you detect issues early without overwhelming your backend.