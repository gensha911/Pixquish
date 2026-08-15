"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  Trash2,
  Wand2,
  ArrowRight,
  ChevronUp,
  ChevronDown,
  ShieldCheck,
  Layers,
  Zap,
  Loader2,
  CheckSquare,
  Square,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatBytes } from "@/lib/compression";
import { UploadCard } from "./upload-card";
import { CompressionControls } from "./compression-controls";
import { FileItem } from "./file-item";
import { useCompressionWorkspace } from "./use-workspace";

export function ImageWorkspace() {
  // Selection state + ref must be declared before useCompressionWorkspace
  // so the ref is available when the hook is called.
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());
  const selectedIdsRef = React.useRef(selectedIds);
  React.useEffect(() => { selectedIdsRef.current = selectedIds; }, [selectedIds]);

  // Track whether the first/last file cards are currently in view, so the
  // "First image" / "Last image" navigation buttons can be hidden when their
  // target is already visible (no point jumping to a position you're at).
  const [firstInView, setFirstInView] = React.useState(true);
  const [lastInView, setLastInView] = React.useState(true);

  const {
    files,
    controls,
    addFiles,
    removeFile,
    clearAll,
    compressAll,
    reset,
    updateControls,
    totalSaved,
    doneCount,
  } = useCompressionWorkspace(selectedIdsRef);

  const hasIdle = files.some((f) => f.status === "idle" || f.status === "error");
  const hasWorking = files.some((f) => f.status === "working" || f.status === "queued");

  const selectableIds = files
    .filter((f) => f.status === "idle" || f.status === "error" || f.status === "done")
    .map((f) => f.id);
  const toggleSelect = React.useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);
  const selectAllIdle = React.useCallback(() => {
    setSelectedIds(new Set(selectableIds));
  }, [selectableIds]);
  const deselectAll = React.useCallback(() => {
    setSelectedIds(new Set());
  }, []);
  const selectedCount = selectableIds.filter((id) => selectedIds.has(id)).length;
  const allIdleSelected = selectedCount > 0 && selectedCount === selectableIds.length;
  // Auto-select files when they finish compressing.
  const prevDoneRef = React.useRef<Set<string>>(new Set());
  React.useEffect(() => {
    const prev = prevDoneRef.current;
    const newlyDone = files.filter(
      (f) => f.status === "done" && !prev.has(f.id),
    );
    if (newlyDone.length > 0) {
      prevDoneRef.current = new Set([
        ...prev,
        ...newlyDone.map((f) => f.id),
      ]);
      setSelectedIds((sel) => {
        const next = new Set(sel);
        for (const f of newlyDone) next.add(f.id);
        return next;
      });
    }
    // Also track files removed so ref doesn't grow forever.
    const currentIds = new Set(files.map((f) => f.id));
    if (prev.size > files.length) {
      const pruned = new Set([...prev].filter((id) => currentIds.has(id)));
      prevDoneRef.current = pruned;
    }
  }, [files]);

  // When new images are uploaded, select them and deselect done (compressed) files.
  // Uncompressed (idle/error) files keep their selection.
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

  const hasFiles = files.length > 0;
  const settingsRef = React.useRef<HTMLDivElement>(null);
  const fileListRef = React.useRef<HTMLDivElement>(null);
  const prevLenRef = React.useRef(files.length);

  // Mobile: scroll to compression settings when a new file is uploaded.
  React.useEffect(() => {
    const isMobile = window.innerWidth < 1024;
    if (!isMobile || !settingsRef.current) return;
    if (files.length > 0 && files.length !== prevLenRef.current) {
      const t = requestAnimationFrame(() => {
        settingsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
      prevLenRef.current = files.length;
      return () => cancelAnimationFrame(t);
    }
    prevLenRef.current = files.length;
  }, [files.length]);

  // Observe the first and last file cards. When a target is already in view,
  // its nav button is hidden (no point jumping to a position you can see).
  // When both are in view (short list), the whole nav row is hidden.
  React.useEffect(() => {
    if (files.length <= 1) {
      setFirstInView(true);
      setLastInView(true);
      return;
    }
    const list = fileListRef.current;
    if (!list) return;

    let observer: IntersectionObserver | null = null;
    // Defer to next frame so the just-rendered FileItems are queryable.
    const raf = requestAnimationFrame(() => {
      const items = list.querySelectorAll<HTMLElement>("[data-file-item]");
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];

      // Assume visible until the observer fires — avoids a flash of the
      // buttons on mount when the list is short and fits in the viewport.
      setFirstInView(true);
      setLastInView(true);

      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.target === first) setFirstInView(entry.isIntersecting);
            if (entry.target === last) setLastInView(entry.isIntersecting);
          }
        },
        // Trigger as soon as any part of the target is visible.
        { threshold: 0 },
      );
      observer.observe(first);
      observer.observe(last);
    });

    return () => {
      cancelAnimationFrame(raf);
      observer?.disconnect();
    };
  }, [files.length]);

  const handleCompress = () => {
    if (selectedCount > 0) {
      compressAll([...selectedIds]);
    } else {
      compressAll();
    }
    // Mobile: scroll to the file list area after clicking compress.
    const isMobile = window.innerWidth < 1024;
    if (isMobile && fileListRef.current) {
      requestAnimationFrame(() => {
        fileListRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  };

  const compressLabel = selectedCount > 0
    ? `Compress ${selectedCount} Selected`
    : files.length > 1
      ? "Compress All"
      : "Compress";
  const canCompress = (hasIdle || selectedCount > 0) && !hasWorking;

  const compressButton = canCompress ? (
    <div className="flex flex-col items-center gap-2">
      <Button
        size="lg"
        onClick={handleCompress}
        className="flex w-full max-w-md items-center justify-center gap-2 bg-brand-gradient py-6 text-base font-semibold text-white hover:opacity-90 lg:w-full lg:max-w-none"
      >
        <Zap className="size-5" />
        {compressLabel}
      </Button>
      {selectableIds.length > 1 && (
        <button
          type="button"
          onClick={allIdleSelected ? deselectAll : selectAllIdle}
          className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          {allIdleSelected ? (
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
      a.download = `${base}-pixquish.${ext}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <section id="workspace" className="relative scroll-mt-20 py-8 md:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
            <Wand2 className="size-3 text-brand" />
            Compression workspace
          </span>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl">
            Drop, tune, and download
          </h2>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Add images, pick your settings, and watch them shrink in real time —
            all without leaving your browser.
          </p>
        </div>

        {/* Empty state: big upload */}
        {!hasFiles ? (
          <div className="mx-auto mt-6 max-w-3xl">
            <UploadCard onFiles={handleAddFiles} />
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="size-3.5 text-brand" /> Never uploaded to a server
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Layers className="size-3.5 text-brand" /> Multiple files supported
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Wand2 className="size-3.5 text-brand" /> Smart per-image analysis
              </span>
            </div>
          </div>
        ) : (
          <div className="mt-6 flex flex-col gap-4">
            {/* Upload area at top (full width) */}
            <UploadCard onFiles={handleAddFiles} compact />

            {/* Compress button under upload — desktop only */}
            <div className="hidden lg:flex lg:justify-center">
              {compressButton}
            </div>

            {/* Controls left, Results right */}
            <div className="grid gap-4 lg:grid-cols-[300px_minmax(0,1fr)]">
              {/* Left sidebar: controls + compress button (mobile only) */}
              <aside ref={settingsRef} className="lg:sticky lg:top-24 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto lg:pr-1 scroll-slim">
                <CompressionControls
                  controls={controls}
                  onChange={updateControls}
                  onReset={reset}
                />

                {/* Compress button under controls — mobile only */}
                <div className="mt-4 lg:hidden">
                  {compressButton}
                </div>
              </aside>

            {/* Right: results */}
            <div ref={fileListRef} className="flex min-w-0 flex-col gap-4">
              {/* Summary bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/70 bg-card/50 px-4 py-3 backdrop-blur">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {doneCount}/{files.length} done
                    </p>
                    <p className="text-sm font-semibold tabular-nums">
                      {formatBytes(totalSaved)} saved total
                    </p>
                  </div>

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
                <AnimatePresence mode="sync">
                  {files.map((item) => (
                    <FileItem
                      key={item.id}
                      item={item}
                      onRemove={removeFile}
                      selectable
                      selected={selectedIds.has(item.id)}
                      onToggleSelect={toggleSelect}
                    />
                  ))}
                </AnimatePresence>
              </div>

              {/* Navigation: first / last image — hidden when target already in view */}
              {files.length > 1 && (!firstInView || !lastInView) && (
                <div className="flex items-center justify-center gap-2 py-2">
                  {!firstInView && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1.5"
                      onClick={() => {
                        const firstItem = fileListRef.current?.querySelector("[data-file-item]");
                        firstItem?.scrollIntoView({ behavior: "smooth", block: "start" });
                      }}
                    >
                      <ChevronUp className="size-3.5" />
                      First image
                    </Button>
                  )}
                  {!lastInView && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1.5"
                      onClick={() => {
                        const items = fileListRef.current?.querySelectorAll("[data-file-item]");
                        const lastItem = items?.[items.length - 1];
                        lastItem?.scrollIntoView({ behavior: "smooth", block: "end" });
                      }}
                    >
                      Last image
                      <ChevronDown className="size-3.5" />
                    </Button>
                  )}
                </div>
              )}

              {/* Footer hint */}
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