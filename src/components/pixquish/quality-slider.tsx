"use client";

import * as React from "react";
import { Sparkles, Gauge } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface QualitySliderProps {
  value: number | null; // null = auto
  onChange: (value: number | null) => void;
  recommendedHint?: string;
}

export function QualitySlider({
  value,
  onChange,
  recommendedHint,
}: QualitySliderProps) {
  const isAuto = value === null;
  const display = isAuto ? 82 : Math.round((value ?? 0.82) * 100);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Gauge className="size-4 text-brand" />
          <Label className="text-sm font-medium">Quality</Label>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "text-xs font-medium tabular-nums",
              isAuto ? "text-brand" : "text-muted-foreground",
            )}
          >
            {isAuto ? "Auto" : `${display}%`}
          </span>
          <Switch
            checked={!isAuto}
            onCheckedChange={(checked) => onChange(checked ? 0.82 : null)}
            aria-label="Toggle manual quality"
          />
        </div>
      </div>

      <Slider
        value={[display]}
        min={10}
        max={100}
        step={1}
        disabled={isAuto}
        onValueChange={(v) => onChange((v[0] ?? 82) / 100)}
        className={cn(isAuto && "opacity-50")}
      />

      <div className="flex items-center justify-between text-[11px] text-muted-foreground">
        <span>Smaller file</span>
        <span>Best quality</span>
      </div>

      <p className="flex items-start gap-1.5 text-xs text-muted-foreground">
        {isAuto ? (
          <>
            <Sparkles className="mt-0.5 size-3.5 shrink-0 text-brand" />
            <span>
              Smart mode analyzes each image and picks the ideal quality
              {recommendedHint ? ` — ${recommendedHint}` : ""}.
            </span>
          </>
        ) : (
          <span>
            Manual quality locked at {display}%. Switch to Auto to let Pixquish
            decide per image.
          </span>
        )}
      </p>
    </div>
  );
}
