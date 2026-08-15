# Pixquish Blog — How to Add Articles

Adding a new article is simple: drop a Markdown file in `content/blog/` and it
appears on the blog automatically. No code changes required.

## Quick start

1. Create a new file in `content/blog/`, e.g. `my-article.md`
   - **Filename becomes the URL**: `my-article.md` → `/blog/my-article`
   - Use lowercase, hyphens only (no spaces, no capitals): `png-vs-webp.md`, `instagram-image-sizes.md`
2. Add the frontmatter (see template below)
3. Write your article in Markdown below the frontmatter
4. Save — the article appears on `/blog` immediately (dev server hot-reloads)

## Article template

```markdown
---
title: "Your Article Title"
description: "A 1–2 sentence summary shown in the blog list and search results. This is what Google shows as the meta description — keep it under 160 characters."
date: "2026-08-15"
author: "Pixquish"
tags: ["png", "webp", "image-compression"]
image: "/og-image.png"
---

## Your first heading

Write your article in standard **Markdown**. Supported:

- **Bold** and *italic*
- [Links](https://example.com) — internal links like [Pixquish](/#workspace) open in-page
- Lists (ordered and unordered)
- `inline code` and code blocks
- > Blockquotes
- Tables (see the existing articles for examples)
- ## Headings (h2, h3, h4) — automatically get anchor links for sharing
- Images via `![alt text](/path/to/image.png)`
```

## Frontmatter fields

| Field | Required | Description |
|---|---|---|
| `title` | ✅ | Article title (shown as h1 + og:title) |
| `description` | ✅ | 1–2 sentence summary (meta description, shown in blog list) |
| `date` | ✅ | Publication date — `YYYY-MM-DD` format. Sorts blog list (newest first) |
| `author` | ❌ | Defaults to `"Pixquish"` |
| `tags` | ❌ | Array of tags, shown as chips. Also used as `keywords` in article schema |
| `image` | ❌ | Social share image. Defaults to `/og-image.png`. Use 1344×768 or similar |
| `updatedAt` | ❌ | Override the modified date for the BlogPosting schema |

## Markdown features

The blog uses **GitHub-flavored Markdown** (`remark-gfm`), so you get:

- **Tables** — pipe syntax (see existing articles)
- **Strikethrough** — `~~text~~`
- **Task lists** — `- [ ]` and `- [x]`
- **Autolinked URLs** — bare URLs become links

Headings (`##`, `###`) automatically get anchor IDs (via `rehype-slug`) so you
can link to `#section-name` — great for table-of-contents links and SEO.

## Internal links

Links to Pixquish features use hash anchors and open in-page:

- Compress tool: `[link](/#workspace)`
- Resize tool: `[link](/#resize)`
- Features: `[link](/#features)`
- FAQ: `[link](/#faq)`
- Another article: `[link](/blog/other-article-slug)`

External links (`https://...`) automatically open in a new tab.

## SEO is automatic

Every article gets:

- ✅ **BlogPosting JSON-LD schema** — Google rich results eligible
- ✅ **BreadcrumbList schema** — Home → Blog → Article
- ✅ **Open Graph** tags (title, description, image, publishedTime, author, tags)
- ✅ **Twitter Card** (summary_large_image)
- ✅ **Canonical URL** — `https://pixquish.app/blog/your-slug`
- ✅ **Sitemap entry** — automatically added to `/sitemap.xml`
- ✅ **Reading time** — calculated from content length

You don't need to touch any config — just write the `.md` file.

## Article writing tips

1. **Target one keyword per article** — e.g. "png vs webp", "instagram image size"
2. **Front-load the answer** in the first 100 words (Google's "helpful content" signal)
3. **Use H2/H3 headings** to break up content — Google uses them to understand structure
4. **Include a table** where relevant — Google loves tables for "comparison" queries
5. **End with a CTA** to Pixquish — drives users to the tool
6. **Aim for 800–1500 words** — long enough to rank, short enough to be useful
7. **Use the keyword in**: title, first paragraph, at least one H2, and naturally throughout

## Example articles (already included)

- `png-vs-webp.md` → `/blog/png-vs-webp` — targets "png vs webp"
- `instagram-image-sizes-2026.md` → `/blog/instagram-image-sizes-2026` — targets "instagram image size"

Copy one of these as a starting template for your next article.

## Troubleshooting

**Article doesn't appear on `/blog`:**
- Check the filename ends in `.md` (not `.mdx` or `.markdown`)
- Check the frontmatter has `title`, `description`, and `date`
- Restart the dev server (`bun run dev`)

**Article looks broken:**
- Make sure frontmatter `---` dashes are on their own lines
- Validate your Markdown at [markdownlint.com](https://markdownlint.com)

**Want to delete an article:**
- Just delete the `.md` file — it disappears from the blog immediately
