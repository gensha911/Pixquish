"use client";

import * as React from "react";

/**
 * Scroll-triggered lazy section wrapper.
 *
 * Uses IntersectionObserver to only render children when they're about
 * to enter the viewport (200px preload margin). Shows a skeleton
 * placeholder until then.
 *
 * Usage: wrap below-the-fold dynamic imports:
 *   <LazySection><HowItWorks /></LazySection>
 *
 * Combined with `next/dynamic({ ssr: false })`, this means:
 * - No SSR HTML for the section (faster TTFB)
 * - No JS bundle loaded until user scrolls near (smaller initial payload)
 * - Skeleton placeholder prevents layout shift
 */
export function LazySection({
  children,
  className,
  skeletonHeight = "400px",
}: {
  children: React.ReactNode;
  className?: string;
  /** Approximate height of the skeleton placeholder (prevents CLS). */
  skeletonHeight?: string;
}) {
  const [visible, setVisible] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px 0px" }, // start loading 200px before entering viewport
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {visible ? (
        children
      ) : (
        <div
          className="animate-pulse rounded-2xl bg-muted/30"
          style={{ height: skeletonHeight }}
          aria-hidden
        />
      )}
    </div>
  );
}
