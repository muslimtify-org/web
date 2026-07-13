# Contributing to the Muslimtify Website

Thank you for helping improve the Muslimtify documentation and blog. This is the site that teaches people how to install and configure a tool they use for their daily prayers, so clear, accurate content matters.

Before anything else, please read the [AI Usage Policy](AI_POLICY.md).

## What you can contribute

Outside contributions are focused on **content**. You are welcome to open a pull request for:

| Area | Path | Examples |
| --- | --- | --- |
| **Blog** | `blog/` | Write a new article, tutorial, or integration guide; fix a typo in an existing post. |
| **Docs** | `docs/` | Improve getting-started steps, clarify a command, fix an outdated instruction, add a troubleshooting entry. |

## What is maintainer-only

The following are **maintainer-only**. Please **do not open a pull request** that changes them — [open an issue](https://github.com/muslimtify-org/web/issues/new/choose) instead and a maintainer will handle it:

- `src/` — custom pages, React components, and CSS
- `static/` — logo, favicon, feature images, fonts, and other assets
- `docusaurus.config.ts`, `sidebars.ts` — site configuration and navigation
- `package.json`, `package-lock.json`, `tsconfig.json` — build/tooling
- `.github/` — CI, issue/PR templates, CODEOWNERS
- `README.md`, `AI_POLICY.md`, `AGENTS.md`, `CONTRIBUTING.md`

Pull requests touching these paths require code-owner approval and will generally be closed with a request to open an issue instead.

## Local setup

Prerequisites: **Node.js 20+** and **npm**.

```bash
npm install          # install dependencies
npm run start        # dev server with live reload at http://localhost:3000
```

Before opening a PR, verify your change builds cleanly:

```bash
npm run typecheck    # TypeScript check
npm run build        # full production build
```

> The site is configured with `onBrokenLinks: 'throw'`, so a broken internal link (or a link to a page you renamed) will **fail the build**. `npm run build` catches this before CI does.

## Writing a blog post

1. Create `blog/YYYY-MM-DD-your-slug.md` using today's date.
2. Add frontmatter:

   ```yaml
   ---
   slug: your-slug
   title: Your Post Title
   authors:
     - your-author-id
   tags: [muslimtify, linux]
   ---
   ```

3. If you are a new author, add yourself to `blog/authors.yml` (this is allowed as part of your blog PR). Prefer reusing existing tags from `blog/tags.yml`.
4. Add `{/* truncate */}` after your intro to mark where the preview ends.
5. **Images:** do not commit images into `static/`. Drag your image into a GitHub issue or PR comment to upload it, then embed the resulting `https://github.com/user-attachments/assets/...` URL:

   ```html
   <img alt="description" src="https://github.com/user-attachments/assets/..." style={{height: 'auto'}} />
   ```

   The `style={{height: 'auto'}}` keeps the image scaling proportionally instead of stretching.

## Editing documentation

- Docs live in `docs/`. The sidebar is generated from the folder structure and `_category_.json` files — you do not need to edit `sidebars.ts`.
- Use relative links between docs; make sure they resolve (`npm run build` will catch broken ones).
- **Every command you document must actually work.** Test it against the real Muslimtify CLI before submitting. Do not invent flags or subcommands.

## Pull request checklist

- [ ] My PR only changes files under `blog/` and/or `docs/` (plus `blog/authors.yml`/`blog/tags.yml` if adding a post).
- [ ] `npm run build` passes locally.
- [ ] Every documented command has been tested against the real tool.
- [ ] I disclosed any AI assistance per the [AI Usage Policy](AI_POLICY.md).
- [ ] Commit subject uses a conventional prefix (`blog:`, `docs:`, `fix:`, `chore:`).

## Conduct

Every issue and PR is reviewed by a human maintainer. Be respectful, be patient, and contribute with care — people rely on this content to pray on time.
