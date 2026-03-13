---
title: Visual Fixes with Playwright Screenshots
date: 2026-03-13
time: 13:29
excerpt: Used npx and playwright-cli to catch and fix stretched mobile buttons and leftover debug labels, verifying each change with real browser screenshots.
tags: [css, playwright, mobile, ux]
author: nogoth
---

The mobile nav buttons were stretching edge-to-edge because the spaceman.css theme forces `.nav` and `.nav a` to `width: 100%` on small screens. That made Home and Email look like embedded bars instead of discrete buttons. A scoped override in Header.vue set both to `width: auto`, and we confirmed the fix by resizing a playwright-cli browser to 375×812 and screenshotting it—buttons now size to their content with visible header background around them. The whole cycle was: make the CSS change, run `npx @playwright/cli screenshot`, look at the actual pixels. No guessing.

The second fix was subtler. The `::before` pseudo-elements on `.articles-container` and `.article-container` were rendering hardcoded debug labels—"REGISTRY: NOGOTH-BLOG-2026" and "ARTICLE VIEW: WADA-MOD-2026"—text that was never meant for visitors. A playwright snapshot made the extraneous strings obvious, sitting right above the content areas. The fix was two lines: swap the label strings for empty `content: ''` values, keeping the decorative header bars intact while removing the debug noise. We captured the npx gotchas we hit along the way—correct package is `@playwright/cli` not `playwright-cli`, Firefox is required, `eval "window.scrollTo()"` beats flaky mousewheel commands—in an AGENT.md so future work doesn't repeat the same mistakes.
