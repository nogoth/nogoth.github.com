import { createRouter, createWebHistory } from 'vue-router'
import Home from './pages/Home.vue'
import Article from './pages/Article.vue'
import Repositories from './pages/Repositories.vue'
import Resume from './pages/Resume.vue'
import NotFound from './pages/NotFound.vue'

const routes = [
  {
    path: '/',
    component: Home,
    meta: { title: 'Nogoth - Blog' }
  },
  {
    path: '/repositories',
    component: Repositories,
    meta: { title: 'Nogoth - Repositories' }
  },
  {
    path: '/resume',
    component: Resume,
    meta: { title: 'Nogoth - Resume' }
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
