import Anthropic from "@anthropic-ai/sdk";
import cors from "cors";
import "dotenv/config";
import express from "express";
import { readdirSync, readFileSync } from "fs";
import { extname, join } from "path";

const app = express();
const PORT = process.env.PORT || 3001;
const DOCS_DIR = join(import.meta.dirname, "docs");

app.use(cors());
app.use(express.json());

function loadDocs() {
  const supported = [".txt", ".md"];
  let parts = [];
  try {
    for (const file of readdirSync(DOCS_DIR)) {
      if (!supported.includes(extname(file).toLowerCase())) continue;
      const text = readFileSync(join(DOCS_DIR, file), "utf8").trim();
      if (text) parts.push(`### ${file}\n${text}`);
    }
  } catch {
    // docs dir empty or missing — fine, carry on
  }
  return parts.join("\n\n---\n\n");
}

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

app.post("/chat", async (req, res) => {
  const { message, history = [] } = req.body;
  if (!message?.trim()) return res.status(400).json({ error: "message required" });

  const docs = loadDocs();
  const systemPrompt = docs
    ? `You are a helpful assistant for Andreas Kuke's portfolio website. Answer questions using the provided documents. Be concise and friendly.\n\n## Documents\n\n${docs}`
    : "You are a helpful assistant for Andreas Kuke's portfolio website. Be concise and friendly.";

  const messages = [
    ...history.map(({ role, content }) => ({ role, content })),
    { role: "user", content: message },
  ];

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  try {
    const stream = client.messages.stream({
      model: "claude-opus-4-7",
      max_tokens: 1024,
      system: systemPrompt,
      messages,
    });

    for await (const event of stream) {
      if (
        event.type === "content_block_delta" &&
        event.delta.type === "text_delta"
      ) {
        res.write(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`);
      }
    }
    res.write("data: [DONE]\n\n");
  } catch (err) {
    res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
  } finally {
    res.end();
  }
});

app.get("/health", (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => console.log(`RAG server running on http://localhost:${PORT}`));
