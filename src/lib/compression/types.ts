// Pixquish compression engine — shared types

export type CompressionMode = "quality" | "balanced" | "max";

export type OutputFormat = "original" | "auto" | "image/jpeg" | "image/webp" | "image/png" | "image/avif";

export type ImageCategory =
  | "photo"
  | "screenshot"
  | "illustration"
  | "logo"
  | "text"
  | "unknown";

export interface ImageAnalysis {
  width: number;
  height: number;
  aspectRatio: number;
  fileSize: number;
  hasTransparency: boolean;
  transparencyRatio: number;
  colorCount: number;
  colorComplexity: number;
  edgeDensity: number;
  gradientSmoothness: number;
  category: ImageCategory;
  originalFormat: string;
  megapixels: number;
}

export interface CompressionSettings {
  format: string;
  quality: number;
  resizeScale: number;
  reason: string;
}

export interface CompressionOptions {
  mode: CompressionMode;
  format: OutputFormat;
  /** Optional manual quality override (0-1). When set, the engine uses this
   * value instead of the mode-derived default (target-size search still
   * overrides this). */
  quality?: number;
  /** Optional target output size in bytes. When set, a binary search finds
   * the closest achievable size while protecting visual quality. */
  targetSize?: number | null;
  /** Optional cap on the longest edge in pixels. */
  maxDimension?: number;
}

export interface CompressionResult {
  blob: Blob;
  url: string;
  width: number;
  height: number;
  format: string;
  quality: number;
  size: number;
  settings: CompressionSettings;
  analysis: ImageAnalysis;
  originalSize: number;
  originalUrl: string;
  savedBytes: number;
  savedPercent: number;
  loadImprovement: number;
  targetMet: boolean | null;
  targetSize: number | null;
  note?: string;
  durationMs: number;
}

export const MODE_LABELS: Record<CompressionMode, string> = {
  quality: "Best Quality",
  balanced: "Balanced",
  max: "Maximum Compression",
};

export const FORMAT_LABELS: Record<OutputFormat, string> = {
  original: "Same as original",
  auto: "Auto (recommended)",
  "image/jpeg": "JPG",
  "image/webp": "WebP",
  "image/png": "PNG",
  "image/avif": "AVIF",
};

export const TARGET_SIZE_PRESETS = [
  { label: "20 KB", value: 20 * 1024 },
  { label: "50 KB", value: 50 * 1024 },
  { label: "100 KB", value: 100 * 1024 },
  { label: "200 KB", value: 200 * 1024 },
  { label: "500 KB", value: 500 * 1024 },
  { label: "1 MB", value: 1024 * 1024 },
] as const;

export const ACCEPTED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
] as const;

export const ACCEPT_ATTR = ".jpg,.jpeg,.png,.webp,.avif,image/jpeg,image/png,image/webp,image/avif";
