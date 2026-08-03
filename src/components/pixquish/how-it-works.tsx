"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { UploadCloud, Wand2, Download, Maximize2 } from "lucide-react";

const STEPS = [
  {
    icon: UploadCloud,
    step: "01",
    title: "Add your images",
    desc: "Drag & drop or tap to pick JPG, PNG, WebP, or AVIF files. Upload one or many at once — everything stays in your browser.",
  },
  {
    icon: Wand2,
    step: "02",
    title: "Compress or resize",
    desc: "Switch to Compress for smart quality reduction, or Resize for exact dimensions, presets, and fit modes. Fine-tune with per-image controls.",
  },
  {
    icon: Download,
    step: "03",
    title: "Compare & download",
    desc: "Preview results with before/after comparison, then download individual files or grab everything at once.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-20 py-12 md:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
            How it works
          </span>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
            Three steps to perfect images
          </h2>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg">
            No accounts, no uploads, no waiting. Just drop, tune, and download.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
              className="group relative overflow-hidden rounded-2xl border border-border/70 bg-card/50 p-6 transition-all hover:border-border hover:shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div className="flex size-12 items-center justify-center rounded-xl bg-brand-muted text-brand transition-transform group-hover:scale-105">
                  <s.icon className="size-6" />
                </div>
                <span className="text-3xl font-bold tabular-nums text-muted-foreground/20">
                  {s.step}
                </span>
              </div>
              <h3 className="mt-5 text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {s.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
