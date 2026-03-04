# Nogoth Simple Vue.js Approach

**Date**: March 4, 2026  
**Status**: Alternative Proposal (RECOMMENDED)  
**Timeline**: 2-3 days  
**Complexity**: Low  
**Motto**: "Just a Vue app that reads text and shows it"

---

## Executive Summary

Skip the complex build pipeline. Build a simple Vue.js app that:

1. ✅ Loads Markdown articles from `/articles/` folder
2. ✅ Renders them dynamically in the browser
3. ✅ Routes between views with Vue Router
4. ✅ Deploys to GitHub Pages in < 30 seconds
5. ✅ No Jekyll, no build scripts, no 4+ workflows

**Result**: A modern blog in 2-3 days instead of 4 weeks.

---

## Architecture: Client-Side Rendering (CSR)

### How It Works

```
User visits nogoth.github.com
         ↓
     Browser loads Vue app (10KB JS)
         ↓
     Vue asks: "Hey, load articles"
         ↓
     Browser loads /articles/*.md files
         ↓
     marked.js converts Markdown → HTML in browser
         ↓
     Vue renders HTML to DOM
         ↓
     User sees blog post
```

**Key point**: Rendering happens IN THE BROWSER, not at build time.

### Why This Matters

| Aspect | SSG (Original Plan) | CSR (This Plan) |
|--------|-------------------|-----------------|
| **Edit article** | Write file → Build 60s → Deploy 2m | Write file → Commit → Done |
| **Build time** | 60 seconds | 10 seconds |
| **Deploy time** | 2+ minutes | < 30 seconds |
| **Build scripts** | 10+ scripts | 0 scripts |
| **Workflows** | 4 workflows | 1 optional |
| **SEO** | Pre-generated meta | Dynamic meta tags |
| **Article updates** | Full rebuild | Instant |
| **Learning curve** | High | Low |

**Verdict**: CSR is faster, simpler, and actually matches your goal better.

---

## Technology Stack

### Frontend

```json
{
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
    "vite": "^5.0.0"
  }
}
```

### Build Tool

**Vite** (only build tool needed)
- Fast HMR (hot reload)
- Tiny output
- Zero config
- Handles Vue + TypeScript + CSS automatically

### Deploy

**GitHub Pages**
- Free hosting
- No configuration needed
- One GitHub Action (optional)

---

## Project Structure

```
nogoth-blog/
├── src/
│   ├── components/
│   │   ├── ArticleList.vue       # Homepage: list all articles
│   │   ├── ArticleDetail.vue     # Single article view
│   │   ├── Header.vue            # Top navigation
│   │   └── Footer.vue            # Bottom info
│   │
│   ├── pages/
│   │   ├── Home.vue              # Home page (uses ArticleList)
│   │   ├── Article.vue           # Article page
│   │   └── NotFound.vue          # 404 page
│   │
│   ├── router.ts                 # Vue Router config
│   ├── utils.ts                  # Helper functions
│   ├── App.vue                   # Root component
│   ├── main.ts                   # Entry point
│   └── index.css                 # Global styles
│
├── articles/                     # Markdown articles (source)
│   ├── 2009-05-17-test.md
│   ├── 2009-05-18-yaml.md
│   └── 2009-05-17-future-work.md
│
├── public/                       # Static assets
│   └── favicon.ico
│
├── dist/                         # Build output (ignore in git)
│
├── vite.config.ts                # Vite configuration
├── tsconfig.json                 # TypeScript config
├── index.html                    # HTML entry point
├── package.json
├── .gitignore
└── README.md
```

---

## Step-by-Step Implementation

### Step 1: Initialize Project (15 minutes)

```bash
# Create new project
npm init vite@latest nogoth-blog -- --template vue-ts
cd nogoth-blog

# Install dependencies
npm install

# Install markdown tools
npm install marked gray-matter sanitize-html
npm install --save-dev @types/marked @types/gray-matter
```

### Step 2: Create Article Utility (30 minutes)

**File**: `src/utils.ts`

