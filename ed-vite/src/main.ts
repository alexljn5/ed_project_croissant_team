import { createApp } from 'vue'
import App from './App.vue'

// Leaflet CSS & JS
import 'leaflet/dist/leaflet.css'
import * as L from 'leaflet'

// Fix for default markers in Leaflet with Webpack/Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Create and mount Vue app
const app = createApp(App)
app.mount('#app')

// Make Leaflet available globally if needed
window.L = L;