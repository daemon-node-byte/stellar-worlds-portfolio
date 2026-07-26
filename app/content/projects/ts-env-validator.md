---
index: "03"
title: "TS Env Validator"
year: "2026"
type: "Open-source utility"
excerpt: "A small runtime validation layer that turns string-based environment configuration into typed, constrained application values."
role: "Author / maintainer"
status: "Open source"
orbit: "Khepri III"
theme: "amber"
tags:
  - "TypeScript"
  - "Node.js"
  - "Developer experience"
sourceUrl: "https://github.com/daemon-node-byte/ts-env-validator"
---

## Mission

Environment variables enter an application as strings, but the application usually expects numbers, booleans, enums, URLs, arrays, or structured JSON. When that mismatch is left implicit, configuration errors surface late and far away from their cause.

TS Env Validator moves that failure to startup. One schema validates runtime input, coerces useful values, and produces TypeScript inference for the resulting environment object.

## API design

The public API is intentionally small. `createEnv` accepts a schema made from composable validators, then returns an object whose types follow directly from that schema.

Built-in validators cover strings, numbers, integers, floats, booleans, enums, URLs, JSON, and delimited arrays. Custom validators use the same result contract, so project-specific configuration can participate without creating a second validation path.

## Constraint system

Validators support optional values, defaults, descriptions, ranges, string lengths, and regular-expression constraints. Constraint modifiers are immutable, which keeps shared validator definitions safe to reuse across schemas.

Defaults are validated when a schema is created. A configuration error in the fallback value therefore fails during development instead of silently becoming a production default.

## Error experience

Validation collects every missing and invalid variable before throwing a single structured error. Developers see the full configuration problem in one pass, including descriptions that explain what a variable is expected to represent.

The same schema can read from `process.env` or a supplied object, making it practical for Node applications, Next.js projects, tests, scripts, and edge-style runtimes.

## Release discipline

The repository includes Node and Next.js examples, automated tests, linting, type checks, and a package build. Version tags drive the publishing workflow, keeping the released package tied to a reviewed repository state.