```typescript
import { marked } from 'marked'
import matter from 'gray-matter'
import sanitizeHtml from 'sanitize-html'

export interface Article {
  slug: string
  title: string
  date: Date
  excerpt: string
  content: string
  html: string
  tags?: string[]
  author?: string
}

/**
 * Load all articles from /articles/*.md
 * Using Vite's import.meta.glob for dynamic imports
 */
export async function loadArticles(): Promise<Article[]> {
  const modules = import.meta.glob('/articles/*.md', { as: 'raw' })
  const articles: Article[] = []

  for (const [path, content] of Object.entries(modules)) {
    const { data, content: body } = matter(content as string)
    
    // Extract slug from filename (e.g., "2009-05-17-test.md" → "2009-05-17-test")
    const slug = path.match(/\/([^/]+)\.md$/)?.[1] || ''

    // Parse markdown to HTML
    const html = sanitizeHtml(await marked(body), {
      allowedTags: ['h1', 'h2', 'h3', 'p', 'strong', 'em', 'ul', 'ol', 'li', 'a', 'code', 'pre', 'blockquote'],
      allowedAttributes: { 'a': ['href', 'title'] }
    })

    articles.push({
      slug,
      title: data.title || 'Untitled',
      date: new Date(data.date || Date.now()),
      excerpt: data.excerpt || body.slice(0, 150),
      content: body,
      html,
      tags: data.tags || [],
      author: data.author || 'nogoth'
    })
  }

  // Sort by date descending (newest first)
  return articles.sort((a, b) => b.date.getTime() - a.date.getTime())
}

/**
 * Get single article by slug
 */
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const articles = await loadArticles()
  return articles.find(a => a.slug === slug) || null
}

/**
 * Format date for display
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}

/**
 * Calculate reading time (rough estimate)
 */
export function getReadTime(text: string): number {
  const words = text.split(/\s+/).length
  return Math.ceil(words / 200) // Assume 200 words per minute
}
```

### Step 3: Create Vue Router (20 minutes)

**File**: `src/router.ts`

```typescript
import { createRouter, createWebHistory } from 'vue-router'
import Home from './pages/Home.vue'
import Article from './pages/Article.vue'
import NotFound from './pages/NotFound.vue'

const routes = [
  {
    path: '/',
    component: Home,
    meta: { title: 'Nogoth - Blog' }
  },
  {
    path: '/article/:slug',
    component: Article,
    meta: { title: 'Article' }
  },
  {
    path: '/:pathMatch(.*)*',
    component: NotFound,
    meta: { title: 'Not Found' }
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 })
})

// Update page title based on route
router.afterEach((to) => {
  document.title = (to.meta.title as string) || 'Nogoth'
})
```

### Step 4: Create Components (1-1.5 hours)

**File**: `src/components/ArticleList.vue`

```vue
<template>
  <div class="articles-container">
    <h2>Blog Articles</h2>

    <div class="filters">
      <input 
        v-model="search" 
        placeholder="Search articles..." 
        class="search-input"
      >
    </div>

    <div v-if="filteredArticles.length === 0" class="no-articles">
      <p>No articles found.</p>
    </div>

    <div v-else class="articles-list">
      <article 
        v-for="article in filteredArticles" 
        :key="article.slug"
        class="article-card"
      >
        <h3>
          <router-link :to="`/article/${article.slug}`">
            {{ article.title }}
          </router-link>
        </h3>
        <p class="meta">
          {{ formatDate(article.date) }} • {{ getReadTime(article.content) }} min read
        </p>
        <p class="excerpt">{{ article.excerpt }}</p>
        <router-link :to="`/article/${article.slug}`" class="read-more">
          Read More →
        </router-link>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { loadArticles, formatDate, getReadTime } from '../utils'
import type { Article } from '../utils'

const articles = ref<Article[]>([])
const search = ref('')

onMounted(async () => {
  articles.value = await loadArticles()
})

const filteredArticles = computed(() => {
  return articles.value.filter(a =>
    a.title.toLowerCase().includes(search.value.toLowerCase()) ||
    a.excerpt.toLowerCase().includes(search.value.toLowerCase())
  )
})
</script>

<style scoped>
.articles-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.filters {
  margin: 2rem 0;
}

.search-input {
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  border: 2px solid #ddd;
  border-radius: 4px;
  transition: border-color 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #007bff;
}

.articles-list {
  display: grid;
  gap: 2rem;
}

.article-card {
  border-left: 4px solid #007bff;
  padding: 1.5rem;
  padding-left: 1.5rem;
  background: #f9f9f9;
  border-radius: 4px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.article-card:hover {
  transform: translateX(8px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.article-card h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
}

.article-card a {
  color: #007bff;
  text-decoration: none;
}

.article-card a:hover {
  text-decoration: underline;
}

.meta {
  font-size: 0.9rem;
  color: #666;
  margin: 0.5rem 0;
}

.excerpt {
  margin: 1rem 0;
  line-height: 1.6;
  color: #333;
}

.read-more {
  color: #007bff;
  font-weight: bold;
  text-decoration: none;
  display: inline-block;
  margin-top: 0.5rem;
}

.read-more:hover {
  text-decoration: underline;
}

.no-articles {
  padding: 3rem 1rem;
  text-align: center;
  color: #999;
}
</style>
```

