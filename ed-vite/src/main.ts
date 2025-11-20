import { createApp } from 'vue'
import TestConnection from './components/TestConnection.vue'
import 'leaflet/dist/leaflet.css'
import App from './App.vue'

createApp(App).mount('#app')

<<<<<<< Updated upstream
createApp({
  components: {
    TestConnection
  },
  template: `
    <div class="min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 flex items-center justify-center">
      <div class="text-center text-white">
        <h1 class="text-7xl font-bold mb-8">Vue is alive!</h1>
        <p class="text-3xl">Now watch the corner badge...</p>
      </div>
      <TestConnection />
    </div>
  `
}).mount('#app')
=======
// Fix for default markers in Leaflet with Webpack/Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Create and mount Vue app
const app = createApp(App)
app.mount('#app')

// Make Leaflet available globally if needed
window.L = L;
>>>>>>> Stashed changes
