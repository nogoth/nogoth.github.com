# Contributing to Nogoth Blog

Thanks for your interest in contributing! This guide explains how to add articles and contribute improvements.

---

## Writing Articles

### Quick Start: Add an Article in 5 Minutes

```bash
# 1. Create a new markdown file
cat > articles/2026-03-04-my-article.md << 'EOF'
---
title: My Awesome Article
date: 2026-03-04
excerpt: A brief description of the article.
tags: [tag1, tag2]
author: nogoth
---

# Your Article Title

Your article content goes here in Markdown format...
EOF

# 2. Test locally
npm run dev

# 3. Commit and push
git add articles/2026-03-04-my-article.md
git commit -m "content: add new article - My Awesome Article"
git push origin main

# 4. Done! The article appears on the blog automatically
```

### Article File Naming

Use this format: `YYYY-MM-DD-title-slug.md`

Examples:
- `2026-03-04-react-performance-tips.md`
- `2026-03-01-vue-composition-api.md`
- `2009-05-17-test-post.md`

### Article Frontmatter

Required fields in the YAML frontmatter (at the top of the file):

```yaml
---
title: Article Title
date: 2026-03-04
excerpt: A short description (50-200 characters)
tags: [tag1, tag2, tag3]
author: nogoth
---
```

**Field Descriptions**:

| Field | Required | Type | Example |
|-------|----------|------|---------|
| title | Yes | string | "Getting Started with Vue" |
| date | Yes | YYYY-MM-DD | "2026-03-04" |
| excerpt | Yes | string | "Learn the basics of Vue.js" |
| tags | No | array | `[vue, javascript, tutorial]` |
| author | No | string | "nogoth" |

### Markdown Syntax

The blog supports standard Markdown:

```markdown
# Heading 1
## Heading 2
### Heading 3

**Bold text**
*Italic text*
~~Strikethrough~~

- Bullet point
- Another point
  - Nested point

1. Numbered item
2. Another item

[Link text](https://example.com)

![Image alt text](https://example.com/image.png)

> Blockquote
> Multiple lines

`inline code`

\`\`\`javascript
// Code block
const greeting = "Hello, world!";
console.log(greeting);
\`\`\`

| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |

---

Horizontal rule above
```

### Example Article

```markdown
---
title: Understanding Vue.js Composition API
date: 2026-03-04
excerpt: A deep dive into Vue 3's Composition API and how to use it effectively
tags: [vue, javascript, composition-api, tutorial]
author: nogoth
---

# Understanding Vue.js Composition API

The Composition API is a new way to organize code in Vue 3...

## Benefits

- **Better code reusability**: Share logic between components
- **Cleaner component code**: Related logic grouped together
- **Better TypeScript support**: Explicit type definitions

## Example: Counter Component

\`\`\`vue
<template>
  <button @click="increment">Count: {{ count }}</button>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)

function increment() {
  count.value++
}
</script>
\`\`\`

## Getting Started

Learn more at [Vue.js Composition API docs](https://vuejs.org/guide/extras/composition-api-faq.html).
```

---

## Development Setup

### Prerequisites

- Node.js 18+
- Git

### Local Development

```bash
# Clone the repository
git clone https://github.com/nogoth/nogoth.github.com.git
cd nogoth.github.com

# Install dependencies
npm install

# Start development server
npm run dev

# Site opens at http://localhost:5173
```

### Making Changes

1. Create a feature branch: `git checkout -b feat/my-feature`
2. Make your changes
3. Test locally: `npm run dev`
4. Commit with a clear message
5. Push to GitHub: `git push origin feat/my-feature`
6. Open a Pull Request on GitHub

### Building for Production

```bash
# Build the site
npm run build

# Test the production build
npm run preview

# Output is in dist/ folder
```

---

## Git Workflow

### Commit Messages

Use clear, descriptive commit messages:

**Format**:
```
<type>: <subject>

<body>
```

**Types**:
- `feat`: New feature or content
- `fix`: Bug fix
- `style`: Styling or CSS changes
- `docs`: Documentation changes
- `refactor`: Code restructuring
- `perf`: Performance improvements
- `test`: Test additions
- `ci`: CI/CD changes

**Examples**:

```bash
# Adding an article
git commit -m "content: add article on Vue performance optimization

Covers key techniques for optimizing Vue.js applications:
- Template compilation strategies
- Component optimization
- Bundle size reduction"

# Fixing styles
git commit -m "style: fix code block styling

Code blocks now properly display with Geminon colors and proper line wrapping"

# Adding a feature
git commit -m "feat: add article search functionality

Implements client-side article search across titles and excerpts.
Real-time filtering as user types."
```

---

## Code Style

### Vue Components

```vue
<template>
  <!-- Template -->
</template>

<script setup lang="ts">
// Use Composition API
// Use TypeScript for type safety
</script>

<style scoped>
/* Component styles */
</style>
```

### TypeScript

- Use strict mode (already enabled)
- Define interfaces for data structures
- Use type annotations for functions

```typescript
// Good
interface Article {
  slug: string
  title: string
  date: Date
  excerpt: string
}

export async function loadArticles(): Promise<Article[]> {
  // ...
}

// Avoid
const loadArticles = async () => {
  // ...
}
```

---

## Testing Your Article

1. **Start dev server**:
   ```bash
   npm run dev
   ```

2. **Visit http://localhost:5173**

3. **Check the article appears** in the article list

4. **Click to view** the full article

5. **Verify formatting**:
   - Headings display correctly
   - Code blocks look good
   - Links work
   - Images display (if included)

---

## Common Issues

### Article Doesn't Appear

**Problem**: New article file not showing on the blog

**Solutions**:
1. Check file naming: `YYYY-MM-DD-slug.md` format
2. Verify YAML frontmatter is valid (check indentation)
3. Restart dev server: `npm run dev`
4. Check browser console for errors (F12)

### Markdown Not Rendering

**Problem**: Markdown formatting looks broken

**Solutions**:
1. Check Markdown syntax is correct
2. Ensure proper spacing around headings
3. Use triple backticks for code blocks: ` ``` `
4. Check for HTML escaping issues

### Build Fails

**Problem**: `npm run build` fails locally

**Solutions**:
1. Clear node_modules: `rm -rf node_modules && npm install`
2. Check Node.js version: `node --version` (should be 18+)
3. Check for file encoding issues (save as UTF-8)
4. Check for missing dependencies in package.json

---

## Reporting Issues

Found a bug or have a suggestion?

1. Check existing [GitHub Issues](https://github.com/nogoth/nogoth.github.com/issues)
2. Open a new issue with:
   - Clear title
   - Reproduction steps
   - Expected vs actual behavior
   - Screenshots (if applicable)

---

## Pull Request Process

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Commit with clear messages
5. Push to your fork
6. Open a Pull Request with:
   - Clear description of changes
   - Reference any related issues
   - Screenshots (for styling changes)

GitHub Actions will automatically:
- Run linting
- Build the site
- Deploy a preview (when merged)

---

## Questions?

- Check the [README](./README.md) for project overview
- Review [Discovery Docs](./docs/discovery/) for architecture
- Open a GitHub Discussion

---

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

**Happy contributing!** 🎉