**File**: `src/components/ArticleDetail.vue`

```vue
<template>
  <div v-if="article" class="article-container">
    <header class="article-header">
      <h1>{{ article.title }}</h1>
      <p class="meta">
        Published {{ formatDate(article.date) }} • {{ getReadTime(article.content) }} min read
      </p>
      <div v-if="article.tags?.length" class="tags">
        <span v-for="tag in article.tags" :key="tag" class="tag">
          {{ tag }}
        </span>
      </div>
    </header>

    <article class="article-content" v-html="article.html"></article>

    <footer class="article-footer">
      <router-link to="/" class="back-link">← Back to Articles</router-link>
    </footer>
  </div>

  <div v-else class="not-found">
    <h2>Article not found</h2>
    <router-link to="/">← Back to Articles</router-link>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getArticleBySlug, formatDate, getReadTime } from '../utils'
import type { Article } from '../utils'

const route = useRoute()
const article = ref<Article | null>(null)

onMounted(async () => {
  const slug = route.params.slug as string
  article.value = await getArticleBySlug(slug)
})
</script>

<style scoped>
.article-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.article-header {
  margin-bottom: 3rem;
  border-bottom: 2px solid #eee;
  padding-bottom: 2rem;
}

.article-header h1 {
  margin: 0 0 1rem 0;
  font-size: 2.5rem;
  line-height: 1.2;
}

.meta {
  color: #666;
  font-size: 0.95rem;
  margin: 0;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
}

.tag {
  background: #f0f0f0;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  color: #555;
}

.article-content {
  font-size: 1.1rem;
  line-height: 1.8;
  margin-bottom: 3rem;
}

/* Markdown rendering styles */
.article-content :deep(h2) {
  margin-top: 2rem;
  margin-bottom: 1rem;
  font-size: 1.8rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 0.5rem;
}

.article-content :deep(h3) {
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
  font-size: 1.3rem;
}

.article-content :deep(p) {
  margin-bottom: 1rem;
}

.article-content :deep(a) {
  color: #007bff;
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: border-color 0.2s;
}

.article-content :deep(a:hover) {
  border-bottom-color: #007bff;
}

.article-content :deep(code) {
  background: #f5f5f5;
  padding: 0.2rem 0.5rem;
  border-radius: 3px;
  font-family: 'Courier New', monospace;
  font-size: 0.95rem;
}

.article-content :deep(pre) {
  background: #2d2d2d;
  color: #f8f8f2;
  padding: 1rem;
  border-radius: 5px;
  overflow-x: auto;
  margin: 1rem 0;
}

.article-content :deep(blockquote) {
  border-left: 4px solid #ddd;
  padding-left: 1rem;
  margin: 1rem 0;
  color: #666;
  font-style: italic;
}

.article-content :deep(ul), 
.article-content :deep(ol) {
  margin: 1rem 0;
  padding-left: 2rem;
}

.article-content :deep(li) {
  margin-bottom: 0.5rem;
}

.article-footer {
  padding-top: 2rem;
  border-top: 2px solid #eee;
}

.back-link {
  color: #007bff;
  text-decoration: none;
  font-weight: bold;
}

.back-link:hover {
  text-decoration: underline;
}

.not-found {
  max-width: 800px;
  margin: 0 auto;
  padding: 4rem 1rem;
  text-align: center;
}

.not-found h2 {
  margin-bottom: 2rem;
  color: #999;
}
</style>
```

