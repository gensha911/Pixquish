"use client";

import * as React from "react";

import { motion, type Variants } from "framer-motion";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FaqEntry {
  question: string;
  answer: string;
}

const FAQ_ENTRIES: FaqEntry[] = [
  {
    question: "Are my images uploaded to a server?",
    answer:
      "No. Pixquish processes every image entirely inside your browser using the Canvas API. Your files never touch a server, so they stay completely private.",
  },
  {
    question: "What image formats are supported?",
    answer:
      "You can work with JPG, JPEG, PNG, WebP, and AVIF files. Both the Compress and Resize tools accept all these formats, and you can convert to any supported output format.",
  },
  {
    question: "Can I resize images too?",
    answer:
      "Yes! Switch to the Resize tab to set exact dimensions in pixels or choose from 20+ presets for Instagram, X/Twitter, Facebook, YouTube, LinkedIn, Pinterest, and common web sizes.",
  },
  {
    question: "What are the fit modes in the resizer?",
    answer:
      "Cover fills the canvas and center-crops any excess. Contain fits the image inside the canvas with optional padding color (useful for logos). Stretch fills the exact dimensions (with a distortion warning if the aspect ratio differs).",
  },
  {
    question: "How does Pixquish choose image quality?",
    answer:
      "Before compressing, each image is analyzed for dimensions, transparency, color complexity, edges, and likely content type (photo, logo, screenshot). The engine then picks the best encoder, format, and quality for that specific image — never one fixed setting.",
  },
  {
    question: "What is the target file size feature?",
    answer:
      "Choose a desired output size (e.g. 100 KB) and Pixquish uses a binary search over quality settings to produce a file as close as possible to your target while preserving good visual quality.",
  },
  {
    question: "Will compression reduce my image's visual quality?",
    answer:
      "Some reduction is unavoidable, but Pixquish prioritizes quality. The 'Best Quality' mode keeps artifacts, blur, and banding to a minimum, and transparency is always preserved.",
  },
  {
    question: "Can I process multiple images at once?",
    answer:
      "Yes. You can drag in or pick several files at once and compress or resize them all with the same settings. Select specific files with checkboxes or process everything.",
  },
  {
    question: "Does Pixquish work on mobile?",
    answer:
      "Absolutely. The interface is mobile-first and touch-friendly, using the native file picker on phones and drag-and-drop on desktops.",
  },
  {
    question: "Is Pixquish free?",
    answer: "Yes. Pixquish is free to use, with no sign-up required.",
  },
];

const headerVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" },
  },
};

const listVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut", delay: 0.1 },
  },
};

export function Faq() {
  return (
    <section id="faq" className="py-12 md:py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={headerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="text-center"
        >
          <span className="inline-flex items-center rounded-full border border-border/60 bg-brand-muted/60 px-3 py-1 text-xs font-medium text-brand">
            FAQ
          </span>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
            Frequently asked questions
          </h2>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg">
            Everything you need to know about Pixquish — compression, resizing,
            and privacy.
          </p>
        </motion.div>

        <motion.div
          variants={listVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-12 rounded-2xl border border-border/70 bg-card/40 p-2"
        >
          <Accordion type="single" collapsible className="w-full">
            {FAQ_ENTRIES.map((entry, index) => (
              <AccordionItem
                key={entry.question}
                value={`faq-${index + 1}`}
                className="px-4"
              >
                <AccordionTrigger className="text-left text-base font-medium hover:no-underline">
                  {entry.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  {entry.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
