import Anthropic from "@anthropic-ai/sdk";
import docs from "./docs.json";

const DOC_CONTEXT = docs.length
  ? docs.map((d) => `### ${d.name}\n${d.content}`).join("\n\n---\n\n")
  : null;

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") ?? "";
    const allowed = env.ALLOWED_ORIGIN ?? "https://andreaskuke.github.io";
    const originOk =
      origin === allowed || /^http:\/\/localhost(:\d+)?$/.test(origin);

    const corsHeaders = {
      "Access-Control-Allow-Origin": originOk ? origin : allowed,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    const { pathname } = new URL(request.url);

    if (pathname === "/health") {
      return Response.json({ ok: true }, { headers: corsHeaders });
    }

    if (pathname !== "/chat" || request.method !== "POST") {
      return new Response("Not found", { status: 404 });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return Response.json(
        { error: "invalid JSON" },
        { status: 400, headers: corsHeaders }
      );
    }

    const { message, history = [] } = body;
    if (!message?.trim()) {
      return Response.json(
        { error: "message required" },
        { status: 400, headers: corsHeaders }
      );
    }

    const systemPrompt = DOC_CONTEXT
      ? `You are a helpful assistant for Andreas Kuke's portfolio website. Answer questions about Andreas using the provided documents. Be concise and friendly.\n\n## Documents\n\n${DOC_CONTEXT}`
      : "You are a helpful assistant for Andreas Kuke's portfolio website. Be concise and friendly.";

    const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });
    const messages = [
      ...history.map(({ role, content }) => ({ role, content })),
      { role: "user", content: message },
    ];

    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();
    const encoder = new TextEncoder();

    // Fire streaming in background; return readable immediately
    streamToWriter(client, systemPrompt, messages, writer, encoder);

    return new Response(readable, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
      },
    });
  },
};

async function streamToWriter(client, systemPrompt, messages, writer, encoder) {
  try {
    const stream = client.messages.stream({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      system: systemPrompt,
      messages,
    });

    for await (const event of stream) {
      if (
        event.type === "content_block_delta" &&
        event.delta.type === "text_delta"
      ) {
        await writer.write(
          encoder.encode(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`)
        );
      }
    }
    await writer.write(encoder.encode("data: [DONE]\n\n"));
  } catch (err) {
    await writer.write(
      encoder.encode(`data: ${JSON.stringify({ error: err.message })}\n\n`)
    );
  } finally {
    writer.close();
  }
}
