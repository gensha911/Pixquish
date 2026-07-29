// Smart image analysis — inspects an image and recommends optimal compression.

import type {
  ImageAnalysis,
  ImageCategory,
  CompressionOptions,
  CompressionSettings,
} from "./types";

const ANALYSIS_MAX_DIM = 220; // sample canvas longest edge
const EDGE_SAMPLE_DIM = 96; // luminance grid for edge detection

/** Loads a File into a drawable image source. Uses createImageBitmap when
 * available (faster, off-main-thread decode), falling back to <img>. */
export async function loadImageSource(
  file: File,
): Promise<{
  source: CanvasImageSource & { width?: number; height?: number };
  width: number;
  height: number;
}> {
  if (typeof createImageBitmap === "function") {
    try {
      const bitmap = await createImageBitmap(file);
      return {
        source: bitmap,
        width: bitmap.width,
        height: bitmap.height,
      };
    } catch {
      // fall through to <img>
    }
  }
  const url = URL.createObjectURL(file);
  try {
    const img = await loadHtmlImage(url);
    return { source: img, width: img.naturalWidth, height: img.naturalHeight };
  } finally {
    // The object URL is needed for the <img> only during decode; release after.
    URL.revokeObjectURL(url);
  }
}

function loadHtmlImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = () =>
      reject(new Error("Could not decode image. The file may be corrupt."));
    img.src = url;
  });
}

/** Builds a canvas of the given pixel dimensions. */
function makeCanvas(w: number, h: number): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  return canvas;
}

/** Draws `source` into a canvas scaled so the longest edge <= maxDim,
 * preserving aspect ratio. Returns the canvas + its pixel data. */
function drawSample(
  source: CanvasImageSource,
  origW: number,
  origH: number,
  maxDim: number,
): { ctx: CanvasRenderingContext2D; w: number; h: number } {
  const scale = Math.min(1, maxDim / Math.max(origW, origH));
  const w = Math.max(1, Math.round(origW * scale));
  const h = Math.max(1, Math.round(origH * scale));
  const canvas = makeCanvas(w, h);
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("Canvas 2D context unavailable.");
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(source, 0, 0, w, h);
  return { ctx, w, h };
}

