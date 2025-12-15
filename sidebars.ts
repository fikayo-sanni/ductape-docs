import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// Preview features that need the PreviewBanner component
// Add this to the overview doc of each preview category:
// import PreviewBanner from '@site/src/components/PreviewBanner';
// Then add <PreviewBanner /> at the top of the content

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    {
      type: 'doc',
      id: 'intro',
      label: 'Why Ductape',
    },
    {
      type: 'doc',
      id: 'getting-started',
      label: 'Getting Started',
    },
    {
      type: 'doc',
      id: 'import',
      label: 'Adding an App',
    },

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
        'apps/create-app',
        'apps/import-actions',
        'apps/authentication',
        'apps/environments',
        'apps/constants-variables',
        'apps/app-instance',
        'apps/product-environments',
      ],
    },

    // Actions - Working with Actions
    {
      type: 'category',
      label: 'Actions',
      collapsed: true,
      items: [
        'actions/overview',
        'actions/auth-configuration',
        'actions/run-actions',
        'actions/managing-actions',
        'actions/validation',
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

    // Databases
    {
      type: 'category',
      label: 'Databases',
      collapsed: true,
      items: [
        'databases/getting-started',
        'databases/querying',
        'databases/writing-data',
        'databases/pre-save-operations',
        'databases/triggers',
        'databases/aggregations',
        'databases/transactions',
        'databases/migrations',
        'databases/table-management',
        'databases/indexing',
        'databases/actions',
        'databases/direct-queries',
        'databases/best-practices',
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
        'sessions/activity-dashboard',
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
        'caching/managing-values',
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

    // --- Preview Features Below ---

    // Vectors (Preview)
    {
      type: 'category',
      label: 'Vectors (Preview)',
      collapsed: true,
      items: [
        'vectors/overview',
        'vectors/getting-started',
        'vectors/querying',
        'vectors/agent-integration',
        'vectors/best-practices',
      ],
    },

    // Agents (Preview)
    {
      type: 'category',
      label: 'Agents (Preview)',
      collapsed: true,
      items: [
        'agents/overview',
        'agents/getting-started',
        'agents/models',
        'agents/tools',
        'agents/memory',
        'agents/human-in-loop',
        'agents/resilience',
        'agents/multi-agent',
        'agents/examples',
      ],
    },

    // Webhooks (Preview)
    {
      type: 'category',
      label: 'Webhooks (Preview)',
      collapsed: true,
      items: [
        'apps/webhooks/webhooks',
        'apps/webhooks/webhook-events',
        'apps/webhooks/setup',
      ],
    },

    // Workflows (Preview)
    {
      type: 'category',
      label: 'Workflows (Preview)',
      collapsed: true,
      items: [
        'workflows/overview',
        'workflows/getting-started',
        'workflows/building-workflows',
        'workflows/step-types',
        'workflows/execution',
        'workflows/examples',
      ],
    },

    // Graphs (Preview)
    {
      type: 'category',
      label: 'Graphs (Preview)',
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

    // Operators (Preview)
    {
      type: 'category',
      label: 'Operators (Preview)',
      collapsed: true,
      items: [
        'operators/operators',
        'operators/nesting',
      ],
    },

    // Message Brokers (Preview)
    {
      type: 'category',
      label: 'Message Brokers (Preview)',
      collapsed: true,
      items: [
        'message-brokers/overview',
      ],
    },

    // Jobs (Preview)
    {
      type: 'category',
      label: 'Jobs (Preview)',
      collapsed: true,
      items: [
        'jobs/scheduling-jobs',
        'jobs/cron-expressions',
        'jobs/job-management',
        'jobs/retry-strategies',
        'jobs/examples',
      ],
    },

    // Resilience (Preview)
    {
      type: 'category',
      label: 'Resilience (Preview)',
      collapsed: true,
      items: [
        'resilience/overview',
        'resilience/healthchecks',
        'resilience/quotas',
        'resilience/fallbacks',
      ],
    },

    // Logs (Preview)
    {
      type: 'category',
      label: 'Logs (Preview)',
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
