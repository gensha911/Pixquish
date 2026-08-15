import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Maximize2 } from "lucide-react";

import { Navbar } from "@/components/pixquish/navbar";
import { Footer } from "@/components/pixquish/footer";
import { siteUrl } from "@/lib/site-url";
import { getResizePages } from "@/lib/landing-pages";

export const metadata: Metadata = {
  title: "Resize images for any platform — Instagram, YouTube, Twitter | Pixquish",
  description:
    "Resize images to exact platform dimensions: Instagram Post (1080×1080), Instagram Story (1080×1920), YouTube Thumbnail (1280×720), Twitter Header (1500×500), Facebook Cover, LinkedIn Banner.",
  alternates: { canonical: `${siteUrl}/resize` },
  openGraph: {
    title: "Resize images for any platform | Pixquish",
    description:
      "Resize images to exact platform dimensions: Instagram, YouTube, Twitter, Facebook, LinkedIn. Free, private, in-browser.",
    url: `${siteUrl}/resize`,
    type: "website",
    siteName: "Pixquish",
  },
  twitter: {
    card: "summary",
    title: "Resize images for any platform | Pixquish",
    description:
      "Resize images to exact platform dimensions: Instagram, YouTube, Twitter, Facebook, LinkedIn. Free, private, in-browser.",
  },
  robots: { index: true, follow: true },
};

export default function ResizeIndexPage() {
  const pages = getResizePages();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-border/60">
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 ambient-glow" />
            <div className="absolute inset-0 bg-grid mask-fade-b" />
          </div>

          <div className="relative mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 md:py-24 lg:px-8">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
              <Maximize2 className="size-3.5 text-brand" />
              Resize by platform
            </span>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
              Resize images for any platform
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
              Pick a platform below for a dedicated resizer page — exact
              dimensions, aspect ratio, file size tips, and how-to steps.
            </p>
            <p className="mx-auto mt-2 max-w-2xl text-sm text-muted-foreground">
              All resizing runs in your browser. Your images never touch a
              server.
            </p>
          </div>
        </section>

        {/* Platform grid */}
        <section className="py-12 md:py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {pages.map((page) => (
                <li key={page.slug}>
                  <Link
                    href={`/resize/${page.slug}`}
                    className="group flex h-full flex-col rounded-2xl border border-border/70 bg-card/50 p-6 backdrop-blur-sm transition-all hover:border-brand/40 hover:bg-card/70 hover:shadow-md sm:p-7"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                          {page.platform}
                        </div>
                        <h2 className="mt-1 text-lg font-semibold tracking-tight transition-colors group-hover:text-brand">
                          {page.targetDimensions
                            ? `${page.targetDimensions.width}×${page.targetDimensions.height}`
                            : page.h1}
                        </h2>
                      </div>
                      <ArrowRight className="mt-1 size-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-brand" />
                    </div>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {page.h1}
                    </p>
                    <div className="mt-5 flex flex-wrap gap-1.5">
                      <span className="rounded-md bg-brand-muted/60 px-2 py-0.5 text-[11px] font-medium text-brand">
                        {page.keyword}
                      </span>
                      <span className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                        Free · Private
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-border/60 bg-card/30">
          <div className="mx-auto max-w-3xl px-4 py-12 text-center sm:px-6 md:py-16 lg:px-8">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Need a custom size?
            </h2>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              Open the resizer and pick from 20+ presets or set custom width
              and height in pixels.
            </p>
            <Link
              href="/#resize"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-gradient px-6 py-3 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
            >
              Open the resizer
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
