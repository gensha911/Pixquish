// Pixquish Image Resizer — Canvas-based resize with presets and fit modes.
// Optimized: caches decoded bitmaps (caller-managed), always uses multi-step
// downscale for sharp results, and applies a quality ceiling for lossy formats
// so resize never visibly degrades quality.

export type FitMode = "cover" | "contain" | "stretch";
export type ContainBgMode = "color" | "blur";

export interface ResizePreset {
  label: string;
  width: number;
  height: number;
  category: string;
}

export interface ResizeOptions {
  width: number | null;
  height: number | null;
  scale: number | null; // percentage, e.g. 50 for 50%
  lockAspect: boolean;
  fit: FitMode;
  format: string; // "original" | mime type
  quality: number | null; // null = auto (0.95 for lossy, 1.0 for PNG)
  containBgColor: string; // hex/rgba for contain padding background
  /** Background mode for contain padding: solid color or blurred image. */
  containBgMode: ContainBgMode;
  /** Blur radius in pixels for blurred background (0–80). Only used when containBgMode="blur". */
  containBlur: number;
  /** Whether to apply unsharp mask sharpening after resize. */
  sharpen: boolean;
  /** Sharpen intensity 0–100 (maps to 0.0–1.5 internal). Only used when sharpen=true. */
  sharpenAmount: number;
  /** Cover crop X offset 0–100 (0=left, 50=center, 100=right). Only used when fit="cover". */
  coverOffsetX: number;
  /** Cover crop Y offset 0–100 (0=top, 50=center, 100=bottom). Only used when fit="cover". */
  coverOffsetY: number;
}

export const RESIZE_PRESETS: ResizePreset[] = [
  // Social media
  { label: "Instagram Post", width: 1080, height: 1080, category: "Social" },
  { label: "Instagram Story", width: 1080, height: 1920, category: "Social" },
  { label: "Instagram Landscape", width: 1080, height: 566, category: "Social" },
  { label: "X / Twitter Post", width: 1600, height: 900, category: "Social" },
  { label: "X / Twitter Header", width: 1500, height: 500, category: "Social" },
  { label: "Facebook Post", width: 1200, height: 630, category: "Social" },
  { label: "Facebook Cover", width: 820, height: 312, category: "Social" },
  { label: "LinkedIn Post", width: 1200, height: 627, category: "Social" },
  { label: "YouTube Thumbnail", width: 1280, height: 720, category: "Social" },
  { label: "Pinterest Pin", width: 1000, height: 1500, category: "Social" },
  // Web
  { label: "HD 1080p", width: 1920, height: 1080, category: "Web" },
  { label: "HD 720p", width: 1280, height: 720, category: "Web" },
  { label: "Web Banner", width: 1200, height: 300, category: "Web" },
  { label: "Favicon", width: 256, height: 256, category: "Web" },
  { label: "App Icon", width: 512, height: 512, category: "Web" },
  // Common
  { label: "4K UHD", width: 3840, height: 2160, category: "Common" },
  { label: "2K QHD", width: 2560, height: 1440, category: "Common" },
  { label: "Square 1000px", width: 1000, height: 1000, category: "Common" },
  { label: "Square 500px", width: 500, height: 500, category: "Common" },
  { label: "Widescreen", width: 1920, height: 1200, category: "Common" },
];

export interface ResizeResult {
  blob: Blob;
  url: string;
  width: number;
  height: number;
  originalWidth: number;
  originalHeight: number;
  format: string;
  quality: number;
  size: number;
  originalSize: number;
  originalUrl: string;
  durationMs: number;
}

/** Quality ceiling for lossy formats (JPEG, WebP, AVIF).
 *  Keeping this just under 1.0 avoids browser encoders that round quality up
 *  to lossless at 1.0 (which can paradoxically increase file size or introduce
 *  artifacts). 0.95 is visually indistinguishable from the original. */
const QUALITY_CEILING = 0.95;

/** Compute the target canvas dimensions given resize options and original size. */
export function computeTargetDimensions(
  origW: number,
  origH: number,
  opts: ResizeOptions,
): { width: number; height: number } {
  // Scale percentage takes priority
  if (opts.scale !== null && opts.scale > 0) {
    const s = opts.scale / 100;
    return { width: Math.max(1, Math.round(origW * s)), height: Math.max(1, Math.round(origH * s)) };
  }

  let w = opts.width ?? origW;
  let h = opts.height ?? origH;

  if (w <= 0 && h <= 0) return { width: origW, height: origH };

  // If only one dimension is set, compute the other from aspect ratio
  const aspect = origW / origH;
  if (w > 0 && h <= 0) {
    h = Math.max(1, Math.round(w / aspect));
  } else if (h > 0 && w <= 0) {
    w = Math.max(1, Math.round(h * aspect));
  }

  return { width: Math.max(1, Math.round(w)), height: Math.max(1, Math.round(h)) };
}

// ---------------------------------------------------------------------------
// Fit-mode draw layout (coordinates in ORIGINAL image space)
// ---------------------------------------------------------------------------

