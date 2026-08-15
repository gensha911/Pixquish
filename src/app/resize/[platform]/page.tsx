import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Navbar } from "@/components/pixquish/navbar";
import { Footer } from "@/components/pixquish/footer";
import { LandingPageView } from "@/components/pixquish/landing-page";
import { siteUrl } from "@/lib/site-url";
import {
  getLandingPage,
  getSlugsByType,
  getResizePages,
} from "@/lib/landing-pages";

interface PageProps {
  params: Promise<{ platform: string }>;
}

/** Pre-render all resize landing pages at build time. */
export async function generateStaticParams() {
  return getSlugsByType("resize").map((platform) => ({ platform }));
}

/** Per-page metadata for SEO. */
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { platform } = await params;
  const page = getLandingPage("resize", platform);
  if (!page) return {};

  const url = `${siteUrl}/resize/${platform}`;
  return {
    title: page.title,
    description: page.description,
    keywords: [
      page.keyword,
      `${page.platform?.toLowerCase()} image size`,
      "image resizer",
      "free image resizer",
      "online image resizer",
      "private image resizer",
      "browser image resizer",
    ],
    alternates: { canonical: url },
    openGraph: {
      title: page.title,
      description: page.description,
      url,
      type: "website",
      siteName: "Pixquish",
      images: [
        {
          url: "/og-image.png",
          width: 1344,
          height: 768,
          alt: page.h1,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.description,
      images: ["/og-image.png"],
    },
    robots: { index: true, follow: true },
  };
}

export default async function ResizePlatformPage({ params }: PageProps) {
  const { platform } = await params;
  const page = getLandingPage("resize", platform);
  if (!page) notFound();

  // Pre-render all resize sibling URLs as <link rel="prefetch"> so the
  // first hop between resize pages is instant.
  const siblings = getResizePages();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <LandingPageView data={page} />
      {/* Prefetch hints for sibling landing pages */}
      {siblings.map((sib) => (
        <link
          key={sib.slug}
          rel="prefetch"
          href={`/resize/${sib.slug}`}
          as="document"
        />
      ))}
      <Footer />
    </div>
  );
}
