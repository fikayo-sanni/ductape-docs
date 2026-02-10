# App Overview Dashboard - Logs Service Integration

## Status: IMPLEMENTED

This document outlines the implementation of the logs service integration for the App Overview Dashboard. The implementation replaces dummy/static data in `AppTabContent.tsx` with real metrics fetched from the Logs Service.

## Implementation Summary

### Files Created/Modified:

1. **`workbench/src/types/logs.ts`** - Added reusable dashboard types
2. **`workbench/src/services/logsServices.ts`** - Added `fetchAppDashboard` function
3. **`workbench/src/hooks/useAnalytics.ts`** - Created reusable analytics hooks
4. **`workbench/src/components/tabs/AppTabContent.tsx`** - Updated to use real data

---

## Executive Summary

This document outlines a comprehensive plan to replace the dummy/static data in `AppTabContent.tsx` (App Overview Dashboard) with real metrics fetched from the Logs Service. Currently, the dashboard displays hardcoded values for API analytics, request trends, and endpoint statistics. This plan details the data mapping, API endpoints, and implementation strategy.

---

## Current State Analysis

### Data Currently Displayed (Lines 1106-1137 in AppTabContent.tsx)

The App Overview dashboard currently shows **dummy data** for:

| Metric | Current Source | Example Value |
|--------|---------------|---------------|
| Total Requests | Hardcoded | 45,678 |
| Success Rate | Hardcoded | 98.7% |
| Avg Latency | Hardcoded | 142ms |
| Error Rate | Hardcoded | 1.3% |
| Active Endpoints | From `selectedVersion.actions.length` | Dynamic |
| Webhook Events | Hardcoded | 1,234 |
| Requests by Method (GET/POST/PUT/DELETE) | Hardcoded | Static percentages |
| Request Activity (Last 7 Days) | Hardcoded | Static daily values |
| Top Endpoints | Random generation | Random calls/latency |

---

## Logs Service Capabilities

### Available Backend Endpoints (from `log.routes.ts`)

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/analytics/:workspace_id` | GET | Main analytics endpoint - returns metrics, usage data, and logs |
| `/api-usage-metrics/:workspace_id` | GET | API usage and traffic metrics |
| `/error/rate/:workspace_id` | GET | Error rate metrics over time |
| `/failed/metrics/:workspace_id` | GET | Failed API call metrics |
| `/log-summary` | GET | Summary with graph data and totals |

### Log Data Model (from `log.model.ts` & `log.type.ts`)

```typescript
interface Logging {
  product_tag: string;
  app_tag: string;
  workspace_id: ObjectId;
  parent_tag: string;      // e.g., app tag
  child_tag: string;       // e.g., action tag
  app_id: ObjectId;
  app_env: string;
  type: string;            // 'action', 'app', 'feature', etc.
  action: string;          // action name/tag
  name: string;
  message: string;
  data: string;
  start: number;           // timestamp ms
  end: number;             // timestamp ms
  latency: number;         // duration in ms (end - start)
  status: 'success' | 'fail' | 'processing';
  successful_execution: boolean;
  failed_execution: boolean;
  timestamp: Date;
}
```

### Key Query Parameters for App Analytics

```typescript
// For app-level analytics
{
  component: 'app',           // Required: 'app' or 'product'
  app_id: string,             // The app's ObjectId
  type?: 'action',            // Filter by log type
  app_env?: string,           // Environment filter (e.g., 'production')
  version?: string,           // App version tag
  tag?: string,               // Specific action tag
  groupBy?: 'hour' | 'day' | 'week' | 'month',
  start_date?: string,        // ISO date string
  end_date?: string,          // ISO date string
  page?: number,
  limit?: number
}
```

---

## Data Mapping: Dashboard → Logs Service

### 1. Total Requests

**Source:** `/analytics/:workspace_id?component=app&app_id={app_id}`

**Response Field:** `usageData.requests` (aggregated count)

**Implementation:**
```typescript
// From analytics endpoint
const totalRequests = response.usageData?.requests?.reduce(
  (sum, period) => sum + period.incoming + period.outgoing, 0
) || 0;
```

### 2. Success Rate

**Source:** `/analytics/:workspace_id?component=app&app_id={app_id}`

**Calculation:**
```typescript
const successRate = (
  (totalSuccessfulExecutions / totalExecutions) * 100
).toFixed(1);

