---
title: "Favicon Size Guide 2026: All Sizes, Formats, and HTML Link Tags"
description: "Complete favicon size guide for 2026: 16, 32, 48, 180, 192, 256, and 512px sizes, PNG vs ICO vs SVG formats, HTML link tag examples, and how to make a favicon from any image."
date: "2026-08-15"
author: "Pixquish"
tags: ["favicon", "png", "ico", "web-design", "image-resize"]
image: "/og-image.png"
---

**You need a 16×16 PNG, a 32×32 PNG, a 180×180 Apple touch icon, a 192×192 Android/PWA icon, and a 512×512 PWA icon. That's the minimum favicon set for 2026.** You can generate all of them from a single source image — no design skills required. Here's the full spec, with every size, format, and HTML `<link>` tag you need.

## The complete favicon size table

| Size | Use case | Format | Filename |
|---|---|---|---|
| 16×16 | Browser tab (classic) | PNG or ICO | `favicon-16.png` |
| 32×32 | Browser tab (HiDPI/Retina) | PNG or ICO | `favicon-32.png` |
| 48×48 | Windows site icon, shortcut | PNG | `favicon-48.png` |
| 64×64 | Desktop browser bookmarks | PNG | `favicon-64.png` |
| 152×152 | Older iOS / iPad touch icon | PNG | `apple-touch-icon-152.png` |
| 167×167 | iPad Pro touch icon | PNG | `apple-touch-icon-167.png` |
| 180×180 | **Apple touch icon (current iOS)** | PNG | `apple-touch-icon.png` |
| 192×192 | **Android Chrome icon** | PNG | `android-chrome-192.png` |
| 256×256 | **Safari pinned tab / general purpose** | PNG | `favicon-256.png` |
| 512×512 | **PWA / Android Chrome splash** | PNG | `android-chrome-512.png` |

Bold rows are the ones you actually need to ship. The rest are nice-to-have for niche cases (older iPads, Windows tiles, etc.).

## Formats: PNG vs ICO vs SVG

| Format | When to use | Notes |
|---|---|---|
| **PNG** | Default for every size in 2026 | Universal browser support, supports transparency |
| **ICO** | Legacy fallback for very old browsers | Bundles multiple sizes in one file; rarely needed in 2026 |
| **SVG** | Modern scalable favicon (Chrome, Firefox, Edge) | One file, infinitely scalable; Safari support is partial |

For SVG favicons, you can ship a single `.svg` file that scales perfectly to any size. The catch: Safari still has spotty SVG support, so always pair it with a 32×32 PNG fallback.

## The complete HTML `<link>` block

Drop this into your `<head>`:

```html
<!-- Favicon (modern, PNG) -->
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16.png">

<!-- SVG scalable favicon (optional, modern browsers only) -->
<link rel="icon" type="image/svg+xml" href="/favicon.svg">

<!-- Legacy ICO fallback for old browsers -->
<link rel="shortcut icon" href="/favicon.ico">

<!-- Apple touch icon (iOS home screen) -->
<link rel="apple-touch-icon" sizes="180×180" href="/apple-touch-icon.png">
<link rel="apple-touch-icon" sizes="167×167" href="/apple-touch-icon-167.png">
<link rel="apple-touch-icon" sizes="152×152" href="/apple-touch-icon-152.png">

<!-- Android Chrome / PWA -->
<link rel="icon" type="image/png" sizes="192×192" href="/android-chrome-192.png">
<link rel="icon" type="image/png" sizes="512×512" href="/android-chrome-512.png">

<!-- Windows tile (optional) -->
<meta name="msapplication-TileColor" content="#ffffff">
<meta name="msapplication-TileImage" content="/mstile-144.png">
```

For a minimal setup, ship just the 32×32 PNG, the 180×180 Apple touch icon, the 192×192 and 512×512 PWA icons, and an `apple-touch-icon.png`. That covers 99% of devices.

## favicon.ico vs PNG: which one do you actually need?

