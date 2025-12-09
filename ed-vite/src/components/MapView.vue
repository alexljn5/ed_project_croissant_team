<template>
  <section class="mb-8 p-6 bg-white rounded shadow-md">
    <h2 class="text-2xl font-bold text-purple-700 mb-4">
      Voeg een marker toe
    </h2>

    <!-- Form to add markers -->
    <div class="flex gap-4 flex-wrap mb-6">
      <input
        v-model.number="lat"
        type="number"
        placeholder="Latitude"
        class="p-2 border rounded w-40"
      />

      <input
        v-model.number="lng"
        type="number"
        placeholder="Longitude"
        class="p-2 border rounded w-40"
      />

      <button
        @click="addMarker"
        class="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
      >
        Add Marker
      </button>
    </div>

    <!-- Map Display -->
    <div
      id="leaflet-map"
      class="mt-4"
      style="height: 800px; width: 100%; border-radius: 8px; overflow: hidden;"
    ></div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { initMap } from "../leaflet/map";
import { useContent } from "../composables/useContent";
import L from "leaflet";

// Marker PNG with timestamp to prevent caching
const markerIconUrl = `/src/assets/img/markers/marker.png?ts=${new Date().getTime()}`;

const shadowUrl = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png";

let map: L.Map;

const lat = ref(52.5186);
const lng = ref(5.4713);

// ---------------------------------------------------------------------
// Load/save marker data
// ---------------------------------------------------------------------
interface Marker {
  lat: number;
  lng: number;
  label?: string;
}

const { data: markers, save: saveMarkers } = useContent<Marker[]>(
  "map-markers",
  []
);

// ---------------------------------------------------------------------
// Auto-detect PNG size → create icon dynamically
// ---------------------------------------------------------------------
async function loadIcon(): Promise<L.Icon> {
  const img = new Image();
  img.src = markerIconUrl;
  await img.decode();

  const w = img.width;
  const h = img.height;

  return L.icon({
    iconUrl: markerIconUrl,
    shadowUrl,
    iconSize: [w, h],
    iconAnchor: [w / 2, h], // bottom middle
    popupAnchor: [0, -h], // popup above marker
    shadowSize: [41, 41]
  });
}

let customIcon: L.Icon;
let renderedMarkerCount = 0;

// ---------------------------------------------------------------------
// Initialize map
// ---------------------------------------------------------------------
onMounted(async () => {
  map = initMap("leaflet-map");

  // Load icon dynamically
  customIcon = await loadIcon();

  // Render stored markers
  if (markers.value && Array.isArray(markers.value)) {
    markers.value.forEach((m) => {
      L.marker([m.lat, m.lng], { icon: customIcon })
        .addTo(map)
        .bindPopup(m.label || `${m.lat}, ${m.lng}`);
    });
    renderedMarkerCount = markers.value.length;
  }
});

// ---------------------------------------------------------------------
// Watch for added markers
// ---------------------------------------------------------------------
watch(
  markers,
  (newMarkers) => {
    if (!map || !newMarkers || !Array.isArray(newMarkers)) return;

    // Render only newly added markers
    for (let i = renderedMarkerCount; i < newMarkers.length; i++) {
      const m = newMarkers[i];
      L.marker([m.lat, m.lng], { icon: customIcon })
        .addTo(map)
        .bindPopup(m.label || `${m.lat}, ${m.lng}`);
    }
    renderedMarkerCount = newMarkers.length;
  },
  { deep: true }
);

// ---------------------------------------------------------------------
// Add marker manually
// ---------------------------------------------------------------------
async function addMarker() {
  if (!map) return;

  const label = `Marker ${(markers.value?.length || 0) + 1}`;
  if (!markers.value) markers.value = [];

  markers.value.push({
    lat: lat.value,
    lng: lng.value,
    label
  });

  await saveMarkers();

  // Render immediately
  L.marker([lat.value, lng.value], { icon: customIcon })
    .addTo(map)
    .bindPopup(`${label}:<br>${lat.value}, ${lng.value}`);

  // Reset inputs
  lat.value = 52.5186;
  lng.value = 5.4713;
}
</script>

<style scoped>
section {
  font-family: var(--font-primair);
}

h2 {
  font-family: var(--font-heading);
}

input,
button {
  font-family: var(--font-primair);
}
</style>