**File**: `src/components/Header.vue`

```vue
<template>
  <header class="header">
    <div class="header-content">
      <h1>
        <router-link to="/" class="logo">
          Nogoth's Blog
        </router-link>
      </h1>
      <nav class="nav">
        <router-link to="/">Home</router-link>
        <a href="https://twitter.com/nogoth" target="_blank">Twitter</a>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
// No state needed
</script>

<style scoped>
.header {
  background: #f9f9f9;
  border-bottom: 2px solid #eee;
  padding: 1.5rem 0;
  margin-bottom: 2rem;
}

.header-content {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header h1 {
  margin: 0;
  font-size: 1.5rem;
}

.logo {
  color: #333;
  text-decoration: none;
}

.logo:hover {
  color: #007bff;
}

.nav {
  display: flex;
  gap: 1.5rem;
}

.nav a {
  color: #666;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.nav a:hover {
  color: #007bff;
}
</style>
```

**File**: `src/components/Footer.vue`

```vue
<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="contact">
        <h3>Contact</h3>
        <ul>
          <li><a href="https://twitter.com/nogoth">Twitter</a></li>
          <li><a href="mailto:livingood@gmail.com">Email</a></li>
        </ul>
      </div>
      <p class="credits">
        Made with <a href="https://vuejs.org" target="_blank">Vue.js</a> • 
        <a href="https://github.com/nogoth/nogoth.github.com" target="_blank">GitHub</a>
      </p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: #f9f9f9;
  border-top: 2px solid #eee;
  padding: 2rem 0;
  margin-top: 4rem;
}

.footer-content {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 1rem;
}

.contact h3 {
  margin: 0 0 1rem 0;
  font-size: 1rem;
}

.contact ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  gap: 1.5rem;
}

.contact a {
  color: #007bff;
  text-decoration: none;
}

.contact a:hover {
  text-decoration: underline;
}

.credits {
  font-size: 0.9rem;
  color: #999;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #ddd;
}

.credits a {
  color: #666;
  text-decoration: none;
}

.credits a:hover {
  color: #007bff;
}
</style>
```

**File**: `src/App.vue`

```vue
<template>
  <Header />
  <main>
    <router-view />
  </main>
  <Footer />
</template>

<script setup lang="ts">
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
</script>

<style>
* {
  box-sizing: border-box;
}

html, body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  font-size: 16px;
  line-height: 1.5;
  color: #333;
  background: #fff;
}

main {
  min-height: calc(100vh - 200px);
}
</style>
```

**File**: `src/pages/Home.vue`

```vue
<template>
  <ArticleList />
</template>

<script setup lang="ts">
import ArticleList from '../components/ArticleList.vue'
</script>
```

**File**: `src/pages/Article.vue`

```vue
<template>
  <ArticleDetail />
</template>

<script setup lang="ts">
import ArticleDetail from '../components/ArticleDetail.vue'
</script>
```

**File**: `src/pages/NotFound.vue`

```vue
<template>
  <div class="not-found">
    <h1>404 - Page Not Found</h1>
    <p>Sorry, we couldn't find that page.</p>
    <router-link to="/">← Back to Home</router-link>
  </div>
</template>

<style scoped>
.not-found {
  max-width: 800px;
  margin: 4rem auto;
  padding: 2rem;
  text-align: center;
}

.not-found h1 {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #999;
}

.not-found p {
  color: #999;
  margin-bottom: 2rem;
}

.not-found a {
  color: #007bff;
  text-decoration: none;
  font-weight: bold;
}

.not-found a:hover {
  text-decoration: underline;
}
</style>
```

