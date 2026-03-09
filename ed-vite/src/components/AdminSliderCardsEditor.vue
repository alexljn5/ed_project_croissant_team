<!-- src/components/AdminSliderCardsEditor.vue -->
<template>
  <div class="admin-slider-editor">
    <h2>Nieuws & Evenementen</h2>
    <button @click="addNew" class="btn btn-add">+ Nieuw item toevoegen</button>

    <div class="cards-container">
      <div v-for="card in sliderCards" :key="card.id" class="card-row">
        <div class="preview">
          <img :src="card.image" alt="preview" class="preview-img" />
          
          <button 
            class="upload-btn" 
            title="Nieuwe foto kiezen"
            @click="triggerFileInput(card.id)"
            :disabled="uploading"
          >
            📷
          </button>

          <input
            type="file"
            accept="image/*"
            :ref="el => { if (el) fileInputs[card.id] = el }"
            class="hidden-file-input"
            @change="handleFileChange($event, card)"
          />
        </div>

        <div class="form-fields">
          <input v-model="card.title" placeholder="Titel" class="input" />
          <input v-model="card.date" placeholder="Datum (bijv. 15-03-2026, 20:00)" class="input" />
          <textarea v-model="card.description" placeholder="Beschrijving" rows="3" class="textarea"></textarea>
          <input v-model="card.image" placeholder="Of plak hier handmatig een URL" class="input" />
        </div>

        <div class="actions">
          <button @click="saveCard(card)" class="btn btn-save">Opslaan</button>
          <button @click="removeCard(card.id)" class="btn btn-delete">Verwijder</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useSliderCards } from '@/composables/useSliderCards'
import { useImageUpload } from '@/composables/useImageUpload'

const { cards: sliderCards, updateCard, removeCard, addCard } = useSliderCards()
const { uploadImage, uploading } = useImageUpload()

const fileInputs = ref<Record<string, HTMLInputElement>>({})

function addNew() {
  addCard({
    title: 'Nieuw evenement',
    description: 'Vul hier de beschrijving in...',
    date: 'dd-mm-jj, hh:mm',
    image: '/storage/images/placeholder.webp',   // voorbeeld
  })
}

function saveCard(card: any) {
  updateCard(card)
}

function triggerFileInput(cardId: string) {
  const input = fileInputs.value[cardId]
  if (input) input.click()
}

async function handleFileChange(event: Event, card: any) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  try {
    // Tijdelijke preview
    const reader = new FileReader()
    reader.onload = (e) => {
      card.image = e.target?.result as string
    }
    reader.readAsDataURL(file)

    // Echte upload naar Laravel
    const url = await uploadImage(file)
    card.image = url                     // ← echte URL opslaan
    updateCard(card)                     // opslaan in DB
  } catch (err: any) {
    alert('Upload mislukt: ' + err.message)
    card.image = ''                      // reset bij fout
  } finally {
    input.value = ''
  }
}
</script>

<style scoped>
/* ────────────────────────────────────────────── */
/* Houd je bestaande styling intact               */
/* ────────────────────────────────────────────── */

.admin-slider-editor {
  padding: 1.5rem;
  background: #f9f9f9;
  border-radius: 8px;
}

.btn {
  padding: 8px 14px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
}

.btn-add    { background: #4caf50; color: white; margin-bottom: 1.5rem; }
.btn-save   { background: #2196f3; color: white; }
.btn-delete { background: #f44336; color: white; }

.cards-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.card-row {
  display: grid;
  grid-template-columns: 160px 1fr auto;
  gap: 1.2rem;
  padding: 1rem;
  background: white;
  border: 1px solid #ddd;
  border-radius: 6px;
}

.preview {
  position: relative;
}

.preview-img {
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 4px;
}

/* Klein upload knopje */
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

.form-fields {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.input, .textarea {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}
</style>