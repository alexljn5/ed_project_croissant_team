<!-- src/components/AdminTextSegmentsEditor.vue -->
<template>
  <div>
    <!-- Header is provided by the parent page (Admin.vue) to avoid duplication -->

    <div v-if="isLoading" class="loading">Bezig met laden...</div>

    <div v-else-if="error" class="error-message">
      {{ error }}
      <button @click="loadSegments">Opnieuw proberen</button>
    </div>

    <div v-else class="segment-editor">
      <!-- If there are no segments, show an add button and helpful message -->
      <div v-if="segments.length === 0" class="empty-segments">
        <p class="text-muted">Er zijn nog geen tekstblokken. Voeg er één toe om te beginnen.</p>
        <button class="add-btn" @click="addSegment">+ Voeg tekstblok toe</button>
      </div>

      <!-- Segment list -->
      <div
        v-for="(segment, index) in sortedSegments"
        :key="segment.id || index"
        class="segment-row"
      >
        <div class="segment-controls">
          <button class="remove-btn" @click="removeSegment(index)">Verwijder</button>
        </div>
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
            :data-file-index="index"
            @change="handleFileChange($event, index)"
            class="hidden-file-input"
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
        <div class="debug-info" style="margin-bottom:8px;color:#666;font-size:0.9rem;">
          Debug: segments = {{ segments.length }}
          <span v-if="error" style="color:#c33;"> — Error: {{ error }}</span>
        </div>
        <button class="add-btn-inline" @click="addSegment" style="margin-right:8px;">+ Voeg tekstblok toe</button>
        <button
          class="save-btn"
          :disabled="isLoading || saving"
          @click="handleSave"
        >
          <span v-if="saving">Bezig met opslaan...</span>
          <span v-else-if="isLoading">Bezig met laden...</span>
          <span v-else>Alles opslaan</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useTextSegments } from '../composables/useTextSegments'
import { useImageUpload } from '../composables/useImageUpload'

const { segments, isLoading, error, loadSegments, saveSegments } = useTextSegments()
const { uploadImage } = useImageUpload()

// Local saving flag to avoid UI races
const saving = ref(false)

// Refs voor file inputs per segment
const fileInputs = ref<Record<number, HTMLInputElement | null>>({})

// Note: loadSegments is called automatically via onMounted in useTextSegments
// No need to call it again here

const sortedSegments = computed(() =>
  [...segments.value].sort((a, b) => (a.order_index ?? 999) - (b.order_index ?? 999))
)

const triggerFileInput = (index: number) => {
  const el = document.querySelector(`input[data-file-index="${index}"]`) as HTMLInputElement
  if (el) el.click()
}

const handleFileChange = async (event: Event, index: number) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    alert('Alleen afbeeldingen toegestaan')
    return
  }

  try {
    // Upload to backend
    const url = await uploadImage(file)
    
    // Set the server URL (not base64)
    segments.value[index].image = url
    
  } catch (err: any) {
    alert('Upload mislukt: ' + err.message)
  } finally {
    input.value = ''
  }
}

const handleSave = async () => {
  if (saving.value) return
  saving.value = true
  console.log('[AdminTextSegmentsEditor] Saving segments...', segments.value)
  try {
    await saveSegments()
    // Reload to ensure UI stays in sync with server
    await loadSegments()
    alert('Tekstblokken opgeslagen!')
  } catch (err: any) {
    console.error('[AdminTextSegmentsEditor] Save failed:', err)
    alert('Opslaan mislukt: ' + (err?.message || 'onbekend probleem'))
  } finally {
    saving.value = false
  }
}

// Nieuwe functies voor toevoegen/verwijderen van segmenten
const addSegment = () => {
  const newSegment = {
    order_index: segments.value.length + 1,
    title: '',
    description: '',
    image: ''
  }
  segments.value.push(newSegment)
}

const removeSegment = (index: number) => {
  if (confirm('Weet je zeker dat je dit tekstblok wilt verwijderen?')) {
    segments.value.splice(index, 1)
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

.empty-segments {
  padding: 1rem;
  text-align: center;
}
.add-btn {
  margin-top: 0.5rem;
  padding: 8px 12px;
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
.remove-btn {
  background: #f44336;
  color: white;
  border: none;
  padding: 6px 8px;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 8px;
}

/* Rest van je bestaande stijl (segment-row, save-btn, etc.) blijft hetzelfde */
</style>