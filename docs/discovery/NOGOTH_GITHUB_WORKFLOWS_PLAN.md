# Nogoth GitHub Workflows & Vue.js Modernization Plan

**Date**: March 4, 2026  
**Status**: Proposal  
**Target**: Modernize legacy Jekyll blog with GitHub Workflows, Vue.js frontend, and automated article publishing

---

## Executive Summary

The `nogoth.github.com` repository is a legacy Jekyll-based static site from 2009 with minimal styling and manual publishing workflows. This plan proposes a modern transformation:

- **Frontend**: Migrate from HTML/Liquid templates to Vue.js 3 SPA
- **Build Pipeline**: Implement GitHub Workflows for automated builds and deployment
- **Content**: Add automated article publishing with metadata validation
- **Architecture**: Decouple frontend (Vue) from content (JSON/Markdown)
- **Deployment**: Auto-deploy to GitHub Pages on article additions/updates

---

## Part 1: Current State Analysis

### Repository Structure

```
nogoth.github.com/
├── _config.yml              # Jekyll configuration (permalink: date)
├── _layouts/
│   ├── default.html        # Base layout with header/footer
│   └── post.html          # Post wrapper (minimal)
├── _posts/                 # Article storage
│   ├── 2009-05-17-this-is-a-test.textile
│   ├── 2009-05-17-future-work.textile
│   └── 2009-05-18-yaml-syck.textile
├── index.html             # Homepage (Liquid template)
├── css/
│   └── default.css        # Minimal styling
├── .gitignore
└── README                 # Empty

```

### Current Technologies & Limitations

| Aspect | Current | Issues |
|--------|---------|--------|
| **Generator** | Jekyll (Ruby) | No dependencies declared, manual setup |
| **Template Engine** | Liquid + HTML | Limited functionality, hard to maintain |
| **Article Format** | Textile (.textile) | Outdated; modern blogs use Markdown |
| **Styling** | Plain CSS (375 bytes) | Minimal, no responsive design |
| **Build Process** | Manual (or GitHub Pages auto) | No explicit CI/CD, no validation |
| **Publishing** | Manual git commit | No automation, error-prone |
| **Version** | ~2009 era | No package.json, no version control for deps |

### Articles Current State

- **Count**: 3 posts (2009)
- **Format**: Textile markup
- **Metadata**: YAML front matter (layout, title)
- **Content**: Minimal (160-370 bytes each)

### Key Findings

1. **No build pipeline**: Jekyll runs implicitly via GitHub Pages
2. **No validation**: No checks on article format or metadata
3. **Manual publishing**: Every article requires manual git workflow
4. **No modern tooling**: Zero npm/package management
5. **Outdated content format**: Textile instead of Markdown
6. **Basic styling**: No responsive design or component system
7. **No API layer**: Content hardcoded in templates

---

## Part 2: Proposed GitHub Workflows Architecture

### Overview Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                     Article Workflow                          │
│  Author writes .md file → Push → Workflow validates → Deploy │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                    Build & Deploy                             │
│  Markdown → Content API (JSON) → Build Vue.js → Push to GH   │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                   Runtime Stack                               │
│  Vue.js 3 SPA + Vue Router → Fetch articles from API → SSG   │
└──────────────────────────────────────────────────────────────┘
```

### Workflow Files

#### 1. `publish-article.yml` - Article Validation & Deploy

**Trigger**: Push to `main` branch or pull request  
**Purpose**: Validate new/updated articles and trigger build

```yaml
name: Publish Article
on:
  push:
    branches: [main]
    paths: ['articles/**/*.md', 'workflow/**/*']
  pull_request:
    branches: [main]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Validate Articles
        run: npm run validate:articles
      - name: Check Frontmatter
        run: npm run validate:frontmatter
      - name: Build Article Index
        run: npm run build:index

  build-and-deploy:
    needs: validate
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install Dependencies
        run: npm ci
      - name: Build Vue.js Frontend
        run: npm run build
      - name: Generate Article JSON API
        run: npm run generate:api
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
          cname: nogoth.github.com
