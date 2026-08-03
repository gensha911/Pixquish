'use client';

import { useCallback, useEffect, useRef } from 'react';
import type {
  CompressionOptions,
  CompressedImageResult,
  WorkerResponseMessage,
} from '@/lib/compression-types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CompressionCallbacks {
  /** Called at each pipeline step with a 0–100 value. */
  onProgress?: (id: string, progress: number, status: string) => void;
  /** Called when compression finishes successfully. */
  onComplete?: (result: CompressedImageResult) => void;
  /** Called when an error occurs. */
  onError?: (id: string, error: string, code?: string) => void;
}

export interface CompressInput {
  /** Caller-provided correlation ID. */
  id: string;
  /** The source file. */
  file: File;
  /** Compression settings. */
  options?: CompressionOptions;
}

// ---------------------------------------------------------------------------
// Max file size the worker will accept (50 MB)
// ---------------------------------------------------------------------------

const MAX_FILE_SIZE = 50 * 1024 * 1024;

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Provides a handle to the Pixquish image-compression Web Worker.
 *
 * The worker is lazily instantiated on first use and automatically
 * terminated when the calling component unmounts.
 *
 * @example
 * ```tsx
 * const { compress, cancel, cancelAll, isSupported } = useCompressionWorker({
 *   onProgress: (id, pct, status) => console.log(id, pct, status),
 *   onComplete: (result) => downloadBlob(result),
 *   onError: (id, msg) => toast.error(msg),
 * });
 * ```
 */
export function useCompressionWorker(callbacks: CompressionCallbacks = {}) {
  const workerRef = useRef<Worker | null>(null);
  const callbacksRef = useRef(callbacks);

  // Keep callbacks ref fresh without re-creating the worker
  useEffect(() => {
    callbacksRef.current = callbacks;
  }, [callbacks]);

  // Lazily create (or return) the worker singleton
  const getWorker = useCallback((): Worker | null => {
    if (typeof window === 'undefined') return null;

    if (workerRef.current) return workerRef.current;

    try {
      // Next.js / webpack pattern for bundling a Web Worker from a TS file
      const worker = new Worker(
        new URL('@/workers/compress.worker.ts', import.meta.url),
      );

      worker.addEventListener('message', (event: MessageEvent<WorkerResponseMessage>) => {
        const { type, payload } = event.data;
        const cb = callbacksRef.current;

        switch (type) {
          case 'progress':
            cb.onProgress?.(payload.id, payload.progress, payload.status);
            break;
          case 'complete':
            cb.onComplete?.(payload);
            break;
          case 'error':
            cb.onError?.(payload.id, payload.error, payload.code);
            break;
        }
      });

      worker.addEventListener('error', (event) => {
        // Unhandled worker-level errors (e.g. syntax error in the worker file)
        callbacksRef.current.onError?.(
          '__worker__',
          event.message || 'Worker encountered an unexpected error.',
        );
      });

      workerRef.current = worker;
      return worker;
    } catch {
      // e.g. the browser doesn't support Worker
      return null;
    }
  }, []);

  // Terminate on unmount
  useEffect(() => {
    return () => {
      workerRef.current?.terminate();
      workerRef.current = null;
    };
  }, []);

  // ---- Public API ---------------------------------------------------------

  /**
   * Compress a single file using the Web Worker.
   *
   * Returns `false` immediately if the worker is unavailable or the file
   * exceeds the size limit (the `onError` callback will also fire).
   */
  const compress = useCallback(
    ({ id, file, options = {} }: CompressInput): boolean => {
      const worker = getWorker();
      if (!worker) {
        callbacksRef.current.onError?.(
          id,
          'Web Workers are not supported in this browser.',
        );
        return false;
      }

      if (file.size > MAX_FILE_SIZE) {
        callbacksRef.current.onError?.(
          id,
          `File is too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Maximum is ${MAX_FILE_SIZE / 1024 / 1024} MB.`,
          'TOO_LARGE',
        );
        return false;
      }

      // Read the file into an ArrayBuffer and forward it to the worker.
      const reader = new FileReader();
      reader.onload = () => {
        const buffer = reader.result as ArrayBuffer;
        worker.postMessage(
          {
            type: 'compress',
            payload: { id, imageData: buffer, fileName: file.name, options },
          },
          // Transfer the buffer for zero-copy send
          [buffer],
        );
      };
      reader.onerror = () => {
        callbacksRef.current.onError?.(
          id,
          'Failed to read the file from disk.',
        );
      };
      reader.readAsArrayBuffer(file);

      return true;
    },
    [getWorker],
  );

  /** Cancel a specific in-flight compression by its ID. */
  const cancel = useCallback(
    (id: string) => {
      getWorker()?.postMessage({ type: 'cancel', payload: { id } });
    },
    [getWorker],
  );

  /** Cancel every in-flight compression. */
  const cancelAll = useCallback(() => {
    getWorker()?.postMessage({ type: 'cancel', payload: { id: '*' } });
  }, [getWorker]);

  /** True when the browser supports Web Workers (always true in modern browsers). */
  const isSupported = typeof window !== 'undefined' && typeof Worker !== 'undefined';

  return { compress, cancel, cancelAll, isSupported };
}
