"use client";

import * as React from "react";
import { Loader2, ArrowRight, RotateCcw } from "lucide-react";
import { formatBytes } from "@/lib/compression";
import type { ResizeResult } from "@/lib/compression/resizer";
import { cn } from "@/lib/utils";

const MIN_ZOOM = 0.1;
const MAX_ZOOM = 10;
const ZOOM_SPEED = 0.0015;

interface ResizePreviewProps {
  preview: ResizeResult | null;
  isGenerating: boolean;
  alt: string;
  backgroundColor?: string | null;
  hasTransparency?: boolean;
  /** Show rule-of-thirds grid overlay on the preview */
  showGrid?: boolean;
}

/** Rule-of-thirds grid overlay using inline SVG with a proper viewBox.
 *  Dual-color lines (white + dark shadow) ensure visibility on any image background. */
function RuleOfThirdsGrid() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-10"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 300 300"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 h-full w-full"
      >
        {/* Dark shadow lines (slightly thicker for visibility) */}
        <line x1={100} y1={0} x2={100} y2={300} stroke="rgba(0,0,0,0.5)" strokeWidth={2} />
        <line x1={200} y1={0} x2={200} y2={300} stroke="rgba(0,0,0,0.5)" strokeWidth={2} />
        <line x1={0} y1={100} x2={300} y2={100} stroke="rgba(0,0,0,0.5)" strokeWidth={2} />
        <line x1={0} y1={200} x2={300} y2={200} stroke="rgba(0,0,0,0.5)" strokeWidth={2} />
        {/* White dashed lines on top */}
        <line x1={100} y1={0} x2={100} y2={300} stroke="rgba(255,255,255,0.7)" strokeWidth={1} strokeDasharray="8 6" />
        <line x1={200} y1={0} x2={200} y2={300} stroke="rgba(255,255,255,0.7)" strokeWidth={1} strokeDasharray="8 6" />
        <line x1={0} y1={100} x2={300} y2={100} stroke="rgba(255,255,255,0.7)" strokeWidth={1} strokeDasharray="8 6" />
        <line x1={0} y1={200} x2={300} y2={200} stroke="rgba(255,255,255,0.7)" strokeWidth={1} strokeDasharray="8 6" />
      </svg>
    </div>
  );
}

/** Image preview with scroll-to-zoom + drag-to-pan — matches the compressor's
 *  comparison slider zoom behavior, minus the before/after line. */
