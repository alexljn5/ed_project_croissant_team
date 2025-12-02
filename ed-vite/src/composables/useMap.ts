import { ref } from 'vue'
import { initMap, drawRoute, updateRoute } from '../leaflet/map'
import type L from 'leaflet'

let mapInstance: L.Map | null = null

export function useMap() {
  const isLoading = ref(false)

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
        console.log('Route loaded from database')
        return data.value
      }
      return null
    } catch (e) {
      console.warn('Could not load route:', e)
      return null
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
      console.log('Route saved to database!')
      return true
    } catch (e) {
      console.error('Failed to save route:', e)
      alert('Failed to save route')
      return false
    }
  }

  return {
    initMap: init,
    loadRoute,
    saveRoute,
    updateRoute
  }
}