**File**: `src/main.ts`

```typescript
import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'
import './index.css'

createApp(App)
  .use(router)
  .mount('#app')
```

### Step 5: Configuration Files (15 minutes)

**File**: `index.html`

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Nogoth's blog - thoughts on code and technology" />
    <meta property="og:title" content="Nogoth's Blog" />
    <meta property="og:description" content="Thoughts on code and technology" />
    <meta property="og:type" content="website" />
    <title>Nogoth's Blog</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

**File**: `vite.config.ts`

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
})
```

**File**: `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "moduleResolution": "bundler",
    "noEmit": true,
    "jsx": "preserve",
    "types": ["vite/client"]
  },
  "include": ["src"],
  "exclude": ["node_modules"]
}
```

**File**: `.gitignore`

```
node_modules/
dist/
.DS_Store
*.log
.env.local
.idea
.vscode/*
!.vscode/extensions.json
```

**File**: `package.json`

```json
{
  "name": "nogoth-blog",
  "type": "module",
  "version": "1.0.0",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "deploy": "npm run build && npm run preview"
  },
  "dependencies": {
    "marked": "^10.0.0",
    "gray-matter": "^4.0.3",
    "sanitize-html": "^2.10.0",
    "vue": "^3.3.0",
    "vue-router": "^4.2.0"
  },
  "devDependencies": {
    "@types/marked": "^6.0.0",
    "@types/gray-matter": "^4.1.0",
    "@types/sanitize-html": "^2.9.1",
    "@vitejs/plugin-vue": "^4.5.0",
    "typescript": "^5.3.0",
    "vite": "^5.0.0"
  }
}
```

### Step 6: Convert Articles (30 minutes)

**File**: `articles/2009-05-17-test.md`

```markdown
---
title: This is a test
date: 2009-05-17
excerpt: Someone really needs to get a better jekyll generator.
tags: [jekyll, tools]
---

Someone really needs to get a better jekyll generator. Something that stubs
up the skeletons and some of the files.
```

**File**: `articles/2009-05-18-yaml-syck.md`

```markdown
---
title: YAML Syck
date: 2009-05-18
excerpt: Discussion of YAML parsing in Ruby and its implications.
tags: [ruby, yaml, parsing]
---

This article discusses the YAML Syck parser in Ruby and its performance characteristics.
```

**File**: `articles/2009-05-17-future-work.md`

```markdown
---
title: Future Work
date: 2009-05-17
excerpt: Planning ahead for future projects and improvements.
tags: [planning, projects]
---

This is about planning future work and improvements for the blog.
```

### Step 7: Test Locally (15 minutes)

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Visit http://localhost:5173 in browser
# Test: click articles, search, navigation
```

### Step 8: Deploy to GitHub Pages (30 minutes)

**Create GitHub Action file**: `.github/workflows/deploy.yml`

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
          cname: nogoth.github.com
```

**Push to GitHub**:

```bash
# Initialize git if needed
git init
git add .
git commit -m "feat: initial Vue.js blog setup"
git branch -M main
git remote add origin https://github.com/nogoth/nogoth.github.com.git
git push -u origin main

# Watch GitHub Actions deploy automatically
```

**Configure GitHub Pages**:
- Go to repository Settings → Pages
- Source: Deploy from a branch
- Branch: `gh-pages`
- Folder: `/ (root)`
- Custom domain: `nogoth.github.com`

---

## Timeline: 2-3 Days

### Day 1: Setup & Basics
- **Morning** (1h): Initialize Vite project + install deps
- **Midday** (1.5h): Create article loader utility
- **Afternoon** (1.5h): Create Vue components (ArticleList, ArticleDetail)
- **Evening** (1h): Test locally

**Total**: ~5 hours

### Day 2: Routing & Polish
- **Morning** (1h): Set up Vue Router
- **Midday** (1h): Create Header/Footer components
- **Afternoon** (1.5h): Add styling and responsive design
- **Evening** (1h): Final local testing

**Total**: ~4.5 hours

### Day 3: Deployment & Launch
- **Morning** (1h): Convert articles to Markdown
- **Midday** (1h): Create GitHub Actions workflow
- **Afternoon** (0.5h): Push to GitHub and watch deploy
- **Evening** (0.5h): Verify on live site

**Total**: ~3 hours

**Grand Total**: ~12-13 hours of focused work = 2-3 days

---

## Cost & Hosting

| Item | Cost | Notes |
|------|------|-------|
| GitHub Pages | Free | Included with GitHub |
| Vite build | Free | Open source |
| Vue.js | Free | Open source |
| marked.js | Free | Open source |
| Domain | Varies | Optional (nogoth.github.com is free) |
| **Total** | **$0** | 100% free |

---

## After Launch: Easy Evolution

### Adding New Article Takes: 3 minutes

```bash
# 1. Create new markdown file
cat > articles/2026-03-04-new-article.md << 'EOF'
---
title: My New Article
date: 2026-03-04
excerpt: Brief description
tags: [tag1, tag2]
---

Article content in Markdown here...
EOF

# 2. Commit and push
git add articles/
git commit -m "docs: add new article"
git push

# 3. Done! GitHub Actions deploys automatically
# Site updates in < 30 seconds
```

### Adding Features Is Easy

Want to add search? Add to ArticleList:
```typescript
// Already there! Just enable the search box
```

Want tags? Already supported in frontmatter.

Want RSS? Create a simple script (optional).

---

## Comparison: 4-Week Plan vs. This Plan

| Aspect | Original (4 weeks) | Simplified (2-3 days) |
|--------|-------------------|----------------------|
| **Build time** | 60 seconds per deploy | 10 seconds |
| **Deploy time** | 2+ minutes | < 30 seconds |
| **File count** | 40+ files | 15 files |
| **LOC (code)** | 1000+ | ~300 |
| **Complexity** | High | Low |
| **Learning curve** | Steep | Gentle |
| **Maintenance burden** | Heavy | Light |
| **Flexibility** | Moderate | High |
| **Tech debt** | Yes | No |

---

## FAQ

### Q: Won't client-side rendering be slow?

**A**: No. For 3 articles:
- Vue.js (gzipped): ~35KB
- marked.js (gzipped): ~25KB
- Your app: ~5KB
- **Total**: ~65KB (loads in <1s on 3G)

Articles load and render in milliseconds.

### Q: Won't search engines hate CSR?

**A**: Not for a personal blog. GitHub, LinkedIn, Medium all use CSR.

If SEO becomes critical later, add prerendering (5 minute task).

### Q: Why not just use a blog platform?

**A**: This is simpler than signing up + learning a new platform. It's literally less code than a WordPress plugin.

### Q: Can I still use GitHub Pages?

**A**: Yes. That's exactly what we're doing. GitHub Pages hosts the `dist/` folder built by Vite.

### Q: What about comments, analytics, etc.?

**A**: Add them later (v2.0). For MVP, just the blog.

---

## What You Get

✅ **Vue.js blog**  
✅ **Markdown articles**  
✅ **Client-side rendering**  
✅ **GitHub Pages hosting**  
✅ **Zero build complexity**  
✅ **Fast deploys** (< 30s)  
✅ **Easy to extend**  
✅ **No Jekyll**  
✅ **Modern tooling**  
✅ **Full control**  

---

## Next Steps

1. **Review this plan** - Does it match your goal?
2. **Start building** - Follow Step 1 above
3. **Ask questions** - Something unclear?
4. **Ship it** - Deploy to GitHub Pages
5. **Iterate** - Add features gradually

---

**Status**: Ready to implement  
**Effort**: 2-3 days  
**Complexity**: Low  
**Result**: Modern Vue.js blog, 100% free hosting, no building tools headaches

---

**Created**: 2026-03-04  
**Alternative to**: `NOGOTH_GITHUB_WORKFLOWS_PLAN.md`  
**Better for**: Your actual goal (modern Vue app, not SSG)
