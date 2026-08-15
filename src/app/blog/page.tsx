import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import { getAllPosts } from "@/lib/blog";
import { format } from "date-fns";

export const metadata: Metadata = {
  title: "Blog — Image Compression & Resizing Guides",
  description:
    "Practical guides on image compression, resizing, formats (PNG, WebP, AVIF), and social media image sizes. Learn how to reduce file sizes without losing quality.",
  alternates: {
    canonical: `/blog`,
  },
  openGraph: {
    title: "Blog — Image Compression & Resizing Guides · Pixquish",
    description:
      "Practical guides on image compression, resizing, formats (PNG, WebP, AVIF), and social media image sizes.",
    url: `/blog`,
    type: "website",
    siteName: "Pixquish",
  },
  twitter: {
    card: "summary",
    title: "Blog — Image Compression & Resizing Guides · Pixquish",
    description:
      "Practical guides on image compression, resizing, formats, and social media image sizes.",
  },
  robots: { index: true, follow: true },
};

export default function BlogListPage() {
  const posts = getAllPosts();

  return (
    <main className="min-h-screen">
      {/* Header */}
      <section className="border-b border-border/60 bg-gradient-to-b from-brand-muted/30 to-background">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
            Pixquish Blog
          </span>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
            Image guides &amp; tutorials
          </h1>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg">
            Practical guides on image compression, resizing, formats, and social
            media sizes — written to help you ship faster-loading images.
          </p>
        </div>
      </section>

      {/* Article list */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {posts.length === 0 ? (
            <p className="text-center text-muted-foreground">
              No articles yet. Check back soon.
            </p>
          ) : (
            <ul className="flex flex-col gap-6">
              {posts.map((post) => (
                <li key={post.slug}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group block rounded-2xl border border-border/70 bg-card/50 p-6 backdrop-blur-sm transition-all hover:border-brand/40 hover:bg-card/70 hover:shadow-md sm:p-7"
                  >
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      <time dateTime={post.date}>
                        {format(new Date(post.date), "MMM d, yyyy")}
                      </time>
                      <span aria-hidden>·</span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="size-3" />
                        {post.readingMinutes} min read
                      </span>
                    </div>
                    <h2 className="mt-2 text-xl font-semibold tracking-tight transition-colors group-hover:text-brand sm:text-2xl">
                      {post.title}
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
                      {post.description}
                    </p>
                    <div className="mt-4 flex items-center gap-1.5 text-sm font-medium text-brand">
                      Read article
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                    </div>
                    {post.tags.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border/60 bg-card/30">
        <div className="mx-auto max-w-3xl px-4 py-12 text-center sm:px-6 md:py-16 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Ready to compress or resize your images?
          </h2>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Free, private, and 100% browser-based — your images never leave your device.
          </p>
          <Link
            href="/#workspace"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-gradient px-6 py-3 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
          >
            Open Pixquish
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
