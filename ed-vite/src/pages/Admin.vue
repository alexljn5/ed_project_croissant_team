<!-- src/pages/AdminPage.vue (of waar jouw admin pagina nu staat) -->
<template>
  <div class="admin-wrapper">
    <div class="admin-container">
      <h1 class="admin-title">Admin Panel</h1>
      <p class="admin-subtitle">Manage all editable content for your site</p>
      
      <div class="test-button">
        Admin Panel Loaded! Vue is working! {{ testCounter }}
        <button @click="testCounter++">Click me!</button>
      </div>

      <div class="admin-grid">
        <!-- Editable Section -->
        <EditableSection />

        <!-- Dynamic List -->
        <DynamicList />

        <!-- Kaart met alle routes + refresh knop -->
        <div class="map-card">
          <div class="map-header">
            <h2>Wandelroutes op de kaart</h2>
            <button @click="refreshMap" class="refresh-btn" :disabled="isLoading">
              {{ isLoading ? 'Laden...' : 'Refresh routes' }}
            </button>
          </div>
          
          <!-- Waypoints editor -->
          <div class="line-editor">
            <div class="waypoints-header">
              <h3>Wandelroute waypoints</h3>
              <button @click="addWaypoint" class="add-waypoint-btn">+ Waypoint toevoegen</button>
            </div>
            
            <div class="waypoints-list">
              <div v-for="(waypoint, idx) in waypoints" :key="idx" class="waypoint-row">
                <div class="waypoint-number">#{idx + 1}</div>
                <div class="waypoint-inputs">
                  <input v-model.number="waypoint.lat" type="number" step="0.0001" placeholder="Latitude" />
                  <input v-model.number="waypoint.lng" type="number" step="0.0001" placeholder="Longitude" />
                </div>
                <button @click="deleteWaypoint(idx)" class="delete-btn">🗑️ Verwijder</button>
              </div>
            </div>
            
            <div class="waypoint-actions">
              <button @click="updateAndSaveRoute" class="save-btn" :disabled="isLoading">
                {{ isLoading ? 'Opslaan...' : '💾 Opslaan en teken' }}
              </button>
            </div>
          </div>
          
          <div id="admin-map" class="map-container"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import 'leaflet/dist/leaflet.css'
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import EditableSection from '../components/EditableSection.vue'
import DynamicList from '../components/DynamicList.vue'
import { useMap } from '../composables/useMap'

interface Waypoint {
  lat: number
  lng: number
}

const testCounter = ref(0)
const isLoading = ref(false)

// Waypoints array for the route
const waypoints = ref<Waypoint[]>([
  { lat: 52.5205, lng: 5.4790 },
  { lat: 52.5220, lng: 5.4810 }
])

const { initMap, loadRoute, saveRoute: saveRouteToAPI, updateRoute } = useMap()

// Wordt één keer aangeroepen als de pagina laadt
onMounted(async () => {
  // Wacht heel even zodat de div echt in de DOM zit
  await nextTick()
  initMap('admin-map') // ← moet exact hetzelfde zijn als id hierboven
  
  // Load the existing route from database
  const loadedRoute = await loadRoute()
  if (loadedRoute) {
    waypoints.value = loadedRoute
  }
})

async function refreshMap() {
  isLoading.value = true
  const loadedRoute = await loadRoute()
  if (loadedRoute) {
    waypoints.value = loadedRoute
  }
  isLoading.value = false
}

function addWaypoint() {
  // Add new waypoint near the last one
  const lastPoint = waypoints.value[waypoints.value.length - 1]
  waypoints.value.push({
    lat: lastPoint.lat + 0.001,
    lng: lastPoint.lng + 0.001
  })
}

async function deleteWaypoint(idx: number) {
  if (waypoints.value.length > 2) {
    waypoints.value.splice(idx, 1)
    // Save to database after deletion
    isLoading.value = true
    await saveRouteToAPI(waypoints.value)
    isLoading.value = false
    console.log('✅ Waypoint deleted and saved!')
  } else {
    alert('Je moet minstens 2 waypoints hebben voor een route!')
  }
}

async function updateAndSaveRoute() {
  isLoading.value = true
  const success = await saveRouteToAPI(waypoints.value)
  isLoading.value = false
  
  if (success) {
    console.log('✅ Route saved and map updated!')
    // Update map display with new waypoints
    updateRoute(waypoints.value)
  }
}

onUnmounted(() => {
  // Optioneel: ruim de kaart op als je de pagina verlaat
})
</script>

<style scoped>
.admin-wrapper {
  background-color: #f5f5f5;
  min-height: 100vh;
  padding: 2rem 0;
}

.admin-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.admin-title {
  font-size: 2.5rem;
  font-weight: bold;
  color: #6b3f7b;
  text-align: center;
  margin-bottom: 0.5rem;
}

.admin-subtitle {
  text-align: center;
  color: #666;
  margin-bottom: 3rem;
}

.test-button {
  padding: 1rem;
  margin-bottom: 2rem;
  background: lime;
  text-align: center;
  border-radius: 8px;
  font-weight: bold;
}

.admin-grid {
  display: grid;
  gap: 2rem;
  grid-template-columns: 1fr 1fr;
}

/* Op kleine schermen onder elkaar */
@media (max-width: 900px) {
  .admin-grid {
    grid-template-columns: 1fr;
  }
}

.map-card {
  grid-column: 1 / -1; /* kaart altijd volle breedte */
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  overflow: hidden;
}

.map-header {
  padding: 1rem 1.5rem;
  background: #6b3f7b;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.map-header h2 {
  margin: 0;
  font-size: 1.5rem;
}

.refresh-btn {
  padding: 0.6rem 1.2rem;
  background: #ff9800;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.3s;
}

.refresh-btn:hover {
  background: #fb8500;
}

.refresh-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.line-editor {
  padding: 1.5rem;
  background: #f9f9f9;
  border-bottom: 1px solid #eee;
}

.line-editor h3 {
  margin-top: 0;
  color: #333;
}

.waypoints-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  gap: 1rem;
}

.waypoints-header h3 {
  margin: 0;
  flex: 1;
}

.add-waypoint-btn {
  padding: 0.6rem 1.2rem;
  background: #2196f3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.3s;
  white-space: nowrap;
}

.add-waypoint-btn:hover {
  background: #1976d2;
}

.waypoints-list {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  margin-bottom: 1rem;
}

.waypoint-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: white;
  padding: 1rem;
  border-radius: 6px;
  border: 1px solid #ddd;
}

.waypoint-number {
  font-weight: bold;
  color: #6b3f7b;
  min-width: 50px;
  text-align: center;
  font-size: 0.9rem;
}

.waypoint-inputs {
  display: flex;
  gap: 0.8rem;
  flex: 1;
}

.waypoint-inputs input {
  flex: 1;
  padding: 0.6rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
}

.waypoint-inputs input:focus {
  outline: none;
  border-color: #6b3f7b;
  box-shadow: 0 0 4px rgba(107, 63, 123, 0.3);
}

.delete-btn {
  padding: 0.6rem 1rem;
  background: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.3s;
  white-space: nowrap;
}

.delete-btn:hover {
  background: #d32f2f;
}

.waypoint-actions {
  display: flex;
  gap: 1rem;
}

.save-btn {
  flex: 1;
  padding: 0.8rem 1.5rem;
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  font-size: 1rem;
  transition: background 0.3s;
}

.save-btn:hover:not(:disabled) {
  background: #45a049;
}

.save-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.map-container {
  height: 500px;
  width: 100%;
}
</style>