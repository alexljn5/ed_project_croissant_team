<template>
  <div class="location-detector-page">
    <nav style="text-align: right; margin: 1rem">
      <router-link to="/" class="styled-link">← Terug</router-link>
    </nav>

    <!-- Initial State: Show Button -->
    <div v-if="!isTracking" class="location-container">
      <div class="location-card">
        <h1>Ontdek bezienswaardigheden</h1>
        <p>Activeer locatiedetectie om automatisch meldingen te ontvangen wanneer je dicht bij een bezienswaardighed bent.</p>
        
        <button @click="handleStartTracking" class="start-button">
          Activeer locatiedetectie
        </button>
        
        <!-- Fallback: Test coördinaten invoeren (voor desktop) -->
        <div v-if="!isMobile" class="test-section">
          <h3>Test op desktop:</h3>
          <div class="test-coords">
            <label>
              Breedtegraad (8 decimalen):
              <input v-model.number="testLatitude" type="number" step="0.00000001" placeholder="52.09070000">
            </label>
            <label>
              Lengtegraad (8 decimalen):
              <input v-model.number="testLongitude" type="number" step="0.00000001" placeholder="5.12140000">
            </label>
            
            <label>
              Detectieradius: {{ testProximityDistance.toFixed(2) }} km ({{ (testProximityDistance * 1000).toFixed(0) }}m)
              <input v-model.number="testProximityDistance" type="range" min="0.01" max="2" step="0.01">
            </label>
            
            <button @click="useTestCoordinates" class="test-button">Gebruik test coördinaten</button>
          </div>
          
          <!-- Real-time distance calculator -->
          <div v-if="isTracking && allPOIs.length > 0" class="distance-calculator">
            <h4>Afstand tot bezienswaardigheden:</h4>
            <div v-for="poi in allPOIs" :key="poi.id" class="distance-row">
              <span class="poi-name-calc">{{ poi.name }}</span>
              <span class="distance-value">
                {{ calculateDistance(testLatitude, testLongitude, poi.location.latitude, poi.location.longitude).toFixed(3) }} km
                ({{ (calculateDistance(testLatitude, testLongitude, poi.location.latitude, poi.location.longitude) * 1000).toFixed(0) }} m)
              </span>
            </div>
          </div>
        </div>
        
        <p v-if="error" class="error-message">{{ error }}</p>
      </div>
    </div>

    <!-- Active Tracking State -->
    <div v-else class="location-container">
      <div class="location-card active">
        <h2>Locatiedetectie actief</h2>
        <p v-if="coords" class="location-info">
          Breedtegraad: {{ coords.latitude.toFixed(4) }}<br>
          Lengtegraad: {{ coords.longitude.toFixed(4) }}<br>
          Nauwkeurigheid: {{ Math.round(coords.accuracy) }}m
        </p>
        <p v-else class="loading">Locatie bepalen...</p>

        <!-- Nearby POIs List -->
        <div v-if="nearbyPOIs.length > 0" class="nearby-list">
          <h3>{{ nearbyPOIs.length }} dicht bij jou:</h3>
          <div v-for="poi in nearbyPOIs" :key="poi.id" class="poi-item">
            <div class="poi-info">
              <h4>{{ poi.name }}</h4>
              <p class="distance">
                {{ poi.distance < 1 
                  ? (poi.distance * 1000).toFixed(0) + ' m'
                  : poi.distance.toFixed(2) + ' km'
                }} afstand
              </p>
            </div>
            <button @click="viewPOIDetails(poi)" class="view-btn">→</button>
          </div>
        </div>

        <button @click="handleStopTracking" class="stop-button">
          Stop locatiedetectie
        </button>
      </div>
    </div>

    <!-- Proximity Notification Popup -->
    <Teleport to="body">
      <Transition name="popup">
        <div v-if="proximityNotification" class="proximity-popup">
          <div class="popup-content">
            <div class="popup-header">
              <span class="close-popup" @click="dismissNotification">✕</span>
            </div>
            <h3>Je bent in de buurt!</h3>
            <p class="poi-name">{{ proximityNotification.name }}</p>
            <p class="poi-distance">
              {{ proximityNotification.distance < 1 
                ? (proximityNotification.distance * 1000).toFixed(0) + ' m'
                : proximityNotification.distance.toFixed(2) + ' km'
              }} afstand
            </p>
            <button @click="handleNotificationClick(proximityNotification)" class="info-button">
              Meer informatie
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- POI Details Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="selectedPOI" class="modal-overlay" @click="closePOIDetails">
          <div class="modal-content" @click.stop>
            <div class="modal-header">
              <h2>{{ selectedPOI.name }}</h2>
              <button class="close-modal" @click="closePOIDetails">✕</button>
            </div>
            <div class="modal-body">
              <p v-if="selectedPOI.image" class="poi-image">
                <img :src="selectedPOI.image" :alt="selectedPOI.name" />
              </p>
                {{ selectedPOI.distance < 1 
                  ? (selectedPOI.distance * 1000).toFixed(0) + ' m'
                  : selectedPOI.distance.toFixed(2) + ' km'
                }}
              <p v-if="selectedPOI.description" class="poi-description">
                {{ selectedPOI.description }}
              </p>
              <p v-if="selectedPOI.distance" class="poi-meta">
                <strong>Afstand:</strong> {{ selectedPOI.distance.toFixed(2) }} km
              </p>
              <div v-if="selectedPOI.location" class="poi-coords">
                <small>
                  Coördinaten: {{ selectedPOI.location.latitude }}, {{ selectedPOI.location.longitude }}
                </small>
              </div>
            </div>
            <div class="modal-footer">
              <button @click="closePOIDetails" class="close-button">Sluiten</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.location-detector-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.mobile-only-notice {
  background: #fff3cd;
  border: 1px solid #ffc107;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  text-align: center;
  color: #856404;
}

