---
sidebar_position: 5
---

# Scheduling Examples

Real-world examples of job scheduling patterns for common use cases.

## Notification & Communication

### Welcome Email Series

Schedule a series of onboarding emails for new users:

```ts
async function scheduleWelcomeEmailSeries(userId: string, email: string) {
  // Email 1: Welcome (immediate)
  await ductape.notifications.dispatch({
    env: 'prd',
    product: 'onboarding',
    notification: 'user-emails',
    event: 'welcome',
    input: {
      email: {
        recipients: [email],
        template: { userId, email }
      }
    },
    retries: 3
  });

  // Email 2: Getting started (24 hours)
  await ductape.notifications.dispatch({
    env: 'prd',
    product: 'onboarding',
    notification: 'user-emails',
    event: 'getting_started',
    input: {
      email: {
        recipients: [email],
        template: { userId }
      }
    },
    retries: 3,
    schedule: {
      start_at: Date.now() + 24 * 60 * 60 * 1000
    }
  });

  // Email 3: Tips & tricks (3 days)
  await ductape.notifications.dispatch({
    env: 'prd',
    product: 'onboarding',
    notification: 'user-emails',
    event: 'tips_and_tricks',
    input: {
      email: {
        recipients: [email],
        template: { userId }
      }
    },
    retries: 3,
    schedule: {
      start_at: Date.now() + 3 * 24 * 60 * 60 * 1000
    }
  });

  // Email 4: Feature highlights (7 days)
  await ductape.notifications.dispatch({
    env: 'prd',
    product: 'onboarding',
    notification: 'user-emails',
    event: 'feature_highlights',
    input: {
      email: {
        recipients: [email],
        template: { userId }
      }
    },
    retries: 3,
    schedule: {
      start_at: Date.now() + 7 * 24 * 60 * 60 * 1000
    }
  });
}
```

### Daily Digest Emails

Send daily digest at user's preferred time:

```ts
async function scheduleDailyDigest(userId: string, email: string, preferredHour: number, timezone: string) {
  await ductape.notifications.dispatch({
    env: 'prd',
    product: 'notifications',
    notification: 'digest-emails',
    event: 'daily_digest',
    input: {
      email: {
        recipients: [email],
        template: { userId, date: '$Format($Now(), "MMMM D, YYYY")' }
      }
    },
    retries: 2,
    schedule: {
      cron: `0 ${preferredHour} * * *`,
      tz: timezone
    }
  });
}

// Schedule for user at 8 AM in their timezone
await scheduleDailyDigest('user_123', 'user@example.com', 8, 'America/New_York');
```

### Reminder Notifications

Send reminders before an event:

```ts
async function scheduleEventReminders(eventId: string, eventTime: number, userId: string, deviceToken: string) {
  // 24 hour reminder
  await ductape.notifications.dispatch({
    env: 'prd',
    product: 'events',
    notification: 'push-notifications',
    event: 'event_reminder',
    input: {
      push_notification: {
        device_tokens: [deviceToken],
        title: { text: 'Event Tomorrow!' },
        body: { text: 'Your event starts in 24 hours' },
        data: { eventId }
      }
    },
    retries: 2,
    schedule: {
      start_at: eventTime - 24 * 60 * 60 * 1000
    }
  });

  // 1 hour reminder
  await ductape.notifications.dispatch({
    env: 'prd',
    product: 'events',
    notification: 'push-notifications',
    event: 'event_reminder',
    input: {
      push_notification: {
        device_tokens: [deviceToken],
        title: { text: 'Event Starting Soon!' },
        body: { text: 'Your event starts in 1 hour' },
        data: { eventId }
      }
    },
    retries: 2,
    schedule: {
      start_at: eventTime - 60 * 60 * 1000
    }
  });
}
```

## Data Processing

### Daily Report Generation

Generate reports every business day:

```ts
// Generate sales report at 6 AM on weekdays
const salesReport = await ductape.workflows.dispatch({
  env: 'prd',
  product: 'analytics',
  workflow: 'generate_sales_report',
  input: {
    reportType: 'daily',
    format: 'pdf',
    recipients: ['sales@company.com', 'management@company.com']
  },
  retries: 3,
  schedule: {
    cron: '0 6 * * 1-5',  // 6 AM, Mon-Fri
    tz: 'America/New_York'
  }
});
```

