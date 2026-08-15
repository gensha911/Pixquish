/**
 * Programmatic SEO landing-page data for Pixquish.
 *
 * Each entry drives a full landing page (route /compress/[format] or
 * /resize/[platform]). The data feeds:
 *   - generateMetadata() (title, description, canonical)
 *   - the <LandingPage /> component (hero, why-use, how-to, specs, FAQ, CTA)
 *   - three JSON-LD blocks (SoftwareApplication, HowTo, FAQPage)
 *
 * Add a new page by appending to LANDING_PAGES below — sitemap, index pages,
 * and footer links pick it up automatically.
 */

export type LandingPageType = "compress" | "resize";

export interface LandingPageSpec {
  label: string;
  value: string;
}

export interface LandingPageWhyUse {
  title: string;
  body: string;
}

export interface LandingPageStep {
  name: string;
  text: string;
}

export interface LandingPageFaq {
  question: string;
  answer: string;
}

export interface LandingPageTargetDimensions {
  width: number;
  height: number;
  unit: string;
}

export interface LandingPage {
  slug: string;
  type: LandingPageType;
  /** compress pages: "png" | "jpg" | "webp" | "avif" */
  format?: string;
  /** resize pages: "Instagram" | "YouTube" | "Twitter" | "Facebook" | "LinkedIn" */
  platform?: string;
  /** page H1, keyword-rich */
  h1: string;
  /** <title> tag, 50-60 chars */
  title: string;
  /** meta description, 140-160 chars */
  description: string;
  /** primary target keyword */
  keyword: string;
  /** resize pages: target dimensions object */
  targetDimensions?: LandingPageTargetDimensions;
  /** hero subheading */
  heroLead: string;
  /** 3-4 "why use Pixquish for X" points */
  whyUse: LandingPageWhyUse[];
  /** 4-6 how-to steps → feeds HowTo schema */
  howToSteps: LandingPageStep[];
  /** resize pages: dimension/spec table */
  specs?: LandingPageSpec[];
  /** 5-6 FAQs → feeds FAQPage schema */
  faqs: LandingPageFaq[];
  /** CTA destination: "#workspace" or "#resize" */
  ctaHref: string;
  /** CTA button label */
  ctaLabel: string;
  /** related blog article slugs (e.g. ["png-vs-webp"]) */
  relatedBlogSlugs?: string[];
}

const SHARED_PRIVACY_WHY: LandingPageWhyUse = {
  title: "100% private — runs in your browser",
  body: "Your images never touch a server. Pixquish uses the Canvas API to compress and resize files entirely on your device — no uploads, no tracking, no sign-up.",
};

