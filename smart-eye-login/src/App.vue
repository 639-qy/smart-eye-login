<script setup lang="ts">
// App.vue 是应用的根组件
import { RouterView } from 'vue-router'
// Optional: Check auth status when the app loads
import { onMounted } from 'vue';
import { useAuthStore } from './stores/auth';

const authStore = useAuthStore();

onMounted(() => {
  // Try to fetch user data if a token exists in localStorage
  // This helps maintain the session across page refreshes
  authStore.checkAuthStatus();
});

</script>

<template>
  <div id="app">
    <!-- router-view会渲染当前路由匹配的组件 -->
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<style>
/* 全局样式 */
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;
}

/* 页面过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Add global styles or import a CSS framework here if needed */
/* Example: import './assets/base.css'; */
</style>
