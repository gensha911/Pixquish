import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, FileImage } from "lucide-react";

import { Navbar } from "@/components/pixquish/navbar";
import { Footer } from "@/components/pixquish/footer";
import { siteUrl } from "@/lib/site-url";
import { getCompressPages } from "@/lib/landing-pages";

export const metadata: Metadata = {
  title: "Compress images by format — JPG, PNG, WebP, AVIF | Pixquish",
  description:
    "Compress JPG, PNG, WebP, or AVIF images in your browser. Free, private, no uploads. Choose a format to see exactly how Pixquish shrinks it.",
  alternates: { canonical: `${siteUrl}/compress` },
  openGraph: {
    title: "Compress images by format | Pixquish",
    description:
      "Compress JPG, PNG, WebP, or AVIF images in your browser. Free, private, no uploads.",
    url: `${siteUrl}/compress`,
    type: "website",
    siteName: "Pixquish",
  },
  twitter: {
    card: "summary",
    title: "Compress images by format | Pixquish",
    description:
      "Compress JPG, PNG, WebP, or AVIF images in your browser. Free, private, no uploads.",
  },
  robots: { index: true, follow: true },
};

export default function CompressIndexPage() {
  const pages = getCompressPages();

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
              <FileImage className="size-3.5 text-brand" />
              Compress by format
            </span>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
              Compress images by format
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
              Pick a format below for a dedicated compressor page — exact
              mode recommendations, target file sizes, and answers to the
              questions people ask about that format.
            </p>
            <p className="mx-auto mt-2 max-w-2xl text-sm text-muted-foreground">
              All compression runs in your browser. Your images never touch a
              server.
            </p>
          </div>
        </section>

        {/* Format grid */}
        <section className="py-12 md:py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-2">
              {pages.map((page) => (
                <li key={page.slug}>
                  <Link
                    href={`/compress/${page.slug}`}
                    className="group flex h-full flex-col rounded-2xl border border-border/70 bg-card/50 p-6 backdrop-blur-sm transition-all hover:border-brand/40 hover:bg-card/70 hover:shadow-md sm:p-7"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="text-xl font-semibold tracking-tight transition-colors group-hover:text-brand sm:text-2xl">
                        {page.h1}
                      </h2>
                      <ArrowRight className="mt-1 size-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-brand" />
                    </div>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {page.description}
                    </p>
                    <div className="mt-5 flex flex-wrap gap-1.5">
                      <span className="rounded-md bg-brand-muted/60 px-2 py-0.5 text-[11px] font-medium text-brand">
                        {page.keyword}
                      </span>
                      <span className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                        Free · Private · In-browser
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
              Not sure which format you need?
            </h2>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              Open the compressor and Pixquish will pick the best output format
              for each image automatically.
            </p>
            <Link
              href="/#workspace"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-gradient px-6 py-3 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
            >
              Open the compressor
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
