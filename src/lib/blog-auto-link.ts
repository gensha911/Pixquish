/**
 * Blog auto-linking system.
 *
 * Walks the rendered HTML tree of every blog article and, the FIRST time a
 * known keyword phrase (e.g. "compress PNG", "YouTube thumbnail size") appears
 * in paragraph or list-item prose, wraps that phrase in an `<a>` element
 * pointing at the corresponding programmatic landing page (`/compress/png`,
 * `/resize/youtube-thumbnail`, …). This builds a tight internal link graph
 * for SEO: Google sees every blog article linking to the most relevant
 * landing pages, which boosts the landing pages' rankings.
 *
 * Linking rules (see task blog-auto-linking for the full spec):
 *  1. Each landing-page URL is linked at most ONCE per article.
 *  2. Never inside an existing `<a>` (no nested links / no double-linking).
 *  3. Never inside `<code>` or `<pre>` (inline + block code stays clean).
 *  4. Never inside `<h1>`–`<h6>` (headings stay clean for anchor links).
 *  5. Case-insensitive matching, case-preserving replacement — "Compress PNG",
 *     "compress png", and "COMPRESS PNG" all match, but the link text keeps
 *     the original casing.
 *  6. Word-boundary aware — "decompress PNG" does not match "compress PNG",
 *     and "PNGs" does not match a "PNG" keyword.
 *
 * Implementation: a custom rehype plugin that walks the HAST tree AFTER
 * remark-gfm → rehype-slug → rehype-autolink-headings has done its work, so
 * heading anchors and table HTML are already in place. Injected `<a>` elements
 * flow through ReactMarkdown's `components.a` override (which routes internal
 * links through Next.js `<Link>` for SPA navigation).
 */

import type {
  Element,
  ElementContent,
  Node,
  Root,
  RootContent,
  Text,
} from "hast";

/**
 * A keyword phrase + the landing-page URL it should link to.
 * Phrases should be 2–4 words, natural in article prose, and specific enough
 * that they don't match spammy (e.g. bare "PNG" or "JPG" would match far too
 * often — never use those as keywords).
 */
export interface BlogKeywordLink {
  /** natural-language phrase that appears in article prose, e.g. "compress PNG" */
  keyword: string;
  /** landing-page URL, e.g. "/compress/png" or "/resize/instagram-post" */
  url: string;
}

/**
 * The keyword → URL mapping for all 18 programmatic landing pages.
 *
 * Multiple variants can map to the SAME URL — only the first match of any
 * variant links per article (URL-level de-duplication, see `linkedUrls` in
 * the plugin). Variants cover the natural prose forms authors actually write:
 *   - "compress PNG"      (imperative / verb-noun)
 *   - "compress a PNG"    (with article)
 *   - "compress your PNG" (possessive)
 *   - "compressing PNG"   (gerund)
 *   - "PNG compressor"    (noun phrase — the tool itself)
 *
 * Resize keywords use the noun-phrase form ("YouTube thumbnail size") plus a
 * verb-phrase form ("resize for YouTube Thumbnail") since authors write both.
 *
 * Length-sorted at module load so that the longest phrase at any text position
 * matches first — this prevents "compress PNG" from shadowing "compress your
 * PNG image" when both would link to the same URL anyway.
 */
