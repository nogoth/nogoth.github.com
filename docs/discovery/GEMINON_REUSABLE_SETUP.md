# Can We Reuse Geminon's Setup for Nogoth.github.com?

**Date**: March 4, 2026  
**Analysis**: Geminon repo architecture and deployment strategy  
**Question**: Can we use the same setup for the nogoth blog?  
**Answer**: **YES - Almost exactly. It's the perfect template.**

---

## What is Geminon?

### Repository Structure

```
nogoth/geminon
├── main branch (default)          # Pi framework + CLI code
├── github-vue branch ⭐           # Vue.js app source (BUILD SOURCE)
├── gh-pages branch                # Built static files (DEPLOY TARGET)
└── other branches                 # Other client projects (ticket-viewer, etc.)
```

### The `github-vue` Branch (What We Care About)

This is the **source code branch** for the deployed Vue app at https://nogoth.github.io/geminon/

```
github-vue/
├── .github/workflows/
│   └── deploy.yml                 # BUILD & DEPLOY WORKFLOW
│
├── workspace/vue/geminon-spaceman/  # ← ACTUAL VUE PROJECT
│   ├── src/
│   │   ├── App.vue               # Main component
│   │   ├── assets/
│   │   │   └── spaceman.css      # Styles (retro theme)
│   │   └── main.js               # Entry point
│   │
│   ├── public/                   # Static assets
│   ├── index.html                # HTML template
│   ├── vite.config.js            # Vite config
│   ├── package.json              # npm dependencies
│   └── README.md
│
└── [Other files - not needed for Vue app]
```

---

## Geminon's Deploy Workflow

**File**: `.github/workflows/deploy.yml`

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - github-vue         # Trigger on pushes to this branch

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Install and Build
        working-directory: workspace/vue/geminon-spaceman  # ← Key: specific subdir
        run: |
          npm install
          npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: 'workspace/vue/geminon-spaceman/dist'  # Build output location

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### How It Works

1. **Trigger**: Push to `github-vue` branch
2. **Build**: Navigate to `workspace/vue/geminon-spaceman/` and run `npm run build`
3. **Output**: Creates `dist/` folder with built files
4. **Deploy**: Uploads `dist/` to GitHub Pages
5. **Result**: https://nogoth.github.io/geminon/ (automatically)

### Key Features

✅ Single workflow file (clean)  
✅ Builds from subdirectory (flexible structure)  
✅ Uses GitHub Pages action (automatic deployment)  
✅ No manual deployment steps needed  
✅ Outputs to gh-pages branch automatically  

---

## Geminon's Vue.js Setup

### Tech Stack

```json
{
  "dependencies": {
    "vue": "^3.5.25"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^6.0.2",
    "vite": "^7.3.1"
  }
}
```

**Minimal dependencies**: Only Vue 3 + Vite  
**No extra cruft**: No TypeScript, no UnitTest framework, no router (in geminon)  

### Build Configuration

**vite.config.js**:
```javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  base: '/geminon/',  // ← IMPORTANT for subdirectory deployment
  plugins: [vue()],
})
```

**Key**: `base: '/geminon/'` tells Vite to build for `/geminon/` path (not root)

### Project Structure

```
geminon-spaceman/
├── src/
│   ├── App.vue            # Single root component
│   ├── main.js            # Entry: creates Vue app, mounts to #app
│   └── assets/
│       └── spaceman.css   # All styles in one file
│
├── public/                # Static files (copied to dist/)
├── index.html             # HTML shell
├── package.json
├── vite.config.js
└── package-lock.json
```

**No routing**: App.vue handles all panels/views with `activePanel` ref

---

## How to Adapt This for Nogoth Blog

### Option A: Mirror Geminon's Exact Structure

**Keep the blog as a subdirectory under nogoth.github.com repo**:

```
nogoth.github.com/
├── .github/workflows/
│   └── deploy.yml              # Same workflow, adjusted paths
│
├── workspace/vue/nogoth-blog/  # ← Blog Vue.js project
│   ├── src/
│   │   ├── App.vue
│   │   ├── main.js
│   │   ├── components/
│   │   │   ├── ArticleList.vue
│   │   │   ├── ArticleDetail.vue
│   │   │   ├── Header.vue
│   │   │   └── Footer.vue
│   │   ├── router.ts
│   │   ├── utils.ts
│   │   └── styles/
│   │       └── index.css
│   │
│   ├── articles/               # Blog content
│   │   ├── 2009-05-17-test.md
│   │   ├── 2009-05-18-yaml.md
│   │   └── ...
│   │
│   ├── public/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── README.md
│
├── README.md
└── [other files...]
```

