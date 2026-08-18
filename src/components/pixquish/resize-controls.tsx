"use client";

import * as React from "react";
import {
  RotateCcw,
  Maximize2,
  FileImage,
  Link2,
  Unlink2,
  AlertTriangle,
  Expand,
  Shrink,
  StretchHorizontal,
  MoveVertical,
  MoveHorizontal,
  Grid3x3,
  Wand2,
  Sparkles,
  Gauge,
  ArrowLeftRight,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  RESIZE_PRESETS,
  type ResizeOptions,
  type FitMode,
  type ContainBgMode,
} from "@/lib/compression/resizer";
import { FORMAT_LABELS } from "@/lib/compression";
import type { OutputFormat } from "@/lib/compression";

interface ResizeControlsProps {
  options: ResizeOptions;
  onChange: (patch: Partial<ResizeOptions>) => void;
  onReset: () => void;
  /** Original image dimensions for aspect ratio display */
  originalDimensions?: { width: number; height: number } | null;
  /** Whether the rule-of-thirds grid overlay is shown on the preview */
  showGrid: boolean;
  onShowGridChange: (v: boolean) => void;
}

const FORMAT_OPTIONS: OutputFormat[] = [
  "original",
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
];

const FIT_MODES: { value: FitMode; label: string; icon: React.ReactNode; desc: string }[] = [
  { value: "cover", label: "Cover", icon: <Expand className="size-3.5" />, desc: "Fill canvas, crop excess" },
  { value: "contain", label: "Contain", icon: <Shrink className="size-3.5" />, desc: "Fit inside, add padding" },
  { value: "stretch", label: "Stretch", icon: <StretchHorizontal className="size-3.5" />, desc: "Stretch to fill, may distort" },
];

function DimensionInput({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      <input
        type="number"
        min={1}
        max={10000}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={cn(
          "flex h-9 w-full rounded-lg border border-border bg-background px-3 text-sm tabular-nums shadow-sm transition-colors",
          "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
          "disabled:cursor-not-allowed disabled:opacity-50",
        )}
        placeholder="px"
      />
    </div>
  );
}

