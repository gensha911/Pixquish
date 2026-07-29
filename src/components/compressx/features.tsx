"use client";

import * as React from "react";

import { motion, type Variants } from "framer-motion";
import {
  Gem,
  Globe,
  Layers,
  Moon,
  MousePointerClick,
  ShieldCheck,
  Smartphone,
  Target,
  Zap,
  Maximize2,
  Ruler,
  LayoutGrid,
  Link2,
  type LucideIcon,
} from "lucide-react";

import { FeatureCard } from "./feature-card";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  comingSoon?: boolean;
}

const FEATURES: Feature[] = [
  // ─── Compress ───
  {
    icon: Zap,
    title: "Fast Compression",
    description:
      "A Web Worker–powered engine compresses images off the main thread, keeping the UI fully responsive even with large files.",
  },
  {
    icon: Gem,
    title: "Maximum Image Quality",
    description:
      "Smart analysis picks the ideal encoder and quality per image, never blindly aggressive.",
  },
  {
    icon: Target,
    title: "Target File Size",
    description:
      "Pick an exact output size and CompressX finds the closest quality setting via binary search.",
  },
  {
    icon: Layers,
    title: "Batch Processing",
    description:
      "Compress or resize many images at once with shared settings. Drag in multiple files and export them all together.",
  },
  // ─── Resize ───
  {
    icon: Maximize2,
    title: "Precise Resizing",
    description:
      "Set exact width and height, scale by percentage, or pick from 20+ social media and web presets.",
  },
  {
    icon: Link2,
    title: "Aspect Ratio Lock",
    description:
      "Lock the aspect ratio and change one dimension — the other updates automatically to prevent distortion.",
  },
  {
    icon: LayoutGrid,
    title: "Fit Modes",
    description:
      "Choose Cover (crop to fill), Contain (fit with padding), or Stretch (fill exactly) for perfect output every time.",
  },
  {
    icon: Ruler,
    title: "Smart Scaling",
    description:
      "Multi-step downscaling with high-quality smoothing produces sharp results when shrinking images significantly.",
  },
  // ─── Shared ───
  {
    icon: ShieldCheck,
    title: "Privacy First",
    description:
      "Your images never leave your device. All processing happens locally in your browser.",
  },
  {
    icon: Globe,
    title: "Browser Processing",
    description:
      "Everything runs in your browser using Canvas API and Web Workers — no server uploads, no tracking, zero network calls.",
  },
  {
    icon: Smartphone,
    title: "Responsive Design",
    description:
      "A flawless experience on phones, tablets, and desktops with touch-friendly controls.",
  },
  {
    icon: Moon,
    title: "Dark Mode",
    description:
      "A beautiful, eye-friendly dark theme. Your preference is remembered on every visit.",
  },
];

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.07, delayChildren: 0.05 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const headerVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" },
  },
};

export function Features() {
  return (
    <section id="features" className="py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={headerVariants}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="inline-flex items-center rounded-full border border-border/60 bg-brand-muted/60 px-3 py-1 text-xs font-medium text-brand">
            Features
          </span>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
            Everything you need for your images
          </h2>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg">
            Compress, resize, and convert — all with privacy-first tools that
            respect quality and your data.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {FEATURES.map((feature) => (
            <motion.div key={feature.title} variants={itemVariants}>
              <FeatureCard
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                comingSoon={feature.comingSoon}
                className="h-full"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
