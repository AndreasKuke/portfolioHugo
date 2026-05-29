---
title: "EG Booking System – Part 1: Switching to Next.js"
date: 2026-05-29
draft: false
summary: "Why we moved the EG booking system frontend from plain React to Next.js — and what that change brings to the project."
tags:
  - project-log
  - frontend
  - e.g
---

## Where we started

The first version of the frontend was built with plain React 18. It worked fine — components for the booking grid, admin panel, and auth — but it was a bare-bones setup with no routing library, no server-side rendering, and manual wiring for most things.

## Why switch to Next.js

As the project grew it became clear that plain React was going to create friction. Routing, performance, and structure were all things we'd have to solve ourselves. Next.js handles all of that out of the box.

The main reasons for switching:

- **File-based routing** — pages are just files in the `app/` folder, no router config needed
- **Server-side rendering** — pages can render on the server, which is better for performance and SEO
- **Built-in font and image optimization** — small things that matter when shipping something real
- **Better project structure** — separating pages, components, and context becomes natural with the Next.js conventions

## What changed

The new frontend lives in `frontend-next/` alongside the original. The structure follows the Next.js App Router pattern:

```
app/         – pages and routing
components/  – reusable UI components
context/     – React context for state management
public/      – static assets
```

The booking grid, admin panel, and auth flow are all being rebuilt inside this structure. The backend stays the same — Express + PostgreSQL — so only the frontend layer changed.

## Source code

[EG-Booking-Project on GitHub](https://github.com/AndreasKuke/EG-Booking-Project)

---

*Part 2 covers the planned AI-generated email notification system.*
