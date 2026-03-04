import { createRouter, createWebHistory } from 'vue-router'
import Home from './pages/Home.vue'
import Article from './pages/Article.vue'
import NotFound from './pages/NotFound.vue'

const routes = [
  {
    path: '/',
    component: Home,
    meta: { title: 'Nogoth - Blog' }
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
