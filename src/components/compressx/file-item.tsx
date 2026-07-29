"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, AlertCircle, FileImage } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { formatBytes } from "@/lib/compression";
import type { CompressFile } from "./use-workspace";
import { ComparisonSlider } from "./comparison-slider";
import { ResultCard } from "./result-card";

interface FileItemProps {
  item: CompressFile;
  onRemove: (id: string) => void;
  selectable?: boolean;
  selected?: boolean;
  onToggleSelect?: (id: string) => void;
}

export function FileItem({ item, onRemove, selectable, selected, onToggleSelect }: FileItemProps) {
  const { file, status, progress, result, error } = item;
  const name = file.name;
  const isWorking = status === "working" || status === "queued";
  const canSelect = selectable && (status === "idle" || status === "error" || status === "done");

  // Click the card body to toggle selection (stopPropagation on interactive children).
  const handleCardClick = React.useCallback(
    (e: React.MouseEvent) => {
      if (!canSelect || !onToggleSelect) return;
      // Don't toggle if clicking buttons, links, or interactive controls.
      const t = (e.target as HTMLElement).closest("button, a, input, [role=slider], label");
      if (t) return;
      onToggleSelect(item.id);
    },
    [canSelect, onToggleSelect, item.id],
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn(
        "relative overflow-hidden rounded-2xl border bg-card/60 shadow-sm transition-colors",
        canSelect
          ? selected
            ? "cursor-pointer border-brand/70 ring-1 ring-brand/30"
            : "cursor-pointer border-border/70 hover:border-brand/40"
          : "border-border/70",
      )}
      data-file-item
      onClick={handleCardClick}
    >
      {/* Top bar */}
      <div className="flex items-center gap-3 border-b border-border/60 px-4 py-3">
        {selectable && (
          <Checkbox
            checked={selected ? true : false}
            disabled={!canSelect}
            onCheckedChange={() => onToggleSelect?.(item.id)}
            aria-label={`Select ${name}`}
            className="shrink-0"
          />
        )}
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
          <FileImage className="size-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium" title={name}>
            {name}
          </p>
          <p className="text-xs text-muted-foreground tabular-nums">
            {formatBytes(file.size)}
            {result && (
              <>
                {" → "}
                <span className="font-medium text-brand">
                  {formatBytes(result.size)}
                </span>
              </>
            )}
          </p>
        </div>
        <StatusPill status={status} progress={progress} />
        <Button
          variant="ghost"
          size="icon"
          className="size-8 text-muted-foreground hover:text-foreground"
          onClick={() => onRemove(item.id)}
          aria-label={`Remove ${name}`}
        >
          <X className="size-4" />
        </Button>
      </div>

      {/* Working progress bar */}
      <AnimatePresence>
        {isWorking && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-0.5 w-full bg-muted"
          >
            <motion.div
              className="h-full bg-brand-gradient"
              animate={{ width: `${Math.max(6, progress * 100)}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Body */}
      <div className="relative p-4 sm:p-5">
        {/* Re-compress overlay: subtle progress bar when updating existing result */}
        {isWorking && result && (
          <div className="absolute inset-x-0 top-0 z-10 h-0.5">
            <motion.div
              className="h-full bg-brand-gradient"
              animate={{ width: `${Math.max(6, progress * 100)}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </div>
        )}
        {isWorking && result && (
          <div className="absolute inset-x-0 top-0.5 z-10 flex justify-center">
            <span className="flex items-center gap-1.5 rounded-b-lg border border-border/40 bg-card/90 px-3 py-1 text-[11px] font-medium text-muted-foreground shadow-sm backdrop-blur-sm">
              <Loader2 className="size-3 animate-spin" />
              Updating… {Math.round(progress * 100)}%
            </span>
          </div>
        )}
        {status === "error" ? (
          <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-foreground">
            <AlertCircle className="size-4 shrink-0 text-destructive" />
            <span>{error ?? "Compression failed."}</span>
          </div>
        ) : result ? (
          <div className={cn("grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]", isWorking && "opacity-70 pointer-events-none")}>
            <ComparisonSlider
              beforeSrc={result.originalUrl}
              afterSrc={result.url}
              alt={name}
              className="w-full"
              backgroundColor={item.dominantColor}
              hasTransparency={item.hasTransparency}
            />
            <ResultCard result={result} fileName={name} />
          </div>
        ) : status === "idle" ? (
          <div className="flex h-28 items-center justify-center text-sm text-muted-foreground">
            Ready to compress
          </div>
        ) : (
          <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
            <Loader2 className="mr-2 size-4 animate-spin" />
            Analyzing & compressing…
          </div>
        )}
      </div>
    </motion.div>
  );
}

function StatusPill({
  status,
  progress,
}: {
  status: CompressFile["status"];
  progress: number;
}) {
  if (status === "idle") {
    return (
      <span className="hidden shrink-0 items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground sm:inline-flex">
        Pending
      </span>
    );
  }
  if (status === "done") {
    return (
      <span className="hidden shrink-0 items-center gap-1 rounded-full bg-brand-muted px-2.5 py-1 text-[11px] font-medium text-brand sm:inline-flex">
        Done
      </span>
    );
  }
  if (status === "error") {
    return (
      <span className="hidden shrink-0 items-center gap-1 rounded-full bg-destructive/10 px-2.5 py-1 text-[11px] font-medium text-destructive sm:inline-flex">
        Error
      </span>
    );
  }
  return (
    <span className="hidden shrink-0 items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground sm:inline-flex">
      <Loader2 className="size-3 animate-spin" />
      {Math.round(progress * 100)}%
    </span>
  );
}
