// Get highlight bounding boxes for guide screenshots via VLM.
// Uses delays + backoff to avoid rate limits, and a worked-example prompt
// to coerce the model into emitting clean JSON with percentage values.
import ZAI from "z-ai-web-dev-sdk";
import fs from "node:fs";
import path from "node:path";

const GUIDE_DIR = "public/guide";

const TASKS = [
  { file: "03-uploaded.png", key: "upload", prompt: "the upload / drop zone area OR the compact upload bar at the very top of the page where users drag images to upload" },
  { file: "04-controls.png", key: "mode", prompt: "the 'Mode' selector row containing the three buttons 'Best Quality', 'Balanced', 'Max Compress'" },
  { file: "04-controls.png", key: "target", prompt: "the row of target file-size preset buttons labelled '20 KB', '50 KB', '100 KB', '200 KB', '500 KB', '1 MB'" },
  { file: "04-controls.png", key: "compress", prompt: "the 'Compress All' button in the top header bar (teal/green button)" },
  { file: "06-comparison.png", key: "compare", prompt: "the vertical divider line / slider handle that separates the before and after image (the draggable handle)" },
  { file: "05-results.png", key: "download", prompt: "the 'Download all' button (teal/green button that downloads all processed images at once)" },
  { file: "09-resize-dimensions.png", key: "dimensions", prompt: "the width and height number input fields where users type pixel dimensions (cover both inputs)" },
  { file: "10-resize-fit-modes.png", key: "fitmode", prompt: "the fit mode selector buttons row containing 'Cover', 'Contain', 'Stretch' options" },
  { file: "11-resize-result.png", key: "resizeslider", prompt: "the vertical divider line / slider handle separating before and after in the comparison view" },
  { file: "07-batch-download.png", key: "batch", prompt: "the 'Select all' checkbox or the column of individual file checkboxes used to select images for batch processing" },
];

const DIMS = {
  "03-uploaded.png": [1280, 800],
  "04-controls.png": [1280, 800],
  "05-results.png": [1280, 800],
  "06-comparison.png": [1280, 800],
  "07-batch-download.png": [1280, 800],
  "08-mobile.png": [1170, 2532],
  "09-resize-dimensions.png": [1280, 800],
  "10-resize-fit-modes.png": [1280, 800],
  "11-resize-result.png": [1280, 800],
};

function toDataURL(filePath) {
  const buf = fs.readFileSync(filePath);
  return `data:image/png;base64,${buf.toString("base64")}`;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function extractJson(text) {
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fence) text = fence[1];
  const start = text.search(/[{[]/);
  if (start === -1) return null;
  const openCh = text[start];
  const closeCh = openCh === "{" ? "}" : "]";
  let depth = 0;
  let end = -1;
  for (let i = start; i < text.length; i++) {
    const c = text[i];
    if (c === openCh) depth++;
    else if (c === closeCh) {
      depth--;
      if (depth === 0) { end = i; break; }
    }
  }
  if (end === -1) return null;
  try { return JSON.parse(text.slice(start, end + 1)); } catch { return null; }
}

function clampPct(n) {
  n = Number(n);
  if (!isFinite(n)) return null;
  return Math.max(0, Math.min(100, n));
}

// If a value looks like pixels (>100) for a dimension we know, convert to %.
function toPct(val, dimPx) {
  val = Number(val);
  if (!isFinite(val)) return null;
  if (val > 100) return (val / dimPx) * 100;
  return val;
}

function normalizeBox(raw, [wPx, hPx]) {
  if (!raw || typeof raw !== "object") return null;
  let x = raw.x ?? raw.left ?? raw.x1;
  let y = raw.y ?? raw.top ?? raw.y1;
  let w = raw.w ?? raw.width ?? (raw.right != null && raw.left != null ? raw.right - raw.left : null);
  let h = raw.h ?? raw.height ?? (raw.bottom != null && raw.top != null ? raw.bottom - raw.top : null);
  if (x == null || y == null || w == null || h == null) return null;
  x = toPct(x, wPx); y = toPct(y, hPx); w = toPct(w, wPx); h = toPct(h, hPx);
  x = clampPct(x); y = clampPct(y); w = clampPct(w); h = clampPct(h);
  if ([x, y, w, h].some((v) => v == null)) return null;
  if (w <= 0 || h <= 0) return null;
  return { x, y, w, h };
}

async function callVision(zai, dataUrl, user) {
  const sys = `You locate UI elements in screenshots. Respond with ONLY one JSON object: {"x":N,"y":N,"w":N,"h":N} where N is a percentage 0-100. (x,y) is the top-left corner; w and h are the width and height, also as percentages. NEVER output pixels — always percentages. No prose, no markdown, no code fences.

EXAMPLE: if an element occupies the top-left quarter of a 1000x800 image and its top-left corner is 50px from the left and 40px from the top, you output {"x":5,"y":5,"w":25,"h":25}.`;
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const resp = await zai.chat.completions.createVision({
        messages: [
          { role: "system", content: sys },
          { role: "user", content: [
            { type: "text", text: user },
            { type: "image_url", image_url: { url: dataUrl } },
          ]},
        ],
        thinking: { type: "disabled" },
      });
      const content = resp.choices?.[0]?.message?.content ?? "";
      return { content, parsed: extractJson(content) };
    } catch (e) {
      const msg = String(e?.message || e);
      if (msg.includes("429")) {
        await sleep(8000 * (attempt + 1));
        continue;
      }
      throw e;
    }
  }
  return { content: "", parsed: null };
}

async function run() {
  const zai = await ZAI.create();
  const results = {};
  for (const t of TASKS) {
    const imgPath = path.join(GUIDE_DIR, t.file);
    const dataUrl = toDataURL(imgPath);
    const dims = DIMS[t.file];
    const user = `In this screenshot, find: ${t.prompt}. Output ONLY {"x":<%>,"y":<%>,"w":<%>,"h":<%>} as percentages of the whole image.`;
    const { content, parsed } = await callVision(zai, dataUrl, user);
    const box = normalizeBox(parsed, dims);
    if (box) {
      results[t.key] = { file: t.file, ...box };
      console.log(`OK  ${t.key.padEnd(12)} -> x=${box.x.toFixed(1)} y=${box.y.toFixed(1)} w=${box.w.toFixed(1)} h=${box.h.toFixed(1)}  (${t.file})`);
    } else {
      console.log(`ERR ${t.key.padEnd(12)} -> raw=${content.slice(0, 160)}`);
      results[t.key] = { file: t.file, error: content.slice(0, 300) };
    }
    await sleep(2500); // be gentle on rate limits
  }
  fs.writeFileSync("scripts/highlights.json", JSON.stringify(results, null, 2));
  console.log("\nSaved -> scripts/highlights.json");
}

run().catch((e) => { console.error("FATAL:", e); process.exit(1); });
