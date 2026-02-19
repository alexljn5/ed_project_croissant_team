// src/composables/useTextSegments.ts
import { ref } from 'vue'

export function useTextSegments() {
  const segments = ref<any[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const loadSegments = async () => {
    isLoading.value = true
    error.value = null

    try {
      const response = await fetch('/api/text-segments', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        credentials: 'same-origin', // belangrijk voor Laravel session / Sanctum
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const data = await response.json()

      console.log('Raw API data:', data); // Debug: zie wat de API echt retourneert

      // Normaliseer altijd naar array
      let loadedSegments = Array.isArray(data) 
        ? data 
        : (Array.isArray(data.content) ? data.content : (Array.isArray(data) ? data : []));

      console.log('Parsed loadedSegments:', loadedSegments); // Debug: voor sort

      // Sorteer alleen als het een array is
      if (Array.isArray(loadedSegments)) {
        loadedSegments.sort((a: any, b: any) => (a.order_index ?? 999) - (b.order_index ?? 999));
      } else {
        console.warn('Loaded segments is not an array, setting to empty');
        loadedSegments = [];
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

    try {
      const response = await fetch('/api/text-segments', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify({
          segments: segments.value, // Laravel verwacht { segments: [...] }
        }),
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