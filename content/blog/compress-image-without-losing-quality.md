---
title: "How to Compress an Image Without Losing Quality (2026 Guide)"
description: "True lossless compression uses PNG. Visually-lossless compression uses WebP or JPG at Q90. Here's how to compress an image without losing quality — with the exact modes, formats, and quality settings to use."
date: "2026-08-15"
author: "Pixquish"
tags: ["image-compression", "lossless", "best-quality", "image-quality"]
image: "/og-image.png"
---

**To compress an image without losing quality, either use PNG (true lossless — every pixel preserved exactly) or use JPG/WebP at Q90 in Best Quality mode (visually lossless — the human eye cannot distinguish the result from the original).** Both approaches typically cut file size by 50–70%. Here's how each works and when to use which.

## What "lossless" really means

Lossless compression means **every pixel of the output is mathematically identical to the input**. Decode the compressed file and you get the exact same image back — same width, same height, same color in every pixel, same alpha. You can re-save the file 1,000 times and the 1,000th save is byte-identical to the 1st.

Lossy compression, by contrast, **deliberately discards visual information** that the human eye is bad at perceiving (high-frequency color detail, subtle gradient steps). The decoded image is similar but not identical to the source — and re-saving it again compounds the loss (called "generation loss").

| Property | Lossless | Lossy |
|---|---|---|
| Pixel-exact output | ✅ Yes | ❌ No |
| Generation loss | None | Compounds on re-save |
| File size | Larger | Smaller |
| Best formats | PNG, WebP (lossless mode) | JPG, WebP, AVIF |
| Typical size reduction | 30–60% | 60–90% |
| Best for | Logos, UI, screenshots, archival | Photos, web images, social media |

## The pro tip: Best Quality mode at Q90 is effectively lossless

When you don't select a target file size and only choose Best Quality mode, the result is **effectively lossless** — a single encode at Q90 that is visually indistinguishable from the original. The file is still mathematically different (it's lossy), but the human eye cannot tell the difference in side-by-side comparison at any normal viewing distance.

This is the key insight: **for almost every real-world use case, "visually lossless" is as good as "true lossless"** — at a fraction of the file size.

For a deeper dive into how each mode performs, see our [compression modes comparison](/blog/compression-modes-compared) which compresses the same photo with Best Quality (64% reduction), Balanced (75%), and Max Compress (82%) and shows the results side by side.

## Quality vs size: what each quality level produces

We compressed the same 6.9 MB photo (5,600 × 3,200, JPG source) at multiple quality levels to show the trade-off:

| Mode / Quality | Resulting size | Reduction | Visual quality |
|---|---|---|---|
| **PNG (lossless)** | 14.2 MB | +105% larger (!) | Pixel-perfect |
| WebP (lossless) | 9.8 MB | +42% larger | Pixel-perfect |
| **JPG Q90** (Best Quality) | 2.5 MB | 64% smaller | Visually lossless |
| WebP Q90 | 2.0 MB | 71% smaller | Visually lossless |
| JPG Q85 | 2.1 MB | 70% smaller | Excellent |
| WebP Q85 | 1.5 MB | 78% smaller | Excellent |
| JPG Q80 (Balanced) | 1.7 MB | 75% smaller | Very good |
| JPG Q66 (Max Compress) | 1.3 MB | 82% smaller | Good at small sizes |

Notice the trap: **PNG lossless produces a file 2× larger than the original JPG** because JPG was already lossy — re-encoding it as PNG preserves the lossy artifacts but doesn't restore the original. For a photo that started life as JPG, you can't get back to true lossless. You can only get to "visually lossless from here."

## When to use true lossless (PNG)

Use the [PNG compressor](/compress/png) when:

1. **The image is a logo, UI graphic, or screenshot** — pixel-perfect edges matter, JPG artifacts would be visible
2. **You're creating an archival master** — preserve every pixel for future re-encoding
3. **The image has transparency** — JPG can't have transparent pixels
4. **You'll re-edit the file multiple times** — PNG has no generation loss
5. **The image is small already** — for favicons and tiny graphics, PNG's larger size is negligible

