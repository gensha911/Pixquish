import { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/site-url';
import { getAllPosts } from '@/lib/blog';
import { getAllLandingPages, getLandingPagePath } from '@/lib/landing-pages';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/privacy`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // Landing-page index routes (compress + resize)
  const landingIndexRoutes: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/compress`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${siteUrl}/resize`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  // Programmatic landing pages (compress/[format] + resize/[platform])
  const landingRoutes: MetadataRoute.Sitemap = getAllLandingPages().map(
    (page) => ({
      url: `${siteUrl}${getLandingPagePath(page)}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    }),
  );

  // Dynamic blog article routes
  const posts = getAllPosts();
  const articleRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [
    ...staticRoutes,
    ...landingIndexRoutes,
    ...landingRoutes,
    ...articleRoutes,
  ];
}
