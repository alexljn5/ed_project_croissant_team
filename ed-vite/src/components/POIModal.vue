<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <div class="modal-header">
        <h2>{{ poi?.shortDescription }}</h2>
        <button @click="close" class="close-btn">✕</button>
      </div>
      
      <div class="modal-body">
        <img v-if="poi?.imageUrl" :src="poi.imageUrl" :alt="poi.shortDescription" class="modal-image">
        <div class="modal-text">
          <h3>Uitgebreide informatie</h3>
          <p>{{ poi?.longDescription }}</p>
        </div>
      </div>
      
      <div class="modal-footer">
        <button @click="close" class="modal-btn modal-btn-close">Sluiten</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { POI } from '../composables/useMap'

interface Props {
  isOpen: boolean
  poi: POI | null
}

defineProps<Props>()
const emit = defineEmits<{
  close: []
}>()

function close() {
  emit('close')
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
}

.modal-header h2 {
  margin: 0;
  color: #333;
  font-size: 1.5rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #999;
  transition: color 0.3s;
}

.close-btn:hover {
  color: #333;
}

.modal-body {
  padding: 1.5rem;
}

.modal-image {
  width: 100%;
  max-height: 300px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.modal-text {
  line-height: 1.6;
  color: #555;
}

.modal-text h3 {
  color: #6b3f7b;
  margin-top: 0;
}

.modal-text p {
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.modal-footer {
  padding: 1.5rem;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.modal-btn {
  padding: 0.7rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
}

.modal-btn-close {
  background: #6b3f7b;
  color: white;
}

.modal-btn-close:hover {
  background: #5a2f6a;
}
</style>
