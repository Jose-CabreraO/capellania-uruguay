import { cp, mkdir, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");

const entries = [
  "index.html",
  "sobre-nosotros.html",
  "robots.txt",
  "assets",
  "css",
  "images",
  "congreso",
  "sobre-nosotros",
];

async function copyEntry(entry) {
  const source = path.join(root, entry);
  const target = path.join(dist, entry);

  if (!existsSync(source)) return;

  await cp(source, target, {
    recursive: true,
    force: true,
  });
}

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });

for (const entry of entries) {
  await copyEntry(entry);
}

console.log("Static Cloudflare Pages build generated in dist/");
