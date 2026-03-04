<template>
  <div v-if="!loading && article" class="article-container">
    <header class="article-header">
      <h1>{{ article.title }}</h1>
      <p class="meta">
        Published {{ formatDate(article.date) }} • {{ getReadTime(article.content) }} min read
      </p>
      <div v-if="article.tags?.length" class="tags">
        <button
          v-for="tag in article.tags"
          :key="tag"
          class="tag"
          @click="emit('select-tag', tag)"
        >
          {{ tag }}
        </button>
      </div>
    </header>

    <article class="article-content" v-html="article.html"></article>

    <footer class="article-footer">
      <router-link to="/" class="back-link">← Back to Articles</router-link>
    </footer>
  </div>

  <div v-else-if="!loading" class="not-found">
    <h2>Article not found</h2>
    <p>Sorry, we couldn't find that article.</p>
    <router-link to="/">← Back to Articles</router-link>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { getArticleBySlug, formatDate, getReadTime } from '@/utils'
import type { Article } from '@/utils'

interface Props {
  slug: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'select-tag': [tag: string]
}>()
const article = ref<Article | null>(null)
const loading = ref(true)

async function loadArticle() {
  loading.value = true
  article.value = await getArticleBySlug(props.slug)
  loading.value = false
}

onMounted(loadArticle)

watch(() => props.slug, loadArticle)
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
  margin: 0 0 1rem 0;
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
  border: 1px solid #ddd;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}

.tag:hover {
  background: #007bff;
  color: white;
  border-color: #007bff;
  transform: translateY(-2px);
}

.article-content {
  font-size: 1.1rem;
  line-height: 1.8;
  margin-bottom: 3rem;
  color: #333;
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

.article-content :deep(pre code) {
  background: none;
  padding: 0;
  color: inherit;
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

.article-content :deep(img) {
  max-width: 100%;
  height: auto;
  margin: 1rem 0;
  border-radius: 4px;
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
  margin-top: 0;
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

@media (max-width: 768px) {
  .article-container {
    padding: 1rem;
  }

  .article-header h1 {
    font-size: 1.8rem;
  }

  .article-content {
    font-size: 1rem;
  }

  .article-content :deep(h2) {
    font-size: 1.4rem;
  }

  .article-content :deep(h3) {
    font-size: 1.1rem;
  }
}
</style>