For photos, don't use PNG — the file gets huge and you gain nothing visible. PNG is for graphics.

## When to use visually-lossless (JPG or WebP at Q90)

Use the [compress photo](/compress/photo) workflow or [WebP compressor](/compress/webp) when:

1. **The image is a photograph** — visual quality at Q90 is indistinguishable from the original
2. **You're publishing on the web** — file size matters more than pixel perfection
3. **You're sending via email** — smaller files = faster sends
4. **You're uploading to social media** — platforms re-compress anyway, so don't waste bytes on lossless

Best Quality mode in Pixquish targets Q90 by default and applies smart per-image analysis to pick the optimal encoder for the content. It's the right starting point for any photo.

## The mode comparison, in brief

| Mode | What it does | Result | Lossless? |
|---|---|---|---|
| **Best Quality** | Single encode at Q90 (or Q92 for screenshots) | 60–65% smaller | Visually lossless |
| **Balanced** | Targets Q75–Q85 depending on content | 70–80% smaller | Very good |
| **Max Compress** | Pushes to Q60–Q70 | 80–85% smaller | Good at small sizes |
| **Target file size** | Binary-searches quality to hit a specific size | Varies | Depends on target |

For visually-lossless compression, **Best Quality is the answer**. The other modes exist for when you're willing to trade quality for smaller files.

## Do: best practices for lossless-quality compression

1. **Start from the highest-quality source you have** — compression can't add detail back. If your source is already a low-Q JPG, re-encoding it as PNG just makes the file bigger without restoring quality.
2. **Use Best Quality mode by default** — Q90 is visually lossless for almost every photo. Only step up to PNG if the image is a logo or graphic.
3. **Pick the right format for the content** — PNG for graphics (true lossless), WebP for photos (visually lossless, smallest), JPG for max-compatibility photos.
4. **Resize before compressing** — a 5,000×3,000 image downscaled to 1,920×1,080 is already 73% smaller before any compression happens. Smaller dimensions = smaller file.
5. **Use Cover fit mode when resizing** — preserves aspect ratio without distortion.
6. **Encode once, not repeatedly** — every lossy re-save compounds quality loss. Keep your original and always compress from the source.

## Don't: common quality mistakes

1. **Don't re-compress a JPG as a JPG twice** — generation loss compounds. Convert to WebP or PNG if you need to re-edit.
2. **Don't use PNG for photos** — files balloon to 2–5× the original size with no visible quality gain.
3. **Don't use Max Compress for hero images** — Q66 artifacts are visible on large displays. Use it only for thumbnails and avatars.
4. **Don't trust "100% quality" JPG** — JPG Q100 is not lossless; it's lossy with maximum file size. Use PNG or WebP lossless if you need true lossless.
5. **Don't set a target file size unless you have a hard limit** — the target-size feature overrides mode selection and binary-searches quality. It's perfect for hitting "under 100 KB" but not for general-purpose compression.
6. **Don't compress the same image over and over** — every pass degrades quality. Always start from the source.

## The verdict

| If you need... | Use this |
|---|---|
| True lossless (pixel-exact) | PNG via [compress PNG](/compress/png) |
| Visually lossless for a photo | Best Quality mode (Q90) via [compress photo](/compress/photo) |
| Visually lossless + smaller | Best Quality mode, WebP output, via [compress WebP](/compress/webp) |
| A specific file size | Target file size feature (overrides mode) |
| Maximum compression | Max Compress mode (Q66 — only for small displays) |

**Bottom line:** For 95% of images, Best Quality mode at Q90 produces a visually lossless result at 60–65% smaller file size. For the 5% where pixel-perfect accuracy truly matters (logos, archival), use PNG. Both paths run entirely in your browser via Pixquish — no uploads, no sign-up, no quality compromises you didn't choose.

## Try it yourself

Drop any image into [Pixquish](/#workspace) and pick **Best Quality** mode for a visually-lossless result that's 60%+ smaller. For pixel-perfect PNG output, use the [PNG compressor](/compress/png). For photos where smaller is better, [compress photo](/compress/photo) mode picks the optimal format and quality for you — automatically.