**Workflow adaptation**:

```yaml
name: Deploy Blog to GitHub Pages

on:
  push:
    branches:
      - main  # or 'blog' or 'github-vue'

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Install and Build
        working-directory: workspace/vue/nogoth-blog
        run: |
          npm install
          npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: 'workspace/vue/nogoth-blog/dist'

      - name: Deploy to GitHub Pages
        uses: actions/deploy-pages@v4
```

**vite.config.js**:

```javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  base: '/',  // Deploy to root of nogoth.github.com
  plugins: [vue()],
})
```

### Option B: Minimal Repo (No Subdirectories)

**Put the blog directly in the repo root**:

```
nogoth.github.com/
├── .github/workflows/
│   └── deploy.yml
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── App.vue
│   ├── main.js
│   └── ...
│
├── articles/
│   ├── 2009-05-17-test.md
│   └── ...
│
├── public/
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

**Workflow** (even simpler):

```yaml
name: Deploy Blog

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install && npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: 'dist'
      - uses: actions/deploy-pages@v4
```

**vite.config.js**:

```javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  base: '/',
  plugins: [vue()],
})
```

---

## What We Can Copy Directly from Geminon

### 1. Deployment Workflow
✅ Copy `.github/workflows/deploy.yml` and adjust working-directory path  
✅ Works perfectly for GitHub Pages  
✅ No manual deployment needed  

### 2. Vite Configuration
✅ Copy `vite.config.js` and adjust `base` path  
✅ Minimal, just works  
✅ Already optimized for GitHub Pages  

### 3. Vue Setup
✅ Copy project structure  
✅ Copy `package.json` scripts  
✅ Add dependencies as needed (marked.js, etc.)  

### 4. HTML Template
✅ Copy `index.html` structure  
✅ Just update title and meta tags  

### 5. Main Entry Point
✅ Copy `src/main.js` pattern  
✅ Creates Vue app and mounts to #app  

### 6. Spaceman Theme
✅ Copy `src/assets/spaceman.css` for the retro aesthetic  
✅ Adapt colors/sizing for blog look  
✅ Already proven to work  

---

## Key Differences: Geminon vs. Nogoth Blog

| Aspect | Geminon | Nogoth Blog |
|--------|---------|------------|
| **Purpose** | Dashboard/metrics display | Blog with articles |
| **Routing** | No (single App.vue) | YES (Vue Router needed) |
| **Dependencies** | Vue 3 only | Vue 3 + Router + marked + gray-matter |
| **Data source** | Hardcoded in component | Markdown files in `/articles/` |
| **Styling** | Monolithic spaceman.css | Can be modular (per-component) |
| **Content management** | Not applicable | Article loading utilities |
| **Configuration** | `base: '/geminon/'` | `base: '/'` |

---

## Implementation Plan: Reuse Geminon Setup

### Step 1: Start Fresh or Adapt Current Nogoth

**Choose Option A or B above**

If starting fresh:
```bash
cd /tmp
git clone https://github.com/nogoth/nogoth.github.com blog-repo
cd blog-repo
```

Then add the blog structure following Option A or B.

### Step 2: Copy & Adapt Key Files

1. **Copy workflow**:
   ```bash
   mkdir -p .github/workflows
   cp geminon-workflow.yml .github/workflows/deploy.yml
   # Then adjust paths
   ```

2. **Copy vite config**:
   ```bash
   cp geminon/vite.config.js ./vite.config.js
   # Then adjust base path
   ```

3. **Setup package.json**:
   ```bash
   npm init -y
   # Then add dependencies manually
   ```

### Step 3: Build Blog Components

Use the simplified Vue approach from `NOGOTH_SIMPLE_VUE_APPROACH.md`  
But build on top of Geminon's proven workflow/config

### Step 4: Deploy

```bash
git push origin main  # Or whatever branch triggers the workflow
# GitHub Actions runs automatically
# Site appears on GitHub Pages
```

---

## Geminon's Strengths (Why We Should Use Its Setup)

✅ **Proven**: Already deployed and working at https://nogoth.github.io/geminon/  
✅ **Simple**: Minimal dependencies, clean structure  
✅ **Automated**: GitHub Actions handles everything  
✅ **Fast**: Vite is extremely fast  
✅ **Flexible**: Works for subdirectories or root deployment  
✅ **No vendor lock-in**: Just Vue + Vite, nothing exotic  
✅ **Maintains history**: Both source and built code in git  
✅ **Easy branching**: `github-vue` for source, `gh-pages` for deployed  

---

## Potential Improvements Over Geminon

For the blog, we might add:

1. **Vue Router** - For navigation between articles
2. **TypeScript** - For type safety (optional)
3. **Tailwind CSS** - For styling (instead of monolithic CSS)
4. **Content metadata** - Load articles from markdown
5. **Search** - Client-side article search

But the **core deployment setup remains identical**.

---

## Risk Assessment: Reusing Geminon Setup

| Risk | Severity | Mitigation |
|------|----------|-----------|
| GitHub Pages config changes | Low | Proven to work, no custom config |
| Dependency updates | Low | Minimal deps (Vue, Vite only) |
| Base path issues | Low | Easy to adjust in vite.config.js |
| Workflow syntax changes | Low | Using standard actions (setup-node, deploy-pages) |
| Subdirectory deployment | Medium | Test locally with `npm run preview` |

**Overall**: Very low risk. Geminon setup is battle-tested.

---

## Recommended Approach

### For Nogoth Blog: **Use Option B (Minimal)**

**Why**:
1. Blog is simpler than Geminon's multi-workspace structure
2. No need for subdirectories
3. Cleaner git history
4. Easier onboarding

**Setup**:
```
nogoth.github.com/
├── articles/         # Markdown blog posts
├── src/              # Vue components
├── .github/          # Deployment workflow
├── public/           # Static assets
├── package.json      # Dependencies
├── vite.config.js    # Build config
└── index.html        # HTML template
```

**Deploy**: Same GitHub Actions workflow, just adjusted paths

**Result**: Blog at https://nogoth.github.com/ (or gh-pages branch manages it)

---

## Action Items

### To Implement This:

1. ✅ **Study Geminon workflow** - We just did this
2. ⏳ **Decide Option A or B** - Recommended: Option B
3. ⏳ **Create blog structure** - Follow `NOGOTH_SIMPLE_VUE_APPROACH.md`
4. ⏳ **Copy deployment workflow** - Adapt `deploy.yml`
5. ⏳ **Test locally** - `npm run dev` and `npm run build`
6. ⏳ **Push to GitHub** - Let GitHub Actions deploy
7. ⏳ **Verify live site** - Check https://nogoth.github.com/

---

## Files to Copy from Geminon

```
Source: https://github.com/nogoth/geminon (github-vue branch)
Destination: nogoth.github.com repo

