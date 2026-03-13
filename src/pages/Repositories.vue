<template>
  <div class="home-container">
    <aside class="articles-sidebar">
      <SidebarNav />
    </aside>

    <main class="repo-main">
      <div class="repo-container">
        <h1>Repositories</h1>

        <div v-if="loading" class="loading-state">
          <p>Loading repositories...</p>
        </div>

        <div v-else-if="error" class="error-state">
          <p>{{ error }}</p>
        </div>

        <template v-else>
          <div v-if="activeLanguages.size" class="language-filter">
            <span class="language-filter-label">Showing repositories using:</span>
            <div class="language-filter-badges">
              <div v-for="lang in activeLanguages" :key="lang" class="language-filter-badge">
                {{ lang }}
                <button class="language-filter-close" @click="toggleLanguage(lang)" title="Remove filter">
                  ✕
                </button>
              </div>
              <button v-if="activeLanguages.size > 1" class="language-filter-clear" @click="clearLanguages">
                Clear all
              </button>
            </div>
          </div>

          <div v-if="filteredRepositories.length" class="repo-list">
          <article
            v-for="repo in filteredRepositories"
            :key="repo.id"
            class="repo-card"
          >
            <div class="repo-header">
              <h2 class="repo-name">
                <a :href="repo.html_url" target="_blank" rel="noopener noreferrer">
                  {{ repo.name }}
                </a>
              </h2>
              <p v-if="repo.description" class="repo-description">
                {{ repo.description }}
              </p>
            </div>

            <div class="repo-footer">
              <div class="language-tags">
                <button
                  v-for="language in repo.languages"
                  :key="language"
                  class="language-tag"
                  :class="{ active: activeLanguages.has(language) }"
                  @click="toggleLanguage(language)"
                >
                  {{ language }}
                </button>
              </div>
            </div>
          </article>
          </div>

          <div v-if="!filteredRepositories.length" class="no-repos">
            <p>No repositories found</p>
          </div>
        </template>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import SidebarNav from '@/components/SidebarNav.vue'

interface GitHubRepoBase {
  id: number
  name: string
  html_url: string
  description: string | null
  languages_url: string
}

interface GitHubRepo extends GitHubRepoBase {
  languages: string[]
}

interface LanguagesResponse {
  [language: string]: number
}

