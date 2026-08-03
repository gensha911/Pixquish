"use client";

import * as React from "react";
import { MotionConfig } from "framer-motion";

/**
 * Wraps the app in framer-motion's <MotionConfig> with reducedMotion="user".
 *
 * When a visitor has prefers-reduced-motion enabled at the OS level (common on
 * low-end mobiles and for accessibility), framer-motion skips transform/layout
 * animations and renders content directly in its final state. This keeps the
 * UI responsive on devices that struggle to composite many animated layers.
 *
 * For everyone else, animations behave exactly as authored — no visual change.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">{children}</MotionConfig>
  );
}
