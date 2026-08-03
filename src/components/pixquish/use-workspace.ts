"use client";

import * as React from "react";
import { extractImageMeta } from "@/lib/dominant-color";
import { compressImage } from "@/lib/compression";
import { loadImageSource, analyzeImage } from "@/lib/compression";
import type {
  CompressionMode,
  CompressionOptions,
  CompressionResult,
  ImageAnalysis,
  OutputFormat,
} from "@/lib/compression";

type FileStatus = "idle" | "queued" | "working" | "done" | "error";

export interface CompressFile {
  id: string;
  file: File;
  status: FileStatus;
  progress: number;
  result?: CompressionResult;
  error?: string;
  lastSig?: string;
  dominantColor?: string | null;
  hasTransparency?: boolean;
}

export interface WorkspaceControls {
  mode: CompressionMode;
  format: OutputFormat;
  quality: number | null; // null = auto
  targetSize: number | null; // null = off
}

const FORMAT_STORAGE_KEY = "pixquish:format";

const VALID_FORMATS = ["original", "auto", "image/webp", "image/avif", "image/jpeg", "image/png"];

function getStoredFormat(): OutputFormat {
  if (typeof window === "undefined") return "original";
  try {
    const stored = localStorage.getItem(FORMAT_STORAGE_KEY);
    if (stored && (VALID_FORMATS as readonly string[]).includes(stored)) {
      // Migrate old "auto" default → "original" (new default).
      if (stored === "auto") {
        localStorage.setItem(FORMAT_STORAGE_KEY, "original");
        return "original";
      }
      return stored as OutputFormat;
    }
  } catch { /* ignore */ }
  return "original";
}

const DEFAULT_CONTROLS: WorkspaceControls = {
  mode: "balanced",
  format: "original",
  quality: null,
  targetSize: null,
};

function genId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

function signature(c: WorkspaceControls): string {
  return JSON.stringify([c.mode, c.format, c.quality, c.targetSize]);
}

function toOptions(c: WorkspaceControls): CompressionOptions {
  return {
    mode: c.mode,
    format: c.format,
    quality: c.quality ?? undefined,
    targetSize: c.targetSize,
  };
}

interface CachedSource {
  source: CanvasImageSource & { width?: number; height?: number };
  width: number;
  height: number;
}

