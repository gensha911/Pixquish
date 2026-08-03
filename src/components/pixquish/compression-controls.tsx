"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { RotateCcw, SlidersHorizontal, FileImage } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  FORMAT_LABELS,
  MODE_LABELS,
  type CompressionMode,
  type OutputFormat,
} from "@/lib/compression";
import { QualitySlider } from "./quality-slider";
import { TargetSizeSelector } from "./target-size-selector";
import type { WorkspaceControls } from "./use-workspace";

interface CompressionControlsProps {
  controls: WorkspaceControls;
  onChange: (patch: Partial<WorkspaceControls>) => void;
  onReset: () => void;
}

const MODES: { value: CompressionMode; label: string; desc: string }[] = [
  { value: "quality", label: "Best Quality", desc: "Max visual fidelity" },
  { value: "balanced", label: "Balanced", desc: "Quality ↔ size" },
  { value: "max", label: "Max Compress", desc: "Smallest file" },
];

const FORMATS: OutputFormat[] = [
  "original",
  "auto",
  "image/webp",
  "image/avif",
  "image/jpeg",
  "image/png",
];

export function CompressionControls({
  controls,
  onChange,
  onReset,
}: CompressionControlsProps) {
  return (
    <div className="rounded-2xl border border-border/70 bg-card/50 p-4 shadow-sm backdrop-blur-sm sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-brand-muted text-brand">
            <SlidersHorizontal className="size-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold leading-tight">
              Compression
            </h3>
            <p className="text-xs text-muted-foreground">Tune your output</p>
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

      {/* Mode + Format stacked (fits in 300px sidebar) */}
      <div className="flex flex-col gap-4">
        {/* Mode selector */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Mode</p>
          <div className="grid grid-cols-3 gap-1 rounded-lg bg-muted/60 p-1">
            {MODES.map((m) => {
              const active = controls.mode === m.value;
              return (
                <button
                  key={m.value}
                  type="button"
                  onClick={() => onChange({ mode: m.value })}
                  aria-pressed={active}
                  className={cn(
                    "relative rounded-lg px-2 py-2 text-center transition-colors",
                    active
                      ? "text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="mode-pill"
                      className="absolute inset-0 rounded-lg bg-primary shadow-sm"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 32,
                      }}
                    />
                  )}
                  <span className="relative z-10 flex flex-col items-center gap-0.5">
                    <span className="text-xs font-semibold leading-tight">
                      {m.label}
                    </span>
                    <span
                      className={cn(
                        "hidden text-[10px] leading-tight sm:block",
                        active
                          ? "text-primary-foreground/70"
                          : "text-muted-foreground/70",
                      )}
                    >
                      {m.desc}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
          <p className="text-xs text-muted-foreground">
            {controls.mode === "quality"
              ? "Prioritizes visual quality. Minimal file reduction."
              : controls.mode === "max"
                ? "Smallest file while keeping the image usable."
                : "Best balance between quality and file size."}
          </p>
        </div>

        {/* Format selector */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <FileImage className="size-4 text-brand" />
            <p className="text-sm font-medium">Output format</p>
          </div>
          <Select
            value={controls.format}
            onValueChange={(v) => onChange({ format: v as OutputFormat })}
          >
            <SelectTrigger className="w-full" aria-label="Output format">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FORMATS.map((f) => (
                <SelectItem key={f} value={f}>
                  {FORMAT_LABELS[f]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            {controls.format === "original"
              ? "Output keeps the same format as the uploaded file."
              : controls.format === "auto"
                ? "Auto picks the best encoder per image."
                : controls.format === "image/avif"
                  ? "AVIF offers the best compression. Falls back if unsupported."
                  : `Forced to ${FORMAT_LABELS[controls.format]}.`}
          </p>
        </div>
      </div>

      <Separator className="my-3" />

      <QualitySlider
        value={controls.quality}
        onChange={(q) => onChange({ quality: q })}
        recommendedHint={`~${
          controls.mode === "quality"
            ? "90%"
            : controls.mode === "max"
              ? "66%"
              : "80%"
        } for photos`}
      />

      <Separator className="my-3" />

      <TargetSizeSelector
        value={controls.targetSize}
        onChange={(t) => onChange({ targetSize: t })}
      />
    </div>
  );
}