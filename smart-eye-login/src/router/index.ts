import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
// Import your authenticated view (e.g., Dashboard) later
// import DashboardView from '../views/DashboardView.vue'
import { useAuthStore } from '../stores/auth' // Import auth store

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: LoginView,
      // Prevent logged-in users from accessing the login page again
      beforeEnter: (to, from, next) => {
        const authStore = useAuthStore(); // Access store *inside* guard
        if (authStore.isAuthenticated) {
          next({ name: 'Dashboard' }); // Redirect to dashboard if logged in
        } else {
          next(); // Allow access if not logged in
        }
      }
    },
    {
       // Default route redirects to login if not authenticated, or dashboard if authenticated
      path: '/',
      redirect: () => {
        const authStore = useAuthStore();
        return authStore.isAuthenticated ? { name: 'Dashboard' } : { name: 'Login' };
      }
    },
    {
      path: '/dashboard', // Example protected route
      name: 'Dashboard',
      // Lazy load the component for better performance
      component: () => import('../views/DashboardView.vue'),
      meta: { requiresAuth: true } // Mark this route as requiring authentication
    }
    // Add other routes here
  ]
})

// --- Navigation Guard ---
// Checks authentication before each navigation
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore(); // Access store *inside* guard

  // Check if the route requires authentication
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // If not authenticated, redirect to login page
    // Preserve the intended destination route in query params (optional)
    next({ name: 'Login', query: { redirect: to.fullPath } });
  } else {
    // Otherwise, allow navigation
    next();
  }
});

export default router
