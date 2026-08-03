import type { MetadataRoute } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL
  ? `https://${(process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL).replace(/^https?:\/\//, "")}`
  : 'https://pixquish.app';

export default function robots(): MetadataRoute {
  return {
    rules: [
      { userAgent: 'Googlebot', allow: '/' },
      { userAgent: 'Bingbot', allow: '/' },
      { userAgent: 'Twitterbot', allow: '/' },
      { userAgent: 'facebookexternalhit', allow: '/' },
      { userAgent: '*', allow: '/' },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