```

#### 2. `validate-article.yml` - PR Validation

**Trigger**: Pull Request with article changes  
**Purpose**: Lint, spell-check, and validate before merge

```yaml
name: Validate Article
on:
  pull_request:
    branches: [main]
    paths: ['articles/**']

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node
        uses: actions/setup-node@v3
      - name: Lint Markdown
        run: npm run lint:markdown
      - name: Check spelling
        run: npm run check:spelling
      - name: Validate Metadata
        run: npm run validate:metadata
```

#### 3. `build-preview.yml` - Preview Generation

**Trigger**: Pull Request  
**Purpose**: Build static preview and comment on PR

```yaml
name: Build Preview
on:
  pull_request:
    branches: [main]

jobs:
  preview:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Build Preview
        run: npm run build:preview
      - name: Upload Artifact
        uses: actions/upload-artifact@v3
        with:
          name: preview
          path: dist-preview/
      - name: Comment on PR
        uses: actions/github-script@v6
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: '✅ Preview built! [View Preview](https://github.com/${{ github.repository }}/actions/runs/${{ github.run_id }})'
            })
```

#### 4. `seo-optimize.yml` - SEO & Meta Generation

**Trigger**: After build  
**Purpose**: Generate Open Graph tags, sitemaps, RSS feeds

```yaml
name: SEO Optimization
on:
  workflow_run:
    workflows: ['Publish Article']
    types: [completed]

jobs:
  seo:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Generate Sitemap
        run: npm run generate:sitemap
      - name: Generate RSS Feed
        run: npm run generate:rss
      - name: Generate OG Tags
        run: npm run generate:og-tags
      - name: Commit SEO Files
        run: |
          git config user.email "action@github.com"
          git config user.name "GitHub Action"
          git add sitemap.xml rss.xml
          git commit -m "chore: update SEO files" || true
          git push
```

---

## Part 3: Vue.js Frontend Integration Strategy

### New Project Structure

```
nogoth.github.com/
├── .github/workflows/          # GitHub Actions workflows
│   ├── publish-article.yml
│   ├── validate-article.yml
│   ├── build-preview.yml
│   └── seo-optimize.yml
│
├── articles/                   # Article source (Markdown)
│   ├── 2009-05-17-test.md     # Converted from textile
│   ├── 2009-05-18-yaml.md
│   └── metadata.yml           # Article index
│
├── src/                        # Vue.js source
│   ├── components/
│   │   ├── ArticleList.vue
│   │   ├── ArticleDetail.vue
│   │   ├── Header.vue
│   │   ├── Footer.vue
│   │   └── ContactCard.vue
│   ├── pages/
│   │   ├── Home.vue
│   │   ├── Article.vue
│   │   └── NotFound.vue
│   ├── router/
│   │   └── index.ts           # Vue Router config
│   ├── services/
│   │   ├── articleService.ts  # Fetch articles from API
│   │   └── contentParser.ts   # Parse article JSON
│   ├── styles/
│   │   ├── global.css
│   │   └── variables.css      # Design tokens
│   ├── utils/
│   │   ├── dateFormatter.ts
│   │   ├── markdown.ts        # Markdown to HTML
│   │   └── seo.ts             # SEO helpers
│   ├── App.vue
│   └── main.ts
│
├── scripts/                    # Build automation
│   ├── validate-articles.js   # Check article format
│   ├── build-index.js         # Generate articles.json
│   ├── generate-api.js        # Create JSON API
│   ├── convert-textile.js     # Textile → Markdown
│   └── seo-gen.js             # Generate meta files
│
├── public/                     # Static assets
│   ├── favicon.ico
│   ├── sitemap.xml            # (Generated)
│   └── rss.xml                # (Generated)
│
├── dist/                       # Build output (GitHub Pages)
│   ├── index.html
│   ├── articles.json          # JSON API of all articles
│   └── js/, css/              # Built assets
│
├── package.json
├── vite.config.ts             # Vite bundler config
├── tsconfig.json              # TypeScript config
├── .gitignore
└── README.md
```

### Vue.js Component Architecture

#### ArticleList.vue - Homepage

```vue
<template>
  <div class="articles-container">
    <h2>Blog Articles</h2>
    <div class="filters">
      <input v-model="search" placeholder="Search articles...">
      <select v-model="sortBy">
        <option value="date-desc">Newest First</option>
        <option value="date-asc">Oldest First</option>
        <option value="title">Title A-Z</option>
      </select>
    </div>
    
    <div class="articles-grid">
      <article v-for="article in filteredArticles" :key="article.id" class="article-card">
        <h3><router-link :to="`/article/${article.slug}`">{{ article.title }}</router-link></h3>
        <p class="meta">{{ formatDate(article.date) }} • {{ article.readTime }} min read</p>
        <p class="excerpt">{{ article.excerpt }}</p>
        <router-link :to="`/article/${article.slug}`" class="read-more">Read More →</router-link>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { articleService } from '@/services/articleService'