const LANDING_PAGES: LandingPage[] = [
  // ── Compress pages ──────────────────────────────────────────────────────
  {
    slug: "png",
    type: "compress",
    format: "png",
    h1: "Compress PNG files online — free, private, no uploads",
    title: "Compress PNG — Free Online PNG Compressor | Pixquish",
    description:
      "Compress PNG files in your browser — free, no uploads. Pixquish shrinks PNGs up to 80% with lossless quality. The best PNG compressor online.",
    keyword: "compress png",
    heroLead:
      "Shrink PNG images up to 80% without leaving your browser. Lossless PNG compression, or convert to WebP/AVIF for even smaller files. 100% private — nothing is uploaded.",
    whyUse: [
      SHARED_PRIVACY_WHY,
      {
        title: "Lossless PNG compression by default",
        body: "PNG uses lossless compression, so compressing a PNG to PNG never reduces quality. Pixquish's Best Quality mode keeps every pixel intact while still cutting file size by re-encoding more efficiently than most tools.",
      },
      {
        title: "Optional lossy WebP/AVIF for 30–50% smaller files",
        body: "Need smaller than lossless PNG allows? Switch the output format to WebP or AVIF — both support lossless modes that can shrink a PNG by 30–50% with zero quality loss, or lossy modes for even more savings.",
      },
      {
        title: "Target a specific file size",
        body: "Set an exact target (e.g. 100 KB, 200 KB) and Pixquish runs a binary search over quality settings to land as close as possible to your target while keeping the best achievable visual quality.",
      },
    ],
    howToSteps: [
      {
        name: "Upload your PNG",
        text: "Drag a PNG file onto the compressor drop zone at the top of the page, or click to pick one (or several) from your device. You can batch as many PNGs as your browser can hold.",
      },
      {
        name: "Pick a compression mode",
        text: "Choose Best Quality for lossless PNG output, Balanced for a smaller file with negligible quality loss, or Max Compress for the smallest PNG. The preview updates instantly so you can compare.",
      },
      {
        name: "Optional: set a target file size",
        text: "If you need a specific output size (e.g. under 100 KB for an email attachment or upload limit), enter it in the target file size field. Pixquish searches quality levels to hit your target.",
      },
      {
        name: "Optional: switch output format",
        text: "Leave the output on Auto to keep PNG, or pick WebP or AVIF for drastically smaller files. AVIF typically produces the smallest result, followed by WebP.",
      },
      {
        name: "Compress and download",
        text: "Click Compress and Pixquish processes the PNG entirely in your browser. Each result downloads individually with one click — no zip extraction needed.",
      },
    ],
    faqs: [
      {
        question: "How do I compress a PNG without losing quality?",
        answer:
          "Upload your PNG and choose Best Quality mode. Pixquish keeps the output as PNG (which uses lossless compression), so no pixels are changed — only the file is re-encoded more efficiently. For even smaller lossless files, switch the output format to WebP or AVIF, both of which support lossless modes that can shrink a PNG by 30–50% with zero quality loss.",
      },
      {
        question: "What's the best PNG compressor?",
        answer:
          "The best PNG compressor is one that runs in your browser (so your images stay private), gives you a choice between lossless PNG and lossy WebP/AVIF, and shows you a live preview before you download. Pixquish does all three — and it's free with no sign-up. It also offers a target file size feature so you can hit a specific output size.",
      },
      {
        question: "Does compressing PNG reduce quality?",
        answer:
          "Compressing a PNG to PNG never reduces quality because PNG is a lossless format. What does change is the file size — Pixquish re-encodes the PNG more efficiently. If you switch the output to WebP or AVIF in lossy mode, there is some quality reduction, but Pixquish uses high-quality encoders and shows a live preview so you can decide the right balance.",
      },
      {
        question: "How much can I reduce PNG file size?",
        answer:
          "Re-encoding a PNG with Best Quality mode typically saves 5–20% depending on how the original was saved. Switching to lossless WebP usually saves 25–35%, and lossless AVIF can save 40–50% with zero quality loss. Switching to a lossy WebP or AVIF at high quality can save 60–80% with barely visible quality change.",
      },
      {
        question: "Is this PNG compressor free?",
        answer:
          "Yes. Pixquish is completely free, with no sign-up, no watermark, no upload limit beyond your device's memory, and no premium tier. Everything runs in your browser using the Canvas API.",
      },
      {
        question: "Are my PNG images uploaded to a server?",
        answer:
          "No. Pixquish runs entirely in your browser. Your PNGs are never uploaded, never stored on a server, and never seen by anyone. There is no server-side processing — all compression happens on your device.",
      },
    ],
    ctaHref: "#workspace",
    ctaLabel: "Compress a PNG now",
    relatedBlogSlugs: ["png-vs-webp", "best-image-format-for-web"],
  },
  {
    slug: "jpg",
    type: "compress",
    format: "jpg",
    h1: "Compress JPG files online — free, private, no uploads",
    title: "Compress JPG — Free Online JPG Compressor | Pixquish",
    description:
      "Compress JPG files in your browser — free, no uploads. Pixquish shrinks JPGs up to 80% with quality control. The best JPG compressor with target file size.",
    keyword: "compress jpg",
    heroLead:
      "Shrink JPG images up to 80% without leaving your browser. Pick a target file size (100 KB, 200 KB), choose quality, or convert to WebP/AVIF for smaller files. 100% private — nothing is uploaded.",
    whyUse: [
      SHARED_PRIVACY_WHY,
      {
        title: "Hit an exact file size every time",
        body: "Type a target size (100 KB, 200 KB, 500 KB) and Pixquish runs a binary search over JPEG quality levels to produce a file as close as possible to your target while keeping the best visual quality.",
      },
      {
        title: "Three quality modes for any need",
        body: "Best Quality keeps artifacts invisible, Balanced is the sweet spot for the web, and Max Compress goes as small as the format allows while staying usable. Live preview lets you compare.",
      },
      {
        title: "Convert to WebP or AVIF for 25–50% smaller files",
        body: "Switch the output format to WebP or AVIF and the same photo can be 25–50% smaller than JPEG at equivalent visual quality — perfect for modern websites that need to load fast.",
      },
    ],
    howToSteps: [
      {
        name: "Upload your JPG",
        text: "Drag a JPG or JPEG file onto the compressor drop zone at the top of the page, or click to pick one (or several) from your device. Batch as many as you like.",
      },
      {
        name: "Choose a compression mode",
        text: "Pick Best Quality, Balanced, or Max Compress. Each mode shows a live preview so you can compare the result against your original before downloading.",
      },
      {
        name: "Optional: set a target file size",
        text: "Need a specific size like 100 KB for an upload limit or email attachment? Enter it in the target file size field and Pixquish searches quality levels to hit your target.",
      },
      {
        name: "Optional: switch output format",
        text: "Leave the output on Auto to keep JPG, or pick WebP or AVIF for smaller files at the same quality. The preview shows exactly what you'll get.",
      },
      {
        name: "Compress and download",
        text: "Click Compress. Pixquish processes each JPG in your browser and lets you download each result individually with one click.",
      },
    ],
    faqs: [
      {
        question: "How do I compress a JPG to 100KB?",
        answer:
          "Upload your JPG, then use the target file size feature. Pick the 100 KB preset (or type any custom value) and Pixquish runs a binary search over JPEG quality levels to produce a file as close to 100 KB as possible while keeping the best achievable visual quality. If 100 KB isn't reachable at acceptable quality, it gets as close as the format allows.",
      },
      {
        question: "What's the best JPG compressor?",
        answer:
          "The best JPG compressor gives you a choice of quality levels, lets you target an exact file size, runs in your browser (so your photos stay private), and shows a live preview. Pixquish does all four, supports batch processing, and is free with no sign-up.",
      },
      {
        question: "Does compressing JPG reduce quality?",
        answer:
          "JPEG is a lossy format, so every re-encode introduces some quality loss. Pixquish mitigates this in three ways: Best Quality mode keeps artifacts invisible, the engine analyzes each image to pick the optimal encoder settings, and the live preview lets you see exactly what you'll get before downloading.",
      },
      {
        question: "How much can I reduce JPG file size?",
        answer:
          "Typical JPGs from cameras and phones can be reduced by 50–80% with no visible quality loss. With Max Compress mode or by targeting a specific file size, you can push savings further — up to 90% in some cases, though at lower visual quality.",
      },
      {
        question: "Is this JPG compressor free?",
        answer:
          "Yes. Pixquish is completely free, with no sign-up, no watermark, no daily limit, and no premium tier. Everything runs in your browser using the Canvas API.",
      },
      {
        question: "Can I convert JPG to WebP or AVIF?",
        answer:
          "Yes. In the output format selector of the compressor, pick WebP or AVIF. Pixquish converts your JPG to the chosen format, typically producing a file 25–50% smaller than the original JPG at equivalent visual quality.",
      },
    ],
    ctaHref: "#workspace",
    ctaLabel: "Compress a JPG now",
    relatedBlogSlugs: ["compress-jpg-to-100kb", "best-image-format-for-web"],
  },
  {
    slug: "webp",
    type: "compress",
    format: "webp",
    h1: "Compress WebP files online — free, private, no uploads",
    title: "Compress WebP — Free Online WebP Compressor | Pixquish",
    description:
      "Compress WebP files in your browser — free, no uploads. Pixquish shrinks WebP images with lossy or lossless modes and a target file size feature.",
    keyword: "compress webp",
    heroLead:
      "Shrink WebP images further with lossy or lossless compression, or convert to AVIF for even smaller files. 100% private — your images never leave your browser.",
    whyUse: [
      SHARED_PRIVACY_WHY,
      {
        title: "Both lossy and lossless WebP",
        body: "WebP supports both modes. Pixquish analyzes each image and picks the right encoder — lossless for graphics with sharp edges, lossy for photos. You can override the choice in the format selector.",
      },
      {
        title: "Target a specific file size",
        body: "Type a target size (e.g. 50 KB) and Pixquish searches quality levels to land as close as possible while keeping good visual quality — perfect for hitting upload limits.",
      },
      {
        title: "Convert to AVIF for 20–30% smaller files",
        body: "AVIF beats WebP on file size at equivalent quality by about 20–30% on most photos. Switch the output format to AVIF in the compressor and Pixquish will convert your WebP.",
      },
    ],
    howToSteps: [
      {
        name: "Upload your WebP",
        text: "Drag a WebP file onto the compressor drop zone at the top of the page, or click to pick one (or several). Batch processing is supported.",
      },
      {
        name: "Choose a compression mode",
        text: "Pick Best Quality, Balanced, or Max Compress. The engine preserves transparency and chooses lossless or lossy encoding based on the image content.",
      },
      {
        name: "Optional: set a target file size",
        text: "If you need a specific output size (e.g. under 50 KB), enter it in the target file size field and Pixquish searches quality levels to hit your target.",
      },
      {
        name: "Optional: switch output format",
        text: "Leave the output on Auto to keep WebP, or pick AVIF for smaller files at the same quality. PNG is also available for lossless output.",
      },
      {
        name: "Compress and download",
        text: "Click Compress. Pixquish processes the WebP in your browser and lets you download each result individually.",
      },
    ],
    faqs: [
      {
        question: "How do I compress a WebP file?",
        answer:
          "Upload your WebP, choose a compression mode (Best Quality, Balanced, or Max Compress), and click Compress. Pixquish runs entirely in your browser — no uploads to a server. For a specific output size, use the target file size field.",
      },
      {
        question: "Is WebP lossless or lossy?",
        answer:
          "WebP supports both modes. Pixquish analyzes each image and picks the right encoder — typically lossy for photos (smaller files) and lossless for graphics with sharp edges or text. You can override the choice in the format selector if you need a specific mode.",
      },
      {
        question: "Does compressing WebP reduce quality?",
        answer:
          "Lossless WebP compression preserves every pixel, so quality is unchanged. Lossy WebP introduces some quality loss, but Pixquish uses high-quality encoders and the Best Quality mode keeps artifacts essentially invisible. The live preview shows exactly what you'll get.",
      },
      {
        question: "Can I convert WebP to AVIF?",
        answer:
          "Yes. In the output format selector of the compressor, pick AVIF. Pixquish converts your WebP to AVIF, typically producing a file 20–30% smaller at equivalent visual quality. AVIF is supported in all modern browsers.",
      },
      {
        question: "Is this WebP compressor free?",
        answer:
          "Yes. Pixquish is completely free, with no sign-up, no watermark, no daily limit. Everything runs in your browser using the Canvas API.",
      },
      {
        question: "Are my WebP images uploaded to a server?",
        answer:
          "No. Pixquish runs entirely in your browser. Your WebP files are never uploaded, never stored, and never seen by anyone. There is no server-side processing — all compression happens on your device.",
      },
    ],
    ctaHref: "#workspace",
    ctaLabel: "Compress a WebP now",
    relatedBlogSlugs: ["best-image-format-for-web", "png-vs-webp"],
  },
  {
    slug: "avif",
    type: "compress",
    format: "avif",
    h1: "Compress AVIF files online — free, private, no uploads",
    title: "Compress AVIF — Free Online AVIF Compressor | Pixquish",
    description:
      "Compress AVIF files in your browser — free, no uploads. Pixquish shrinks AVIF images with lossy or lossless modes and a target file size feature.",
    keyword: "compress avif",
    heroLead:
      "AVIF already produces the smallest files of any modern format. Pixquish compresses AVIF further with lossy or lossless modes, or converts to WebP for broader compatibility. 100% private — nothing is uploaded.",
    whyUse: [
      SHARED_PRIVACY_WHY,
      {
        title: "Both lossy and lossless AVIF",
        body: "AVIF supports both modes. Pixquish analyzes each image and picks the right encoder — lossless for graphics with sharp edges, lossy for photos. Override the choice in the format selector.",
      },
      {
        title: "Target a specific file size",
        body: "Type a target size and Pixquish searches quality levels to land as close as possible while keeping good visual quality — perfect for hitting strict upload limits.",
      },
      {
        title: "Convert AVIF to WebP for older browsers",
        body: "AVIF is supported in all modern browsers, but some older clients still don't render it. Pixquish can convert your AVIF to WebP (which has even broader compatibility) with one click in the format selector.",
      },
    ],
    howToSteps: [
      {
        name: "Upload your AVIF",
        text: "Drag an AVIF file onto the compressor drop zone at the top of the page, or click to pick one (or several). Batch processing is supported.",
      },
      {
        name: "Choose a compression mode",
        text: "Pick Best Quality, Balanced, or Max Compress. The engine preserves transparency and chooses lossless or lossy encoding based on the image content.",
      },
      {
        name: "Optional: set a target file size",
        text: "If you need a specific output size, enter it in the target file size field and Pixquish searches quality levels to hit your target.",
      },
      {
        name: "Optional: switch output format",
        text: "Leave the output on Auto to keep AVIF, or pick WebP for broader compatibility, PNG for lossless graphics, or JPEG for maximum compatibility.",
      },
      {
        name: "Compress and download",
        text: "Click Compress. Pixquish processes the AVIF in your browser and lets you download each result individually.",
      },
    ],
    faqs: [
      {
        question: "How do I compress an AVIF file?",
        answer:
          "Upload your AVIF, choose a compression mode (Best Quality, Balanced, or Max Compress), and click Compress. Pixquish runs entirely in your browser — no uploads to a server. For a specific output size, use the target file size field.",
      },
      {
        question: "Is AVIF lossless or lossy?",
        answer:
          "AVIF supports both modes. Pixquish analyzes each image and picks the right encoder — typically lossy for photos (smaller files) and lossless for graphics with sharp edges or text. You can override the choice in the format selector if you need a specific mode.",
      },
      {
        question: "Does compressing AVIF reduce quality?",
        answer:
          "Lossless AVIF compression preserves every pixel, so quality is unchanged. Lossy AVIF introduces some quality loss, but Pixquish uses high-quality encoders and the Best Quality mode keeps artifacts essentially invisible. The live preview shows exactly what you'll get.",
      },
      {
        question: "How much can I reduce AVIF file size?",
        answer:
          "AVIF is already the most efficient modern format, so further compression is modest in lossless mode (5–15%). For photos, switching to lossy AVIF at high quality can save 30–50%, and aggressive lossy compression can push savings to 60–80% with acceptable quality loss.",
      },
      {
        question: "Can I convert AVIF to WebP or JPG?",
        answer:
          "Yes. In the output format selector of the compressor, pick WebP for smaller files with broad browser support, JPEG for maximum compatibility everywhere, or PNG for lossless graphics. The conversion happens in your browser.",
      },
      {
        question: "Is this AVIF compressor free?",
        answer:
          "Yes. Pixquish is completely free, with no sign-up, no watermark, no daily limit. Everything runs in your browser using the Canvas API.",
      },
    ],
    ctaHref: "#workspace",
    ctaLabel: "Compress an AVIF now",
    relatedBlogSlugs: ["best-image-format-for-web"],
  },

  // ── Resize pages ────────────────────────────────────────────────────────
  {
    slug: "instagram-post",
    type: "resize",
    platform: "Instagram",
    h1: "Resize image for Instagram Post (1080×1080)",
    title: "Resize Image for Instagram Post (1080×1080) | Pixquish",
    description:
      "Resize image for Instagram Post — 1080×1080 pixels, 1:1 square. Free, private, in-browser. Pick the Instagram Post preset and download a perfectly sized image.",
    keyword: "instagram post size",
    targetDimensions: { width: 1080, height: 1080, unit: "px" },
    heroLead:
      "Instagram posts display best at 1080×1080 pixels (1:1 square). Pixquish resizes your image to exactly that with Cover, Contain, or Stretch fit modes — 100% in your browser, nothing uploaded.",
    whyUse: [
      SHARED_PRIVACY_WHY,
      {
        title: "Exact 1080×1080 every time",
        body: "Pick the Instagram Post preset and Pixquish sets the canvas to exactly 1080×1080 pixels — Instagram's recommended size for square posts. No math, no guesswork.",
      },
      {
        title: "Cover, Contain, or Stretch fit",
        body: "Cover fills the square and center-crops the excess — best for photos. Contain fits the whole image inside with padding (great for logos). Stretch fills the square exactly (with a warning if the aspect ratio differs).",
      },
      {
        title: "Optional sharpening after resize",
        body: "Resizing can soften detail. Pixquish has an optional unsharp mask that runs after the resize to bring edges back — toggle it on for crisp thumbnails.",
      },
    ],
    howToSteps: [
      {
        name: "Open the Resize tab",
        text: "Click the Resize Images button above, or scroll to the Resize workspace at the bottom of the page. Switch from the Compress tab if needed.",
      },
      {
        name: "Upload your image",
        text: "Drag a photo onto the resize drop zone, or click to pick one from your device. JPG, PNG, WebP, and AVIF are all accepted.",
      },
      {
        name: "Pick the Instagram Post preset",
        text: "In the preset dropdown, find Social → Instagram Post (1080×1080). The canvas is set to exactly 1080×1080 and the aspect lock engages automatically.",
      },
      {
        name: "Choose a fit mode",
        text: "Pick Cover to fill the square and crop excess (best for photos), Contain to fit the whole image with padding (good for logos), or Stretch to fill exactly (may distort). Adjust the cover offset to choose which part stays in frame.",
      },
      {
        name: "Resize and download",
        text: "Click Resize. Pixquish processes the image in your browser using a multi-step downscale for sharp results, then lets you download it with one click.",
      },
    ],
    specs: [
      { label: "Recommended size", value: "1080 × 1080 pixels" },
      { label: "Aspect ratio", value: "1:1 (square)" },
      { label: "Landscape variant", value: "1080 × 566 pixels (1.91:1)" },
      { label: "Portrait variant", value: "1080 × 1350 pixels (4:5)" },
      { label: "Best format", value: "JPG for photos, PNG for graphics with text" },
      { label: "File size tip", value: "Keep under 1 MB — Pixquish can compress after resize" },
    ],
    faqs: [
      {
        question: "What is the Instagram post size?",
        answer:
          "Instagram square posts display at 1080×1080 pixels (1:1 aspect ratio). Landscape posts are 1080×566 pixels (1.91:1), and portrait posts are 1080×1350 pixels (4:5). Pixquish includes all three as one-click presets in the Resize tab.",
      },
      {
        question: "How do I resize an image for Instagram without cropping?",
        answer:
          "Pick the Instagram Post preset (1080×1080) and choose the Contain fit mode. Pixquish fits your entire image inside the square with optional padding (solid color or blurred background) so nothing is cropped. Switch to Cover if you'd rather fill the square and crop the excess.",
      },
      {
        question: "What happens if I upload an image that's larger than 1080×1080?",
        answer:
          "Instagram downscales it to 1080×1080 anyway, which can introduce blur. Resizing in Pixquish first — with multi-step downscaling and optional sharpening — gives you a sharper result than letting Instagram do it. You also get to choose exactly how the image is cropped.",
      },
      {
        question: "Can I resize for Instagram Stories too?",
        answer:
          "Yes. Pixquish has a separate Instagram Story preset at 1080×1920 pixels (9:16). Pick it from the same preset dropdown — the rest of the workflow is identical.",
      },
      {
        question: "What's the best format for an Instagram post?",
        answer:
          "Use JPG for photos — smaller files, no quality difference on Instagram. Use PNG for graphics with text or sharp edges (logos, quotes). Pixquish can convert your image to either format during the resize, or compress it after if the file is too large.",
      },
      {
        question: "Is this Instagram post resizer free?",
        answer:
          "Yes. Pixquish is completely free, with no sign-up, no watermark, and no daily limit. Everything runs in your browser using the Canvas API — your photos never touch a server.",
      },
    ],
    ctaHref: "#resize",
    ctaLabel: "Resize for Instagram Post",
    relatedBlogSlugs: ["instagram-image-sizes-2026"],
  },
  {
    slug: "instagram-story",
    type: "resize",
    platform: "Instagram",
    h1: "Resize image for Instagram Story (1080×1920)",
    title: "Resize Image for Instagram Story (1080×1920) | Pixquish",
    description:
      "Resize image for Instagram Story — 1080×1920 pixels, 9:16 vertical. Free, private, in-browser. Pick the Instagram Story preset and download a perfectly sized image.",
    keyword: "instagram story size",
    targetDimensions: { width: 1080, height: 1920, unit: "px" },
    heroLead:
      "Instagram Stories display at 1080×1920 pixels (9:16 vertical). Pixquish resizes your image to exactly that with Cover, Contain, or Stretch fit modes — 100% in your browser, nothing uploaded.",
    whyUse: [
      SHARED_PRIVACY_WHY,
      {
        title: "Exact 1080×1920 every time",
        body: "Pick the Instagram Story preset and Pixquish sets the canvas to exactly 1080×1920 pixels — Instagram's recommended size for Stories and Reels. No math, no guesswork.",
      },
      {
        title: "Cover, Contain, or Stretch fit",
        body: "Cover fills the vertical canvas and center-crops the excess — best for photos. Contain fits the whole image inside with padding. Stretch fills the canvas exactly (with a distortion warning if the aspect ratio differs).",
      },
      {
        title: "Optional sharpening after resize",
        body: "Vertical resizes can soften detail. Pixquish has an optional unsharp mask that runs after the resize to bring edges back — toggle it on for crisp Stories.",
      },
    ],
    howToSteps: [
      {
        name: "Open the Resize tab",
        text: "Click the Resize Images button above, or scroll to the Resize workspace at the bottom of the page. Switch from the Compress tab if needed.",
      },
      {
        name: "Upload your image",
        text: "Drag a photo onto the resize drop zone, or click to pick one from your device. JPG, PNG, WebP, and AVIF are all accepted.",
      },
      {
        name: "Pick the Instagram Story preset",
        text: "In the preset dropdown, find Social → Instagram Story (1080×1920). The canvas is set to exactly 1080×1920 and the aspect lock engages automatically.",
      },
      {
        name: "Choose a fit mode",
        text: "Pick Cover to fill the vertical canvas and crop excess (best for photos), Contain to fit the whole image with padding, or Stretch to fill exactly (may distort). Adjust the cover offset to choose which part stays in frame.",
      },
      {
        name: "Resize and download",
        text: "Click Resize. Pixquish processes the image in your browser using a multi-step downscale for sharp results, then lets you download it with one click.",
      },
    ],
    specs: [
      { label: "Recommended size", value: "1080 × 1920 pixels" },
      { label: "Aspect ratio", value: "9:16 (vertical)" },
      { label: "Also used for", value: "Instagram Reels covers" },
      { label: "Best format", value: "JPG for photos, PNG for graphics with text" },
      { label: "File size tip", value: "Keep under 2 MB — Pixquish can compress after resize" },
    ],
    faqs: [
      {
        question: "What is the Instagram Story size?",
        answer:
          "Instagram Stories display at 1080×1920 pixels (9:16 aspect ratio, vertical). The same dimensions apply to Instagram Reels covers. Pixquish has an Instagram Story preset at exactly 1080×1920 — pick it from the Social group in the preset dropdown.",
      },
      {
        question: "How do I resize a horizontal photo for a vertical Story?",
        answer:
          "Pick the Instagram Story preset (1080×1920) and choose the Contain fit mode — Pixquish fits your horizontal photo inside the vertical canvas with optional padding (solid color or blurred background) so the whole image is visible. Switch to Cover to fill the vertical and crop the sides instead.",
      },
      {
        question: "What happens if I upload an image that's already 9:16 but the wrong resolution?",
        answer:
          "Pixquish will resize it to exactly 1080×1920 using a multi-step downscale, which produces sharper results than letting Instagram do it. Optional sharpening can bring back any lost detail.",
      },
      {
        question: "Can I resize for Instagram Posts too?",
        answer:
          "Yes. Pixquish has a separate Instagram Post preset at 1080×1080 pixels (1:1 square). Pick it from the same preset dropdown — the rest of the workflow is identical.",
      },
      {
        question: "What's the best format for an Instagram Story?",
        answer:
          "Use JPG for photos — smaller files, no visible quality difference on Instagram. Use PNG for graphics with text or sharp edges. Pixquish can convert your image to either format during the resize, or compress it after if the file is too large.",
      },
      {
        question: "Is this Instagram Story resizer free?",
        answer:
          "Yes. Pixquish is completely free, with no sign-up, no watermark, and no daily limit. Everything runs in your browser using the Canvas API — your photos never touch a server.",
      },
    ],
    ctaHref: "#resize",
    ctaLabel: "Resize for Instagram Story",
    relatedBlogSlugs: ["instagram-image-sizes-2026"],
  },
  {
    slug: "youtube-thumbnail",
    type: "resize",
    platform: "YouTube",
    h1: "Resize image for YouTube Thumbnail (1280×720)",
    title: "Resize Image for YouTube Thumbnail (1280×720) | Pixquish",
    description:
      "Resize image for YouTube Thumbnail — 1280×720 pixels, 16:9. Free, private, in-browser. Pick the YouTube Thumbnail preset and download a perfectly sized thumbnail.",
    keyword: "youtube thumbnail size",
    targetDimensions: { width: 1280, height: 720, unit: "px" },
    heroLead:
      "YouTube thumbnails must be exactly 1280×720 pixels (16:9). Pixquish resizes your image to that with Cover, Contain, or Stretch fit modes — 100% in your browser, nothing uploaded.",
    whyUse: [
      SHARED_PRIVACY_WHY,
      {
        title: "Exact 1280×720 every time",
        body: "Pick the YouTube Thumbnail preset and Pixquish sets the canvas to exactly 1280×720 pixels — the spec YouTube requires. No math, no guesswork.",
      },
      {
        title: "Cover, Contain, or Stretch fit",
        body: "Cover fills the 16:9 canvas and center-crops the excess — best for photos. Contain fits the whole image inside with padding. Stretch fills the canvas exactly (with a distortion warning if the aspect ratio differs).",
      },
      {
        title: "Optional sharpening for crisp thumbnails",
        body: "Thumbnails are viewed small, so detail matters. Pixquish's optional unsharp mask runs after the resize to bring edges back — toggle it on for click-worthy thumbnails.",
      },
    ],
    howToSteps: [
      {
        name: "Open the Resize tab",
        text: "Click the Resize Images button above, or scroll to the Resize workspace at the bottom of the page. Switch from the Compress tab if needed.",
      },
      {
        name: "Upload your image",
        text: "Drag a photo or design onto the resize drop zone, or click to pick one from your device. JPG, PNG, WebP, and AVIF are all accepted.",
      },
      {
        name: "Pick the YouTube Thumbnail preset",
        text: "In the preset dropdown, find Social → YouTube Thumbnail (1280×720). The canvas is set to exactly 1280×720 and the aspect lock engages automatically.",
      },
      {
        name: "Choose a fit mode",
        text: "Pick Cover to fill the 16:9 canvas and crop excess (best for photos), Contain to fit the whole image with padding, or Stretch to fill exactly (may distort). Adjust the cover offset to choose which part stays in frame.",
      },
      {
        name: "Resize and download",
        text: "Click Resize. Pixquish processes the image in your browser using a multi-step downscale for sharp results, then lets you download it with one click. Recommended: keep the file under 2 MB.",
      },
    ],
    specs: [
      { label: "Recommended size", value: "1280 × 720 pixels" },
      { label: "Aspect ratio", value: "16:9 (widescreen)" },
      { label: "Minimum size", value: "640 × 360 pixels (YouTube minimum)" },
      { label: "Max file size", value: "2 MB" },
      { label: "Best format", value: "JPG, PNG, or GIF (static)" },
      { label: "File size tip", value: "Compress after resize to stay under 2 MB" },
    ],
    faqs: [
      {
        question: "What is the YouTube thumbnail size?",
        answer:
          "YouTube thumbnails must be exactly 1280×720 pixels (16:9 aspect ratio), with a minimum width of 640 pixels and a maximum file size of 2 MB. Pixquish has a YouTube Thumbnail preset at exactly 1280×720 — pick it from the Social group in the preset dropdown.",
      },
      {
        question: "How do I make a YouTube thumbnail from a photo?",
        answer:
          "Upload your photo to the Pixquish Resize tab, pick the YouTube Thumbnail preset (1280×720), and choose the Cover fit mode to fill the 16:9 canvas (cropping the top and bottom). Adjust the cover offset to choose which part stays in frame, then click Resize and download.",
      },
      {
        question: "Can I add text or graphics to a YouTube thumbnail in Pixquish?",
        answer:
          "Pixquish is focused on compression and resizing, not image editing. For text overlays and graphics, design your thumbnail in a separate editor first, then bring the finished image into Pixquish to resize it to exactly 1280×720 and compress it under 2 MB.",
      },
      {
        question: "What happens if my YouTube thumbnail is too big?",
        answer:
          "YouTube rejects thumbnails over 2 MB. After resizing to 1280×720 in Pixquish, switch to the Compress tab to bring the file under 2 MB — or use the target file size feature to hit a specific size like 1 MB. JPG typically produces the smallest files.",
      },
      {
        question: "What's the best format for a YouTube thumbnail?",
        answer:
          "Use JPG for photos — smaller files, no visible quality difference at thumbnail viewing sizes. Use PNG for thumbnails with text or sharp graphics. Pixquish can convert your image to either format during the resize.",
      },
      {
        question: "Is this YouTube thumbnail resizer free?",
        answer:
          "Yes. Pixquish is completely free, with no sign-up, no watermark, and no daily limit. Everything runs in your browser using the Canvas API — your images never touch a server.",
      },
    ],
    ctaHref: "#resize",
    ctaLabel: "Resize for YouTube Thumbnail",
    relatedBlogSlugs: ["youtube-thumbnail-size"],
  },
  {
    slug: "twitter-header",
    type: "resize",
    platform: "Twitter",
    h1: "Resize image for Twitter Header (1500×500)",
    title: "Resize Image for Twitter Header (1500×500) | Pixquish",
    description:
      "Resize image for Twitter Header — 1500×500 pixels, 3:1. Free, private, in-browser. Pick the Twitter Header preset and download a perfectly sized banner.",
    keyword: "twitter header size",
    targetDimensions: { width: 1500, height: 500, unit: "px" },
    heroLead:
      "Twitter / X headers display at 1500×500 pixels (3:1 banner). Pixquish resizes your image to exactly that with Cover, Contain, or Stretch fit modes — 100% in your browser, nothing uploaded.",
    whyUse: [
      SHARED_PRIVACY_WHY,
      {
        title: "Exact 1500×500 every time",
        body: "Pick the X / Twitter Header preset and Pixquish sets the canvas to exactly 1500×500 pixels — the recommended banner size. No math, no guesswork.",
      },
      {
        title: "Cover, Contain, or Stretch fit",
        body: "Cover fills the wide banner and center-crops the excess — best for photos. Contain fits the whole image inside with padding. Stretch fills the banner exactly (with a distortion warning if the aspect ratio differs).",
      },
      {
        title: "Adjustable crop position",
        body: "The 3:1 aspect ratio is unforgiving. Pixquish lets you slide the cover crop horizontally and vertically so you can keep the most important part of your image in frame.",
      },
    ],
    howToSteps: [
      {
        name: "Open the Resize tab",
        text: "Click the Resize Images button above, or scroll to the Resize workspace at the bottom of the page. Switch from the Compress tab if needed.",
      },
      {
        name: "Upload your image",
        text: "Drag a photo onto the resize drop zone, or click to pick one from your device. JPG, PNG, WebP, and AVIF are all accepted.",
      },
      {
        name: "Pick the X / Twitter Header preset",
        text: "In the preset dropdown, find Social → X / Twitter Header (1500×500). The canvas is set to exactly 1500×500 and the aspect lock engages automatically.",
      },
      {
        name: "Choose a fit mode and adjust crop",
        text: "Pick Cover to fill the banner and crop excess (best for photos), Contain to fit the whole image with padding, or Stretch to fill exactly. Use the cover offset sliders to position the crop.",
      },
      {
        name: "Resize and download",
        text: "Click Resize. Pixquish processes the image in your browser using a multi-step downscale for sharp results, then lets you download it with one click.",
      },
    ],
    specs: [
      { label: "Recommended size", value: "1500 × 500 pixels" },
      { label: "Aspect ratio", value: "3:1 (wide banner)" },
      { label: "Minimum size", value: "1252 × 626 pixels" },
      { label: "Max file size", value: "5 MB (Twitter limit)" },
      { label: "Best format", value: "JPG for photos, PNG for graphics" },
      { label: "File size tip", value: "Pixquish can compress after resize" },
    ],
    faqs: [
      {
        question: "What is the Twitter header size?",
        answer:
          "Twitter / X headers display at 1500×500 pixels (3:1 aspect ratio). Twitter's minimum is 1252×626 pixels, but 1500×500 is the recommended size for sharp display on all devices. Pixquish has an X / Twitter Header preset at exactly 1500×500.",
      },
      {
        question: "Why does my Twitter header look cropped on mobile?",
        answer:
          "Twitter crops headers aggressively on mobile to fit smaller screens — typically the center 3:1 band of your image. Keep important content (logos, faces, text) in the horizontal center band and avoid edges. Pixquish's Cover fit mode with adjustable crop offset lets you choose exactly what stays in the safe zone.",
      },
      {
        question: "How do I resize a tall photo for a wide Twitter header?",
        answer:
          "Pick the X / Twitter Header preset (1500×500) and choose the Cover fit mode — Pixquish fills the wide banner with your photo and crops the top and bottom. Use the cover offset Y slider to choose which part of the photo stays in frame. Switch to Contain if you'd rather fit the whole photo with padding.",
      },
      {
        question: "What happens if my Twitter header is over 5 MB?",
        answer:
          "Twitter rejects headers over 5 MB. After resizing to 1500×500 in Pixquish, switch to the Compress tab to bring the file under the limit — or use the target file size feature to hit a specific size. JPG typically produces the smallest files.",
      },
      {
        question: "What's the best format for a Twitter header?",
        answer:
          "Use JPG for photos — smaller files, no visible quality difference at banner viewing sizes. Use PNG for headers with text, logos, or sharp graphics. Pixquish can convert your image to either format during the resize.",
      },
      {
        question: "Is this Twitter header resizer free?",
        answer:
          "Yes. Pixquish is completely free, with no sign-up, no watermark, and no daily limit. Everything runs in your browser using the Canvas API — your images never touch a server.",
      },
    ],
    ctaHref: "#resize",
    ctaLabel: "Resize for Twitter Header",
    relatedBlogSlugs: [],
  },
  {
    slug: "facebook-cover",
    type: "resize",
    platform: "Facebook",
    h1: "Resize image for Facebook Cover (820×312)",
    title: "Resize Image for Facebook Cover (820×312) | Pixquish",
    description:
      "Resize image for Facebook Cover — 820×312 pixels. Free, private, in-browser. Pick the Facebook Cover preset and download a perfectly sized cover photo.",
    keyword: "facebook cover photo size",
    targetDimensions: { width: 820, height: 312, unit: "px" },
    heroLead:
      "Facebook cover photos display at 820×312 pixels on desktop (640×360 on mobile). Pixquish resizes your image to 820×312 with Cover, Contain, or Stretch fit modes — 100% in your browser, nothing uploaded.",
    whyUse: [
      SHARED_PRIVACY_WHY,
      {
        title: "Exact 820×312 every time",
        body: "Pick the Facebook Cover preset and Pixquish sets the canvas to exactly 820×312 pixels — Facebook's recommended desktop cover size. No math, no guesswork.",
      },
      {
        title: "Cover, Contain, or Stretch fit",
        body: "Cover fills the wide banner and center-crops the excess — best for photos. Contain fits the whole image inside with padding. Stretch fills the banner exactly (with a distortion warning if the aspect ratio differs).",
      },
      {
        title: "Adjustable crop position",
        body: "Facebook crops covers differently on desktop vs mobile. Pixquish lets you slide the cover crop horizontally and vertically so you can keep the most important part of your image in the safe zone.",
      },
    ],
    howToSteps: [
      {
        name: "Open the Resize tab",
        text: "Click the Resize Images button above, or scroll to the Resize workspace at the bottom of the page. Switch from the Compress tab if needed.",
      },
      {
        name: "Upload your image",
        text: "Drag a photo onto the resize drop zone, or click to pick one from your device. JPG, PNG, WebP, and AVIF are all accepted.",
      },
      {
        name: "Pick the Facebook Cover preset",
        text: "In the preset dropdown, find Social → Facebook Cover (820×312). The canvas is set to exactly 820×312 and the aspect lock engages automatically.",
      },
      {
        name: "Choose a fit mode and adjust crop",
        text: "Pick Cover to fill the banner and crop excess (best for photos), Contain to fit the whole image with padding, or Stretch to fill exactly. Use the cover offset sliders to position the crop.",
      },
      {
        name: "Resize and download",
        text: "Click Resize. Pixquish processes the image in your browser using a multi-step downscale for sharp results, then lets you download it with one click.",
      },
    ],
    specs: [
      { label: "Recommended size", value: "820 × 312 pixels (desktop)" },
      { label: "Mobile display", value: "640 × 360 pixels" },
      { label: "Aspect ratio", value: "Approximately 2.63:1 (desktop)" },
      { label: "Best format", value: "JPG for photos, PNG for graphics with text" },
      { label: "File size tip", value: "Keep under 100 KB for fast page load" },
      { label: "Safe zone", value: "Keep key content in the central horizontal band" },
    ],
    faqs: [
      {
        question: "What is the Facebook cover photo size?",
        answer:
          "Facebook cover photos display at 820×312 pixels on desktop and 640×360 pixels on mobile. The recommended upload size is 820×312 (or 820×462 to account for mobile cropping). Pixquish has a Facebook Cover preset at exactly 820×312 — pick it from the Social group in the preset dropdown.",
      },
      {
        question: "Why does my Facebook cover look different on mobile?",
        answer:
          "Facebook crops cover photos differently on desktop vs mobile — mobile shows a taller crop from the center of your image. Keep important content (logos, faces, text) in the central horizontal band and avoid the very top and bottom edges. Pixquish's Cover fit mode with adjustable crop offset lets you choose what stays in the safe zone.",
      },
      {
        question: "How do I resize a tall photo for a Facebook cover?",
        answer:
          "Pick the Facebook Cover preset (820×312) and choose the Cover fit mode — Pixquish fills the wide banner with your photo and crops the top and bottom. Use the cover offset Y slider to choose which part of the photo stays in frame. Switch to Contain if you'd rather fit the whole photo with padding.",
      },
      {
        question: "What's the best format for a Facebook cover?",
        answer:
          "Use JPG for photos — smaller files, no visible quality difference at cover viewing sizes. Use PNG for covers with text, logos, or sharp graphics. Pixquish can convert your image to either format during the resize, or compress it after if the file is too large.",
      },
      {
        question: "Can I resize for a Facebook Post too?",
        answer:
          "Yes. Pixquish has a Facebook Post preset at 1200×630 pixels (the recommended share size). Pick it from the same Social group in the preset dropdown — the rest of the workflow is identical.",
      },
      {
        question: "Is this Facebook cover resizer free?",
        answer:
          "Yes. Pixquish is completely free, with no sign-up, no watermark, and no daily limit. Everything runs in your browser using the Canvas API — your images never touch a server.",
      },
    ],
    ctaHref: "#resize",
    ctaLabel: "Resize for Facebook Cover",
    relatedBlogSlugs: [],
  },
  {
    slug: "linkedin-banner",
    type: "resize",
    platform: "LinkedIn",
    h1: "Resize image for LinkedIn Banner (1584×396)",
    title: "Resize Image for LinkedIn Banner (1584×396) | Pixquish",
    description:
      "Resize image for LinkedIn Banner — 1584×396 pixels. Free, private, in-browser. Pick a LinkedIn banner size and download a perfectly sized background.",
    keyword: "linkedin banner size",
    targetDimensions: { width: 1584, height: 396, unit: "px" },
    heroLead:
      "LinkedIn profile banners display at 1584×396 pixels (4:1). Pixquish resizes your image to exactly that with Cover, Contain, or Stretch fit modes — 100% in your browser, nothing uploaded.",
    whyUse: [
      SHARED_PRIVACY_WHY,
      {
        title: "Exact 1584×396 every time",
        body: "Pixquish sets the canvas to exactly 1584×396 pixels — LinkedIn's recommended banner size for profile background images. No math, no guesswork. Use a custom dimension input if you need company page banners.",
      },
      {
        title: "Cover, Contain, or Stretch fit",
        body: "Cover fills the wide banner and center-crops the excess — best for photos. Contain fits the whole image inside with padding. Stretch fills the banner exactly (with a distortion warning if the aspect ratio differs).",
      },
      {
        title: "Adjustable crop position",
        body: "The 4:1 aspect ratio is unforgiving. Pixquish lets you slide the cover crop horizontally and vertically so you can keep the most important part of your image in frame.",
      },
    ],
    howToSteps: [
      {
        name: "Open the Resize tab",
        text: "Click the Resize Images button above, or scroll to the Resize workspace at the bottom of the page. Switch from the Compress tab if needed.",
      },
      {
        name: "Upload your image",
        text: "Drag a photo onto the resize drop zone, or click to pick one from your device. JPG, PNG, WebP, and AVIF are all accepted.",
      },
      {
        name: "Set the LinkedIn banner dimensions",
        text: "There is no built-in LinkedIn Banner preset, so use the custom width and height inputs: set Width to 1584 and Height to 396. The aspect lock will keep the 4:1 ratio if you only enter one value.",
      },
      {
        name: "Choose a fit mode and adjust crop",
        text: "Pick Cover to fill the banner and crop excess (best for photos), Contain to fit the whole image with padding, or Stretch to fill exactly. Use the cover offset sliders to position the crop.",
      },
      {
        name: "Resize and download",
        text: "Click Resize. Pixquish processes the image in your browser using a multi-step downscale for sharp results, then lets you download it with one click.",
      },
    ],
    specs: [
      { label: "Personal profile banner", value: "1584 × 396 pixels (4:1)" },
      { label: "Company page banner", value: "1536 × 768 pixels (2:1)" },
      { label: "Recommended upload", value: "1584 × 396 pixels" },
      { label: "Max file size", value: "8 MB (LinkedIn limit)" },
      { label: "Best format", value: "JPG for photos, PNG for graphics with text" },
      { label: "Safe zone", value: "Keep key content centered — LinkedIn crops on mobile" },
    ],
    faqs: [
      {
        question: "What is the LinkedIn banner size?",
        answer:
          "LinkedIn personal profile banners display at 1584×396 pixels (4:1 aspect ratio). LinkedIn company page banners are 1536×768 pixels (2:1). For a personal profile, upload at exactly 1584×396. Pixquish has custom width and height inputs that let you set either dimension precisely.",
      },
      {
        question: "Why does my LinkedIn banner look cropped on mobile?",
        answer:
          "LinkedIn crops banners differently on desktop vs mobile — mobile shows a tighter crop from the center of your image. Keep important content (logos, text, faces) in the central horizontal band and avoid the very top and bottom edges. Pixquish's Cover fit mode with adjustable crop offset lets you choose what stays in the safe zone.",
      },
      {
        question: "How do I resize a tall photo for a LinkedIn banner?",
        answer:
          "Set the custom dimensions to 1584×396 (or pick LinkedIn from the preset dropdown if shown), then choose the Cover fit mode — Pixquish fills the wide banner with your photo and crops the top and bottom. Use the cover offset Y slider to choose which part of the photo stays in frame. Switch to Contain if you'd rather fit the whole photo with padding.",
      },
      {
        question: "What's the best format for a LinkedIn banner?",
        answer:
          "Use JPG for photos — smaller files, no visible quality difference at banner viewing sizes. Use PNG for banners with text, logos, or sharp graphics. Pixquish can convert your image to either format during the resize, or compress it after if the file is too large.",
      },
      {
        question: "What about a LinkedIn company page banner?",
        answer:
          "LinkedIn company page banners are 1536×768 pixels (2:1 aspect ratio). Set Pixquish's custom width to 1536 and height to 768, then follow the same workflow — Cover for photos, Contain for graphics with padding.",
      },
      {
        question: "Is this LinkedIn banner resizer free?",
        answer:
          "Yes. Pixquish is completely free, with no sign-up, no watermark, and no daily limit. Everything runs in your browser using the Canvas API — your images never touch a server.",
      },
    ],
    ctaHref: "#resize",
    ctaLabel: "Resize for LinkedIn Banner",
    relatedBlogSlugs: [],
  },
];

