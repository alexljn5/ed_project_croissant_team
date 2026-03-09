// useMap.ts
import { ref } from 'vue'
import * as L from 'leaflet'
import {
  initMap as leafletInitMap,
  addMarker as mapAddMarker,
  removeMarker as mapRemoveMarker,
} from '../leaflet/map'

// fixed imports for local assets (if used)
const markerImg = '/img/markers/marker.png';
const agoraImg = '/img/agora.webp';

export interface POI {
  id: string
  lat: number
  lng: number
  imageUrl?: string          // ← optional
  shortDescription: string
  longDescription?: string   // ← THIS MUST BE OPTIONAL
}

let mapInstance: L.Map | null = null
let routesGroup: L.FeatureGroup | null = null
let tempGroup: L.FeatureGroup | null = null
let routeLayer: L.Polyline | null = null      // persisted/saved route
let previewLayer: L.Polyline | null = null    // live admin preview

export function useMap() {
  const isLoading = ref(false)
  const pois = ref<POI[]>([])
  const savedCoordinates = ref<{ lat: number; lng: number } | null>(null)

  // ---------------- helpers ----------------
  function ensureGroups() {
    if (!mapInstance) return
    if (!routesGroup) {
      routesGroup = new L.FeatureGroup().addTo(mapInstance)
    }
    if (!tempGroup) {
      tempGroup = new L.FeatureGroup().addTo(mapInstance)
    }
  }

  function clearPreview() {
    try {
      if (previewLayer && tempGroup) {
        tempGroup.removeLayer(previewLayer)
      }
    } catch (e) { /* ignore */ }
    previewLayer = null
  }

  function clearSavedRoute() {
    try {
      if (routeLayer && routesGroup) {
        routesGroup.removeLayer(routeLayer)
      }
    } catch (e) { /* ignore */ }
    routeLayer = null
  }

  // Render a saved (persistent) route
  function renderSavedRoute(coords: Array<{ lat: number; lng: number }>, opts?: { name?: string }) {
    if (!mapInstance) return
    ensureGroups()
    clearSavedRoute()
    if (!coords || coords.length < 2) return

    const cleaned = coords
      .map(c => ({ lat: Number(c.lat), lng: Number(c.lng) }))
      .filter(c => !Number.isNaN(c.lat) && !Number.isNaN(c.lng))
    if (cleaned.length < 2) return

    const latlngs: L.LatLngExpression[] = cleaned.map(p => [p.lat, p.lng])
    routeLayer = L.polyline(latlngs, {
      color: '#6b3f7b',
      weight: 5,
      opacity: 0.95,
    }).bindPopup(`<b>${opts?.name ?? 'Route'}</b>`)
    routesGroup!.addLayer(routeLayer)
  }

  // Render a preview route (used by admin while editing)
  function renderPreviewRoute(coords: Array<{ lat: number; lng: number }>) {
    if (!mapInstance) return
    ensureGroups()
    clearPreview()
    if (!coords || coords.length < 2) return

    const cleaned = coords
      .map(c => ({ lat: Number(c.lat), lng: Number(c.lng) }))
      .filter(c => !Number.isNaN(c.lat) && !Number.isNaN(c.lng))
    if (cleaned.length < 2) return

    const latlngs: L.LatLngExpression[] = cleaned.map(p => [p.lat, p.lng])
    previewLayer = L.polyline(latlngs, {
      color: '#ff9800',
      weight: 4,
      opacity: 0.9,
      dashArray: '6,4',
    })
    tempGroup!.addLayer(previewLayer)
  }

  // ---------------- init map ----------------
  function init(containerId: string) {
    mapInstance = leafletInitMap(containerId)
    routesGroup = new L.FeatureGroup().addTo(mapInstance)
    tempGroup = new L.FeatureGroup().addTo(mapInstance)

    const coordsElement = document.getElementById('cursor-coords')
    if (coordsElement && mapInstance) {
      mapInstance.on('mousemove', (e: L.LeafletMouseEvent) => {
        coordsElement.innerHTML = `Lat: ${e.latlng.lat.toFixed(6)} | Lng: ${e.latlng.lng.toFixed(6)}`
      })
      mapInstance.on('mouseout', () => {
        coordsElement.innerHTML = 'Lat: — | Lng: —'
      })
    }

    setupMapClickHandler()
    addExampleMarkers()
    return mapInstance
  }

  // ---------------- ROUTE API ----------------
  async function loadRoute() {
    if (!mapInstance) return null
    try {
      const res = await fetch('http://127.0.0.1:8000/api/content/walking-route')
      if (!res.ok) return null
      const data = await res.json()
      const coords = data?.value ?? data
      if (!coords || !Array.isArray(coords)) return null
      renderSavedRoute(coords, { name: data?.name ?? 'Walking route' })
      return coords
    } catch (e) {
      console.warn('⚠️ loadRoute failed:', e)
      return null
    }
  }

  async function saveRoute(coordinates: Array<{ lat: number; lng: number }>) {
    try {
      const headers = { 
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      }
      const res = await fetch('http://127.0.0.1:8000/api/content/walking-route', {
        method: 'POST',
        headers,
        body: JSON.stringify({ value: coordinates }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || `HTTP ${res.status}`)
      }
      clearPreview()
      renderSavedRoute(coordinates, { name: 'Saved route' })
      console.log('✓ Route saved successfully')
      return true
    } catch (e) {
      console.error('❌ saveRoute failed:', e)
      alert('Failed to save route')
      return false
    }
  }

  function updateRoute(coords: Array<{ lat: number; lng: number }>) {
    renderPreviewRoute(coords)
  }

  // Helper to get auth token
  function getAuthHeaders() {
    const token = localStorage.getItem('admin_token')
    return token ? { 'Authorization': `Bearer ${token}` } : {}
  }

  // Setup map click handler to save coordinates (admin only)
  function setupMapClickHandler() {
    if (!mapInstance) {
      console.warn('⚠️ mapInstance is null, cannot setup click handler')
      return
    }
    console.log('✓ Setting up map click handler')
    mapInstance.on('click', (e: L.LeafletMouseEvent) => {
      savedCoordinates.value = {
        lat: Number(e.latlng.lat.toFixed(6)),
        lng: Number(e.latlng.lng.toFixed(6))
      }
      console.log('✓ Coördinaten opgeslagen:', savedCoordinates.value)
    })
  }

  // ---------------- POI MARKERS ----------------
  async function loadMarkers() {
    if (!mapInstance) return null
    try {
      const headers = { ...getAuthHeaders() }
      const res = await fetch('http://127.0.0.1:8000/api/content/poi-markers', {
        headers
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || `HTTP ${res.status}`)
      }
      const data = await res.json()
      const arr = data?.value ?? data
      if (!arr || !Array.isArray(arr)) return null
      pois.value = arr.map((poi: any) => ({
        id: poi.id || crypto.randomUUID(),
        lat: Number(poi.lat),
        lng: Number(poi.lng),
        shortDescription: poi.shortDescription || 'Nieuwe POI',
        longDescription: poi.longDescription || '',
        imageUrl: poi.imageUrl || ''
      }))
      pois.value.forEach(poi => mapAddMarker(mapInstance!, poi))
      return pois.value
    } catch (e) {
      console.warn('⚠️ loadMarkers failed:', e)
      return null
    }
  }

  async function saveMarkers() {
    try {
      const headers = { 
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      }
      const res = await fetch('http://127.0.0.1:8000/api/content/poi-markers', {
        method: 'POST',
        headers,
        body: JSON.stringify({ value: pois.value }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || `HTTP ${res.status}: ${err.message || 'Unknown error'}`)
      }
      const result = await res.json()
      console.log('✓ POI markers saved successfully:', result)
      return true
    } catch (e) {
      console.error('❌ saveMarkers failed:', e)
      alert(`Failed to save markers: ${e instanceof Error ? e.message : String(e)}`)
      return false
    }
  }

  function addPOI(poi: Partial<POI>) {
    if (!mapInstance) return
    const newPOI: POI = {
      id: poi.id || crypto.randomUUID(),
      lat: poi.lat ?? 0,
      lng: poi.lng ?? 0,
      shortDescription: poi.shortDescription?.trim() || 'Nieuwe POI',
      longDescription: poi.longDescription || '',
      imageUrl: poi.imageUrl || ''
    }
    pois.value.push(newPOI)
    mapAddMarker(mapInstance, newPOI)
  }

  function removePOI(id: string) {
    const idx = pois.value.findIndex(p => p.id === id)
    if (idx !== -1) {
      const toRemove = pois.value[idx]
      mapRemoveMarker(toRemove)
      pois.value.splice(idx, 1)
    }
  }

  function updatePOI(id: string, updates: Partial<POI>) {
    const poi = pois.value.find(p => p.id === id)
    if (poi) {
      Object.assign(poi, updates)
      if (mapInstance) {
        mapRemoveMarker(poi)
        mapAddMarker(mapInstance, poi)
      }
    }
  }

  // ---------------- example markers ----------------
  function addExampleMarkers() {
    if (!mapInstance) return
    const customPurpleIcon = L.icon({
      iconUrl: markerImg,
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      iconSize: [24, 48],
      iconAnchor: [12, 48],
      popupAnchor: [0, -48],
      shadowSize: [41, 41],
    })

    const examplePoi: POI = {
      id: 'example-agora',
      lat: 52.5186,
      lng: 5.4713,
      imageUrl: agoraImg,
      shortDescription: 'Voorbeeld POI',
      longDescription: 'Een voorbeeldmarker'  // ← add this line
    }

    L.marker([examplePoi.lat, examplePoi.lng], { icon: customPurpleIcon })
      .bindPopup(`<b>${examplePoi.shortDescription}</b><br>${examplePoi.lat}, ${examplePoi.lng}`)
      .addTo(mapInstance)
  }

  // ---------------- external routes ----------------
  async function loadExternalRoutes() {
    if (!mapInstance) return
    if (!routesGroup) routesGroup = new L.FeatureGroup().addTo(mapInstance)
    routesGroup.clearLayers()

    try {
      const res = await fetch('http://127.0.0.1:8000/api/content/walking-routes')
      if (!res.ok) throw new Error('HTTP ' + res.status)
      const json = await res.json()
      const routes = json.value || json.data || json
      if (Array.isArray(routes)) {
        routes.forEach((r: any) => {
          if (r.coordinates?.length >= 2) {
            const coords = r.coordinates.map((p: any) => [Number(p.lat), Number(p.lng)] as [number, number])
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
      }
    } catch (e) {
      console.error('loadExternalRoutes failed', e)
    }
  }

  async function refresh() {
    await loadExternalRoutes().catch(() => { })
    await loadRoute().catch(() => { })
  }

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
    savedCoordinates,
    setupMapClickHandler,
  }
}