import { formatDate } from '@/utils/dateFormatter'

interface Article {
  id: string
  slug: string
  title: string
  date: Date
  excerpt: string
  readTime: number
}

const articles = ref<Article[]>([])
const search = ref('')
const sortBy = ref('date-desc')

onMounted(async () => {
  articles.value = await articleService.getAll()
})

const filteredArticles = computed(() => {
  let filtered = articles.value.filter(a => 
    a.title.toLowerCase().includes(search.value.toLowerCase())
  )
  
  if (sortBy.value === 'date-desc') {
    filtered.sort((a, b) => b.date.getTime() - a.date.getTime())
  } else if (sortBy.value === 'date-asc') {
    filtered.sort((a, b) => a.date.getTime() - b.date.getTime())
  } else if (sortBy.value === 'title') {
    filtered.sort((a, b) => a.title.localeCompare(b.title))
  }
  
  return filtered
})
</script>

<style scoped>
.articles-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
}

.filters {
  display: flex;
  gap: 1rem;
  margin: 2rem 0;
}

.articles-grid {
  display: grid;
  gap: 2rem;
}

.article-card {
  border-left: 4px solid #007bff;
  padding-left: 1.5rem;
  padding: 1.5rem;
  background: #f9f9f9;
  border-radius: 4px;
  transition: transform 0.2s;
}

.article-card:hover {
  transform: translateX(8px);
}

.meta {
  font-size: 0.9rem;
  color: #666;
  margin: 0.5rem 0;
}

.read-more {
  color: #007bff;
  text-decoration: none;
  font-weight: bold;
}
</style>
```

#### ArticleDetail.vue - Single Article View

```vue
<template>
  <div class="article-container" v-if="article">
    <header class="article-header">
      <h1>{{ article.title }}</h1>
      <p class="meta">
        Published {{ formatDate(article.date) }} • {{ article.readTime }} min read
      </p>
      <div class="tags" v-if="article.tags">
        <span v-for="tag in article.tags" :key="tag" class="tag">{{ tag }}</span>
      </div>
    </header>

    <article class="article-content" v-html="article.htmlContent"></article>

    <footer class="article-footer">
      <div class="navigation">
        <router-link v-if="prevArticle" :to="`/article/${prevArticle.slug}`" class="nav-link prev">
          ← {{ prevArticle.title }}
        </router-link>
        <router-link to="/" class="nav-link back">Back to Articles</router-link>
        <router-link v-if="nextArticle" :to="`/article/${nextArticle.slug}`" class="nav-link next">
          {{ nextArticle.title }} →
        </router-link>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { articleService } from '@/services/articleService'

const route = useRoute()
const article = ref(null)
const articles = ref([])

onMounted(async () => {
  const slug = route.params.slug as string
  article.value = await articleService.getBySlug(slug)
  articles.value = await articleService.getAll()
})

