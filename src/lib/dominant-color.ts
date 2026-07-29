// Extract a dominant background color from an image using canvas edge-pixel sampling.
// Returns an RGB string like "rgb(42, 128, 185)" suitable for CSS background-color.
//
// Strategy: focus on the BORDER pixels of the image (outer edge band),
// since those are what visually touch the container background.
// This creates a seamless blend where the image appears to float on the matching color.

const SAMPLE_SIZE = 64;
const EDGE_BAND = 0.18; // Sample outer 18% border on each side

/** Convert RGB to HSL. */
function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
  else if (max === g) h = ((b - r) / d + 2) * 60;
  else h = ((r - g) / d + 4) * 60;
  return [h, s, l];
}

/** Convert HSL to RGB. */
function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;
  if (h < 60) { r = c; g = x; }
  else if (h < 120) { r = x; g = c; }
  else if (h < 180) { g = c; b = x; }
  else if (h < 240) { g = x; b = c; }
  else if (h < 300) { r = x; b = c; }
  else { r = c; b = x; }
  return [
    Math.round((r + m) * 255),
    Math.round((g + m) * 255),
    Math.round((b + m) * 255),
  ];
}

/** Soften a color for a gentler, non-distracting background fill. */
function soften(r: number, g: number, b: number): [number, number, number] {
  const [h, s, l] = rgbToHsl(r, g, b);
  return hslToRgb(h, s * 0.5, Math.min(1, l * 1.08 + 0.03));
}

/** Check if a pixel is in the edge band of the image. */
function isEdgePixel(x: number, y: number, size: number, band: number): boolean {
  const threshold = Math.floor(size * band);
  return x < threshold || x >= size - threshold || y < threshold || y >= size - threshold;
}

/**
 * Extract dominant color and detect transparency from an image File.
 *
 * Algorithm:
 * 1. Downscale to 64×64 and read all pixels
 * 2. Detect transparency (>1% pixels with alpha < 128)
 * 3. Focus on EDGE/BORDER pixels (outer 18% band) — these visually touch the container
 * 4. Among edge pixels, pick the least-saturated 40% (backgrounds tend to be neutral)
 * 5. Average them and soften for a gentle fill
 *
 * Returns { color: string | null, hasTransparency: boolean }.
 */
export async function extractImageMeta(file: File): Promise<{
  color: string | null;
  hasTransparency: boolean;
}> {
  try {
    const bitmap = await createImageBitmap(file, {
      resizeWidth: SAMPLE_SIZE,
      resizeHeight: SAMPLE_SIZE,
      resizeQuality: "medium",
    });

    const canvas = document.createElement("canvas");
    canvas.width = SAMPLE_SIZE;
    canvas.height = SAMPLE_SIZE;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) { bitmap.close(); return { color: null, hasTransparency: false }; }
    ctx.drawImage(bitmap, 0, 0);
    bitmap.close();

    const imageData = ctx.getImageData(0, 0, SAMPLE_SIZE, SAMPLE_SIZE);
    const data = imageData.data;
    const totalPixels = SAMPLE_SIZE * SAMPLE_SIZE;

    interface Pixel { r: number; g: number; b: number; saturation: number; }
    const edgePixels: Pixel[] = [];
    let transparentCount = 0;

    for (let y = 0; y < SAMPLE_SIZE; y++) {
      for (let x = 0; x < SAMPLE_SIZE; x++) {
        const i = (y * SAMPLE_SIZE + x) * 4;
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];

        if (a < 128) {
          transparentCount++;
          continue;
        }

        // Only sample edge/border pixels — these create the visual blend
        if (isEdgePixel(x, y, SAMPLE_SIZE, EDGE_BAND)) {
          const [, sat] = rgbToHsl(r, g, b);
          edgePixels.push({ r, g, b, saturation: sat });
        }
      }
    }

    const hasTransparency = transparentCount / totalPixels > 0.01;

    // Fallback: if too few edge pixels (tiny image after downscale), use all pixels
    const useAllPixels = edgePixels.length < totalPixels * 0.1;
    const pool = useAllPixels
      ? (function () {
          const all: Pixel[] = [];
          for (let y = 0; y < SAMPLE_SIZE; y++) {
            for (let x = 0; x < SAMPLE_SIZE; x++) {
              const i = (y * SAMPLE_SIZE + x) * 4;
              if (data[i + 3] >= 128) {
                const [, sat] = rgbToHsl(data[i], data[i + 1], data[i + 2]);
                all.push({ r: data[i], g: data[i + 1], b: data[i + 2], saturation: sat });
              }
            }
          }
          return all;
        })()
      : edgePixels;

    if (pool.length === 0) return { color: null, hasTransparency };

    // Sort by saturation (ascending) — low saturation = neutral = likely background
    pool.sort((a, b) => a.saturation - b.saturation);

    // Take the least-saturated 40% of edge pixels
    const bgCount = Math.max(1, Math.floor(pool.length * 0.4));
    const bgPixels = pool.slice(0, bgCount);

    // Weighted average: give extra weight to corner pixels (most visually prominent)
    let rSum = 0, gSum = 0, bSum = 0, weightSum = 0;
    const cornerZone = Math.floor(SAMPLE_SIZE * EDGE_BAND * 1.5);

    for (const p of bgPixels) {
      // Find this pixel's approximate position (we don't store x,y, so use uniform weight)
      // Corner weighting is approximated by the edge sampling itself
      const w = 1;
      rSum += p.r * w;
      gSum += p.g * w;
      bSum += p.b * w;
      weightSum += w;
    }

    const avgR = Math.round(rSum / weightSum);
    const avgG = Math.round(gSum / weightSum);
    const avgB = Math.round(bSum / weightSum);

    const [sr, sg, sb] = soften(avgR, avgG, avgB);
    return { color: `rgb(${sr}, ${sg}, ${sb})`, hasTransparency };
  } catch {
    return { color: null, hasTransparency: false };
  }
}

/** Extract just the dominant color (convenience wrapper). */
export async function extractDominantColor(file: File): Promise<string | null> {
  const { color } = await extractImageMeta(file);
  return color;
}
