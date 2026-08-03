/**
 * Centralized site URL resolver.
 *
 * Used by metadata, sitemap, robots, and JSON-LD so that every URL emitted by
 * the app points to a single, stable canonical origin — critical for SEO.
 *
 * Resolution order (first non-empty wins):
 *   1. NEXT_PUBLIC_SITE_URL — set this in Vercel env vars ONLY after you point
 *      a custom domain (e.g. https://pixquish.app). On free tier, leave it unset.
 *   2. VERCEL_PROJECT_PRODUCTION_URL — Vercel's stable production subdomain
 *      (e.g. pixquish.vercel.app). Available on every deployment (preview +
 *      production), so canonical stays consistent even when a preview URL is
 *      crawled. This is the key env var for the free-tier case.
 *   3. VERCEL_URL — the current deployment URL (preview/unique). Fallback so
 *      things keep working in edge cases, but #2 is preferred for stability.
 *   4. https://pixquish.app — hardcoded fallback for local dev only.
 *
 * Free-tier users: deploy and you're done. No env vars required.
 */
function buildSiteUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    process.env.VERCEL_URL ||
    "https://pixquish.app";
  // Strip any leading protocol, then enforce https.
  return `https://${raw.replace(/^https?:\/\//i, "").replace(/\/+$/, "")}`;
}

/** The canonical site origin (no trailing slash). e.g. https://pixquish.vercel.app */
export const siteUrl = buildSiteUrl();