export function useCompressionWorkspace(selectedIdsRef?: React.RefObject<Set<string> | null>) {
  const [files, setFiles] = React.useState<CompressFile[]>([]);
  const [controls, setControls] = React.useState<WorkspaceControls>(() => ({
    ...DEFAULT_CONTROLS,
    format: getStoredFormat(),
  }));

  const filesRef = React.useRef(files);
  const controlsRef = React.useRef(controls);
  const sigRef = React.useRef(signature(controls));
  const compressSigRef = React.useRef(sigRef.current);
  const queueRef = React.useRef<Set<string>>(new Set());
  const runningRef = React.useRef(false);
  // Generation counter: incremented each time a NEW compress pass starts.
  // A result is only committed if its generation still matches the current
  // one — this prevents stale results from overwriting newer state when the
  // user changes settings again while a slow compress is mid-flight.
  const genRef = React.useRef(0);

  // Cache decoded image source + analysis per file id to skip re-decoding on re-compress.
  const sourceCacheRef = React.useRef<Map<string, CachedSource>>(new Map());
  const analysisCacheRef = React.useRef<Map<string, ImageAnalysis>>(new Map());

  React.useEffect(() => {
    filesRef.current = files;
  }, [files]);

  // Debounced auto-recompress: when controls change, wait a short moment
  // before triggering re-compression. This collapses rapid setting changes
  // (e.g. a user clicking through format options) into a single compress
  // pass instead of firing one pass per click — a big perceived-speed win
  // for format switches on large images.
  const recompressTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  React.useEffect(() => {
    controlsRef.current = controls;
    const sig = signature(controls);
    sigRef.current = sig;
    if (sig !== compressSigRef.current) {
      // Delay the re-compress so back-to-back control changes batch together.
      if (recompressTimerRef.current) clearTimeout(recompressTimerRef.current);
      recompressTimerRef.current = setTimeout(() => {
        recompressTimerRef.current = null;
        compressSigRef.current = sig;
        const selectedSet = selectedIdsRef?.current;
        const doneIds = filesRef.current
          .filter((f) => f.status === "done" && (!selectedSet || selectedSet.has(f.id)))
          .map((f) => f.id);
        if (doneIds.length > 0) {
          for (const id of doneIds) queueRef.current.add(id);
          pump();
        }
      }, 150);
    }
    return () => {
      if (recompressTimerRef.current) {
        clearTimeout(recompressTimerRef.current);
        recompressTimerRef.current = null;
      }
    };
  }, [controls]);

  function updateFile(id: string, patch: Partial<CompressFile>) {
    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...patch } : f)),
    );
  }

  /** Ensures cached source + analysis exist for a file. Loads if missing. */
  async function ensureCached(id: string, file: File): Promise<{
    cachedSource: CachedSource;
    cachedAnalysis: ImageAnalysis;
  }> {
    let cachedSource = sourceCacheRef.current.get(id);
    let cachedAnalysis = analysisCacheRef.current.get(id);

    if (!cachedSource) {
      const loaded = await loadImageSource(file);
      cachedSource = { source: loaded.source, width: loaded.width, height: loaded.height };
      sourceCacheRef.current.set(id, cachedSource);
    }

    if (!cachedAnalysis) {
      cachedAnalysis = analyzeImage(file, cachedSource.source, cachedSource.width, cachedSource.height);
      analysisCacheRef.current.set(id, cachedAnalysis);
    }

    return { cachedSource, cachedAnalysis };
  }

  /** Release cached bitmap for a file. */
  function releaseCache(id: string) {
    const cached = sourceCacheRef.current.get(id);
    if (cached && "close" in cached.source && typeof (cached.source as ImageBitmap).close === "function") {
      (cached.source as ImageBitmap).close();
    }
    sourceCacheRef.current.delete(id);
    analysisCacheRef.current.delete(id);
  }

  /** Process a single file through compression. `gen` is the generation this
   *  pass belongs to; if a newer pass has started by the time this finishes,
   *  the stale result is discarded to avoid clobbering newer state. */
  async function processOneFile(
    id: string,
    startSig: string,
    opts: CompressionOptions,
    gen: number,
  ) {
    const file = filesRef.current.find((f) => f.id === id);
    if (!file) return;

    const isRecompress = !!file.result;
    // Revoke old blob URLs (but keep result visible during re-compress).
    // For re-compresses, we preserve the old result so the card stays rendered.
    if (!isRecompress && file.result) {
      URL.revokeObjectURL(file.result.url);
      URL.revokeObjectURL(file.result.originalUrl);
    }
    updateFile(id, {
      status: "working",
      progress: 0.02,
      error: undefined,
      // Keep old result visible during re-compress
      ...(isRecompress ? {} : { result: undefined }),
    });

    try {
      const { cachedSource, cachedAnalysis } = await ensureCached(id, file.file);

      const result = await compressImage(
        file.file,
        opts,
        (p) => {
          // Don't update progress if a newer pass has superseded this one.
          if (genRef.current !== gen) return;
          updateFile(id, { progress: p });
        },
        cachedSource,
        cachedAnalysis,
        { formatVerified: isRecompress },
      );

      // Stale guard: if a newer compress pass started while this one was
      // running, discard this result rather than overwriting the newer state.
      if (genRef.current !== gen) return;

      // Revoke any intermediate blob URLs before storing fresh result.
      const prev = filesRef.current.find((f) => f.id === id);
      if (prev?.result) {
        URL.revokeObjectURL(prev.result.url);
        URL.revokeObjectURL(prev.result.originalUrl);
      }
      updateFile(id, {
        status: "done",
        progress: 1,
        result,
        lastSig: startSig,
        error: undefined,
      });
    } catch (err) {
      if (genRef.current !== gen) return;
      updateFile(id, {
        status: "error",
        error:
          err instanceof Error ? err.message : "Compression failed.",
      });
    }
  }

  async function pump() {
    if (runningRef.current) return;
    runningRef.current = true;
    try {
      // Each pump gets a fresh generation. Any in-flight work from a
      // previous generation will be discarded when it finishes.
      const gen = ++genRef.current;
      // Snapshot + clear: items added DURING this pass go into a fresh
      // queue and are processed by the recursive call below.
      const ids = [...queueRef.current];
      queueRef.current.clear();
      if (ids.length === 0) return;
      const startSig = sigRef.current;
      const opts = toOptions(controlsRef.current);
      // Fire all compressions in parallel — browser handles toBlob concurrency.
      await Promise.all(
        ids.map((id) => processOneFile(id, startSig, opts, gen)),
      );
      // If more files were queued while we were running, process them now
      // (the earlier pump() call would have returned early due to
      // runningRef). This prevents queued work from being silently dropped.
      if (queueRef.current.size > 0) {
        await pump();
      }
    } finally {
      runningRef.current = false;
    }
  }

  const addFiles = React.useCallback((incoming: FileList | File[]): string[] => {
    const arr = Array.from(incoming).filter((f) =>
      /image\/(jpeg|png|webp|avif)/i.test(f.type) || /\.(jpe?g|png|webp|avif)$/i.test(f.name),
    );
    if (arr.length === 0) return [];
    const created = arr.map((file) => ({
      id: genId(),
      file,
      status: "idle" as const,
      progress: 0,
      dominantColor: undefined as string | null | undefined,
      hasTransparency: undefined as boolean | undefined,
    }));
    setFiles((prev) => [...created, ...prev]);
    // Extract dominant color in background (non-blocking)
    for (const item of created) {
      extractImageMeta(item.file).then(({ color, hasTransparency }) => {
        updateFile(item.id, { dominantColor: color, hasTransparency });
      });
    }
    return created.map((c) => c.id);
  }, []);

  const removeFile = React.useCallback((id: string) => {
    queueRef.current.delete(id);
    releaseCache(id);
    setFiles((prev) => {
      const target = prev.find((f) => f.id === id);
      if (target?.result) {
        URL.revokeObjectURL(target.result.url);
        URL.revokeObjectURL(target.result.originalUrl);
      }
      return prev.filter((f) => f.id !== id);
    });
  }, []);

  const clearAll = React.useCallback(() => {
    queueRef.current.clear();
    // Release all cached bitmaps.
    for (const [id] of sourceCacheRef.current) releaseCache(id);
    setFiles((prev) => {
      for (const f of prev) {
        if (f.result) {
          URL.revokeObjectURL(f.result.url);
          URL.revokeObjectURL(f.result.originalUrl);
        }
      }
      return [];
    });
  }, []);

  const compressAll = React.useCallback((ids?: string[]) => {
    const pool = ids
      ? filesRef.current.filter(
          (f) => ids.includes(f.id) && (f.status === "idle" || f.status === "error" || f.status === "done"),
        )
      : filesRef.current.filter(
          (f) => (f.status === "idle" || f.status === "error") && f.lastSig === undefined,
        );
    if (pool.length === 0) return;
    compressSigRef.current = sigRef.current;
    for (const f of pool) queueRef.current.add(f.id);
    pump();
  }, []);

  const reset = React.useCallback(() => {
    try { localStorage.removeItem(FORMAT_STORAGE_KEY); } catch { /* ignore */ }
    setControls(DEFAULT_CONTROLS);
  }, []);

  const updateControls = React.useCallback(
    (patch: Partial<WorkspaceControls>) => {
      if (patch.format !== undefined) {
        try {
          localStorage.setItem(FORMAT_STORAGE_KEY, patch.format);
        } catch { /* ignore */ }
      }
      setControls((prev) => ({ ...prev, ...patch }));
    },
    [],
  );

  // Revoke object URLs and cached bitmaps on unmount.
  React.useEffect(() => {
    return () => {
      for (const f of filesRef.current) {
        if (f.result) {
          URL.revokeObjectURL(f.result.url);
          URL.revokeObjectURL(f.result.originalUrl);
        }
      }
      for (const [id] of sourceCacheRef.current) releaseCache(id);
    };
  }, []);

  const totalSaved = files.reduce(
    (sum, f) => sum + (f.result?.savedBytes ?? 0),
    0,
  );
  const doneCount = files.filter((f) => f.status === "done").length;

  /** Returns cached source + analysis for a file (stable ref, never recreates). */
  const getCachedData = React.useCallback(
    (id: string) => {
      const source = sourceCacheRef.current.get(id);
      const analysis = analysisCacheRef.current.get(id);
      if (!source || !analysis) return undefined;
      return {
        source: source.source,
        width: source.width,
        height: source.height,
        analysis,
      };
    },
    [],
  );

  return {
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
    getCachedData,
  };
}