### Weekly Analytics

Generate weekly summary every Monday:

```ts
const weeklyAnalytics = await ductape.workflows.dispatch({
  env: 'prd',
  product: 'analytics',
  workflow: 'generate_weekly_summary',
  input: {
    reportType: 'weekly',
    includeCharts: true,
    compareLastWeek: true
  },
  retries: 3,
  schedule: {
    cron: '0 9 * * 1',  // 9 AM every Monday
    tz: 'America/New_York'
  }
});
```

### Data Export

Schedule nightly data export:

```ts
const dataExport = await ductape.database.dispatch({
  env: 'prd',
  product: 'data-platform',
  database: 'analytics-db',
  operation: 'insert',
  input: {
    table: 'export_jobs',
    data: {
      export_date: '$Format($DateAdd($Now(), -1, "days"), "YYYY-MM-DD")',
      destination: 's3://data-warehouse/daily-exports/',
      status: 'pending'
    }
  },
  retries: 5,
  schedule: {
    cron: '0 2 * * *',  // 2 AM daily
    tz: 'UTC'
  }
});
```

## Maintenance & Cleanup

### Session Cleanup

Clean up expired sessions hourly:

```ts
const sessionCleanup = await ductape.database.dispatch({
  env: 'prd',
  product: 'auth',
  database: 'sessions-db',
  operation: 'delete',
  input: {
    table: 'sessions',
    where: {
      expires_at: { $LT: '$Now()' }
    }
  },
  retries: 2,
  schedule: {
    cron: '0 * * * *'  // Every hour
  }
});
```

### Log Rotation

Archive old logs monthly:

```ts
const logRotation = await ductape.workflows.dispatch({
  env: 'prd',
  product: 'infrastructure',
  workflow: 'rotate_logs',
  input: {
    olderThanDays: 30,
    archiveLocation: 's3://logs-archive/',
    compress: true
  },
  retries: 3,
  schedule: {
    cron: '0 3 1 * *',  // 3 AM on the 1st of each month
    tz: 'UTC'
  }
});
```

### Temporary Files Cleanup

Clean temporary files daily:

```ts
const tempCleanup = await ductape.storage.dispatch({
  env: 'prd',
  product: 'my-app',
  storage: 'temp-storage',
  event: 'cleanup_temp',
  input: {
    olderThanHours: 24,
    patterns: ['*.tmp', '*.temp', 'upload_*']
  },
  retries: 2,
  schedule: {
    cron: '30 4 * * *',  // 4:30 AM daily
    tz: 'UTC'
  }
});
```

### Database Optimization

Run database optimization weekly:

```ts
const dbOptimization = await ductape.database.dispatch({
  env: 'prd',
  product: 'my-app',
  database: 'main-db',
  operation: 'insert',
  input: {
    table: 'maintenance_logs',
    data: {
      task: 'optimize_tables',
      operations: ['VACUUM', 'ANALYZE', 'REINDEX'],
      started_at: '$Now()'
    }
  },
  retries: 2,
  schedule: {
    cron: '0 3 * * 0',  // 3 AM every Sunday
    tz: 'UTC'
  }
});
```

## Integrations & Sync

### Inventory Sync

Sync inventory from suppliers every 6 hours:

```ts
const inventorySync = await ductape.actions.dispatch({
  env: 'prd',
  product: 'inventory',
  app: 'supplier-sync',
  event: 'sync_all_suppliers',
  input: {
    suppliers: ['supplier_1', 'supplier_2', 'supplier_3'],
    fullSync: false
  },
  retries: 3,
  retryConfig: {
    initialDelay: 5000,
    maxDelay: 300000,
    retryableErrors: ['TIMEOUT', 'RATE_LIMITED']
  },
  schedule: {
    cron: '0 */6 * * *'  // Every 6 hours
  }
});
```

### CRM Sync

Sync contacts with CRM nightly:

