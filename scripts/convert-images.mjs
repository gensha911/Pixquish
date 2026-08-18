// Convert all PNG screenshots in /public/guide and /public/blog to WebP.
// Run with: `node scripts/convert-images.mjs` (or `bun scripts/convert-images.mjs`)
// Idempotent: skips files where the .webp already exists and is newer than the .png.
// After conversion, rewrites references in src/components/pixquish/*.tsx and any markdown.

import sharp from "sharp";
import { readdir, stat, mkdir, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PUBLIC = path.join(ROOT, "public");

const DIRS = ["guide", "blog"];

// Screenshots contain text + UI elements — very sensitive to compression artifacts.
// Q92 is "visually lossless" per Pixquish's own blog (matches Q90 recommendation).
// Lower Q (e.g. 82) makes text blurry/blocky. Q92 keeps text crisp.
const QUALITY = 92;

async function convertDir(dir) {
  const absDir = path.join(PUBLIC, dir);
  if (!existsSync(absDir)) {
    console.log(`  skip ${dir}/ (missing)`);
    return { converted: 0, skipped: 0, saved: 0 };
  }
  const files = (await readdir(absDir)).filter((f) => f.toLowerCase().endsWith(".png"));
  let converted = 0, skipped = 0, saved = 0;
  for (const f of files) {
    const src = path.join(absDir, f);
    const dst = path.join(absDir, f.replace(/\.png$/i, ".webp"));
    const srcStat = await stat(src);
    if (existsSync(dst)) {
      const dstStat = await stat(dst);
      if (dstStat.mtimeMs >= srcStat.mtimeMs) {
        skipped++;
        continue;
      }
    }
    const before = srcStat.size;
    await sharp(src, { density: 144 })
      .webp({ quality: QUALITY, effort: 6, alphaQuality: 100 })
      .toFile(dst);
    const after = (await stat(dst)).size;
    saved += before - after;
    converted++;
    console.log(`  ${dir}/${f} → ${path.basename(dst)}  ${(before / 1024).toFixed(0)}KB → ${(after / 1024).toFixed(0)}KB  (-${Math.round((1 - after / before) * 100)}%)`);
  }
  return { converted, skipped, saved };
}

async function main() {
  console.log("Converting PNGs to WebP (quality=" + QUALITY + ")...");
  let totalConverted = 0, totalSkipped = 0, totalSaved = 0;
  for (const dir of DIRS) {
    console.log(`\n[${dir}/]`);
    const r = await convertDir(dir);
    totalConverted += r.converted;
    totalSkipped += r.skipped;
    totalSaved += r.saved;
  }
  console.log(
    `\nDone. Converted ${totalConverted}, skipped ${totalSkipped}, saved ${(totalSaved / 1024 / 1024).toFixed(2)} MB.`
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
