// Worker bridge — manages Web Worker pool for off-main-thread compression.
// Falls back to main-thread encoding when workers are unavailable.

interface EncodeParams {
  source: CanvasImageSource & { width?: number; height?: number };
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

interface EncodeResult {
  blob: Blob;
  width: number;
  height: number;
}

interface WorkerSession {
  worker: Worker;
  bitmap: ImageBitmap;
  w: number;
  h: number;
  busy: boolean;
}

let workerPool: WorkerSession[] | null = null;
let taskIdCounter = 0;
let workersAvailable = true;

/** Whether the worker infrastructure is supported in this browser. */
function checkWorkerSupport(): boolean {
  try {
    if (typeof Worker === 'undefined') return false;
    if (typeof OffscreenCanvas === 'undefined') return false;
    return true;
  } catch {
    return false;
  }
}

/** Initialize the worker pool. */
function initPool(): boolean {
  if (!checkWorkerSupport()) {
    workersAvailable = false;
    return false;
  }

  try {
    // Use up to navigator.hardwareConcurrency workers, minimum 2, max 4
    const count = Math.min(Math.max(navigator.hardwareConcurrency || 2, 2), 4);
    workerPool = [];
    for (let i = 0; i < count; i++) {
      const worker = new Worker(
        new URL('./compress.worker.ts', import.meta.url),
      );
      workerPool.push({
        worker,
        bitmap: null as unknown as ImageBitmap,
        w: 0,
        h: 0,
        busy: false,
      });
    }
    workersAvailable = true;
    return true;
  } catch (err) {
    console.warn('Worker pool init failed, falling back to main thread:', err);
    workersAvailable = false;
    return false;
  }
}

/** Get or create the worker pool. */
function getPool(): WorkerSession[] | null {
  if (!workersAvailable) return null;
  if (!workerPool) initPool();
  return workerPool;
}

/** Release the bitmap from a worker session. */
function releaseSession(session: WorkerSession) {
  try {
    session.worker.postMessage({ type: 'done' });
  } catch { /* ignore */ }
  session.bitmap = null as unknown as ImageBitmap;
  session.w = 0;
  session.h = 0;
  session.busy = false;
}

/** Send an image to a worker and get back an initialized session. */
async function initWorkerSession(
  session: WorkerSession,
  file: File,
): Promise<{ w: number; h: number } | null> {
  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      session.busy = false;
      resolve(null);
    }, 10000);

    const handler = (e: MessageEvent) => {
      if (e.data.type === 'ready') {
        clearTimeout(timeout);
        session.worker.removeEventListener('message', handler);
        session.w = e.data.width;
        session.h = e.data.height;
        session.busy = false;
        resolve({ w: e.data.width, h: e.data.height });
      }
    };

    session.worker.addEventListener('message', handler);
    session.busy = true;

    try {
      const buffer = await file.arrayBuffer();
      session.worker.postMessage(
        { type: 'init', imageBuffer: buffer, imageType: file.type },
        [buffer],
      );
    } catch {
      clearTimeout(timeout);
      session.busy = false;
      session.worker.removeEventListener('message', handler);
      resolve(null);
    }
  });
}

/**
 * Encode an image using the worker pool.
 * Falls back to main-thread encoding if workers aren't available.
 */
export async function workerEncode(
  file: File,
  params: EncodeParams,
): Promise<EncodeResult> {
  const pool = getPool();

  if (!pool) {
    // Fallback to main-thread encoding
    return mainThreadEncode(params);
  }

  // Find a free worker, or initialize one
  let session = pool.find((s) => !s.busy && s.w > 0);

  if (!session) {
    // Find an idle worker that hasn't been initialized yet
    session = pool.find((s) => !s.busy);
  }

  if (!session) {
    // All workers busy — fall back to main thread
    return mainThreadEncode(params);
  }

  // Initialize if needed
  if (session.w === 0) {
    const result = await initWorkerSession(session, file);
    if (!result || result.w === 0) {
      return mainThreadEncode(params);
    }
  }

  // Send encode request
  const id = ++taskIdCounter;

  const blob = await new Promise<Blob>((resolve, reject) => {
    const timeout = setTimeout(() => {
      session.busy = false;
      reject(new Error('Worker encode timed out'));
    }, 30000);

    const handler = (e: MessageEvent) => {
      if (e.data.id === id) {
        clearTimeout(timeout);
        session.worker.removeEventListener('message', handler);
        session.busy = false;
        resolve(e.data.blob);
      }
    };

    session.worker.addEventListener('message', handler);
    session.busy = true;

    try {
      session.worker.postMessage({
        type: 'encode',
        id,
        scale: params.scale,
        format: params.format,
        quality: params.quality,
        fillWhite: params.fillWhite,
        isLossless: params.isLossless,
        enableMultiStep: params.enableMultiStep,
        enableSharpen: params.enableSharpen,
      });
    } catch (err) {
      clearTimeout(timeout);
      session.worker.removeEventListener('message', handler);
      session.busy = false;
      reject(err);
    }
  });

  const w = Math.max(1, Math.round(params.origW * params.scale));
  const h = Math.max(1, Math.round(params.origH * params.scale));

  return { blob, width: w, height: h };
}

