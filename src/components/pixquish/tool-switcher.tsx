"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Zap, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ImageWorkspace } from "./image-workspace";
import { ResizeWorkspace } from "./resize-workspace";

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
