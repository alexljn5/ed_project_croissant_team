// src/composables/useImageUpload.ts
import { ref } from 'vue'

export function useImageUpload() {
  const uploading = ref(false)
  const error = ref<string | null>(null)

  const uploadImage = async (file: File): Promise<string> => {
    uploading.value = true
    error.value = null

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
        credentials: 'same-origin',
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.message || 'Upload mislukt')
      }

      const data = await res.json()
      return data.url
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      uploading.value = false
    }
  }

  return { uploadImage, uploading, error }
}