const currentIndex = computed(() => {
  return articles.value.findIndex(a => a.slug === article.value?.slug)
})

const prevArticle = computed(() => {
  return currentIndex.value > 0 ? articles.value[currentIndex.value - 1] : null
})

const nextArticle = computed(() => {
  return currentIndex.value < articles.value.length - 1 ? articles.value[currentIndex.value + 1] : null
})
</script>

<style scoped>
.article-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
}

.article-header {
  margin-bottom: 3rem;
  border-bottom: 2px solid #eee;
  padding-bottom: 2rem;
}

.article-header h1 {
  margin: 0 0 1rem 0;
  font-size: 2.5rem;
}

.meta {
  color: #666;
  font-size: 0.95rem;
}

.tags {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.tag {
  background: #f0f0f0;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
}

.article-content {
  line-height: 1.8;
  font-size: 1.1rem;
  margin-bottom: 3rem;
}

.article-content :deep(h2) {
  margin-top: 2rem;
  margin-bottom: 1rem;
  font-size: 1.8rem;
}

.article-content :deep(code) {
  background: #f5f5f5;
  padding: 0.2rem 0.5rem;
  border-radius: 3px;
  font-family: 'Courier New', monospace;
}

.article-content :deep(pre) {
  background: #f5f5f5;
  padding: 1rem;
  border-radius: 5px;
  overflow-x: auto;
}

.navigation {
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  padding: 2rem 0;
  border-top: 2px solid #eee;
}

.nav-link {
  color: #007bff;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background 0.2s;
}

.nav-link:hover {
  background: #f0f0f0;
}

.back {
  flex: 1;
  text-align: center;
}
</style>
```

### Article JSON API Format

**Generated at**: `dist/articles.json`

```json
{
  "articles": [
    {
      "id": "2009-05-18-yaml-syck",
      "slug": "2009-05-18-yaml-syck",
      "title": "YAML Syck",
      "date": "2009-05-18T00:00:00Z",
      "excerpt": "Discussion about YAML parsing in Ruby...",
      "readTime": 3,
      "tags": ["ruby", "yaml"],
      "content": "Raw markdown content...",
      "htmlContent": "<p>Discussion about YAML parsing...</p>",
      "author": "nogoth",
      "updated": "2009-05-18T00:00:00Z"
    }
  ],
  "metadata": {
    "totalArticles": 3,
    "lastUpdated": "2026-03-04T09:50:00Z",
    "buildVersion": "1.0.0"
  }
}
```

---

## Part 4: Article Publishing Workflow

### Content Management Flow

```
1. Author writes/edits article
   ↓
2. Save as: articles/YYYY-MM-DD-slug.md
   ↓
3. Git commit and push to feature branch
   ↓
4. Create Pull Request
   ↓
5. GitHub Workflow validates:
   - Markdown syntax
   - YAML front matter
   - Article metadata required fields
   - Link validity
   - Spelling check
   ↓
6. PR review & approve
   ↓
7. Merge to main
   ↓
8. Publish workflow triggers:
   - Build Vue.js frontend
   - Generate articles.json API
   - Validate all articles
   - Generate SEO files (sitemap, RSS)
   - Deploy to GitHub Pages
   ↓
9. Live on nogoth.github.com
```

### Article Markdown Format

**File**: `articles/2009-05-18-yaml-syck.md`

```markdown
---
title: YAML Syck
date: 2009-05-18
slug: 2009-05-18-yaml-syck
excerpt: Discussion of YAML parsing in Ruby and its implications
tags: [ruby, yaml, parsing]
author: nogoth
status: published
readTime: 3
---

# YAML Syck

This is the article content in Markdown format.

## Subsection

More content here with **bold** and *italic* text.

```

### Metadata Requirements

**Required fields** (validated by workflow):
- `title` (string, 1-200 chars)
- `date` (ISO date: YYYY-MM-DD)
- `slug` (URL-friendly identifier)
- `excerpt` (string, 50-200 chars)
- `status` (enum: draft, published, archived)

**Optional fields**:
- `tags` (array of strings)
- `author` (string)
- `readTime` (number, minutes)
- `image` (URL for OG tags)
- `updated` (ISO date if edited)

### Validation Script

**File**: `scripts/validate-articles.js`

```javascript
const fs = require('fs')
const path = require('path')
const matter = require('gray-matter')

const REQUIRED_FIELDS = ['title', 'date', 'slug', 'excerpt', 'status']
const ARTICLE_DIR = './articles'

function validateArticles() {
  const files = fs.readdirSync(ARTICLE_DIR).filter(f => f.endsWith('.md'))
  const errors = []

  files.forEach(file => {
    const content = fs.readFileSync(path.join(ARTICLE_DIR, file), 'utf8')
    const { data } = matter(content)

    // Check required fields
    REQUIRED_FIELDS.forEach(field => {
      if (!data[field]) {
        errors.push(`${file}: Missing required field "${field}"`)
      }
    })

    // Validate date format
    if (data.date && !isValidDate(data.date)) {
      errors.push(`${file}: Invalid date format. Use YYYY-MM-DD`)
    }

    // Validate slug matches filename
    const expectedSlug = path.basename(file, '.md')
    if (data.slug !== expectedSlug) {
      errors.push(`${file}: Slug doesn't match filename`)
    }

    // Check content exists
    if (content.split('---').length < 3) {
      errors.push(`${file}: No content body found`)
    }
  })

  if (errors.length > 0) {
    console.error('❌ Validation errors:\n' + errors.join('\n'))
    process.exit(1)
  }

  console.log(`✅ All ${files.length} articles validated successfully`)
}

function isValidDate(dateStr) {
  return /^\d{4}-\d{2}-\d{2}$/.test(dateStr) && !isNaN(Date.parse(dateStr))
}

validateArticles()
```

---

## Part 5: Build and Deployment Pipeline

### Build Process

**File**: `package.json`

```json
{
  "name": "nogoth-blog",
  "version": "2.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "build:preview": "vite build --mode preview",
    "validate:articles": "node scripts/validate-articles.js",
    "validate:frontmatter": "node scripts/validate-frontmatter.js",
    "validate:metadata": "node scripts/validate-metadata.js",
    "build:index": "node scripts/build-index.js",
    "generate:api": "node scripts/generate-api.js",
    "generate:sitemap": "node scripts/generate-sitemap.js",
    "generate:rss": "node scripts/generate-rss.js",
    "generate:og-tags": "node scripts/generate-og-tags.js",
    "lint:markdown": "markdownlint articles/**/*.md",
    "check:spelling": "cspell articles/**/*.md src/**/*.vue",
    "test": "vitest",
    "preview": "vite preview"
  },
  "dependencies": {
    "vue": "^3.3.0",
    "vue-router": "^4.2.0",
    "marked": "^10.0.0",
    "gray-matter": "^4.0.3",
    "sanitize-html": "^2.10.0"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^4.5.0",
    "typescript": "^5.3.0",
    "vite": "^5.0.0",
    "markdownlint-cli": "^0.35.0",
    "cspell": "^7.3.0"
  }
}
```

### Build Script: generate-api.js

```javascript
const fs = require('fs')
const path = require('path')
const matter = require('gray-matter')
const marked = require('marked')

