<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter, useRoute } from 'vue-router';

const username = ref<string>('');
const password = ref<string>('');
const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const handleLogin = async () => {
  authStore.error = null;

  if (!username.value || !password.value) {
    authStore.error = '请输入用户名和密码';
    return;
  }

  try {
    await authStore.login(username.value, password.value);
    const redirectPath = route.query.redirect as string | undefined;
    router.push(redirectPath || { name: 'Dashboard' });
  } catch (error) {
    console.error('Login failed in component:', error);
    password.value = '';
  }
};
</script>

<template>
  <div class="login-container">
    <div class="login-box">
      <div class="logo-container">
        <div class="logo-circle">
          <svg viewBox="0 0 24 24" class="eye-icon">
            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
          </svg>
        </div>
        <h1>智慧眼科</h1>
        <p class="subtitle">专业眼科诊疗系统</p>
      </div>
      
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <input
            id="username"
            type="text"
            v-model="username"
            required
            placeholder="用户名"
            :disabled="authStore.loading"
          />
        </div>
        <div class="form-group">
          <input
            id="password"
            type="password"
            v-model="password"
            required
            placeholder="密码"
            :disabled="authStore.loading"
          />
        </div>

        <div v-if="authStore.error" class="error-message">
          <svg viewBox="0 0 24 24" class="error-icon">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
          {{ authStore.error }}
        </div>

        <button type="submit" class="login-button" :disabled="authStore.loading">
          {{ authStore.loading ? '登录中...' : '登 录' }}
          <svg v-if="authStore.loading" viewBox="0 0 50 50" class="spinner">
            <circle cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
          </svg>
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 50%, #a5b4fc 100%);
}

.login-box {
  background-color: rgba(255, 255, 255, 0.95);
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(99, 102, 241, 0.2);
  width: 100%;
  max-width: 420px;
  text-align: center;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.logo-container {
  margin-bottom: 30px;
}

.logo-circle {
  width: 80px;
  height: 80px;
  margin: 0 auto 15px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1 0%, #818cf8 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
}

.eye-icon {
  width: 40px;
  height: 40px;
  fill: white;
}

h1 {
  margin: 0;
  color: #3730a3;
  font-size: 28px;
  font-weight: 600;
}

.subtitle {
  margin: 5px 0 0;
  color: #4f46e5;
  font-size: 14px;
  font-weight: 400;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group input {
  width: 100%;
  padding: 14px 16px;
  border: 1px solid #e0e7ff;
  border-radius: 8px;
  font-size: 15px;
  transition: all 0.3s;
  background-color: rgba(224, 231, 255, 0.3);
}

.form-group input:focus {
  border-color: #6366f1;
  outline: none;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
  background-color: white;
}

.form-group input::placeholder {
  color: #818cf8;
}

.error-message {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #dc2626;
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
}

.error-icon {
  width: 18px;
  height: 18px;
  fill: #dc2626;
}

.login-button {
  position: relative;
  padding: 14px;
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 48px;
}

.login-button:hover:not(:disabled) {
  box-shadow: 0 5px 15px rgba(79, 70, 229, 0.4);
  transform: translateY(-2px);
}

.login-button:active:not(:disabled) {
  transform: translateY(0);
}

.login-button:disabled {
  background: #c7d2fe;
  cursor: not-allowed;
}

.spinner {
  width: 20px;
  height: 20px;
  margin-left: 10px;
  animation: rotate 1s linear infinite;
}

.spinner circle {
  stroke: white;
  stroke-linecap: round;
  stroke-dasharray: 1, 200;
  stroke-dashoffset: 0;
  animation: dash 1.5s ease-in-out infinite;
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes dash {
  0% {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 89, 200;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 89, 200;
    stroke-dashoffset: -124;
  }
}
</style>