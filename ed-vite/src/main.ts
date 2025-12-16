import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

let leafletPromise: Promise<any> | null = null

export async function useLeaflet() {
  if (leafletPromise) return leafletPromise

  leafletPromise = (async () => {
    // 1. Dynamically import Leaflet (code-splitted → homepage stays tiny!)
    const L = await import('leaflet')

    // 2. Fix the famous default marker icon bug (only runs when map is needed)
    delete (L.Icon.Default.prototype as any)._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    })

    // 3. Make it globally available for any component that still uses window.L
    // @ts-ignore
    window.L = L
    // Also return it normally in case someone does `import L from 'leaflet'`
    return L
  })()

  return leafletPromise
}

// ────────────────────────────────
//  Normal Vue app setup (super clean now!)
// ────────────────────────────────
const app = createApp(App)
app.use(router)

// Keep your admin route dynamic loading (unchanged)
const hasAdmin = router.getRoutes().some(r => r.path === '/admin')
console.log('[main] initial routes:', router.getRoutes().map(r => r.path))

if (!hasAdmin) {
  import('./pages/Admin.vue')
    .then(mod => {
      router.addRoute({ path: '/admin', name: 'Admin', component: mod.default })
      console.log('[main] dynamically added /admin route')
      if (router.currentRoute.value.path === '/admin') {
        router.replace(router.currentRoute.value.fullPath).catch(() => { })
      }
    })
    .catch(err => {
      console.error('[main] failed to dynamically add /admin:', err)
    })
}

app.mount('#app')

// ────────────────────────────────
//  Bonus: Auto-load Leaflet when you visit a route that needs it
//  (optional but super handy!)
// ────────────────────────────────
router.beforeEach(async (to, from, next) => {
  // Add your map route names/paths here ♡
  const routesThatNeedMap = ['/route', '/plan', '/map', '/admin'] // ← change to your actual routes!

  if (routesThatNeedMap.some(r => to.path.startsWith(r))) {
    await useLeaflet()  // ← Leaflet loads only now!
  }
  next()
})