export function ResizeImagePreview({
  src,
  alt,
  backgroundColor,
  hasTransparency,
  showGrid,
  className,
}: {
  src: string;
  alt: string;
  backgroundColor?: string | null;
  hasTransparency?: boolean;
  showGrid?: boolean;
  className?: string;
}) {
  const [zoom, setZoom] = React.useState(1);
  const [pan, setPan] = React.useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = React.useState(false);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const panningRef = React.useRef(false);
  const panStartRef = React.useRef({ x: 0, y: 0, panX: 0, panY: 0 });

  // Keep zoom/pan in refs so the non-passive wheel handler always reads latest
  const zoomRef = React.useRef(zoom);
  const panRef = React.useRef(pan);
  React.useEffect(() => { zoomRef.current = zoom; }, [zoom]);
  React.useEffect(() => { panRef.current = pan; }, [pan]);

  const isZoomed = zoom > 1.01;

  const clampZoom = (z: number) =>
    Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, Math.round(z * 1000) / 1000));

  const handleResetZoom = React.useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  // Reset zoom/pan when the displayed image changes (new file / new result)
  React.useEffect(() => {
    handleResetZoom();
  }, [src, handleResetZoom]);

  /* ─── Scroll-to-zoom (non-passive wheel listener, cursor-anchored) ── */
  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      const z = zoomRef.current;
      const p = panRef.current;

      // Cursor position relative to container center
      const cx = e.clientX - rect.left - rect.width / 2;
      const cy = e.clientY - rect.top - rect.height / 2;

      // Dampened zoom: use sqrt of zoom so high-zoom doesn't accelerate wildly
      const dampFactor = Math.sqrt(z);
      const delta = -e.deltaY * ZOOM_SPEED * dampFactor;

      const next = clampZoom(z + delta);
      zoomRef.current = next;

      if (next <= 1.01) {
        panRef.current = { x: 0, y: 0 };
        setZoom(next);
        setPan({ x: 0, y: 0 });
        return;
      }

      // Adjust pan so the point under cursor stays fixed
      const ratio = next / z;
      const newPan = {
        x: cx - (cx - p.x) * ratio,
        y: cy - (cy - p.y) * ratio,
      };
      panRef.current = newPan;
      setPan(newPan);
      setZoom(next);
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, []);

  /* ─── Pan logic (active when zoomed) ─────────────────────────────── */
  const onContainerPointerDown = (e: React.PointerEvent) => {
    if (!isZoomed) return;
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    panningRef.current = true;
    setIsPanning(true);
    panStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      panX: pan.x,
      panY: pan.y,
    };
  };

  const onContainerPointerMove = (e: React.PointerEvent) => {
    if (!panningRef.current) return;
    const dx = e.clientX - panStartRef.current.x;
    const dy = e.clientY - panStartRef.current.y;
    setPan({
      x: panStartRef.current.panX + dx,
      y: panStartRef.current.panY + dy,
    });
  };

  const onContainerPointerUp = (e: React.PointerEvent) => {
    panningRef.current = false;
    setIsPanning(false);
    (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
  };

  /* ─── Keyboard: +/- to zoom, 0 to reset ───────────────────────────── */
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "+" || e.key === "=") {
      e.preventDefault();
      setZoom((prev) => clampZoom(prev + 0.25));
    }
    if (e.key === "-" || e.key === "_") {
      e.preventDefault();
      setZoom((prev) => {
        const next = clampZoom(prev - 0.25);
        if (next <= 1.01) setPan({ x: 0, y: 0 });
        return next;
      });
    }
    if (e.key === "0") {
      e.preventDefault();
      handleResetZoom();
    }
  };

  const imageWrapperStyle: React.CSSProperties = {
    transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
    transformOrigin: "center center",
    transition: isPanning ? "none" : "transform 0.15s ease-out",
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={onContainerPointerDown}
      onPointerMove={onContainerPointerMove}
      onPointerUp={onContainerPointerUp}
      onPointerCancel={onContainerPointerUp}
      onDoubleClick={handleResetZoom}
      className={cn(
        "group relative aspect-video w-full select-none overflow-hidden rounded-xl",
        hasTransparency ? "checkerboard" : "",
        isZoomed ? "cursor-grab" : "cursor-zoom-in",
        isPanning && "cursor-grabbing",
        className,
      )}
      style={
        backgroundColor && !hasTransparency
          ? { backgroundColor }
          : undefined
      }
      tabIndex={0}
      onKeyDown={onKeyDown}
      aria-label={`Resized image preview, zoom ${Math.round(zoom * 100)} percent`}
    >
      {/* Zoomed image wrapper — only the image transforms */}
      <div className="absolute inset-0" style={imageWrapperStyle}>
        <img
          src={src}
          alt={alt}
          className="pointer-events-none absolute inset-0 h-full w-full object-contain"
          draggable={false}
        />
      </div>

      {/* Rule-of-thirds grid overlay — preview only, never exported */}
      {showGrid && <RuleOfThirdsGrid />}

      {/* Zoom percentage badge + reset button (top-right, stays fixed) */}
      {isZoomed && (
        <div className="absolute top-2 right-2 z-30 flex items-center gap-1 sm:top-3">
          <span className="pointer-events-none rounded-lg border border-white/15 bg-black/40 px-2 py-0.5 text-[10px] font-semibold tabular-nums text-white/80 shadow-lg backdrop-blur-xl sm:rounded-xl sm:px-2.5 sm:py-1 sm:text-[11px]">
            {Math.round(zoom * 100)}%
          </span>
          <button
            type="button"
            data-reset-btn
            onClick={handleResetZoom}
            aria-label="Reset zoom"
            className="flex size-6 items-center justify-center rounded-lg border border-white/15 bg-black/40 text-white/80 shadow-lg backdrop-blur-xl transition-colors hover:bg-black/60 hover:text-white sm:size-7 sm:rounded-xl"
          >
            <RotateCcw className="size-3 sm:size-3.5" />
          </button>
        </div>
      )}

      {/* Pan hint when zoomed */}
      {isZoomed && !isPanning && (
        <div className="pointer-events-none absolute bottom-2 left-1/2 z-20 -translate-x-1/2 rounded-lg border border-white/15 bg-black/40 px-2 py-1 text-[9px] font-medium text-white/80 shadow-lg backdrop-blur-xl sm:bottom-3 sm:rounded-xl sm:px-3 sm:py-1.5 sm:text-[10px]">
          Drag to pan · Scroll to zoom · Double-click to reset
        </div>
      )}
    </div>
  );
}

export function ResizePreview({ preview, isGenerating, alt, backgroundColor, hasTransparency, showGrid }: ResizePreviewProps) {
  if (isGenerating && !preview) {
    return (
      <div className="flex h-40 items-center justify-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin text-brand" />
        <span>Generating preview…</span>
      </div>
    );
  }

  if (!preview) {
    return (
      <div className="flex h-24 items-center justify-center text-sm text-muted-foreground">
        Set dimensions above to see a preview
      </div>
    );
  }

  const sizeDiff = preview.size - preview.originalSize;
  const sizeChanged = Math.abs(sizeDiff) > 100; // > 100 bytes

  return (
    <div className="space-y-2.5">
      {/* Preview image only — no comparison line */}
      <ResizeImagePreview
        src={preview.url}
        alt={alt}
        backgroundColor={backgroundColor}
        hasTransparency={hasTransparency}
        showGrid={showGrid}
      />

      {/* Stats row */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
        <span className="text-muted-foreground">
          {preview.originalWidth}×{preview.originalHeight}
        </span>
        <ArrowRight className="size-3 text-brand" />
        <span className="font-semibold tabular-nums text-brand">
          {preview.width}×{preview.height}
        </span>
        <span className="text-muted-foreground">
          {formatBytes(preview.size)}
        </span>
        {sizeChanged && (
          <span
            className={cn(
              "font-medium tabular-nums",
              sizeDiff < 0 ? "text-emerald-500" : "text-amber-500",
            )}
          >
            {sizeDiff < 0 ? "" : "+"}
            {formatBytes(Math.abs(sizeDiff))}
          </span>
        )}
        {isGenerating && (
          <span className="ml-auto flex items-center gap-1 text-muted-foreground">
            <Loader2 className="size-3 animate-spin" />
            Updating…
          </span>
        )}
      </div>
    </div>
  );
}
