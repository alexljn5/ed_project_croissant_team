// src/composables/useTextSegments.ts
import { ref } from 'vue'

// Helper: detect backend URL (localhost:5173 -> localhost:8000)
function getBackendUrl() {
  return window.location.origin.includes('5173')
    ? 'http://localhost:8000'
    : window.location.origin
}

export function useTextSegments() {
  const segments = ref<any[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const loadSegments = async () => {
    isLoading.value = true
    error.value = null

    try {
      const backendUrl = getBackendUrl()
      const response = await fetch(`${backendUrl}/api/content/text-segments`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        credentials: 'same-origin',
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const data = await response.json()

      console.log('Raw API data:', data); // Debug: zie wat de API echt retourneert

      // API returns { value: [...] }, extract it
      let loadedSegments = data.value || data || []

      // Ensure it's an array
      if (!Array.isArray(loadedSegments)) {
        loadedSegments = []
      }

      console.log('Parsed loadedSegments:', loadedSegments); // Debug: voor sort

      // Sort by order_index
      loadedSegments.sort((a: any, b: any) => (a.order_index ?? 999) - (b.order_index ?? 999))

      segments.value = loadedSegments
    } catch (err: any) {
      console.error('Fout bij laden van tekstsegmenten:', err)
      error.value = 'Kon de tekstsegmenten niet laden: ' + (err.message || 'onbekend probleem')
    } finally {
      isLoading.value = false
    }
  }

  const saveSegments = async () => {
    isLoading.value = true
    error.value = null

    try {
      const backendUrl = getBackendUrl()
      const response = await fetch(`${backendUrl}/api/content/text-segments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify(JSON.parse(JSON.stringify(segments.value))), // Strip Vue proxies
      })

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}))
        throw new Error(errData.message || `Status ${response.status}`)
      }

      console.log('Segmenten succesvol opgeslagen')
      // Herlaad na opslaan om te syncen
      await loadSegments()
    } catch (err: any) {
      console.error('Fout bij opslaan:', err)
      error.value = 'Opslaan mislukt: ' + (err.message || 'onbekend probleem')
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    segments,
    isLoading,
    error,
    loadSegments,
    saveSegments,
  }
}