/** Full analysis of an image. */
export function analyzeImage(
  file: File,
  source: CanvasImageSource,
  width: number,
  height: number,
): ImageAnalysis {
  const fileSize = file.size;
  const megapixels = (width * height) / 1_000_000;
  const aspectRatio = height === 0 ? 0 : width / height;

  // --- Sample for color + transparency analysis ---
  const sample = drawSample(source, width, height, ANALYSIS_MAX_DIM);
  const imgData = sample.ctx.getImageData(0, 0, sample.w, sample.h);
  const pixels = imgData.data;

  // Quantize to 5 bits/channel to estimate distinct colors cheaply.
  const colorSet = new Set<number>();
  let transparentCount = 0;
  const totalPx = sample.w * sample.h;
  // Also accumulate luminance samples on a coarse grid for edge detection.
  const lumGrid = new Float32Array(EDGE_SAMPLE_DIM * EDGE_SAMPLE_DIM);
  const gridScaleX = sample.w / EDGE_SAMPLE_DIM;
  const gridScaleY = sample.h / EDGE_SAMPLE_DIM;

  let sumLum = 0;
  let sumLumSq = 0;

  for (let y = 0; y < sample.h; y++) {
    for (let x = 0; x < sample.w; x++) {
      const idx = (y * sample.w + x) * 4;
      const r = pixels[idx];
      const g = pixels[idx + 1];
      const b = pixels[idx + 2];
      const a = pixels[idx + 3];
      if (a < 250) transparentCount++;
      // 5-bit per channel key
      const key =
        ((r >> 3) << 10) | ((g >> 3) << 5) | (b >> 3);
      colorSet.add(key);

      // luminance (Rec. 709)
      const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      sumLum += lum;
      sumLumSq += lum * lum;
    }
  }

  // Build luminance grid by sampling nearest pixel per grid cell (fast).
  for (let gy = 0; gy < EDGE_SAMPLE_DIM; gy++) {
    const sy = Math.min(sample.h - 1, Math.floor(gy * gridScaleY));
    for (let gx = 0; gx < EDGE_SAMPLE_DIM; gx++) {
      const sx = Math.min(sample.w - 1, Math.floor(gx * gridScaleX));
      const idx = (sy * sample.w + sx) * 4;
      const lum =
        0.2126 * pixels[idx] +
        0.7152 * pixels[idx + 1] +
        0.0722 * pixels[idx + 2];
      lumGrid[gy * EDGE_SAMPLE_DIM + gx] = lum;
    }
  }

  const meanLum = sumLum / (totalPx || 1);
  const variance = sumLumSq / (totalPx || 1) - meanLum * meanLum;
  const stdLum = Math.sqrt(Math.max(0, variance));

  // --- Edge density via Sobel on the luminance grid ---
  let edgeCount = 0;
  let edgeSum = 0;
  for (let y = 1; y < EDGE_SAMPLE_DIM - 1; y++) {
    for (let x = 1; x < EDGE_SAMPLE_DIM - 1; x++) {
      const i = y * EDGE_SAMPLE_DIM + x;
      const gx =
        -lumGrid[i - EDGE_SAMPLE_DIM - 1] -
        2 * lumGrid[i - 1] -
        lumGrid[i + EDGE_SAMPLE_DIM - 1] +
        lumGrid[i - EDGE_SAMPLE_DIM + 1] +
        2 * lumGrid[i + 1] +
        lumGrid[i + EDGE_SAMPLE_DIM + 1];
      const gy =
        -lumGrid[i - EDGE_SAMPLE_DIM - 1] -
        2 * lumGrid[i - EDGE_SAMPLE_DIM] -
        lumGrid[i - EDGE_SAMPLE_DIM + 1] +
        lumGrid[i + EDGE_SAMPLE_DIM - 1] +
        2 * lumGrid[i + EDGE_SAMPLE_DIM] +
        lumGrid[i + EDGE_SAMPLE_DIM + 1];
      const mag = Math.sqrt(gx * gx + gy * gy);
      edgeSum += mag;
      if (mag > 48) edgeCount++;
    }
  }
  const edgeCells = (EDGE_SAMPLE_DIM - 2) * (EDGE_SAMPLE_DIM - 2);
  const edgeDensity = Math.min(1, edgeCount / (edgeCells || 1));
  const avgEdge = edgeSum / (edgeCells || 1);

  // --- Gradient smoothness: high when std is low-ish and edges are gentle.
  // Photos of skies/skin have smooth regions; flat logos have near-zero std
  // but also near-zero color count — handled separately by category logic. */
  const smoothnessFromStd = Math.max(0, 1 - stdLum / 90);
  const smoothnessFromEdges = Math.max(0, 1 - avgEdge / 60);
  const gradientSmoothness = Math.round(
    (0.5 * smoothnessFromStd + 0.5 * smoothnessFromEdges) * 100,
  ) / 100;

  const transparencyRatio = totalPx ? transparentCount / totalPx : 0;
  const hasTransparency = transparencyRatio > 0.002;
  const colorCount = colorSet.size;
  // Logarithmic normalization for better discrimination across image types.
  const colorComplexity = Math.min(
    1,
    Math.log10(colorCount + 1) / Math.log10(9000),
  );

  const category = classifyImage({
    hasTransparency,
    colorCount,
    colorComplexity,
    edgeDensity,
    gradientSmoothness,
    megapixels,
  });

  return {
    width,
    height,
    aspectRatio,
    fileSize,
    hasTransparency,
    transparencyRatio: Math.round(transparencyRatio * 1000) / 1000,
    colorCount,
    colorComplexity: Math.round(colorComplexity * 100) / 100,
    edgeDensity: Math.round(edgeDensity * 100) / 100,
    gradientSmoothness,
    category,
    originalFormat: file.type || "image/unknown",
    megapixels: Math.round(megapixels * 100) / 100,
  };
}

function classifyImage(metrics: {
  hasTransparency: boolean;
  colorCount: number;
  colorComplexity: number;
  edgeDensity: number;
  gradientSmoothness: number;
  megapixels: number;
}): ImageCategory {
  const {
    hasTransparency,
    colorCount,
    colorComplexity,
    edgeDensity,
    gradientSmoothness,
    megapixels,
  } = metrics;

  if (hasTransparency) {
    // Few distinct colors + transparency → flat logo / icon.
    if (colorCount < 70) return "logo";
    return "illustration";
  }

  // Text/UI: very few colors, lots of hard edges, smallish.
  if (colorCount < 40 && edgeDensity > 0.22) return "text";

  // Screenshot: limited palette, sharp edges, modest resolution.
  if (colorComplexity < 0.45 && edgeDensity > 0.16 && megapixels < 2.5)
    return "screenshot";

  // Photo: rich colors and/or smooth gradients, typically larger.
  if ((colorComplexity > 0.6 && gradientSmoothness > 0.45) || megapixels > 2)
    return "photo";

  if (colorComplexity < 0.35) return "logo"; // flat color artwork, no alpha

  return "illustration";
}

