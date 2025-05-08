// src/main.ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import { useAuthStore } from './stores/auth'

// 配置axios
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'
axios.defaults.withCredentials = true // 如果需要跨域携带cookie

// 请求拦截器
axios.interceptors.request.use(config => {
  // 可以在这里添加全局请求处理逻辑
  return config
}, error => {
  return Promise.reject(error)
})

// 创建应用实例
const app = createApp(App)
app.use(createPinia())
app.use(router)

// 响应拦截器
axios.interceptors.response.use(response => {
  return response
}, error => {
  // 处理全局错误响应
  if (error.response?.status === 401) {
    const authStore = useAuthStore()
    authStore.logout()
  }
  return Promise.reject(error)
})

app.mount('#app')