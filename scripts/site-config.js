// Environment-dependent settings for the Uruguay site. Source pages never contain a
// domain: they use {{SITE_URL}} and {{ROBOTS}}, which the build fills from here.
//
// site.config.json
//   siteUrl              origin used for canonical, Open Graph, JSON-LD, sitemap and robots.txt
//   siteUrlConfirmed     must be true for a production build
//   provisionalSiteUrls  origins that must never appear in a production build
//   indexable            false = noindex on every page and no Sitemap line in robots.txt
//   trailingSlash        true = /galeria/ (works on any static host), false = /galeria
//   routes               public path (written with a trailing slash) -> source page
//
// Environment overrides, useful for previews: SITE_URL, SITE_INDEXABLE=true|false.
// Production mode: npm run build:production, or SITE_PRODUCTION=true.
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export async function loadSiteConfig({ argv = process.argv, env = process.env } = {}) {
  const config = JSON.parse(await readFile(path.join(root, "site.config.json"), "utf8"));
  const production = argv.includes("--production") || env.SITE_PRODUCTION === "true";
  const siteUrl = (env.SITE_URL || config.siteUrl || "").replace(/\/+$/, "");
  const indexable = env.SITE_INDEXABLE ? env.SITE_INDEXABLE === "true" : Boolean(config.indexable);

  if (!/^https?:\/\/[^/\s]+$/i.test(siteUrl)) throw new Error(`siteUrl debe ser un origen sin ruta, por ejemplo https://ejemplo.uy (recibido: "${siteUrl}").`);

  const routes = Object.entries(config.routes).map(([route, file]) => ({ route, file, path: publicPath(route, config.trailingSlash) }));
  return { ...config, siteUrl, indexable, production, routes };
}

export function publicPath(route, trailingSlash) {
  if (route === "/" || trailingSlash) return route;
  return route.replace(/\/$/, "");
}

// Problems that block a production build. Development builds only print them as warnings.
export function productionProblems(config) {
  const problems = [];
  if (!config.siteUrlConfirmed) problems.push("siteUrlConfirmed es false en site.config.json.");
  if (!config.siteUrl.startsWith("https://")) problems.push(`El dominio de producción debe usar https (${config.siteUrl}).`);
  if (/localhost|127\.0\.0\.1|\.local\b|\.test\b/i.test(config.siteUrl)) problems.push(`${config.siteUrl} es un dominio local.`);
  if ((config.provisionalSiteUrls || []).includes(config.siteUrl)) problems.push(`${config.siteUrl} figura en provisionalSiteUrls.`);
  return problems;
}
