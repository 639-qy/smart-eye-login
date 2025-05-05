import { createApp } from 'vue'
import { createPinia } from 'pinia' // Import Pinia
import App from './App.vue'
import router from './router'      // Import router configuration
import './assets/main.css'         // Optional: Import base styles

const app = createApp(App)

app.use(createPinia()) // Use Pinia
app.use(router)        // Use Vue Router

app.mount('#app')
