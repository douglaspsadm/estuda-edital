#!/usr/bin/env node
/**
 * Gera:
 * 1) public/ -> site estático pronto para deploy gratuito na Vercel
 * 2) dist/estuda_edital_offline.html -> build single-file 100% offline
 * Uso: node scripts/build.mjs
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const SRC = path.join(ROOT, "src");
const PUBLIC_DIR = path.join(ROOT, "public");
const DIST = path.join(ROOT, "dist");

// 1. Copia src/ para public/ (site estático para Vercel)
fs.rmSync(PUBLIC_DIR, { recursive: true, force: true });
fs.cpSync(SRC, PUBLIC_DIR, { recursive: true });

// 2. Gera bundle single-file offline (dist/estuda_edital_offline.html)
const html = fs.readFileSync(path.join(SRC, "index.html"), "utf8");
const css = fs.readFileSync(path.join(SRC, "css", "styles.css"), "utf8");

const scriptOrder = [
  "data/dpdf_edital_data.js",
  "data/dpdf_questions_reais.js",
  "data/dpdf_lessons_data.js",
  "data/dpdf_discursive_data.js",
  "data/cofen_edital_data.js",
  "data/shared_bank.js",
  "js/tracks_manager.js",
  "js/ai_tutor.js",
  "js/pdf_importer.js",
  "js/onboarding_wizard.js",
  "js/cloud_sync.js",
  "js/app.js"
];

const bundledJs = scriptOrder
  .map(rel => {
    const content = fs.readFileSync(path.join(SRC, rel), "utf8");
    return `// --- FILE: src/${rel} ---\n${content}`;
  })
  .join("\n\n");

let out = html
  .replace(/<link\s+rel="manifest"[^>]*>\s*/i, "")
  .replace(
    /<link\s+rel="stylesheet"\s+href="css\/styles\.css"\s*\/?>/,
    `<style>\n${css}\n</style>`
  );

const scriptsRegex = /(\s*<script\s+src="[^"]+"><\/script>\s*)+/;
if (!scriptsRegex.test(out)) {
  throw new Error("Não foi possível localizar os blocos <script src=...> em src/index.html");
}
out = out.replace(scriptsRegex, `\n  <script>\n${bundledJs}\n  </script>\n`);

fs.mkdirSync(DIST, { recursive: true });
const outFile = path.join(DIST, "estuda_edital_offline.html");
fs.writeFileSync(outFile, out, "utf8");

const sizeKb = (Buffer.byteLength(out, "utf8") / 1024).toFixed(1);
console.log(`✅ Site estático gerado em: public/ (pronto para Vercel)`);
console.log(`✅ Build offline gerado em: dist/estuda_edital_offline.html (${sizeKb} KB)`);