// From logs aggregation:
// status === 'success' OR successful_execution === true
```

### 3. Average Latency

**Source:** `/api-usage-metrics/:workspace_id`

**Response Field:** `averageResponseTime` (already in milliseconds)

**Alternative Calculation from Logs:**
```typescript
// Aggregate from logs where latency field exists
const avgLatency = logs.reduce((sum, log) => sum + (log.latency || 0), 0) / logs.length;
```

### 4. Error Rate

**Source:** `/error/rate/:workspace_id`

**Response Fields:**
```typescript
interface IErrorRateMetrics {
  overallErrorRate: number;
  totalRequests: number;
  totalFailures: number;
  totalSuccesses: number;
  errorRateOverTime: Array<{
    period: string;
    errorRate: number;
    totalRequests: number;
    failures: number;
  }>;
}
```

### 5. Requests by Method (GET/POST/PUT/DELETE)

**Current Gap:** The logs service doesn't currently store HTTP method explicitly.

**Proposed Solution:**
- Option A: Add `method` field to log entries when actions are executed
- Option B: Join with app actions to get method from action definition
- Option C: Derive from action tags/names (less reliable)

**Recommended Implementation:**
```typescript
// Add to log creation in SDK when action runs:
{
  ...logEntry,
  method: action.method, // 'GET', 'POST', etc.
}
```

### 6. Request Activity (Last 7 Days)

**Source:** `/analytics/:workspace_id?component=app&app_id={app_id}&groupBy=day`

**Response Field:** `usageData` with daily breakdown

**Response Structure:**
```typescript
{
  usageData: {
    requests: [
      { date: '2024-01-01', incoming: 1234, outgoing: 567 },
      { date: '2024-01-02', incoming: 2345, outgoing: 678 },
      // ... 7 days
    ]
  }
}
```

### 7. Top Endpoints (Actions)

**Source:** `/analytics/:workspace_id?component=app&app_id={app_id}&type=action`

**Aggregation Needed:**
```typescript
// Group logs by child_tag (action tag) and aggregate:
{
  $group: {
    _id: '$child_tag',
    calls: { $sum: 1 },
    avgLatency: { $avg: '$latency' },
    successCount: {
      $sum: { $cond: [{ $eq: ['$status', 'success'] }, 1, 0] }
    }
  }
}
```

### 8. Webhook Events

**Source:** Logs with `type: 'webhook'` or from webhook-specific logging

**Query:**
```typescript
{
  component: 'app',
  app_id: appId,
  type: 'webhook',
  // or filter by parent_tag matching webhook tags
}
```

---

## Implementation Plan

### Phase 1: Create Logs Service API Client

**File:** `workbench/src/services/logsServices.ts`

```typescript
import axios from 'axios';
import { getApiUrl } from '@/lib/utils';

export interface AppAnalyticsParams {
  workspace_id: string;
  app_id: string;
  version?: string;
  app_env?: string;
  groupBy?: 'hour' | 'day' | 'week' | 'month';
  start_date?: string;
  end_date?: string;
}

export interface AppAnalyticsResponse {
  metrics: {
    totalActions: number;
    totalEnvironments: number;
    totalAuthorizations: number;
  };
  usageData: {
    requests: Array<{
      date: string;
      incoming: number;
      outgoing: number;
      success: number;
      failures: number;
    }>;
    success: Array<{ date: string; count: number }>;
    failures: Array<{ date: string; count: number }>;
  };
  weeklyMetrics: {
    successRate: number;
    errorRate: number;
    totalRequests: number;
  };
  logs: Array<any>;
}

class LogsServices {
  private baseUrl = getApiUrl('logs');

  async fetchAppAnalytics(params: AppAnalyticsParams): Promise<AppAnalyticsResponse> {
    const { workspace_id, ...queryParams } = params;
    const query = new URLSearchParams({
      component: 'app',
      ...queryParams
    }).toString();

    const response = await axios.get(
      `${this.baseUrl}/analytics/${workspace_id}?${query}`,
      { withCredentials: true }
    );
    return response.data.data;
  }

  async fetchAPIUsageMetrics(workspace_id: string, params: object) {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    const response = await axios.get(
      `${this.baseUrl}/api-usage-metrics/${workspace_id}?${query}`,
      { withCredentials: true }
    );
    return response.data.data;
  }

  async fetchErrorRateMetrics(workspace_id: string, params: object) {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    const response = await axios.get(
      `${this.baseUrl}/error/rate/${workspace_id}?${query}`,
      { withCredentials: true }
    );
    return response.data.data;
  }
}

export default new LogsServices();
```

### Phase 2: Create React Query Hooks

**File:** `workbench/src/hooks/useAppAnalytics.ts`

```typescript
import { useQuery } from '@tanstack/react-query';
import logsServices, { AppAnalyticsParams } from '@/services/logsServices';

