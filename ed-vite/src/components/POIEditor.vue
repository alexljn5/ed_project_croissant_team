<template>
  <div class="poi-editor">
    <h3>Individuele POI Markers</h3>
    
    <div class="poi-form">
      <div class="form-row">
        <div class="form-group">
          <label>Latitude:</label>
          <input v-model.number="form.lat" type="number" step="0.0001" placeholder="52.5205" />
        </div>
        <div class="form-group">
          <label>Longitude:</label>
          <input v-model.number="form.lng" type="number" step="0.0001" placeholder="5.4790" />
        </div>
      </div>
      
      <div class="form-group">
        <label>Image URL:</label>
        <input v-model="form.imageUrl" type="text" placeholder="https://..." />
      </div>
      
      <div class="form-group">
        <label>Korte beschrijving:</label>
        <input v-model="form.shortDescription" type="text" placeholder="Bijv: De Agora" />
      </div>
      
      <div class="form-group">
        <label>Uitgebreide beschrijving:</label>
        <textarea v-model="form.longDescription" placeholder="Uitgebreide info hier..." rows="4"></textarea>
      </div>
      
      <button @click="addNewPOI" class="add-poi-btn">+ Nieuwe POI toevoegen</button>
    </div>
    
    <div class="poi-list">
      <div v-for="poi in props.pois" :key="poi.id" class="poi-item">
        <img :src="poi.imageUrl" :alt="poi.shortDescription" class="poi-thumb">
        <div class="poi-info">
          <strong>{{ poi.shortDescription }}</strong>
          <p>{{ poi.lat }}, {{ poi.lng }}</p>
          <small>{{ poi.longDescription?.substring(0, 50) ?? 'Geen beschrijving' }}...</small>
        </div>
        <div class="poi-actions">
          <button @click="deletePOI(poi.id)" class="delete-poi-btn">🗑️</button>
        </div>
      </div>
    </div>
    
    <div class="save-section">
      <button @click="savePOIs" class="save-pois-btn" :disabled="props.isLoading">
        {{ props.isLoading ? 'Opslaan...' : '💾 Alle POIs opslaan' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { POI } from '../composables/useMap'

interface Props {
  pois: POI[]
  onAddPOI: (poi: POI) => void
  onRemovePOI: (id: string) => void
  onSave: () => Promise<void>
  isLoading: boolean
}

const props = defineProps<Props>()

const form = ref({
  lat: 52.5180,
  lng: 5.4800,
  imageUrl: 'https://via.placeholder.com/100',
  shortDescription: '',
  longDescription: ''
})

function addNewPOI() {
  if (!form.value.shortDescription) {
    alert('Korte beschrijving is verplicht')
    return
  }
  
  const newPOI: POI = {
    id: Date.now().toString(),
    lat: form.value.lat,
    lng: form.value.lng,
    imageUrl: form.value.imageUrl,
    shortDescription: form.value.shortDescription,
    longDescription: form.value.longDescription
  }
  
  props.onAddPOI(newPOI)
  
  // Reset form
  form.value = {
    lat: 52.5180,
    lng: 5.4800,
    imageUrl: 'https://via.placeholder.com/100',
    shortDescription: '',
    longDescription: ''
  }
}

function deletePOI(id: string) {
  if (confirm('Weet je zeker dat je deze POI wilt verwijderen?')) {
    props.onRemovePOI(id)
  }
}

async function savePOIs() {
  await props.onSave()
}
</script>

<style scoped>
.poi-editor {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.poi-editor h3 {
  margin-top: 0;
  color: #6b3f7b;
  border-bottom: 2px solid #6b3f7b;
  padding-bottom: 0.5rem;
}

.poi-form {
  background: #f9f9f9;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}

.form-group label {
  font-weight: bold;
  font-size: 0.9rem;
  color: #333;
  margin-bottom: 0.4rem;
}

.form-group input,
.form-group textarea {
  padding: 0.6rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
  font-family: inherit;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #6b3f7b;
  box-shadow: 0 0 4px rgba(107, 63, 123, 0.3);
}

.add-poi-btn {
  width: 100%;
  padding: 0.8rem;
  background: #2196f3;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s;
}

.add-poi-btn:hover {
  background: #1976d2;
}

.poi-list {
  margin-bottom: 1.5rem;
  max-height: 400px;
  overflow-y: auto;
}

.poi-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: #f9f9f9;
  border-radius: 8px;
  margin-bottom: 0.8rem;
  border-left: 4px solid #6b3f7b;
  align-items: center;
}

.poi-thumb {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 6px;
  flex-shrink: 0;
}

.poi-info {
  flex: 1;
  min-width: 0;
}

.poi-info strong {
  display: block;
  color: #333;
  margin-bottom: 0.3rem;
}

.poi-info p {
  margin: 0;
  font-size: 0.85rem;
  color: #666;
}

.poi-info small {
  display: block;
  color: #999;
  margin-top: 0.3rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.poi-actions {
  display: flex;
  gap: 0.5rem;
}

.delete-poi-btn {
  padding: 0.5rem 0.8rem;
  background: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}

.delete-poi-btn:hover {
  background: #d32f2f;
}

.save-section {
  border-top: 1px solid #eee;
  padding-top: 1rem;
}

.save-pois-btn {
  width: 100%;
  padding: 0.8rem;
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s;
}

.save-pois-btn:hover:not(:disabled) {
  background: #45a049;
}

.save-pois-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
