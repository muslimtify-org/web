import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Muslimtify',
  tagline:
    'A daily prayer notification daemon for Muslims on Windows and Linux, supporting 21 global standard calculation methods, all madzhab, all country.',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://muslimtify.vercel.app',
  // Set the /<baseUrl>/ pathname under which your site is served
  baseUrl: '/',

  // GitHub pages deployment config.
  organizationName: 'muslimtify-org',
  projectName: 'web',

  onBrokenLinks: 'throw',
  // The landing page uses section-id anchors (e.g. #install) for in-page
  // scrolling; those are not heading ids, so don't fail the build on them.
  onBrokenAnchors: 'ignore',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/muslimtify-org/web/tree/main/',
          // Keep internal design specs out of the published docs sidebar.
          exclude: ['**/specs/**'],
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          editUrl: 'https://github.com/muslimtify-org/web/tree/main/',
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    // Injected into every page's <head>. Algolia's crawler reads this tag to
    // verify domain ownership for the DocSearch program.
    metadata: [
      {name: 'algolia-site-verification', content: '47740D008E2E0F0D'},
    ],
    colorMode: {
      defaultMode: 'dark',
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Muslimtify',
      logo: {
        alt: 'Muslimtify Logo',
        src: 'img/muslimtify.png',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Docs',
        },
        {to: '/blog', label: 'Blog', position: 'left'},
        {
          href: 'https://discord.gg/tpNZBXmKpd',
          label: 'Community',
          position: 'left',
        },
        {
          href: 'https://github.com/rizukirr/muslimtify',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Documentation',
              to: '/docs/',
            },
            {
              label: 'Blog',
              to: '/blog',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Discord',
              href: 'https://discord.gg/tpNZBXmKpd',
            },
            {
              label: 'Contribute',
              href: 'https://github.com/rizukirr/muslimtify/blob/main/CONTRIBUTING.md',
            },
            {
              label: 'Sponsor',
              href: 'https://github.com/sponsors/rizukirr',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/rizukirr/muslimtify',
            },
            {
              label: 'Issues',
              href: 'https://github.com/rizukirr/muslimtify/issues',
            },
            {
              label: 'libmuslim',
              href: 'https://github.com/rizukirr/libmuslim',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Muslimtify · MIT License`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
    // Algolia DocSearch. Replace the three placeholders with the credentials
    // from your DocSearch approval email (or Algolia dashboard → Settings →
    // API Keys). The search-only apiKey is public and safe to commit.
    algolia: {
      // The application ID provided by Algolia
      appId: '95EZ8EII0P',

      // Public API key: it is safe to commit it
      apiKey: '10006cfa7188806aec028bcaefb36412',

      indexName: 'muslimtify',

      // Optional: see doc section below
      contextualSearch: true,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