export function useAppAnalytics(params: AppAnalyticsParams, enabled = true) {
  return useQuery({
    queryKey: ['app-analytics', params.app_id, params.version, params.app_env],
    queryFn: () => logsServices.fetchAppAnalytics(params),
    enabled: enabled && !!params.app_id && !!params.workspace_id,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: 1000 * 60, // Refresh every minute
  });
}

export function useAppTopEndpoints(
  workspace_id: string,
  app_id: string,
  limit = 5,
  enabled = true
) {
  return useQuery({
    queryKey: ['app-top-endpoints', app_id, limit],
    queryFn: async () => {
      const response = await logsServices.fetchAppAnalytics({
        workspace_id,
        app_id,
        groupBy: 'week'
      });
      // Process to get top endpoints
      return processTopEndpoints(response.logs, limit);
    },
    enabled: enabled && !!app_id && !!workspace_id,
    staleTime: 1000 * 60 * 5,
  });
}

function processTopEndpoints(logs: any[], limit: number) {
  const endpointMap = new Map<string, {
    calls: number;
    totalLatency: number;
    method?: string
  }>();

  logs.forEach(log => {
    const tag = log.child_tag || log.action;
    if (!tag) return;

    const existing = endpointMap.get(tag) || { calls: 0, totalLatency: 0 };
    endpointMap.set(tag, {
      calls: existing.calls + 1,
      totalLatency: existing.totalLatency + (log.latency || 0),
      method: log.method
    });
  });

  return Array.from(endpointMap.entries())
    .map(([name, data]) => ({
      name,
      method: data.method || 'GET',
      calls: data.calls,
      avgLatency: `${Math.round(data.totalLatency / data.calls)}ms`
    }))
    .sort((a, b) => b.calls - a.calls)
    .slice(0, limit);
}
```

### Phase 3: Update AppTabContent.tsx

**Key Changes:**

```typescript
// 1. Import hooks
import { useAppAnalytics, useAppTopEndpoints } from '@/hooks/useAppAnalytics';

// 2. Add queries inside component
const { data: analyticsData, isLoading: analyticsLoading } = useAppAnalytics({
  workspace_id: currentWorkspaceId || '',
  app_id: currentApp?._id || '',
  version: selectedVersionTag,
  app_env: selectedVersion?.envs?.find(e => e.active)?.slug,
  groupBy: 'day'
}, !!currentApp?._id && !!currentWorkspaceId);

const { data: topEndpoints } = useAppTopEndpoints(
  currentWorkspaceId || '',
  currentApp?._id || '',
  5,
  !!currentApp?._id
);

// 3. Replace dummy data with real data
const apiAnalytics = {
  totalRequests: {
    current: analyticsData?.weeklyMetrics?.totalRequests || 0,
    previous: 0, // Would need historical comparison
    change: 0
  },
  successRate: {
    current: analyticsData?.weeklyMetrics?.successRate || 0,
    previous: 0,
    change: 0
  },
  avgLatency: {
    current: `${analyticsData?.averageLatency || 0}ms`,
    previous: '0ms',
    change: 0
  },
  errorRate: {
    current: analyticsData?.weeklyMetrics?.errorRate || 0,
    previous: 0,
    change: 0
  },
  activeEndpoints: {
    current: actionsCount,
    previous: actionsCount,
    change: 0
  },
  webhookEvents: {
    current: analyticsData?.webhookEvents || 0,
    previous: 0,
    change: 0
  }
};

// 4. Replace recentActivity with real data
const recentActivity = (analyticsData?.usageData?.requests || [])
  .slice(-7)
  .map(day => ({
    date: new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }),
    requests: day.incoming + day.outgoing
  }));
