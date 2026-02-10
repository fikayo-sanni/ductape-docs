---
sidebar_position: 5
---

# Session Activity & Dashboard

Ductape provides session users and dashboard metrics to help you monitor and analyze session behavior. Use `ductape.sessions.fetchUsers`, `fetchUserDetails`, and `fetchDashboard`.

## Fetching Dashboard Metrics

Get dashboard metrics for your session (user counts, session counts, etc.):

```ts
import Ductape from '@ductape/sdk';

const ductape = new Ductape({
  accessKey: 'your-access-key',
  env_type: 'prd',
});

const dashboard = await ductape.sessions.fetchDashboard({
  product: 'my-product',
  session: 'user-session',
  env: 'prd',  // Optional
});

// User Metrics
console.log('Total users:', dashboard.totalUsers);
console.log('Active users:', dashboard.activeUsers);
console.log('Inactive users:', dashboard.inactiveUsers);
console.log('Expired users:', dashboard.expiredUsers);
console.log('New users today:', dashboard.newUsersToday);
console.log('New users this week:', dashboard.newUsersThisWeek);

// Session Metrics
console.log('Total sessions:', dashboard.totalSessions);
console.log('Active sessions:', dashboard.activeSessions);
console.log('Avg sessions per user:', dashboard.averageSessionsPerUser);
```

### Parameters

| Field     | Type     | Required | Description                                       |
|-----------|----------|----------|---------------------------------------------------|
| `product` | string   | Yes      | The tag of your product.                          |
| `session` | string   | Yes      | The tag of the session.                           |
| `env`     | string   | No       | Filter by environment.                            |

### Response

```ts
{
  // User Metrics
  totalUsers: number;              // Total unique users
  activeUsers: number;             // Users with active sessions
  inactiveUsers: number;           // Users with no active sessions
  expiredUsers: number;            // Users with all sessions expired
  newUsersToday: number;           // New users registered today
  newUsersThisWeek: number;        // New users registered this week

  // Session Metrics
  totalSessions: number;           // Total session count
  activeSessions: number;          // Currently active sessions
  averageSessionsPerUser: number;  // Average sessions per user
}
```

---

## Complete Example

Example: session monitoring with dashboard, users, and user details:

```ts
import Ductape from '@ductape/sdk';

const ductape = new Ductape({
  accessKey: 'your-access-key',
  env_type: 'prd',
});

async function displaySessionDashboard() {
  const dashboard = await ductape.sessions.fetchDashboard({
    product: 'my-product',
    session: 'user-session',
    env: 'prd',
  });

  console.log('=== Session Dashboard ===');
  console.log(`Users: ${dashboard.activeUsers}/${dashboard.totalUsers} active`);
  console.log(`Sessions: ${dashboard.activeSessions}/${dashboard.totalSessions} active`);
  console.log(`New users today: ${dashboard.newUsersToday}`);
  console.log(`Avg sessions per user: ${dashboard.averageSessionsPerUser}`);

  const users = await ductape.sessions.fetchUsers({
    product: 'my-product',
    session: 'user-session',
    env: 'prd',
    page: 1,
    limit: 10,
  });

  console.log('\n=== Recent Users ===');
  for (const user of users.users) {
    console.log(`${user.identifier} - Last seen: ${user.last_seen}`);
  }

  // Get specific user details
  if (users.users.length > 0) {
    const userDetails = await ductape.sessions.fetchUserDetails({
      product: 'my-product',
      session: 'user-session',
      identifier: users.users[0].identifier,
      env: 'prd',
    });

    console.log('\n=== User Details ===');
    console.log(`Total sessions: ${userDetails.totalSessions}`);
    console.log(`Active sessions: ${userDetails.activeSessionsCount}`);
  }
}

displaySessionDashboard();
```

---

## API Reference

### ductape.sessions methods (activity & dashboard)

| Method | Description |
|--------|-------------|
| `fetchUsers(options)` | Get paginated session users |
| `fetchUserDetails(options)` | Get detailed user info with session history |
| `fetchDashboard(options)` | Get dashboard metrics for a session |

### Options

```ts
// fetchUsers
{ product: string; session: string; env?: string; page?: number; limit?: number }

// fetchUserDetails
{ product: string; session: string; identifier: string; env?: string }

// fetchDashboard
{ product: string; session: string; env?: string }
```

### Error handling

These methods throw `SessionError` on failure:

```ts
import { SessionError } from '@ductape/sdk';

try {
  const dashboard = await ductape.sessions.fetchDashboard({
    product: 'my-product',
    session: 'user-session',
    env: 'prd',
  });
} catch (error) {
  if (error instanceof SessionError) {
    console.log('Error code:', error.code);
  }
}
```

---

## See Also

- [Managing Sessions](./overview.md)
- [Fetching Session Users](./fetching-users.md)
- [Creating Sessions](./use.md)
