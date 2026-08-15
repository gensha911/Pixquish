---
title: "How to Reduce Image File Size for Email (Without Losing Quality)"
description: "Email attachments should be under 1 MB. Here's how to reduce image file size for email — compress to a target size, convert to JPG/WebP, and resize dimensions. With exact settings for Gmail, Outlook, and Apple Mail."
date: "2026-08-15"
author: "Pixquish"
tags: ["email", "compress", "file-size", "jpg", "reduce-size"]
image: "/og-image.png"
---

Most email providers limit attachments to 25 MB, but that doesn't mean you should send a 24 MB image. Large attachments load slowly, eat mobile data, and annoy recipients. Here's how to get your images down to a reasonable size before hitting send.

## What size should email images be?

| Use case | Target size |
|---|---|
| Inline photo in email body | 100–300 KB |
| Email attachment (1–3 photos) | 500 KB – 1 MB each |
| Email attachment (many photos) | 200–400 KB each |
| Profile photo / avatar | 50–100 KB |
| Email signature logo | 10–30 KB |

**Rule of thumb:** Keep each image under 1 MB. Total attachment size under 5 MB. Recipients on mobile will thank you.

## Method 1: compress to a target file size

The most reliable way to hit a specific size is to use a target file size feature.

### Step-by-step

1. Go to [Pixquish](/#workspace) and upload your image
2. In the **Target file size** section, click **500 KB** (or 200 KB for smaller files)
3. Click **Compress**
4. Download — your file will be within a few KB of your target

### How it works

Pixquish runs a binary search across quality levels to find the exact quality that produces a file closest to your target. It takes under a second, and the result is as close to your target size as possible while keeping the best achievable quality.

### Which target should you pick?

- **200 KB:** Good for inline photos in the email body. Loads instantly on mobile.
- **500 KB:** Good for attachments. High enough quality for the recipient to zoom in.
- **1 MB:** Good for sending one high-quality photo. Approaching the "annoying" threshold for mobile users.

## Method 2: convert to JPG

If your image is a PNG (especially a photo saved as PNG), converting to JPG can cut the file size by 80%+ with no visible quality loss.

### Step-by-step

1. Upload your PNG to [Pixquish](/#workspace)
2. Set **Output format** to **JPEG**
3. Set quality to **85%** (or use "Auto")
4. Click **Compress**
5. Download your JPG

### Why JPG is smaller than PNG

PNG uses lossless compression — it preserves every pixel exactly. For photos with millions of colors, this produces huge files. JPG uses lossy compression that discards information the human eye can't see — producing files 5–20× smaller for photos.

### When NOT to convert to JPG

- Your image has transparency (JPG doesn't support it — use WebP instead)
- Your image is a logo or graphic with text (JPG artifacts on text are ugly — use PNG or WebP)
- Your image is a screenshot with thin lines (JPG will blur them — use PNG)

## Method 3: resize the dimensions

If your image is 4000×3000 pixels but will only be displayed at 800×600 in the email, there's no reason to send the full resolution. Resize first, then compress.

### Step-by-step

1. Go to [Pixquish Resize](/#resize)
2. Set width to **1280** (good for retina displays at 640px)
3. Keep aspect ratio locked
4. Click **Resize**
5. Download, then re-upload to the Compress tab
6. Use target file size (500 KB) for final compression

### Why this works

File size scales roughly with pixel count. A 4000×3000 image has 12 million pixels. A 1280×960 version has 1.2 million — 10× fewer pixels, which means roughly 10× smaller file at the same quality.

### What size should you resize to?

| Display size in email | Resize to |
|---|---|
| Small thumbnail (200px) | 400 px wide |
| Medium (500px) | 1000 px wide |
| Large / full-width (800px) | 1600 px wide |
| Full-screen on phone (1200px) | 2400 px wide |

Always resize to **2× the display size** — this covers retina displays without making the file unnecessarily large.

## Method 4: use WebP (modern email clients only)

WebP produces files 25–35% smaller than JPG at the same quality. But not all email clients support it.

### Email client support for WebP

| Email client | WebP support |
|---|---|
| Apple Mail (macOS) | ✅ |
| Apple Mail (iOS) | ✅ (iOS 14+) |
| Gmail (web) | ✅ |
| Gmail (mobile) | ✅ |
| Outlook (desktop) | ❌ |
| Outlook (web) | ✅ |
| Yahoo Mail | ✅ |

**Recommendation:** If you know your recipient uses Gmail or Apple Mail, use WebP for smaller files. If sending to a business (likely Outlook), stick with JPG.

### How to convert to WebP

1. Upload your image to [Pixquish](/#workspace)
2. Set **Output format** to **WebP**
3. Use quality **85%** or target file size
4. Click **Compress**
5. Download your WebP

## Quick reference: best settings for email

| Situation | Format | Settings |
|---|---|---|
| Photo attachment | JPG | Target 500 KB, or quality 85% |
| Inline photo in email body | JPG | Target 200 KB |
| Logo with transparency | PNG | Resize to 2× display size |
| Logo (no transparency needed) | WebP | Target 50 KB |
| Screenshot | PNG | Resize to 2× display size |
| Many photos (batch) | JPG | Target 300 KB each, batch process |

## How to batch-compress multiple images

If you have 10+ images to send, compress them all at once:

1. Upload all your images to [Pixquish](/#workspace)
2. Set target file size (e.g. 300 KB) or quality
3. Click **Compress All** — every image gets the same settings
4. Click **Download All** — get them all in one click

This is much faster than compressing one at a time.

## How to check image size before sending

### On Windows
Right-click the image → Properties → look at "Size on disk"

### On Mac
Select the image → Command+I (Get Info) → look at "Size"

### On mobile
Most file managers show file size next to the image. On iPhone, the Photos app shows file size when you view image info.

If the image is over 1 MB, compress it before attaching to an email.

## Common mistakes

### Sending full-resolution photos
A single photo from a modern phone is 3–8 MB. Don't attach 5 of these to an email — that's 25 MB and will likely exceed attachment limits. Compress first.

### Using PNG for photos
PNG is lossless, which means photo files are huge (5–20 MB for a single photo). Convert to JPG or WebP before emailing.

### Not resizing
A 4000×3000 image at 200 KB will look terrible — the quality has been crushed to fit the size. Resize to 1280×960 first, then compress to 200 KB. The result looks great.

### Forgetting mobile recipients
Many people check email on phones over cellular data. A 5 MB email attachment uses 5 MB of their data plan. Keep attachments small as a courtesy.

## The fastest way to reduce image size for email

1. Upload to [Pixquish](/#workspace)
2. Click **500 KB** in the target file size section
3. Click **Compress**
4. Download and attach to your email

Done in under 5 seconds. No sign-up, no upload to a server — your images stay on your device.