```

---

## Backend Enhancements Needed

### 1. Add HTTP Method to Logs

**File:** `sdk/ts/src/logs/logs.types.ts`

```typescript
export interface ILogData {
  // ... existing fields
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
}
```

**File:** `backend/logs/src/model/log.model.ts`

```typescript
const schema = new mongoose.Schema<Logging>({
  // ... existing fields
  method: { type: String, enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'] },
});
```

### 2. Add App-Specific Analytics Endpoint

**File:** `backend/logs/src/config/log.routes.ts`

```typescript
// New endpoint for app-specific dashboard metrics
router.get(
  '/app-dashboard/:workspace_id/:app_id',
  validateUserAccess,
  validateWorkspaceAccess,
  async (req: Request, res: Response) => {
    try {
      const { workspace_id, app_id } = req.params;
      const { version, app_env, start_date, end_date, groupBy } = req.query;

      const metrics = await loggingService.getAppDashboardMetrics(
        workspace_id,
        app_id,
        {
          version: version as string,
          app_env: app_env as string,
          start_date: start_date as string,
          end_date: end_date as string,
          groupBy: (groupBy as string) || 'day'
        }
      );

      return res.status(200).json(SUCCESS(metrics));
    } catch (e) {
      const error = extractError(e as unknown as genericErrors);
      return res.status(500).json(ERROR(error));
    }
  }
);
```

### 3. Add Dashboard Metrics Service Method

**File:** `backend/logs/src/service/logging.service.ts`

```typescript
async getAppDashboardMetrics(
  workspace_id: string,
  app_id: string,
  options: {
    version?: string;
    app_env?: string;
    start_date?: string;
    end_date?: string;
    groupBy?: string;
  }
): Promise<IAppDashboardMetrics> {
  const { version, app_env, start_date, end_date, groupBy = 'day' } = options;
  const workspaceObjectId = new mongoose.Types.ObjectId(workspace_id);
  const appObjectId = new mongoose.Types.ObjectId(app_id);

  const dateRange = this.getDateRange(start_date, end_date, 7); // Default 7 days

  // Aggregation pipeline
  const pipeline = [
    {
      $match: {
        workspace_id: workspaceObjectId,
        app_id: appObjectId,
        timestamp: { $gte: dateRange.start, $lte: dateRange.end },
        ...(version && { 'versions.tag': version }),
        ...(app_env && { app_env }),
      }
    },
    {
      $facet: {
        // Total counts
        totals: [
          {
            $group: {
              _id: null,
              totalRequests: { $sum: 1 },
              successCount: {
                $sum: { $cond: [{ $eq: ['$status', 'success'] }, 1, 0] }
              },
              failureCount: {
                $sum: { $cond: [{ $eq: ['$status', 'fail'] }, 1, 0] }
              },
              avgLatency: { $avg: '$latency' }
            }
          }
        ],
        // By method
        byMethod: [
          {
            $group: {
              _id: '$method',
              count: { $sum: 1 }
            }
          }
        ],
        // Daily breakdown
        daily: [
          {
            $group: {
              _id: {
                $dateToString: { format: '%Y-%m-%d', date: '$timestamp' }
              },
              requests: { $sum: 1 },
              success: {
                $sum: { $cond: [{ $eq: ['$status', 'success'] }, 1, 0] }
              },
              failures: {
                $sum: { $cond: [{ $eq: ['$status', 'fail'] }, 1, 0] }
              }
            }
          },
          { $sort: { _id: 1 } }
        ],
        // Top endpoints
        topEndpoints: [
          {
            $group: {
              _id: { action: '$child_tag', method: '$method' },
              calls: { $sum: 1 },
              avgLatency: { $avg: '$latency' }
            }
          },
          { $sort: { calls: -1 } },
          { $limit: 10 }
        ]
      }
    }
  ];

  const [result] = await this.logRepo.findMany(pipeline);
  const totals = result.totals[0] || {};

  return {
    totalRequests: totals.totalRequests || 0,
    successRate: totals.totalRequests
      ? ((totals.successCount / totals.totalRequests) * 100).toFixed(1)
      : 0,
    errorRate: totals.totalRequests
      ? ((totals.failureCount / totals.totalRequests) * 100).toFixed(1)
      : 0,
    avgLatency: Math.round(totals.avgLatency || 0),
    requestsByMethod: result.byMethod.map(m => ({
      method: m._id || 'UNKNOWN',
      count: m.count,
      percentage: ((m.count / totals.totalRequests) * 100).toFixed(0)
    })),
    dailyActivity: result.daily.map(d => ({
      date: d._id,
      requests: d.requests,
      success: d.success,
      failures: d.failures
    })),
    topEndpoints: result.topEndpoints.map(e => ({
      name: e._id.action,
      method: e._id.method || 'GET',
      calls: e.calls,
      avgLatency: `${Math.round(e.avgLatency)}ms`
    }))
  };
}
```

---

## Response Type Definitions

```typescript
// workbench/src/types/logs.ts

export interface IAppDashboardMetrics {
  // Core metrics
  totalRequests: number;
  successRate: number;
  errorRate: number;
  avgLatency: number;

  // Breakdown by HTTP method
  requestsByMethod: Array<{
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    count: number;
    percentage: number;
  }>;

  // Daily activity for charts
  dailyActivity: Array<{
    date: string;      // ISO date string
    requests: number;
    success: number;
    failures: number;
  }>;

  // Top performing endpoints
  topEndpoints: Array<{
    name: string;
    method: string;
    calls: number;
    avgLatency: string;
  }>;

  // Comparison with previous period
  comparison?: {
    totalRequestsChange: number;      // Percentage change
    successRateChange: number;
    errorRateChange: number;
    avgLatencyChange: number;
  };

  // Webhook metrics
  webhookEvents?: number;
}
```

---

## SDK Proxy Integration (Optional)

If using the SDK Proxy pattern already established:

**File:** `workbench/src/services/sdkProxy.ts`

```typescript
// Add to SDKProxyClient class
logs = {
  fetchAppDashboard: <T = IAppDashboardMetrics>(
    appId: string,
    options: { version?: string; app_env?: string; days?: number }
  ) => this.execute<T>('logs', 'fetchAppDashboard', appId, options),
};
```

**File:** `backend/proxy/src/validators/sdk-proxy.validators.ts`

```typescript
const ALLOWED_METHODS: Record<SDKModule, string[]> = {
  // ... existing
  logs: ['fetch', 'fetchAppDashboard'],
};
```

---

## Testing Strategy

### Unit Tests

1. Test log aggregation pipelines
2. Test date range calculations
3. Test percentage calculations

### Integration Tests

1. Create test logs with known values
2. Query dashboard endpoint
3. Verify metrics match expected values

### E2E Tests

1. Load app overview page
2. Verify metrics cards populate
3. Verify charts render with data
4. Verify top endpoints list

---

## Migration & Rollout

### Phase 1: Backend (Week 1)
- [ ] Add `method` field to log model
- [ ] Update SDK log creation to include method
- [ ] Create `/app-dashboard/:workspace_id/:app_id` endpoint
- [ ] Add aggregation service method

### Phase 2: Frontend (Week 2)
- [ ] Create logsServices.ts
- [ ] Create useAppAnalytics hooks
- [ ] Update AppTabContent to use real data
- [ ] Add loading states for metrics

### Phase 3: Polish (Week 3)
- [ ] Add historical comparison (change percentages)
- [ ] Add caching strategy
- [ ] Add error handling / fallbacks
- [ ] Performance optimization

---

## Fallback Strategy

If real data is unavailable or loading:

```typescript
const defaultMetrics = {
  totalRequests: { current: 0, previous: 0, change: 0 },
  successRate: { current: 100, previous: 100, change: 0 },
  avgLatency: { current: '0ms', previous: '0ms', change: 0 },
  errorRate: { current: 0, previous: 0, change: 0 },
  activeEndpoints: { current: actionsCount, previous: actionsCount, change: 0 },
  webhookEvents: { current: 0, previous: 0, change: 0 }
};

const apiAnalytics = analyticsData || defaultMetrics;
```

---

## Monitoring & Observability

1. **Log query performance** - Track response times for dashboard queries
2. **Cache hit rates** - Monitor React Query cache effectiveness
3. **Error rates** - Track failed dashboard data fetches
4. **User experience** - Track time-to-interactive for dashboard

---

## Summary

| Component | Current State | Target State | Effort |
|-----------|--------------|--------------|--------|
| Total Requests | Hardcoded | From `/app-dashboard` | Medium |
| Success/Error Rate | Hardcoded | Calculated from logs | Medium |
| Avg Latency | Hardcoded | From log `latency` field | Low |
| Method Distribution | Hardcoded | Requires schema update | High |
| Daily Activity | Hardcoded | From daily aggregation | Medium |
| Top Endpoints | Random | From log aggregation | Medium |
| Webhook Events | Hardcoded | From webhook type logs | Low |

**Total Estimated Effort:** 2-3 weeks for full implementation

---

## Appendix: Existing Endpoint Reference

### `/analytics/:workspace_id` Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| component | 'app' \| 'product' | Required - filter component type |
| app_id | string | App ObjectId |
| type | string | Log type filter (action, webhook, etc.) |
| app_env | string | Environment slug |
| version | string | App version tag |
| groupBy | 'hour' \| 'day' \| 'week' \| 'month' | Time grouping |
| start_date | string | ISO date string |
| end_date | string | ISO date string |
| page | number | Pagination page |
| limit | number | Items per page |
| search | string | Search in log messages |
| tag | string | Specific action tag (for type=action) |
| parent_tag | string | Parent tag filter |
| child_tag | string | Child tag filter |