/**
 * Initialize a worker session for a file (call before batch encoding).
 * Returns true if the worker was initialized successfully.
 */
export async function prepareWorkerForFile(file: File): Promise<boolean> {
  const pool = getPool();
  if (!pool) return false;

  const session = pool.find((s) => !s.busy && s.w === 0);
  if (!session) return false;

  const result = await initWorkerSession(session, file);
  return result !== null && result.w > 0;
}

/** Release all worker sessions. */
export function releaseAllWorkers() {
  if (workerPool) {
    for (const session of workerPool) {
      releaseSession(session);
    }
  }
}

/**
 * Main-thread fallback encoding with multi-step downscale and sharpening.
 * Uses HTMLCanvasElement (not OffscreenCanvas).
 */
function mainThreadEncode(params: EncodeParams): EncodeResult {
  return new Promise((resolve, reject) => {
    const { source, origW, origH, scale, format, quality, fillWhite, isLossless, enableMultiStep, enableSharpen } = params;

    const targetW = Math.max(1, Math.round(origW * scale));
    const targetH = Math.max(1, Math.round(origH * scale));

    let canvas: HTMLCanvasElement;

    if (enableMultiStep && scale < 0.85) {
      canvas = mainThreadMultiStep(source, origW, origH, targetW, targetH, isLossless, scale);
    } else {
      canvas = document.createElement('canvas');
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext('2d')!;
      if (isLossless && scale >= 1) {
        ctx.imageSmoothingEnabled = false;
      } else {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
      }
      ctx.drawImage(source, 0, 0, targetW, targetH);
    }

    // Apply unsharp mask
    if (enableSharpen && scale < 0.85) {
      const sharpenAmount = scale < 0.4 ? 0.35 : scale < 0.7 ? 0.25 : 0.15;
      canvas = mainThreadUnsharpMask(canvas, targetW, targetH, sharpenAmount);
    }

    // Fill white for JPEG
    if (fillWhite) {
      const ctx = canvas.getContext('2d')!;
      ctx.globalCompositeOperation = 'destination-over';
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, targetW, targetH);
    }

    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve({ blob, width: targetW, height: targetH });
        } else {
          reject(new Error('Main-thread encode: toBlob returned null'));
        }
      },
      format,
      Math.min(1, Math.max(0, quality)),
    );
  });
}

/** Multi-step downscale on main thread. */
function mainThreadMultiStep(
  source: CanvasImageSource,
  origW: number,
  origH: number,
  targetW: number,
  targetH: number,
  isLossless: boolean,
  scale: number,
): HTMLCanvasElement {
  let current: CanvasImageSource = source;
  let curW = origW;
  let curH = origH;
  const smoothing = !(isLossless && scale >= 1);

  while (curW / 2 > targetW && curH / 2 > targetH) {
    const nextW = Math.max(targetW, Math.round(curW / 2));
    const nextH = Math.max(targetH, Math.round(curH / 2));
    const canvas = document.createElement('canvas');
    canvas.width = nextW;
    canvas.height = nextH;
    const ctx = canvas.getContext('2d')!;
    ctx.imageSmoothingEnabled = smoothing;
    if (smoothing) ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(current, 0, 0, nextW, nextH);
    current = canvas;
    curW = nextW;
    curH = nextH;
  }

  if (curW !== targetW || curH !== targetH) {
    const canvas = document.createElement('canvas');
    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext('2d')!;
    ctx.imageSmoothingEnabled = smoothing;
    if (smoothing) ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(current, 0, 0, targetW, targetH);
    current = canvas;
  }

  return current as HTMLCanvasElement;
}

/** Unsharp mask on main thread. */
function mainThreadUnsharpMask(
  canvas: HTMLCanvasElement,
  w: number,
  h: number,
  amount: number,
): HTMLCanvasElement {
  if (w < 3 || h < 3 || amount <= 0) return canvas;

  const ctx = canvas.getContext('2d')!;
  const imageData = ctx.getImageData(0, 0, w, h);
  const src = imageData.data;
  const out = new Uint8ClampedArray(src.length);
  out.set(src);

  const center = 1 + 4 * amount;
  const stride = w * 4;

  for (let y = 1; y < h - 1; y++) {
    const rowOff = y * stride;
    for (let x = 1; x < w - 1; x++) {
      const i = rowOff + x * 4;
      for (let c = 0; c < 3; c++) {
        out[i + c] =
          center * src[i + c] -
          amount * src[i - 4 + c] -
          amount * src[i + 4 + c] -
          amount * src[i - stride + c] -
          amount * src[i + stride + c];
      }
    }
  }

  const result = document.createElement('canvas');
  result.width = w;
  result.height = h;
  const rctx = result.getContext('2d')!;
  rctx.putImageData(new ImageData(out, w, h), 0, 0);
  return result;
}