const repositories = ref<GitHubRepo[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const activeLanguages = ref<Set<string>>(new Set())

const filteredRepositories = computed(() => {
  if (!activeLanguages.value.size) return repositories.value
  return repositories.value.filter(repo =>
    [...activeLanguages.value].every(lang => repo.languages.includes(lang))
  )
})

function toggleLanguage(language: string) {
  const next = new Set(activeLanguages.value)
  if (next.has(language)) {
    next.delete(language)
  } else {
    next.add(language)
  }
  activeLanguages.value = next
}

function clearLanguages() {
  activeLanguages.value = new Set()
}

async function fetchRepositories() {
  try {
    loading.value = true
    error.value = null

    // Fetch repos
    const reposResponse = await fetch(
      'https://api.github.com/users/nogoth/repos?sort=pushed&direction=desc&per_page=5'
    )

    if (!reposResponse.ok) {
      if (reposResponse.status === 403 || reposResponse.status === 429) {
        throw new Error('GitHub API rate limit exceeded. Please try again later.')
      }
      throw new Error(`Failed to fetch repositories: ${reposResponse.status}`)
    }

    const repos: GitHubRepoBase[] = await reposResponse.json()

    // Fetch languages for each repo
    const reposWithLanguages = await Promise.all(
      repos.map(async (repo, index) => {
        await new Promise(resolve => setTimeout(resolve, index * 100))
        try {
          const langResponse = await fetch(repo.languages_url)
          if (langResponse.ok) {
            const languages: LanguagesResponse = await langResponse.json()
            return {
              ...repo,
              languages: Object.keys(languages)
            }
          }
        } catch (err) {
          console.error(`Failed to fetch languages for ${repo.name}:`, err)
        }
        return {
          ...repo,
          languages: []
        }
      })
    )

    repositories.value = reposWithLanguages
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load repositories'
    console.error('Error fetching repositories:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchRepositories()
})
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

.repo-main {
  overflow-y: auto;
}

.repo-container {
  max-width: 900px;
}

.repo-container h1 {
  margin-top: 0;
  margin-bottom: 2rem;
  color: var(--spaceman-dark, #1A1C0B);
  font-size: 2rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-bottom: 4px solid var(--spaceman-action, #B7410E);
  padding-bottom: 0.75rem;
}

.loading-state,
.error-state {
  padding: 3rem 2rem;
  text-align: center;
  font-size: 1.1rem;
  font-weight: 600;
}

.loading-state {
  color: var(--spaceman-primary, #4B5320);
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.error-state {
  color: var(--spaceman-action, #B7410E);
  background: rgba(183, 65, 14, 0.1);
  border: 2px solid var(--spaceman-action, #B7410E);
  border-radius: 4px;
}

.repo-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.repo-card {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 120px;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.95);
  border: 2px solid var(--spaceman-dark, #1A1C0B);
  border-left: 4px solid var(--spaceman-action, #B7410E);
  border-radius: 4px;
  box-shadow: 5px 5px rgba(0, 0, 0, 0.2);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.repo-card::after {
  content: '';
  position: absolute;
  top: -2px;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--spaceman-action, #B7410E), transparent);
  border-radius: 4px 4px 0 0;
}

.repo-card:hover {
  transform: translate(-5px, -5px);
  box-shadow: 10px 10px rgba(0, 0, 0, 0.3);
  border-color: var(--spaceman-action, #B7410E);
}

.repo-header {
  flex: 1;
}

.repo-name {
  margin: 0 0 0.75rem 0;
  font-size: 1.5rem;
  color: var(--spaceman-dark, #1A1C0B);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.repo-name a {
  color: var(--spaceman-action, #B7410E);
  text-decoration: none;
  transition: all 0.2s;
}

.repo-name a:hover {
  color: var(--spaceman-dark, #1A1C0B);
  text-shadow: 0 0 10px rgba(183, 65, 14, 0.3);
}

.repo-description {
  margin: 0;
  color: var(--spaceman-dark, #1A1C0B);
  font-size: 0.95rem;
  line-height: 1.5;
  opacity: 0.9;
}

.repo-footer {
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  margin-top: 1rem;
}

.language-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: flex-end;
}

.language-tag {
  display: inline-block;
  padding: 0.35rem 0.75rem;
  background-color: var(--spaceman-primary, #4B5320);
  color: var(--spaceman-surface, #C2B280);
  border: 1px solid var(--spaceman-dark, #1A1C0B);
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all 0.2s;
  cursor: pointer;
  font-family: inherit;
}

.language-tag:hover {
  background-color: var(--spaceman-action, #B7410E);
  transform: scale(1.05);
}

.language-tag.active {
  background-color: var(--spaceman-action, #B7410E);
  border-color: var(--spaceman-action, #B7410E);
  box-shadow: 0 0 0 2px rgba(183, 65, 14, 0.3);
}

.language-filter {
  margin-bottom: 1.5rem;
  padding: 0.75rem;
  background: rgba(75, 83, 32, 0.1);
  border: 1px solid var(--spaceman-primary, #4B5320);
  border-radius: 4px;
}

.language-filter-label {
  display: block;
  font-size: 0.85rem;
  color: var(--spaceman-primary, #4B5320);
  margin-bottom: 0.5rem;
}

.language-filter-badges {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
}

.language-filter-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--spaceman-primary, #4B5320);
  color: var(--spaceman-surface, #C2B280);
  padding: 0.4rem 0.75rem;
  border-radius: 4px;
  font-weight: 600;
  font-size: 0.9rem;
}

.language-filter-clear {
  background: none;
  border: 1px solid var(--spaceman-primary, #4B5320);
  color: var(--spaceman-primary, #4B5320);
  padding: 0.4rem 0.75rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.2s;
}

.language-filter-clear:hover {
  background: var(--spaceman-primary, #4B5320);
  color: var(--spaceman-surface, #C2B280);
}

.language-filter-close {
  background: none;
  border: none;
  color: var(--spaceman-surface, #C2B280);
  cursor: pointer;
  font-size: 1rem;
  padding: 0;
  line-height: 1;
  transition: opacity 0.2s;
}

.language-filter-close:hover {
  opacity: 0.7;
}

.no-repos {
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
    padding: 1rem 0;
    margin-bottom: 1rem;
  }

  .repo-main {
    padding: 1rem 0;
  }

  .repo-container h1 {
    font-size: 1.6rem;
  }

  .repo-card {
    box-shadow: 3px 3px rgba(0, 0, 0, 0.15);
  }

  .repo-card:hover {
    transform: translate(-3px, -3px);
    box-shadow: 6px 6px rgba(0, 0, 0, 0.2);
  }

  .repo-name {
    font-size: 1.2rem;
  }

  .language-tags {
    justify-content: flex-start;
  }
}
</style>
