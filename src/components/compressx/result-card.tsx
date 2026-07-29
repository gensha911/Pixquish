"use client";

import * as React from "react";
import { Download, TrendingDown, Zap, Maximize2, FileType2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  formatBytes,
  formatDimensions,
  formatPercent,
  shortFormat,
} from "@/lib/compression";
import type { CompressionResult } from "@/lib/compression";

/** Determine the quality value label for the result card.
 *  "Lossless" is only shown when the compression was truly lossless:
 *  original was PNG (or other lossless format), output is PNG, and no resize happened.
 *  Format conversions (e.g. JPEG→PNG) are NOT lossless since the source was already lossy. */
function getQualityValue(result: CompressionResult): string {
  const resized = result.width !== result.analysis.width || result.height !== result.analysis.height;
  const isPngOutput = result.format === "image/png";
  const isLosslessOriginal = result.analysis.originalFormat === "image/png";

  if (isPngOutput && !resized && isLosslessOriginal) {
    return "Lossless";
  }

  if (isPngOutput && resized) {
    return "Resized";
  }

  // For PNG output from a lossy source, show Q100 to indicate no additional
  // quality loss beyond what the source already had.
  if (isPngOutput) {
    return "Q100";
  }

  // Lossy format (JPEG, WebP, AVIF)
  return `Q${Math.round(result.quality * 100)}`;
}

function getQualityHint(result: CompressionResult): string {
  const resized = result.width !== result.analysis.width || result.height !== result.analysis.height;
  const isPngOutput = result.format === "image/png";
  const isLosslessOriginal = result.analysis.originalFormat === "image/png";

  if (isPngOutput && !resized && isLosslessOriginal) {
    return "Mode: PNG";
  }

  if (isPngOutput && resized) {
    return "Mode: PNG (resized)";
  }

  if (isPngOutput) {
    return `Mode: PNG (from ${shortFormat(result.analysis.originalFormat)})`;
  }

  return `Mode: ${shortFormat(result.format)}`;
}

interface ResultCardProps {
  result: CompressionResult;
  fileName: string;
  className?: string;
}

function Stat({
  icon: Icon,
  label,
  value,
  hint,
  accent,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  hint?: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-lg border border-border/60 bg-card/40 p-3">
      <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        <Icon className="size-3" />
        {label}
      </div>
      <div
        className={cn(
          "mt-1 text-sm font-semibold tabular-nums",
          accent && "text-brand",
        )}
      >
        {value}
      </div>
      {hint && <div className="mt-0.5 text-[11px] text-muted-foreground">{hint}</div>}
    </div>
  );
}

export function ResultCard({ result, fileName, className }: ResultCardProps) {
  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = result.url;
    const base = fileName.replace(/\.[^.]+$/, "");
    const ext = shortFormat(result.format).toLowerCase();
    a.download = `${base}-compressx.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const improvement =
    result.loadImprovement >= 1.05
      ? `${result.loadImprovement.toFixed(1)}× faster load`
      : "Similar load time";

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {/* Headline savings */}
      <div className="flex items-center justify-between gap-3 rounded-xl border border-brand/30 bg-brand-muted/40 p-4">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <TrendingDown className="size-3.5 text-brand" />
            Space saved
          </div>
          <div className="mt-0.5 flex items-baseline gap-2">
            <span className="text-2xl font-bold tabular-nums text-brand">
              {formatPercent(result.savedPercent)}
            </span>
            <span className="text-sm text-muted-foreground tabular-nums">
              {formatBytes(result.savedBytes)} smaller
            </span>
          </div>
        </div>
        <Button
          onClick={handleDownload}
          size="sm"
          className="bg-brand-gradient text-white shadow-sm hover:opacity-90"
        >
          <Download className="size-4" />
          Download
        </Button>
      </div>

      {/* Stat grid */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        <Stat
          icon={FileType2}
          label="Original"
          value={formatBytes(result.originalSize)}
          hint={shortFormat(result.analysis.originalFormat)}
        />
        <Stat
          icon={FileType2}
          label="Compressed"
          value={formatBytes(result.size)}
          hint={shortFormat(result.format)}
          accent
        />
        <Stat
          icon={Maximize2}
          label="Dimensions"
          value={formatDimensions(result.width, result.height)}
          hint={`${result.analysis.megapixels} MP`}
        />
        <Stat
          icon={Zap}
          label="Load speed"
          value={improvement}
          hint="vs original"
        />
        <Stat
          icon={TrendingDown}
          label="Reduction"
          value={`${formatPercent(result.savedPercent)}`}
          hint={`${formatBytes(result.savedBytes)} saved`}
        />
        <Stat
          icon={FileType2}
          label="Quality"
          value={getQualityValue(result)}
          hint={getQualityHint(result)}
        />
      </div>

      {/* Note (format conversion, etc.) */}
      {result.note && result.targetSize === null && (
        <div className="flex items-start gap-2 rounded-lg border border-border/60 bg-muted/40 p-3 text-xs text-muted-foreground">
          <Info className="mt-0.5 size-3.5 shrink-0 text-foreground/60" />
          <span>{result.note}</span>
        </div>
      )}

      {/* Target status / note */}
      {result.targetSize !== null && (
        <div
          className={cn(
            "flex items-start gap-2 rounded-lg border p-3 text-xs",
            result.targetMet && !result.note
              ? "border-brand/40 bg-brand-muted/30 text-foreground"
              : result.targetMet
                ? "border-amber-500/30 bg-amber-500/5 text-foreground"
                : "border-amber-500/30 bg-amber-500/5 text-foreground",
          )}
        >
          {result.targetMet && !result.note ? (
            <Info className="mt-0.5 size-3.5 shrink-0 text-brand" />
          ) : (
            <Info className="mt-0.5 size-3.5 shrink-0 text-amber-500" />
          )}
          <span>
            {result.targetMet
              ? result.note
                ? `Target of ${formatBytes(result.targetSize)} reached (${formatBytes(result.size)}). ${result.note}`
                : `Target of ${formatBytes(result.targetSize)} reached (${formatBytes(result.size)}).`
              : result.note ??
                `Closest result to your ${formatBytes(result.targetSize)} target.`}
          </span>
        </div>
      )}

      {/* Engine reasoning */}
      {result.settings.reason && (
        <p className="text-[11px] leading-relaxed text-muted-foreground">
          <span className="font-medium text-foreground/80">Why these settings: </span>
          {result.settings.reason}
        </p>
      )}
    </div>
  );
}
