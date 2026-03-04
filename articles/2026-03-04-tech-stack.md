---
title: The Nogoth Blog Tech Stack
date: 2026-03-04
excerpt: A lean, modern stack built for speed and simplicity. Vue 3, Vite, and browser-native rendering.
tags: [vue, javascript, architecture]
author: nogoth
---

The blog is built on a simple, modern stack designed for speed and maintainability.

## Frontend Framework

**Vue 3** with Composition API and TypeScript. The entire application is a single-page app (SPA) that renders client-side. No build-time rendering, no complex pipelines. Articles load at runtime and the browser renders them.

## Build Tooling

**Vite** handles bundling and development. It's fast—the dev server starts in under a second and builds complete in 6 seconds. No unnecessary complexity or plugins.

## Article Rendering

**marked.js** parses Markdown to HTML. We wrote a custom YAML parser (50 lines) in the browser to handle article frontmatter instead of using Node.js dependencies. The result is a 10.56KB main bundle.

## Routing

Vue Router handles navigation between pages. All routing happens client-side—the browser manages state without server interaction.

## Styling

The Geminon Spaceman theme provides the retro sci-fi aesthetic. CSS is scoped to components with a global stylesheet for typography and layout.

## Deployment

The site deploys to GitHub Pages. The entire build is static—just HTML, CSS, and JavaScript. No server required.

---

For more details, see:

- [Modernization approach](https://github.com/nogoth/nogoth.github.com/blob/main/docs/discovery/NOGOTH_SIMPLE_VUE_APPROACH.md) – Technical architecture and design decisions
- [Contribution guide](https://github.com/nogoth/nogoth.github.com/blob/main/CONTRIBUTING.md) – How to write articles and contribute
