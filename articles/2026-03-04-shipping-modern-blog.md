---
title: Shipping a Modern Blog: Bug Fixes and Tag Filtering
date: 2026-03-04
excerpt: Fixed build issues, optimized the tech stack, redesigned the layout, and shipped tag-based filtering in one session.
tags: [vue, blog, optimization]
author: nogoth
---

# Shipping a Modern Blog: Bug Fixes and Tag Filtering

## What We Found

The blog wasn't building. Vite 7.3.1 was calling a non-existent crypto.hash() function. We downgraded to 7.3.0 and fixed it. But that revealed bigger problems.

Articles weren't loading because the glob pattern was pointing to the wrong path, and the browser-side code was trying to use Node.js libraries (gray-matter and sanitize-html). These dependencies were bloating the bundle without providing real value.

## What We Built

We removed gray-matter and sanitize-html. In their place, we wrote a 50-line YAML parser that works in the browser. The bundle shrank from 196KB to 10.56KB and build time dropped from 10 seconds to 6.

We restructured the interface: articles list moved to a sidebar that stays visible while reading. Clicking an article now updates the view without navigation, keeping the user in context.

We cleaned up the header (removed the dead Twitter link) and documented the article format so anyone can add new content without guessing.

## The Feature: Tag Filtering

Tags became clickable. Click one and the sidebar filters to show only articles with that tag. Click it again or hit the close button to clear the filter. The search input clears automatically when you select a tag to avoid confusion. Both search and tag filters work together—articles must match both conditions.

Implementation took 30 minutes. The code is straightforward: tags are buttons that emit a `select-tag` event to the parent component, which updates the filter state and re-runs the computed property.

## Results

- ✅ Build time: 40% faster
- ✅ Bundle size: 95% smaller  
- ✅ UX: Cleaner, faster navigation
- ✅ Code: Simpler, fewer dependencies
- ✅ Documentation: Complete article format spec created

The blog now loads quickly, articles are easy to find, and the interface is intuitive. No complexity, no dead code, no unnecessary libraries.
