import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectDirectory = path.resolve(scriptDirectory, "..");
const distDirectory = path.join(projectDirectory, "dist");
const publicDirectory = path.join(projectDirectory, "public");
const outputPath = path.join(projectDirectory, "刘海宁-UI设计作品集-单文件.html");

const mimeTypes = {
  ".css": "text/css",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".js": "text/javascript",
  ".mp4": "video/mp4",
  ".pdf": "application/pdf",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

const toDataUri = async (assetUrl) => {
  const relativePath = assetUrl.replace(/^\//, "");
  const assetPath = path.join(publicDirectory, relativePath);
  const extension = path.extname(assetPath).toLowerCase();
  const mimeType = mimeTypes[extension] ?? "application/octet-stream";
  const contents = await readFile(assetPath);
  return `data:${mimeType};base64,${contents.toString("base64")}`;
};

let html = await readFile(path.join(distDirectory, "index.html"), "utf8");
const scriptMatch = html.match(/<script[^>]+src="([^"]+)"[^>]*><\/script>/);
const styleMatch = html.match(/<link[^>]+href="([^"]+\.css)"[^>]*>/);

if (!scriptMatch || !styleMatch) {
  throw new Error("Unable to locate the Vite script or stylesheet in dist/index.html.");
}

const scriptPath = path.join(distDirectory, scriptMatch[1].replace(/^\//, ""));
const stylePath = path.join(distDirectory, styleMatch[1].replace(/^\//, ""));
let javascript = await readFile(scriptPath, "utf8");
let css = await readFile(stylePath, "utf8");

const combinedSource = `${javascript}\n${css}`;
const assetUrls = Array.from(new Set(combinedSource.match(/\/assets\/[A-Za-z0-9._-]+/g) ?? []));

for (const assetUrl of assetUrls) {
  const dataUri = await toDataUri(assetUrl);
  javascript = javascript.split(assetUrl).join(dataUri);
  css = css.split(assetUrl).join(dataUri);
}

javascript = javascript.replaceAll("</script", "<\\/script");
html = html.replace(styleMatch[0], () => `<style>${css}</style>`);
html = html.replace(scriptMatch[0], () => `<script type="module">${javascript}</script>`);
html = html.replace(/<link[^>]+rel="preload"[^>]+href="\/assets\/[^"]+"[^>]*>\s*/g, "");
html = html.replace(
  "</head>",
  '<meta name="offline-bundle" content="All scripts, styles, images and video are embedded" />\n  </head>',
);

const remainingAssetReferences = Array.from(new Set(html.match(/\/assets\/[A-Za-z0-9._-]+/g) ?? []));
if (remainingAssetReferences.length > 0) {
  throw new Error(`The generated HTML still contains external assets: ${remainingAssetReferences.join(", ")}`);
}

await writeFile(outputPath, html);

const sizeInMegabytes = Buffer.byteLength(html) / 1024 / 1024;
console.log(`Created ${outputPath}`);
console.log(`Embedded ${assetUrls.length} assets; final size ${sizeInMegabytes.toFixed(1)} MB.`);
