# SvelteKit Blog with CMS

A statically pre-rendered blog application built with SvelteKit featuring a password-protected CMS with automatic git deployment.

## Features

- **Fully Static Site** - Public pages are pre-rendered at build time
- **Password-Protected CMS** - Secure admin interface for managing content
- **Markdown-Based Posts** - Write posts in markdown with automatic HTML rendering
- **Git-Based Workflow** - CMS automatically commits and pushes changes to trigger rebuilds
- **Automatic Deployment** - Vercel automatically rebuilds when changes are pushed
- **Tailwind CSS** - Styled with Tailwind CSS

## How It Works

1. Edit posts via the `/cms` interface
2. CMS saves posts as markdown files in `src/posts/`
3. Changes are automatically committed and pushed to your git repository
4. Vercel detects the push and rebuilds the static site (~1-2 minutes)
5. Updated site is live with pre-rendered HTML

## Getting Started

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Then edit `.env` and set your CMS password:

```
CMS_PASSWORD=your-secure-password
```

If no password is set, the default is `admin`.

### Development

Run the development server:

```bash
npm run dev
```

Visit:
- `http://localhost:5173` - Public blog homepage (pre-rendered)
- `http://localhost:5173/cms` - CMS login (server-rendered)

### Building for Production

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Deployment to Vercel

This project uses a git-based deployment workflow:

1. Push your code to GitHub/GitLab/Bitbucket
2. Import your repository in Vercel
3. Set the `CMS_PASSWORD` environment variable in Vercel project settings
4. Deploy

**Important:** Make sure your git repository is configured and you have push access. The CMS will commit and push changes automatically.

### Setting Up Git Authentication

For the automatic git push to work in production, Vercel needs git credentials:

1. Generate a Personal Access Token in your git provider (GitHub, GitLab, etc.)
2. Add it as an environment variable in Vercel (if needed for private repos)

Alternatively, use the Vercel CLI:

```bash
npm i -g vercel
vercel
```

## Project Structure

```
src/
├── lib/
│   └── posts.js                  # Post management utilities
├── posts/                        # Markdown posts (git-tracked)
│   ├── example-post.md
│   └── ...
├── routes/
│   ├── +page.svelte              # Public homepage (pre-rendered)
│   ├── +page.server.js           # Loads posts at build time
│   ├── cms/
│   │   ├── +layout.server.js     # Authentication check
│   │   ├── +page.svelte          # CMS dashboard
│   │   ├── login/
│   │   │   ├── +page.svelte      # Login form
│   │   │   └── +page.server.js   # Login handler
│   │   └── logout/
│   │       └── +server.js        # Logout handler
│   └── api/
│       └── posts/
│           └── +server.js        # API endpoints with git automation
└── app.css                       # Global Tailwind styles
```

## CMS Usage

1. Navigate to `/cms` or `/cms/login`
2. Enter your password (set in CMS_PASSWORD environment variable)
3. Create, edit, or delete posts (markdown supported)
4. CMS automatically commits and pushes to git
5. Vercel rebuilds the site automatically (~1-2 minutes)
6. Changes appear on the public site

## Post Format

Posts are stored as markdown files in `src/posts/` with frontmatter:

```markdown
---
id: 1234567890
title: My First Post
created: 2025-12-29T12:00:00.000Z
updated: 2025-12-29T12:00:00.000Z
---

Your markdown content here...
```

## Notes

- **Public pages** (`/`) are pre-rendered as static HTML at build time
- **CMS pages** (`/cms/*`) are server-rendered and require Vercel serverless functions
- Posts are stored as markdown files in `src/posts/` and tracked in git
- The CMS uses cookie-based authentication (sessions last 7 days)
- Posts support full markdown syntax
- Changes trigger automatic rebuilds via git push
- Build time depends on number of posts (typically under 1 minute)
