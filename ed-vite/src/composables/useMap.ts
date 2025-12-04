import { ref } from 'vue'
import {
  initMap as leafletInitMap,
  drawRoute,
  updateRoute,
  addMarker as mapAddMarker,
  removeMarker as mapRemoveMarker,
} from '../leaflet/map'
import type L from 'leaflet'

export interface POI {
  id: string
  lat: number
  lng: number
  imageUrl: string
  shortDescription: string
  longDescription: string
}

let mapInstance: L.Map | null = null

// Extra groepen uit tweede bestand
let routesGroup: L.FeatureGroup | null = null
let tempGroup: L.FeatureGroup | null = null

export function useMap() {
  const isLoading = ref(false)
  const pois = ref<POI[]>([])

  // ---------- INIT MAP ----------
  function init(containerId: string) {
    // map aanmaken via bestaande leaflet init
    mapInstance = leafletInitMap(containerId)

    // extra groups toevoegen
    routesGroup = new L.FeatureGroup()
    tempGroup = new L.FeatureGroup()

    routesGroup.addTo(mapInstance)
    tempGroup.addTo(mapInstance)

    // live cursor coords
    const coordsElement = document.getElementById('cursor-coords')
    if (coordsElement) {
      mapInstance.on('mousemove', (e: L.LeafletMouseEvent) => {
        coordsElement.innerHTML = `Lat: ${e.latlng.lat.toFixed(6)} | Lng: ${e.latlng.lng.toFixed(6)}`
      })

      mapInstance.on('mouseout', () => {
        coordsElement.innerHTML = 'Lat: — | Lng: —'
      })
    }

    // voorbeeld markers
    addExampleMarkers()

    // extra routes laden
    loadExternalRoutes()

    return mapInstance
  }

  // ---------- ROUTE API LOAD ----------
  async function loadRoute() {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/content/walking-route')
      if (!res.ok) throw new Error('Failed to load route')
      const data = await res.json()

      if (mapInstance && data.value) {
        drawRoute(mapInstance, data.value)
        console.log('✅ Waypoints loaded from database')
        return data.value
      }
      return null
    } catch (e) {
      console.warn('Could not load waypoints:', e)
      return null
    }
  }

  async function saveRoute(coordinates: Array<{ lat: number; lng: number }>) {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/content/walking-route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: coordinates }),
      })

      if (!res.ok) throw new Error('Failed to save route')
      console.log('✅ Route saved to database!')
      return true
    } catch (e) {
      console.error('Failed to save route:', e)
      alert('Failed to save route')
      return false
    }
  }

  // ---------- POI MARKERS ----------
  async function loadMarkers() {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/content/poi-markers')
      if (!res.ok) throw new Error('Failed to load markers')
      const data = await res.json()

      if (mapInstance && data.value) {
        pois.value = data.value
        data.value.forEach((poi: POI) => mapAddMarker(mapInstance!, poi))
        console.log('✅ Markers loaded from database')
        return data.value
      }
      return null
    } catch (e) {
      console.warn('Could not load markers:', e)
      return null
    }
  }

  async function saveMarkers() {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/content/poi-markers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: pois.value }),
      })

      if (!res.ok) throw new Error('Failed to save markers')
      console.log('✅ Markers saved to database!')
      return true
    } catch (e) {
      console.error('Failed to save markers:', e)
      alert('Failed to save markers')
      return false
    }
  }

  function addPOI(poi: POI) {
    pois.value.push(poi)
    if (mapInstance) mapAddMarker(mapInstance, poi)
  }

  function removePOI(id: string) {
    const idx = pois.value.findIndex((p) => p.id === id)
    if (idx !== -1) {
      mapRemoveMarker(pois.value[idx])
      pois.value.splice(idx, 1)
    }
  }

  function updatePOI(id: string, updates: Partial<POI>) {
    const poi = pois.value.find((p) => p.id === id)
    if (poi) {
      Object.assign(poi, updates)
      if (mapInstance) {
        mapRemoveMarker(poi)
        mapAddMarker(mapInstance, poi)
      }
    }
  }

  // ---------- EXTRA FUNCTIES UIT TWEEDE BESTAND ----------
  function addExampleMarkers() {
    if (!mapInstance) return

    const purple = L.icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    })

    L.marker([52.5205, 5.479], { icon: purple })
      .addTo(mapInstance)
      .bindPopup('<img src="/src/assets/img/agora.webp" width="200" style="border-radius:8px"><br><strong>De Agora</strong>')

    L.marker([52.522, 5.481], { icon: purple }).addTo(mapInstance).bindPopup('Test Marker 2')
  }

  async function loadExternalRoutes() {
    if (!routesGroup) return
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
              .addTo(routesGroup!)
          }
        })

        if (routes.length > 0) {
          mapInstance?.fitBounds(routesGroup.getBounds(), { padding: [50, 50] })
        }
      }
    } catch (e) {
      console.error('Routes laden mislukt', e)
    }
  }

  async function refresh() {
    await loadExternalRoutes()
  }

  // ---------- RETURN EXPORT ----------
  return {
    initMap: init,
    loadRoute,
    saveRoute,
    updateRoute,
    pois,
    addPOI,
    removePOI,
    updatePOI,
    loadMarkers,
    saveMarkers,
    refresh,
  }
}

