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
 * Load all articles from articles/*.md files
 * Uses Vite's import.meta.glob for dynamic imports
 */
export async function loadArticles(): Promise<Article[]> {
  // Dynamically import all .md files from articles directory
  const modules = import.meta.glob('/articles/*.md', { query: '?raw', import: 'default' })
  const articles: Article[] = []

  for (const [path, content] of Object.entries(modules)) {
    // Extract slug from path (e.g., "/articles/2009-05-17-test.md" → "2009-05-17-test")
    const slug = path.match(/\/([^/]+)\.md$/)?.[1] || ''

    // Parse frontmatter and content
    const { data, content: body } = matter(content as string)

    // Convert Markdown to HTML
    const html = sanitizeHtml(await marked(body), {
      allowedTags: [
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'p', 'strong', 'em', 'u', 'del',
        'ul', 'ol', 'li',
        'a', 'blockquote',
        'code', 'pre',
        'br', 'hr',
        'img', 'table', 'thead', 'tbody', 'tr', 'th', 'td'
      ],
      allowedAttributes: {
        'a': ['href', 'title'],
        'img': ['src', 'alt', 'title'],
        'table': ['border']
      }
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
 * Assumes 200 words per minute
 */
export function getReadTime(text: string): number {
  const words = text.split(/\s+/).length
  return Math.max(1, Math.ceil(words / 200))
}
