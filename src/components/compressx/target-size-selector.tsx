"use client";

import * as React from "react";
import { Target, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { TARGET_SIZE_PRESETS } from "@/lib/compression";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TargetSizeSelectorProps {
  value: number | null; // null = off
  onChange: (value: number | null) => void;
}

type PresetVal = (typeof TARGET_SIZE_PRESETS)[number]["value"];

export function TargetSizeSelector({
  value,
  onChange,
}: TargetSizeSelectorProps) {
  const [custom, setCustom] = React.useState<string>("");
  const [unit, setUnit] = React.useState<"KB" | "MB">("KB");

  const isPreset = (v: number): v is PresetVal =>
    (TARGET_SIZE_PRESETS as readonly { value: number }[]).some(
      (p) => p.value === v,
    );

  const selectPreset = (v: number) => {
    setCustom("");
    onChange(value === v ? null : v);
  };

  const applyCustom = () => {
    const num = parseFloat(custom);
    if (!Number.isFinite(num) || num <= 0) return;
    const bytes = Math.round(num * (unit === "MB" ? 1024 * 1024 : 1024));
    onChange(bytes);
  };

  const clearTarget = () => {
    setCustom("");
    onChange(null);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target className="size-4 text-brand" />
          <Label className="text-sm font-medium">Target file size</Label>
        </div>
        {value !== null && (
          <button
            type="button"
            onClick={clearTarget}
            className="inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="size-3" /> Clear
          </button>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2">
        {TARGET_SIZE_PRESETS.map((p) => {
          const active = value === p.value;
          return (
            <button
              key={p.value}
              type="button"
              onClick={() => selectPreset(p.value)}
              className={cn(
                "rounded-lg border px-2 py-2 text-xs font-medium transition-all",
                active
                  ? "border-brand bg-brand-muted text-brand"
                  : "border-border bg-card/50 text-muted-foreground hover:border-border hover:text-foreground",
              )}
            >
              {p.label}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-2">
        <Input
          type="number"
          inputMode="decimal"
          min={1}
          step={1}
          value={custom}
          placeholder="Custom"
          onChange={(e) => setCustom(e.target.value)}
          onBlur={applyCustom}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              applyCustom();
            }
          }}
          className="h-9 tabular-nums"
          aria-label="Custom target size"
        />
        <div className="flex overflow-hidden rounded-lg border border-border">
          {(["KB", "MB"] as const).map((u) => (
            <button
              key={u}
              type="button"
              onClick={() => setUnit(u)}
              className={cn(
                "px-3 py-1.5 text-xs font-medium transition-colors",
                unit === u
                  ? "bg-primary text-primary-foreground"
                  : "bg-card/50 text-muted-foreground hover:text-foreground",
              )}
            >
              {u}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        {value !== null
          ? "CompressX binary-searches quality to hit your target without harming visuals."
          : "Optional — pick an exact output size and the engine finds the closest match."}
      </p>
    </div>
  );
}
