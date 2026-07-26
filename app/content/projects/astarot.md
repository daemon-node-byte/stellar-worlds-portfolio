---
index: "01"
title: "Astarot"
year: "2026"
type: "Full-stack web application"
excerpt: "A tarot and astrology product that joins a cinematic interface to a practical authentication, content, and persistence architecture."
role: "Product engineer"
status: "Active development"
orbit: "Khepri I"
theme: "violet"
tags:
  - "Next.js"
  - "Python"
  - "Supabase"
liveUrl: "https://crispy-happiness-gilt.vercel.app"
sourceUrl: "https://github.com/daemon-node-byte/crispy-happiness"
---

## Mission

Astarot explores how tarot and astrology can become an approachable digital product rather than a static collection of reference pages. The experience needs to carry atmosphere while still supporting familiar product flows such as accounts, profiles, searchable content, and protected areas.

The project is structured as a roadmap-driven product. Its foundation and tarot gallery are in place, while readings and daily-card experiences form the next major orbit.

## System architecture

The application is a hybrid monorepo. A Next.js App Router frontend owns the interactive product surface, while a Flask API provides server-side behavior through stable `/api` paths. Supabase supports authentication and persistence.

Tarot content is stored as structured YAML and paired with Rider-Waite-Smith imagery. Keeping that content separate from the interface makes the catalog easier to validate, search, and extend without burying domain data inside components.

## Product surface

The current build includes:

- Signup, login, logout, session handling, and profile updates
- A searchable and filterable tarot-card catalog
- Individual card detail views
- A protected dashboard foundation
- Telemetry endpoints for observing important product events

## Engineering decisions

The central architectural decision is preserving a clear boundary between the frontend product and the Python service layer. Local development uses rewrites so both systems feel like one application, while production keeps the same API contract through serverless handlers.

That separation allows the interface and domain services to evolve independently without exposing deployment details to the rest of the product.

## Next orbit

The next phase moves from browsing tarot content into performing readings. That includes reading types, persistence schemas, API contracts, client state, interface choreography, and tests—built in that order so the cinematic experience rests on dependable product behavior.
