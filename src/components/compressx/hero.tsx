"use client";

import * as React from "react";
import {
  ArrowRight,
  FileImage,
  Gauge,
  Maximize2,
  ShieldCheck,
  Sparkles,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      {/* Decorative background layers */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 ambient-glow" />
        <div className="absolute inset-0 bg-grid mask-fade-b" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 pb-8 pt-20 text-center sm:px-6 md:pb-12 md:pt-24 lg:px-8">
        {/* Announcement pill */}
        <div className="animate-fade-in-up flex justify-center" style={{ animationDelay: "0ms" }}>
          <span className="glass inline-flex items-center gap-1.5 rounded-full border border-border/60 px-4 py-1.5 text-xs font-medium text-foreground/80">
            <Sparkles className="size-3.5 text-brand" />
            Smart, private, in-browser image tools
          </span>
        </div>

        {/* Headline */}
        <h1
          className="animate-fade-in-up mx-auto mt-5 max-w-4xl text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl"
          style={{ animationDelay: "60ms" }}
        >
          Compress & Resize Images in{" "}
          <span className="text-brand-gradient">Seconds</span>
        </h1>

        {/* Subtitle */}
        <p
          className="animate-fade-in-up mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg"
          style={{ animationDelay: "120ms" }}
        >
          Compress, resize, and convert images — all in your browser, zero uploads.
        </p>

        {/* CTAs */}
        <div
          className="animate-fade-in-up mt-8 flex flex-col justify-center gap-3 sm:flex-row"
          style={{ animationDelay: "180ms" }}
        >
          <Button
            asChild
            size="lg"
            className="h-12 rounded-full border-transparent bg-brand-gradient px-8 text-base text-white shadow-lg glow-brand hover:bg-brand-gradient hover:opacity-95"
          >
            <a href="#workspace">
              <Upload className="size-4" />
              Compress Images
            </a>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="h-12 rounded-full px-8 text-base"
          >
            <a href="#resize">
              <Maximize2 className="size-4" />
              Resize Images
            </a>
          </Button>
        </div>

        {/* Trust row */}
        <div
          className="animate-fade-in-up mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground"
          style={{ animationDelay: "240ms" }}
        >
          <span className="inline-flex items-center gap-1.5">
            <Gauge className="size-4 text-brand" />
            Up to 80% smaller
          </span>
          <span aria-hidden className="hidden text-border sm:inline">
            ·
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Maximize2 className="size-4 text-brand" />
            Resize to any dimension
          </span>
          <span aria-hidden className="hidden text-border sm:inline">
            ·
          </span>
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="size-4 text-brand" />
            Zero uploads
          </span>
          <span aria-hidden className="hidden text-border sm:inline">
            ·
          </span>
          <span className="inline-flex items-center gap-1.5">
            <FileImage className="size-4 text-brand" />
            JPG · PNG · WebP · AVIF
          </span>
        </div>
      </div>
    </section>
  );
}