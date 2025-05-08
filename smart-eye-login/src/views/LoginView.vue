<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter, useRoute } from 'vue-router'

const username = ref('')
const password = ref('')
const rememberMe = ref(false) // 新增记住密码状态
const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()
const pageLoaded = ref(false)
const showOtherLoginMethods = ref(false) // 控制其他登录方式的显示

onMounted(() => {
  setTimeout(() => {
    pageLoaded.value = true
  }, 100)
})

const handleLogin = async () => {
  authStore.error = null

  if (!username.value || !password.value) {
    authStore.error = '请输入用户名和密码'
    return
  }

  try {
    await authStore.login(username.value, password.value, rememberMe.value)
    const redirectPath = route.query.redirect as string | undefined
    
    await new Promise(resolve => setTimeout(resolve, 800))
    router.push(redirectPath || { name: 'Dashboard' })
  } catch (error) {
    console.error('Login failed:', error)
    password.value = ''
  }
}

const handleForgotPassword = () => {
  
  // 打开忘记密码对话框或跳转到忘记密码页面
};

const toggleOtherLoginMethods = () => {
  showOtherLoginMethods.value = !showOtherLoginMethods.value
}
</script>

<template>
  <div class="login-container" :class="{ 'loaded': pageLoaded }">
    <div class="animation-section">
      <div class="eye-animation">
        <div class="eye-lid top"></div>
        <div class="eye-ball">
          <div class="eye-iris"></div>
        </div>
        <div class="eye-lid bottom"></div>
      </div>
      <div class="clinic-info">
        <h2>智慧眼科诊疗系统</h2>
        <ul class="features">
          <li v-for="(feature, index) in features" :key="index" :style="`--i: ${index}`">
            <span>{{ feature }}</span>
          </li>
        </ul>
      </div>
    </div>
    
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
          <label for="username">用户名</label>
          <input
            id="username"
            type="text"
            v-model="username"
            required
            placeholder="请输入用户名"
            :disabled="authStore.loading"
            autocomplete="username"
          />
        </div>
        <div class="form-group">
          <label for="password">密码</label>
          <input
            id="password"
            type="password"
            v-model="password"
            required
            placeholder="请输入密码"
            :disabled="authStore.loading"
            autocomplete="current-password"
          />
        </div>
        <div class="form-group remember-forget">
          <div class="remember-me-container">
            <input type="checkbox" id="rememberMe" v-model="rememberMe" class="remember-checkbox" />
            <label for="rememberMe">记住密码</label>
          </div>
          <a href="#" class="forget-password" @click.prevent="handleForgotPassword">忘记密码？</a>
        </div>

        <div v-if="authStore.error" class="error-message shake-animation">
          <svg viewBox="0 0 24 24" class="error-icon">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-4h-2V7h2v6z"/>
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

      <div class="other-login-methods">
        <div class="or-divider" @click="toggleOtherLoginMethods">
          <span class="or-text">其他登录方式</span>
        </div>
        <div class="login-icons" v-if="showOtherLoginMethods">
          <a href="#" class="login-icon">
            <svg viewBox="0 0 24 24" class="icon">
              <path d="M15.5 12c0-1.9 1.6-3.5 3.5-3.5s3.5 1.6 3.5 3.5-1.6 3.5-3.5 3.5-3.5-1.6-3.5-3.5zm-7 0c0-1.9 1.6-3.5 3.5-3.5s3.5 1.6 3.5 3.5-1.6 3.5-3.5 3.5-3.5-1.6-3.5-3.5zm-7 0c0-1.9 1.6-3.5 3.5-3.5s3.5 1.6 3.5 3.5-1.6 3.5-3.5 3.5-3.5-1.6-3.5-3.5z"/>
            </svg>
            <span>微信登录</span>
          </a>
          <a href="#" class="login-icon">
            <svg viewBox="0 0 24 24" class="icon">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h2v2h-2v-2zm0-12h2v10h-2V5z"/>
            </svg>
            <span>QQ登录</span>
          </a>
          <a href="#" class="login-icon">
            <svg viewBox="0 0 24 24" class="icon">
              <path d="M17 2H7c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 18H7V4h10v16zM12 7c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>
            <span>手机号登录</span>
          </a>
        </div>
      </div>
    </div>
    
    <!-- 背景气泡动画 -->
    <div class="bg-bubbles">
      <div v-for="i in 10" :key="i" class="bubble"></div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  data() {
    return {
      features: [
        "智慧诊断辅助",
        "数据可视化分析",
        "智慧导诊平台",
        "自动化病历系统",
      ]
    }
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 50%, #a5b4fc 100%);
  overflow: hidden;
  position: relative;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.5s ease, transform 0.5s ease;
  padding: 0 5%;
}

.login-container.loaded {
  opacity: 1;
  transform: translateY(0);
}

