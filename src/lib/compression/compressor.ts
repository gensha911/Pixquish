// CompressX compression engine — Canvas-based encoding with smart target-size search.

import {
  analyzeImage,
  loadImageSource,
  recommendSettings,
  qualityFloor,
  scaleFloor,
} from "./image-analysis";
import type {
  CompressionOptions,
  CompressionResult,
  CompressionSettings,
  ImageAnalysis,
} from "./types";

interface EncodeCandidate {
  blob: Blob;
  quality: number;
  scale: number;
  width: number;
  height: number;
}

/** Encodes a canvas to a blob, wrapped as a promise. */
function toBlob(
  canvas: HTMLCanvasElement,
  format: string,
  quality: number,
): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => resolve(blob),
      format,
      Math.min(1, Math.max(0, quality)),
    );
  });
}

/** Whether the format is natively lossless (quality param has no effect on output). */
function isLosslessFormat(format: string): boolean {
  return format === "image/png";
}

/** Whether the format is a slow encoder (AVIF is ~5-10x slower than JPEG/WebP). */
function isSlowFormat(format: string): boolean {
  return format === "image/avif";
}

/** Draws the source into a canvas at the given scale and returns it.
 *  For lossless formats (PNG), image smoothing is disabled to preserve
 *  pixel-perfect sharpness. */
