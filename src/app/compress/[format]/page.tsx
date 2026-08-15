import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Navbar } from "@/components/pixquish/navbar";
import { Footer } from "@/components/pixquish/footer";
import { LandingPageView } from "@/components/pixquish/landing-page";
import { siteUrl } from "@/lib/site-url";
import {
  getCompressPages,
  getLandingPage,
  getSlugsByType,
} from "@/lib/landing-pages";

interface PageProps {
  params: Promise<{ format: string }>;
}

/** Pre-render all compress landing pages at build time. */
export async function generateStaticParams() {
  return getSlugsByType("compress").map((format) => ({ format }));
}

/** Per-page metadata for SEO. */
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { format } = await params;
  const page = getLandingPage("compress", format);
  if (!page) return {};

  const url = `${siteUrl}/compress/${format}`;
  return {
    title: page.title,
    description: page.description,
    keywords: [
      page.keyword,
      `${page.format?.toLowerCase()} compressor`,
      "free image compressor",
      "online image compressor",
      "private image compressor",
      "browser image compressor",
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

export default async function CompressFormatPage({ params }: PageProps) {
  const { format } = await params;
  const page = getLandingPage("compress", format);
  if (!page) notFound();

  // Pre-render all compress sibling URLs as <link rel="prefetch"> so the
  // first hop between compress pages is instant.
  const siblings = getCompressPages();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <LandingPageView data={page} />
      {/* Prefetch hints for sibling landing pages */}
      {siblings.map((sib) => (
        <link
          key={sib.slug}
          rel="prefetch"
          href={`/compress/${sib.slug}`}
          as="document"
        />
      ))}
      <Footer />
    </div>
  );
}
