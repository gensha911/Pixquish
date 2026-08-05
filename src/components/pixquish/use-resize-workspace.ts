"use client";

import * as React from "react";
import { extractImageMeta } from "@/lib/dominant-color";
import { resizeImage, type ResizeOptions, type ResizeResult } from "@/lib/compression/resizer";

type FileStatus = "idle" | "working" | "done" | "error";

export interface ResizeFile {
  id: string;
  file: File;
  status: FileStatus;
  progress: number;
  result?: ResizeResult;
  error?: string;
  origW?: number;
  origH?: number;
  dominantColor?: string | null;
  hasTransparency?: boolean;
}

export const DEFAULT_RESIZE_OPTIONS: ResizeOptions = {
  width: null,
  height: null,
  scale: null,
  lockAspect: true,
  fit: "cover",
  format: "original",
  quality: null,
  containBgColor: "#000000ff",
  containBgMode: "color" as const,
  containBlur: 20,
  sharpen: false,
  sharpenAmount: 50,
  coverOffsetX: 50,
  coverOffsetY: 50,
};

function genId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

/** Cached decoded source bitmap for a file id. Avoids re-decoding on every
 *  option change (format switch, dimension tweak, etc.). */
interface CachedSource {
  bitmap: ImageBitmap;
}

export function useResizeWorkspace() {
  const [files, setFiles] = React.useState<ResizeFile[]>([]);
  const [options, setOptions] = React.useState<ResizeOptions>(DEFAULT_RESIZE_OPTIONS);
  const [showGrid, setShowGrid] = React.useState(false);
  const runningRef = React.useRef(false);
  const isFirstOptionsRef = React.useRef(true);
  const autoTimerRef = React.useRef<ReturnType<typeof setTimeout>>();

  // Bitmap cache: keyed by file id. Decoded once on addFiles, reused for both
  // the live preview and the final batch resize. Closed on remove/clear/unmount.
  const sourceCacheRef = React.useRef<Map<string, CachedSource>>(new Map());

  const releaseBitmap = React.useCallback((id: string) => {
    const cached = sourceCacheRef.current.get(id);
    if (cached) {
      cached.bitmap.close();
      sourceCacheRef.current.delete(id);
    }
  }, []);

  const updateOptions = React.useCallback((patch: Partial<ResizeOptions>) => {
    setOptions((prev) => ({ ...prev, ...patch }));
  }, []);

  const resetOptions = React.useCallback(() => {
    setOptions(DEFAULT_RESIZE_OPTIONS);
  }, []);

  /** Sync access to a cached bitmap (undefined if not yet decoded). */
  const getBitmap = React.useCallback((id: string): ImageBitmap | undefined => {
    return sourceCacheRef.current.get(id)?.bitmap;
  }, []);

  const addFiles = React.useCallback((incoming: FileList | File[]): string[] => {
    const arr = Array.from(incoming).filter((f) =>
      /image\/(jpeg|png|webp|avif)/i.test(f.type) || /\.(jpe?g|png|webp|avif)$/i.test(f.name),
    );
    if (arr.length === 0) return [];
    const created: ResizeFile[] = [];
    const loadPromises = arr.map(async (file) => {
      try {
        const bitmap = await createImageBitmap(file);
        const { color, hasTransparency } = await extractImageMeta(file);
        const id = genId();
        // Cache the decoded bitmap — reused for preview + final resize.
        sourceCacheRef.current.set(id, { bitmap });
        created.push({
          id,
          file,
          status: "idle",
          progress: 0,
          origW: bitmap.width,
          origH: bitmap.height,
          dominantColor: color,
          hasTransparency,
        });
        // Do NOT close bitmap — it's cached for reuse.
      } catch {
        created.push({
          id: genId(),
          file,
          status: "idle",
          progress: 0,
        });
      }
    });
    Promise.all(loadPromises).then(() => {
      const newIds = created.map((c) => c.id);
      setFiles((prev) => {
        // If settings are already configured (done files exist), auto-resize new files
        const hasDone = prev.some((f) => f.status === "done");
        if (hasDone && newIds.length > 0) {
          setTimeout(() => {
            resizeAllRef.current(newIds);
          }, 100);
        }
        return [...created, ...prev];
      });
    });
    return created.map((c) => c.id);
  }, []);

  const removeFile = React.useCallback((id: string) => {
    setFiles((prev) => {
      const target = prev.find((f) => f.id === id);
      if (target?.result) {
        URL.revokeObjectURL(target.result.url);
        URL.revokeObjectURL(target.result.originalUrl);
      }
      return prev.filter((f) => f.id !== id);
    });
    releaseBitmap(id);
  }, [releaseBitmap]);

  const clearAll = React.useCallback(() => {
    setFiles((prev) => {
      for (const f of prev) {
        if (f.result) {
          URL.revokeObjectURL(f.result.url);
          URL.revokeObjectURL(f.result.originalUrl);
        }
      }
      return [];
    });
    // Release all cached bitmaps
    sourceCacheRef.current.forEach((cached) => cached.bitmap.close());
    sourceCacheRef.current.clear();
  }, []);

  const resizeAll = React.useCallback(
    async (ids?: string[]) => {
      if (runningRef.current) return;
      const pool = ids
        ? files.filter(
            (f) =>
              ids.includes(f.id) &&
              (f.status === "idle" || f.status === "error" || f.status === "done"),
          )
        : files.filter((f) => f.status === "idle" || f.status === "error");

      if (pool.length === 0) return;
      runningRef.current = true;

      const currentOptions = { ...options };

      try {
        await Promise.all(
          pool.map(async (f) => {
            // Revoke old URLs
            if (f.result) {
              URL.revokeObjectURL(f.result.url);
              URL.revokeObjectURL(f.result.originalUrl);
            }
            setFiles((prev) =>
              prev.map((x) =>
                x.id === f.id
                  ? { ...x, status: "working" as const, progress: 0.02, error: undefined, result: undefined }
                  : x,
              ),
            );

            try {
              // Pass cached bitmap to skip re-decode (the big bottleneck).
              const cachedBitmap = sourceCacheRef.current.get(f.id)?.bitmap;
              const result = await resizeImage(f.file, currentOptions, (p) => {
                setFiles((prev) =>
                  prev.map((x) => (x.id === f.id ? { ...x, progress: p } : x)),
                );
              }, cachedBitmap);
              setFiles((prev) =>
                prev.map((x) =>
                  x.id === f.id
                    ? { ...x, status: "done" as const, progress: 1, result }
                    : x,
                ),
              );
            } catch (err) {
              setFiles((prev) =>
                prev.map((x) =>
                  x.id === f.id
                    ? {
                        ...x,
                        status: "error" as const,
                        error:
                          err instanceof Error
                            ? err.message
                            : "Resize failed.",
                      }
                    : x,
                ),
              );
            }
          }),
        );
      } finally {
        runningRef.current = false;
      }
    },
    [files, options],
  );

  // Keep a ref to the latest resizeAll so auto-effect can call it without stale closure
  const resizeAllRef = React.useRef(resizeAll);
  resizeAllRef.current = resizeAll;

  // Auto-resize when options change
  const optionsSig = React.useMemo(
    () => JSON.stringify([options.width, options.height, options.scale, options.lockAspect, options.fit, options.containBgColor, options.containBgMode, options.containBlur, options.format, options.quality, options.coverOffsetX, options.coverOffsetY]),
    [options.width, options.height, options.scale, options.lockAspect, options.fit, options.containBgColor, options.containBgMode, options.containBlur, options.format, options.quality, options.coverOffsetX, options.coverOffsetY],
  );

  React.useEffect(() => {
    if (isFirstOptionsRef.current) {
      isFirstOptionsRef.current = false;
      return;
    }
    if (files.length === 0 || runningRef.current) return;
    const hasProcessable = files.some((f) => f.status === "idle" || f.status === "done" || f.status === "error");
    if (!hasProcessable) return;

    clearTimeout(autoTimerRef.current);
    autoTimerRef.current = setTimeout(() => {
      // Reset done files to idle so they get re-processed
      setFiles((prev) => {
        let changed = false;
        const updated = prev.map((f) => {
          if (f.status === "done" && f.result) {
            URL.revokeObjectURL(f.result.url);
            URL.revokeObjectURL(f.result.originalUrl);
            changed = true;
            return { ...f, status: "idle" as const, result: undefined, progress: 0 };
          }
          return f;
        });
        return changed ? updated : prev;
      });
      // Wait for state flush then trigger resize
      setTimeout(() => {
        resizeAllRef.current();
      }, 0);
    }, 400);

    return () => clearTimeout(autoTimerRef.current);
  }, [optionsSig]);

  // Release all cached bitmaps on unmount
  React.useEffect(() => {
    return () => {
      sourceCacheRef.current.forEach((cached) => cached.bitmap.close());
      sourceCacheRef.current.clear();
    };
  }, []);

  const doneCount = files.filter((f) => f.status === "done").length;

  // Get dimensions of the first selected/idle file for aspect ratio
  const firstFileDimensions =
    files.find((f) => f.status === "idle" || f.status === "done") ?? null;

  return {
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
    firstFileDimensions: firstFileDimensions
      ? { width: firstFileDimensions.origW ?? 0, height: firstFileDimensions.origH ?? 0 }
      : null,
    getBitmap,
  };
}