export const BLOG_KEYWORD_LINKS: BlogKeywordLink[] = [
  // === Compress pages — natural prose variants ===
  // /compress/png
  { keyword: "compress your PNG", url: "/compress/png" },
  { keyword: "compress a PNG", url: "/compress/png" },
  { keyword: "compressing PNG", url: "/compress/png" },
  { keyword: "PNG compressor", url: "/compress/png" },
  { keyword: "compress PNG", url: "/compress/png" },
  // /compress/jpg  (also handles JPEG alias)
  { keyword: "compress your JPG", url: "/compress/jpg" },
  { keyword: "compress a JPEG", url: "/compress/jpg" },
  { keyword: "compress a JPG", url: "/compress/jpg" },
  { keyword: "compressing JPG", url: "/compress/jpg" },
  { keyword: "compressing JPEG", url: "/compress/jpg" },
  { keyword: "JPG compressor", url: "/compress/jpg" },
  { keyword: "compress JPG", url: "/compress/jpg" },
  { keyword: "compress JPEG", url: "/compress/jpg" },
  // /compress/webp
  { keyword: "compress your WebP", url: "/compress/webp" },
  { keyword: "compress a WebP", url: "/compress/webp" },
  { keyword: "compressing WebP", url: "/compress/webp" },
  { keyword: "WebP compressor", url: "/compress/webp" },
  { keyword: "compress WebP", url: "/compress/webp" },
  // /compress/avif
  { keyword: "compress a AVIF", url: "/compress/avif" },
  { keyword: "compressing AVIF", url: "/compress/avif" },
  { keyword: "compress AVIF", url: "/compress/avif" },
  // /compress/photo
  { keyword: "compress your photos", url: "/compress/photo" },
  { keyword: "compressing photos", url: "/compress/photo" },
  { keyword: "compress a photo", url: "/compress/photo" },
  { keyword: "compress photos", url: "/compress/photo" },
  // /compress/screenshot
  { keyword: "compress your screenshots", url: "/compress/screenshot" },
  { keyword: "compressing screenshots", url: "/compress/screenshot" },
  { keyword: "compress a screenshot", url: "/compress/screenshot" },
  { keyword: "compress screenshots", url: "/compress/screenshot" },

  // === Resize pages — natural prose variants ===
  // /resize/instagram-post
  { keyword: "resize for Instagram Post", url: "/resize/instagram-post" },
  { keyword: "Instagram post size", url: "/resize/instagram-post" },
  // /resize/instagram-story
  { keyword: "resize for Instagram Story", url: "/resize/instagram-story" },
  { keyword: "Instagram Story size", url: "/resize/instagram-story" },
  // /resize/youtube-thumbnail
  { keyword: "resize for YouTube Thumbnail", url: "/resize/youtube-thumbnail" },
  { keyword: "YouTube thumbnail size", url: "/resize/youtube-thumbnail" },
  // /resize/twitter-header
  { keyword: "resize for Twitter Header", url: "/resize/twitter-header" },
  { keyword: "Twitter header size", url: "/resize/twitter-header" },
  // /resize/facebook-cover
  { keyword: "resize for Facebook Cover", url: "/resize/facebook-cover" },
  { keyword: "Facebook cover photo size", url: "/resize/facebook-cover" },
  { keyword: "Facebook cover size", url: "/resize/facebook-cover" },
  // /resize/linkedin-banner
  { keyword: "resize for LinkedIn Banner", url: "/resize/linkedin-banner" },
  { keyword: "LinkedIn banner size", url: "/resize/linkedin-banner" },
  // /resize/pinterest-pin
  { keyword: "resize for Pinterest Pin", url: "/resize/pinterest-pin" },
  { keyword: "Pinterest pin size", url: "/resize/pinterest-pin" },
  // /resize/favicon
  { keyword: "make a favicon", url: "/resize/favicon" },
  { keyword: "favicon size", url: "/resize/favicon" },
  // /resize/twitter-post
  { keyword: "resize for Twitter Post", url: "/resize/twitter-post" },
  { keyword: "Twitter post size", url: "/resize/twitter-post" },
  // /resize/facebook-post
  { keyword: "resize for Facebook Post", url: "/resize/facebook-post" },
  { keyword: "Facebook post size", url: "/resize/facebook-post" },
  // /resize/app-icon
  { keyword: "make an app icon", url: "/resize/app-icon" },
  { keyword: "app icon size", url: "/resize/app-icon" },
  // /resize/web-banner
  { keyword: "resize for Web Banner", url: "/resize/web-banner" },
  { keyword: "web banner size", url: "/resize/web-banner" },
];

// --- Pre-computed lookup table (length-desc sorted, lowercased for matching) ---

