---
title: UI Polish and Language Filtering
date: 2026-03-13
excerpt: Cleaned up sidebar layout jank, aligned content panels, and added multi-language filtering to the repositories page.
tags: [vue, css, ux]
author: nogoth
---

The sidebar needed work. The three navigation buttons were crammed horizontally into a 280px column, occasionally bleeding past the divider line into the main content panel. We stacked them vertically so they breathe. The article list buttons were pinned to the left edge of the sidebar—we centered them so they float naturally in the space. We also fixed a layout shift where clicking into the Articles section caused content to jump rightward compared to Repositories and Resume. The culprit was `margin: 0 auto` centering the article container while the other pages left-aligned theirs. One line removed, everything lines up.

The bigger feature was bringing language filtering to the Repositories page, modeled after the existing tag filtering on articles. Language tags on each repo card are now clickable buttons. Click one and the list filters to only repos that use that language. Click a second language and the filter narrows further—it's AND-based, so a repo must use all selected languages to stay visible. Each active filter gets its own dismissible badge above the list, and a "Clear all" button appears when multiple languages are selected. The interaction is toggle-based: click a language to add it, click again to remove it. Simple, consistent with how article tags already work, and zero new dependencies.