const ARTICLE_DIR = './articles'
const DIST_DIR = './dist'

async function generateAPI() {
  const files = fs.readdirSync(ARTICLE_DIR).filter(f => f.endsWith('.md'))
  const articles = []

  for (const file of files) {
    const content = fs.readFileSync(path.join(ARTICLE_DIR, file), 'utf8')
    const { data, content: body } = matter(content)

    const htmlContent = marked.parse(body)
    const slug = path.basename(file, '.md')

    articles.push({
      id: slug,
      slug,
      title: data.title,
      date: new Date(data.date).toISOString(),
      excerpt: data.excerpt,
      readTime: data.readTime || Math.ceil(body.split(' ').length / 200),
      tags: data.tags || [],
      content: body,
      htmlContent,
      author: data.author || 'nogoth',
      updated: data.updated ? new Date(data.updated).toISOString() : new Date(data.date).toISOString(),
      status: data.status || 'published'
    })
  }

  // Sort by date descending
  articles.sort((a, b) => new Date(b.date) - new Date(a.date))

  const apiContent = {
    articles: articles.filter(a => a.status === 'published'),
    metadata: {
      totalArticles: articles.filter(a => a.status === 'published').length,
      lastUpdated: new Date().toISOString(),
      buildVersion: '2.0.0'
    }
  }

  fs.writeFileSync(
    path.join(DIST_DIR, 'articles.json'),
    JSON.stringify(apiContent, null, 2)
  )

  console.log(`✅ Generated API with ${apiContent.articles.length} articles`)
}

