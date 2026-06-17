import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

/** Old React/Vue doc paths that redirect to unified client pages. */
const CLIENT_SDK_REDIRECTS: Record<string, string[]> = {
  '/frontend/client/getting-started': [
    '/frontend/react/getting-started',
    '/frontend/vue/getting-started',
  ],
  '/frontend/client/databases': [
    '/frontend/react/database-hooks',
    '/frontend/vue/database-composables',
  ],
  '/frontend/client/storage': [
    '/frontend/react/storage-hooks',
    '/frontend/vue/storage-composables',
  ],
  '/frontend/client/workflows': [
    '/frontend/react/workflow-hooks',
    '/frontend/vue/workflow-composables',
  ],
  '/frontend/client/sessions': [
    '/frontend/react/session-hooks',
    '/frontend/vue/session-composables',
  ],
  '/frontend/client/notifications': [
    '/frontend/react/notification-hooks',
    '/frontend/vue/notification-composables',
  ],
  '/frontend/client/actions': [
    '/frontend/react/action-hooks',
    '/frontend/vue/action-composables',
  ],
  '/frontend/client/resilience': [
    '/frontend/react/resilience-hooks',
    '/frontend/vue/resilience-composables',
  ],
};

function createClientSdkRedirects(existingRoute: string): string[] | undefined {
  return CLIENT_SDK_REDIRECTS[existingRoute];
}

const config: Config = {
  title: 'Ductape Documentation',
  tagline: 'Build backend systems faster',
  favicon: 'img/favicon.svg',

  // Set the production url of your site here
  url: 'https://docs.ductape.app',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  organizationName: 'ductape',
  projectName: 'ductape-docs',

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  markdown: {
    mermaid: true,
  },

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang.
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
          remarkPlugins: [
            require('./remark-plugins/remark-sdk-code-tabs'),
          ],
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [],

  themes: [
    '@docusaurus/theme-mermaid',
    [
      require.resolve('@cmfcmf/docusaurus-search-local'),
      {
        // Index all pages and docs
        indexDocs: true,
        indexPages: true,
        indexBlog: false,

        // Customization options
        maxSearchResults: 8,

        // Styling
        style: undefined, // We'll use custom CSS
      },
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/ductape.png',

    // Color mode settings
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },

    navbar: {
      title: '',
      logo: {
        alt: 'Ductape Logo',
        src: 'img/ductape-logo.svg',
        href: '/',
      },
      items: [
        { type: 'search', position: 'left' },
      ],
    },

    footer: {
      // Using custom footer component in src/theme/Footer
      style: 'light',
    },

    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['java', 'go', 'csharp', 'bash'],
    },

    // Table of contents settings
    tableOfContents: {
      minHeadingLevel: 2,
      maxHeadingLevel: 4,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