interface KeywordEntry {
  /** original-case keyword (used for length + slicing text) */
  keyword: string;
  /** lowercased keyword for case-insensitive comparison */
  keywordLower: string;
  /** landing-page URL this keyword links to */
  url: string;
  /** cached length (== keyword.length, kept for cheap comparison) */
  length: number;
}

const SORTED_KEYWORDS: KeywordEntry[] = BLOG_KEYWORD_LINKS.map(
  ({ keyword, url }) => {
    const keywordLower = keyword.toLowerCase();
    return { keyword, keywordLower, url, length: keywordLower.length };
  },
).sort((a, b) => b.length - a.length);

// --- HAST walk helpers ---

/** Tags whose text content must NEVER be auto-linked. */
const SKIP_TAGS = new Set([
  "a", // already linked — never nest
  "code", // inline code
  "pre", // code block (also catches nested <code>)
  "h1", // headings — stay clean for SEO + anchor links
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
]);

/**
 * Container tags whose text content IS eligible for auto-linking.
 * Per spec: paragraph + list-item prose only. Table cells, blockquotes,
 * headings, and code are all excluded.
 */
const ALLOWED_CONTAINER_TAGS = new Set(["p", "li"]);

/** Returns true if `ch` is a word character (letter, digit, underscore, hyphen). */
function isWordChar(ch: string | undefined): boolean {
  if (!ch) return false;
  // [a-z0-9_-] — ASCII word chars + hyphen. Hyphens count as word chars so
  // "re-compress" / "decompress" / "WebP-friendly" don't trigger keyword
  // matches at the "compress" / "WebP" boundary. Non-ASCII letters (é, 中) are
  // treated as boundaries, which is what we want for image-format keywords
  // (all ASCII).
  return /[a-z0-9_-]/i.test(ch);
}

/**
 * Find the longest keyword whose (a) lowercased form matches `textLower`
 * starting at `pos`, (b) sits on a word boundary on both sides, and (c) whose
 * target URL hasn't been linked yet in this article.
 *
 * Iterates SORTED_KEYWORDS (length-desc), so the FIRST qualifying match is the
 * longest. If the longest match's URL is already linked, falls through to a
 * shorter keyword at the same position (e.g. "compress your PNG" links
 * /compress/png on first hit; later "compress PNG" stays plain text since the
 * URL is taken — but "compress photos" at the same position would still match
 * since it targets a different URL).
 */
function findBestMatchAt(
  text: string,
  textLower: string,
  pos: number,
  linkedUrls: Set<string>,
): KeywordEntry | null {
  const charBefore = pos > 0 ? text[pos - 1] : "";
  if (isWordChar(charBefore)) return null; // mid-word, not a boundary

  for (const entry of SORTED_KEYWORDS) {
    if (!textLower.startsWith(entry.keywordLower, pos)) continue;

    const afterPos = pos + entry.length;
    const charAfter = afterPos < text.length ? text[afterPos] : "";
    if (isWordChar(charAfter)) continue; // mid-word on the trailing side

    if (linkedUrls.has(entry.url)) continue; // URL already linked in this article

    return entry; // first qualifying = longest = best
  }
  return null;
}

/**
 * Decide whether to replace a text node with text + injected `<a>` elements.
 * Returns `null` to signal "leave this text node unchanged" (no mutation —
 * saves a wasteful clone). Otherwise returns the replacement node list.
 */
