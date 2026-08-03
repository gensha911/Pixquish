"use client";

import * as React from "react";
import {
  resizeImage,
  computeTargetDimensions,
  type ResizeOptions,
  type ResizeResult,
} from "@/lib/compression/resizer";
import type { ResizeFile } from "./use-resize-workspace";

export interface ResizePreviewState {
  preview: ResizeResult | null;
  isGenerating: boolean;
  error: string | null;
}

const DEBOUNCE_MS = 100;

export function useResizePreview(
  file: ResizeFile | undefined,
  options: ResizeOptions,
  enabled: boolean,
): ResizePreviewState {
  const [state, setState] = React.useState<ResizePreviewState>({
    preview: null,
    isGenerating: false,
    error: null,
  });

  // Track the *current* live URLs so we only revoke them when truly stale.
  const liveUrlsRef = React.useRef<{ url: string; originalUrl: string } | null>(null);
  // Keep a ref to the previous preview result so we can show it while the next one generates.
  const prevPreviewRef = React.useRef<ResizeResult | null>(null);
  const versionRef = React.useRef(0);

  function revokeUrls(urls: { url: string; originalUrl: string } | null) {
    if (urls) {
      URL.revokeObjectURL(urls.url);
      URL.revokeObjectURL(urls.originalUrl);
    }
  }

  const optionsSig = React.useMemo(
    () => JSON.stringify([options.width, options.height, options.scale, options.lockAspect, options.fit, options.containBgColor, options.containBgMode, options.containBlur, options.sharpen, options.sharpenAmount, options.format, options.quality, options.coverOffsetX, options.coverOffsetY]),
    [options.width, options.height, options.scale, options.lockAspect, options.fit, options.containBgColor, options.containBgMode, options.containBlur, options.sharpen, options.sharpenAmount, options.format, options.quality, options.coverOffsetX, options.coverOffsetY],
  );

  React.useEffect(() => {
    if (!file || !enabled || file.status !== "idle" || !file.origW || !file.origH) {
      // File gone or not eligible — clean up everything.
      revokeUrls(liveUrlsRef.current);
      liveUrlsRef.current = null;
      prevPreviewRef.current = null;
      setState({ preview: null, isGenerating: false, error: null });
      return;
    }

    // Check if resize would change anything
    const { width, height } = computeTargetDimensions(file.origW, file.origH, options);
    const noDimChange = width === file.origW && height === file.origH;
    const noFitChange = options.fit === "cover" || options.scale !== null;
    if (noDimChange && noFitChange && options.format === "original") {
      revokeUrls(liveUrlsRef.current);
      liveUrlsRef.current = null;
      prevPreviewRef.current = null;
      setState({ preview: null, isGenerating: false, error: null });
      return;
    }

    const version = ++versionRef.current;

    // Keep showing the current preview (or previous if exists) while generating.
    // Only mark as generating — don't clear the preview.
    setState((prev) => {
      // Save current preview so we can keep showing it
      if (prev.preview) {
        prevPreviewRef.current = prev.preview;
      }
      return {
        // Keep the preview visible (use previous if current was null)
        preview: prev.preview ?? prevPreviewRef.current,
        isGenerating: true,
        error: null,
      };
    });

    const timer = setTimeout(async () => {
      try {
        const result = await resizeImage(file.file, options);
        if (version !== versionRef.current) {
          URL.revokeObjectURL(result.url);
          URL.revokeObjectURL(result.originalUrl);
          return;
        }
        // New preview ready — revoke old URLs and update.
        revokeUrls(liveUrlsRef.current);
        liveUrlsRef.current = { url: result.url, originalUrl: result.originalUrl };
        prevPreviewRef.current = result;
        setState({ preview: result, isGenerating: false, error: null });
      } catch (err) {
        if (version !== versionRef.current) return;
        // On error, keep showing the previous preview
        setState((prev) => ({
          preview: prev.preview,
          isGenerating: false,
          error: err instanceof Error ? err.message : "Preview failed",
        }));
      }
    }, DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [file?.id, file?.status, file?.origW, file?.origH, optionsSig, enabled, file?.file, options]);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      revokeUrls(liveUrlsRef.current);
    };
  }, []);

  return state;
}
