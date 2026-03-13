<template>
  <div class="home-container">
    <aside class="articles-sidebar">
      <SidebarNav />
    </aside>

    <main class="resume-main">
      <div class="resume-container">
        <h1>Resume</h1>
        <p class="placeholder-text">
          Resume content coming soon...
        </p>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import SidebarNav from '@/components/SidebarNav.vue'
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

.resume-main {
  overflow-y: auto;
}

.resume-container {
  max-width: 900px;
}

.resume-container h1 {
  margin-top: 0;
  margin-bottom: 2rem;
  color: var(--spaceman-dark, #1A1C0B);
  font-size: 2rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-bottom: 4px solid var(--spaceman-action, #B7410E);
  padding-bottom: 0.75rem;
}

.placeholder-text {
  color: var(--spaceman-dark, #1A1C0B);
  font-size: 1.1rem;
  line-height: 1.6;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.9);
  border: 2px solid var(--spaceman-primary, #4B5320);
  border-radius: 4px;
  text-align: center;
  font-style: italic;
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

  .resume-main {
    padding: 1rem 0;
  }

  .resume-container h1 {
    font-size: 1.6rem;
  }
}
</style>
