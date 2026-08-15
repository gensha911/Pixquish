---
title: "How to Compress a JPG to 100KB (Without Losing Quality)"
description: "Need a JPG under 100KB? Here are 3 ways to do it — Pixquish's target file size feature, quality slider, and dimension reduction. With real examples and the exact settings to use."
date: "2026-08-15"
author: "Pixquish"
tags: ["jpg", "jpeg", "compress", "target-file-size", "100kb"]
image: "/og-image.png"
---

Need to get a JPG under 100KB? Whether it's for a web upload limit, an email attachment, or a form submission, there are three reliable ways to do it. Here's exactly how — with the settings that actually work.

## The fastest way: target file size

The most reliable method is to use a target file size feature. Instead of guessing at quality settings, you tell the compressor "make this file 100KB" and it figures out the quality automatically.

### Step-by-step

1. Go to [Pixquish](/#workspace) and upload your JPG
2. In the left panel, find the **Target file size** section
3. Click the **100 KB** preset button
4. Click **Compress**
5. Download your file — it will be as close to 100KB as possible

### How it works

Pixquish uses a **binary search** across quality levels (Q1 to Q100) to find the exact quality that produces a file closest to 100KB. It typically takes 5–7 attempts, so the whole process completes in under a second.

The result: a file that's **within a few KB of your target**, with the highest possible quality for that size.

### Why this beats guessing

If you manually set quality to "70%" you might get 80KB or 120KB depending on the image. A photo with lots of detail compresses larger; a logo with flat colors compresses smaller. The target file size approach adapts to each image automatically.

## Method 2: manual quality slider

If you want more control, use the quality slider:

1. Upload your JPG to [Pixquish](/#workspace)
2. Make sure **Output format** is set to **JPEG** (or "Same as original" if your input is JPG)
3. Drag the **Quality** slider down — try 70% first
4. Click **Compress** and check the result size
5. Adjust and re-compress until you hit ~100KB

### Typical quality-to-size mapping

For a 1920×1080 photograph:

| Quality | Approximate size |
|---|---|
| 95% | 400–500 KB |
| 85% | 200–280 KB |
| 75% | 140–180 KB |
| 65% | 100–120 KB |
| 55% | 80–90 KB |
| 45% | 60–70 KB |

**Note:** these are approximate — actual sizes vary based on image content. Photos with lots of detail (trees, fabric) compress larger; photos with smooth areas (sky, walls) compress smaller.

### When to use the slider instead

- You want a specific quality level regardless of size
- You're batching multiple images and want consistent quality across all of them
- You're fine-tuning after using target file size

## Method 3: reduce dimensions

Sometimes the fastest way to hit 100KB is to make the image smaller. A 1920×1080 photo will struggle to hit 100KB even at low quality. A 1280×720 version of the same photo hits 100KB easily at good quality.

### Step-by-step

1. Switch to the [Resize tab](/#resize)
2. Set width to **1280** (or 800 for an even smaller file)
3. Keep aspect ratio locked
4. Switch back to the Compress tab
5. Use target file size (100KB) or quality ~80%

### Why this works

File size scales roughly with pixel count. A 1920×1080 image has ~2 million pixels. A 1280×720 image has ~920,000 pixels — about half. So the same quality setting produces roughly half the file size.

If your image will only be displayed at 800px wide on a website, there's no reason to keep it at 4000px wide. Resize first, then compress.

## Which method should you use?

| Situation | Best method |
|---|---|
| Need exactly 100KB | Target file size (Method 1) |
| Want consistent quality across many images | Quality slider (Method 2) |
| Image is huge (4000px+) | Resize first (Method 3), then compress |
| Uploading to a form with 100KB limit | Target file size (Method 1) |
| Email attachment under 100KB | Target file size (Method 1) |

## Tips for keeping quality high at 100KB

### 1. Resize before compressing
A 4000×3000 image at 100KB will look terrible. A 1280×960 image at 100KB will look fine. Match the dimensions to how the image will be displayed.

### 2. Use the right format
- **JPG:** best for photos at small sizes
- **WebP:** 25–35% smaller than JPG at the same quality — switch output format to WebP for an easy win
- **AVIF:** even smaller than WebP, but slower to encode
- **PNG:** only for logos/graphics with few colors — PNGs struggle to hit 100KB for photos

### 3. Avoid re-compressing
Every time you save a JPG, it loses quality. If you need to edit the image, edit the original (PNG or RAW) and compress once at the end.

### 4. Crop out unnecessary content
If your photo has empty space around the edges, crop it. Fewer pixels = smaller file at the same quality.

## Common mistakes

### Setting quality too low
Many people set quality to 30% thinking it'll hit 100KB. It will — but the result looks like a watercolor painting. Start with target file size and let the tool find the right quality.

### Forgetting to resize
If your image is 6000×4000, no quality setting will give you a good-looking 100KB file. Resize first.

### Using PNG for photos
PNG is lossless — it can't compress photos to 100KB without looking awful. Use JPG or WebP for photos.

## Try it now

Upload your JPG to [Pixquish](/#workspace), click the **100 KB** preset, and hit Compress. You'll have a 100KB file in under a second — no sign-up, no upload, no watermark. Everything runs in your browser.
