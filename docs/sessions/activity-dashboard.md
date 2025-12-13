---
sidebar_position: 5
---

# Session Activity & Dashboard

Ductape provides comprehensive session activity logging and dashboard metrics to help you monitor, analyze, and debug session behavior across your products.

## Fetching Activity Logs

Retrieve paginated session activity logs to track session operations like create, verify, refresh, and revoke:

```ts
const logs = await sessions.fetchActivityLogs({
  product: "my-product",
  session: "user-session",
  env: "production",         // Optional: filter by environment
  status: "success",         // Optional: 'success', 'fail', or 'processing'
  start: "2024-01-01",       // Optional: start date filter
  end: "2024-01-31",         // Optional: end date filter
  page: 1,                   // Page number (default: 1)
  limit: 20                  // Logs per page (default: 20)
});

console.log('Total logs:', logs.total);
console.log('Total pages:', logs.totalPages);

for (const log of logs.logs) {
  console.log('Operation:', log.parent_tag);
  console.log('Status:', log.status);
  console.log('Message:', log.message);
  console.log('Timestamp:', log.timestamp);
}
```

### Parameters

| Field     | Type     | Required | Description                                       |
|-----------|----------|----------|---------------------------------------------------|
| `product` | string   | Yes      | The tag of your product.                          |
| `session` | string   | Yes      | The tag of the session.                           |
| `env`     | string   | No       | Filter by environment.                            |
| `status`  | string   | No       | Filter by status: 'success', 'fail', 'processing'.|
| `start`   | string   | No       | Start date for filtering (ISO format).            |
| `end`     | string   | No       | End date for filtering (ISO format).              |
| `page`    | number   | No       | Page number (default: 1).                         |
| `limit`   | number   | No       | Logs per page (default: 20).                      |

### Response

```ts
{
  logs: ISessionActivityLog[];  // Array of activity log entries
  total: number;                // Total number of logs
  page: number;                 // Current page
  limit: number;                // Logs per page
  totalPages: number;           // Total number of pages
}
```

Each log entry includes:
- `_id` - Log entry ID
- `process_id` - Unique process identifier
- `product_tag` - Product tag
- `session_tag` - Combined session tag (format: `product_tag:session_tag`)
- `parent_tag` - Operation type (e.g., 'create', 'verify', 'refresh', 'revoke')
- `env` - Environment
- `type` - Log type ('session')
- `message` - Human-readable log message
- `status` - Operation status ('success', 'fail', 'processing')
- `successful_execution` - Boolean indicating success
- `failed_execution` - Boolean indicating failure
- `data` - Additional operation data (JSON string)
- `start` - Operation start timestamp (ms)
- `end` - Operation end timestamp (ms)
- `timestamp` - Log creation timestamp

---

## Fetching Dashboard Metrics

Get comprehensive dashboard metrics for your session including user statistics and operation analytics:

```ts
const dashboard = await sessions.fetchDashboard({
  product: "my-product",
  session: "user-session",
  env: "production",         // Optional: filter by environment
  groupBy: "day",            // Optional: 'hour', 'day', 'week', 'month'
  start: "2024-01-01",       // Optional: start date
  end: "2024-01-31"          // Optional: end date
});

// User & Session Metrics
console.log('Total users:', dashboard.totalUsers);
console.log('Active users:', dashboard.activeUsers);
console.log('Total sessions:', dashboard.totalSessions);
console.log('Active sessions:', dashboard.activeSessions);
console.log('Expired sessions:', dashboard.expiredSessions);

// Performance Metrics
console.log('Success rate:', dashboard.successRate + '%');
console.log('Error rate:', dashboard.errorRate + '%');
console.log('Avg duration:', dashboard.averageSessionDuration + 'ms');

// Operations over time
for (const period of dashboard.operationsOverTime) {
  console.log(`${period.period}:`);
  console.log(`  Create: ${period.create}`);
  console.log(`  Verify: ${period.verify}`);
  console.log(`  Refresh: ${period.refresh}`);
  console.log(`  Revoke: ${period.revoke}`);
}
```

### Parameters

| Field     | Type     | Required | Description                                       |
|-----------|----------|----------|---------------------------------------------------|
| `product` | string   | Yes      | The tag of your product.                          |
| `session` | string   | Yes      | The tag of the session.                           |
| `env`     | string   | No       | Filter by environment.                            |
| `groupBy` | string   | No       | Time grouping: 'hour', 'day', 'week', 'month'.    |
| `start`   | string   | No       | Start date for filtering (ISO format).            |
| `end`     | string   | No       | End date for filtering (ISO format).              |