generateAPI()
```

### Vite Configuration

**File**: `vite.config.ts`

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vue: ['vue', 'vue-router'],
        },
      },
    },
  },
  server: {
    port: 5173,
  },
})
```

### GitHub Pages Configuration

**Repository Settings**:
- Source: Deploy from a branch
- Branch: `gh-pages` (created by action)
- Folder: `/root`
- Custom domain: `nogoth.github.com` (CNAME)

**CNAME File** (auto-generated):
```
nogoth.github.com
```

---

## Part 6: Migration Steps

### Phase 1: Foundation Setup (Week 1)

**Objective**: Initialize modern project structure

1. **Create new branches**:
   ```bash
   git checkout main
   git pull origin main
   git checkout -b feat/modernize-to-vue
   ```

2. **Initialize Node.js project**:
   ```bash
   npm init -y
   npm install vue vue-router marked gray-matter
   npm install --save-dev vite @vitejs/plugin-vue typescript
   ```

3. **Create directory structure**:
   ```bash
   mkdir -p src/{components,pages,router,services,utils,styles}
   mkdir -p scripts
   mkdir -p articles
   mkdir -p public
   ```

4. **Create configuration files**:
   - `tsconfig.json` (TypeScript config)
   - `vite.config.ts` (Vite build config)
   - `.gitignore` (Node modules, dist, etc.)

5. **Commit**:
   ```bash
   git add .
   git commit -m "feat: initialize Vue.js project structure"
   ```

### Phase 2: Content Migration (Week 1-2)

**Objective**: Convert articles and create JSON API

1. **Convert textile to Markdown**:
   ```bash
   npm run scripts/convert-textile.js
   ```

   Before:
   ```textile
   ---
   layout: post
   title: This is a test
   ---
   Someone really needs to get a better jekyll generator.
   ```

   After:
   ```markdown
   ---
   title: This is a test
   date: 2009-05-17
   slug: 2009-05-17-this-is-a-test
   excerpt: Someone really needs to get a better jekyll generator...
   status: published
   ---
   Someone really needs to get a better jekyll generator.
   ```

2. **Create article metadata**:
   - Add `excerpt` field (extracted from content)
   - Add `tags` field (categorize content)
   - Add `readTime` field (calculated)
   - Add `author` field (default: nogoth)

3. **Validate converted articles**:
   ```bash
   npm run validate:articles
   ```

4. **Generate articles API**:
   ```bash
   npm run generate:api
   ```

5. **Commit**:
   ```bash
   git add articles/
   git commit -m "feat: migrate articles from Textile to Markdown"
   ```

### Phase 3: Vue Components (Week 2)

**Objective**: Build frontend components

1. **Create layout components**:
   - `Header.vue` (navigation, branding)
   - `Footer.vue` (contact info, links)
   - `Layout.vue` (wrapper)

2. **Create page components**:
   - `Home.vue` (ArticleList)
   - `Article.vue` (ArticleDetail)
   - `NotFound.vue` (404)

