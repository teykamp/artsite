import { createWebHistory, createRouter } from 'vue-router'
import Home from '../views/HomeView.vue'
import About from '../views/AboutView.vue'
import Admin from '../views/AdminView.vue'
import notFound from '../views/404.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/about',
    name: 'about',
    component: About
  },
  {
    path: '/admin',
    name: 'admin',
    component: Admin
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'notFound',
    component: notFound
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router