### Response

```ts
{
  // User Metrics
  totalUsers: number;           // Total unique users
  activeUsers: number;          // Users active in last 24 hours

  // Session Metrics
  totalSessions: number;        // Total session count
  activeSessions: number;       // Currently active sessions
  expiredSessions: number;      // Expired session count

  // Performance Metrics
  successRate: number;          // Percentage of successful operations
  errorRate: number;            // Percentage of failed operations
  averageSessionDuration: number; // Average operation duration in ms

  // Time-series Data
  sessionsOverTime: {
    period: string;             // Time period label
    created: number;            // Sessions created
    expired: number;            // Sessions expired
  }[];

  operationsOverTime: {
    period: string;             // Time period label
    create: number;             // Create operations count
    verify: number;             // Verify operations count
    refresh: number;            // Refresh operations count
    revoke: number;             // Revoke operations count
  }[];
}
```

---

## Complete Example

Here's a complete example showing how to build a session monitoring dashboard:

```ts
import { SessionsService } from '@ductape/sdk';

const sessions = new SessionsService({
  workspace_id: 'your-workspace-id',
  public_key: 'your-public-key',
  user_id: 'your-user-id',
  token: 'your-token',
  env_type: 'prd',
});

async function displaySessionDashboard() {
  // Get dashboard metrics
  const dashboard = await sessions.fetchDashboard({
    product: 'my-product',
    session: 'user-session',
    env: 'production',
    groupBy: 'day',
  });

  console.log('=== Session Dashboard ===');
  console.log(`Users: ${dashboard.activeUsers}/${dashboard.totalUsers} active`);
  console.log(`Sessions: ${dashboard.activeSessions}/${dashboard.totalSessions} active`);
  console.log(`Success Rate: ${dashboard.successRate}%`);

  // Get recent users
  const users = await sessions.fetchUsers({
    product: 'my-product',
    session: 'user-session',
    env: 'production',
    page: 1,
    limit: 10,
  });

  console.log('\n=== Recent Users ===');
  for (const user of users.users) {
    console.log(`${user.identifier} - Last seen: ${user.last_seen}`);
  }

  // Get recent activity
  const logs = await sessions.fetchActivityLogs({
    product: 'my-product',
    session: 'user-session',
    env: 'production',
    page: 1,
    limit: 10,
  });

  console.log('\n=== Recent Activity ===');
  for (const log of logs.logs) {
    const status = log.status === 'success' ? '✓' : '✗';
    console.log(`${status} ${log.parent_tag} - ${log.message}`);
  }
}

displaySessionDashboard();
```

---

## API Reference

### Session Activity Methods

| Method | Description |
|--------|-------------|
| `fetchUsers(options)` | Get paginated session users |
| `fetchUserDetails(options)` | Get detailed user info with session history |
| `fetchActivityLogs(options)` | Get paginated session activity logs |
| `fetchDashboard(options)` | Get comprehensive dashboard metrics |

### TypeScript Interfaces

```ts
interface IFetchSessionUsersOptions {
  product: string;
  session: string;
  env?: string;
  page?: number;
  limit?: number;
}

interface IFetchSessionUserDetailsOptions {
  product: string;
  session: string;
  identifier: string;
  env?: string;
}

interface IFetchSessionActivityLogsOptions {
  product: string;
  session: string;
  env?: string;
  status?: 'success' | 'fail' | 'processing';
  start?: string;
  end?: string;
  page?: number;
  limit?: number;
}

interface IFetchSessionDashboardOptions {
  product: string;
  session: string;
  env?: string;
  groupBy?: 'hour' | 'day' | 'week' | 'month';
  start?: string;
  end?: string;
}
```

---

## Error Handling

All session activity methods throw `SessionError` on failure:

```ts
import { SessionError } from '@ductape/sdk';

try {
  const logs = await sessions.fetchActivityLogs({
    product: 'my-product',
    session: 'user-session',
  });
} catch (error) {
  if (error instanceof SessionError) {
    console.log('Error code:', error.code);
    // Codes: FETCH_USERS_FAILED, FETCH_USER_DETAILS_FAILED,
    //        FETCH_ACTIVITY_LOGS_FAILED, FETCH_DASHBOARD_FAILED,
    //        USER_NOT_FOUND
  }
}
```

---

## See Also

- [Managing Sessions](./overview.md)
- [Fetching Session Users](./fetching-users.md)
- [Creating Sessions](./use.md)
