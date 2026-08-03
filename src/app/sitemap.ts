import { MetadataRoute } from 'next';

// Dynamically resolves to Vercel subdomain or custom domain.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL
  ? `https://${(process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL).replace(/^https?:\/\//, "")}`
  : 'https://pixquish.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    {
      url: siteUrl,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${siteUrl}/privacy`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];
}
