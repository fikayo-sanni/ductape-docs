import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    'intro',
    'getting-started/quickstart',
    'import',

    // Products - Core Backend Systems
    {
      type: 'category',
      label: 'Products',
      collapsed: true,
      items: [
        'products/overview',
        'products/creating-products',
        'products/environments',
        'products/connecting-apps',
        'products/webhooks',
      ],
    },

    // Apps - External Integrations
    {
      type: 'category',
      label: 'Apps',
      collapsed: true,
      items: [
        'apps/getting-started',
        'apps/create-app',
        'apps/import-actions',
        'apps/authentication',
        'apps/environments',
        'apps/constants-variables',
        'apps/app-instance',
        'apps/product-environments',
      ],
    },

    // Operators
    {
      type: 'category',
      label: 'Operators',
      collapsed: true,
      items: [
        'operators/operators',
        'operators/nesting',
      ],
    },

    // Actions - Working with Actions
    {
      type: 'category',
      label: 'Actions',
      collapsed: true,
      items: [
        'actions/overview',
        'actions/run-actions',
        'actions/managing-actions',
        'actions/validation',
      ],
    },

    // Features - Workflow Engine
    {
      type: 'category',
      label: 'Features',
      collapsed: true,
      items: [
        'features/overview',
        'features/inputs',
        'features/output',
        'features/run',
      ],
    },

    // Databases
    {
      type: 'category',
      label: 'Databases',
      collapsed: true,
      items: [
        'databases/getting-started',
        'databases/querying',
        'databases/writing-data',
        'databases/aggregations',
        'databases/transactions',
        'databases/migrations',
        'databases/indexing',
        'databases/actions',
        'databases/direct-queries',
        'databases/best-practices',
      ],
    },

    // Graph Databases
    {
      type: 'category',
      label: 'Graph Databases',
      collapsed: true,
      items: [
        'graphs/getting-started',
        'graphs/nodes',
        'graphs/relationships',
        'graphs/traversals',
        'graphs/indexing',
        'graphs/transactions',
        'graphs/actions',
        'graphs/best-practices',
        'graphs/overview',
      ],
    },

    // Notifications
    {
      type: 'category',
      label: 'Notifications',
      collapsed: true,
      items: [
        'notifications/overview',
        'notifications/setup',
        'notifications/send',
        {
          type: 'category',
          label: 'Templates',
          items: [
            'notifications/templates/manage-messages',
            'notifications/templates/emails',
            'notifications/templates/sms',
            'notifications/templates/push-notifications',
            'notifications/templates/callbacks',
          ],
        },
      ],
    },

    // Webhooks
    {
      type: 'category',
      label: 'Webhooks',
      collapsed: true,
      items: [
        'apps/webhooks/webhooks',
        'apps/webhooks/webhook-events',
        'apps/webhooks/setup',
      ],
    },

    // Storage
    {
      type: 'category',
      label: 'Storage',
      collapsed: true,
      items: [
        'storage/overview',
        'storage/files',
        'storage/use',
        'storage/read-files',
        {
          type: 'category',
          label: 'Providers',
          items: [
            'storage/providers/aws',
            'storage/providers/gcp',
            'storage/providers/azure',
          ],
        },
      ],
    },

    // Message Brokers
    {
      type: 'category',
      label: 'Message Brokers',
      collapsed: true,
      items: [
        'message-brokers/overview',
      ],
    },

    // Jobs
    {
      type: 'category',
      label: 'Jobs',
      collapsed: true,
      items: [
        'jobs/overview',
        'jobs/use',
      ],
    },

    // Healthchecks
    {
      type: 'category',
      label: 'Healthchecks',
      collapsed: true,
      items: [
        'apps/healthchecks',
      ],
    },

    // Resilience - Quotas & Fallbacks
    {
      type: 'category',
      label: 'Resilience',
      collapsed: true,
      items: [
        {
          type: 'category',
          label: 'Quotas',
          items: [
            'quotas/overview',
            'quotas/input',
            'quotas/output',
            'quotas/use',
          ],
        },
        {
          type: 'category',
          label: 'Fallbacks',
          items: [
            'fallbacks/overview',
            'fallbacks/input',
            'fallbacks/output',
            'fallbacks/use',
          ],
        },
      ],
    },

    // Sessions
    {
      type: 'category',
      label: 'Sessions',
      collapsed: true,
      items: [
        'sessions/overview',
        'sessions/use',
        'sessions/fetching-users',
        'sessions/decrypting',
        'sessions/refreshing',
      ],
    },

    // Caching
    {
      type: 'category',
      label: 'Caching',
      collapsed: true,
      items: [
        'caching/overview',
        'caching/setup',
        'caching/values',
      ],
    },

    // Secrets
    {
      type: 'category',
      label: 'Secrets',
      collapsed: true,
      items: [
        'secrets/overview',
        'secrets/managing-secrets',
        'secrets/using-secrets',
      ],
    },

    // Logs
    {
      type: 'category',
      label: 'Logs',
      collapsed: true,
      items: [
        'logs/manage-logs',
      ],
    },

    // Reference
    {
      type: 'category',
      label: 'Reference',
      collapsed: true,
      items: [
        'processing-overview',
        'pricing',
        'paystack',
      ],
    },
  ],
};

export default sidebars;
