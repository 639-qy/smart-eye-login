<script setup lang="ts">
import { useAuthStore } from '../stores/auth'
import { onMounted } from 'vue'

const authStore = useAuthStore()

const handleLogout = async () => {
  try {
    await authStore.logout()
  } catch (error) {
    console.error('Logout failed:', error)
  }
}

// 组件加载时检查认证状态
onMounted(async () => {
  await authStore.checkAuth()
})
</script>

<template>
  <div class="dashboard-container">
    <h1>Dashboard</h1>
    <div class="welcome-message">
      Welcome, {{ authStore.user?.username }}!
    </div>
    <button @click="handleLogout" class="logout-button">Logout</button>
  </div>
</template>

<style scoped>
.dashboard-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.welcome-message {
  margin: 2rem 0;
  font-size: 1.2rem;
}

.logout-button {
  padding: 0.75rem 1.5rem;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.logout-button:hover {
  background-color: #d32f2f;
}
</style>