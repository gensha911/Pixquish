// Self-contained Web Worker for off-main-thread image compression.
// Uses OffscreenCanvas + convertToBlob to keep the UI thread free.

export type {};

interface EncodeRequest {
  id: number;
  imageBuffer: ArrayBuffer;
  imageType: string;
  origW: number;
  origH: number;
  scale: number;
  format: string;
  quality: number;
  fillWhite: boolean;
  isLossless: boolean;
  enableMultiStep: boolean;
  enableSharpen: boolean;
}

interface EncodeResponse {
  id: number;
  blob: Blob;
  width: number;
  height: number;
}

interface InitRequest {
  type: 'init';
  imageBuffer: ArrayBuffer;
  imageType: string;
}

interface InitResponse {
  type: 'ready';
  width: number;
  height: number;
}

interface EncodeSessionRequest {
  type: 'encode';
  id: number;
  scale: number;
  format: string;
  quality: number;
  fillWhite: boolean;
  isLossless: boolean;
  enableMultiStep: boolean;
  enableSharpen: boolean;
}

interface DoneRequest {
  type: 'done';
}

type WorkerMessage = InitRequest | EncodeSessionRequest | DoneRequest;

let cachedBitmap: ImageBitmap | null = null;
let cachedW = 0;
let cachedH = 0;

const ctx = self as unknown as DedicatedWorkerGlobalScope;

ctx.onmessage = async (e: MessageEvent<WorkerMessage>) => {
  const msg = e.data;

  if (msg.type === 'init') {
    try {
      const blob = new Blob([msg.imageBuffer], { type: msg.imageType });
      cachedBitmap = await createImageBitmap(blob);
      cachedW = cachedBitmap.width;
      cachedH = cachedBitmap.height;
      ctx.postMessage({ type: 'ready', width: cachedW, height: cachedH } as InitResponse);
    } catch (err) {
      console.error('Worker: failed to decode image', err);
      ctx.postMessage({ type: 'ready', width: 0, height: 0 } as InitResponse);
    }
    return;
  }

  if (msg.type === 'done') {
    if (cachedBitmap) {
      cachedBitmap.close();
      cachedBitmap = null;
    }
    return;
  }

  if (msg.type === 'encode' && cachedBitmap) {
    const { id, scale, format, quality, fillWhite, isLossless, enableMultiStep, enableSharpen } = msg;

    try {
      const result = await performEncode(
        cachedBitmap,
        cachedW,
        cachedH,
        scale,
        format,
        quality,
        fillWhite,
        isLossless,
        enableMultiStep,
        enableSharpen,
      );
      ctx.postMessage(
        { id, blob: result.blob, width: result.width, height: result.height } as EncodeResponse,
        [result.blob],
      );
    } catch (err) {
      console.error('Worker: encode failed', err);
      // Create a minimal fallback blob
      const fallback = new Blob([], { type: format });
      ctx.postMessage(
        { id, blob: fallback, width: 1, height: 1 } as EncodeResponse,
        [fallback],
      );
    }
  }
};

async function performEncode(
  source: ImageBitmap,
  origW: number,
  origH: number,
  scale: number,
  format: string,
  quality: number,
  fillWhite: boolean,
  isLossless: boolean,
  enableMultiStep: boolean,
  enableSharpen: boolean,
): Promise<{ blob: Blob; width: number; height: number }> {
  const targetW = Math.max(1, Math.round(origW * scale));
  const targetH = Math.max(1, Math.round(origH * scale));

  let canvas: OffscreenCanvas;

  if (enableMultiStep && scale < 0.85) {
    // Multi-step downscale: reduce in 50% increments for much sharper results
    canvas = multiStepDownscale(source, origW, origH, targetW, targetH, isLossless, scale);
  } else {
    // Single-step draw
    canvas = new OffscreenCanvas(targetW, targetH);
    const c = canvas.getContext('2d')!;
    if (isLossless && scale >= 1) {
      c.imageSmoothingEnabled = false;
    } else {
      c.imageSmoothingEnabled = true;
      c.imageSmoothingQuality = 'high';
    }
    c.drawImage(source, 0, 0, targetW, targetH);
  }

  // Apply unsharp mask after downscaling to restore edge crispness
  if (enableSharpen && scale < 0.85) {
    const sharpenAmount = scale < 0.4 ? 0.35 : scale < 0.7 ? 0.25 : 0.15;
    canvas = applyUnsharpMask(canvas, targetW, targetH, sharpenAmount);
  }

  // Fill white background for JPEG (no alpha support)
  if (fillWhite) {
    const c = canvas.getContext('2d')!;
    c.globalCompositeOperation = 'destination-over';
    c.fillStyle = '#ffffff';
    c.fillRect(0, 0, targetW, targetH);
  }

  const blob = await canvas.convertToBlob({
    type: format,
    quality: Math.min(1, Math.max(0, quality)),
  });

  return { blob, width: targetW, height: targetH };
}

