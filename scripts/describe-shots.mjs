// Describe each guide screenshot's layout in plain English so we can
// derive accurate highlight bounding boxes manually.
import ZAI from "z-ai-web-dev-sdk";
import fs from "node:fs";
import path from "node:path";

const GUIDE_DIR = "public/guide";

const ASKS = [
  { file: "03-uploaded.png", key: "upload", ask: "the upload area / drop zone / compact upload bar where the user adds images" },
  { file: "04-controls.png", key: "mode", ask: "the 'Mode' row containing the Best Quality / Balanced / Max Compress buttons" },
  { file: "04-controls.png", key: "target", ask: "the row of target file-size preset buttons (20 KB, 50 KB, 100 KB, 200 KB, 500 KB, 1 MB)" },
  { file: "04-controls.png", key: "compress", ask: "the 'Compress All' button (large teal button)" },
  { file: "06-comparison.png", key: "compare", ask: "the vertical slider handle / divider line between before and after" },
  { file: "05-results.png", key: "download", ask: "the 'Download all' button" },
  { file: "09-resize-dimensions.png", key: "dimensions", ask: "the width and height pixel input fields" },
  { file: "10-resize-fit-modes.png", key: "fitmode", ask: "the Cover / Contain / Stretch fit mode buttons" },
  { file: "11-resize-result.png", key: "resizeslider", ask: "the vertical slider handle / divider line between before and after" },
  { file: "07-batch-download.png", key: "batch", ask: "the 'Select all' checkbox or the column of per-file checkboxes" },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function toDataURL(p) {
  return `data:image/png;base64,${fs.readFileSync(p).toString("base64")}`;
}

async function callVision(zai, dataUrl, user) {
  for (let attempt = 0; attempt < 6; attempt++) {
    try {
      const resp = await zai.chat.completions.createVision({
        messages: [
          { role: "system", content: "You describe the layout of UI screenshots in plain English. Be concrete about positions (top/middle/bottom, left/center/right) and approximate sizes as a fraction of the image. Keep it under 80 words." },
          { role: "user", content: [
            { type: "text", text: user },
            { type: "image_url", image_url: { url: dataUrl } },
          ]},
        ],
        thinking: { type: "disabled" },
      });
      return resp.choices?.[0]?.message?.content ?? "";
    } catch (e) {
      const msg = String(e?.message || e);
      if (msg.includes("429")) { await sleep(6000 * (attempt + 1)); continue; }
      throw e;
    }
  }
  return "";
}

async function run() {
  const zai = await ZAI.create();
  const out = {};
  for (const a of ASKS) {
    const dataUrl = toDataURL(path.join(GUIDE_DIR, a.file));
    const user = `Describe where ${a.ask} is located in this screenshot. Mention: is it in the top/middle/bottom? left/center/right? Roughly what fraction of the image width and height does it occupy? (e.g. "left sidebar, upper third, about 20% wide and 12% tall")`;
    const desc = await callVision(zai, dataUrl, user);
    out[a.key] = { file: a.file, desc };
    console.log(`${a.key.padEnd(12)} | ${desc.replace(/\s+/g, " ").slice(0, 180)}`);
    await sleep(2500);
  }
  fs.writeFileSync("scripts/descriptions.json", JSON.stringify(out, null, 2));
  console.log("\nSaved -> scripts/descriptions.json");
}

run().catch((e) => { console.error("FATAL:", e); process.exit(1); });
