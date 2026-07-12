# Muslimtify Website

The official documentation website and blog for [Muslimtify](https://github.com/muslimtify-org/muslimtify), the free and open-source daily prayer notification daemon, and [libmuslim](https://github.com/muslimtify-org/libmuslim), the C library that powers its prayer-time calculations.

The site is built with [Docusaurus](https://docusaurus.io/) and published to GitHub Pages.

## What is in this repository

| Path | Contents |
| --- | --- |
| `docs/` | User documentation: getting started, commands, configuration, calculation methods, troubleshooting, and the libmuslim API reference. |
| `blog/` | Project blog posts and announcements. |
| `src/` | Custom pages, React components, and CSS. |
| `static/` | Static assets served as-is (images, icons, downloads). |
| `docusaurus.config.ts` | Site configuration (navbar, footer, plugins, metadata). |
| `sidebars.ts` | Sidebar definition. The docs sidebar is generated from the `docs/` folder structure. |

## Prerequisites

- [Node.js](https://nodejs.org/) 20 or newer
- npm (or the package manager of your choice)

## Getting started

Install dependencies:

```bash
npm install
```

Start a local development server. It opens a browser window and reflects most changes live without a restart:

```bash
npm run start
```

## Building

Generate the static site into the `build/` directory:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run serve
```

Type-check the project without emitting files:

```bash
npm run typecheck
```

## Editing the documentation

Documentation pages are Markdown or MDX files under `docs/`. The sidebar is generated automatically from the folder structure, so adding a file adds a page.

- Order pages within a folder with the `sidebar_position` frontmatter field.
- Group pages into a category by placing them in a subfolder with a   `_category_.json` file. For example, the libmuslim reference lives under   `docs/libmuslim/c-api/`, leaving room for future language bindings as sibling folders.
- Run `npm run build` before opening a pull request. The build fails on broken internal links and MDX errors, so a clean build is a good pre-flight check.

## Deployment

The site deploys to GitHub Pages. Using SSH:

```bash
USE_SSH=true npm run deploy
```

Without SSH:

```bash
GIT_USER=<Your GitHub username> npm run deploy
```

This builds the site and pushes the result to the `gh-pages` branch.

## Related projects

- [muslimtify](https://github.com/muslimtify-org/muslimtify) - the prayer notification daemon
- [libmuslim](https://github.com/muslimtify-org/libmuslim) - the prayer-time calculation library
- [Muslimtify organization](https://github.com/muslimtify-org)

## License

MIT