export function ResizeControls({
  options,
  onChange,
  onReset,
  originalDimensions,
  showGrid,
  onShowGridChange,
}: ResizeControlsProps) {
  const w = options.width ?? "";
  const h = options.height ?? "";

  // Single onChange call when aspect is locked (fixes double-update race)
  const handleWidthChange = (val: string) => {
    const num = parseInt(val, 10) || 0;
    const patch: Partial<ResizeOptions> = { width: num > 0 ? num : null };
    if (options.lockAspect && num > 0 && originalDimensions) {
      const aspect = originalDimensions.width / originalDimensions.height;
      patch.height = Math.max(1, Math.round(num / aspect));
    }
    onChange(patch);
  };

  const handleHeightChange = (val: string) => {
    const num = parseInt(val, 10) || 0;
    const patch: Partial<ResizeOptions> = { height: num > 0 ? num : null };
    if (options.lockAspect && num > 0 && originalDimensions) {
      const aspect = originalDimensions.width / originalDimensions.height;
      patch.width = Math.max(1, Math.round(num * aspect));
    }
    onChange(patch);
  };

  const handlePresetSelect = (val: string) => {
    if (val === "custom") return;
    const preset = RESIZE_PRESETS.find((p) => p.label === val);
    if (preset) {
      onChange({
        width: preset.width,
        height: preset.height,
        coverOffsetX: 50,
        coverOffsetY: 50,
      });
    }
  };

  // ── Quality control logic ──────────────────────────────────────────────
  // Quality slider is only meaningful for lossy formats. PNG is lossless so
  // the slider would have no effect. When format is "original", quality still
  // applies if the source is JPEG/WebP/AVIF (the common case for photos).
  const isPngOutput = options.format === "image/png";
  const showQualityControl = !isPngOutput;

  // Map internal quality (0–1, or null=auto) ↔ slider value (0–100).
  // Slider convention: 100 = Auto (visually lossless), 99–0 = manual quality.
  // This lets users push to true max if they want, while defaulting to a smart auto.
  const qualitySliderValue = options.quality === null ? 100 : Math.round(options.quality * 100);

  const qualityLabel = options.quality === null
    ? "Auto (high)"
    : `${qualitySliderValue}%`;

  const qualityHint = options.quality === null
    ? "Auto keeps file size reasonable with no visible artifacts. Slide left for smaller files, right for max quality."
    : qualitySliderValue >= 95
      ? "Near-lossless quality. File size will be larger."
      : qualitySliderValue >= 80
        ? "High quality — good balance of size and clarity."
        : "Smaller file. Some visible artifacts may appear in smooth areas.";

  const onQualitySliderChange = (val: number) => {
    // 100 = Auto (null). Anything below 100 is a manual quality override.
    onChange({ quality: val >= 100 ? null : val / 100 });
  };

  const hasPreset =
    options.width !== null &&
    options.height !== null &&
    RESIZE_PRESETS.some(
      (p) => p.width === options.width && p.height === options.height,
    );

  // Detect aspect ratio mismatch for the stretch warning
  const hasRatioMismatch =
    options.fit === "stretch" &&
    options.width !== null &&
    options.height !== null &&
    originalDimensions &&
    Math.abs(
      (options.width / options.height) -
        (originalDimensions.width / originalDimensions.height),
    ) > 0.01;

  // Detect cover crop axes (which axes have excess that can be repositioned)
  const coverHasCropX = React.useMemo(() => {
    if (options.fit !== "cover" || !originalDimensions || !options.width || !options.height) return false;
    const imgR = originalDimensions.width / originalDimensions.height;
    const tR = options.width / options.height;
    // If image is wider than target, X axis has excess
    return imgR > tR + 0.01;
  }, [options.fit, originalDimensions, options.width, options.height]);

  const coverHasCropY = React.useMemo(() => {
    if (options.fit !== "cover" || !originalDimensions || !options.width || !options.height) return false;
    const imgR = originalDimensions.width / originalDimensions.height;
    const tR = options.width / options.height;
    // If image is taller than target, Y axis has excess
    return imgR < tR - 0.01;
  }, [options.fit, originalDimensions, options.width, options.height]);

  const showCoverOffset = options.fit === "cover" && (coverHasCropX || coverHasCropY);

  return (
    <div className="rounded-2xl border border-border/70 bg-card/50 p-4 shadow-sm backdrop-blur-sm sm:p-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-brand-muted text-brand">
            <Maximize2 className="size-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold leading-tight">Resize</h3>
            <p className="text-xs text-muted-foreground">
              {originalDimensions
                ? `${originalDimensions.width}×${originalDimensions.height} → new size`
                : "Set output dimensions"}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="text-muted-foreground hover:text-foreground"
        >
          <RotateCcw className="size-3.5" />
          Reset
        </Button>
      </div>

      <Separator className="my-3" />

      <div className="flex flex-col gap-4">
        {/* Dimensions */}
        <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Maximize2 className="size-4 text-brand" />
                <p className="text-sm font-medium">Dimensions</p>
                {!hasPreset && options.width !== null && options.height !== null && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-brand-muted px-1.5 py-0.5 text-[10px] font-medium text-brand">
                    <Sparkles className="size-2.5" />
                    Custom
                  </span>
                )}
              </div>

              {/* Preset selector */}
              <Select
                value={hasPreset ? RESIZE_PRESETS.find((p) => p.width === options.width && p.height === options.height)?.label : "custom"}
                onValueChange={handlePresetSelect}
              >
                <SelectTrigger className="w-full" aria-label="Preset size">
                  <SelectValue placeholder="Custom size" />
                </SelectTrigger>
                <SelectContent className="max-h-64">
                  <SelectGroup>
                    <SelectLabel>Custom</SelectLabel>
                    <SelectItem value="custom">Custom dimensions…</SelectItem>
                  </SelectGroup>
                  {(["Social", "Web", "Common"] as const).map((cat) => (
                    <SelectGroup key={cat}>
                      <SelectLabel>{cat}</SelectLabel>
                      {RESIZE_PRESETS.filter((p) => p.category === cat).map(
                        (p) => (
                          <SelectItem key={p.label} value={p.label}>
                            {p.label} ({p.width}×{p.height})
                          </SelectItem>
                        ),
                      )}
                    </SelectGroup>
                  ))}
                </SelectContent>
              </Select>

              {/* W x H inputs with lock toggle */}
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <DimensionInput
                    label="Width"
                    value={String(w)}
                    onChange={handleWidthChange}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => onChange({ lockAspect: !options.lockAspect })}
                  className={cn(
                    "mb-1.5 flex size-9 items-center justify-center rounded-lg border transition-colors",
                    options.lockAspect
                      ? "border-brand bg-brand-muted text-brand"
                      : "border-border text-muted-foreground hover:text-foreground",
                  )}
                  aria-label={
                    options.lockAspect
                      ? "Unlock aspect ratio"
                      : "Lock aspect ratio"
                  }
                  title={
                    options.lockAspect
                      ? "Unlock aspect ratio"
                      : "Lock aspect ratio"
                  }
                >
                  {options.lockAspect ? (
                    <Link2 className="size-4" />
                  ) : (
                    <Unlink2 className="size-4" />
                  )}
                </button>
                <div className="flex-1">
                  <DimensionInput
                    label="Height"
                    value={String(h)}
                    onChange={handleHeightChange}
                  />
                </div>
              </div>

              {/* Quick-set shortcuts + swap W↔H */}
              {(originalDimensions || (options.width !== null && options.height !== null)) && (
                <div className="flex flex-wrap items-center gap-1.5">
                  {originalDimensions && (
                    <>
                      <button
                        type="button"
                        onClick={() => onChange({
                          width: originalDimensions.width,
                          height: originalDimensions.height,
                        })}
                        className="rounded-md border border-border/60 px-2 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
                      >
                        Original
                      </button>
                      <button
                        type="button"
                        onClick={() => onChange({
                          width: Math.max(1, Math.round(originalDimensions.width / 2)),
                          height: Math.max(1, Math.round(originalDimensions.height / 2)),
                        })}
                        className="rounded-md border border-border/60 px-2 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
                      >
                        ½×
                      </button>
                      <button
                        type="button"
                        onClick={() => onChange({
                          width: originalDimensions.width * 2,
                          height: originalDimensions.height * 2,
                        })}
                        className="rounded-md border border-border/60 px-2 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
                      >
                        2×
                      </button>
                    </>
                  )}
                  {options.width !== null && options.height !== null && (
                    <button
                      type="button"
                      onClick={() =>
                        onChange({ width: options.height, height: options.width })
                      }
                      className="ml-auto flex items-center gap-1 rounded-md border border-border/60 px-2 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
                      aria-label="Swap width and height"
                      title="Swap width and height"
                    >
                      <ArrowLeftRight className="size-3" />
                      Swap
                    </button>
                  )}
                </div>
              )}

              {originalDimensions && (
                <p className="text-xs text-muted-foreground">
                  Original: {originalDimensions.width}×{
                    originalDimensions.height
                  }{" "}
                  ({Math.round((originalDimensions.width / originalDimensions.height) * 100) / 100}
                  :1)
                </p>
              )}
            </div>

            {/* Fit mode selector — only shown when using custom dimensions */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Fit mode</p>
              <div className="grid grid-cols-3 gap-1.5">
                {FIT_MODES.map((mode) => {
                  const active = options.fit === mode.value;
                  return (
                    <button
                      key={mode.value}
                      type="button"
                      onClick={() => onChange({ fit: mode.value, coverOffsetX: 50, coverOffsetY: 50 })}
                      title={mode.desc}
                      className={cn(
                        "flex flex-col items-center gap-1 rounded-lg border px-2 py-2 text-xs transition-colors",
                        active
                          ? "border-brand bg-brand-muted text-brand"
                          : "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground",
                      )}
                    >
                      {mode.icon}
                      <span className="font-medium">{mode.label}</span>
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-muted-foreground">
                {FIT_MODES.find((m) => m.value === options.fit)?.desc}
              </p>

              {/* Stretch distortion warning */}
              {hasRatioMismatch && (
                <div className="flex items-start gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/5 px-2.5 py-2 text-xs text-amber-600 dark:text-amber-400">
                  <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
                  <span>Image will be distorted. Use Cover or Contain to preserve proportions.</span>
                </div>
              )}

              {/* Cover crop position sliders */}
              {showCoverOffset && (
                <div className="space-y-2.5 rounded-lg border border-border/60 bg-muted/30 p-3">
                  <p className="text-xs font-medium">Crop position</p>
                  {coverHasCropY && (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <MoveVertical className="size-3" />
                          Vertical
                        </label>
                        <span className="text-[11px] tabular-nums text-muted-foreground">
                          {options.coverOffsetY}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        step={1}
                        value={options.coverOffsetY}
                        onChange={(e) => onChange({ coverOffsetY: Number(e.target.value) })}
                        onKeyDown={(e) => {
                          if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                            e.preventDefault();
                            const dir = e.key === "ArrowUp" ? 1 : -1;
                            const next = Math.max(0, Math.min(100, options.coverOffsetY + dir));
                            onChange({ coverOffsetY: next });
                          }
                        }}
                        className="h-1.5 w-full cursor-pointer accent-brand"
                        aria-label="Vertical crop position (use arrow keys to nudge by 1%)"
                      />
                      <div className="flex justify-between text-[10px] text-muted-foreground/60">
                        <span>Top</span><span>Center</span><span>Bottom</span>
                      </div>
                    </div>
                  )}
                  {coverHasCropX && (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <MoveHorizontal className="size-3" />
                          Horizontal
                        </label>
                        <span className="text-[11px] tabular-nums text-muted-foreground">
                          {options.coverOffsetX}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        step={1}
                        value={options.coverOffsetX}
                        onChange={(e) => onChange({ coverOffsetX: Number(e.target.value) })}
                        onKeyDown={(e) => {
                          if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
                            e.preventDefault();
                            const dir = e.key === "ArrowRight" ? 1 : -1;
                            const next = Math.max(0, Math.min(100, options.coverOffsetX + dir));
                            onChange({ coverOffsetX: next });
                          }
                        }}
                        className="h-1.5 w-full cursor-pointer accent-brand"
                        aria-label="Horizontal crop position (use arrow keys to nudge by 1%)"
                      />
                      <div className="flex justify-between text-[10px] text-muted-foreground/60">
                        <span>Left</span><span>Center</span><span>Right</span>
                      </div>
                    </div>
                  )}
                  {/* Rule-of-thirds grid toggle */}
                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Grid3x3 className="size-3" />
                      Show grid
                    </label>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={showGrid}
                      onClick={() => onShowGridChange(!showGrid)}
                      className={cn(
                        "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                        showGrid ? "bg-brand" : "bg-input",
                      )}
                    >
                      <span
                        className={cn(
                          "pointer-events-none block size-4 rounded-full bg-white shadow-lg ring-0 transition-transform",
                          showGrid ? "translate-x-4" : "translate-x-0",
                        )}
                      />
                    </button>
                  </div>
                </div>
              )}

              {/* Contain background settings */}
              {options.fit === "contain" && (
                <div className="space-y-3 rounded-lg border border-border/60 bg-muted/30 p-3">
                  <p className="text-xs font-medium">Padding background</p>

                  {/* Background mode selector */}
                  <div className="grid grid-cols-2 gap-1.5">
                    {([
                      { value: "color" as const, label: "Solid Color", desc: "Choose a color" },
                      { value: "blur" as const, label: "Blurred Image", desc: "Same image, blurred" },
                    ] as const).map((mode) => {
                      const active = options.containBgMode === mode.value;
                      return (
                        <button
                          key={mode.value}
                          type="button"
                          onClick={() => onChange({ containBgMode: mode.value })}
                          title={mode.desc}
                          className={cn(
                            "flex flex-col items-center gap-0.5 rounded-lg border px-2 py-2 text-xs transition-colors",
                            active
                              ? "border-brand bg-brand-muted text-brand"
                              : "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground",
                          )}
                        >
                          <span className="font-medium">{mode.label}</span>
                          <span className="text-[10px] opacity-70">{mode.desc}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Solid color picker */}
                  {options.containBgMode === "color" && (
                    <div className="flex items-center gap-2.5">
                      <label htmlFor="contain-bg" className="text-xs text-muted-foreground whitespace-nowrap">
                        Color
                      </label>
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <input
                            id="contain-bg"
                            type="color"
                            value={options.containBgColor.slice(0, 7)}
                            onChange={(e) =>
                              onChange({
                                containBgColor: e.target.value + "ff",
                              })
                            }
                            className="size-7 cursor-pointer rounded border border-border"
                          />
                        </div>
                        <input
                          type="text"
                          value={options.containBgColor}
                          onChange={(e) => onChange({ containBgColor: e.target.value })}
                          className="h-7 w-24 rounded-md border border-border bg-background px-2 text-xs font-mono tabular-nums shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                          placeholder="#000000ff"
                        />
                      </div>
                    </div>
                  )}

                  {/* Blur intensity slider */}
                  {options.containBgMode === "blur" && (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Wand2 className="size-3" />
                          Blur intensity
                        </label>
                        <span className="text-[11px] tabular-nums text-muted-foreground">
                          {options.containBlur}px
                        </span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={80}
                        step={1}
                        value={options.containBlur}
                        onChange={(e) => onChange({ containBlur: Number(e.target.value) })}
                        className="h-1.5 w-full cursor-pointer accent-brand"
                        aria-label="Blur intensity"
                      />
                      <div className="flex justify-between text-[10px] text-muted-foreground/60">
                        <span>Sharp</span><span>Heavy blur</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

        <Separator />

        {/* Output format */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <FileImage className="size-4 text-brand" />
            <p className="text-sm font-medium">Output format</p>
          </div>
          <Select
            value={options.format}
            onValueChange={(v) => onChange({ format: v })}
          >
            <SelectTrigger className="w-full" aria-label="Output format">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FORMAT_OPTIONS.map((f) => (
                <SelectItem key={f} value={f}>
                  {FORMAT_LABELS[f]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Quality control — only relevant for lossy formats */}
        {showQualityControl && (
          <div className="space-y-2.5 rounded-lg border border-border/60 bg-muted/30 p-3">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <Gauge className="size-3" />
                Quality
              </label>
              <span className="text-[11px] font-medium tabular-nums text-foreground">
                {qualityLabel}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              step={1}
              value={qualitySliderValue}
              onChange={(e) => onQualitySliderChange(Number(e.target.value))}
              className="h-1.5 w-full cursor-pointer accent-brand"
              aria-label="Output quality"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground/60">
              <span>Smaller file</span>
              <span>Best quality</span>
            </div>
            <p className="text-[10px] leading-tight text-muted-foreground/70">
              {qualityHint}
            </p>
          </div>
        )}

        {/* Sharpen toggle — restores crispness lost to downscaling */}
        <div className="space-y-2.5 rounded-lg border border-border/60 bg-muted/30 p-3">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <Sparkles className="size-3" />
              Sharpen
            </label>
            <button
              type="button"
              role="switch"
              aria-checked={options.sharpen}
              onClick={() => onChange({ sharpen: !options.sharpen })}
              className={cn(
                "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                options.sharpen ? "bg-brand" : "bg-input",
              )}
            >
              <span
                className={cn(
                  "pointer-events-none block size-4 rounded-full bg-white shadow-lg ring-0 transition-transform",
                  options.sharpen ? "translate-x-4" : "translate-x-0",
                )}
              />
            </button>
          </div>
          {options.sharpen && (
            <>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground">Intensity</span>
                <span className="text-[11px] tabular-nums text-foreground">
                  {options.sharpenAmount}%
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                step={1}
                value={options.sharpenAmount}
                onChange={(e) => onChange({ sharpenAmount: Number(e.target.value) })}
                className="h-1.5 w-full cursor-pointer accent-brand"
                aria-label="Sharpen intensity"
              />
              <p className="text-[10px] leading-tight text-muted-foreground/70">
                Counters softening from downscaling. Auto-scales with resize ratio.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
