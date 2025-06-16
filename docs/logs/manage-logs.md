---
sidebar_position: 1
---
# Managing Logs

The Logs module provides functionality to fetch and analyze logs for both apps and products within the Ductape platform.

## Initialization

Before fetching logs, initialize the Logs service with either an AppTag, ProductTag, or both:

```javascript
// Initialize with a product tag
await ductape.logs.init("ductape_demo_tapes:test_product");
````

## Fetching Logs

The `fetch` method retrieves logs based on the provided query parameters.

### Parameters

| Parameter   | Required | Type                   | Description                                                                    |
| ----------- | -------- | ---------------------- | ------------------------------------------------------------------------------ |
| `component` | Yes      | `'app'` or `'product'` | Specifies the component type.                                                  |
| `type`      | No       | `string`               | Type of analysis (e.g., `'apps'`, `'process'`, `'feature'`, `'integrations'`). |
| `groupBy`   | No       | `string`               | Time period for grouping (e.g., `'day'`, `'week'`, `'month'`, `'year'`).       |
| `search`    | No       | `string`               | Search term for filtering logs.                                                |
| `page`      | No       | `number`               | Page number for pagination (≥ 1).                                              |
| `limit`     | No       | `number`               | Number of items per page (≥ 1).                                                |
| `status`    | No       | `string`               | Filter by status (`'success'`, `'processing'`, `'fail'`).                      |

#### Additional fields for `component='app'`

| Parameter | Required | Type     | Description                                        |
| --------- | -------- | -------- | -------------------------------------------------- |
| `tag`     | No       | `string` | Tag identifier (only valid when `type='actions'`). |
| `env`     | No       | `string` | Environment filter.                                |
| `name`    | No       | `string` | Name filter.                                       |
| `action`  | No       | `string` | Specific action filter.                            |

#### Additional fields for `component='product'`

| Parameter | Required | Type     | Description             |
| --------- | -------- | -------- | ----------------------- |
| `env`     | No       | `string` | Environment filter.     |
| `name`    | No       | `string` | Name filter.            |
| `action`  | No       | `string` | Specific action filter. |

## Examples

### Fetch App Logs

```javascript
const appLogs = await logs.fetch({
  component: 'app',
  type: 'actions',
  groupBy: 'day',
  limit: 20
});
```

### Fetch Product Logs

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

The `fetch` method may throw errors in the following cases:

* If the Logs service is not initialized.
* If required parameters are missing or invalid.
* If the API request fails.