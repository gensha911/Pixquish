"use client";

import * as React from "react";
import { UploadCloud, ImageIcon, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { ACCEPT_ATTR } from "@/lib/compression";

const inputId = React.useId ? undefined : "compressx-upload";

interface UploadCardProps {
  onFiles: (files: FileList | File[]) => void;
  compact?: boolean;
  className?: string;
}

export function UploadCard({
  onFiles,
  compact = false,
  className,
}: UploadCardProps) {
  const generatedId = React.useId();
  const id = inputId ?? generatedId;
  const [isDragging, setIsDragging] = React.useState(false);
  const dragCounter = React.useRef(0);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current = 0;
    setIsDragging(false);
    if (e.dataTransfer?.files?.length) {
      onFiles(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current += 1;
    if (e.dataTransfer?.types?.includes("Files")) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current -= 1;
    if (dragCounter.current <= 0) {
      dragCounter.current = 0;
      setIsDragging(false);
    }
  };

  // Keep a ref to onFiles so the native listener always calls the latest version.
  const onFilesRef = React.useRef(onFiles);
  React.useEffect(() => { onFilesRef.current = onFiles; }, [onFiles]);

  // Once React is mounted, signal the pre-hydration script to stop intercepting,
  // then drain any files that were selected before hydration completed.
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const pending = (window as unknown as Record<string, unknown>).__compressx_pending as File[] | undefined;
      if (pending?.length) {
        onFilesRef.current(pending);
        pending.length = 0;
      }
      (window as unknown as Record<string, unknown>).__compressx_hydrated?.();
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) onFiles(e.target.files);
    // Reset so picking the same file again re-triggers change.
    e.target.value = "";
  };

  return (
    <div className={cn("w-full", className)}>
      <input
        id={id}
        type="file"
        accept={ACCEPT_ATTR}
        multiple
        className="sr-only"
        onChange={handleChange}
        aria-label="Upload images"
        data-compressx-upload=""
      />
      {/* Use <label> so the file picker works immediately even before React hydrates */}
      <label
        htmlFor={id}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        aria-label="Upload images: click or drag and drop"
        className={cn(
          "group relative flex w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-3xl border-2 border-dashed text-center transition-all duration-200",
          "focus-within:outline-none focus-within:ring-2 focus-within:ring-ring/60 focus-within:ring-offset-2 focus-within:ring-offset-background",
          "hover:border-brand/60 hover:bg-card/60 active:scale-[0.995]",
          isDragging
            ? "border-brand bg-brand-muted/60 glow-brand"
            : "border-border bg-card/40",
          compact ? "p-6 sm:p-8" : "p-10 sm:p-14 md:p-20",
        )}
      >
        {/* Animated gradient backdrop on hover/drag */}
        <div
          className={cn(
            "pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ambient-glow",
            isDragging ? "opacity-100" : "group-hover:opacity-60",
          )}
        />
        <div className="relative z-10 flex flex-col items-center">
          <div
            className={cn(
              "flex items-center justify-center rounded-2xl bg-brand-gradient text-white shadow-lg transition-transform duration-200",
              compact ? "size-12" : "size-16",
              isDragging ? "scale-110" : "group-hover:scale-105",
            )}
          >
            <UploadCloud className={compact ? "size-6" : "size-8"} />
          </div>
          <p
            className={cn(
              "mt-5 font-semibold tracking-tight",
              compact ? "text-base" : "text-lg sm:text-xl",
            )}
          >
            {isDragging ? "Drop your images here" : "Click to upload or drag & drop"}
          </p>
          {!compact && (
            <p className="mt-2 text-sm text-muted-foreground">
              Supports JPG, PNG, WebP, and AVIF · Multiple files welcome
            </p>
          )}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <ImageIcon className="size-3.5" /> Up to 4K resolution
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="size-3.5 text-brand" /> 100% private
            </span>
          </div>
        </div>
      </label>
    </div>
  );
}
