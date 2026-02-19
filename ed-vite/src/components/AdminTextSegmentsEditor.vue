<!-- src/components/AdminTextSegmentsEditor.vue -->
<template>
  <div class="map-card">
    <div class="map-header">
      <h2>Homepage Tekstblokken (editable)</h2>
      <small>Pas titel, beschrijving en afbeelding aan. Volgorde = positie op homepage.</small>
    </div>

    <div v-if="isLoading" class="loading">Bezig met laden...</div>

    <div v-else-if="error" class="error-message">
      {{ error }}
      <button @click="loadSegments">Opnieuw proberen</button>
    </div>

    <div v-else class="segment-editor">
      <div
        v-for="(segment, index) in sortedSegments"
        :key="segment.id || index"
        class="segment-row"
      >
        <h3>Blok {{ index + 1 }} (positie {{ segment.order_index || '?' }})</h3>

        <label>
          Positie / volgorde
          <input v-model.number="segment.order_index" type="number" min="1" max="10" />
        </label>

        <label>
          Titel
          <input v-model="segment.title" type="text" placeholder="Titel blok" />
        </label>

        <label>
          Beschrijving
          <textarea v-model="segment.description" rows="4" placeholder="Beschrijving..." />
        </label>

        <!-- Afbeelding met dezelfde stijl als slider editor -->
        <label>Afbeelding</label>
        <div class="preview">
          <img
            v-if="segment.image"
            :src="segment.image"
            alt="preview"
            class="preview-img"
          />
          <!-- Klein upload-knopje – exact dezelfde look & feel -->
          <button
            class="upload-btn"
            title="Nieuwe foto kiezen"
            @click="triggerFileInput(index)"
          >
            📷
          </button>

          <!-- Verborgen file input -->
          <input
            type="file"
            accept="image/*"
            :ref="el => { if (el) fileInputs[index] = el }"
            class="hidden-file-input"
            @change="handleFileChange($event, index)"
          />
        </div>

        <!-- Handmatige URL optie (blijft bestaan) -->
        <input
          v-model="segment.image"
          type="text"
          placeholder="Of plak hier handmatig een URL"
          class="input-url"
        />
      </div>

      <div class="actions">
        <button
          class="save-btn"
          :disabled="isLoading || segments.length === 0"
          @click="handleSave"
        >
          {{ isLoading ? 'Bezig met opslaan...' : 'Alles opslaan' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useTextSegments } from '../composables/useTextSegments'

const { segments, isLoading, error, loadSegments, saveSegments } = useTextSegments()

// Refs voor file inputs per segment
const fileInputs = ref<(HTMLInputElement | null)[]>([])

onMounted(() => {
  loadSegments()
})

const sortedSegments = computed(() =>
  [...segments.value].sort((a, b) => (a.order_index ?? 999) - (b.order_index ?? 999))
)

const triggerFileInput = (index: number) => {
  const input = fileInputs.value[index]
  if (input) input.click()
}

const handleFileChange = async (event: Event, index: number) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    alert('Alleen afbeeldingen toegestaan')
    return
  }

  // Echte upload naar server (don't use data URL - it's too large)
  const formData = new FormData()
  formData.append('photo', file)

  try {
    // Dynamically detect backend URL (localhost:5173 -> localhost:8000)
    const backendUrl = window.location.origin.includes('5173') 
      ? 'http://localhost:8000' 
      : window.location.origin
    
    const res = await fetch(`${backendUrl}/api/upload-photo`, {
      method: 'POST',
      body: formData,
      credentials: 'same-origin',
    })

    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.message || 'Upload mislukt')
    }

    const data = await res.json()
    
    // Set the actual URL from server (not base64)
    segments.value[index].image = data.url || data.path || data.filename
    
    console.log('Image uploaded successfully:', segments.value[index].image)
  } catch (err) {
    console.error('Upload error:', err)
    const errorMessage = err instanceof Error ? err.message : 'Upload mislukt'
    alert('Upload mislukt: ' + errorMessage)
  } finally {
    input.value = ''  // reset file input
  }
}

const handleSave = async () => {
  try {
    await saveSegments()
    alert('Tekstblokken opgeslagen!')
  } catch (err) {
    alert('Opslaan mislukt – check console')
  }
}
</script>

<style scoped>
/* ────────────────────────────────────────────── */
/* Houd bestaande stijl + voeg slider-achtige upload toe */
/* ────────────────────────────────────────────── */

.preview {
  position: relative;
  width: 160px;
  height: 120px;
  margin-bottom: 0.8rem;
}

.preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.upload-btn {
  position: absolute;
  bottom: 8px;
  right: 8px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.85;
  transition: all 0.2s;
}

.upload-btn:hover {
  background: rgba(0, 0, 0, 0.85);
  transform: scale(1.1);
}

.hidden-file-input {
  display: none;
}

.input-url {
  margin-top: 0.5rem;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
}

/* Rest van je bestaande stijl (segment-row, save-btn, etc.) blijft hetzelfde */
</style>