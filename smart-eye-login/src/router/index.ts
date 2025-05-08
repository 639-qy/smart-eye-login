// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: LoginView,
      meta: { requiresAuth: false }
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: DashboardView,
      meta: { requiresAuth: true }
    },
    {
      path: '/',
      redirect: '/dashboard'
    }
  ]
})

// 导航守卫
router.beforeEach(async (to) => {
  // 在导航守卫中动态引入 authStore 以避免循环依赖
  const authStore = useAuthStore()
  
  // 检查路由是否需要认证
  if (to.meta.requiresAuth) {
    const isAuthenticated = await authStore.checkAuth()
    if (!isAuthenticated) {
      return {
        name: 'Login',
        query: { redirect: to.fullPath }
      }
    }
  }
  
  // 如果已登录却访问登录页，重定向到仪表盘
  if (to.name === 'Login' && authStore.user) {
    return { name: 'Dashboard' }
  }
})

export default router