// src/composables/useMap.ts
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix voor default iconen in Vite/Vue
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

let map: L.Map | null = null
const routesGroup = new L.FeatureGroup()
const tempGroup = new L.FeatureGroup()

export function useMap() {
  const initMap = (containerId: string) => {
    if (map) map.remove()

    map = L.map(containerId).setView([52.518611, 5.471389], 13)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map)

    routesGroup.addTo(map)
    tempGroup.addTo(map)

    addExampleMarkers()
    loadRoutes()
  }

  const addExampleMarkers = () => {
    if (!map) return

    const purple = L.icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    })

    L.marker([52.5205, 5.4790], { icon: purple })
      .addTo(map)
      .bindPopup('<img src="/src/assets/img/agora.webp" width="200" style="border-radius:8px"><br><strong>De Agora</strong>')

    L.marker([52.5220, 5.4810], { icon: purple })
      .addTo(map)
      .bindPopup('Test Marker 2')

    // Rode testlijn
    tempGroup.clearLayers()
    L.polyline(
      [
        [52.5205, 5.4790],
        [52.5220, 5.4810],
      ],
      { color: '#ff0000', weight: 5, dashArray: '10,10' }
    ).addTo(tempGroup)
  }

  const loadRoutes = async () => {
    routesGroup.clearLayers()

    try {
      const res = await fetch('http://127.0.0.1:8000/api/content/walking-routes')
      if (!res.ok) throw new Error('HTTP ' + res.status)
      const json = await res.json()

      const routes = json.value || json.data || json

      if (Array.isArray(routes)) {
        routes.forEach((r: any) => {
          if (r.coordinates?.length >= 2) {
            const coords = r.coordinates.map((p: any) => [p.lat, p.lng] as [number, number])
            L.polyline(coords, {
              color: '#6b3f7b',
              weight: 5,
              opacity: 0.8,
              dashArray: '8,8',
            })
              .bindPopup(`<b>${r.name || 'Route'}</b>`)
              .addTo(routesGroup)
          }
        })

        if (routes.length > 0) {
          map?.fitBounds(routesGroup.getBounds(), { padding: [50, 50] })
        }
      }
    } catch (e) {
      console.error('Routes laden mislukt', e)
    }
  }

  const refresh = async () => {
    await loadRoutes()
  }

  return {
    initMap,
    refresh,
  }
}