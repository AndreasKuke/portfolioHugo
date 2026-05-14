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

After getting the RAG chatbot running locally with an Express server, there was a problem though — it only worked on my machine. The portfolio is a static site hosted on GitHub Pages, so there's nowhere to run a backend.

I asked Claude Code how to fix this and it gave me three options:

- Cloudflare Workers (serverless, runs at the edge)
- Vercel or Netlify (move the whole site)
- Call the API directly from the browser (bad idea, exposes the API key)

I went with Cloudflare Workers. using the 'Free tier', no need to move the site, and the API key stays secure on the server side, and doesn't get exposed.

## What changed

The Express server (`rag/server.js`) got replaced by a Cloudflare Worker (`worker/index.js`). The logic is basically the same — take a message, load the docs, call Claude, stream the response back. The difference is it runs on Cloudflare's edge instead of my computer.

For the RAG documents, Workers don't have a filesystem, so I asked Claude to help with a script that reads everything from `rag/docs/` and bundles it into a `docs.json` file before deploying. That JSON gets baked into the worker.

## GitHub Actions

The deploy is fully automated. On every push to `main`:

- Hugo builds the static site → deploys to GitHub Pages
- The docs script runs → worker deploys to Cloudflare

Two jobs running in parallel, two secrets needed: `CLOUDFLARE_API_TOKEN` and `ANTHROPIC_API_KEY`.

## Problems I ran into

Getting the Cloudflare API token right took a few tries. The first token had no permission policies attached, so it failed with a 400 auth error. The fix was using the **Edit Cloudflare Workers** template when creating the token — that fixed it.

The workers.dev subdomain also needed to be registered manually before the first deploy would succeed. This also took a few tries with a lot of errors.

Finally, the Anthropic API key I had saved didn't have any credits attached to it, even though i had bought $5 worth of credits, but since i generated the key before adding it, i had to generate another one.

## End result

The chat widget sits in the bottom-right corner on every page. Drop a `.md` or `.txt` file into `rag/docs/`, push, and the worker rebuilds with that context automatically.