/** Quality table per category + mode (0-1). Applied to lossy encoders only. */
const QUALITY_TABLE: Record<ImageCategory, Record<string, number>> = {
  photo: { quality: 0.9, balanced: 0.8, max: 0.66 },
  screenshot: { quality: 0.92, balanced: 0.82, max: 0.7 },
  text: { quality: 0.93, balanced: 0.85, max: 0.72 },
  illustration: { quality: 0.9, balanced: 0.8, max: 0.68 },
  logo: { quality: 0.95, balanced: 0.9, max: 0.82 },
  unknown: { quality: 0.9, balanced: 0.8, max: 0.68 },
};

/** Minimum quality floor per mode — the engine never goes below this even
 * when chasing a target size, to protect visual quality. */
const QUALITY_FLOOR: Record<string, number> = {
  quality: 0.55,
  balanced: 0.45,
  max: 0.32,
};

/** Minimum resize scale per mode when chasing a target. */
const SCALE_FLOOR: Record<string, number> = {
  quality: 0.9,
  balanced: 0.8,
  max: 0.6,
};

export function qualityFloor(mode: string): number {
  return QUALITY_FLOOR[mode] ?? 0.45;
}

export function scaleFloor(mode: string): number {
  return SCALE_FLOOR[mode] ?? 0.8;
}

/** Recommends encoder settings from analysis + user options. */
export function recommendSettings(
  analysis: ImageAnalysis,
  options: CompressionOptions,
): CompressionSettings {
  const { mode, format, quality } = options;
  const cat = analysis.category;

  // --- Format selection ---
  let outFormat: string;
  let reason: string;

  if (format === "original") {
    // Keep the source file's format — never auto-convert.
    outFormat = analysis.originalFormat;
    reason = `Keeping original format (${labelForFormat(outFormat)}).`;
  } else if (format !== "auto") {
    outFormat = format;
    reason = `Output format set by you (${labelForFormat(format)}).`;
  } else {
    const picked = pickAutoFormat(analysis);
    outFormat = picked.format;
    reason = picked.reason;
  }

  // --- Quality selection ---
  let chosenQuality: number;
  if (typeof quality === "number" && !Number.isNaN(quality)) {
    chosenQuality = clamp(quality, 0.1, 1);
    reason += ` Quality set manually to ${Math.round(chosenQuality * 100)}%.`;
  } else {
    chosenQuality = QUALITY_TABLE[cat][mode] ?? 0.8;
    reason += ` ${labelForMode(mode)} default for ${cat}: Q${Math.round(chosenQuality * 100)}.`;
  }

  // PNG is lossless — quality does not apply.
  if (outFormat === "image/png") {
    chosenQuality = 1;
  }

  // AVIF is lossy via canvas toBlob — quality applies normally.
  // No special handling needed; the mode-based quality is used.

  // --- Resize: honor maxDimension cap if provided, otherwise no resize ---
  let resizeScale = 1;
  if (options.maxDimension) {
    const longest = Math.max(analysis.width, analysis.height);
    if (longest > options.maxDimension) {
      resizeScale = options.maxDimension / longest;
    }
  }

  return {
    format: outFormat,
    quality: Math.round(chosenQuality * 1000) / 1000,
    resizeScale: Math.round(resizeScale * 1000) / 1000,
    reason,
  };
}

function pickAutoFormat(analysis: ImageAnalysis): {
  format: string;
  reason: string;
} {
  const cat = analysis.category;

  if (analysis.hasTransparency) {
    if (cat === "logo" && analysis.colorCount < 70) {
      // Flat logos compress better lossless as PNG and stay razor sharp.
      return {
        format: "image/png",
        reason: `Detected a flat logo with transparency (${analysis.colorCount} colors) — PNG keeps it crisp and lossless.`,
      };
    }
    // Illustrations / textured transparency → WebP (alpha + great compression).
    return {
      format: "image/webp",
      reason: `Transparency detected with rich color — WebP preserves the alpha channel while compressing efficiently.`,
    };
  }

  if (cat === "text" || cat === "screenshot") {
    return {
      format: "image/webp",
      reason: `Detected a ${cat} — WebP at high quality keeps text crisp without JPEG ringing artifacts.`,
    };
  }

  if (cat === "logo") {
    return {
      format: "image/png",
      reason: `Flat artwork with few colors — PNG is lossless and typically smaller here.`,
    };
  }

  // Photos and general illustrations → WebP (better than JPEG at equal quality).
  return {
    format: "image/webp",
    reason: `Detected a ${cat} — WebP delivers the best size-to-quality ratio.`,
  };
}

function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}

function labelForMode(mode: string): string {
  return mode === "quality"
    ? "Best Quality"
    : mode === "max"
      ? "Maximum Compression"
      : "Balanced";
}

function labelForFormat(format: string): string {
  switch (format) {
    case "image/jpeg":
      return "JPG";
    case "image/png":
      return "PNG";
    case "image/webp":
      return "WebP";
    case "image/avif":
      return "AVIF";
    default:
      return format;
  }
}