interface DrawLayout {
  /** Ideal intermediate size — multi-step targets this. */
  intW: number;
  intH: number;
  /** Source crop rect in ORIGINAL image coordinates. */
  origSx: number;
  origSy: number;
  origSw: number;
  origSh: number;
  /** Destination rect on the final canvas. */
  dx: number;
  dy: number;
  dw: number;
  dh: number;
  /** Fill background behind image (contain mode padding). */
  fillBackground: boolean;
}

function computeDrawLayout(
  origW: number,
  origH: number,
  canvasW: number,
  canvasH: number,
  fit: FitMode,
  coverOffsetX = 50,
  coverOffsetY = 50,
): DrawLayout {
  const imgRatio = origW / origH;
  const targetRatio = canvasW / canvasH;

  if (fit === "cover") {
    const scale = Math.max(canvasW / origW, canvasH / origH);
    const intW = Math.round(origW * scale);
    const intH = Math.round(origH * scale);
    const cropW = canvasW / scale;
    const cropH = canvasH / scale;
    const maxOffX = origW - cropW;
    const maxOffY = origH - cropH;
    const origSx = maxOffX > 0 ? maxOffX * (coverOffsetX / 100) : 0;
    const origSy = maxOffY > 0 ? maxOffY * (coverOffsetY / 100) : 0;
    return {
      intW, intH,
      origSx, origSy, origSw: cropW, origSh: cropH,
      dx: 0, dy: 0, dw: canvasW, dh: canvasH,
      fillBackground: false,
    };
  }

  if (fit === "contain") {
    const scale = Math.min(canvasW / origW, canvasH / origH);
    const dw = Math.round(origW * scale);
    const dh = Math.round(origH * scale);
    const dx = Math.round((canvasW - dw) / 2);
    const dy = Math.round((canvasH - dh) / 2);
    return {
      intW: dw, intH: dh,
      origSx: 0, origSy: 0, origSw: origW, origSh: origH,
      dx, dy, dw, dh,
      fillBackground: true,
    };
  }

  // stretch — maps full image to full canvas
  return {
    intW: canvasW, intH: canvasH,
    origSx: 0, origSy: 0, origSw: origW, origSh: origH,
    dx: 0, dy: 0, dw: canvasW, dh: canvasH,
    fillBackground: false,
  };
}

// ---------------------------------------------------------------------------
// Unsharp mask sharpening
// ---------------------------------------------------------------------------

/** Apply unsharp mask: sharpened = original + amount * (original - blurred).
 *  Operates on pixel data for maximum quality.
 *  Blur radius scales with output size for consistent results. */
function applyUnsharpMask(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  amount: number,
  blurRadius: number,
): void {
  const origData = ctx.getImageData(0, 0, width, height);
  const blurCanvas = document.createElement("canvas");
  blurCanvas.width = width;
  blurCanvas.height = height;
  const blurCtx = blurCanvas.getContext("2d")!;
  blurCtx.filter = `blur(${blurRadius}px)`;
  blurCtx.drawImage(ctx.canvas, 0, 0);
  const blurData = blurCtx.getImageData(0, 0, width, height);
  const src = origData.data;
  const blur = blurData.data;
  for (let i = 0, len = src.length; i < len; i += 4) {
    src[i]     = Math.min(255, Math.max(0, src[i]     + amount * (src[i]     - blur[i])));
    src[i + 1] = Math.min(255, Math.max(0, src[i + 1] + amount * (src[i + 1] - blur[i + 1])));
    src[i + 2] = Math.min(255, Math.max(0, src[i + 2] + amount * (src[i + 2] - blur[i + 2])));
  }
  ctx.putImageData(origData, 0, 0);
}

// ---------------------------------------------------------------------------
// Core resize
// ---------------------------------------------------------------------------

/** Resize a single image file according to the provided options.
 *
 *  @param file         The source image file.
 *  @param options      Resize options (dimensions, fit, format, etc.).
 *  @param onProgress   Optional progress callback (0–1).
 *  @param cachedBitmap Optional pre-decoded ImageBitmap. When provided, the
 *                      caller owns the bitmap and is responsible for closing it.
 *                      When omitted, this function decodes from `file` and
 *                      closes the bitmap when done.
 */
