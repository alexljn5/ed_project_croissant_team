import { ref } from 'vue'
import { initMap, drawRoute, updateRoute, addMarker as mapAddMarker, removeMarker as mapRemoveMarker } from '../leaflet/map'
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

export function useMap() {
  const isLoading = ref(false)
  const pois = ref<POI[]>([])

  function init(containerId: string) {
    mapInstance = initMap(containerId)
    return mapInstance
  }

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

  async function loadMarkers() {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/content/poi-markers')
      if (!res.ok) throw new Error('Failed to load markers')
      const data = await res.json()

      if (mapInstance && data.value) {
        pois.value = data.value
        // Draw all markers on map
        data.value.forEach((poi: POI) => {
          mapAddMarker(mapInstance!, poi)
        })
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
        body: JSON.stringify({ value: pois.value })
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
    if (mapInstance) {
      mapAddMarker(mapInstance, poi)
    }
  }

  function removePOI(id: string) {
    const idx = pois.value.findIndex(p => p.id === id)
    if (idx !== -1) {
      mapRemoveMarker(pois.value[idx])
      pois.value.splice(idx, 1)
    }
  }

  async function saveRoute(coordinates: Array<{ lat: number; lng: number }>) {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/content/walking-route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: coordinates })
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
    saveMarkers
  }
}
