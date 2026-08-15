import Link from "next/link";
import { Gauge } from "lucide-react";

import { cn } from "@/lib/utils";
import { getCompressPages, getResizePages, getLandingPagePath } from "@/lib/landing-pages";

/** Title-case a slug like "instagram-post" → "Instagram Post". */
function titleCase(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

interface FooterLink {
  label: string;
  href: string;
  /** Whether the href is an internal route (uses Next.js Link) or a hash/external URL (uses plain <a>). */
  isRoute?: boolean;
}

interface FooterLinkGroup {
  title: string;
  links: FooterLink[];
}

const FOOTER_LINK_GROUPS: FooterLinkGroup[] = [
  {
    title: "Product",
    links: [
      { label: "Compress", href: "#workspace" },
      { label: "Resize", href: "#resize" },
      { label: "Features", href: "#features" },
      { label: "FAQ", href: "#faq" },
    ],
  },
  {
    title: "Compress",
    links: getCompressPages().map((page) => ({
      label: page.format ? page.format.toUpperCase() : page.slug,
      href: getLandingPagePath(page),
      isRoute: true,
    })),
  },
  {
    title: "Resize",
    links: getResizePages().map((page) => ({
      label: titleCase(page.slug),
      href: getLandingPagePath(page),
      isRoute: true,
    })),
  },
  {
    title: "Resources",
    links: [
      { label: "How it works", href: "#how-it-works" },
      { label: "Guide", href: "#guide" },
      { label: "Blog", href: "/blog", isRoute: true },
      { label: "Privacy", href: "/privacy", isRoute: true },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "GitHub", href: "https://github.com/gensha911" },
      { label: "Contact", href: "mailto:gensha911@gmail.com" },
    ],
  },
];
export function Footer({ className }: { className?: string }) {
  return (
    <footer
      className={cn("mt-auto border-t border-border/60 bg-background", className)}
    >
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          {/* Brand block */}
          <div className="col-span-2 md:col-span-1">
            <a
              href="#top"
              className="inline-flex items-center gap-2.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <span className="flex size-8 items-center justify-center rounded-xl bg-brand-gradient shadow-sm">
                <Gauge className="size-4 text-white" />
              </span>
              <span className="font-semibold tracking-tight text-foreground">
                Pixquish
              </span>
            </a>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              Compress and resize images, privately in your browser.
            </p>
          </div>

          {/* Link columns */}
          {FOOTER_LINK_GROUPS.map((group) => (
            <nav
              key={group.title}
              aria-label={group.title}
              className="flex flex-col gap-3"
            >
              <h3 className="text-sm font-semibold text-foreground">
                {group.title}
              </h3>
              <ul className="flex flex-col gap-2.5">
                {group.links.map((link) => (
                  <li key={link.label}>
                    {link.isRoute ? (
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border/60 py-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} Pixquish. All rights reserved.</p>
          <p>Made with care · 100% client-side</p>
        </div>
      </div>
    </footer>
  );
}
