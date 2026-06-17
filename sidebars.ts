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

    // Backend
    {
      type: 'category',
      label: 'Backend',
      collapsed: false,
      items: [
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

        // Databases - Unified data layer
        {
          type: 'category',
          label: 'Databases',
          collapsed: true,
          items: [
            // SQL & NoSQL Databases
            {
              type: 'category',
              label: 'Core Databases',
              collapsed: true,
              items: [
                'databases/relational/getting-started',
                'databases/relational/querying',
                'databases/relational/writing-data',
                'databases/relational/pre-save-operations',
                'databases/relational/triggers',
                'databases/relational/aggregations',
                'databases/relational/transactions',
                'databases/relational/migrations',
                'databases/relational/table-management',
                'databases/relational/indexing',
                'databases/relational/actions',
                'databases/relational/direct-queries',
                'databases/relational/best-practices',
              ],
            },
            // Graph Databases
            {
              type: 'category',
              label: 'Graph Databases',
              collapsed: true,
              items: [
                'databases/graphs/overview',
                'databases/graphs/getting-started',
                'databases/graphs/nodes',
                'databases/graphs/relationships',
                'databases/graphs/traversals',
                'databases/graphs/indexing',
                'databases/graphs/transactions',
                'databases/graphs/actions',
                'databases/graphs/best-practices',
              ],
            },
            // Vector Stores
            {
              type: 'category',
              label: 'Vector Stores',
              collapsed: true,
              items: [
                'databases/vectors/overview',
                'databases/vectors/getting-started',
                'databases/vectors/querying',
                'databases/vectors/agent-integration',
                'databases/vectors/best-practices',
              ],
            },
            // Data Warehouse
            {
              type: 'category',
              label: 'Warehouse',
              collapsed: true,
              items: [
                'databases/warehouse/getting-started',
                'databases/warehouse/joins',
                'databases/warehouse/semantic-joins',
                'databases/warehouse/transactions',
                'databases/warehouse/query-reference',
                'databases/warehouse/best-practices',
              ],
            },
            // Frontend Usage (client SDK disabled for now)
            {
              type: 'category',
              label: 'Frontend Usage',
              collapsed: true,
              items: [
                'frontend/client/databases',
              ],
            },
          ],
        },

        // Storage
        {
          type: 'category',
          label: 'Storage',
          collapsed: true,
          items: [
            'storage/overview',
            'storage/crud',
            'storage/files',
            'storage/use',
            'storage/read-files',
          ],
        },

        // Cloud
        {
          type: 'category',
          label: 'Cloud',
          collapsed: true,
          items: [
            'cloud/overview',
            'cloud/connections',
            'cloud/cloud-linked-components',
            'cloud/aws-networking',
            {
              type: 'category',
              label: 'Providers',
              collapsed: true,
              items: [
                'cloud/providers/aws',
                'cloud/providers/gcp',
                'cloud/providers/azure',
                'cloud/providers/mongodb-atlas',
                'cloud/providers/neo4j-aura',
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
            'sessions/activity-dashboard',
            'sessions/decrypting',
            'sessions/refreshing',
            // Frontend Usage (client SDK disabled for now - frontend/client/sessions removed)
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
            'notifications/message-logs',
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
            // Frontend Usage (client SDK disabled for now - frontend/client/workflows removed)
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
            'jobs/overview',
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
      ],
    },

    {
      type: 'category',
      label: 'NestJS',
      collapsed: false,
      items: [
        'nestjs/overview',
        'nestjs/getting-started',
        'nestjs/module-setup',
        'nestjs/context-and-handles',
        'nestjs/decorators-core',
        'nestjs/decorators-runtime',
        'nestjs/workspace-builders',
        'nestjs/interceptors',
      ],
    },

    // Frontend
    {
      type: 'category',
      label: 'Frontend',
      collapsed: true,
      items: [
        'frontend/overview',
        'frontend/client/getting-started',
        'frontend/client/sessions',
        'frontend/client/databases',
        'frontend/client/storage',
        'frontend/client/workflows',
        'frontend/client/notifications',
        'frontend/client/actions',
        'frontend/client/resilience',
        'frontend/client/analytics',
      ],
    },

    {
      type: 'category',
      label: 'CLI',
      collapsed: false,
      items: [
        'cli/index',
        {
          type: 'category',
          label: 'Setup',
          collapsed: true,
          items: ['cli/authentication', 'cli/workspaces', 'cli/linking', 'cli/local-platform'],
        },
        {
          type: 'category',
          label: 'Platform entities',
          collapsed: true,
          items: ['cli/products', 'cli/apps'],
        },
        {
          type: 'category',
          label: 'Components & runtime',
          collapsed: true,
          items: [
            'cli/resources',
            'cli/cloud',
            'cli/database',
            'cli/graph',
            'cli/secrets',
            'cli/generate',
          ],
        },
        'cli/troubleshooting',
      ],
    },
    {
      type: 'category',
      label: 'MCP Server',
      collapsed: false,
      items: [
        'mcp-server/overview',
        'mcp-server/getting-started',
        'mcp-server/configuration',
        'mcp-server/tools',
        'mcp-server/modules-and-methods',
        'mcp-server/method-reference',
        'mcp-server/code-generation',
        'mcp-server/use-cases',
        'mcp-server/security',
      ],
    },
    {
      type: 'category',
      label: 'Workbench',
      collapsed: false,
      items: [
        'workbench/getting-started',
        'workbench/creating-workspace',
        'workbench/sdk-access',
        {
          type: 'category',
          label: 'Creating an app',
          collapsed: true,
          items: [
            'workbench/app/creating-app',
            'workbench/app/postman-collections',
            'workbench/app/individual-requests',
            'workbench/app/shared-variables',
            'workbench/app/app-visibility',
          ],
        },
        {
          type: 'category',
          label: 'Products',
          collapsed: true,
          items: [
            'workbench/products/creating-product',
            'workbench/products/connecting-app',
            'workbench/products/database',
            'workbench/products/storage',
            'workbench/products/notifications',
            'workbench/products/caching',
            'workbench/products/messaging',
            'workbench/products/sessions',
          ],
        },
        'workbench/secrets',
        //'workbench/logs-overview',
        // 'workbench/team-management',
      ],
    },

    // Tutorials
    {
      type: 'category',
      label: 'Tutorials',
      collapsed: true,
      items: [
        {
          type: 'category',
          label: 'Backend',
          collapsed: true,
          items: [
            'tutorials/backend/building-a-blog-api',
            'tutorials/backend/e-commerce-backend',
            'tutorials/backend/real-time-chat',
            'tutorials/backend/task-management-system',
          ],
        },
        {
          type: 'category',
          label: 'Frontend',
          collapsed: true,
          items: [
            'tutorials/client/building-a-todo-app',
            'tutorials/client/shopping-cart',
            'tutorials/client/social-media-feed',
            'tutorials/client/real-time-chat-app',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Miscellaneous',
      collapsed: true,
      items: [
        {
          type: 'doc',
          id: 'sdk-readiness',
          label: 'SDK Readiness',
        },
        {
          type: 'doc',
          id: 'sdk/runtime-defaults',
          label: 'SDK runtime defaults',
        },
      ],
    },
  ],
};

export default sidebars;