/**
 * Multi-step downscale: reduces image in 50% increments.
 * Much sharper than a single large scale step because each 50% reduction
 * preserves detail better than arbitrary ratios.
 */
function multiStepDownscale(
  source: ImageBitmap | OffscreenCanvas,
  origW: number,
  origH: number,
  targetW: number,
  targetH: number,
  isLossless: boolean,
  scale: number,
): OffscreenCanvas {
  let currentSource: ImageBitmap | OffscreenCanvas = source;
  let curW = origW;
  let curH = origH;

  const smoothing = !(isLossless && scale >= 1);

  // Step down by 50% until we're within 2x of target
  while (curW / 2 > targetW && curH / 2 > targetH) {
    const nextW = Math.max(targetW, Math.round(curW / 2));
    const nextH = Math.max(targetH, Math.round(curH / 2));
    const oc = new OffscreenCanvas(nextW, nextH);
    const c = oc.getContext('2d')!;
    c.imageSmoothingEnabled = smoothing;
    if (smoothing) c.imageSmoothingQuality = 'high';
    c.drawImage(currentSource, 0, 0, nextW, nextH);
    currentSource = oc;
    curW = nextW;
    curH = nextH;
  }

  // Final step to exact target dimensions
  if (curW !== targetW || curH !== targetH) {
    const oc = new OffscreenCanvas(targetW, targetH);
    const c = oc.getContext('2d')!;
    c.imageSmoothingEnabled = smoothing;
    if (smoothing) c.imageSmoothingQuality = 'high';
    c.drawImage(currentSource, 0, 0, targetW, targetH);
    currentSource = oc;
  }

  return currentSource as OffscreenCanvas;
}

/**
 * Unsharp mask: sharpens edges lost during downscaling.
 * Uses a 3x3 convolution kernel: [0,-a,0,-a,1+4a,-a,0,-a,0]
 * where a is the sharpening amount (0.15-0.35).
 */
function applyUnsharpMask(
  canvas: OffscreenCanvas,
  w: number,
  h: number,
  amount: number,
): OffscreenCanvas {
  if (w < 3 || h < 3 || amount <= 0) return canvas;

  const ctx = canvas.getContext('2d')!;
  const imageData = ctx.getImageData(0, 0, w, h);
  const src = imageData.data;
  const out = new Uint8ClampedArray(src.length);

  // Copy all bytes (including alpha)
  out.set(src);

  const center = 1 + 4 * amount;
  const stride = w * 4;

  // Apply kernel to interior pixels
  for (let y = 1; y < h - 1; y++) {
    const rowOff = y * stride;
    for (let x = 1; x < w - 1; x++) {
      const i = rowOff + x * 4;
      for (let c = 0; c < 3; c++) {
        const val =
          center * src[i + c] -
          amount * src[i - 4 + c] -
          amount * src[i + 4 + c] -
          amount * src[i - stride + c] -
          amount * src[i + stride + c];
        out[i + c] = val; // Uint8ClampedArray auto-clamps to 0-255
      }
    }
  }

  const result = new OffscreenCanvas(w, h);
  const rctx = result.getContext('2d')!;
  rctx.putImageData(new ImageData(out, w, h), 0, 0);
  return result;
}
