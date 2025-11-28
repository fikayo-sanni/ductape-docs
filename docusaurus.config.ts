import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

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
      style: 'light',
      links: [
        {
          title: 'Documentation',
          items: [
            {
              label: 'Getting Started',
              to: '/getting-started/quickstart',
            },
            {
              label: 'Apps',
              to: '/apps/getting-started',
            },
            {
              label: 'Features',
              to: '/features/overview',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Discord',
              href: 'https://discord.gg/JHXxQ6MAwb',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/ductapetech',
            },
            {
              label: 'LinkedIn',
              href: 'https://www.linkedin.com/company/ductape-technologies',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Website',
              href: 'https://ductape.app',
            },
            {
              label: 'Workbench',
              href: 'https://workbench.ductape.app',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/ductape',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Ductape Technologies. All rights reserved.`,
    },

    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },

    // Table of contents settings
    tableOfContents: {
      minHeadingLevel: 2,
      maxHeadingLevel: 4,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
