// Formatting helpers for the compression engine

export function formatBytes(bytes: number, decimals = 1): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  const k = 1024;
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.min(
    units.length - 1,
    Math.floor(Math.log(bytes) / Math.log(k)),
  );
  const value = bytes / Math.pow(k, i);
  const dp = i === 0 ? 0 : decimals;
  return `${value.toFixed(dp)} ${units[i]}`;
}

export function formatNumber(n: number, decimals = 0): string {
  return n.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function formatPercent(value: number, decimals = 0): string {
  return `${value.toFixed(decimals)}%`;
}

export function shortFormat(mime: string): string {
  switch (mime) {
    case "image/jpeg":
      return "JPG";
    case "image/png":
      return "PNG";
    case "image/webp":
      return "WebP";
    case "image/gif":
      return "GIF";
    case "image/avif":
      return "AVIF";
    default:
      return mime.replace("image/", "").toUpperCase();
  }
}

function categoryLabel(category: string): string {
  switch (category) {
    case "photo":
      return "Photo";
    case "screenshot":
      return "Screenshot";
    case "illustration":
      return "Illustration";
    case "logo":
      return "Logo";
    case "text":
      return "Text-heavy";
    default:
      return "Image";
  }
}

/** Human-readable dimensions, e.g. "1920 × 1080". */
export function formatDimensions(w: number, h: number): string {
  return `${formatNumber(w)} × ${formatNumber(h)}`;
}
