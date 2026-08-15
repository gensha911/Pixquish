import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { format } from "date-fns";
import { getAllSlugs, getPostBySlug } from "@/lib/blog";
import { siteUrl } from "@/lib/site-url";
import { rehypeAutoLinkKeywords } from "@/lib/blog-auto-link";

interface PageProps {
  params: Promise<{ slug: string }>;
}

/** Static params — pre-render all blog slugs at build time. */
export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

/** Per-article metadata for SEO. */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  const url = `${siteUrl}/blog/${slug}`;
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.description,
      url,
      type: "article",
      siteName: "Pixquish",
      publishedTime: post.datePublished,
      modifiedTime: post.dateModified,
      authors: [post.author],
      tags: post.tags,
      images: [
        {
          url: post.image,
          width: 1344,
          height: 768,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [post.image],
    },
    robots: { index: true, follow: true },
  };
}

export default async function BlogArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  // BlogPosting structured data for Google rich results
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    image: [`${siteUrl}${post.image}`],
    datePublished: post.datePublished,
    dateModified: post.dateModified,
    author: {
      "@type": "Organization",
      name: post.author,
      url: siteUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "Pixquish",
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/og-image.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteUrl}/blog/${post.slug}`,
    },
    keywords: post.tags.join(", "),
    articleSection: "Image Optimization",
  };

  // Breadcrumb schema for this article
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${siteUrl}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: `${siteUrl}/blog/${post.slug}` },
    ],
  };

  return (
    <main className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Article header */}
      <article>
        <header className="border-b border-border/60 bg-gradient-to-b from-brand-muted/30 to-background">
          <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-4" />
              All articles
            </Link>

            <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
              <time dateTime={post.date}>
                {format(new Date(post.date), "MMM d, yyyy")}
              </time>
              <span aria-hidden>·</span>
              <span className="inline-flex items-center gap-1">
                <Clock className="size-3" />
                {post.readingMinutes} min read
              </span>
            </div>

            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
              {post.title}
            </h1>
            <p className="mt-4 text-base text-muted-foreground sm:text-lg">
              {post.description}
            </p>

            {post.tags.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-1.5">
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
          </div>
        </header>

        {/* Article body */}
        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 md:py-14 lg:px-8">
          <div className="prose prose-pixquish">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[
                rehypeSlug,
                [rehypeAutolinkHeadings, { behavior: "wrap", properties: { className: ["heading-anchor"] } }],
                // Auto-link the first occurrence of each known keyword phrase
                // (e.g. "compress PNG", "YouTube thumbnail size") to the
                // matching programmatic landing page. Runs last so heading
                // anchors from rehype-slug/autolink-headings are already in
                // place and untouched. Injected <a> elements flow through the
                // components.a override below (Next.js Link for /-prefixed
                // URLs, target=_blank for external).
                rehypeAutoLinkKeywords,
              ]}
              components={{
                // Render links with proper Next.js Link for internal navigation
                // `node` is the HAST node from react-markdown/rehype — strip it
                // before spreading the rest onto the DOM element, otherwise it
                // leaks as node="[object Object]" in the rendered HTML.
                a: ({ href, children, node: _node, ...props }) => {
                  const isInternal = href?.startsWith("/") || href?.startsWith("#");
                  if (isInternal && href) {
                    return (
                      <Link href={href} {...props}>
                        {children}
                      </Link>
                    );
                  }
                  return (
                    <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
                      {children}
                    </a>
                  );
                },
                // Ensure images are responsive
                img: ({ src, alt, node: _node, ...props }) => (
                  <img src={src} alt={alt || ""} loading="lazy" {...props} />
                ),
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>

          {/* Article footer */}
          <div className="mt-12 border-t border-border/60 pt-8">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-4" />
              Back to all articles
            </Link>

            <div className="mt-8 rounded-2xl border border-brand/30 bg-brand-muted/20 p-6 text-center">
              <h2 className="text-lg font-semibold">
                Try it yourself — free, private, in your browser
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Compress or resize your images with Pixquish. No uploads, no sign-up.
              </p>
              <Link
                href="/#workspace"
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-brand-gradient px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
              >
                Open Pixquish
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </article>
    </main>
  );
}
