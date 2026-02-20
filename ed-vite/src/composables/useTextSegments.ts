import { ref, onMounted } from 'vue'

function getBackendUrl(): string {
  const origin = window.location.origin
  if (origin.includes('5173')) {
    return 'http://127.0.0.1:8000'
  }
  return origin
}

export function useTextSegments() {
  const segments = ref<any[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const loadSegments = async () => {
    isLoading.value = true
    error.value = null

    const backendUrl = getBackendUrl()
    try {
      console.log(`[useTextSegments] Loading from ${backendUrl}/api/content/text-segments`)
      const response = await fetch(`${backendUrl}/api/content/text-segments`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const data = await response.json()

      console.log('Raw API data:', data); // Debug: zie wat de API echt retourneert

      // API returns { value: [...] } so extract the array
      let loadedSegments = data.value || []
      if (!Array.isArray(loadedSegments)) {
        loadedSegments = []
      }

      console.log('Parsed loadedSegments:', loadedSegments); // Debug: voor sort

      // Sorteer alleen als het een array is
      if (Array.isArray(loadedSegments)) {
        loadedSegments.sort((a: any, b: any) => (a.order_index ?? 999) - (b.order_index ?? 999))
      } else {
        console.warn('Loaded segments is not an array, setting to empty')
        loadedSegments = []
      }

      segments.value = loadedSegments
    } catch (err: any) {
      console.error('Fout bij laden van tekstsegmenten:', err)
      error.value = 'Kon de tekstsegmenten niet laden: ' + (err.message || 'onbekend probleem')
    } finally {
      isLoading.value = false
    }
  }

  const saveSegments = async () => {
    if (segments.value.length === 0) {
      error.value = 'Geen segmenten om op te slaan'
      return
    }

    isLoading.value = true
    error.value = null

    const backendUrl = getBackendUrl()
    try {
      const response = await fetch(`${backendUrl}/api/content/text-segments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          value: segments.value,  // Send as { value: [...] } to match /api/content/{key} endpoint
        }),
      })

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}))
        throw new Error(errData.message || `Status ${response.status}`)
      }

      console.log('Segmenten succesvol opgeslagen')
      // Don't reload here - let the component handle UI update
    } catch (err: any) {
      console.error('Fout bij opslaan:', err)
      error.value = 'Opslaan mislukt: ' + (err.message || 'onbekend probleem')
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Auto-load on component mount
  onMounted(() => {
    loadSegments()
  })

  return {
    segments,
    isLoading,
    error,
    loadSegments,
    saveSegments,
  }
}