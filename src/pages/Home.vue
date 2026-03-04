<template>
  <div class="home-container">
    <aside class="articles-sidebar">
      <h2>Articles</h2>

      <div class="search-container">
        <input
          v-model="search"
          placeholder="Search articles..."
          class="search-input"
          type="text"
        />
      </div>

      <div v-if="activeTag" class="tag-filter">
        <span class="tag-filter-label">Showing articles tagged:</span>
        <div class="tag-filter-badge">
          {{ activeTag }}
          <button class="tag-filter-close" @click="clearTag" title="Clear filter">
            ✕
          </button>
        </div>
      </div>

      <div v-if="filteredArticles.length === 0" class="no-articles">
        <p>No articles found</p>
      </div>

      <nav v-else class="articles-nav">
        <button
          v-for="article in filteredArticles"
          :key="article.slug"
          class="article-link"
          :class="{ active: activeSlug === article.slug }"
          @click="activeSlug = article.slug"
        >
          <div class="article-link-title">{{ article.title }}</div>
          <div class="article-link-date">{{ formatDate(article.date) }}</div>
        </button>
      </nav>
    </aside>

    <main class="article-main">
      <ArticleDetail
        v-if="activeSlug"
        :slug="activeSlug"
        :key="activeSlug"
        @select-tag="selectTag"
      />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { loadArticles, formatDate } from '@/utils'
import ArticleDetail from '@/components/ArticleDetail.vue'
import type { Article } from '@/utils'

const articles = ref<Article[]>([])
const search = ref('')
const activeSlug = ref('')
const activeTag = ref<string | null>(null)

onMounted(async () => {
  articles.value = await loadArticles()
  
  // Auto-load the latest article on mount
  if (articles.value.length > 0) {
    activeSlug.value = articles.value[0].slug
  }
})

const filteredArticles = computed(() => {
  return articles.value.filter(a => {
    // Filter by search
    const matchesSearch =
      a.title.toLowerCase().includes(search.value.toLowerCase()) ||
      a.excerpt.toLowerCase().includes(search.value.toLowerCase())
    
    // Filter by tag
    const matchesTag = activeTag.value
      ? a.tags?.includes(activeTag.value)
      : true
    
    return matchesSearch && matchesTag
  })
})

function selectTag(tag: string) {
  // Toggle tag filter: click same tag to deselect
  if (activeTag.value === tag) {
    activeTag.value = null
  } else {
    activeTag.value = tag
    // Clear search when filtering by tag
    search.value = ''
  }
}

function clearTag() {
  activeTag.value = null
}
</script>

<style scoped>
.home-container {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem 1rem;
  min-height: calc(100vh - 200px);
}

.articles-sidebar {
  border-right: 2px solid #eee;
  padding-right: 2rem;
}

.articles-sidebar h2 {
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1.3rem;
}

.search-container {
  margin-bottom: 1.5rem;
}

.search-input {
  width: 100%;
  padding: 0.5rem;
  font-size: 0.9rem;
  border: 2px solid #ddd;
  border-radius: 4px;
  transition: border-color 0.2s;
  font-family: inherit;
}

.search-input:focus {
  outline: none;
  border-color: #007bff;
}

.tag-filter {
  margin-bottom: 1rem;
  padding: 0.75rem;
  background: #e8f4ff;
  border: 1px solid #007bff;
  border-radius: 4px;
}

.tag-filter-label {
  display: block;
  font-size: 0.85rem;
  color: #0056b3;
  margin-bottom: 0.5rem;
}

.tag-filter-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: #007bff;
  color: white;
  padding: 0.4rem 0.75rem;
  border-radius: 4px;
  font-weight: 600;
  font-size: 0.9rem;
}

.tag-filter-close {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 1rem;
  padding: 0;
  line-height: 1;
  transition: opacity 0.2s;
}

.tag-filter-close:hover {
  opacity: 0.7;
}

.articles-nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.article-link {
  display: block;
  width: 100%;
  padding: 0.75rem;
  border-left: 3px solid transparent;
  background: #f9f9f9;
  border: none;
  border-left: 3px solid transparent;
  border-radius: 4px;
  text-align: left;
  text-decoration: none;
  color: #333;
  font-family: inherit;
  font-size: inherit;
  cursor: pointer;
  transition: all 0.2s;
}

.article-link:hover {
  background: #f0f0f0;
  border-left-color: #007bff;
}

.article-link.active {
  background: #e8f4ff;
  border-left-color: #007bff;
}

.article-link-title {
  font-weight: 600;
  font-size: 0.95rem;
  margin-bottom: 0.25rem;
  line-height: 1.3;
}

.article-link-date {
  font-size: 0.8rem;
  color: #999;
}

.article-main {
  overflow-y: auto;
}

.no-articles {
  padding: 2rem 1rem;
  text-align: center;
  color: #999;
  font-size: 0.9rem;
}

@media (max-width: 1024px) {
  .home-container {
    grid-template-columns: 250px 1fr;
    gap: 1rem;
    padding: 1rem;
  }

  .articles-sidebar {
    padding-right: 1rem;
  }
}

@media (max-width: 768px) {
  .home-container {
    grid-template-columns: 1fr;
    gap: 0;
    padding: 0;
    min-height: auto;
  }

  .articles-sidebar {
    border-right: none;
    border-bottom: 2px solid #eee;
    padding: 1rem;
    padding-right: 1rem;
    margin-bottom: 1rem;
  }

  .articles-sidebar h2 {
    margin-bottom: 0.5rem;
  }

  .articles-nav {
    flex-direction: row;
    gap: 0;
    flex-wrap: wrap;
  }

  .article-link {
    flex: 0 0 auto;
    padding: 0.5rem 1rem;
    border: 1px solid #ddd;
    margin-right: 0.5rem;
    margin-bottom: 0.5rem;
  }

  .article-link-date {
    display: none;
  }

  .article-main {
    padding: 1rem;
  }
}
</style>
