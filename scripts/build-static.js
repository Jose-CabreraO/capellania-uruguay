// Builds a portable static site in dist/ that any static host can serve
// (Apache, Nginx, Netlify, Cloudflare Pages, Vercel...). No server code is required.
//
//   npm run build              development/preview build (always noindex-safe, never needs a domain)
//   npm run build:production   fails unless site.config.json has a confirmed, non-provisional domain
import { cp, mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { loadSiteConfig, productionProblems, root } from "./site-config.js";

const dist = path.join(root, "dist");
const config = await loadSiteConfig();

// Only Uruguay pages and their assets are published. Pages, images and API
// handlers inherited from Capellanía Empresarial Paraguay (congreso/,
// sobre-nosotros, images/, api/, functions/) stay in the repository for
// reference but are never copied to dist/.
const entries = [
  "index.html",
  "galeria",
  "css",
  "assets/data",
  "assets/js",
  "assets/images/galeria",
  "assets/images/hero-capellania-uruguay.webp",
  "assets/images/hero-capellania-uruguay-1200.webp",
  "assets/images/og-capellania-uruguay.jpg",
  "assets/logos/capellania-uruguay",
];

const TEXT_FILE = /\.(html|css|js|json|xml|txt)$/i;

async function copyEntry(entry) {
  const source = path.join(root, entry);
  if (!existsSync(source)) throw new Error(`Falta ${entry}, requerido por el sitio de Uruguay.`);
  await cp(source, path.join(dist, entry), { recursive: true, force: true });
}

// Source pages link to routes with a trailing slash (/galeria/); adapt them when trailingSlash is false.
function adaptRoutes(html) {
  return config.routes.reduce((content, { route, path: publicRoute }) => {
    if (route === publicRoute) return content;
    const escaped = route.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return content.replace(new RegExp(`((?:["'(]|\\{\\{SITE_URL\\}\\}))${escaped}(?=["'#?)])`, "g"), `$1${publicRoute}`);
  }, html);
}

function renderPage(html) {
  return adaptRoutes(html)
    .replaceAll("{{SITE_URL}}", config.siteUrl)
    .replaceAll("{{ROBOTS}}", config.indexable ? "index, follow" : "noindex, nofollow");
}

function robotsTxt() {
  const lines = ["User-agent: *", "Allow: /"];
  // Pages stay crawlable so search engines can read their noindex; the sitemap is only announced once indexable.
  if (config.indexable) lines.push("", `Sitemap: ${config.siteUrl}/sitemap.xml`);
  return `${lines.join("\n")}\n`;
}

function sitemapXml() {
  const urls = config.routes.map(({ path: publicRoute }) => `  <url>\n    <loc>${config.siteUrl}${publicRoute}</loc>\n  </url>`);
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`;
}

async function listFiles(dir) {
  const items = await readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(items.map(item => {
    const full = path.join(dir, item.name);
    return item.isDirectory() ? listFiles(full) : [full];
  }));
  return nested.flat();
}

async function scanDist() {
  const problems = [];
  const provisional = config.provisionalSiteUrls || [];
  for (const file of (await listFiles(dist)).filter(name => TEXT_FILE.test(name))) {
    const content = await readFile(file, "utf8");
    const relative = path.relative(dist, file).replaceAll("\\", "/");
    if (/\{\{[A-Z_]+\}\}/.test(content)) problems.push(`${relative}: quedan marcadores {{...}} sin completar.`);
    if (content.includes("capellania.org.py")) problems.push(`${relative}: contiene URLs de Capellanía Paraguay.`);
    if (config.production) {
      for (const url of provisional) if (content.includes(url)) problems.push(`${relative}: contiene la URL provisional ${url}.`);
      if (/https?:\/\/(localhost|127\.0\.0\.1)/.test(content)) problems.push(`${relative}: contiene URLs locales.`);
    }
  }
  return problems;
}

const configProblems = productionProblems(config);
if (config.production && configProblems.length) {
  console.error(`Build de producción cancelado:\n- ${configProblems.join("\n- ")}`);
  process.exit(1);
}

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
for (const entry of entries) await copyEntry(entry);

for (const { file } of config.routes) {
  const target = path.join(dist, file);
  await writeFile(target, renderPage(await readFile(target, "utf8")), "utf8");
}
await writeFile(path.join(dist, "robots.txt"), robotsTxt(), "utf8");
await writeFile(path.join(dist, "sitemap.xml"), sitemapXml(), "utf8");

const distProblems = await scanDist();
if (distProblems.length) {
  console.error(`dist/ no es válido:\n- ${distProblems.join("\n- ")}`);
  process.exit(1);
}

console.log(`Sitio estático generado en dist/ (${config.production ? "producción" : "desarrollo"}).`);
console.log(`  URL base: ${config.siteUrl}${config.siteUrlConfirmed ? "" : " (provisional)"}`);
console.log(`  Indexación: ${config.indexable ? "habilitada" : "bloqueada con noindex"}`);
if (!config.production && configProblems.length) console.log(`  Pendiente para producción: ${configProblems.join(" ")}`);