.animation-section {
  flex: 1;
  max-width: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.eye-animation {
  position: relative;
  width: 300px;
  height: 200px;
  margin-bottom: 50px;
}

.eye-lid {
  position: absolute;
  width: 300px;
  height: 100px;
  background: linear-gradient(135deg, #6366f1 0%, #818cf8 100%);
  border-radius: 150px 150px 0 0;
  z-index: 2;
  animation: blink 4s infinite;
}

.eye-lid.top {
  top: 0;
}

.eye-lid.bottom {
  bottom: 0;
  transform: rotate(180deg);
  animation-delay: 0.1s;
}

.eye-ball {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 250px;
  height: 150px;
  background-color: white;
  border-radius: 50%;
  overflow: hidden;
  z-index: 1;
}

.eye-iris {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100px;
  height: 100px;
  background: radial-gradient(circle at 35% 35%, #4f46e5, #3730a3);
  border-radius: 50%;
  animation: look 8s infinite alternate;
}

@keyframes blink {
  0%, 45%, 55%, 100% {
    height: 100px;
  }
  48%, 52% {
    height: 10px;
  }
}

@keyframes look {
  0% {
    transform: translate(-30%, -30%);
  }
  25% {
    transform: translate(-70%, -30%);
  }
  50% {
    transform: translate(-70%, -70%);
  }
  75% {
    transform: translate(-30%, -70%);
  }
  100% {
    transform: translate(-30%, -30%);
  }
}

.clinic-info {
  text-align: center;
  color: #3730a3;
}

.clinic-info h2 {
  font-size: 28px;
  margin-bottom: 30px;
  position: relative;
  display: inline-block;
}

.clinic-info h2::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, transparent, #4f46e5, transparent);
}

.features {
  list-style: none;
  padding: 0;
  margin: 0;
}

.features li {
  margin: 15px 0;
  opacity: 0;
  transform: translateX(-50px);
  animation: slideIn 0.5s forwards;
  animation-delay: calc(var(--i) * 0.2s);
}

.features li span {
  display: inline-block;
  padding: 8px 20px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s;
}

.features li:hover span {
  background-color: rgba(255, 255, 255, 0.4);
  transform: scale(1.05);
}

@keyframes slideIn {
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.login-box {
  width: 400px;
  padding: 40px;
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(99, 102, 241, 0.2);
  text-align: center;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.logo-container {
  margin-bottom: 30px;
  transform: scale(0.9);
  transition: transform 0.4s ease;
}

.login-container.loaded .logo-container {
  transform: scale(1);
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
  transform: scale(0);
  animation: scaleIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
  animation-delay: 0.2s;
}

@keyframes scaleIn {
  from {
    transform: scale(0);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
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
  opacity: 0;
  animation: fadeInUp 0.6s ease forwards;
  animation-delay: 0.4s;
}

.subtitle {
  margin: 5px 0 0;
  color: #4f46e5;
  font-size: 14px;
  font-weight: 400;
  opacity: 0;
  animation: fadeInUp 0.6s ease forwards;
  animation-delay: 0.5s;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  opacity: 0;
  transform: translateY(10px);
  animation: fadeInUp 0.5s ease forwards;
  text-align: left;
}

.form-group:nth-child(1) {
  animation-delay: 0.6s;
}

.form-group:nth-child(2) {
  animation-delay: 0.7s;
}

.form-group:nth-child(3) {
  animation-delay: 0.8s;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: #34495e;
}

.form-group input {
  width: 100%;
  padding: 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 14px;
  transition: all 0.3s;
  background-color: rgba(224, 231, 255, 0.3);
}

.form-group input:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
  background-color: white;
  transform: translateY(-2px);
}

.form-group input::placeholder {
  color: #818cf8;
}

.remember-me {
  display: flex;
  align-items: center;
}

.forget-password {
  color: #6366f1;
  text-decoration: none;
  font-size: 14px;
}

.error-message {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  color: #dc2626;
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  font-size: 14px;
}

.shake-animation {
  animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
}

@keyframes shake {
  0%, 100% {
    transform: translateX(0);
  }
  10%, 30%, 50%, 70%, 90% {
    transform: translateX(-5px);
  }
  20%, 40%, 60%, 80% {
    transform: translateX(5px);
  }
}

.error-icon {
  width: 18px;
  height: 18px;
  fill: #dc2626;
}

.login-button {
  position: relative;
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 48px;
  opacity: 0;
  animation: fadeInUp 0.5s ease forwards;
  animation-delay: 0.8s;
  overflow: hidden;
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

.login-button:not(:disabled)::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    to bottom right,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.3) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  transform: rotate(30deg);
  transition: all 0.5s;
}

.login-button:hover:not(:disabled)::after {
  left: 100%;
  top: 100%;
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

.other-login-methods {
  margin-top: 20px;
  text-align: center;
}

.or {
  margin: 0 10px;
  color: #6366f1;
}

.login-icons {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.login-icon {
  display: inline-block;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.login-icon:hover {
  background-color: rgba(255, 255, 255, 0.4);
}

.login-icon .icon {
  width: 24px;
  height: 24px;
  fill: white;
}

/* 背景气泡动画 */
.bg-bubbles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}

.bubble {
  position: absolute;
  bottom: -100px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 50%;
  animation: rise 15s infinite ease-in;
}

.bubble:nth-child(1) {
  width: 40px;
  height: 40px;
  left: 10%;
  animation-duration: 8s;
  animation-delay: 0s;
}

.bubble:nth-child(2) {
  width: 20px;
  height: 20px;
  left: 20%;
  animation-duration: 5s;
  animation-delay: 1s;
}

.bubble:nth-child(3) {
  width: 50px;
  height: 50px;
  left: 35%;
  animation-duration: 7s;
  animation-delay: 2s;
}

.bubble:nth-child(4) {
  width: 80px;
  height: 80px;
  left: 50%;
  animation-duration: 11s;
  animation-delay: 0s;
}

.bubble:nth-child(5) {
  width: 35px;
  height: 35px;
  left: 55%;
  animation-duration: 6s;
  animation-delay: 1s;
}

.bubble:nth-child(6) {
  width: 45px;
  height: 45px;
  left: 65%;
  animation-duration: 8s;
  animation-delay: 3s;
}

.bubble:nth-child(7) {
  width: 25px;
  height: 25px;
  left: 75%;
  animation-duration: 7s;
  animation-delay: 2s;
}

.bubble:nth-child(8) {
  width: 80px;
  height: 80px;
  left: 80%;
  animation-duration: 6s;
  animation-delay: 1s;
}

.bubble:nth-child(9) {
  width: 15px;
  height: 15px;
  left: 70%;
  animation-duration: 9s;
  animation-delay: 0s;
}

.bubble:nth-child(10) {
  width: 50px;
  height: 50px;
  left: 85%;
  animation-duration: 5s;
  animation-delay: 3s;
}

@keyframes rise {
  0% {
    bottom: -100px;
    transform: translateX(0);
  }
  50% {
    transform: translateX(100px);
  }
  100% {
    bottom: 1080px;
    transform: translateX(-200px);
  }
}

/* 响应式设计 */
@media (max-width: 992px) {
  .login-container {
    flex-direction: column;
    justify-content: center;
    padding: 20px;
  }
  
  .animation-section {
    max-width: 100%;
    margin-bottom: 40px;
  }
  
  .eye-animation {
    width: 200px;
    height: 150px;
  }
  
  .eye-lid {
    width: 200px;
    height: 75px;
  }
  
  .eye-ball {
    width: 180px;
    height: 100px;
  }
  
  .eye-iris {
    width: 70px;
    height: 70px;
  }
}

@media (max-width: 576px) {
  .login-box {
    width: 100%;
    padding: 30px 20px;
  }
  
  .clinic-info h2 {
    font-size: 24px;
  }
  
  .features li span {
    padding: 6px 15px;
    font-size: 14px;
  }
}

.remember-forget {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: -10px;
  margin-bottom: 10px;
}

.remember-me-container {
  display: flex;
  align-items: center;
}

.remember-checkbox {
  margin-right: 8px;
  width: 16px;
  height: 16px;
  accent-color: #6366f1;
}

.forget-password {
  color: #6366f1;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.2s;
}

.forget-password:hover {
  color: #4f46e5;
  text-decoration: underline;
}

/* 更新其他登录方式样式 */
.other-login-methods {
  margin-top: 20px;
  text-align: center;
}

.or-divider {
  position: relative;
  margin: 20px 0;
  cursor: pointer;
  color: #6366f1;
  font-size: 14px;
}

.or-divider::before,
.or-divider::after {
  content: "";
  position: absolute;
  top: 50%;
  width: 30%;
  height: 1px;
  background-color: #e2e8f0;
}

.or-divider::before {
  left: 0;
}

.or-divider::after {
  right: 0;
}

.or-text {
  padding: 0 10px;
  background-color: white;
  position: relative;
  z-index: 1;
  transition: all 0.3s;
}

.or-divider:hover .or-text {
  color: #4f46e5;
}

.login-icons {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 15px;
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-icon {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 80px;
  padding: 10px;
  border-radius: 8px;
  color: #4f46e5;
  text-decoration: none;
  font-size: 12px;
  transition: all 0.3s;
  background-color: rgba(224, 231, 255, 0.3);
}

.login-icon:hover {
  background-color: rgba(99, 102, 241, 0.1);
  transform: translateY(-2px);
}

.login-icon .icon {
  width: 24px;
  height: 24px;
  margin-bottom: 5px;
  fill: #6366f1;
}

.login-icon span {
  margin-top: 5px;
}
</style>