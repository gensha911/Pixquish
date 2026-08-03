"use client";

import * as React from "react";
import { Loader2, Eye, ArrowRight } from "lucide-react";
import { ComparisonSlider } from "./comparison-slider";
import { formatBytes } from "@/lib/compression";
import type { ResizeResult } from "@/lib/compression/resizer";
import { cn } from "@/lib/utils";

interface ResizePreviewProps {
  preview: ResizeResult | null;
  isGenerating: boolean;
  alt: string;
  backgroundColor?: string | null;
  hasTransparency?: boolean;
  /** Show rule-of-thirds grid overlay on the preview */
  showGrid?: boolean;
}

/** Rule-of-thirds grid overlay using inline SVG with a proper viewBox.
 *  Dual-color lines (white + dark shadow) ensure visibility on any image background. */
function RuleOfThirdsGrid() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-10"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 300 300"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 h-full w-full"
      >
        {/* Dark shadow lines (slightly thicker for visibility) */}
        <line x1={100} y1={0} x2={100} y2={300} stroke="rgba(0,0,0,0.5)" strokeWidth={2} />
        <line x1={200} y1={0} x2={200} y2={300} stroke="rgba(0,0,0,0.5)" strokeWidth={2} />
        <line x1={0} y1={100} x2={300} y2={100} stroke="rgba(0,0,0,0.5)" strokeWidth={2} />
        <line x1={0} y1={200} x2={300} y2={200} stroke="rgba(0,0,0,0.5)" strokeWidth={2} />
        {/* White dashed lines on top */}
        <line x1={100} y1={0} x2={100} y2={300} stroke="rgba(255,255,255,0.7)" strokeWidth={1} strokeDasharray="8 6" />
        <line x1={200} y1={0} x2={200} y2={300} stroke="rgba(255,255,255,0.7)" strokeWidth={1} strokeDasharray="8 6" />
        <line x1={0} y1={100} x2={300} y2={100} stroke="rgba(255,255,255,0.7)" strokeWidth={1} strokeDasharray="8 6" />
        <line x1={0} y1={200} x2={300} y2={200} stroke="rgba(255,255,255,0.7)" strokeWidth={1} strokeDasharray="8 6" />
      </svg>
    </div>
  );
}

export function ResizePreview({ preview, isGenerating, alt, backgroundColor, hasTransparency, showGrid }: ResizePreviewProps) {
  if (isGenerating && !preview) {
    return (
      <div className="flex h-40 items-center justify-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin text-brand" />
        <span>Generating preview…</span>
      </div>
    );
  }

  if (!preview) {
    return (
      <div className="flex h-24 items-center justify-center text-sm text-muted-foreground">
        Set dimensions above to see a preview
      </div>
    );
  }

  const sizeDiff = preview.size - preview.originalSize;
  const sizeChanged = Math.abs(sizeDiff) > 100; // > 100 bytes

  return (
    <div className="space-y-2.5">
      {/* LIVE badge + comparison slider */}
      <div className="relative overflow-hidden rounded-xl">
        <span className="absolute top-2 left-2 z-30 flex items-center gap-1 rounded-md border border-brand/40 bg-brand/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm backdrop-blur">
          <Eye className="size-3" />
          Live
        </span>
        <ComparisonSlider
          beforeSrc={preview.originalUrl}
          afterSrc={preview.url}
          alt={alt}
          beforeLabel="Original"
          afterLabel="Preview"
          backgroundColor={backgroundColor}
          hasTransparency={hasTransparency}
        />
        {/* Rule-of-thirds grid overlay — preview only, never exported */}
        {showGrid && <RuleOfThirdsGrid />}
      </div>

      {/* Stats row */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
        <span className="text-muted-foreground">
          {preview.originalWidth}×{preview.originalHeight}
        </span>
        <ArrowRight className="size-3 text-brand" />
        <span className="font-semibold tabular-nums text-brand">
          {preview.width}×{preview.height}
        </span>
        <span className="text-muted-foreground">
          {formatBytes(preview.size)}
        </span>
        {sizeChanged && (
          <span
            className={cn(
              "font-medium tabular-nums",
              sizeDiff < 0 ? "text-emerald-500" : "text-amber-500",
            )}
          >
            {sizeDiff < 0 ? "" : "+"}
            {formatBytes(Math.abs(sizeDiff))}
          </span>
        )}
        {isGenerating && (
          <span className="ml-auto flex items-center gap-1 text-muted-foreground">
            <Loader2 className="size-3 animate-spin" />
            Updating…
          </span>
        )}
      </div>
    </div>
  );
}