.location-container {
  max-width: 600px;
  margin: 2rem auto;
}

.location-card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.3s ease;
}

.location-card h1,
.location-card h2 {
  color: #333;
  margin-bottom: 1rem;
}

.location-card p {
  color: #666;
  line-height: 1.6;
  margin: 1rem 0;
}

.location-info {
  background: #f5f5f5;
  padding: 1rem;
  border-radius: 8px;
  font-family: monospace;
  font-size: 0.9rem;
  color: #333;
  text-align: left;
  margin: 1.5rem 0;
}

.loading {
  color: #667eea;
  font-weight: bold;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.start-button,
.stop-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  margin: 1.5rem 0;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.start-button:active,
.stop-button:active {
  transform: scale(0.98);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.stop-button {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

/* Test Section (Desktop) */
.test-section {
  background: #e8f4f8;
  border: 2px dashed #667eea;
  border-radius: 8px;
  padding: 1.5rem;
  margin: 1.5rem 0;
  text-align: left;
}

.test-section h3 {
  margin-top: 0;
  color: #667eea;
  font-size: 1rem;
}

.test-coords {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.test-coords label {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  color: #333;
  font-weight: bold;
  font-size: 0.9rem;
}

.test-coords input {
  padding: 0.6rem;
  border: 1px solid #667eea;
  border-radius: 4px;
  font-size: 0.9rem;
  font-family: monospace;
}

.test-button {
  background: #667eea;
  color: white;
  border: none;
  padding: 0.8rem;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s ease;
  font-size: 0.9rem;
}

.test-button:hover {
  background: #764ba2;
}

.test-button:active {
  transform: scale(0.98);
}

/* Distance Calculator */
.distance-calculator {
  background: white;
  border: 1px solid #667eea;
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1rem;
  text-align: left;
}

.distance-calculator h4 {
  margin: 0 0 1rem 0;
  color: #333;
  font-size: 0.95rem;
}

.distance-row {
  display: flex;
  justify-content: space-between;
  padding: 0.6rem 0;
  border-bottom: 1px solid #eee;
  font-size: 0.9rem;
}

.distance-row:last-child {
  border-bottom: none;
}

.poi-name-calc {
  font-weight: bold;
  color: #333;
}

.distance-value {
  color: #667eea;
  font-weight: bold;
  font-family: monospace;
}

.error-message {
  color: #d32f2f;
  background: #ffebee;
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem 0;
}

/* Nearby POIs List */
.nearby-list {
  margin: 2rem 0;
  text-align: left;
}

.nearby-list h3 {
  color: #333;
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.poi-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f9f9f9;
  padding: 1rem;
  margin-bottom: 0.5rem;
  border-radius: 8px;
  border-left: 4px solid #667eea;
}

.poi-info h4 {
  color: #333;
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
}

.poi-info p {
  margin: 0;
  color: #999;
  font-size: 0.85rem;
}

.distance {
  color: #667eea !important;
  font-weight: bold;
}

.view-btn {
  background: #667eea;
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-size: 1.2rem;
  cursor: pointer;
  transition: background 0.3s ease;
  flex-shrink: 0;
}

.view-btn:active {
  background: #764ba2;
}

/* Proximity Notification Popup */
.proximity-popup {
  position: fixed;
  bottom: 20px;
  right: 20px;
  left: 20px;
  max-width: 400px;
  margin: 0 auto;
  z-index: 1000;
}

.popup-content {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  border-left: 4px solid #f5576c;
  position: relative;
}

.popup-header {
  text-align: right;
  margin-bottom: 1rem;
}

.close-popup {
  cursor: pointer;
  font-size: 1.5rem;
  color: #999;
  transition: color 0.2s ease;
}

.close-popup:active {
  color: #333;
}

.popup-content h3 {
  color: #333;
  margin: 0 0 0.5rem 0;
  font-size: 1.2rem;
}

.poi-name {
  font-size: 1.3rem;
  font-weight: bold;
  color: #f5576c;
  margin: 0.5rem 0;
}

.poi-distance {
  color: #999;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
}

.info-button {
  width: 100%;
  background: linear-gradient(135deg, #f5576c 0%, #f093fb 100%);
  color: white;
  border: none;
  padding: 0.8rem;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.info-button:active {
  transform: scale(0.98);
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: flex-end;
  z-index: 2000;
}

.modal-content {
  background: white;
  width: 100%;
  max-height: 90vh;
  border-radius: 16px 16px 0 0;
  overflow-y: auto;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  position: sticky;
  top: 0;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
}

.close-modal {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-size: 1.5rem;
  cursor: pointer;
  transition: background 0.2s ease;
}

.close-modal:active {
  background: rgba(255, 255, 255, 0.4);
}

.modal-body {
  padding: 1.5rem;
}

.poi-image img {
  width: 100%;
  height: auto;
  border-radius: 8px;
  margin-bottom: 1rem;
  max-height: 300px;
  object-fit: cover;
}

.poi-description {
  color: #333;
  line-height: 1.8;
  margin-bottom: 1.5rem;
  font-size: 1rem;
}

.poi-meta {
  background: #f5f5f5;
  padding: 1rem;
  border-radius: 8px;
  color: #666;
  margin-bottom: 1rem;
}

.poi-coords {
  text-align: center;
  color: #999;
  margin-bottom: 1rem;
}

.modal-footer {
  padding: 1.5rem;
  border-top: 1px solid #eee;
  text-align: center;
}

.close-button {
  background: #667eea;
  color: white;
  border: none;
  padding: 0.8rem 2rem;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s ease;
  width: 100%;
}

.close-button:active {
  background: #764ba2;
}

/* Transitions */
.popup-enter-active,
.popup-leave-active,
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.popup-enter-from,
.popup-leave-to,
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-content {
  transform: translateY(100%);
}

.styled-link {
  color: white;
  text-decoration: none;
  font-weight: bold;
  transition: opacity 0.2s ease;
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.2);
}

.styled-link:active {
  opacity: 0.8;
}
</style>

<script setup lang="ts">
import { useLocationDetector } from '@/composables/locationDetector'

const {
  coords,
  isTracking,
  error,
  isMobile,
  startTracking,
  stopTracking,
  requestPermission,
  calculateDistance,
  allPOIs,
  selectedPOI,
  proximityNotification,
  proximityDistance,
  testLatitude,
  testLongitude,
  testProximityDistance,
  nearbyPOIs,
  handleStartTracking,
  handleStopTracking,
  loadPOIs,
  useTestCoordinates,
  dismissNotification,
  handleNotificationClick,
  viewPOIDetails,
  closePOIDetails,
  debugCheckLocation
} = useLocationDetector()
</script>