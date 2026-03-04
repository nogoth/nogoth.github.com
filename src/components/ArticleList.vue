<template>
  <div class="articles-container">
    <h2>Blog Articles</h2>

    <div class="filters">
      <input
        v-model="search"
        placeholder="Search articles..."
        class="search-input"
        type="text"
      />
    </div>

    <div v-if="filteredArticles.length === 0" class="no-articles">
      <p>No articles found. Check back soon!</p>
    </div>

    <div v-else class="articles-list">
      <article v-for="article in filteredArticles" :key="article.slug" class="article-card">
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
import { loadArticles, formatDate, getReadTime } from '@/utils'
import type { Article } from '@/utils'

const articles = ref<Article[]>([])
const search = ref('')

onMounted(async () => {
  articles.value = await loadArticles()
})

const filteredArticles = computed(() => {
  return articles.value.filter(
    a =>
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

.articles-container h2 {
  margin-top: 0;
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
  font-family: inherit;
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

@media (max-width: 768px) {
  .articles-container {
    padding: 1rem;
  }

  .article-card {
    border-left-width: 3px;
  }

  .article-card h3 {
    font-size: 1.2rem;
  }
}
</style>
