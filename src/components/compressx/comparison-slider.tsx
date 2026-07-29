"use client";

import * as React from "react";
import { RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

const MIN_ZOOM = 0.1;
const MAX_ZOOM = 10;
const ZOOM_SPEED = 0.0015;

interface ComparisonSliderProps {
  beforeSrc: string;
  afterSrc: string;
  beforeLabel?: string;
  afterLabel?: string;
  alt: string;
  className?: string;
  /** Dynamic background color extracted from the image */
  backgroundColor?: string | null;
  /** Whether the image has transparency (show checkerboard) */
  hasTransparency?: boolean;
}

export function ComparisonSlider({
  beforeSrc,
  afterSrc,
  beforeLabel = "Original",
  afterLabel = "Compressed",
  alt,
  className,
  backgroundColor,
  hasTransparency,
}: ComparisonSliderProps) {
  const [pos, setPos] = React.useState(50);
  const [zoom, setZoom] = React.useState(1);
  const [pan, setPan] = React.useState({ x: 0, y: 0 });
  const [containerW, setContainerW] = React.useState(0);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const draggingSliderRef = React.useRef(false);
  const panningRef = React.useRef(false);
  const [isPanning, setIsPanning] = React.useState(false);
  const panStartRef = React.useRef({ x: 0, y: 0, panX: 0, panY: 0 });

  // Keep zoom/pan in refs so the wheel handler always reads latest values
  const zoomRef = React.useRef(zoom);
  const panRef = React.useRef(pan);
  React.useEffect(() => { zoomRef.current = zoom; }, [zoom]);
  React.useEffect(() => { panRef.current = pan; }, [pan]);

  // Track container width for clip math
  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setContainerW(el.clientWidth));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const isZoomed = zoom > 1.01;

  /* ─── Clip math: convert viewport pos → local clip percentage ── */

  const clipPct = React.useMemo(() => {
    if (containerW === 0 || zoom <= 1.01) return pos;
    // The line is at visual position lineX from the container's left edge.
    // Convert that to local (un-zoomed) coordinate space.
    const lineX = (pos / 100) * containerW;
    const halfW = containerW / 2;
    const localX = (lineX - halfW) / zoom + halfW - pan.x / zoom;
    return Math.max(0, Math.min(100, (localX / containerW) * 100));
  }, [pos, zoom, pan.x, containerW]);

  /* ─── Slider logic ─────────────────────────────────────────────── */

  /** pos always represents viewport position (0-100% of container width) */
  const updateSliderFromClientX = (clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(0, Math.min(100, pct)));
  };

  const onSliderPointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    draggingSliderRef.current = true;
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    updateSliderFromClientX(e.clientX);
  };

  const onSliderPointerMove = (e: React.PointerEvent) => {
    if (!draggingSliderRef.current) return;
    updateSliderFromClientX(e.clientX);
  };

  const onSliderPointerUp = (e: React.PointerEvent) => {
    draggingSliderRef.current = false;
    (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
  };

  /* ─── Pan logic (active when zoomed) ──────────────────────────── */

  const onContainerPointerDown = (e: React.PointerEvent) => {
    if (
      (e.target as HTMLElement).closest("[data-slider-handle]") ||
      (e.target as HTMLElement).closest("[data-reset-btn]")
    )
      return;

    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);

    if (isZoomed) {
      panningRef.current = true;
      setIsPanning(true);
      panStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        panX: pan.x,
        panY: pan.y,
      };
    } else {
      draggingSliderRef.current = true;
      updateSliderFromClientX(e.clientX);
    }
  };

  const onContainerPointerMove = (e: React.PointerEvent) => {
    if (panningRef.current) {
      const dx = e.clientX - panStartRef.current.x;
      const dy = e.clientY - panStartRef.current.y;
      setPan({
        x: panStartRef.current.panX + dx,
        y: panStartRef.current.panY + dy,
      });
    } else if (draggingSliderRef.current) {
      updateSliderFromClientX(e.clientX);
    }
  };

  const onContainerPointerUp = (e: React.PointerEvent) => {
    panningRef.current = false;
    setIsPanning(false);
    draggingSliderRef.current = false;
    (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
  };

  /* ─── Scroll-to-zoom (non-passive wheel listener) ──────────────── */

  const clampZoom = (z: number) =>
    Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, Math.round(z * 1000) / 1000));

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
      // Update refs immediately so rapid wheel events don't read stale values
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

  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  /* ─── Keyboard: arrow keys move slider, +/- zoom ──────────────── */

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      setPos((p) => Math.max(0, p - 4));
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      setPos((p) => Math.min(100, p + 4));
    }
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

  /* ─── Derived style for the zoomed image wrapper ──────────────── */

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
          isZoomed ? "cursor-grab" : "cursor-ew-resize",
          isPanning && "cursor-grabbing",
          className,
        )}
        style={backgroundColor && !hasTransparency
          ? { backgroundColor }
          : undefined}
      role="slider"
      aria-label="Before and after comparison slider"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pos)}
      tabIndex={0}
      onKeyDown={onKeyDown}
    >
      {/* ── Zoomed image wrapper (ONLY images transform) ── */}
      <div className="absolute inset-0" style={imageWrapperStyle}>
        {/* After (compressed) — base layer, full width */}
        <img
          src={afterSrc}
          alt={`${alt} (compressed)`}
          className="pointer-events-none absolute inset-0 h-full w-full object-contain"
          draggable={false}
        />

        {/* Before (original) — clipped dynamically to align with the fixed line */}
        <img
          src={beforeSrc}
          alt={`${alt} (original)`}
          className="pointer-events-none absolute inset-0 h-full w-full object-contain"
          style={{ clipPath: `inset(0 ${100 - clipPct}% 0 0)` }}
          draggable={false}
        />
      </div>

      {/* ── Divider line (FIXED — never zooms or pans) ── */}
      <div
        data-slider-handle
        className="absolute inset-y-0 z-10 w-px bg-white/80 shadow-[0_0_4px_rgba(0,0,0,0.3)]"
        style={{ left: `${pos}%`, transform: "translateX(-50%)" }}
        onPointerDown={onSliderPointerDown}
        onPointerMove={onSliderPointerMove}
        onPointerUp={onSliderPointerUp}
        onPointerCancel={onSliderPointerUp}
      >
        {/* Simple line handle — a small vertical bar */}
        <div
          className={cn(
            "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-md",
            isZoomed
              ? "h-8 w-1.5 cursor-ew-resize"
              : "h-8 w-1.5 cursor-ew-resize opacity-0 group-hover:opacity-100 transition-opacity",
          )}
        />
      </div>

      {/* ── Labels (fixed in viewport) ── */}
      <span className="pointer-events-none absolute bottom-2.5 right-2.5 z-20 rounded-lg border border-white/15 bg-black/40 px-2.5 py-1 text-[10px] font-medium text-white shadow-lg backdrop-blur-xl">
        {afterLabel}
      </span>
      <span
        className="pointer-events-none absolute bottom-2.5 left-2.5 z-20 rounded-lg border border-white/15 bg-black/40 px-2.5 py-1 text-[10px] font-medium text-white shadow-lg backdrop-blur-xl"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      >
        {beforeLabel}
      </span>

      {/* ── Zoom percentage badge + reset (top-right, stays fixed) ── */}
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

      {/* ── Pan hint when zoomed ──────────────────────────── */}
      {isZoomed && !isPanning && (
        <div className="pointer-events-none absolute bottom-2 left-1/2 z-20 -translate-x-1/2 rounded-lg border border-white/15 bg-black/40 px-2 py-1 text-[9px] font-medium text-white/80 shadow-lg backdrop-blur-xl sm:bottom-3 sm:rounded-xl sm:px-3 sm:py-1.5 sm:text-[10px]">
          Drag to pan · Drag line to compare · Double-click to reset
        </div>
      )}
    </div>
  );
}