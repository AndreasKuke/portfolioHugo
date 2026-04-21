---
title: "RAG chatbot and how i went about the task"
date: 2026-04-16
draft: false
summary: "Blog post about how i decided to make my RAG chatbot"
tags:
  - ai
  - rag
  - chatbot
  - project-log
---


We were told to use dify.ai to publish a RAG chatbot, however i had hit a limit of token usage 200/200, and decided i didn't want to pay for more. 
So here is what i did.

I prompted and asked chatGPT to find other websites most similar to dify.ai

The two it came up with, that had most similarities were:
- Flowise AI
- Stack AI

These two were very similar in usage. The workflow is like a blueprint, kind of Unreal Engine or Unity, if you have ever tried that out.

Step-by-step:
- Choose template for RAG
- Upload Documents to Storage
- Limit so it doesnt leak source 'citations'
- Publish and get HTML snippet to paste into source
