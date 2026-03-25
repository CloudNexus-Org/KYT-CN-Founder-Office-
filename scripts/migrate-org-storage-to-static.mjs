import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const ROOT = process.cwd();
const STORAGE_PATH = path.join(ROOT, "org-storage.json");
const DATA_PATH = path.join(ROOT, "src", "data", "orgData.js");
const ASSET_DIR = path.join(ROOT, "assets", "cloudnexus-images");

const IMAGE_FIELDS = new Set(["image", "profileImageUrl", "secondaryImage", "secondaryImageUrl"]);

const MIME_TO_EXT = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/svg+xml": "svg",
};

function slugify(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || "unknown";
}

function toAssetPath(value) {
  const src = String(value || "").trim();
  if (!src) {
    return src;
  }
  if (src.startsWith("/assets/")) {
    return src.slice(1);
  }
  return src;
}

function parseDataUrl(dataUrl) {
  const match = /^data:([^;]+);base64,(.+)$/i.exec(dataUrl);
  if (!match) {
    return null;
  }
  const mime = match[1].toLowerCase();
  const base64 = match[2];
  const ext = MIME_TO_EXT[mime] || "bin";
  return { mime, base64, ext };
}

function ensureDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function writeStaticOrgDataFile(filePath, data) {
  const content = `export const initialOrgData = ${JSON.stringify(data, null, 2)};\n`;
  fs.writeFileSync(filePath, content, "utf8");
}

function main() {
  if (!fs.existsSync(STORAGE_PATH)) {
    throw new Error("org-storage.json not found in workspace root.");
  }

  ensureDirectory(ASSET_DIR);

  const storageRaw = fs.readFileSync(STORAGE_PATH, "utf8");
  const orgData = JSON.parse(storageRaw);

  const writtenByHash = new Map();
  let converted = 0;

  function visit(node, context = { id: "node", name: "node" }) {
    if (Array.isArray(node)) {
      node.forEach((item) => visit(item, context));
      return;
    }

    if (!node || typeof node !== "object") {
      return;
    }

    const nextContext = {
      id: node.id ? slugify(node.id) : context.id,
      name: node.name ? slugify(node.name) : context.name,
    };

    for (const [key, value] of Object.entries(node)) {
      if (IMAGE_FIELDS.has(key) && typeof value === "string") {
        const trimmed = value.trim();
        if (trimmed.startsWith("data:")) {
          const parsed = parseDataUrl(trimmed);
          if (!parsed) {
            continue;
          }

          const buffer = Buffer.from(parsed.base64, "base64");
          const hash = crypto.createHash("sha1").update(buffer).digest("hex").slice(0, 12);

          let fileName = writtenByHash.get(hash);
          if (!fileName) {
            fileName = `${nextContext.name}-${nextContext.id}-${slugify(key)}-${hash}.${parsed.ext}`;
            const outputPath = path.join(ASSET_DIR, fileName);
            if (!fs.existsSync(outputPath)) {
              fs.writeFileSync(outputPath, buffer);
            }
            writtenByHash.set(hash, fileName);
          }

          node[key] = `assets/cloudnexus-images/${fileName}`;
          converted += 1;
        } else {
          node[key] = toAssetPath(trimmed);
        }
      } else {
        visit(value, nextContext);
      }
    }
  }

  visit(orgData);
  writeStaticOrgDataFile(DATA_PATH, orgData);

  console.log(`Converted ${converted} inline images to static assets.`);
  console.log(`Unique written image files: ${writtenByHash.size}`);
  console.log(`Updated org data file: ${DATA_PATH}`);
}

main();