export async function resizeImage(
  file: File,
  options: ResizeOptions,
  onProgress?: (p: number) => void,
  cachedBitmap?: ImageBitmap,
): Promise<ResizeResult> {
  const start = performance.now();
  onProgress?.(0.1);

  // Use cached bitmap if provided (caller owns lifecycle); otherwise decode.
  const ownsBitmap = !cachedBitmap;
  const bitmap = cachedBitmap ?? await createImageBitmap(file);
  onProgress?.(0.3);

  const origW = bitmap.width;
  const origH = bitmap.height;

  const { width, height } = computeTargetDimensions(origW, origH, options);
  onProgress?.(0.4);

  const outputFormat = options.format === "original" ? file.type : options.format;
  // PNG is lossless — quality is ignored by toBlob. For lossy formats, cap at
  // 0.95 to avoid browser encoder quirks at 1.0 while staying visually lossless.
  const quality = options.quality ?? (outputFormat === "image/png" ? 1.0 : QUALITY_CEILING);

  // For scale mode, aspect is preserved automatically — stretch is exact fit.
  const fit = options.scale !== null ? ("stretch" as const) : options.fit;

  // ── Standard canvas path (always used — multi-step downscale for quality) ──
  const layout = computeDrawLayout(
    origW, origH, width, height, fit,
    options.coverOffsetX, options.coverOffsetY,
  );

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable.");

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  // Multi-step downscale for sharp results when shrinking significantly.
  // Halving each iteration preserves far more high-frequency detail than a
  // single-step resize, especially for large downscale ratios (e.g. 4K → 480p).
  const needsDownscale = layout.intW < origW * 0.85 || layout.intH < origH * 0.85;

  if (needsDownscale) {
    let currentSource: CanvasImageSource = bitmap;
    let curW = origW;
    let curH = origH;
    while (curW / 2 > layout.intW && curH / 2 > layout.intH) {
      const nextW = Math.max(layout.intW, Math.round(curW / 2));
      const nextH = Math.max(layout.intH, Math.round(curH / 2));
      const tmp = document.createElement("canvas");
      tmp.width = nextW;
      tmp.height = nextH;
      const tmpCtx = tmp.getContext("2d")!;
      tmpCtx.imageSmoothingEnabled = true;
      tmpCtx.imageSmoothingQuality = "high";
      tmpCtx.drawImage(currentSource, 0, 0, nextW, nextH);
      currentSource = tmp;
      curW = nextW;
      curH = nextH;
    }
    const s = curW / origW;
    ctx.drawImage(
      currentSource,
      layout.origSx * s, layout.origSy * s,
      layout.origSw * s, layout.origSh * s,
      layout.dx, layout.dy, layout.dw, layout.dh,
    );
  } else {
    ctx.drawImage(
      bitmap,
      layout.origSx, layout.origSy, layout.origSw, layout.origSh,
      layout.dx, layout.dy, layout.dw, layout.dh,
    );
  }
  onProgress?.(0.7);

  // Apply adaptive unsharp mask sharpening if enabled.
  if (options.sharpen && options.sharpenAmount > 0) {
    const scaleRatio = Math.min(width / origW, height / origH);
    if (scaleRatio < 0.98) {
      const downscaleFactor = Math.max(0, (0.98 - scaleRatio) / 0.48);
      const baseAmount = (options.sharpenAmount / 100) * 1.0;
      const effectiveAmount = baseAmount * downscaleFactor;
      const blurRadius = Math.max(0.5, Math.min(2.0, Math.min(width, height) / 800));
      if (effectiveAmount > 0.01) {
        applyUnsharpMask(ctx, width, height, effectiveAmount, blurRadius);
      }
    }
  }

  // Contain mode: fill the padding area behind the image.
  if (layout.fillBackground) {
    if (options.containBgMode === "blur") {
      const bgCanvas = document.createElement("canvas");
      bgCanvas.width = width;
      bgCanvas.height = height;
      const bgCtx = bgCanvas.getContext("2d")!;
      bgCtx.imageSmoothingEnabled = true;
      bgCtx.imageSmoothingQuality = "high";
      const bgScale = Math.max(width / origW, height / origH);
      const bgDrawW = Math.round(origW * bgScale);
      const bgDrawH = Math.round(origH * bgScale);
      const bgDx = Math.round((width - bgDrawW) / 2);
      const bgDy = Math.round((height - bgDrawH) / 2);
      const blurPx = Math.max(0, Math.min(80, options.containBlur || 20));
      bgCtx.filter = `blur(${blurPx}px)`;
      bgCtx.drawImage(bitmap, bgDx, bgDy, bgDrawW, bgDrawH);
      bgCtx.filter = "none";
      ctx.globalCompositeOperation = "destination-over";
      ctx.drawImage(bgCanvas, 0, 0);
      ctx.globalCompositeOperation = "source-over";
    } else {
      ctx.globalCompositeOperation = "destination-over";
      ctx.fillStyle = options.containBgColor || "#00000000";
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = "source-over";
    }
  }

  // JPEG has no alpha — fill with white behind everything.
  if (outputFormat === "image/jpeg") {
    ctx.globalCompositeOperation = "destination-over";
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
  }

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, outputFormat, Math.min(1, Math.max(0, quality))),
  );

  // Only close the bitmap if we decoded it (caller owns cached bitmaps).
  if (ownsBitmap) bitmap.close();

  if (!blob) throw new Error("Failed to encode resized image.");

  onProgress?.(0.95);
  const url = URL.createObjectURL(blob);
  const originalUrl = URL.createObjectURL(file);

  onProgress?.(1);
  return {
    blob, url, width, height,
    originalWidth: origW, originalHeight: origH,
    format: outputFormat, quality,
    size: blob.size, originalSize: file.size,
    originalUrl,
    durationMs: Math.round(performance.now() - start),
  };
}
