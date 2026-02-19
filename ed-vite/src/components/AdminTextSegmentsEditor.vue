<template>
  <div class="map-card">
    <div class="map-header">
      <h2>Homepage Tekstblokken</h2>
      <small>Pas titel, beschrijving en afbeelding aan. Volgorde = positie op homepage.</small>
    </div>

    <div v-if="isLoading" class="loading">
      Bezig met laden...
    </div>

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
          <input v-model="segment.title" type="text" placeholder="Bijv. Welkom op onze site" />
        </label>

        <label>
          Beschrijving
          <textarea v-model="segment.description" rows="4" placeholder="Korte tekst..." />
        </label>

        <label>
          Afbeelding (URL of pad)
          <input
            v-model="segment.image"
            type="text"
            placeholder="/storage/images/voorbeeld.jpg of https://..."
          />
        </label>

        <div
          v-if="segment.image"
          class="image-preview"
          :style="{ backgroundImage: `url(${segment.image})` }"
        >
          <span v-if="!looksLikeImage(segment.image)" class="preview-warning">
            Lijkt geen afbeelding
          </span>
        </div>
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
import { computed, onMounted } from 'vue'
import { useTextSegments } from '../composables/useTextSegments'

const {
  segments,
  isLoading,
  error,
  loadSegments,
  saveSegments,
} = useTextSegments()

onMounted(() => {
  loadSegments()
})

const sortedSegments = computed(() =>
  [...segments.value].sort((a, b) => (a.order_index ?? 999) - (b.order_index ?? 999))
)

const handleSave = async () => {
  try {
    await saveSegments()
    alert('Tekstblokken succesvol opgeslagen!')
  } catch {
    alert('Opslaan mislukt – zie console voor details')
  }
}

// Simpele check om te waarschuwen bij rare URLs
const looksLikeImage = (url: string) => {
  if (!url) return false
  return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url) || url.startsWith('http') || url.startsWith('/')
}
</script>

<style scoped>
.map-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  padding: 1.5rem;
  margin: 1rem;
  max-width: 900px;
}

.map-header h2 {
  margin-top: 0;
  color: #333;
}

.loading,
.error-message {
  text-align: center;
  padding: 3rem 1rem;
  font-size: 1.2rem;
  color: #666;
}

.error-message {
  color: #d32f2f;
}

.error-message button {
  margin-top: 1rem;
  padding: 0.6rem 1.2rem;
}

.segment-editor {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.segment-row {
  background: #f9f9f9;
  padding: 1.5rem;
  border-radius: 10px;
  border: 1px solid #eee;
}

.segment-row h3 {
  margin: 0 0 1rem 0;
  color: #444;
}

label {
  display: flex;
  flex-direction: column;
  margin-bottom: 1.2rem;
  font-weight: 600;
  color: #555;
}

input,
textarea {
  margin-top: 0.4rem;
  padding: 0.7rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
}

.image-preview {
  margin-top: 0.8rem;
  width: 100%;
  height: 180px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 8px;
  border: 1px dashed #aaa;
  position: relative;
}

.preview-warning {
  position: absolute;
  bottom: 8px;
  left: 8px;
  background: rgba(255, 193, 7, 0.9);
  color: #333;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
}

.actions {
  margin-top: 1.5rem;
  text-align: right;
}

.save-btn {
  padding: 0.8rem 1.8rem;
  background: #1976d2;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1.05rem;
  cursor: pointer;
}

.save-btn:hover:not(:disabled) {
  background: #1565c0;
}

.save-btn:disabled {
  background: #90caf9;
  cursor: not-allowed;
}
</style>