import { createWebHistory, createRouter } from 'vue-router'
import Home from '../views/HomeView.vue'
import About from '../views/AboutView.vue'
import Admin from '../views/AdminView.vue'
import NotFound from '../views/404.vue'
import SpecificPost from '../views/SpecificPost.vue'

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
    path: '/post/:postId',
    name: 'specific',
    component: SpecificPost
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'notFound',
    component: NotFound
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router