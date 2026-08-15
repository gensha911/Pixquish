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

  // ── Batch 2: Resize pages (more presets) ───────────────────────────────
  {
    slug: "pinterest-pin",
    type: "resize",
    platform: "Pinterest Pin",
    h1: "Resize image for Pinterest Pin (1000×1500)",
    title: "Resize Image for Pinterest Pin (1000×1500) | Pixquish",
    description:
      "Pinterest pin size is 1000×1500 pixels (2:3). Resize your image for Pinterest in your browser — free, private, no uploads. Pick the Pinterest Pin preset.",
    keyword: "pinterest pin size",
    targetDimensions: { width: 1000, height: 1500, unit: "px" },
    heroLead:
      "Pinterest pins display best at 1000×1500 pixels (2:3 portrait). Pixquish resizes your image to exactly that with Cover, Contain, or Stretch fit modes — 100% in your browser, nothing uploaded.",
    whyUse: [
      SHARED_PRIVACY_WHY,
      {
        title: "Perfect 2:3 ratio for the Pinterest feed",
        body: "Pinterest's algorithm favours pins in the 2:3 vertical ratio. Pick the Pinterest Pin preset and Pixquish sets the canvas to exactly 1000×1500 pixels — the size Pinterest recommends for sharp display in feeds, boards, and search results.",
      },
      {
        title: "Cover, Contain, or Stretch fit",
        body: "Cover fills the portrait canvas and center-crops the excess — best for horizontal photos. Contain fits the whole image inside with padding (good for square originals). Stretch fills the canvas exactly (with a distortion warning if the aspect ratio differs).",
      },
      {
        title: "Crisp at feed size and zoomed-in",
        body: "Pinterest serves your pin at small feed sizes but users tap to zoom. Pixquish uses multi-step downscaling and an optional unsharp mask so the image stays sharp at both — no mushy edges, no jagged text.",
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
        name: "Pick the Pinterest Pin preset",
        text: "In the preset dropdown, find Social → Pinterest Pin (1000×1500). The canvas is set to exactly 1000×1500 and the aspect lock engages automatically.",
      },
      {
        name: "Choose a fit mode",
        text: "Pick Cover to fill the portrait canvas and crop excess (best for landscape photos), Contain to fit the whole image with padding (good for square or vertical originals), or Stretch to fill exactly. Use the cover offset sliders to choose which part stays in frame.",
      },
      {
        name: "Resize and download",
        text: "Click Resize. Pixquish processes the image in your browser using a multi-step downscale for sharp results, then lets you download it with one click. Tip: switch to the Compress tab to keep the file under 2 MB for faster loading.",
      },
    ],
    specs: [
      { label: "Recommended size", value: "1000 × 1500 pixels" },
      { label: "Aspect ratio", value: "2:3 (portrait)" },
      { label: "Minimum size", value: "600 × 900 pixels" },
      { label: "Max file size", value: "Keep under 2 MB for fast loading" },
      { label: "Best format", value: "PNG for graphics with text, JPG for photos" },
      { label: "Best fit mode", value: "Cover for landscape photos, Contain to preserve whole image" },
    ],
    faqs: [
      {
        question: "What size is a Pinterest pin?",
        answer:
          "Pinterest pins display best at 1000×1500 pixels — a 2:3 vertical aspect ratio. Pinterest's minimum is 600×900 pixels, but 1000×1500 gives the sharpest result on retina displays and in the Pinterest feed. Pixquish has a Pinterest Pin preset at exactly 1000×1500 — pick it from the Social group in the preset dropdown.",
      },
      {
        question: "What's the best aspect ratio for Pinterest pins?",
        answer:
          "Pinterest's algorithm favours pins in the 2:3 vertical ratio (like 1000×1500). Taller ratios (like 1:3) may get cut off in the feed, and shorter ratios (like 1:1) get less reach. The Pinterest Pin preset in Pixquish locks the canvas to 2:3 so you don't have to think about it.",
      },
      {
        question: "Should I use PNG or JPG for Pinterest?",
        answer:
          "Use JPG for photos — smaller files, no visible quality difference at Pinterest's display sizes, and faster loading in feeds. Use PNG for pins with text overlays, logos, or sharp graphics (PNG keeps text crisp). Pixquish can convert your image to either format during the resize, or compress it after if the file is over 2 MB.",
      },
      {
        question: "How do I resize an image for Pinterest without cropping?",
        answer:
          "Pick the Pinterest Pin preset (1000×1500) and choose the Contain fit mode. Pixquish fits your entire image inside the portrait canvas with optional padding (solid color or blurred background) so nothing is cropped. Switch to Cover if you'd rather fill the canvas and crop the excess.",
      },
      {
        question: "Why is my Pinterest pin blurry?",
        answer:
          "Pinterest downscales any image larger than 1000×1500, which can introduce blur. Uploading a much smaller image also makes it blurry when users tap to zoom. Resizing in Pixquish first — with multi-step downscaling and optional sharpening — produces a sharper result than letting Pinterest do it. Keep the file size under 2 MB so it loads fast.",
      },
      {
        question: "Is this Pinterest resizer free?",
        answer:
          "Yes. Pixquish is completely free, with no sign-up, no watermark, and no daily limit. Everything runs in your browser using the Canvas API — your photos never touch a server.",
      },
    ],
    ctaHref: "#resize",
    ctaLabel: "Resize for Pinterest Pin",
    relatedBlogSlugs: ["instagram-image-sizes-2026"],
  },
  {
    slug: "favicon",
    type: "resize",
    platform: "Favicon",
    h1: "Make a favicon from any image (256×256)",
    title: "Make a Favicon Online — Free Favicon Maker | Pixquish",
    description:
      "Favicon size guide: make a favicon at 256×256 from any image — free, private, no uploads. Pixquish outputs crisp favicons for web, PWA, and touch icons.",
    keyword: "favicon size",
    targetDimensions: { width: 256, height: 256, unit: "px" },
    heroLead:
      "Favicons display at 16×16 in browser tabs but the recommended source size is 256×256 pixels so it stays crisp on high-DPI screens, as an Apple touch icon, and as a PWA icon. Pixquish resizes your image to a square favicon — 100% in your browser, nothing uploaded.",
    whyUse: [
      SHARED_PRIVACY_WHY,
      {
        title: "Crisp at 16×16 and sharp at 256×256",
        body: "A favicon is shown at tiny sizes where every pixel counts. Pixquish's multi-step downscaling keeps edges sharp so text and logos are still readable at 16×16 — and the same 256×256 file stays sharp when shown larger as a PWA or touch icon.",
      },
      {
        title: "Pick PNG for crisp edges, no JPG ringing",
        body: "PNG is the right format for favicons because it's lossless and supports transparency — no JPEG ringing around text or logos. Pixquish lets you pick PNG as the output format during the resize, or keep WebP/AVIF for smaller app-style icons.",
      },
      {
        title: "Square canvas with cover, contain, or stretch",
        body: "The Favicon preset locks the canvas to exactly 256×256. Pick Cover to fill the square and crop excess (best for landscape logos), Contain to fit the whole image with padding (good for non-square logos with whitespace), or Stretch to fill exactly.",
      },
    ],
    howToSteps: [
      {
        name: "Open the Resize tab",
        text: "Click the Resize Images button above, or scroll to the Resize workspace at the bottom of the page. Switch from the Compress tab if needed.",
      },
      {
        name: "Upload your image",
        text: "Drag a logo or photo onto the resize drop zone, or click to pick one from your device. JPG, PNG, WebP, and AVIF are all accepted. PNG with transparency works best for favicons.",
      },
      {
        name: "Pick the Favicon preset",
        text: "In the preset dropdown, find Web → Favicon (256×256). The canvas is set to exactly 256×256 and the aspect lock engages automatically.",
      },
      {
        name: "Choose PNG output and a fit mode",
        text: "Pick PNG as the output format so the favicon stays crisp and supports transparency. Then choose Cover to fill the square and crop excess (best for non-square logos), Contain to fit the whole logo with padding, or Stretch to fill exactly. Use the cover offset sliders to position the crop.",
      },
      {
        name: "Resize and download",
        text: "Click Resize. Pixquish processes the image in your browser using a multi-step downscale for sharp results at small sizes, then lets you download the PNG with one click. Add it to your site's <link rel=\"icon\"> tag.",
      },
    ],
    specs: [
      { label: "Recommended size", value: "256 × 256 pixels (source)" },
      { label: "Aspect ratio", value: "1:1 (square)" },
      { label: "Common sizes", value: "16×16, 32×32, 48×48, 180×180 (Apple touch), 192×192 (Android), 256×256 (PWA)" },
      { label: "Best format", value: "PNG (lossless, transparency, no JPG ringing)" },
      { label: "Best fit mode", value: "Contain to preserve whole logo, Cover for full-bleed" },
      { label: "Max file size", value: "Keep under 10 KB — favicons load on every page" },
    ],
    faqs: [
      {
        question: "What size is a favicon?",
        answer:
          "Favicons display at 16×16 pixels in browser tabs and 32×32 pixels on newer high-DPI screens. The recommended source size is 256×256 pixels — large enough to look crisp as an Apple touch icon (180×180), an Android home-screen icon (192×192), and a PWA icon. Pixquish has a Favicon preset at exactly 256×256.",
      },
      {
        question: "What format should a favicon be?",
        answer:
          "PNG is the right format for favicons. It's lossless, supports transparency, and avoids the ringing artifacts that JPEG introduces around text and logos. Modern browsers also accept SVG favicons, but Pixquish outputs raster PNG, JPG, WebP, or AVIF — pick PNG in the output selector for the crispest result.",
      },
      {
        question: "How do I make a favicon from an image?",
        answer:
          "Upload your image to the Pixquish Resize tab, pick the Favicon preset (256×256), choose PNG as the output format, and pick the Contain fit mode if your logo isn't square (so nothing is cropped). Click Resize and download the PNG. Add it to your site with <link rel=\"icon\" type=\"image/png\" href=\"/favicon.png\">.",
      },
      {
        question: "What's the Apple touch icon size?",
        answer:
          "The Apple touch icon is 180×180 pixels. The Android home-screen icon is 192×192, and the PWA icon is 512×512 (with 192×192 as a fallback). Uploading a single 256×256 source favicon and letting each platform downscale it works well — and Pixquish's multi-step downscaling produces sharper results than letting the browser do it.",
      },
      {
        question: "Do favicons need to be square?",
        answer:
          "Yes. Favicons are always displayed in a square aspect ratio in browser tabs, bookmarks, and home screens. Non-square favicons get cropped by the browser, often awkwardly. Use Pixquish's Favicon preset (256×256) and choose Contain if your logo is not square — it will be padded with whitespace rather than cropped.",
      },
      {
        question: "Is this favicon maker free?",
        answer:
          "Yes. Pixquish is completely free, with no sign-up, no watermark, and no daily limit. Everything runs in your browser using the Canvas API — your images never touch a server.",
      },
    ],
    ctaHref: "#resize",
    ctaLabel: "Make a favicon now",
    relatedBlogSlugs: ["best-image-format-for-web"],
  },
  {
    slug: "twitter-post",
    type: "resize",
    platform: "X / Twitter Post",
    h1: "Resize image for X / Twitter Post (1600×900)",
    title: "Resize Image for X / Twitter Post (1600×900) | Pixquish",
    description:
      "Twitter post size is 1600×900 pixels (16:9). Resize your image for X / Twitter in your browser — free, private, no uploads. Pick the X / Twitter Post preset.",
    keyword: "twitter post size",
    targetDimensions: { width: 1600, height: 900, unit: "px" },
    heroLead:
      "X / Twitter post images display best at 1600×900 pixels (16:9). Pixquish resizes your image to exactly that with Cover, Contain, or Stretch fit modes — 100% in your browser, nothing uploaded.",
    whyUse: [
      SHARED_PRIVACY_WHY,
      {
        title: "Exact 1600×900 every time",
        body: "Pick the X / Twitter Post preset and Pixquish sets the canvas to exactly 1600×900 pixels — the 16:9 size X displays in the timeline and on the post detail page. No math, no guesswork.",
      },
      {
        title: "Cover, Contain, or Stretch fit",
        body: "Cover fills the 16:9 canvas and center-crops the excess — best for portrait photos or vertical designs. Contain fits the whole image inside with padding. Stretch fills the canvas exactly (with a distortion warning if the aspect ratio differs).",
      },
      {
        title: "Adjustable crop position",
        body: "The 16:9 ratio crops portrait and 4:5 images heavily. Pixquish lets you slide the cover crop vertically and horizontally so the most important part of your image — face, headline, logo — stays in frame.",
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
        name: "Pick the X / Twitter Post preset",
        text: "In the preset dropdown, find Social → X / Twitter Post (1600×900). The canvas is set to exactly 1600×900 and the aspect lock engages automatically.",
      },
      {
        name: "Choose a fit mode and adjust crop",
        text: "Pick Cover to fill the 16:9 canvas and crop excess (best for portrait images), Contain to fit the whole image with padding, or Stretch to fill exactly. Use the cover offset sliders to position the crop so the key subject stays in frame.",
      },
      {
        name: "Resize and download",
        text: "Click Resize. Pixquish processes the image in your browser using a multi-step downscale for sharp results, then lets you download it with one click. Tip: keep the file under 5 MB so X accepts it without further recompression.",
      },
    ],
    specs: [
      { label: "Recommended size", value: "1600 × 900 pixels" },
      { label: "Aspect ratio", value: "16:9 (widescreen)" },
      { label: "Minimum size", value: "600 × 335 pixels" },
      { label: "Max file size", value: "5 MB (X / Twitter limit)" },
      { label: "Best format", value: "JPG for photos, PNG for graphics with text" },
      { label: "Best fit mode", value: "Cover for portrait originals, Contain to preserve whole image" },
    ],
    faqs: [
      {
        question: "What is the X / Twitter post size?",
        answer:
          "X / Twitter post images display best at 1600×900 pixels — a 16:9 aspect ratio. The minimum is 600×335 pixels, and the maximum file size is 5 MB. Pixquish has an X / Twitter Post preset at exactly 1600×900 — pick it from the Social group in the preset dropdown.",
      },
      {
        question: "Why does my Twitter post image look cropped?",
        answer:
          "X crops images to 16:9 in the timeline and on the post detail page. Portrait or 4:5 images get cropped heavily — sometimes the most important part of the image ends up cut off. Pick the X / Twitter Post preset (1600×900) and use the Cover fit mode with adjustable offset so you choose what stays in frame, rather than letting X decide.",
      },
      {
        question: "How do I resize a portrait photo for a 16:9 Twitter post?",
        answer:
          "Pick the X / Twitter Post preset (1600×900) and choose the Cover fit mode — Pixquish fills the 16:9 canvas with your portrait photo and crops the top and bottom. Use the cover offset Y slider to keep the subject (face, product) in frame. Switch to Contain if you'd rather fit the whole photo with padding.",
      },
      {
        question: "What happens if my Twitter post image is over 5 MB?",
        answer:
          "X rejects images over 5 MB. After resizing to 1600×900 in Pixquish, switch to the Compress tab to bring the file under the limit — or use the target file size feature to hit a specific size like 1 MB. JPG typically produces the smallest files.",
      },
      {
        question: "What's the best format for an X / Twitter post?",
        answer:
          "Use JPG for photos — smaller files, no visible quality difference at the sizes X displays. Use PNG for graphics with text, logos, or sharp edges (PNG keeps text crisp and avoids JPEG ringing). Pixquish can convert your image to either format during the resize.",
      },
      {
        question: "Is this X / Twitter post resizer free?",
        answer:
          "Yes. Pixquish is completely free, with no sign-up, no watermark, and no daily limit. Everything runs in your browser using the Canvas API — your images never touch a server.",
      },
    ],
    ctaHref: "#resize",
    ctaLabel: "Resize for X / Twitter Post",
    relatedBlogSlugs: ["instagram-image-sizes-2026"],
  },
  {
    slug: "facebook-post",
    type: "resize",
    platform: "Facebook Post",
    h1: "Resize image for Facebook Post (1200×630)",
    title: "Resize Image for Facebook Post (1200×630) | Pixquish",
    description:
      "Facebook post size is 1200×630 pixels (1.91:1). Resize your image for Facebook in your browser — free, private, no uploads. Pick the Facebook Post preset.",
    keyword: "facebook post size",
    targetDimensions: { width: 1200, height: 630, unit: "px" },
    heroLead:
      "Facebook posts and link previews display at 1200×630 pixels (1.91:1). Pixquish resizes your image to exactly that with Cover, Contain, or Stretch fit modes — 100% in your browser, nothing uploaded.",
    whyUse: [
      SHARED_PRIVACY_WHY,
      {
        title: "Exact 1200×630 every time",
        body: "Pick the Facebook Post preset and Pixquish sets the canvas to exactly 1200×630 pixels — the size Facebook uses for feed posts, link previews, and Open Graph images. No math, no guesswork.",
      },
      {
        title: "Cover, Contain, or Stretch fit",
        body: "Cover fills the 1.91:1 canvas and center-crops the excess — best for portrait photos. Contain fits the whole image inside with padding (good for square originals). Stretch fills the canvas exactly (with a distortion warning if the aspect ratio differs).",
      },
      {
        title: "Also the right size for Open Graph images",
        body: "1200×630 is the Open Graph image size — the preview shown when your link is shared on Facebook, LinkedIn, Slack, and most messaging apps. One preset gives you a correctly sized image for every share surface.",
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
        name: "Pick the Facebook Post preset",
        text: "In the preset dropdown, find Social → Facebook Post (1200×630). The canvas is set to exactly 1200×630 and the aspect lock engages automatically.",
      },
      {
        name: "Choose a fit mode and adjust crop",
        text: "Pick Cover to fill the 1.91:1 canvas and crop excess (best for portrait images), Contain to fit the whole image with padding, or Stretch to fill exactly. Use the cover offset sliders to position the crop so the key subject stays in frame.",
      },
      {
        name: "Resize and download",
        text: "Click Resize. Pixquish processes the image in your browser using a multi-step downscale for sharp results, then lets you download it with one click. Tip: keep the file under 1 MB for fast feed loading.",
      },
    ],
    specs: [
      { label: "Recommended size", value: "1200 × 630 pixels" },
      { label: "Aspect ratio", value: "1.91:1 (link preview)" },
      { label: "Minimum size", value: "600 × 315 pixels" },
      { label: "Max file size", value: "Keep under 1 MB for fast feed loading" },
      { label: "Best format", value: "JPG for photos, PNG for graphics with text" },
      { label: "Best fit mode", value: "Cover for portrait originals, Contain to preserve whole image" },
    ],
    faqs: [
      {
        question: "What is the Facebook post size?",
        answer:
          "Facebook feed posts and link previews display at 1200×630 pixels — a 1.91:1 aspect ratio. The minimum is 600×315 pixels. Pixquish has a Facebook Post preset at exactly 1200×630 — pick it from the Social group in the preset dropdown. The same size works for Open Graph images used by other platforms too.",
      },
      {
        question: "Why does my Facebook post image look different on mobile?",
        answer:
          "Facebook crops images differently on desktop vs mobile — mobile shows a slightly taller crop from the center of your image. Keep important content (logos, faces, text) in the central horizontal band and avoid the very top and bottom edges. Pixquish's Cover fit mode with adjustable crop offset lets you choose what stays in the safe zone.",
      },
      {
        question: "How do I resize a portrait photo for a 1.91:1 Facebook post?",
        answer:
          "Pick the Facebook Post preset (1200×630) and choose the Cover fit mode — Pixquish fills the 1.91:1 canvas with your portrait photo and crops the top and bottom. Use the cover offset Y slider to keep the subject (face, product) in frame. Switch to Contain if you'd rather fit the whole photo with padding.",
      },
      {
        question: "Is 1200×630 the right size for Open Graph images too?",
        answer:
          "Yes. 1200×630 is the Open Graph image size — the preview shown when your link is shared on Facebook, LinkedIn, Slack, Discord, and most messaging apps. One Facebook Post preset gives you a correctly sized image for every share surface.",
      },
      {
        question: "What's the best format for a Facebook post?",
        answer:
          "Use JPG for photos — smaller files, no visible quality difference at Facebook's display sizes. Use PNG for graphics with text, logos, or sharp edges. Pixquish can convert your image to either format during the resize, or compress it after if the file is over 1 MB.",
      },
      {
        question: "Is this Facebook post resizer free?",
        answer:
          "Yes. Pixquish is completely free, with no sign-up, no watermark, and no daily limit. Everything runs in your browser using the Canvas API — your images never touch a server.",
      },
    ],
    ctaHref: "#resize",
    ctaLabel: "Resize for Facebook Post",
    relatedBlogSlugs: ["instagram-image-sizes-2026"],
  },
  {
    slug: "app-icon",
    type: "resize",
    platform: "App Icon",
    h1: "Make an app icon from any image (512×512)",
    title: "Make an App Icon Online — Free App Icon Maker | Pixquish",
    description:
      "App icon size is 512×512 pixels. Make an Android or PWA app icon from any image — free, private, no uploads. Pick the App Icon preset in your browser.",
    keyword: "app icon size",
    targetDimensions: { width: 512, height: 512, unit: "px" },
    heroLead:
      "Android and PWA app icons are required at 512×512 pixels. Pixquish resizes your image to exactly that with Cover, Contain, or Stretch fit modes — 100% in your browser, nothing uploaded.",
    whyUse: [
      SHARED_PRIVACY_WHY,
      {
        title: "Exact 512×512 every time",
        body: "Pick the App Icon preset and Pixquish sets the canvas to exactly 512×512 pixels — the size Google Play and Android require for the high-res store icon, and the size PWA manifests reference as the largest icon. No math, no guesswork.",
      },
      {
        title: "Crisp at every downstream size",
        body: "Android downscales your 512×512 icon to 192×192, 96×96, 48×48, and 36×36 for different surfaces. Pixquish's multi-step downscaling and optional unsharp mask keep edges and text crisp at every size — no mushy logos on the home screen.",
      },
      {
        title: "Square canvas with cover, contain, or stretch",
        body: "The App Icon preset locks the canvas to exactly 512×512. Pick Cover to fill the square and crop excess (best for landscape logos), Contain to fit the whole logo with padding (good for non-square logos with whitespace), or Stretch to fill exactly.",
      },
    ],
    howToSteps: [
      {
        name: "Open the Resize tab",
        text: "Click the Resize Images button above, or scroll to the Resize workspace at the bottom of the page. Switch from the Compress tab if needed.",
      },
      {
        name: "Upload your image",
        text: "Drag a logo or photo onto the resize drop zone, or click to pick one from your device. JPG, PNG, WebP, and AVIF are all accepted. PNG with transparency works best for app icons.",
      },
      {
        name: "Pick the App Icon preset",
        text: "In the preset dropdown, find Web → App Icon (512×512). The canvas is set to exactly 512×512 and the aspect lock engages automatically.",
      },
      {
        name: "Choose a fit mode and format",
        text: "Pick Cover to fill the square and crop excess (best for non-square logos), Contain to fit the whole logo with padding, or Stretch to fill exactly. Use the cover offset sliders to position the crop. Choose PNG output for transparency, or keep JPG/WebP for opaque icons.",
      },
      {
        name: "Resize and download",
        text: "Click Resize. Pixquish processes the image in your browser using a multi-step downscale for sharp results at small sizes, then lets you download it with one click. Drop the file into your Android project's res/ folder or your PWA manifest's icons array.",
      },
    ],
    specs: [
      { label: "Recommended size", value: "512 × 512 pixels" },
      { label: "Aspect ratio", value: "1:1 (square)" },
      { label: "Also used for", value: "PWA manifest icons, Google Play store icon" },
      { label: "Downscaled to", value: "192×192, 144×144, 96×96, 72×72, 48×48 by Android" },
      { label: "Best format", value: "PNG (transparency) for logos, JPG for photos" },
      { label: "Best fit mode", value: "Contain to preserve whole logo, Cover for full-bleed" },
    ],
    faqs: [
      {
        question: "What is the app icon size?",
        answer:
          "Android app icons are required at 512×512 pixels — Google Play uses this as the high-resolution store icon, and Android downscales it to 192×192, 96×96, and 48×48 for different surfaces. PWA manifest icons also reference 512×512 as the largest size. Pixquish has an App Icon preset at exactly 512×512.",
      },
      {
        question: "What format should an app icon be?",
        answer:
          "PNG is the most common format for app icons because it's lossless and supports transparency — useful for logos that don't fill the square. JPG works for opaque photo-style icons. Pixquish lets you pick PNG, JPG, WebP, or AVIF as the output format during the resize.",
      },
      {
        question: "How do I make an app icon from an image?",
        answer:
          "Upload your image to the Pixquish Resize tab, pick the App Icon preset (512×512), and choose the Contain fit mode if your logo isn't square (so nothing is cropped). Pick PNG as the output format for transparency. Click Resize and download — then drop the file into your Android project or PWA manifest.",
      },
      {
        question: "What's the difference between an app icon and a favicon?",
        answer:
          "App icons (512×512) are used by Android and PWAs on home screens and app drawers. Favicons (typically 16×16 source at 256×256) are shown in browser tabs and bookmarks. Pixquish has separate presets for both — pick App Icon for an Android/PWA icon, or Favicon for a website tab icon.",
      },
      {
        question: "Do app icons need to be square?",
        answer:
          "Yes. Android and PWA app icons are always displayed in a square aspect ratio on home screens and in app drawers. Non-square icons get cropped or padded by the system, often awkwardly. Use Pixquish's App Icon preset (512×512) and choose Contain if your logo is not square — it will be padded with whitespace rather than cropped.",
      },
      {
        question: "Is this app icon maker free?",
        answer:
          "Yes. Pixquish is completely free, with no sign-up, no watermark, and no daily limit. Everything runs in your browser using the Canvas API — your images never touch a server.",
      },
    ],
    ctaHref: "#resize",
    ctaLabel: "Make an app icon now",
    relatedBlogSlugs: ["best-image-format-for-web"],
  },
  {
    slug: "web-banner",
    type: "resize",
    platform: "Web Banner",
    h1: "Resize image for Web Banner (1200×300)",
    title: "Resize Image for Web Banner (1200×300) | Pixquish",
    description:
      "Web banner size is 1200×300 pixels (4:1). Resize your image for a website banner in your browser — free, private, no uploads. Pick the Web Banner preset.",
    keyword: "web banner size",
    targetDimensions: { width: 1200, height: 300, unit: "px" },
    heroLead:
      "Website leaderboard and banner ads commonly display at 1200×300 pixels (4:1). Pixquish resizes your image to exactly that with Cover, Contain, or Stretch fit modes — 100% in your browser, nothing uploaded.",
    whyUse: [
      SHARED_PRIVACY_WHY,
      {
        title: "Exact 1200×300 every time",
        body: "Pick the Web Banner preset and Pixquish sets the canvas to exactly 1200×300 pixels — a common leaderboard and medium-rectangle-adjacent banner size used across ad networks and hero sections. No math, no guesswork.",
      },
      {
        title: "Cover, Contain, or Stretch fit",
        body: "Cover fills the wide 4:1 canvas and center-crops the excess — best for landscape photos. Contain fits the whole image inside with padding (good for square or vertical logos). Stretch fills the canvas exactly (with a distortion warning if the aspect ratio differs).",
      },
      {
        title: "Adjustable crop position",
        body: "The 4:1 aspect ratio is unforgiving — the wrong crop can cut off a logo or headline. Pixquish lets you slide the cover crop horizontally and vertically so the most important part of your image stays in frame.",
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
        name: "Pick the Web Banner preset",
        text: "In the preset dropdown, find Web → Web Banner (1200×300). The canvas is set to exactly 1200×300 and the aspect lock engages automatically.",
      },
      {
        name: "Choose a fit mode and adjust crop",
        text: "Pick Cover to fill the wide canvas and crop excess (best for landscape photos), Contain to fit the whole image with padding, or Stretch to fill exactly. Use the cover offset sliders to position the crop so the key subject stays in frame.",
      },
      {
        name: "Resize and download",
        text: "Click Resize. Pixquish processes the image in your browser using a multi-step downscale for sharp results, then lets you download it with one click. Tip: switch to the Compress tab to keep the file under 150 KB for fast page load.",
      },
    ],
    specs: [
      { label: "Recommended size", value: "1200 × 300 pixels" },
      { label: "Aspect ratio", value: "4:1 (wide banner)" },
      { label: "Also used for", value: "Leaderboard banners, hero strips, ad slots" },
      { label: "Best format", value: "JPG for photos, PNG for graphics with text" },
      { label: "Max file size", value: "Keep under 150 KB for fast page load" },
      { label: "Best fit mode", value: "Cover for landscape photos, Contain to preserve whole image" },
    ],
    faqs: [
      {
        question: "What size is a web banner?",
        answer:
          "There's no single web banner size — common dimensions include 1200×300 (Pixquish's Web Banner preset), 728×90 (leaderboard), 300×250 (medium rectangle), and 160×600 (wide skyscraper). Pixquish has a Web Banner preset at 1200×300; use the custom width and height inputs for other ad-slot sizes.",
      },
      {
        question: "What aspect ratio is 1200×300?",
        answer:
          "1200×300 is a 4:1 aspect ratio — a wide horizontal banner. This works well for hero strips, leaderboard banners, and the wide ad slots above article content. Pick the Web Banner preset in Pixquish and the aspect lock engages automatically.",
      },
      {
        question: "Should I use PNG or JPG for a web banner?",
        answer:
          "Use JPG for photo-based banners — smaller files, faster page loads. Use PNG for banners with text, logos, or sharp graphics (PNG keeps text crisp and avoids JPEG ringing). Pixquish can convert your image to either format during the resize, or compress it after if the file is too large.",
      },
      {
        question: "How do I resize an image for a web banner without cropping?",
        answer:
          "Pick the Web Banner preset (1200×300) and choose the Contain fit mode. Pixquish fits your entire image inside the 4:1 canvas with optional padding (solid color or blurred background) so nothing is cropped. Switch to Cover if you'd rather fill the canvas and crop the excess.",
      },
      {
        question: "How do I make a web banner smaller in file size?",
        answer:
          "After resizing to 1200×300 in Pixquish, switch to the Compress tab to bring the file under 150 KB — or use the target file size feature to hit a specific size like 100 KB. JPG typically produces the smallest files; WebP or AVIF are even smaller at equivalent quality.",
      },
      {
        question: "Is this web banner resizer free?",
        answer:
          "Yes. Pixquish is completely free, with no sign-up, no watermark, and no daily limit. Everything runs in your browser using the Canvas API — your images never touch a server.",
      },
    ],
    ctaHref: "#resize",
    ctaLabel: "Resize for Web Banner",
    relatedBlogSlugs: [],
  },

  // ── Batch 2: Compress pages (image categories the engine detects) ──────
  {
    slug: "photo",
    type: "compress",
    format: "photo",
    h1: "Compress photos online — free, private, no uploads",
    title: "Compress Photos — Free Online Photo Compressor | Pixquish",
    description:
      "Compress photos online — free, no uploads. Pixquish is a photo compressor that detects photos and uses a photo-optimized quality table. 100% in your browser.",
    keyword: "compress photo",
    heroLead:
      "Shrink photos by up to 80% in your browser. Pixquish detects when an image is a photo and applies a photo-optimized quality table (Q90 Best / Q80 Balanced / Q66 Max) so skin tones and skies stay smooth. 100% private — nothing is uploaded.",
    whyUse: [
      SHARED_PRIVACY_WHY,
      {
        title: "Photo-optimized quality table preserves skin tones and skies",
        body: "Pixquish analyses each image and detects when it's a photo, then applies a tailored quality table — Q90 in Best Quality mode, Q80 in Balanced, Q66 in Max Compress. These values are tuned for photos: smooth gradients stay smooth and skin tones don't posterize.",
      },
      {
        title: "Three modes for any photo",
        body: "Best Quality keeps artifacts invisible (great for portfolio shots), Balanced is the sweet spot for the web, and Max Compress goes as small as the format allows while staying usable (great for thumbnails and previews). Live preview lets you compare side by side.",
      },
      {
        title: "Target a specific file size",
        body: "Set an exact target (100 KB, 200 KB, 500 KB) and Pixquish runs a binary search over quality levels to land as close as possible to your target while keeping the best achievable visual quality — perfect for upload limits and email attachments.",
      },
    ],
    howToSteps: [
      {
        name: "Drop your photo into the compressor",
        text: "Drag a JPG, PNG, WebP, or AVIF photo onto the compressor drop zone at the top of the page, or click to pick one (or several) from your device. Batch as many as you like.",
      },
      {
        name: "Pick Best Quality mode",
        text: "Choose Best Quality to keep the photo looking identical to the original at typical viewing sizes — Pixquish's photo-optimized Q90 default keeps skin tones and gradients smooth. Switch to Balanced or Max Compress for smaller files.",
      },
      {
        name: "Optional: set a target file size",
        text: "Need a specific size like 100 KB for an upload limit or email attachment? Enter it in the target file size field and Pixquish searches quality levels to hit your target.",
      },
      {
        name: "Optional: switch output format",
        text: "Leave the output on Auto (Pixquish will recommend WebP for photos — it beats JPEG at equal quality) or pick JPG for maximum compatibility, PNG for lossless output, or AVIF for the smallest files at the same quality.",
      },
      {
        name: "Compress and download",
        text: "Click Compress. Pixquish processes the photo entirely in your browser and lets you download each result individually with one click — no zip extraction needed.",
      },
    ],
    faqs: [
      {
        question: "How do I compress a photo without losing quality?",
        answer:
          "Upload your photo and choose Best Quality mode. Pixquish detects that the image is a photo and applies Q90 — a quality tuned for photos that keeps skin tones, skies, and gradients smooth. The result looks identical to the original at typical viewing sizes while still cutting file size by 40–70%. For zero quality loss, switch the output to PNG (lossless).",
      },
      {
        question: "What's the best photo compressor?",
        answer:
          "The best photo compressor (1) runs in your browser so your photos stay private, (2) detects when an image is a photo and uses a photo-optimized quality table rather than a one-size-fits-all setting, (3) offers a target file size feature, and (4) shows a live preview before you download. Pixquish does all four — and it's free with no sign-up.",
      },
      {
        question: "How much can I reduce photo file size?",
        answer:
          "Typical camera and phone photos can be reduced by 50–80% in Best Quality mode with no visible quality loss, by 70–85% in Balanced mode, and by 80–95% in Max Compress mode. Switching the output from JPEG to WebP typically saves another 25–35% at equivalent visual quality; AVIF saves 40–50%.",
      },
      {
        question: "Should I convert my photos to WebP?",
        answer:
          "In most cases, yes. WebP beats JPEG at equal quality by 25–35% on photos, and it's supported in all modern browsers. Pixquish's auto format selector recommends WebP for photos by default. Keep JPEG if you need maximum compatibility with very old browsers or non-browser clients, or pick AVIF for the smallest files at the same quality.",
      },
      {
        question: "Does compressing photos reduce quality?",
        answer:
          "JPEG and lossy WebP/AVIF are lossy formats, so every re-encode introduces some quality loss. Pixquish mitigates this in three ways: the engine detects when an image is a photo and applies a photo-optimized quality table (Q90 in Best Quality mode) that keeps artifacts essentially invisible, the live preview shows exactly what you'll get, and you can always switch to PNG (lossless) if you need zero quality loss.",
      },
      {
        question: "Is this photo compressor free?",
        answer:
          "Yes. Pixquish is completely free, with no sign-up, no watermark, no upload limit beyond your device's memory, and no premium tier. Everything runs in your browser using the Canvas API — your photos never touch a server.",
      },
    ],
    ctaHref: "#workspace",
    ctaLabel: "Compress a photo now",
    relatedBlogSlugs: ["compression-modes-compared", "compress-jpg-to-100kb"],
  },
  {
    slug: "screenshot",
    type: "compress",
    format: "screenshot",
    h1: "Compress screenshots online — free, private, no uploads",
    title: "Compress Screenshots — Free Screenshot Compressor | Pixquish",
    description:
      "Compress screenshots online — free, no uploads. Pixquish detects screenshots and recommends WebP to avoid JPEG ringing on text. 100% in your browser.",
    keyword: "compress screenshot",
    heroLead:
      "Shrink screenshots without the blur. Pixquish detects when an image is a screenshot and applies a screenshot-optimized quality table (Q92 / Q82 / Q70), recommending WebP to keep text crisp and avoid JPEG ringing artifacts. 100% private — nothing is uploaded.",
    whyUse: [
      SHARED_PRIVACY_WHY,
      {
        title: "Screenshot-optimized quality table keeps text crisp",
        body: "Screenshots are mostly text, sharp edges, and flat colors — content that JPEG struggles with. Pixquish detects screenshots and applies a higher quality table (Q92 Best / Q82 Balanced / Q70 Max) tuned to keep text and UI elements crisp rather than ringing.",
      },
      {
        title: "Recommends WebP to avoid JPEG ringing artifacts",
        body: "JPEG introduces visible ringing around text and sharp edges — the classic 'ghosting' on screenshot text. Pixquish's auto format selector recommends WebP for screenshots, which handles text far better at equal quality. You can override the choice in the format selector.",
      },
      {
        title: "Target a specific file size for uploads",
        body: "Need a screenshot under 200 KB for a support ticket or bug report? Set a target file size and Pixquish searches quality levels to land as close as possible while keeping the text readable — perfect for hitting strict upload limits.",
      },
    ],
    howToSteps: [
      {
        name: "Drop your screenshot into the compressor",
        text: "Drag a JPG, PNG, WebP, or AVIF screenshot onto the compressor drop zone at the top of the page, or click to pick one (or several) from your device. Batch as many as you like.",
      },
      {
        name: "Let Pixquish detect the screenshot",
        text: "Pixquish analyses each image and detects when it's a screenshot (limited palette, sharp edges, modest resolution) — then applies a screenshot-optimized quality table (Q92 Best / Q82 Balanced / Q70 Max) and recommends WebP as the output format to avoid JPEG ringing on text.",
      },
      {
        name: "Optional: set a target file size",
        text: "Need a specific size like 200 KB for a support ticket or bug report? Enter it in the target file size field and Pixquish searches quality levels to hit your target while keeping text readable.",
      },
      {
        name: "Optional: switch output format",
        text: "Leave the output on Auto (Pixquish will recommend WebP for screenshots — it handles text far better than JPEG at equal quality) or pick PNG for lossless output, JPG for maximum compatibility, or AVIF for the smallest files at the same quality.",
      },
      {
        name: "Compress and download",
        text: "Click Compress. Pixquish processes the screenshot entirely in your browser and lets you download each result individually with one click — text stays crisp, file size drops dramatically.",
      },
    ],
    faqs: [
      {
        question: "How do I compress a screenshot?",
        answer:
          "Upload your screenshot (PNG, JPG, WebP, or AVIF) to the Pixquish compressor and click Compress. Pixquish detects that the image is a screenshot and applies a higher quality table (Q92 in Best Quality mode) tuned for text and sharp edges. For a specific output size, use the target file size field. Everything runs in your browser — nothing is uploaded.",
      },
      {
        question: "What's the best format for screenshots?",
        answer:
          "PNG is the most common source format for screenshots (it's what screenshot tools produce by default), but it's not always the smallest. WebP at high quality handles text and sharp edges far better than JPEG and is typically 25–50% smaller than PNG for the same screenshot. Pixquish's auto format selector recommends WebP for screenshots by default.",
      },
      {
        question: "Why do my screenshots look blurry as JPG?",
        answer:
          "JPEG introduces visible ringing artifacts around text and sharp edges — the classic 'ghosting' on screenshot text. This is a fundamental limitation of JPEG, not a quality setting issue. Pixquish detects screenshots and recommends WebP instead, which handles text far better at equal quality and file size. You can also pick PNG for lossless output.",
      },
      {
        question: "How do I reduce screenshot file size?",
        answer:
          "PNG screenshots from a 4K monitor can easily be 3–5 MB. Compressing them in Pixquish typically reduces the file size by 60–80% with no visible quality loss — switch to WebP for an extra 25–50% reduction. For a specific target like 200 KB for a support ticket, use the target file size feature and Pixquish searches quality levels to hit it.",
      },
      {
        question: "Should I use PNG or WebP for screenshots?",
        answer:
          "WebP at high quality is almost always the better choice for screenshots — it's 25–50% smaller than PNG for the same screenshot, handles text far better than JPEG, and is supported in all modern browsers. Keep PNG if you need a lossless source file or maximum compatibility with very old browsers. Pixquish's auto format selector recommends WebP for screenshots by default.",
      },
      {
        question: "Is this screenshot compressor free?",
        answer:
          "Yes. Pixquish is completely free, with no sign-up, no watermark, no upload limit beyond your device's memory, and no premium tier. Everything runs in your browser using the Canvas API — your screenshots never touch a server.",
      },
    ],
    ctaHref: "#workspace",
    ctaLabel: "Compress a screenshot now",
    relatedBlogSlugs: ["best-image-format-for-web", "compression-modes-compared"],
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
