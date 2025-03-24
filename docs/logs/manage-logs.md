# Logs

The Logs module provides functionality to fetch and analyze logs for both apps and products within the Ductape platform.

## Initialization

Before fetching logs, you need to initialize the Logs service with either an AppTag, ProductTag, or both:

```javascript
// Initialize with a product tag
await ductape.logs.init("ductape_demo_tapes:test_product");
```

## Fetching Logs

The `fetch` method retrieves logs based on the provided query parameters.

### Parameters

- **params.component** - *Required*. Specifies the component type ('app' or 'product')
- **params.type** - *Optional*. Type of analysis ('apps', 'process', 'feature', 'integrations', etc.)
- **params.groupBy** - *Optional*. Time period for grouping ('day', 'week', 'month', 'year')
- **params.search** - *Optional*. Search term for filtering logs
- **params.page** - *Optional*. Page number for pagination (≥ 1)
- **params.limit** - *Optional*. Number of items per page (≥ 1)
- **params.status** - *Optional*. Filter by status ('success', 'processing', 'fail')

#### For component='app':
- **params.tag** - *Optional*. Tag identifier (only valid when type='actions')
- **params.env** - *Optional*. Environment filter
- **params.name** - *Optional*. Name filter
- **params.action** - *Optional*. Specific action filter

#### For component='product':
- **params.env** - *Optional*. Environment filter
- **params.name** - *Optional*. Name filter
- **params.action** - *Optional*. Specific action filter

### Examples

#### Fetch App Logs
```javascript
const appLogs = await logs.fetch({
  component: 'app',
  type: 'actions',
  groupBy: 'day',
  limit: 20
});
```

#### Fetch Product Logs
```javascript
const productLogs = await logs.fetch({
  component: 'product',
  type: 'database',
  status: 'success'
});
```

## Response Structures

### App Response Structure

```javascript
{
  metrics: {
    totalActions: number,
    totalEnvironments: number,
    totalAuthorizations: number
  },
  weeklyMetrics: {
    totalProductsConnected: {
      current: number,
      previous: number,
      difference: number,
      trend: '>' | '<' | '='
    },
    totalFeaturesUsingAction: {
      current: number,
      previous: number,
      difference: number,
      trend: string
    },
    errors: {
      current: number,
      previous: number,
      difference: number,
      trend: '>' | '<' | '=',
      percentageChange: string
    }
  },
  usageData: {
    requestsOverTime: Array<...>,
    successOverTime: Array<...>,
    failuresOverTime: Array<...>
  },
  logs: {
    metadata: {
      total: number,
      page: number,
      limit: number,
      totalPages: number
    },
    data: Array<LogEntry>
  }
}
```

### Product Response Structure

```javascript
{
  metrics: {
    totalApps: number,
    totalDatabases: number,
    totalFeatures: number
  },
  weeklyMetrics: {
    totalActionsCalled: {
      current: number,
      previous: number,
      difference: number,
      trend: '>' | '<' | '='
    },
    totalActiveIssues: {
      current: number,
      previous: number,
      difference: number,
      trend: string
    },
    errors: {
      current: number,
      previous: number,
      difference: number,
      trend: '>' | '<' | '=',
      percentageChange: string
    }
  },
  usageData: {
    requestsOverTime: Array<...>,
    successOverTime: Array<...>,
    failuresOverTime: Array<...>
  },
  logs: {
    metadata: {
      total: number,
      page: number,
      limit: number,
      totalPages: number
    },
    data: Array<LogEntry>
  }
}
```

## Error Handling

The fetch method may throw the following errors:
- If the logger service is not initialized
- If required parameters are missing or invalid
- If the API request fails