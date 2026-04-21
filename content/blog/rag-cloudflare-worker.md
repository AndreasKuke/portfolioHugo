---
title: "Moving the RAG chatbot to Cloudflare Workers"
date: 2026-04-21
draft: false
summary: "How I moved my portfolio RAG chatbot from a local Express server to a serverless Cloudflare Worker"
tags:
  - ai
  - rag
  - chatbot
  - cloudflare
  - project-log
---

After getting the RAG chatbot running locally with an Express server, the next problem was obvious — it only worked on my machine. The portfolio is a static site hosted on GitHub Pages, so there's nowhere to run a backend.

I asked Claude Code how to fix this and it gave me three options:

- Cloudflare Workers (serverless, runs at the edge)
- Vercel or Netlify (move the whole site)
- Call the API directly from the browser (bad idea, exposes the API key)

I went with Cloudflare Workers. Free tier, no need to move the site, and the API key stays secure on the server side.

## What changed

The Express server (`rag/server.js`) got replaced by a Cloudflare Worker (`worker/index.js`). The logic is basically the same — take a message, load the docs, call Claude, stream the response back. The difference is it runs on Cloudflare's edge instead of my laptop.

For the RAG documents, Workers don't have a filesystem, so I wrote a small build script that reads everything from `rag/docs/` and bundles it into a `docs.json` file before deploying. That JSON gets baked into the worker.

## GitHub Actions

The deploy is fully automated. On every push to `main`:

- Hugo builds the static site → deploys to GitHub Pages
- The docs script runs → worker deploys to Cloudflare

Two jobs running in parallel, two secrets needed: `CLOUDFLARE_API_TOKEN` and `ANTHROPIC_API_KEY`.

## Problems I ran into

Getting the Cloudflare API token right took a few tries. The first token had no permission policies attached, so it failed with a 400 auth error. The fix was using the **Edit Cloudflare Workers** template when creating the token — that pre-fills everything correctly.

The workers.dev subdomain also needed to be registered manually before the first deploy would succeed. Easy to miss if you've never used Workers before.

The chat widget URL was getting mangled by Hugo's HTML minifier. It was appending a literal `"` character to the end of the URL, breaking the fetch request. Fixed it by passing the URL as a `data-` attribute on the widget div instead of injecting it via an inline script tag.

Finally, the Anthropic API key I had saved didn't have any credits attached to it. Had to buy $5 of credits on platform.claude.com and generate a fresh key.

## End result

The chat widget sits in the bottom-right corner on every page. Drop a `.md` or `.txt` file into `rag/docs/`, push, and the worker rebuilds with that context automatically.
