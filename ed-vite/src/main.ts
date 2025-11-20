import { createApp } from 'vue'
import TestConnection from './components/TestConnection.vue'
import 'leaflet/dist/leaflet.css'

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