```ts
const crmSync = await ductape.actions.dispatch({
  env: 'prd',
  product: 'integrations',
  app: 'salesforce-connector',
  event: 'sync_contacts',
  input: {
    direction: 'bidirectional',
    lastSyncTime: '$DateAdd($Now(), -24, "hours")'
  },
  retries: 3,
  schedule: {
    cron: '0 1 * * *',  // 1 AM daily
    tz: 'America/Los_Angeles'
  }
});
```

### Price Update from Feed

Update product prices from feed every hour:

```ts
const priceUpdate = await ductape.actions.dispatch({
  env: 'prd',
  product: 'catalog',
  app: 'price-service',
  event: 'update_prices_from_feed',
  input: {
    feedUrl: 'https://api.supplier.com/prices',
    applyImmediately: true
  },
  retries: 3,
  schedule: {
    cron: '0 * * * *'  // Every hour
  }
});
```

## Billing & Subscriptions

### Monthly Billing

Process monthly subscriptions on the 1st:

```ts
const monthlyBilling = await ductape.actions.dispatch({
  env: 'prd',
  product: 'billing',
  app: 'subscription-service',
  event: 'process_monthly_renewals',
  input: {
    billingCycle: 'monthly',
    date: '$Format($Now(), "YYYY-MM-DD")'
  },
  retries: 5,
  retryConfig: {
    nonRetryableErrors: ['CARD_DECLINED', 'SUBSCRIPTION_CANCELLED']
  },
  schedule: {
    cron: '0 6 1 * *',  // 6 AM on the 1st of each month
    tz: 'UTC'
  }
});
```

### Usage Metering

Calculate usage metrics hourly:

```ts
const usageMetering = await ductape.workflows.dispatch({
  env: 'prd',
  product: 'billing',
  workflow: 'calculate_usage_metrics',
  input: {
    hourStart: '$DateAdd($Now(), -1, "hours")',
    hourEnd: '$Now()'
  },
  retries: 2,
  schedule: {
    cron: '5 * * * *'  // 5 minutes past every hour
  }
});
```

### Trial Expiration Check

Check for expiring trials daily:

```ts
const trialCheck = await ductape.database.dispatch({
  env: 'prd',
  product: 'billing',
  database: 'subscriptions-db',
  operation: 'query',
  input: {
    table: 'subscriptions',
    where: {
      status: 'trial',
      trial_ends_at: {
        $BETWEEN: ['$Now()', '$DateAdd($Now(), 3, "days")']
      }
    }
  },
  schedule: {
    cron: '0 10 * * *',  // 10 AM daily
    tz: 'America/New_York'
  }
});
```

## Monitoring & Health

### Health Checks

Run health checks every 5 minutes:

```ts
const healthCheck = await ductape.actions.dispatch({
  env: 'prd',
  product: 'monitoring',
  app: 'health-service',
  event: 'check_all_services',
  input: {
    services: ['api', 'database', 'cache', 'queue'],
    alertOnFailure: true
  },
  retries: 1,
  schedule: {
    cron: '*/5 * * * *'  // Every 5 minutes
  }
});
```

### Performance Metrics

Collect performance metrics every minute:

```ts
const perfMetrics = await ductape.actions.dispatch({
  env: 'prd',
  product: 'monitoring',
  app: 'metrics-collector',
  event: 'collect_metrics',
  input: {
    metrics: ['cpu', 'memory', 'disk', 'network', 'latency'],
    aggregation: '1m'
  },
  retries: 0,  // Don't retry - next collection will happen soon
  schedule: {
    cron: '* * * * *'  // Every minute
  }
});
```

### Daily Summary Report

Generate operational summary daily:

```ts
const opsSummary = await ductape.workflows.dispatch({
  env: 'prd',
  product: 'monitoring',
  workflow: 'generate_ops_summary',
  input: {
    period: 'daily',
    includeAlerts: true,
    includeMetrics: true,
    recipients: ['ops-team@company.com']
  },
  retries: 2,
  schedule: {
    cron: '0 8 * * *',  // 8 AM daily
    tz: 'America/New_York'
  }
});
```

## E-commerce

