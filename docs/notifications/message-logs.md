---
sidebar_position: 4
---

# Notification Message Logs

Every notification send is logged server-side so you can query send history and reprocess failed or specific sends. Use `ductape.notifications.getMessages()` to fetch notification message logs with time filters and filters by product, env, status, and type.

## Fetching notification message logs

`getMessages()` is secured with your Ductape user auth and returns only logs for your workspace. All query parameters are optional; use time filters to narrow by date range.

```ts
const { items, total, page, limit, hasMore } = await ductape.notifications.getMessages({
  product_tag: 'my-app',
  env: 'prd',
  start_date: new Date(Date.now() - 7 * 864e5).toISOString(), // last 7 days
  end_date: new Date().toISOString(),
  status: 'failed',
  page: 1,
  limit: 50,
});

items.forEach((log) => {
  console.log(log.notification_tag, log.status, log.type, log.created_at);
  if (log.status === 'failed' && log.error) console.log('Error:', log.error);
});
```

## Query options

| Option | Type | Description |
|--------|------|-------------|
| `product_tag` | string | Filter by product (e.g. `ductape:rematch`) |
| `product_id` | string | Filter by product ID |
| `env` | string | Filter by environment slug (e.g. `prd`) |
| `notification_tag` | string | Filter by event (e.g. `rematch-notifications:order-placed`) |
| `status` | string | `pending` \| `sent` \| `failed` \| `reprocessing` |
| `type` | string | `email` \| `push` \| `sms` \| `callback` \| `notification` |
| `process_id` | string | Filter by process ID from logs |
| `start_date` | string \| Date | Start of time range (ISO string or Date) |
| `end_date` | string \| Date | End of time range (ISO string or Date) |
| `page` | number | Page number (default 1) |
| `limit` | number | Page size (default 20) |

## Response shape

```ts
interface INotificationMessageLogResult {
  items: INotificationMessageLogEntry[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

interface INotificationMessageLogEntry {
  _id?: string;
  workspace_id: string;
  product_id: string;
  product_tag: string;
  env: string;
  notification_tag: string;
  input: Record<string, unknown>;  // full input used for the send (for reprocessing)
  status: 'pending' | 'sent' | 'failed' | 'reprocessing';
  type: 'email' | 'push' | 'sms' | 'callback' | 'notification';
  process_id?: string;
  error?: string;
  retries?: number;
  session?: string;
  cache?: string;
  created_at?: string;
  updated_at?: string;
}
```

## Status and type

- **status**: `pending` (queued), `sent` (delivered), `failed` (delivery failed), `reprocessing` (retry in progress).
- **type**: Channel for the send — `email`, `push`, `sms`, `callback`, or `notification` (multi-channel). Use these to filter by channel or to reprocess by type.

## Time filters

Use `start_date` and `end_date` to restrict results to a window. You can pass ISO strings or `Date` objects; the SDK normalizes them to ISO for the API.

```ts
// Last 24 hours
await ductape.notifications.getMessages({
  start_date: new Date(Date.now() - 864e5).toISOString(),
  end_date: new Date().toISOString(),
});

// Last 7 days (Date objects)
await ductape.notifications.getMessages({
  start_date: new Date(Date.now() - 7 * 864e5),
  end_date: new Date(),
});
```

## Reprocessing

Each log entry stores the full `input` and context (product, env, notification tag, etc.) used for that send. You can use this data to reprocess a notification (e.g. retry a failed send) by calling `notifications.send()` or the appropriate channel `.send()` with the stored `input` and same `product`, `env`, and `notification_tag`. The backend also supports updating log status (e.g. to `reprocessing`) via the integrations API.

## See Also

* [Notifications Overview](./overview)
* [Sending Notifications](./send)
* [Setting Up Notifications](./setup)