In 2026, you don't strictly need a `.ico` file. Modern browsers all accept PNG favicons via the `<link rel="icon">` tag. But a `.ico` file is still worth shipping for two reasons:

1. **Browsers auto-request `/favicon.ico`** at the site root if you don't declare any favicon `<link>`. Shipping one prevents a 404 in your logs.
2. **Some older enterprise tools** (Outlook, old SharePoint) only render `.ico` files.

A `.ico` file can bundle multiple sizes (16, 32, 48) in a single file. Most image editors can export ICO — or you can convert a 32×32 PNG using any favicon generator.

## How to make a favicon from any image

You don't need to start with a 16×16 image. Start with any square PNG or JPG at 512×512 or larger, then downscale to each size:

1. Open your source image (a logo, photo, or mark)
2. Resize to **512×512** using the [favicon resizer](/resize/favicon) (Cover fit mode works best — it preserves aspect ratio and fills the square)
3. Save the 512×512 version
4. Resize again to **192×192** (Android)
5. Resize again to **180×180** (iOS)
6. Resize again to **32×32** and **16×16** (browser tabs)

For a one-stop workflow, use the [favicon resize tool](/resize/favicon) — it's pre-set to 256×256 (a good middle size) and you can switch to manual dimensions for the others. For companion app icons at 512×512, use the [app icon resizer](/resize/app-icon).

## Best practices for favicon source images

1. **Start square** — at least 512×512. A non-square source gets cropped (Cover fit) or letterboxed (Contain fit) when resized.
2. **Use a PNG with transparency** — your favicon should sit cleanly on any browser-chrome background (light or dark). JPG can't do transparency. See our [PNG compressor](/compress/png) to keep your source PNG small.
3. **Test on light and dark backgrounds** — a dark favicon disappears on dark mode. Consider shipping a separate `media`-query SVG that adapts, or pick a color that works on both.
4. **Keep it simple** — at 16×16, fine detail vanishes. Bold shapes, high contrast, no text below 4 characters. If your logo is detailed, design a simplified favicon version.
5. **Optimize file size** — favicons load on every pageview. A 32×32 PNG should be under 2 KB. Use [Pixquish](/compress/png) to crush it without losing a single pixel.

## Why PNG is the right format for favicons

Favicons are small, often need transparency, and need to look pixel-perfect at tiny sizes. That's exactly what PNG does best:

- ✅ Lossless compression — every pixel preserved exactly
- ✅ Transparency — works on light or dark browser chrome
- ✅ Universal browser support — works everywhere
- ❌ Larger than JPG — but at 32×32, the difference is negligible

For a deeper dive into why PNG beats JPG for graphics (and when WebP/AVIF make sense), see our [best image format for the web guide](/blog/best-image-format-for-web).

## The lazy version: one SVG, one PNG

If you can't be bothered to ship five sizes, ship this minimal set:

```html
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="icon" type="image/png" sizes="32×32" href="/favicon-32.png">
<link rel="apple-touch-icon" sizes="180×180" href="/apple-touch-icon.png">
```

That covers every modern browser. The SVG scales to any size; the 32×32 PNG is the fallback; the 180×180 PNG covers iOS.

## The verdict

| What you're shipping | Minimum favicon set |
|---|---|
| Personal blog / portfolio | 32×32 PNG + 180×180 Apple touch icon |
| Marketing site | Add 192×192 + 512×512 (PWA-ready) |
| Web app / PWA | All sizes + manifest.json + SVG |
| Enterprise / legacy | Add `favicon.ico` (multi-size ICO) |

**Bottom line:** Five PNG files (16, 32, 180, 192, 512) cover every device that matters in 2026. Generate them from one 512×512 source, link them in your `<head>`, and you're done.

## Try it yourself

Drop any image into the [favicon resizer](/resize/favicon) to generate a 256×256 favicon in seconds — free, private, and runs entirely in your browser. Then use [PNG compression](/compress/png) to crush the result to under 2 KB without losing a single pixel.
