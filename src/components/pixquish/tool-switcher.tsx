"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Zap, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";

// Workspaces are the heaviest modules in the app (the compression engine
// alone is ~1,700 lines: compressor, resizer, image-analysis). They are
// fully client-side (Canvas) with zero SSR benefit, so load them on demand —
// only the active tab's workspace is ever fetched. This keeps the initial
// JS bundle small for low-end mobiles on slow networks.
const ImageWorkspace = dynamic(
  () => import("./image-workspace").then((m) => m.ImageWorkspace),
  {
    ssr: false,
    loading: () => <WorkspaceSkeleton id="workspace" />,
  },
);

const ResizeWorkspace = dynamic(
  () => import("./resize-workspace").then((m) => m.ResizeWorkspace),
  {
    ssr: false,
    loading: () => <WorkspaceSkeleton id="resize" />,
  },
);

/** Lightweight placeholder shown while the active workspace chunk loads.
 *  Mirrors the real workspace's section wrapper + upload area shape to avoid
 *  layout shift, and keeps the hash anchor target resolvable. */
function WorkspaceSkeleton({ id }: { id: string }) {
  return (
    <section id={id} className="relative scroll-mt-20 py-8 md:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto h-6 w-32 rounded-full bg-muted/50" />
          <div className="mx-auto mt-3 h-8 w-64 rounded-lg bg-muted/40" />
          <div className="mx-auto mt-2 h-4 w-80 rounded-lg bg-muted/40" />
        </div>
        <div className="mx-auto mt-6 max-w-3xl">
          <div className="h-48 rounded-3xl border-2 border-dashed border-border bg-card/40" />
        </div>
      </div>
    </section>
  );
}

type ToolMode = "compress" | "resize";

const HASH_MAP: Record<string, ToolMode> = {
  "#resize": "resize",
  "#workspace": "compress",
};

const MODE_HASH: Record<ToolMode, string> = {
  compress: "#workspace",
  resize: "#resize",
};

export function ToolSwitcher() {
  const [mode, setMode] = React.useState<ToolMode>("compress");

  // Sync with URL hash on mount and when hash changes
  React.useEffect(() => {
    const readHash = () => {
      const mapped = HASH_MAP[window.location.hash];
      if (mapped) setMode(mapped);
    };
    readHash();
    window.addEventListener("hashchange", readHash);
    return () => window.removeEventListener("hashchange", readHash);
  }, []);

  // Update URL hash when mode changes
  React.useEffect(() => {
    window.location.hash = MODE_HASH[mode];
  }, [mode]);

  const handleTabChange = (newMode: ToolMode) => {
    setMode(newMode);
  };

  return (
    <>
      {/* Tab switcher */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center">
          <div className="inline-flex items-center rounded-xl border border-border/70 bg-card/60 p-1 backdrop-blur">
            {(
              [
                { value: "compress", label: "Compress", icon: Zap },
                { value: "resize", label: "Resize", icon: Maximize2 },
              ] as const
            ).map((tab) => {
              const active = mode === tab.value;
              return (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => handleTabChange(tab.value)}
                  aria-pressed={active}
                  className={cn(
                    "relative flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="tool-tab"
                      className="absolute inset-0 rounded-lg bg-primary shadow-sm"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    <tab.icon className="size-4" />
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Active workspace */}
      {mode === "compress" ? <ImageWorkspace /> : <ResizeWorkspace />}
    </>
  );
}
