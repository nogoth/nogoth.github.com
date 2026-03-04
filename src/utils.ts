import { marked } from 'marked'

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
 * Simple browser-compatible frontmatter parser
 * Parses YAML-like frontmatter between --- markers
 */
function parseFrontmatter(content: string): { data: Record<string, any>; content: string } {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  
  if (!match) {
    return { data: {}, content }
  }

  const [, frontmatterStr, body] = match
  const data: Record<string, any> = {}

  // Parse simple YAML frontmatter
  frontmatterStr.split('\n').forEach(line => {
    const colonIndex = line.indexOf(':')
    if (colonIndex > -1) {
      const key = line.slice(0, colonIndex).trim()
      let value = line.slice(colonIndex + 1).trim()

      // Parse arrays like [tag1, tag2]
      if (value.startsWith('[') && value.endsWith(']')) {
        value = value.slice(1, -1).split(',').map(v => v.trim())
      }

      data[key] = value
    }
  })

  return { data, content: body }
}

/**
 * Load all articles from articles/*.md files
 * Uses Vite's import.meta.glob for dynamic imports
 */
export async function loadArticles(): Promise<Article[]> {
  // Dynamically import all .md files from articles directory
  const modules = import.meta.glob('../articles/*.md', { query: '?raw', import: 'default', eager: true })
  const articles: Article[] = []

  for (const [path, module] of Object.entries(modules)) {
    try {
      // Extract slug from path (e.g., "../articles/2009-05-17-test.md" → "2009-05-17-test")
      const slug = path.match(/\/([^/]+)\.md$/)?.[1] || ''

      // With eager: true, modules are already loaded
      const fileContent = typeof module === 'string' ? module : (module as any).default

      // Parse frontmatter and content using browser-compatible parser
      const { data, content: body } = parseFrontmatter(fileContent)

      // Convert Markdown to HTML
      const html = await marked(body)

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
    } catch (error) {
      console.error('Error loading article from', path, error)
    }
  }

  // Sort by date descending (newest first), then by slug for stable ordering
  return articles.sort((a, b) => {
    const dateDiff = b.date.getTime() - a.date.getTime()
    if (dateDiff !== 0) return dateDiff
    // If dates are equal, sort by slug (reverse order for stability)
    return b.slug.localeCompare(a.slug)
  })
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
 * Assumes 200 words per minute
 */
export function getReadTime(text: string): number {
  const words = text.split(/\s+/).length
  return Math.max(1, Math.ceil(words / 200))
}