3. **Create utilities**:
   - `articleService.ts` (fetch from articles.json)
   - `dateFormatter.ts` (format dates)
   - `seo.ts` (meta tags)

4. **Setup Vue Router**:
   ```typescript
   // src/router/index.ts
   import { createRouter, createWebHistory } from 'vue-router'
   import Home from '@/pages/Home.vue'
   import Article from '@/pages/Article.vue'

   const routes = [
     { path: '/', component: Home },
     { path: '/article/:slug', component: Article },
     { path: '/:pathMatch(.*)*', component: NotFound }
   ]

   export const router = createRouter({
     history: createWebHistory(),
     routes
   })
   ```

5. **Create main entry point**:
   ```typescript
   // src/main.ts
   import { createApp } from 'vue'
   import App from './App.vue'
   import { router } from './router'

   createApp(App)
     .use(router)
     .mount('#app')
   ```

6. **Test locally**:
   ```bash
   npm run dev
   # Visit http://localhost:5173
   ```

7. **Commit**:
   ```bash
   git add src/
   git commit -m "feat: build Vue.js components for blog"
   ```

### Phase 4: Build Scripts (Week 2-3)

**Objective**: Automate content processing

1. **Create validation scripts**:
   - `validate-articles.js`
   - `validate-frontmatter.js`
   - `validate-metadata.js`

2. **Create generation scripts**:
   - `generate-api.js` (articles.json)
   - `generate-sitemap.js` (SEO)
   - `generate-rss.js` (RSS feed)
   - `generate-og-tags.js` (Open Graph)
   - `build-index.js` (article index)

3. **Test scripts**:
   ```bash
   npm run validate:articles
   npm run generate:api
   npm run generate:sitemap
   ```

4. **Commit**:
   ```bash
   git add scripts/ package.json
   git commit -m "feat: add build automation scripts"
   ```

### Phase 5: GitHub Workflows (Week 3)

**Objective**: Setup CI/CD automation

1. **Create workflow directory**:
   ```bash
   mkdir -p .github/workflows
   ```

2. **Create workflow files**:
   - `publish-article.yml` (main build & deploy)
   - `validate-article.yml` (PR validation)
   - `build-preview.yml` (preview generation)
   - `seo-optimize.yml` (meta generation)

3. **Create deployment branch**:
   ```bash
   git checkout --orphan gh-pages
   git rm -rf .
   echo "GitHub Pages deployment branch" > README.md
   git add README.md
   git commit -m "chore: initialize gh-pages branch"
   git push origin gh-pages
   git checkout main
   ```

4. **Configure GitHub Pages**:
   - Go to Settings → Pages
   - Source: Deploy from branch
   - Branch: `gh-pages` / root
   - Add CNAME: `nogoth.github.com`

5. **Test workflow**:
   ```bash
   git add .github/workflows/
   git commit -m "ci: add GitHub Actions workflows"
   git push origin feat/modernize-to-vue
   ```

   Create PR and watch workflows execute

6. **After PR approval, merge to main**:
   ```bash
   # Merge PR on GitHub
   # Watch publish-article.yml deploy to GitHub Pages
   ```

### Phase 6: Styling & Polish (Week 3-4)

**Objective**: Make it beautiful

1. **Create global styles**:
   - Design system (colors, fonts, spacing)
   - Responsive layout
   - Dark mode toggle (optional)

2. **Component styling**:
   - Article card design
   - Typography
   - Code block styling
   - Link styling

3. **SEO optimization**:
   - Meta tags in components
   - Open Graph images
   - Structured data (JSON-LD)

4. **Performance**:
   - Image optimization
   - Code splitting
   - Lazy loading

5. **Testing**:
   - Visual regression testing
   - Lighthouse audit
   - Mobile responsiveness

### Phase 7: Launch & Documentation (Week 4)

**Objective**: Go live and document

