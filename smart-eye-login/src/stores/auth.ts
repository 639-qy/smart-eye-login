// src/stores/auth.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import router from '../router'

interface User {
  username: string
  token: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // 从环境变量获取API基础URL
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

  // 登录方法(含接口)
  const login = async (username: string, password: string) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        username,
        password
      })

      if (response.data?.token) {
        user.value = {
          username,
          token: response.data.token
        }
        // 存储token到localStorage
        localStorage.setItem('authToken', response.data.token)
        // 设置axios默认授权头
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`
        return true
      }
    } catch (err) {
      handleAuthError(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // 登出方法(含接口)
  const logout = async () => {
    try {
      if (user.value?.token) {
        await axios.post(`${API_BASE_URL}/auth/logout`, null, {
          headers: {
            Authorization: `Bearer ${user.value.token}`
          }
        })
      }
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      clearAuthState()
      router.push({ name: 'Login' })
    }
  }

  // 检查认证状态
  const checkAuth = async () => {
    const token = localStorage.getItem('authToken')
    if (token) {
      try {
        const response = await axios.get(`${API_BASE_URL}/auth/validate`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        if (response.data?.valid) {
          user.value = {
            username: response.data.username,
            token
          }
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
          return true
        }
      } catch (err) {
        console.error('Token validation error:', err)
        clearAuthState()
      }
    }
    return false
  }

  // 辅助方法 - 清除认证状态
  const clearAuthState = () => {
    user.value = null
    localStorage.removeItem('authToken')
    delete axios.defaults.headers.common['Authorization']
  }

  // 辅助方法 - 处理认证错误
  const handleAuthError = (err: unknown) => {
    if (axios.isAxiosError(err)) {
      error.value = err.response?.data?.message || 
                    err.response?.data?.error || 
                    '登录失败，请检查用户名和密码'
    } else {
      error.value = '登录过程中发生未知错误'
      console.error('Auth error:', err)
    }
  }

  return { user, loading, error, login, logout, checkAuth }
})