function processTextNode(
  textNode: Text,
  ancestors: Node[],
  linkedUrls: Set<string>,
): RootContent[] | null {
  // 1. Check ancestor context: must be inside <p> or <li>, must NOT be inside
  //    any SKIP_TAGS element (a, code, pre, h1-h6).
  let inAllowedContainer = false;
  for (const anc of ancestors) {
    if (anc.type !== "element") continue;
    if (SKIP_TAGS.has(anc.tagName)) return null; // skip immediately
    if (ALLOWED_CONTAINER_TAGS.has(anc.tagName)) inAllowedContainer = true;
  }
  if (!inAllowedContainer) return null; // not in p/li — leave alone

  const text = textNode.value;
  if (!text) return null;

  const textLower = text.toLowerCase();

  const replacement: RootContent[] = [];
  let cursor = 0; // end of last emitted chunk
  let i = 0;
  let anyMatched = false;

  while (i < text.length) {
    const match = findBestMatchAt(text, textLower, i, linkedUrls);
    if (!match) {
      i += 1;
      continue;
    }

    anyMatched = true;

    // Flush text before the match (if any).
    if (i > cursor) {
      replacement.push({ type: "text", value: text.slice(cursor, i) });
    }

    // Slice the matched phrase from the ORIGINAL text so the original casing
    // is preserved in the link anchor text.
    const matchedText = text.slice(i, i + match.length);

    const linkElement: Element = {
      type: "element",
      tagName: "a",
      properties: { href: match.url },
      children: [{ type: "text", value: matchedText } satisfies Text],
    };
    replacement.push(linkElement);

    linkedUrls.add(match.url); // mark URL as linked for the rest of this article

    i += match.length;
    cursor = i;
  }

  if (!anyMatched) return null; // unchanged — let the caller keep the original node

  // Flush trailing text after the last match (if any).
  if (cursor < text.length) {
    replacement.push({ type: "text", value: text.slice(cursor) });
  }

  return replacement;
}

/**
 * Recursive HAST walker. For every element/root, iterate its children:
 *  - text nodes → maybe replace with [text, <a>, text, …] via processTextNode.
 *  - element nodes → recurse with updated ancestor chain.
 *
 * Mutates the tree in place: rewrites `node.children` arrays when a text node
 * was replaced. The ancestors array passed to processTextNode for a text node
 * includes the immediate parent element (so we know if we're inside <p>/<li>
 * vs <h2>/<code>/<a>).
 */
function walkTree(node: Node, ancestors: Node[], linkedUrls: Set<string>): void {
  if (node.type !== "element" && node.type !== "root") return;

  const parent = node as Element | Root;
  const newAncestors = [...ancestors, node];

  const nextChildren: ElementContent[] | RootContent[] = [];

  for (const child of parent.children) {
    if (child.type === "text") {
      const replacement = processTextNode(child as Text, newAncestors, linkedUrls);
      if (replacement) {
        // The replacement list is typed as RootContent[] (Element | Text |
        // Comment | Doctype) but a <p>/<li> only accepts ElementContent[]
        // (Element | Text | Comment). Since we only ever push text + <a>
        // elements, the cast is sound.
        for (const r of replacement) nextChildren.push(r as ElementContent);
      } else {
        nextChildren.push(child as ElementContent);
      }
    } else {
      walkTree(child, newAncestors, linkedUrls);
      nextChildren.push(child as ElementContent);
    }
  }

  // ElementContent[] and RootContent[] are structurally compatible for our
  // purposes (we only produce text + <a> elements); assign back.
  (parent as { children: ElementContent[] | RootContent[] }).children = nextChildren;
}

/**
 * Rehype plugin: auto-link the first occurrence of each known keyword phrase
 * in every blog article. Drop-in for the ReactMarkdown `rehypePlugins` array.
 *
 * Place AFTER rehype-slug + rehype-autolink-headings in the pipeline so
 * heading anchors are already in place and won't be disturbed:
 *
 *   rehypePlugins={[
 *     rehypeSlug,
 *     [rehypeAutolinkHeadings, { behavior: "wrap", … }],
 *     rehypeAutoLinkKeywords, // <-- here
 *   ]}
 *
 * Injected `<a>` elements flow through ReactMarkdown's `components.a` override,
 * which routes internal links (`/compress/png`, `/resize/instagram-post`, …)
 * through Next.js `<Link>` for SPA navigation — no extra wiring needed.
 *
 * No options (yet). Signature accepts an unused options arg for forward-compat
 * with the unified `Plugin` shape.
 */
export function rehypeAutoLinkKeywords(): (tree: Root) => Root {
  return (tree: Root): Root => {
    const linkedUrls = new Set<string>();
    walkTree(tree, [], linkedUrls);
    return tree;
  };
}
