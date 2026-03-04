# Nogoth Blog 2.0

A modern, minimalist blog built with Vue.js 3, styled with the Geminon spaceman color aesthetic.

**Live**: https://nogoth.github.com/  
**Source**: https://github.com/nogoth/nogoth.github.com/  

---

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/nogoth/nogoth.github.com.git
cd nogoth.github.com

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The dev server opens at `http://localhost:5173/`

---

## Architecture

### Tech Stack

- **Vue.js 3**: Modern frontend framework with Composition API
- **Vue Router 4**: Client-side routing
- **Vite**: Lightning-fast build tool
- **marked.js**: Markdown to HTML conversion
- **gray-matter**: YAML frontmatter parsing
- **sanitize-html**: XSS prevention

### Directory Structure

```
nogoth.github.com/
├── src/
│   ├── components/        # Vue components
│   │   ├── Header.vue
│   │   ├── Footer.vue
│   │   ├── ArticleList.vue
│   │   └── ArticleDetail.vue
│   ├── pages/            # Page components
│   │   ├── Home.vue
│   │   ├── Article.vue
│   │   └── NotFound.vue
│   ├── App.vue           # Root component
│   ├── main.ts           # Entry point
│   ├── router.ts         # Route configuration
│   ├── utils.ts          # Article loading utilities
│   ├── spaceman.css      # Geminon theme stylesheet
│   └── index.css         # Base styles (deprecated)
│
├── articles/             # Blog post markdown files
│   ├── 2009-05-17-this-is-a-test.md
│   ├── 2009-05-18-yaml-syck.md
│   └── 2009-05-17-future-work.md
│
├── public/               # Static assets
├── dist/                 # Build output (generated)
├── index.html            # HTML template
├── package.json          # Dependencies
├── vite.config.ts        # Vite configuration
├── tsconfig.json         # TypeScript configuration
└── README.md             # This file
```

---

## Writing Articles

Articles are Markdown files in the `articles/` directory with YAML frontmatter.

### Article Format

```markdown
---
title: Article Title
date: 2026-03-04
excerpt: Brief description shown in article list
tags: [tag1, tag2, tag3]
author: nogoth
---

# Article Body

Article content in Markdown format...

## Subheading

More content with **bold**, *italic*, and `code`.
```

### Required Fields

- **title**: Article title (string)
- **date**: Publication date (YYYY-MM-DD format)
- **excerpt**: Short description (50-200 characters recommended)

### Optional Fields

- **tags**: Array of topic tags
- **author**: Author name (defaults to "nogoth")

### Markdown Features Supported

- Headings (h1-h6)
- Paragraphs
- Bold, italic, underline
- Lists (ordered and unordered)
- Code blocks (with syntax highlighting)
- Inline code
- Links
- Blockquotes
- Images
- Tables
- Horizontal rules

---

## Deployment

### GitHub Pages

The blog is automatically deployed to GitHub Pages via GitHub Actions.

**Workflow**: `.github/workflows/deploy.yml`

When you push to the `main` branch:
1. GitHub Actions runs the build workflow
2. `npm install && npm run build` creates the `dist/` folder
3. Built files are deployed to GitHub Pages
4. Site is live at `https://nogoth.github.com/`

### Manual Deployment

```bash
# Build for production
npm run build

# Test production build locally
npm run preview

# Push to GitHub (triggers automatic deployment)
git push origin main
```

---

## Styling

### Color Scheme (Geminon Spaceman)

The blog uses the retro 80s-inspired Geminon color palette:

```css
--spaceman-primary:   #4B5320  (Olive Green)
--spaceman-surface:   #C2B280  (Tan/Beige)
--spaceman-action:    #B7410E  (Rust Orange)
--spaceman-variation: #ACE1AF  (Mint Green)
--spaceman-dark:      #1A1C0B  (Nearly Black)
```

### Customizing Styles

Edit `src/spaceman.css` to modify the theme. All colors use CSS variables for easy updates.

---

## Development

### Development Commands

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### File Changes and Hot Reload

- **Components**: Hot reload when you save
- **Styles**: Hot reload immediately
- **Articles**: Requires browser refresh (reloading from disk)

---

## Performance

### Bundle Size

- Vue.js + Vue Router: ~35KB (gzipped)
- marked.js + gray-matter: ~25KB (gzipped)
- App code: ~10KB (gzipped)
- **Total**: ~70KB (gzipped)

### Optimization

- Vite code-splitting separates vendor dependencies
- CSS is included inline in HTML
- No build-time rendering (client-side rendering)
- Minimal dependencies

---

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Chrome Mobile)

---

## SEO

### Metadata

The app includes:
- Dynamic page titles in `<head>`
- Open Graph meta tags
- Mobile viewport meta tag

### Sitemap & RSS

Coming in v2.0:
- Dynamic sitemap.xml generation
- RSS feed for article subscriptions

---

## Contributing

### Adding Articles

1. Create a new `.md` file in `articles/` with format: `YYYY-MM-DD-title.md`
2. Add YAML frontmatter with required fields
3. Write article in Markdown
4. Commit and push to trigger automatic deployment

```bash
git add articles/2026-03-04-new-article.md
git commit -m "content: add new article title"
git push origin main
```

### Bug Reports & Suggestions

- Open issues on GitHub
- Include reproduction steps
- Attach screenshots if applicable

---

## License

Copyright © 2009-2026 Nogoth. All rights reserved.

---

## Thanks

- [Vue.js](https://vuejs.org) - Reactive JavaScript framework
- [Vite](https://vitejs.dev) - Next generation build tool
- [marked.js](https://marked.js.org) - Markdown parser
- [Geminon](https://nogoth.github.io/geminon/) - Spaceman color inspiration

---

**Updated**: March 4, 2026  
**Status**: Active Development
