"use client";

import * as React from "react";
import { Gauge, ShieldCheck } from "lucide-react";
import { ThemeToggle } from "@/components/compressx/theme-toggle";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "#workspace", label: "Compress" },
  { href: "#resize", label: "Resize" },
  { href: "#features", label: "Features" },
  { href: "#faq", label: "FAQ" },
] as const;

export function Navbar({ className }: { className?: string }) {
  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full glass border-b border-border/50 animate-fade-in-down",
        className,
      )}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8"
      >
        {/* Brand */}
        <a
          href="#top"
          className="flex items-center gap-2.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <span className="flex size-8 items-center justify-center rounded-xl bg-brand-gradient shadow-sm">
            <Gauge className="size-4 text-white" />
          </span>
          <span className="font-semibold tracking-tight text-foreground">
            CompressX
          </span>
        </a>

        {/* Center nav links (md+) */}
        <div className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right cluster */}
        <div className="flex items-center gap-2">
          <span className="hidden items-center gap-1.5 rounded-full border border-border/60 bg-card/40 px-3 py-1 text-xs text-muted-foreground lg:inline-flex">
            <ShieldCheck className="size-3.5 text-brand" />
            100% Private
          </span>

          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}