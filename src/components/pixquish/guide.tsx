"use client";

import * as React from "react";
import { motion, type Variants } from "framer-motion";
import {
  Upload,
  Settings2,
  SlidersHorizontal,
  Layers,
  Download,
  ArrowLeftRight,
  Smartphone,
  Target,
  ImageIcon,
  Maximize2,
  LayoutGrid,
  Link2,
  MousePointerClick,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface GuideStep {
  icon: React.ElementType;
  title: string;
  description: string;
  screenshot?: string;
  highlights: string[];
  tip?: string;
  /** When true the screenshot is kept fully visible (object-contain) instead of top-cropped — use for portrait/mobile shots. */
  portrait?: boolean;
}

const STEPS: GuideStep[] = [
  // ─── Shared: Upload ───
  {
    icon: Upload,
    title: "Upload Your Images",
    description:
      "Drag and drop images directly onto the upload area, or click to browse your files. Pixquish accepts JPEG, PNG, WebP, and AVIF formats. You can upload multiple images at once for batch processing.",
    screenshot: "/guide/c-01-upload.png",
    highlights: [
      "Drag and drop zone supports multiple files",
      "Click the upload button to browse your device",
      "New uploads always appear at the top of the list",
      "Supported formats: JPEG, PNG, WebP, AVIF",
    ],
    tip: "You can keep adding more images even after processing — just drop them into the compact upload bar at the top.",
  },
  // ─── Compress steps ───
  {
    icon: Settings2,
    title: "Choose Compression Mode",
    description:
      "Pick from three intelligent modes: Best Quality for minimal size reduction with zero visual loss, Balanced for a smart trade-off between quality and file size, or Max Compress for the smallest possible files.",
    screenshot: "/guide/c-02-mode.png",
    highlights: [
      "Best Quality — minimal compression, maximum fidelity",
      "Balanced — smart quality/size trade-off (default)",
      "Max Compress — smallest files possible",
      "Your chosen mode is remembered across sessions",
    ],
  },
  {
    icon: Target,
    title: "Set a Target File Size",
    description:
      "Need a file under a specific size? Click one of the preset buttons (20 KB, 50 KB, 100 KB, 200 KB, 500 KB, 1 MB) or type a custom value. Pixquish uses an intelligent binary search across quality levels to hit your target as closely as possible.",
    screenshot: "/guide/c-03-target.png",
    highlights: [
      "Quick presets from 20 KB to 1 MB",
      "Custom target size with KB/MB toggle",
      "Binary search finds the closest quality match",
      "Works with any output format",
    ],
    tip: "Target size mode overrides the compression mode — it will automatically find the best quality that meets your size requirement.",
  },
  {
    icon: MousePointerClick,
    title: "Click Compress",
    description:
      "Once your mode and target size are set, hit the Compress button in the workspace header. Use Compress All to process every image, Compress N Selected to compress just the files you've checked, or the per-row Compress button for a single image. Everything runs locally in your browser — your images never leave your device.",
    screenshot: "/guide/c-04-compress.png",
    highlights: [
      "Compress All processes every uploaded image at once",
      "Compress N Selected processes only the checked files",
      "Per-row Compress button for a single image",
      "100% private — all processing happens in your browser",
    ],
    tip: "Tick the checkboxes on individual files to compress a subset of your batch while leaving the rest untouched.",
  },
  {
    icon: SlidersHorizontal,
    title: "Compare Before and After",
    description:
      "After compression, each image shows an interactive comparison slider. Drag the handle left and right to see the exact difference between original and compressed versions. Scroll to zoom in for pixel-level inspection, then drag to pan around the zoomed view.",
    screenshot: "/guide/c-05-compare.png",
    highlights: [
      "Drag the slider to compare original vs compressed",
      "Scroll wheel to zoom in (up to 1000%)",
      "Click and drag to pan when zoomed",
      "Double-click to reset zoom",
      "Detailed stats: size saved, load speed, quality mode",
    ],
    tip: "The comparison line stays fixed when you pan — only the images move. This makes it easy to inspect specific areas at high zoom.",
  },
  {
    icon: Download,
    title: "Download Results",
    description:
      "Download individual images or use Download All to grab every processed file at once. Each download is named with the original filename plus a suffix so you never overwrite your originals.",
    screenshot: "/guide/c-06-download.png",
    highlights: [
      "Individual download button per image",
      "Download All grabs everything in one click",
      "Compressed files named: originalname-pixquish.webp",
      "Resized files named: originalname-1920x1080.jpg",
      "Original images are never modified",
    ],
  },
  // ─── Resize steps ───
  {
    icon: Maximize2,
    title: "Resize to Exact Dimensions",
    description:
      "Switch to the Resize tab and set precise width and height in pixels. You can also scale by percentage (10%–200%), or choose from 20+ presets for social media platforms like Instagram, X/Twitter, Facebook, YouTube, LinkedIn, and Pinterest.",
    screenshot: "/guide/09-resize-dimensions.png",
    highlights: [
      "Set exact width × height in pixels",
      "Scale by percentage: 10%, 25%, 50%, 75%, 100%, 150%, 200%",
      "20+ presets: Instagram, X/Twitter, Facebook, YouTube, LinkedIn, Pinterest",
      "Web presets: HD 1080p, 720p, Web Banner, Favicon, App Icon",
      "Common presets: 4K UHD, 2K QHD, Square, Widescreen",
    ],
  },
  {
    icon: Link2,
    title: "Lock Aspect Ratio & Choose Fit Mode",
    description:
      "Toggle the aspect ratio lock to keep proportions when changing one dimension. Then pick a fit mode: Cover fills the canvas and center-crops excess, Contain fits the image inside with optional padding color, and Stretch fills exactly (with a distortion warning if the ratio doesn't match).",
    screenshot: "/guide/10-resize-fit-modes.png",
    highlights: [
      "Aspect ratio lock keeps proportions automatically",
      "Cover — fills canvas, center-crops excess",
      "Contain — fits inside, adds padding with custom color",
      "Stretch — fills exactly, warns about distortion",
    ],
    tip: "Use Contain mode with a transparent or custom background color for logos and graphics that need a specific canvas size.",
  },
  {
    icon: LayoutGrid,
    title: "Smart Multi-Step Scaling",
    description:
      "When shrinking images significantly, Pixquish uses a multi-step downscaling algorithm with high-quality smoothing. This produces sharper results than a single-step resize, especially for photos with fine detail. The before/after comparison slider lets you inspect the result at full quality.",
    screenshot: "/guide/11-resize-result.png",
    highlights: [
      "Multi-step halving for sharp downscaling",
      "High-quality image smoothing enabled",
      "Works with all fit modes and formats",
      "Before/after comparison slider with zoom",
    ],
  },
  // ─── Shared: Batch & Mobile ───
  {
    icon: Layers,
    title: "Batch Process Multiple Images",
    description:
      "Upload multiple images and process them all at once with the same settings. Select specific files with checkboxes, or process everything. The summary bar shows total progress and results across all images.",
    screenshot: "/guide/07-batch-download.png",
    highlights: [
      "Upload as many images as you want at once",
      "Select specific files with checkboxes to process only those",
      "Process All handles every image with the same settings",
      "Summary shows total files done and total space saved",
      "Download All exports every processed image at once",
    ],
  },
  {
    icon: Smartphone,
    title: "Works on Any Device",
    description:
      "Pixquish is fully responsive and works on phones, tablets, and desktops. On mobile, controls stack vertically for easy thumb access. Touch gestures are fully supported for the comparison slider and zooming.",
    screenshot: "/guide/08-mobile.png",
    portrait: true,
    highlights: [
      "Fully responsive layout for all screen sizes",
      "Touch-friendly controls and gestures",
      "Mobile-optimized vertical layout",
      "No app install needed — works in any browser",
    ],
  },
];

const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const headerVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

function StepCard({ step, index }: { step: GuideStep; index: number }) {
  const [imgErr, setImgErr] = React.useState(false);
  const [zoomed, setZoomed] = React.useState(false);
  const Icon = step.icon;

  return (
    <motion.div variants={itemVariants} className="group">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-gradient text-white shadow-sm">
          <Icon className="size-5" />
        </div>
        <div>
          <p className="text-xs font-medium text-brand">Step {index + 1}</p>
          <h3 className="text-xl font-semibold tracking-tight sm:text-2xl">{step.title}</h3>
        </div>
      </div>

      {/* Full-width screenshot — click to zoom for full-resolution view */}
      {step.screenshot ? (
        <button
          type="button"
          onClick={() => setZoomed(true)}
          className="group/img relative block w-full overflow-hidden rounded-2xl border border-border/60 bg-muted/30 shadow-lg transition-transform duration-200 hover:scale-[1.003] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          aria-label={`Enlarge ${step.title} screenshot`}
        >
          {imgErr ? (
            <div className="flex h-44 items-center justify-center text-muted-foreground">
              <ImageIcon className="size-7 opacity-40" />
            </div>
          ) : (
            <img
              src={step.screenshot}
              alt={step.title}
              className={
                step.portrait
                  ? "mx-auto block max-h-[460px] w-auto max-w-full object-contain"
                  : "block h-[300px] w-full object-cover object-top sm:h-[340px]"
              }
              onError={() => setImgErr(true)}
              loading="lazy"
            />
          )}
          <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-foreground/5" />
          {/* Zoom hint badge */}
          {!imgErr && (
            <span className="pointer-events-none absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-lg bg-background/85 px-3 py-1.5 text-xs font-medium text-foreground opacity-0 shadow-sm backdrop-blur transition-opacity duration-200 group-hover/img:opacity-100">
              <Maximize2 className="size-3.5 text-brand" />
              Click to zoom
            </span>
          )}
        </button>
      ) : null}

      {/* Description + highlights below the image */}
      <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:gap-8">
        <div>
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
            {step.description}
          </p>
          {step.tip && (
            <div className="mt-4 rounded-xl border border-brand/20 bg-brand-muted/40 px-4 py-3">
              <p className="text-xs font-medium text-brand">Pro tip</p>
              <p className="mt-1 text-sm text-foreground/70">{step.tip}</p>
            </div>
          )}
        </div>
        <ul className="space-y-2.5">
          {step.highlights.map((h) => (
            <li key={h} className="flex items-start gap-2.5 text-sm">
              <span className="mt-1.5 block size-1.5 shrink-0 rounded-full bg-brand" />
              <span className="text-foreground/80">{h}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Click-to-zoom lightbox — shows the screenshot at full resolution */}
      <Dialog open={zoomed} onOpenChange={setZoomed}>
        <DialogContent
          aria-describedby={undefined}
          className="max-w-[95vw] gap-0 overflow-hidden border-border/60 bg-background/95 p-0 backdrop-blur sm:max-w-[95vw] sm:rounded-2xl"
        >
          <DialogHeader className="sr-only">
            <DialogTitle>{step.title} — screenshot</DialogTitle>
          </DialogHeader>
          {step.screenshot && (
            <img
              src={step.screenshot}
              alt={step.title}
              className="block h-auto max-h-[90vh] w-auto max-w-full object-contain"
            />
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

export function Guide() {
  return (
    <section id="guide" className="py-12 md:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={headerVariants}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
            <ArrowLeftRight className="size-3 text-brand" />
            User Guide
          </span>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
            How to use Pixquish
          </h2>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg">
            A step-by-step walkthrough of compressing and resizing your images.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="mt-10 space-y-12 md:mt-12 md:space-y-14"
        >
          {STEPS.map((step, i) => (
            <StepCard key={step.title} step={step} index={i} />
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12 text-center md:mt-16"
        >
          <p className="text-lg font-medium text-foreground">Ready to get started?</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Scroll up to the workspace and drop your first image.
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#workspace"
              className="inline-flex items-center gap-2 rounded-xl bg-brand-gradient px-6 py-3 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
            >
              <Upload className="size-4" />
              Compress Images
            </a>
            <a
              href="#resize"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground shadow-sm transition-colors hover:bg-accent"
            >
              <Maximize2 className="size-4" />
              Resize Images
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
