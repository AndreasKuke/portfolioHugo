import { readdirSync, readFileSync, writeFileSync } from "fs";
import { extname, join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DOCS_DIR = join(__dirname, "../docs");
const OUT = join(__dirname, "../docs.json");

const supported = [".md", ".txt"];
const docs = [];

for (const file of readdirSync(DOCS_DIR)) {
  if (!supported.includes(extname(file).toLowerCase())) continue;
  const content = readFileSync(join(DOCS_DIR, file), "utf8").trim();
  if (content) docs.push({ name: file, content });
}

writeFileSync(OUT, JSON.stringify(docs, null, 2));
console.log(`Built docs.json with ${docs.length} file(s): ${docs.map(d => d.name).join(", ")}`);
