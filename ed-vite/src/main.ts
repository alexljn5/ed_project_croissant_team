import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import * as L from 'leaflet'            // ← YOU FORGOT THIS!
import 'leaflet/dist/leaflet.css'

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// Create and mount Vue app with router
const app = createApp(App)
app.use(router)

// Runtime safety: if /admin route isn't registered (hot-reload or prior compile error), add it dynamically
const hasAdmin = router.getRoutes().some(r => r.path === '/admin')
console.log('[main] initial routes:', router.getRoutes().map(r => r.path))
if (!hasAdmin) {
  // dynamic import so build won't fail if file temporarily had errors
  import('./pages/Admin.vue')
    .then(mod => {
      router.addRoute({ path: '/admin', name: 'Admin', component: mod.default })
      console.log('[main] dynamically added /admin route')
      // if user is already at /admin, force replace so new route is resolved
      if (router.currentRoute.value.path === '/admin') {
        router.replace(router.currentRoute.value.fullPath).catch(() => { })
      }
    })
    .catch(err => {
      console.error('[main] failed to dynamically add /admin:', err)
    })
}

app.mount('#app')

// Make Leaflet global if needed
window.L = L
