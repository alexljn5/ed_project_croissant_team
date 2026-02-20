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
        <!-- Left column: image preview + upload -->
        <div class="segment-image-col">
          <label style="font-weight: 600; display: block; margin-bottom: 0.5rem;">Afbeelding</label>
          <div class="preview">
            <img
              v-if="segment.image"
              :src="segment.image"
              alt="preview"
              class="preview-img"
            />
            <button
              class="upload-btn"
              title="Nieuwe foto kiezen"
              @click="triggerFileInput(index)"
            >
              📷
            </button>
            <input
              type="file"
              accept="image/*"
              :data-file-index="index"
              @change="handleFileChange($event, index)"
              class="hidden-file-input"
            />
          </div>
        </div>

        <!-- Middle column: text fields -->
        <div class="segment-content-col">
          <h3 style="margin: 0 0 1rem 0;">Blok {{ index + 1 }}</h3>

          <label style="display: block; margin-bottom: 0.8rem;">
            <span style="font-weight: 600; display: block; margin-bottom: 0.3rem;">Positie</span>
            <input v-model.number="segment.order_index" type="number" min="1" max="10" style="width: 100%; padding: 6px; border: 1px solid #ccc; border-radius: 4px;" />
          </label>

          <label style="display: block; margin-bottom: 0.8rem;">
            <span style="font-weight: 600; display: block; margin-bottom: 0.3rem;">Titel</span>
            <input v-model="segment.title" type="text" placeholder="Titel blok" style="width: 100%; padding: 6px; border: 1px solid #ccc; border-radius: 4px;" />
          </label>

          <label style="display: block; margin-bottom: 0.8rem;">
            <span style="font-weight: 600; display: block; margin-bottom: 0.3rem;">Beschrijving</span>
            <textarea v-model="segment.description" rows="4" placeholder="Beschrijving..." style="width: 100%; padding: 6px; border: 1px solid #ccc; border-radius: 4px;" />
          </label>

          <label style="display: block;">
            <span style="font-weight: 600; display: block; margin-bottom: 0.3rem;">Afbeeldings-URL (optioneel)</span>
            <input
              v-model="segment.image"
              type="text"
              placeholder="Of plak hier een URL"
              style="width: 100%; padding: 6px; border: 1px solid #ccc; border-radius: 4px;"
            />
          </label>
        </div>

        <!-- Right column: remove button -->
        <div class="segment-controls">
          <button class="remove-btn" @click="removeSegment(index)">Verwijder</button>
        </div>
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
  transform: scale(1.05);
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

/* New layout styles for better admin UI */
.segment-editor {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.segment-row {
  display: grid;
  grid-template-columns: 180px 1fr 140px;
  gap: 1.5rem;
  padding: 1.2rem;
  background: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  align-items: start;
}

.segment-image-col {
  grid-column: 1 / 2;
}

.segment-content-col {
  grid-column: 2 / 3;
}

.segment-controls {
  grid-column: 3 / 4;
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
}

.segment-row h3 {
  margin: 0;
  font-size: 1.1rem;
  color: #333;
  font-weight: 600;
}

.actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
}
.save-btn {
  padding: 10px 14px;
  background: #1976d2;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}
.save-btn[disabled] {
  opacity: 0.6;
  cursor: not-allowed;
}
.add-btn-inline {
  padding: 8px 12px;
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}
.debug-info { font-size: 0.85rem; }

/* responsive */
@media (max-width: 800px) {
  .segment-row { grid-template-columns: 1fr; }
  .segment-controls { grid-column: 1 / -1; display:flex; justify-content:flex-end; }
}

/* Rest van je bestaande stijl (segment-row, save-btn, etc.) blijft hetzelfde */
</style>