/** Get all landing pages (compress + resize). */
export function getAllLandingPages(): LandingPage[] {
  return LANDING_PAGES;
}

/** Get all compress pages. */
export function getCompressPages(): LandingPage[] {
  return LANDING_PAGES.filter((p) => p.type === "compress");
}

/** Get all resize pages. */
export function getResizePages(): LandingPage[] {
  return LANDING_PAGES.filter((p) => p.type === "resize");
}

/** Get a single landing page by type and slug. Returns null if not found. */
export function getLandingPage(
  type: LandingPageType,
  slug: string,
): LandingPage | null {
  return LANDING_PAGES.find((p) => p.type === type && p.slug === slug) ?? null;
}

/** Get all slugs for a given type — used by generateStaticParams. */
export function getSlugsByType(type: LandingPageType): string[] {
  return LANDING_PAGES.filter((p) => p.type === type).map((p) => p.slug);
}

/** Get all landing pages of the same type EXCEPT the given slug — for "Related tools" links. */
export function getRelatedLandingPages(
  type: LandingPageType,
  excludeSlug: string,
): LandingPage[] {
  return LANDING_PAGES.filter(
    (p) => p.type === type && p.slug !== excludeSlug,
  );
}

/** Public URL path for a landing page. */
export function getLandingPagePath(page: LandingPage): string {
  return page.type === "compress"
    ? `/compress/${page.slug}`
    : `/resize/${page.slug}`;
}