Files:
├── .github/workflows/deploy.yml          → Keep as-is, adjust paths
├── workspace/vue/geminon-spaceman/vite.config.js → Adapt base path
├── workspace/vue/geminon-spaceman/index.html → Update title/meta
├── workspace/vue/geminon-spaceman/package.json → Extend with more deps
└── workspace/vue/geminon-spaceman/src/main.js → Copy pattern
```

---

## Conclusion

### Can We Reuse Geminon's Setup?

**YES. Absolutely.**

Geminon's deployment strategy and Vue.js configuration are:
- ✅ Proven (deployed and working)
- ✅ Minimal (no unnecessary complexity)
- ✅ Flexible (works for blogs)
- ✅ Automatic (GitHub Actions does everything)
- ✅ Fast (Vite builds in seconds)

The blog just needs:
1. Additional dependencies (marked, gray-matter, vue-router)
2. Blog-specific components (ArticleList, ArticleDetail)
3. Article content (markdown files)
4. Styling (copy spaceman.css theme or create own)

Everything else can be copied directly from Geminon.

**Recommendation**: Use Geminon's setup as your template. It's exactly what we need.

---

**Analysis Complete**: 2026-03-04  
**Status**: Ready to Implement  
**Next Step**: Start building the blog using Geminon's proven deployment strategy
