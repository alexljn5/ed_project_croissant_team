<template>
  <section class="mb-8 p-6 bg-white rounded shadow-md">
    <h2 class="text-2xl font-bold text-purple-700 mb-4">
      Voeg een marker toe
    </h2>

    <!-- Form to add markers -->
    <div class="flex gap-4 flex-wrap mb-6">
      <input v-model.number="lat" type="number" placeholder="Latitude"
             class="p-2 border rounded w-40" />

      <input v-model.number="lng" type="number" placeholder="Longitude"
             class="p-2 border rounded w-40" />

      <button @click="addMarker"
              class="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition">
        Add Marker
      </button>
    </div>

    <!-- Map Display -->
    <div id="leaflet-map" class="mt-4" style="height: 400px; width: 100%; border-radius: 8px; overflow: hidden;"></div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { initMap } from '../leaflet/map'; 
import { useContent } from '../composables/useContent';
import L from 'leaflet';

// Vite import for image
import markerIconUrl from '/src/assets/img/markers/marker.png';

let map: L.Map;

// Inputs for new marker
const lat = ref(52.5186);
const lng = ref(5.4713);

// Load markers from database
interface Marker {
  lat: number;
  lng: number;
  label?: string;
}

const { data: markers, loading: markersLoading, save: saveMarkers } = useContent<Marker[]>('map-markers', []);

// Custom icon for all markers
const customIcon = L.icon({
  iconUrl: markerIconUrl,
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [30, 42],
  iconAnchor: [15, 42],
  popupAnchor: [0, -40],
  shadowSize: [41, 41],
});

let renderedMarkerCount = 0;

// Initialize map and existing markers
onMounted(async () => {
  map = initMap('leaflet-map');

  // Wait for markers to load
  await new Promise(resolve => setTimeout(resolve, 100));

  if (markers.value && Array.isArray(markers.value)) {
    markers.value.forEach((m: Marker) => {
      L.marker([m.lat, m.lng], { icon: customIcon })
        .addTo(map)
        .bindPopup(m.label || `${m.lat}, ${m.lng}`);
    });
    renderedMarkerCount = markers.value.length;
  }
});

// Watch for new markers
watch(markers, (newMarkers) => {
  if (!map) return;
  if (!newMarkers || !Array.isArray(newMarkers)) return;

  for (let i = renderedMarkerCount; i < newMarkers.length; i++) {
    const m = newMarkers[i];
    L.marker([m.lat, m.lng], { icon: customIcon })
      .addTo(map)
      .bindPopup(m.label || `${m.lat}, ${m.lng}`);
  }
  renderedMarkerCount = newMarkers.length;
}, { deep: true });

// Add new marker from inputs
async function addMarker() {
  if (!map) return;

  const label = `Marker ${(markers.value?.length || 0) + 1}`;

  if (!markers.value) markers.value = [];
  markers.value.push({ lat: lat.value, lng: lng.value, label });

  await saveMarkers();

  L.marker([lat.value, lng.value], { icon: customIcon })
    .addTo(map)
    .bindPopup(`${label}:<br>${lat.value}, ${lng.value}`);

  lat.value = 52.5186;
  lng.value = 5.4713;
}
</script>
