// src/composables/useImageUpload.ts
import { ref } from 'vue'

function getBackendUrl(): string {
  const origin = window.location.origin;
  if (origin.includes('5173')) {
    return 'http://127.0.0.1:8000';
  }
  return origin;
}

export function useImageUpload() {
  const uploading = ref(false)
  const error = ref<string | null>(null)

  const uploadImage = async (file: File): Promise<string> => {
    uploading.value = true
    error.value = null

    // Size check: 5MB max
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      error.value = 'Bestand is groter dan 5MB'
      uploading.value = false
      throw new Error('File too large')
    }

    const backendUrl = getBackendUrl();
    const formData = new FormData()
    formData.append('photo', file)  // ← correct key: 'photo'

    try {
      console.log(`[useImageUpload] Uploading to ${backendUrl}/api/upload-photo, file size: ${file.size} bytes`)
      
      // Get auth token from localStorage
      const token = localStorage.getItem('admin_token')
      const headers: Record<string, string> = {}
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const res = await fetch(`${backendUrl}/api/upload-photo`, {
        method: 'POST',
        headers,
        body: formData,
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        console.error(`[useImageUpload] Upload failed with status ${res.status}:`, data)
        throw new Error(data.message || 'Upload mislukt')
      }

      const data = await res.json()
      console.log(`[useImageUpload] Upload successful, URL:`, data.url)
      return data.url
    } catch (err: any) {
      error.value = err.message
      console.error(`[useImageUpload] Error:`, err)
      throw err
    } finally {
      uploading.value = false
    }
  }

  return { uploadImage, uploading, error }
}