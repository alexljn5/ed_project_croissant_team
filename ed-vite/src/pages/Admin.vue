<!-- src/pages/AdminPage.vue -->
<template>
  <div class="admin-wrapper">
    <div class="admin-container">
      <div class="admin-header">
        <div>
          <h1 class="admin-title">Admin Panel</h1>
          <p class="admin-subtitle">Manage all editable content for your site</p>
        </div>
        <button @click="handleLogout" class="logout-btn">Logout</button>
      </div>

      <div class="test-button">
        Admin Panel Loaded! Vue is working! {{ testCounter }}
        <button @click="testCounter++">Click me!</button>
      </div>

      <div class="admin-grid">
        <EditableSection />
        <DynamicList />

        <!-- EMAILS CARD -->
        <div class="map-card">
          <router-link to="/emails" class="emails-link">
            <button class="view-emails-btn">Bekijk alle emails →</button>
          </router-link>
        </div>

        <!-- NIEUWS & EVENEMENTEN BEHEER – één keer -->
        <div class="map-card">
          <div class="map-header">
            <h2>Nieuws & Evenementen beheren</h2>
          </div>
          <AdminSliderCardsEditor />
        </div>

        <!-- NIEUWE TEKSTSEGMENTEN EDITOR -->
        <div class="map-card">
          <div class="map-header">
            <h2>Homepage Tekstblokken (editable)</h2>
          </div>
          <AdminTextSegmentsEditor />
        </div>

        <!-- MAP CARD -->
        <div class="map-card">
          <div class="map-header">
            <h2>Wandelroutes op de kaart</h2>
            <button
              @click="refreshMap"
              class="refresh-btn"
              :disabled="isLoading"
            >
              {{ isLoading ? "Laden..." : "Refresh routes" }}
            </button>
          </div>

          <!-- Waypoints editor -->
          <div class="line-editor">
            <div class="waypoints-header">
              <h3>Wandelroute waypoints</h3>
              <button @click="addWaypoint" class="add-waypoint-btn">
                + Waypoint toevoegen
              </button>
            </div>

            <div class="waypoints-list">
              <div
                v-for="(waypoint, idx) in waypoints"
                :key="idx"
                class="waypoint-row"
              >
                <div class="waypoint-number">#{{ idx + 1 }}</div>
                <div class="waypoint-inputs">
                  <input
                    v-model.number="waypoint.lat"
                    type="number"
                    step="0.0001"
                    placeholder="Latitude"
                  />
                  <input
                    v-model.number="waypoint.lng"
                    type="number"
                    step="0.0001"
                    placeholder="Longitude"
                  />
                </div>
                <button @click="deleteWaypoint(idx)" class="delete-btn">
                  Verwijder
                </button>
              </div>
            </div>

            <div class="waypoint-actions">
              <button
                @click="updateAndSaveRoute"
                class="save-btn"
                :disabled="isLoading"
              >
                {{ isLoading ? "Opslaan..." : "Opslaan en teken" }}
              </button>
            </div>
          </div>

          <div id="admin-map" class="map-container"></div>
        </div>

        <!-- POI EDITOR -->
        <div class="map-card">
          <POIEditor
            :pois="pois"
            :onAddPOI="addPOI"
            :onRemovePOI="removePOI"
            :onSave="savePOIsWrapper"
            :isLoading="isLoading"
          />
        </div>
      </div>
    </div>
  </div>

  <POIModal
    :isOpen="showPOIModal"
    :poi="selectedPOI"
    @close="showPOIModal = false"
  />
</template>

<script setup lang="ts">
import AdminSliderCardsEditor from '../components/AdminSliderCardsEditor.vue'
import AdminTextSegmentsEditor from '../components/AdminTextSegmentsEditor.vue'
import 'leaflet/dist/leaflet.css'
import { ref, onMounted, watch, nextTick } from 'vue'
import EditableSection from '../components/EditableSection.vue'
import DynamicList from '../components/DynamicList.vue'
import POIEditor from '../components/POIEditor.vue'
import POIModal from '../components/POIModal.vue'
import { useMap } from '../composables/useMap'
import { useAdminAuth } from '../composables/useAdminAuth'
import type { POI } from '../composables/useMap'

const testCounter = ref(0)
const isLoading = ref(false)

const { logout } = useAdminAuth()

function handleLogout() {
  if (confirm('Ben je zeker dat je wil uitloggen?')) {
    logout()
  }
}

interface Waypoint {
  lat: number
  lng: number
}
const waypoints = ref<Waypoint[]>([])

const showPOIModal = ref(false)
const selectedPOI = ref<POI | null>(null)

const {
  initMap,
  loadRoute,
  saveRoute,
  updateRoute,
  pois,
  addPOI,
  removePOI,
  saveMarkers,
  loadMarkers,
} = useMap()

// THIS IS THE ONLY CORRECT WAY — ONE MAP, ONE SOURCE OF TRUTH
onMounted(async () => {
  await nextTick()

  initMap('admin-map')

  await loadMarkers()
  const route = await loadRoute()
  if (route) waypoints.value = route

  // Live preview while editing
  watch(
    waypoints,
    (newWaypoints) => {
      if (newWaypoints.length >= 2) {
        updateRoute(newWaypoints)
      }
    },
    { deep: true },
  );

  // "Meer info" buttons
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    if (target.classList.contains('poi-more-btn')) {
      const poiId = target.getAttribute('data-id')
      const poi = pois.value.find((p) => p.id === poiId)
      if (poi) {
        selectedPOI.value = poi
        showPOIModal.value = true
      }
    }
  })
})

async function refreshMap() {
  isLoading.value = true
  const route = await loadRoute()
  if (route) waypoints.value = route
  isLoading.value = false
}

function addWaypoint() {
  const last = waypoints.value[waypoints.value.length - 1] || {
    lat: 52.5186,
    lng: 5.4713,
  }
  waypoints.value.push({
    lat: last.lat + 0.001,
    lng: last.lng + 0.001,
  })
}

async function deleteWaypoint(idx: number) {
  if (waypoints.value.length <= 2) {
    alert('Minstens 2 punten nodig!')
    return
  }
  waypoints.value.splice(idx, 1)
  await saveRoute(waypoints.value)
}

async function updateAndSaveRoute() {
  isLoading.value = true
  await saveRoute(waypoints.value)
  isLoading.value = false
}

async function savePOIsWrapper() {
  isLoading.value = true
  await saveMarkers()
  isLoading.value = false
}

import '@/assets/css/admin.css'
</script>