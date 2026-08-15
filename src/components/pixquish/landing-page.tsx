import * as React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  ChevronRight,
  ShieldCheck,
  Upload,
  Maximize2,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { siteUrl } from "@/lib/site-url";
import { getAllPosts } from "@/lib/blog";
import {
  getRelatedLandingPages,
  getLandingPagePath,
  type LandingPage,
} from "@/lib/landing-pages";

interface LandingPageViewProps {
  data: LandingPage;
}

/**
 * Shared server-rendered view for a single landing page (compress or resize).
 * Renders hero, breadcrumb, why-use grid, how-to steps, optional specs table,
 * FAQ accordion, CTA band, and internal-links footer. Emits four JSON-LD
 * blocks (SoftwareApplication, HowTo, FAQPage, BreadcrumbList).
 */
export function LandingPageView({ data }: LandingPageViewProps) {
  const isCompress = data.type === "compress";
  const indexPath = isCompress ? "/compress" : "/resize";
  const indexLabel = isCompress ? "Compress" : "Resize";
  const pageUrl = `${siteUrl}${getLandingPagePath(data)}`;

  // Build the related-articles list from blog slugs declared on the page.
  const allPosts = getAllPosts();
  const relatedArticles = (data.relatedBlogSlugs ?? [])
    .map((slug) => allPosts.find((p) => p.slug === slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  // Sibling landing pages for the "Related tools" footer.
  const siblings = getRelatedLandingPages(data.type, data.slug);

  // ── JSON-LD: SoftwareApplication ─────────────────────────────────────
  const softwareAppSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Pixquish",
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Web",
    url: siteUrl,
    description:
      "Free, private, in-browser image compressor and resizer. Compress JPG, PNG, WebP, and AVIF, or resize images to exact dimensions for any social platform — nothing is uploaded.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "Best Quality / Balanced / Max Compress modes",
      "Target file size",
      "Format selection (auto, PNG, JPG, WebP, AVIF, original)",
      "Resize presets for Instagram, YouTube, Twitter, Facebook, LinkedIn",
      "Cover, Contain, and Stretch fit modes",
      "100% client-side — no uploads",
    ],
  };

  // ── JSON-LD: HowTo ───────────────────────────────────────────────────
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: data.h1,
    description: data.heroLead,
    totalTime: "PT2M",
    supply: [
      {
        "@type": "HowToSupply",
        name:
          isCompress
            ? "An image file (JPG, PNG, WebP, or AVIF)"
            : "An image file to resize",
      },
    ],
    tool: [
      {
        "@type": "HowToTool",
        name: "Pixquish (free, in-browser)",
      },
    ],
    step: data.howToSteps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.name,
      text: step.text,
      url: `${pageUrl}#how-to-step-${index + 1}`,
    })),
  };

  // ── JSON-LD: FAQPage ──────────────────────────────────────────────────
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: data.faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };

  // ── JSON-LD: BreadcrumbList ──────────────────────────────────────────
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      {
        "@type": "ListItem",
        position: 2,
        name: indexLabel,
        item: `${siteUrl}${indexPath}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: data.h1,
        item: pageUrl,
      },
    ],
  };

  return (
    <main className="min-h-screen">
      {/* JSON-LD structured data — emitted as raw script tags */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section
        id="top"
        className="relative overflow-hidden border-b border-border/60"
      >
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 ambient-glow" />
          <div className="absolute inset-0 bg-grid mask-fade-b" />
        </div>

        <div className="relative mx-auto max-w-4xl px-4 pb-16 pt-20 sm:px-6 md:pb-20 md:pt-24 lg:px-8">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
            <Sparkles className="size-3.5 text-brand" />
            {data.platform
              ? `${data.platform} image resizer`
              : `${data.format?.toUpperCase()} compressor`}
          </span>

          <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
            {data.h1}
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
            {data.heroLead}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              asChild
              size="lg"
              className="h-12 rounded-full border-transparent bg-brand-gradient px-8 text-base text-white shadow-lg glow-brand hover:bg-brand-gradient hover:opacity-95"
            >
              <Link href={`/${data.ctaHref}`}>
                {isCompress ? (
                  <Upload className="size-4" />
                ) : (
                  <Maximize2 className="size-4" />
                )}
                {data.ctaLabel}
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 rounded-full px-8 text-base"
            >
              <a href="#how-to">How it works</a>
            </Button>
          </div>

          {/* Trust row */}
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="size-4 text-brand" />
              100% private — no uploads
            </span>
            <span aria-hidden className="hidden text-border sm:inline">
              ·
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Sparkles className="size-4 text-brand" />
              Free, no sign-up
            </span>
            <span aria-hidden className="hidden text-border sm:inline">
              ·
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Check className="size-4 text-brand" />
              JPG · PNG · WebP · AVIF
            </span>
          </div>
        </div>
      </section>

      {/* ── Breadcrumb bar ─────────────────────────────────────────────────── */}
      <nav
        aria-label="Breadcrumb"
        className="border-b border-border/60 bg-card/30"
      >
        <ol className="mx-auto flex max-w-6xl items-center gap-1.5 px-4 py-3 text-xs text-muted-foreground sm:px-6 lg:px-8">
          <li>
            <Link
              href="/"
              className="transition-colors hover:text-foreground"
            >
              Home
            </Link>
          </li>
          <li aria-hidden>
            <ChevronRight className="size-3" />
          </li>
          <li>
            <Link
              href={indexPath}
              className="transition-colors hover:text-foreground"
            >
              {indexLabel}
            </Link>
          </li>
          <li aria-hidden>
            <ChevronRight className="size-3" />
          </li>
          <li aria-current="page" className="font-medium text-foreground">
            {data.format?.toUpperCase() ||
              data.platform ||
              data.slug.replace(/-/g, " ")}
          </li>
        </ol>
      </nav>

      {/* ── Why use ───────────────────────────────────────────────────────── */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Why use Pixquish to{" "}
              {isCompress ? "compress" : "resize"}{" "}
              {data.format?.toUpperCase() ||
                (data.platform ? `${data.platform} images` : "")}
              ?
            </h2>
            <p className="mt-3 text-base text-muted-foreground sm:text-lg">
              {isCompress
                ? "Built for privacy, quality, and exact-size targets — all in your browser."
                : `Built for exact dimensions, sharp results, and full crop control — all in your browser.`}
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-2">
            {data.whyUse.map((point) => (
              <Card
                key={point.title}
                className="bg-card/50 backdrop-blur-sm transition-colors hover:border-brand/40"
              >
                <CardHeader>
                  <CardTitle className="text-base font-semibold">
                    {point.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed text-muted-foreground">
                    {point.body}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── How to ────────────────────────────────────────────────────────── */}
      <section
        id="how-to"
        className="border-y border-border/60 bg-card/30 py-12 md:py-16"
      >
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              How to{" "}
              {isCompress ? `compress a ${data.format?.toUpperCase()}` : "do it"}
              {isCompress ? "" : " — step by step"}
            </h2>
            <p className="mt-3 text-base text-muted-foreground sm:text-lg">
              {isCompress
                ? `Five steps in your browser. No uploads, no sign-up.`
                : `Five steps in your browser. No uploads, no sign-up.`}
            </p>
          </div>

          <ol className="mt-10 flex flex-col gap-6">
            {data.howToSteps.map((step, index) => (
              <li
                key={step.name}
                id={`how-to-step-${index + 1}`}
                className="flex gap-4"
              >
                <span
                  aria-hidden
                  className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-gradient text-sm font-semibold text-white shadow-sm"
                >
                  {index + 1}
                </span>
                <div className="flex-1 pt-0.5">
                  <h3 className="text-base font-semibold">{step.name}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {step.text}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-10 text-center">
            <Button
              asChild
              size="lg"
              className="h-11 rounded-full border-transparent bg-brand-gradient px-7 text-sm text-white shadow-lg glow-brand hover:bg-brand-gradient hover:opacity-95"
            >
              <Link href={`/${data.ctaHref}`}>
                {data.ctaLabel}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── Specs table (resize pages only) ───────────────────────────────── */}
      {data.specs && data.specs.length > 0 ? (
        <section className="py-12 md:py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                {data.platform} dimensions & specs
              </h2>
              <p className="mt-3 text-base text-muted-foreground sm:text-lg">
                Everything you need to know about the{" "}
                {data.platform?.toLowerCase()} size requirements.
              </p>
            </div>

            <div className="mt-8 overflow-hidden rounded-xl border border-border bg-card/50">
              <Table>
                <TableHeader>
                  <TableRow className="border-border bg-muted/40 hover:bg-muted/40">
                    <TableCell className="font-semibold text-foreground">
                      Spec
                    </TableCell>
                    <TableCell className="font-semibold text-foreground">
                      Value
                    </TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.specs.map((spec) => (
                    <TableRow key={spec.label}>
                      <TableCell className="text-muted-foreground">
                        {spec.label}
                      </TableCell>
                      <TableCell className="font-medium text-foreground">
                        {spec.value}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {data.targetDimensions ? (
              <p className="mt-4 text-center text-xs text-muted-foreground">
                Pixquish presets the canvas to exactly{" "}
                <span className="font-medium text-foreground">
                  {data.targetDimensions.width} ×{" "}
                  {data.targetDimensions.height}
                  {data.targetDimensions.unit}
                </span>{" "}
                for this platform.
              </p>
            ) : null}
          </div>
        </section>
      ) : null}

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <section id="faq" className="py-12 md:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              {data.format?.toUpperCase() || data.platform} FAQ
            </h2>
            <p className="mt-3 text-base text-muted-foreground sm:text-lg">
              Real questions, real answers — about the size, the format, and
              how Pixquish works.
            </p>
          </div>

          <div className="mt-10 rounded-2xl border border-border/70 bg-card/40 p-2">
            <Accordion type="single" collapsible className="w-full">
              {data.faqs.map((entry, index) => (
                <AccordionItem
                  key={entry.question}
                  value={`faq-${index + 1}`}
                  className="px-4"
                >
                  <AccordionTrigger className="text-left text-base font-medium hover:no-underline">
                    {entry.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                    {entry.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* ── CTA band ───────────────────────────────────────────────────────── */}
      <section className="border-t border-border/60">
        <div className="relative overflow-hidden bg-brand-gradient">
          <div className="relative mx-auto max-w-5xl px-4 py-14 text-center sm:px-6 md:py-20 lg:px-8">
            <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl md:text-4xl">
              {isCompress
                ? `Compress your ${data.format?.toUpperCase()} now — free, private, in your browser`
                : `Resize your image for ${data.platform} now — free, private, in your browser`}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-white/90 sm:text-base">
              No sign-up. No upload. No watermark. Your images stay on your
              device the whole time.
            </p>
            <Button
              asChild
              size="lg"
              className="mt-7 h-12 rounded-full bg-white px-8 text-base text-foreground shadow-lg hover:bg-white hover:opacity-90"
            >
              <Link href={`/${data.ctaHref}`}>
                {data.ctaLabel}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── Internal links footer ─────────────────────────────────────────── */}
      <section className="border-t border-border/60 bg-card/30 py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 md:grid-cols-2">
            {/* Related tools (siblings) */}
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Related tools
              </h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {siblings.map((sib) => (
                  <li key={sib.slug}>
                    <Link
                      href={getLandingPagePath(sib)}
                      className="group block rounded-lg border border-border/60 bg-card/50 p-3 transition-all hover:border-brand/40 hover:bg-card/70 hover:shadow-sm"
                    >
                      <div className="text-sm font-medium transition-colors group-hover:text-brand">
                        {sib.format?.toUpperCase() ||
                          sib.h1.replace(/^Resize image for /, "")}
                      </div>
                      <div className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                        {sib.description}
                      </div>
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href={indexPath}
                    className="group block rounded-lg border border-dashed border-border/60 bg-card/30 p-3 transition-all hover:border-brand/40 hover:bg-card/70"
                  >
                    <div className="text-sm font-medium transition-colors group-hover:text-brand">
                      All {indexLabel.toLowerCase()} tools →
                    </div>
                    <div className="mt-0.5 text-xs text-muted-foreground">
                      Browse every {indexLabel.toLowerCase()} page
                    </div>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Related articles (if any) */}
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Related articles
              </h2>
              {relatedArticles.length === 0 ? (
                <ul className="mt-4 grid gap-3">
                  <li>
                    <Link
                      href="/blog"
                      className="group block rounded-lg border border-border/60 bg-card/50 p-3 transition-all hover:border-brand/40 hover:bg-card/70 hover:shadow-sm"
                    >
                      <div className="text-sm font-medium transition-colors group-hover:text-brand">
                        Browse the Pixquish blog →
                      </div>
                      <div className="mt-0.5 text-xs text-muted-foreground">
                        Guides on formats, compression modes, and image sizes.
                      </div>
                    </Link>
                  </li>
                </ul>
              ) : (
                <ul className="mt-4 grid gap-3">
                  {relatedArticles.map((post) => (
                    <li key={post.slug}>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="group block rounded-lg border border-border/60 bg-card/50 p-3 transition-all hover:border-brand/40 hover:bg-card/70 hover:shadow-sm"
                      >
                        <div className="text-sm font-medium transition-colors group-hover:text-brand">
                          {post.title}
                        </div>
                        <div className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                          {post.description}
                        </div>
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link
                      href="/blog"
                      className="group block rounded-lg border border-dashed border-border/60 bg-card/30 p-3 transition-all hover:border-brand/40 hover:bg-card/70"
                    >
                      <div className="text-sm font-medium transition-colors group-hover:text-brand">
                        All articles →
                      </div>
                      <div className="mt-0.5 text-xs text-muted-foreground">
                        More guides on image optimization
                      </div>
                    </Link>
                  </li>
                </ul>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
