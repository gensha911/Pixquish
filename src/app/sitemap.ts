import { MetadataRoute } from 'next';

// Dynamically resolves to Vercel subdomain or custom domain.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL
  ? `https://${(process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL).replace(/^https?:\/\//, "")}`
  : 'https://compressx.app';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
  ];
}
