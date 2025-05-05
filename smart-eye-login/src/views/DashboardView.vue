<script setup lang="ts">
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const handleLogout = async () => {
  try {
    await authStore.logout();
    router.push({ name: 'Login' });
  } catch (error) {
    console.error('Logout failed:', error);
  }
};
</script>

<template>
  <div class="dashboard-container">
    <h1>Dashboard</h1>
    <div class="welcome-message">
      Welcome to your dashboard!
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
}

.logout-button:hover {
  background-color: #d32f2f;
}
</style>
