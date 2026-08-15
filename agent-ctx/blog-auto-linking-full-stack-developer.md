# Task: blog-auto-linking

## Summary
Implemented Option A (custom rehype plugin) for automatic keyword-to-landing-page linking in the Pixquish blog article renderer.

## Approach
- **Option A** (custom rehype plugin) — chosen over Option B (regex pre-processing) because it operates on the HAST tree AFTER remark-gfm has parsed markdown into structured HTML, avoiding fragile regex edge cases on raw markdown.
- Plugin runs LAST in the rehype pipeline (after rehype-slug + rehype-autolink-headings) so heading anchors are already in place and untouched.
- Injected `<a>` elements flow through ReactMarkdown's existing `components.a` override → internal /-prefixed links auto-route via Next.js Link (SPA navigation).

## Files
- **CREATED**: `src/lib/blog-auto-link.ts` (~300 lines)
  - Exports `BLOG_KEYWORD_LINKS` (45 keyword→URL entries covering all 18 landing pages with multiple natural-language variants per URL)
  - Exports `rehypeAutoLinkKeywords()` rehype plugin
  - Recursive HAST walker; per text node checks ancestor chain for SKIP_TAGS (`a`, `code`, `pre`, `h1`-`h6`) and ALLOWED_CONTAINER_TAGS (`p`, `li`)
  - URL-level dedup via `linkedUrls` Set (one link per landing page per article)
  - Word-boundary aware via `isWordChar` regex `/[a-z0-9_-]/i` (hyphens count as word chars so "re-compress" doesn't trigger "compress")
  - Case-insensitive matching, case-preserving replacement (slices matched text from ORIGINAL text, not lowercased search text)
- **MODIFIED**: `src/app/blog/[slug]/page.tsx`
  - Added `import { rehypeAutoLinkKeywords } from "@/lib/blog-auto-link";`
  - Appended `rehypeAutoLinkKeywords` as last entry in `rehypePlugins={[...]}` array
  - No other code touched (existing `components.a` override handles the injected `<a>` elements automatically)

## Verification Results
- `bun run lint`: 0 errors, 0 warnings ✓
- Dev log: clean, no compile errors, all 12 blog article routes return HTTP 200 ✓
- agent-browser (desktop 1280×800): clicked auto-link "YouTube thumbnail size" on /blog/youtube-thumbnail-size → SPA-navigated to /resize/youtube-thumbnail ✓
- agent-browser (mobile 390×844): auto-link still clickable, no layout breakage ✓
- agent-browser: clicked auto-link "compress photos" on /blog/compress-jpg-to-100kb → SPA-navigated to /compress/photo ✓
- No React hydration warnings, no JS console errors (only benign pre-existing `scroll-behavior: smooth` Next.js notice)

## Sample Before→After

**youtube-thumbnail-size.md line 10** (auto-link fires on first occurrence in body):
- BEFORE (markdown): `The correct YouTube thumbnail size is **1280 × 720 pixels** (16:9 aspect ratio).`
- AFTER (HTML): `The correct <a href="/resize/youtube-thumbnail">YouTube thumbnail size</a> is <strong>1280 × 720 pixels</strong> (16:9 aspect ratio).`

**compress-jpg-to-100kb.md line 119**:
- BEFORE: `PNG is lossless — it can't compress photos to 100KB without looking awful.`
- AFTER: `PNG is lossless — it can't <a href="/compress/photo">compress photos</a> to 100KB without looking awful.`

## Edge cases handled
1. **Code blocks**: `<pre>`/`<code>` text skipped → no auto-links in code (favicon-size-guide.md has 2 HTML code blocks, none linked)
2. **Headings**: `<h1>`-`<h6>` text skipped → "How to make a favicon from any image" H2 with "make a favicon" keyword stays unlinked
3. **Already-linked text**: text inside `<a>` skipped → 8 manual links in compress-image-without-losing-quality.md preserved untouched
4. **First occurrence only**: URL-level dedup → favicon-size-guide.md has 2 plain-text "favicon size" occurrences but they stay unlinked because /resize/favicon was already linked earlier via `[favicon resizer](/resize/favicon)` manual link
5. **Hyphenated compounds**: "re-compress a JPG" → "compress a JPG" NOT linked (hyphen treated as word char)
6. **Lead description paragraph**: rendered as plain `<p>` JSX (not ReactMarkdown), so plugin correctly does NOT process it — preserves meta-tag cleanliness
7. **Frontmatter title/description**: not processed by ReactMarkdown → no HTML leak in `<meta>` tags

## Per-article auto-link count
- youtube-thumbnail-size: 1 new auto-link (YouTube thumbnail size)
- compress-jpg-to-100kb: 1 new auto-link (compress photos)
- compress-image-without-losing-quality: 0 new (URLs already manually linked)
- social-media-image-sizes-2026: 0 new (URLs already manually linked)
- favicon-size-guide: 0 new (URLs already manually linked)
- png-vs-jpg: 0 new (URLs already manually linked)
- webp-vs-avif: 0 new (URLs already manually linked)
- png-vs-webp, compression-modes-compared, instagram-image-sizes-2026, best-image-format-for-web, reduce-image-size-for-email: 0 new (no plain-text keyword matches)

## Future
- Adding a new landing page to `src/lib/landing-pages.ts` requires also adding its keyword phrases to `BLOG_KEYWORD_LINKS` in `src/lib/blog-auto-link.ts` to enable auto-linking. All existing + future articles will pick up the new auto-link on next render (no per-article setup).
- Plugin is purely additive — disabling it (remove the `rehypeAutoLinkKeywords,` array entry) reverts all auto-links with zero side effects.

## Dependencies
- No new npm packages installed.
- `@types/hast` was already available transitively (via rehype-slug ecosystem).
- `unist-util-visit` is also installed but not used (wrote a custom recursive walker for tighter ancestor tracking).