### Abandoned Cart Reminders

Send reminders for abandoned carts:

```ts
// Run every hour, find carts abandoned 1-24 hours ago
const abandonedCartReminder = await ductape.workflows.dispatch({
  env: 'prd',
  product: 'ecommerce',
  workflow: 'send_abandoned_cart_reminders',
  input: {
    abandonedAfterHours: 1,
    abandonedBeforeHours: 24,
    maxReminders: 2
  },
  retries: 2,
  schedule: {
    cron: '0 * * * *'  // Every hour
  }
});
```

### Flash Sale Management

Schedule flash sale start and end:

```ts
async function scheduleFlashSale(saleId: string, startTime: number, endTime: number) {
  // Start the sale
  await ductape.actions.dispatch({
    env: 'prd',
    product: 'ecommerce',
    app: 'promotions-service',
    event: 'activate_sale',
    input: {
      saleId,
      action: 'start'
    },
    retries: 3,
    schedule: {
      start_at: startTime
    }
  });

  // End the sale
  await ductape.actions.dispatch({
    env: 'prd',
    product: 'ecommerce',
    app: 'promotions-service',
    event: 'deactivate_sale',
    input: {
      saleId,
      action: 'end'
    },
    retries: 3,
    schedule: {
      start_at: endTime
    }
  });
}
```

### Inventory Low Stock Alerts

Check inventory levels twice daily:

```ts
const lowStockAlert = await ductape.workflows.dispatch({
  env: 'prd',
  product: 'inventory',
  workflow: 'check_low_stock',
  input: {
    thresholds: {
      warning: 50,
      critical: 10
    },
    notifyChannels: ['email', 'slack']
  },
  retries: 2,
  schedule: {
    cron: '0 9,17 * * *',  // 9 AM and 5 PM
    tz: 'America/New_York'
  }
});
```

## Message Processing

### Queue Processing

Process message queue continuously:

```ts
const queueProcessor = await ductape.events.dispatch({
  env: 'prd',
  product: 'messaging',
  broker: 'sqs-main',
  event: 'process_queue',
  input: {
    message: {
      queue: 'order-processing',
      maxMessages: 100,
      visibilityTimeout: 30
    }
  },
  retries: 2,
  schedule: {
    every: 30000  // Every 30 seconds
  }
});
```

### Event Replay

Replay failed events daily:

```ts
const eventReplay = await ductape.events.dispatch({
  env: 'prd',
  product: 'messaging',
  broker: 'kafka-main',
  event: 'replay_failed_events',
  input: {
    message: {
      fromTopic: 'failed-events',
      toTopic: 'events',
      olderThanHours: 1
    }
  },
  retries: 2,
  schedule: {
    cron: '0 4 * * *',  // 4 AM daily
    tz: 'UTC'
  }
});
```

## Limited Duration Jobs

### Campaign with End Date

Run promotion check until campaign ends:

```ts
const campaignCheck = await ductape.workflows.dispatch({
  env: 'prd',
  product: 'marketing',
  workflow: 'check_campaign_performance',
  input: {
    campaignId: 'summer_sale_2025'
  },
  retries: 2,
  schedule: {
    every: 3600000,  // Every hour
    endDate: '2025-08-31T23:59:59Z'  // Campaign ends Aug 31
  }
});
```

### Limited Retry Job

Send max 4 weekly reminders:

```ts
const weeklyReminder = await ductape.notifications.dispatch({
  env: 'prd',
  product: 'engagement',
  notification: 'user-emails',
  event: 'weekly_inactive_reminder',
  input: {
    email: {
      recipients: ['inactive@example.com'],
      template: { weekNumber: '$Var(execution_count)' }
    }
  },
  retries: 2,
  schedule: {
    every: 604800000,  // Weekly
    limit: 4  // Max 4 reminders
  }
});
```

## See Also

* [Scheduling Jobs](./scheduling-jobs) - Overview of job scheduling
* [Cron Expressions](./cron-expressions) - Master cron syntax
* [Job Management](./job-management) - Monitor and control jobs
* [Retry Strategies](./retry-strategies) - Handle failures
