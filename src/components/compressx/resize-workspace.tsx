"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  Trash2,
  Maximize2,
  ArrowRight,
  ShieldCheck,
  Layers,
  Zap,
  Loader2,
  AlertCircle,
  X,
  CheckSquare,
  Square,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { UploadCard } from "./upload-card";
import { ResizeControls } from "./resize-controls";
import { useResizeWorkspace, type ResizeFile } from "./use-resize-workspace";
import { useResizePreview } from "./use-resize-preview";
import { ResizePreview } from "./resize-preview";
import { ComparisonSlider } from "./comparison-slider";
import { cn } from "@/lib/utils";
import { formatBytes } from "@/lib/compression";

function ResizeFileItem({
  item,
  onRemove,
  selected,
  onToggleSelect,
  resizePreview,
  isPreviewGenerating,
  showGrid,
}: {
  item: ResizeFile;
  onRemove: (id: string) => void;
  selected?: boolean;
  onToggleSelect?: (id: string) => void;
  resizePreview?: import("@/lib/compression/resizer").ResizeResult | null;
  isPreviewGenerating?: boolean;
  showGrid?: boolean;
}) {
  const { file, status, progress, result, error, origW, origH } = item;
  const name = file.name;
  const canSelect = status !== "working";

  const handleCardClick = React.useCallback(
    (e: React.MouseEvent) => {
      if (!canSelect || !onToggleSelect) return;
      const t = (e.target as HTMLElement).closest("button, a, input, [role=slider], label");
      if (t) return;
      onToggleSelect(item.id);
    },
    [canSelect, onToggleSelect, item.id],
  );

  return (
    <motion.div
      layout
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
        <Checkbox
          checked={selected}
          onCheckedChange={() => onToggleSelect?.(item.id)}
          aria-label={`Select ${name}`}
          className="shrink-0"
        />
        <p className="min-w-0 flex-1 truncate text-sm font-medium">{name}</p>
        {status === "idle" && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {origW && origH ? `${origW}×${origH}` : formatBytes(file.size)}
            </span>
            {resizePreview && !isPreviewGenerating && (
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  const a = document.createElement("a");
                  a.href = resizePreview.url;
                  const base = file.name.replace(/\.[^.]+$/, "");
                  const ext = resizePreview.format.replace("image/", "").replace("jpeg", "jpg");
                  a.download = `${base}-${resizePreview.width}x${resizePreview.height}.${ext}`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                }}
              >
                <Download className="size-3.5" />
                Download
              </Button>
            )}
          </div>
        )}
        {status === "done" && result && (
          <span className="text-xs text-muted-foreground">
            {result.originalWidth}×{result.originalHeight} → {result.width}×{result.height}
          </span>
        )}
        {status === "done" && result && (
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 text-xs"
            onClick={(e) => {
              e.stopPropagation();
              const a = document.createElement("a");
              a.href = result.url;
              const base = file.name.replace(/\.[^.]+$/, "");
              const ext = result.format.replace("image/", "").replace("jpeg", "jpg");
              a.download = `${base}-${result.width}x${result.height}.${ext}`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
            }}
          >
            <Download className="size-3.5" />
            Download
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="size-8 shrink-0 text-muted-foreground hover:text-destructive"
          onClick={(e) => { e.stopPropagation(); onRemove(item.id); }}
        >
          <X className="size-4" />
        </Button>
      </div>

      {/* Progress bar */}
      {(status === "working") && (
        <div className="px-4 py-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Loader2 className="size-3.5 animate-spin" />
            Resizing… {Math.round(progress * 100)}%
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
            <motion.div
              className="h-full rounded-full bg-brand"
              initial={{ width: 0 }}
              animate={{ width: `${Math.max(2, progress * 100)}%` }}
              transition={{ duration: 0.2 }}
            />
          </div>
        </div>
      )}

      {/* Error */}
      {status === "error" && (
        <div className="flex items-center gap-2 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="size-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Live preview (idle state) */}
      {status === "idle" && (
        <div className="p-4 sm:p-5">
          <ResizePreview
            preview={resizePreview ?? null}
            isGenerating={isPreviewGenerating ?? false}
            alt={name}
            backgroundColor={item.dominantColor}
            hasTransparency={item.hasTransparency}
            showGrid={showGrid}
          />
        </div>
      )}

      {/* Done result — comparison slider + stats */}
      {status === "done" && result && (
        <div className="space-y-3 p-4 sm:p-5">
          <ComparisonSlider
            beforeSrc={result.originalUrl}
            afterSrc={result.url}
            alt={name}
            beforeLabel="Original"
            afterLabel="Resized"
            className="w-full"
            backgroundColor={item.dominantColor}
            hasTransparency={item.hasTransparency}
          />
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
            <span className="text-muted-foreground">
              {result.originalWidth}×{result.originalHeight}{" "}
              <span className="text-foreground/60">({formatBytes(result.originalSize)})</span>
            </span>
            <ArrowRight className="size-3 text-brand" />
            <span className="font-semibold tabular-nums text-brand">
              {result.width}×{result.height}{" "}
              <span className="font-normal text-foreground/60">({formatBytes(result.size)})</span>
            </span>
            <span
              className={cn(
                "ml-auto font-medium tabular-nums",
                result.size <= result.originalSize ? "text-emerald-500" : "text-amber-500",
              )}
            >
              {result.size <= result.originalSize ? "" : "+"}
              {formatBytes(Math.abs(result.size - result.originalSize))}
            </span>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export function ResizeWorkspace() {
  const {
    files,
    options,
    showGrid,
    setShowGrid,
    addFiles,
    removeFile,
    clearAll,
    resizeAll,
    resetOptions,
    updateOptions,
    doneCount,
    firstFileDimensions,
  } = useResizeWorkspace();

  const hasIdle = files.some((f) => f.status === "idle" || f.status === "error");
  const hasWorking = files.some((f) => f.status === "working");
  const hasFiles = files.length > 0;

  const selectableIds = files.map((f) => f.id);
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());

  const toggleSelect = React.useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);

  const selectAll = React.useCallback(() => {
    setSelectedIds(new Set(selectableIds));
  }, [selectableIds]);

  const deselectAll = React.useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const selectedCount = selectableIds.filter((id) => selectedIds.has(id)).length;
  const allSelected = selectedCount > 0 && selectedCount === selectableIds.length;

  // Auto-select newly done files
  const prevDoneRef = React.useRef<Set<string>>(new Set());
  React.useEffect(() => {
    const prev = prevDoneRef.current;
    const newlyDone = files.filter((f) => f.status === "done" && !prev.has(f.id));
    if (newlyDone.length > 0) {
      prevDoneRef.current = new Set([...prev, ...newlyDone.map((f) => f.id)]);
      setSelectedIds((sel) => {
        const next = new Set(sel);
        for (const f of newlyDone) next.add(f.id);
        return next;
      });
    }
    const currentIds = new Set(files.map((f) => f.id));
    if (prev.size > files.length) {
      prevDoneRef.current = new Set([...prev].filter((id) => currentIds.has(id)));
    }
  }, [files]);

  // Upload handler: select new, deselect done
  const handleAddFiles = React.useCallback((incoming: FileList | File[]) => {
    const newIds = addFiles(incoming);
    if (newIds.length > 0) {
      setSelectedIds((prev) => {
        const next = new Set<string>();
        for (const id of prev) {
          const f = files.find((x) => x.id === id);
          if (f && f.status !== "done") next.add(id);
        }
        for (const id of newIds) next.add(id);
        return next;
      });
    }
  }, [addFiles, files]);

  const canResize = (hasIdle || selectedCount > 0) && !hasWorking;

  const handleResize = () => {
    if (selectedCount > 0) {
      resizeAll([...selectedIds]);
    } else {
      resizeAll();
    }
  };

  // Determine which idle file gets the live preview.
  const previewCandidateId = React.useMemo(() => {
    const selectedIdle = files.find((f) => selectedIds.has(f.id) && f.status === "idle");
    if (selectedIdle) return selectedIdle.id;
    const firstIdle = files.find((f) => f.status === "idle");
    return firstIdle?.id;
  }, [files, selectedIds]);

  const previewFile = React.useMemo(
    () => (previewCandidateId ? files.find((f) => f.id === previewCandidateId) : undefined),
    [previewCandidateId, files],
  );

  const livePreview = useResizePreview(previewFile, options, true);

  const resizeLabel = selectedCount > 0
    ? `Resize ${selectedCount} Selected`
    : files.length > 1
      ? "Resize All"
      : "Resize";

  const resizeButton = canResize ? (
    <div className="flex flex-col items-center gap-2">
      <Button
        size="lg"
        onClick={handleResize}
        className="flex w-full max-w-md items-center justify-center gap-2 bg-brand-gradient py-6 text-base font-semibold text-white hover:opacity-90 lg:w-full lg:max-w-none"
      >
        <Maximize2 className="size-5" />
        {resizeLabel}
      </Button>
      {selectableIds.length > 1 && (
        <button
          type="button"
          onClick={allSelected ? deselectAll : selectAll}
          className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          {allSelected ? (
            <><Square className="size-3" /> Deselect all</>
          ) : (
            <><CheckSquare className="size-3" /> Select all</>
          )}
        </button>
      )}
    </div>
  ) : null;

  const downloadAll = () => {
    for (const f of files) {
      if (!f.result) continue;
      const a = document.createElement("a");
      a.href = f.result.url;
      const base = f.file.name.replace(/\.[^.]+$/, "");
      const ext = f.result.format.replace("image/", "").replace("jpeg", "jpg");
      a.download = `${base}-${f.result.width}x${f.result.height}.${ext}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const settingsRef = React.useRef<HTMLDivElement>(null);
  const fileListRef = React.useRef<HTMLDivElement>(null);

  return (
    <section id="resize" className="relative scroll-mt-20 py-8 md:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
            <Maximize2 className="size-3 text-brand" />
            Image resizer
          </span>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl">
            Resize images to any dimension
          </h2>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Set exact dimensions, pick from 20+ social media presets, or scale by
            percentage — all in your browser.
          </p>
        </div>

        {!hasFiles ? (
          <div className="mx-auto mt-6 max-w-3xl">
            <UploadCard onFiles={handleAddFiles} />
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="size-3.5 text-brand" /> Never uploaded to a server
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Layers className="size-3.5 text-brand" /> Batch resize supported
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Maximize2 className="size-3.5 text-brand" /> 20+ social media presets
              </span>
            </div>
          </div>
        ) : (
          <div className="mt-6 flex flex-col gap-4">
            <UploadCard onFiles={handleAddFiles} compact />

            <div className="hidden lg:flex lg:justify-center">{resizeButton}</div>

            <div className="grid gap-4 lg:grid-cols-[300px_minmax(0,1fr)]">
              <aside ref={settingsRef} className="lg:sticky lg:top-24 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto lg:pr-1 scroll-slim">
                <ResizeControls
                  options={options}
                  onChange={updateOptions}
                  onReset={resetOptions}
                  originalDimensions={firstFileDimensions}
                  showGrid={showGrid}
                  onShowGridChange={setShowGrid}
                />
                <div className="mt-4 lg:hidden">{resizeButton}</div>
              </aside>

              <div ref={fileListRef} className="flex min-w-0 flex-col gap-4">
                {/* Summary bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/70 bg-card/50 px-4 py-3 backdrop-blur">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {doneCount}/{files.length} resized
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={downloadAll}
                      disabled={doneCount === 0}
                      className="bg-brand-gradient text-white hover:opacity-90"
                    >
                      <Download className="size-4" />
                      Download all
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearAll}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="size-4" />
                      Clear
                    </Button>
                  </div>
                </div>

                {/* File list */}
                <div className="flex flex-col gap-4">
                  <AnimatePresence mode="popLayout">
                    {files.map((item) => (
                      <ResizeFileItem
                        key={item.id}
                        item={item}
                        onRemove={removeFile}
                        selected={selectedIds.has(item.id)}
                        onToggleSelect={toggleSelect}
                        resizePreview={item.id === previewCandidateId ? livePreview.preview : undefined}
                        isPreviewGenerating={item.id === previewCandidateId ? livePreview.isGenerating : undefined}
                        showGrid={showGrid}
                      />
                    ))}
                  </AnimatePresence>
                </div>

                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <ShieldCheck className="size-3.5 text-brand" />
                  All processing happens locally — your images never leave this device.
                  <ArrowRight className="size-3" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