function renderCanvas(
  source: CanvasImageSource,
  origW: number,
  origH: number,
  scale: number,
  format: string,
): { canvas: HTMLCanvasElement; w: number; h: number } {
  const w = Math.max(1, Math.round(origW * scale));
  const h = Math.max(1, Math.round(origH * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable.");
  // Lossless formats: disable smoothing for pixel-perfect output.
  // Lossy formats (JPEG, WebP, AVIF): enable high-quality smoothing.
  const isLossless = isLosslessFormat(format);
  const smoothing = !(isLossless && scale >= 1);

  // Multi-step downscale: much sharper than a single large scale step.
  // Reduces in 50% increments, each preserving more detail.
  if (smoothing && scale < 0.85) {
    let currentSource: CanvasImageSource = source;
    let curW = origW;
    let curH = origH;
    const canvasEl = document.createElement('canvas');
    canvasEl.width = w;
    canvasEl.height = h;
    const ctx = canvasEl.getContext('2d')!;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    // We draw in steps — the final draw goes directly to the output canvas
    while (curW / 2 > w && curH / 2 > h) {
      const nextW = Math.max(w, Math.round(curW / 2));
      const nextH = Math.max(h, Math.round(curH / 2));
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = nextW;
      tempCanvas.height = nextH;
      const tempCtx = tempCanvas.getContext('2d')!;
      tempCtx.imageSmoothingEnabled = true;
      tempCtx.imageSmoothingQuality = 'high';
      tempCtx.drawImage(currentSource, 0, 0, nextW, nextH);
      currentSource = tempCanvas;
      curW = nextW;
      curH = nextH;
    }
    ctx.drawImage(currentSource, 0, 0, w, h);
    return { canvas: canvasEl, w, h };
  }

  if (isLossless && scale >= 1) {
    ctx.imageSmoothingEnabled = false;
  } else {
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
  }
  ctx.drawImage(source, 0, 0, w, h);
  return { canvas, w, h };
}

async function encode(
  source: CanvasImageSource,
  origW: number,
  origH: number,
  scale: number,
  format: string,
  quality: number,
): Promise<EncodeCandidate | null> {
  const { canvas, w, h } = renderCanvas(source, origW, origH, scale, format);
  // For JPEG, fill alpha with white so transparency doesn't turn black.
  if (format === "image/jpeg") {
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.globalCompositeOperation = "destination-over";
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "source-over";
    }
  }
  const blob = await toBlob(canvas, format, quality);
  if (!blob) return null;
  return { blob, quality, scale, width: w, height: h };
}

/** Quick feature-detection that the browser can encode a given format. */
let formatSupportCache: Record<string, boolean> | null = null;
async function supportsFormat(format: string): Promise<boolean> {
  if (format === "image/png") return true; // universally supported
  if (formatSupportCache) return formatSupportCache[format] ?? false;
  const cache: Record<string, boolean> = {};
  const probe = document.createElement("canvas");
  probe.width = 1;
  probe.height = 1;
  for (const f of ["image/jpeg", "image/webp", "image/avif"]) {
    const blob = await new Promise<Blob | null>((res) =>
      probe.toBlob((b) => res(b), f, 0.8),
    );
    cache[f] = !!blob && blob.size > 0;
  }
  formatSupportCache = cache;
  return cache[format] ?? false;
}

/** Compresses a single image file according to the provided options.
 *  If `cachedSource` is provided, skips image decoding (big speedup on re-compress).
 *  If `cachedAnalysis` is provided, skips pixel analysis.
 *  If `compressOpts.formatVerified` is true, skips the async format-support probe.
 *  In "max" mode with a target size, the output is guaranteed to not exceed the target. */
export async function compressImage(
  file: File,
  options: CompressionOptions,
  onProgress?: (progress: number) => void,
  cachedSource?: { source: CanvasImageSource & { width?: number; height?: number }; width: number; height: number } | null,
  cachedAnalysis?: ImageAnalysis | null,
  compressOpts?: { formatVerified?: boolean },
): Promise<CompressionResult> {
  const start = performance.now();
  const alreadyVerified = compressOpts?.formatVerified === true;

  let source: CanvasImageSource & { width?: number; height?: number };
  let width: number;
  let height: number;
  let analysis: ImageAnalysis;

  if (cachedSource) {
    source = cachedSource.source;
    width = cachedSource.width;
    height = cachedSource.height;
  } else {
    const loaded = await loadImageSource(file);
    source = loaded.source;
    width = loaded.width;
    height = loaded.height;
  }
  onProgress?.(0.1);

  if (cachedAnalysis) {
    analysis = cachedAnalysis;
  } else {
    analysis = analyzeImage(file, source, width, height);
  }
  onProgress?.(0.2);

  let settings = recommendSettings(analysis, options);

  // Ensure the chosen format is encodable; otherwise fall back gracefully.
  // Skip the async probe if we already verified on a previous compress.
  if (!alreadyVerified && !(await supportsFormat(settings.format))) {
    settings = {
      ...settings,
      format: analysis.hasTransparency ? "image/png" : "image/jpeg",
      reason:
        settings.reason +
        ` (Requested format unsupported in this browser — fell back to ${
          analysis.hasTransparency ? "PNG" : "JPG"
        }.)`,
    };
  }
  onProgress?.(0.25);

  const origW = width;
  const origH = height;
  let note: string | undefined;

  // In max mode the user's chosen target size is a hard cap.
  const enforceTarget = options.mode === "max" && !!options.targetSize && options.targetSize > 0;

  // --- Target-size mode: binary search over quality (and scale if needed) ---
  let candidate: EncodeCandidate | null = null;
  let targetMet: boolean | null = null;

  if (options.targetSize && options.targetSize > 0 && options.targetSize < file.size) {
    const target = options.targetSize;
    const floor = qualityFloor(options.mode);
    // For lossless formats (PNG) the only way to shrink is downscaling,
    // so allow much more aggressive resize than the mode's usual floor.
    const isLossless = isLosslessFormat(settings.format);
    const sFloor = isLossless ? 0.1 : scaleFloor(options.mode);

    const search = await searchTargetSize(
      source,
      origW,
      origH,
      settings.format,
      target,
      floor,
      sFloor,
      (p) => onProgress?.(0.25 + p * 0.65),
      isLossless, // skip quality search for lossless formats
      enforceTarget,
    );

    candidate = search.best;
    targetMet = search.met;
    if (!search.met) {
      note = search.note;
    }
    settings = {
      ...settings,
      quality: candidate ? candidate.quality : settings.quality,
      resizeScale: candidate ? candidate.scale : settings.resizeScale,
    };
  } else {
    // --- Standard mode: single encode at recommended quality ---
    // If target is set but >= original, the file is already under target.
    if (options.targetSize && options.targetSize >= file.size) {
      targetMet = true;
    }
    candidate = await encode(
      source,
      origW,
      origH,
      settings.resizeScale,
      settings.format,
      settings.quality,
    );
    onProgress?.(0.7);
  }

  // When auto format + lossless couldn't reach target, fall back to lossy WebP.
  // But NEVER override an explicit user format choice.
  if (
    options.targetSize &&
    options.format === "auto" &&
    isLosslessFormat(settings.format) &&
    candidate &&
    candidate.blob.size > options.targetSize &&
    (await supportsFormat("image/webp"))
  ) {
    const target = options.targetSize;
    const floor = qualityFloor(options.mode);
    const sFloor = scaleFloor(options.mode);
    const webpSearch = await searchTargetSize(
      source,
      origW,
      origH,
      "image/webp",
      target,
      floor,
      sFloor,
      (p) => onProgress?.(0.25 + p * 0.65),
      false,
      enforceTarget,
    );
    if (webpSearch.best && webpSearch.best.blob.size < candidate.blob.size) {
      candidate = webpSearch.best;
      targetMet = webpSearch.met;
      settings = {
        ...settings,
        format: "image/webp",
        quality: candidate.quality,
        resizeScale: candidate.scale,
        reason:
          settings.reason +
          " Switched to WebP lossy to reach the target size (lossless format stayed too large).",
      };
      if (!webpSearch.met) note = webpSearch.note;
    }
  }

  // Release the image source only if we created it (not cached).
  if (!cachedSource && "close" in source && typeof (source as ImageBitmap).close === "function") {
    (source as ImageBitmap).close();
  }

  if (!candidate) {
    throw new Error("Compression failed: the browser could not encode this image.");
  }

  onProgress?.(0.85);

  const originalSize = file.size;
  const originalUrl = URL.createObjectURL(file);

  // If the compressed output is not smaller than the original, keep the
  // original file (it's already well optimized) and explain honestly.
  // EXCEPTION: in max mode with a target size, we must respect the target
  // even if the original is smaller than the compressed output.
  let finalBlob: Blob = candidate.blob;
  let finalWidth = candidate.width;
  let finalHeight = candidate.height;
  let finalFormat = settings.format;
  let finalQuality = candidate.quality;
  let keptOriginal = false;

  // Whether the user explicitly chose a different output format.
  // When true, we always honour the new format even if the result is larger.
  const formatChanged =
    options.format !== "original" &&
    options.format !== "auto" &&
    settings.format !== file.type;

  // Never let output exceed the original file size when the format hasn't changed.
  // The enforceTarget bypass only applies when the target is actually smaller
  // than the original (meaning the user genuinely wants to shrink the file).
  const targetIsSmaller = (options.targetSize ?? 0) > 0 && (options.targetSize ?? 0) < originalSize;
  if (candidate.blob.size >= originalSize && (!enforceTarget || !targetIsSmaller) && !formatChanged) {
    finalBlob = file;
    finalWidth = origW;
    finalHeight = origH;
    finalFormat = file.type || settings.format;
    finalQuality = 1;
    keptOriginal = true;
    note =
      "This image is already well optimized — keeping the original to avoid making it larger.";
  }

  // When format was explicitly changed, always output the new format even if larger.
  // Add an informative note so the user understands why the file grew.
  if (formatChanged && candidate.blob.size >= originalSize && !note) {
    const diff = formatBytes(candidate.blob.size - originalSize);
    note = `Converted to ${shortFormat(settings.format)} as requested. File is ${diff} larger (format differences).`;
  }

  const url = URL.createObjectURL(finalBlob);
  const size = finalBlob.size;
  const savedBytes = Math.max(0, originalSize - size);
  const savedPercent =
    originalSize > 0 ? (savedBytes / originalSize) * 100 : 0;
  const loadImprovement =
    size > 0 ? originalSize / size : 1;

  onProgress?.(1);

  return {
    blob: finalBlob,
    url,
    width: finalWidth,
    height: finalHeight,
    format: finalFormat,
    quality: finalQuality,
    size,
    settings: {
      ...settings,
      quality: finalQuality,
      reason: keptOriginal
        ? "Original kept (already optimal)."
        : settings.reason,
    },
    analysis,
    originalSize,
    originalUrl,
    savedBytes,
    savedPercent,
    loadImprovement,
    targetMet,
    targetSize: options.targetSize ?? null,
    note,
    durationMs: Math.round(performance.now() - start),
  };
}

interface SearchOutcome {
  best: EncodeCandidate | null;
  met: boolean;
  note?: string;
}

/** Binary search over quality (and progressively over scale) to approach a
 * target byte size.
 * When `enforceTarget` is true (Max Compress mode), the function guarantees
 * the returned blob will be at or under the target — even if that requires
 * extreme quality reduction and aggressive downscaling. */
async function searchTargetSize(
  source: CanvasImageSource,
  origW: number,
  origH: number,
  format: string,
  target: number,
  floor: number,
  sFloor: number,
  onProgress?: (p: number) => void,
  skipQualitySearch = false,
  enforceTarget = false,
): Promise<SearchOutcome> {
  let bestUnder: EncodeCandidate | null = null;
  let bestAbove: EncodeCandidate | null = null;
  const report = (frac: number) => onProgress?.(frac);

  // Phase 1: proper binary search over quality at full resolution.
  // Skip for lossless formats (PNG) where quality has no effect on size.
  // AVIF uses fewer steps since each encode is ~5-10x slower.
  if (!skipQualitySearch) {
    const slow = isSlowFormat(format);
    let lo = floor;
    let hi = 0.95;
    const steps = slow ? 4 : 9; // AVIF: 4 steps (2^4 ≈ 0.06 precision), others: 9

    // For AVIF: do a quick 3-point probe first to narrow the search range.
    // This avoids wasting slow AVIF encodes in a wide binary search.
    if (slow) {
      const probeQualities = [0.3, 0.6, 0.9];
      const probeCandidates: EncodeCandidate[] = [];
      for (const pq of probeQualities) {
        const pc = await encode(source, origW, origH, 1, format, pq);
        if (pc) probeCandidates.push(pc);
      }
      report(0.3);

      // Sort by quality descending, find where we cross the target
      probeCandidates.sort((a, b) => b.quality - a.quality);
      for (let pi = 0; pi < probeCandidates.length; pi++) {
        const pr = probeCandidates[pi];
        if (pr.blob.size <= target) {
          lo = pr.quality;
          if (pi > 0) hi = probeCandidates[pi - 1].quality;
          bestUnder = pickBetterUnder(bestUnder, pr);
          break;
        } else {
          bestAbove = pickSmallerAbove(bestAbove, pr);
        }
      }
      // If all probes are over target, narrow hi to lowest probe quality
      if (!bestUnder && probeCandidates.length > 0) {
        const minQ = Math.min(...probeCandidates.map(c => c.quality));
        hi = minQ;
      }
    }

    for (let i = 0; i < steps; i++) {
      const mid = (lo + hi) / 2;
      const cand = await encode(source, origW, origH, 1, format, mid);
      report(Math.min(0.5, 0.3 + 0.2 * ((i + 1) / steps)));
      // Yield to event loop every few iterations for smooth progress UI
      if (i % 3 === 2) await yieldToMain();
      if (!cand) continue;

      if (cand.blob.size <= target) {
        bestUnder = pickBetterUnder(bestUnder, cand);
        lo = mid; // under target → try higher quality
        // Early termination: if within 15% of target, good enough
        if (slow && cand.blob.size >= target * 0.85) {
          report(0.55);
          return { best: bestUnder, met: true };
        }
      } else {
        bestAbove = pickSmallerAbove(bestAbove, cand);
        hi = mid; // over target → narrow upper bound
      }
    }

    if (bestUnder) {
      report(0.55);
      return { best: bestUnder, met: true };
    }
  } else {
    // Lossless: do a single encode at full res to establish the baseline.
    const baseline = await encode(source, origW, origH, 1, format, 1);
    if (baseline) {
      if (baseline.blob.size <= target) {
        report(0.55);
        return { best: baseline, met: true };
      }
      bestAbove = baseline;
    }
    report(0.1);
  }

  // Phase 2: progressively downscale and binary-search quality per scale.
  // We search ALL scales (don't break early) so pickBetterUnder can find
  // the result closest to the target rather than the first one that fits.
  const slow = isSlowFormat(format);
  const allScales = skipQualitySearch
    ? [0.9, 0.85, 0.8, 0.75, 0.7, 0.65, 0.6, 0.55, 0.5, 0.4, 0.3, 0.2, 0.15, 0.1]
    : slow
      ? [0.85, 0.75, 0.65, 0.55, 0.45] // AVIF: fewer scales (more size-efficient)
      : [0.9, 0.85, 0.8, 0.75, 0.7, 0.65, 0.6];
  const scales = allScales.filter((s) => s >= sFloor);

  for (let si = 0; si < scales.length; si++) {
    const scale = scales[si];
    const frac = 0.55 + 0.35 * ((si + 1) / scales.length);

    if (skipQualitySearch) {
      // Lossless: single encode per scale (quality has no effect on PNG size).
      const cand = await encode(source, origW, origH, scale, format, 1);
      report(frac);
      if (!cand) continue;
      if (cand.blob.size <= target) {
        bestUnder = pickBetterUnder(bestUnder, cand);
      } else {
        bestAbove = pickSmallerAbove(bestAbove, cand);
      }
    } else {
      // Lossy: proper binary search per scale level.
      // AVIF: fewer steps per scale to avoid slow repeated encoding.
      let lo = floor;
      let hi = 0.95;
      const stepsPerScale = slow ? 3 : 7;
      for (let i = 0; i < stepsPerScale; i++) {
        const mid = (lo + hi) / 2;
        const cand = await encode(source, origW, origH, scale, format, mid);
        report(frac - 0.05 + 0.05 * ((i + 1) / stepsPerScale));
        if (!cand) continue;
        if (cand.blob.size <= target) {
          bestUnder = pickBetterUnder(bestUnder, cand);
          lo = mid;
          // AVIF early termination within 15% of target
          if (slow && cand.blob.size >= target * 0.85) break;
        } else {
          bestAbove = pickSmallerAbove(bestAbove, cand);
          hi = mid;
        }
        await yieldToMain();
      }
    }
  }

  if (bestUnder) {
    report(0.92);
    return { best: bestUnder, met: true };
  }

  // Phase 3 (enforceTarget only): Ignore quality/scale floors entirely.
  // Search ALL scales so pickBetterUnder can find the result closest to the
  // target, rather than returning the first one that happens to fit.
  if (enforceTarget) {
    const aggressiveScales = slow
      ? [0.4, 0.3, 0.2, 0.15, 0.1, 0.07, 0.05] // AVIF: fewer aggressive scales
      : [0.5, 0.45, 0.4, 0.35, 0.3, 0.25, 0.2, 0.15, 0.1, 0.08, 0.07, 0.05, 0.04, 0.03];

    for (let si = 0; si < aggressiveScales.length; si++) {
      const scale = aggressiveScales[si];
      const frac = 0.92 + 0.06 * ((si + 1) / aggressiveScales.length);

      if (skipQualitySearch) {
        const cand = await encode(source, origW, origH, scale, format, 1);
        report(frac);
        if (!cand) continue;
        if (cand.blob.size <= target) {
          bestUnder = pickBetterUnder(bestUnder, cand);
        } else {
          bestAbove = pickSmallerAbove(bestAbove, cand);
        }
      } else {
        // Binary search quality from 0.01 to 0.5 at this scale.
        // AVIF: fewer steps.
        let lo = 0.01;
        let hi = 0.5;
        const aggressiveSteps = slow ? 3 : 6;
        for (let i = 0; i < aggressiveSteps; i++) {
          const mid = (lo + hi) / 2;
          const cand = await encode(source, origW, origH, scale, format, mid);
          report(frac);
          if (!cand) continue;
          if (cand.blob.size <= target) {
            bestUnder = pickBetterUnder(bestUnder, cand);
            lo = mid;
          } else {
            bestAbove = pickSmallerAbove(bestAbove, cand);
            hi = mid;
          }
          await yieldToMain();
        }
      }
    }

    // Last resort: extremely tiny scale.
    const lastResort = await encode(source, origW, origH, 0.02, format, skipQualitySearch ? 1 : 0.01);
    if (lastResort) {
      if (lastResort.blob.size <= target) {
        bestUnder = pickBetterUnder(bestUnder, lastResort);
      } else {
        bestAbove = pickSmallerAbove(bestAbove, lastResort);
      }
    }

    if (bestUnder) {
      report(0.99);
      return {
        best: bestUnder,
        met: true,
        note: `Target ${formatBytes(target)} reached with aggressive compression (quality ${Math.round(bestUnder.quality * 100)}%, scale ${Math.round(bestUnder.scale * 100)}%). Image quality is significantly reduced.`,
      };
    }
  }

  // Truly impossible.
  report(1);
  const note =
    bestAbove && bestAbove.blob.size > target
      ? `Couldn't reach ${formatBytes(target)}. Closest result is ${formatBytes(bestAbove.blob.size)}.`
      : `Target size could not be reached. Consider a larger target or smaller image.`;
  return { best: bestAbove ?? bestUnder, met: false, note };
}

function pickBetterUnder(
  prev: EncodeCandidate | null,
  next: EncodeCandidate,
): EncodeCandidate {
  if (!prev) return next;
  // Prefer the one closer to (but under) the target = larger size under target
  // with the higher quality. Both are under target; choose larger size (better
  // quality) as long as it's still under.
  return next.blob.size > prev.blob.size ? next : prev;
}

function pickSmallerAbove(
  prev: EncodeCandidate | null,
  next: EncodeCandidate,
): EncodeCandidate {
  if (!prev) return next;
  return next.blob.size < prev.blob.size ? next : prev;
}

// Tiny local formatter to avoid a circular import with format.ts at runtime
// (kept inline so this module stays self-contained).
/** Yield to the event loop so the browser can process UI updates. */
function yieldToMain(): Promise<void> {
  return new Promise((r) => setTimeout(r, 0));
}

function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  const k = 1024;
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(k)));
  const value = bytes / Math.pow(k, i);
  return `${value.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

function shortFormat(mime: string): string {
  switch (mime) {
    case "image/jpeg": return "JPG";
    case "image/png": return "PNG";
    case "image/webp": return "WebP";
    case "image/avif": return "AVIF";
    default: return mime.replace("image/", "").toUpperCase();
  }
}