1. **Final testing**:
   ```bash
   npm run build
   npm run preview
   # Test production build locally
   ```

2. **Create documentation**:
   - `README.md` (project overview)
   - `CONTRIBUTING.md` (how to add articles)
   - `docs/SETUP.md` (local development)
   - `docs/DEPLOYMENT.md` (how CI/CD works)

3. **Update metadata**:
   - Update GitHub repository description
   - Add topic tags
   - Update About section

4. **Monitor**:
   - Set up analytics
   - Monitor GitHub Actions
   - Track any errors in Sentry (optional)

5. **Announce**:
   - Update contact info in Footer
   - Share on Twitter/social media
   - Update links in external profiles

---

## Implementation Timeline

| Phase | Duration | Key Deliverables | Status |
|-------|----------|------------------|--------|
| 1. Foundation | Week 1 | Project structure, config files | Not started |
| 2. Content Migration | Week 1-2 | Markdown articles, API generation | Not started |
| 3. Vue Components | Week 2 | Frontend pages, components | Not started |
| 4. Build Scripts | Week 2-3 | Automation, validation | Not started |
| 5. GitHub Workflows | Week 3 | CI/CD pipelines, deployment | Not started |
| 6. Styling & Polish | Week 3-4 | Design, SEO, performance | Not started |
| 7. Launch & Docs | Week 4 | Documentation, go-live | Not started |

**Total Effort**: ~4 weeks (can be parallelized)

---

## Risk Analysis & Mitigation

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|-----------|
| Old article content quality | Low | High | Manual review in PR, archiving old posts |
| GitHub Pages build failures | High | Medium | Extensive testing, workflow validation, error monitoring |
| Vue Router not working on GH Pages | High | Low | Use hash history mode (`/#/article/slug`) |
| Article API bloats over time | Medium | High | Pagination, article caching, archival strategy |
| SEO degradation after migration | High | Medium | Implement 301 redirects, preserve URLs, structured data |
| Breaking changes in dependencies | Medium | Medium | Lock dependency versions, regular updates via Renovate |
| Workflow matrix explosion costs | Medium | Low | Limit matrix builds, use concurrency limits |

---

## Success Metrics

### Performance
- Build time: < 30 seconds
- Deploy time: < 2 minutes
- First Contentful Paint: < 1s
- Lighthouse score: > 90

### Content Management
- Time to publish new article: < 5 minutes (after PR merge)
- Validation errors caught: 100% (automated)
- Broken links detected: 100% (CI check)

### User Experience
- Mobile responsiveness: 100%
- SEO ranking improvement: Track in Google Search Console
- Article discoverability: Improve with tags and search

---

## References & Resources

### Vue.js & Build Tools
- [Vue.js 3 Documentation](https://vuejs.org)
- [Vite Build Tool](https://vitejs.dev)
- [Vue Router](https://router.vuejs.org)

### GitHub Actions
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [peaceiris/actions-gh-pages](https://github.com/peaceiris/actions-gh-pages)
- [GitHub Script Action](https://github.com/actions/github-script)

### Content Processing
- [Marked.js](https://marked.js.org) (Markdown parser)
- [Gray Matter](https://github.com/jonschlinkert/gray-matter) (YAML frontmatter)
- [Sanitize HTML](https://github.com/apostrophecms/sanitize-html)

### SEO
- [Schema.org Structured Data](https://schema.org)
- [Open Graph Protocol](https://ogp.me)
- [RSS 2.0 Specification](https://www.rssboard.org/rss-specification)

---

## Next Steps

1. **Review this plan** with stakeholders
2. **Identify any gaps** or additional requirements
3. **Create GitHub issues** for each phase
4. **Assign ownership** (who implements what)
5. **Set deadlines** (4-week sprint recommended)
6. **Begin Phase 1** (Foundation Setup)

---

**Plan Created**: 2026-03-04T16:46:11Z  
**Status**: Ready for Implementation  
**Questions?** See CONTRIBUTING.md or create an issue
