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
  {
    question: "How do I compress a PNG without losing quality?",
    answer:
      "Upload your PNG and choose Best Quality mode. Pixquish keeps the PNG lossless when the output format is PNG (PNG uses lossless compression, so quality is never reduced). For even smaller files, switch the output format to WebP or AVIF — both support lossless modes that can shrink PNGs by 30–50% with zero quality loss.",
  },
  {
    question: "How do I compress a JPG to 100KB?",
    answer:
      "Upload your JPG, then use the target file size feature. Pick the 100 KB preset (or type a custom value) and Pixquish runs a binary search over JPEG quality levels to produce a file as close to 100 KB as possible while keeping the best achievable visual quality.",
  },
  {
    question: "What is the best image format for the web?",
    answer:
      "WebP and AVIF are the best modern formats for the web — they produce files 25–50% smaller than JPEG and PNG at the same visual quality. Pixquish can convert your JPG or PNG to WebP or AVIF automatically. For logos and graphics with few colors, PNG stays lossless and crisp. For photos, WebP or AVIF is recommended.",
  },
  {
    question: "What is the Instagram post size?",
    answer:
      "Instagram square posts are 1080×1080 pixels, landscape posts are 1080×566 pixels, and portrait posts are 1080×1350 pixels. Instagram Stories and Reels use 1080×1920 pixels. Pixquish includes all these as one-click presets in the Resize tab.",
  },
  {
    question: "What is the YouTube thumbnail size?",
    answer:
      "YouTube thumbnails are 1280×720 pixels (16:9 aspect ratio). Pixquish includes a YouTube Thumbnail preset in the Resize tab — upload your image, pick the preset, and download a perfectly sized thumbnail.",
  },
  {
    question: "How do I reduce image file size for email?",
    answer:
      "Upload your image and use the target file size feature set to 200 KB or less — most email providers limit attachments to 25 MB but recommend keeping images under 1 MB. For photos, switching the output to JPEG with Balanced mode gives the smallest files with good quality.",
  },
  {
    question: "PNG vs WebP — which is smaller?",
    answer:
      "WebP is almost always smaller than PNG — typically 25–35% smaller for the same lossless image, and much smaller for photos (where PNG has no lossy mode). Pixquish can convert PNG to WebP with a single click in the output format selector of either the Compress or Resize tab.",
  },
  {
    question: "How many images can I compress or resize at once?",
    answer:
      "Pixquish has no hard limit — you can batch process as many images as your browser can hold in memory. In practice, 50–200 images per batch works smoothly on most devices. Use the checkboxes to process a subset, or Resize/Compress All to handle every uploaded file at once.",
  },
  {
    question: "Is it safe to use an online image compressor?",
    answer:
      "Pixquish is the safest kind of online compressor: it runs entirely in your browser using the Canvas API. Your images are never uploaded to a server, never stored, and never seen by anyone. There is no sign-up, no tracking of your files, and no server-side processing — everything happens on your device.",
  },
  {
    question: "Can I convert images to WebP or AVIF?",
    answer:
      "Yes. In either the Compress or Resize tab, change the output format selector to WebP or AVIF. Pixquish will convert your JPG, PNG, WebP, or AVIF input to the chosen format. AVIF typically produces the smallest files, followed by WebP, then JPEG.",
  },
  {
    question: "How do I resize an image for Instagram?",
    answer:
      "Switch to the Resize tab, upload your image, then pick an Instagram preset: Square Post (1080×1080), Story/Reel (1080×1920), or Landscape (1080×566). Use the Cover fit mode to fill the canvas and crop excess, or Contain to fit the whole image with padding.",
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
