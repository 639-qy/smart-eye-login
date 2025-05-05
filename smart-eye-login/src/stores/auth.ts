import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useRouter } from 'vue-router' // Import if you need router inside the store

// Optional: Define user data structure
interface User {
  id: string | number;
  username: string;
  // Add other relevant user fields
}

// Optional: Define login credentials structure
interface LoginCredentials {
  username: string;
  password?: string; // Password might not be needed in the store state itself
  // Add other credentials like verification code if needed
}

export const useAuthStore = defineStore('auth', () => {
  // --- State ---
  // Initialize token from localStorage for persistence
  const token = ref<string | null>(localStorage.getItem('authToken'));
  const user = ref<User | null>(null); // Store user info after login
  const loading = ref<boolean>(false); // Track loading state during login
  const error = ref<string | null>(null); // Store login error messages

  // --- Getters (Computed) ---
  const isAuthenticated = computed<boolean>(() => !!token.value);

  // --- Actions ---
  async function login(credentials: LoginCredentials): Promise<void> {
    loading.value = true;
    error.value = null;
    console.log('Attempting login with:', credentials); // Debug log

    try {
      // --- !!! REPLACE WITH ACTUAL API CALL !!! ---
      // Example: Using fetch
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(credentials)
      // });
      // if (!response.ok) {
      //    const errorData = await response.json();
      //    throw new Error(errorData.message || 'Login failed');
      // }
      // const data = await response.json(); // { token: '...', user: {...} }

      // --- MOCK API CALL (REMOVE IN REAL APP) ---
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      if (credentials.username === 'admin' && credentials.password === 'password123') {
        // Mock successful login
        const mockToken = 'fake-jwt-token-' + Date.now();
        const mockUser: User = { id: 1, username: credentials.username };

        // Update state
        token.value = mockToken;
        user.value = mockUser;

        // Persist token
        localStorage.setItem('authToken', mockToken);

        console.log('Login successful, token:', mockToken); // Debug log

        // --- Navigation after successful login ---
        // Option 1: Handled by component or router guard (preferred)
        // Option 2: Navigate from store (requires injecting router or passing it)
        // const router = useRouter(); // Only works in setup(), not ideal here
        // router.push('/dashboard'); // Use if router is injected/passed

      } else {
        // Mock failed login
        throw new Error('用户名或密码错误'); // Incorrect username/password
      }
      // --- END MOCK API CALL ---

    } catch (err: any) {
      console.error('Login error:', err); // Debug log
      error.value = err.message || '登录时发生未知错误'; // Set error message
      // Ensure token/user are cleared on error
      token.value = null;
      user.value = null;
      localStorage.removeItem('authToken');
      throw err; // Re-throw error so the component can know login failed
    } finally {
      loading.value = false; // Ensure loading is always turned off
    }
  }

  function logout(): void {
    console.log('Logging out'); // Debug log
    token.value = null;
    user.value = null;
    error.value = null; // Clear any previous errors
    localStorage.removeItem('authToken');
    // --- Navigation after logout ---
    // Usually handled by a router guard or manually in the component triggering logout
    // Example: router.push('/login');
  }

  // Optional: Action to check auth status on app load (e.g., fetch user profile if token exists)
  async function checkAuthStatus() {
    if (token.value && !user.value) {
      // If we have a token but no user data, try to fetch user profile
      try {
        // --- !!! REPLACE WITH ACTUAL API CALL to /api/auth/me or similar !!! ---
        console.log('Checking auth status, fetching user profile...');
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
        // Assume API returns user based on token in Authorization header
        const mockUser: User = { id: 1, username: 'admin' }; // Mock response
        user.value = mockUser;
        console.log('User profile fetched:', user.value);
      } catch (err) {
        console.error('Failed to fetch user profile:', err);
        // Token might be invalid/expired, log out
        logout();
      }
    }
  }

  // 初始化时检查认证状态
  checkAuthStatus()

  // Return state and actions
  return {
    token,
    user,
    loading,
    error,
    isAuthenticated,
    login,
    logout,
    checkAuthStatus // Expose if needed
  }
})
