<template>
  <nav class="sidebar-nav">
    <RouterLink to="/" exact-active-class="active" :aria-current="$route.path === '/' ? 'page' : undefined" class="nav-button">Articles</RouterLink>
    <RouterLink to="/repositories" exact-active-class="active" :aria-current="$route.path === '/repositories' ? 'page' : undefined" class="nav-button">Repositories</RouterLink>
    <RouterLink to="/resume" exact-active-class="active" :aria-current="$route.path === '/resume' ? 'page' : undefined" class="nav-button">Resume</RouterLink>
  </nav>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<style scoped>
.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  width: 100%;
}

.nav-button {
  width: 100%;
  padding: 0.75rem 1rem;
  text-align: center;
  text-decoration: none;
  color: var(--spaceman-dark, #1A1C0B);
  background: rgba(255, 255, 255, 0.9);
  border: 2px solid var(--spaceman-dark, #333);
  border-radius: 4px;
  font-weight: 700;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: 'Courier New', Courier, monospace;
}

.nav-button:hover {
  background-color: var(--spaceman-variation, #ACE1AF);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.nav-button.active {
  background-color: var(--spaceman-action, #B7410E);
  color: var(--spaceman-surface, #C2B280);
  border-color: var(--spaceman-action, #B7410E);
  border-bottom: 4px solid var(--spaceman-dark, #1A1C0B);
}

@media (max-width: 768px) {
  .sidebar-nav {
    flex-direction: column;
    gap: 0.75rem;
    margin-bottom: 1rem;
  }

  .nav-button {
    width: 100%;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
