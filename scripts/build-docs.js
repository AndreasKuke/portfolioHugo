// Reads rag/docs/ and writes worker/docs.json so the Worker can bundle it.
// Run before `wrangler deploy` (handled automatically by the GitHub Actions workflow).
const { readdirSync, readFileSync, writeFileSync } = require("fs");
const { join, extname } = require("path");

const DOCS_DIR = join(__dirname, "..", "rag", "docs");
const OUT_FILE = join(__dirname, "..", "worker", "docs.json");

const supported = [".txt", ".md"];
const docs = [];

try {
  for (const file of readdirSync(DOCS_DIR)) {
    if (!supported.includes(extname(file).toLowerCase())) continue;
    const content = readFileSync(join(DOCS_DIR, file), "utf8").trim();
    if (content) docs.push({ name: file, content });
  }
} catch {
  // docs dir missing or empty — that's fine
}

writeFileSync(OUT_FILE, JSON.stringify(docs, null, 2));
console.log(`Built worker/docs.json with ${docs.length} document(s)`);
