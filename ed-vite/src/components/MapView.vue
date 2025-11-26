<template>
  <section class="mb-8 p-6 bg-white rounded shadow-md">
    <h2 class="text-2xl font-bold text-purple-700 mb-4">
      Voeg een marker toe
    </h2>

    <!-- simple form to add markers -->
    <div class="flex gap-4">
      <input v-model.number="lat" type="number" placeholder="Latitude"
             class="p-2 border rounded w-40" />

      <input v-model.number="lng" type="number" placeholder="Longitude"
             class="p-2 border rounded w-40" />

      <button @click="addMarker"
              class="px-4 py-2 bg-purple-600 text-white rounded">
        Add Marker
      </button>
    </div>

    <div id="leaflet-map" class="mt-4" style="height: 400px;"></div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { initMap } from '../leaflet/map'; 
import { useContent } from '../composables/useContent';
import L from 'leaflet';

let map: L.Map;

const lat = ref(52.5186);
const lng = ref(5.4713);

// Use composable to manage markers in database
interface Marker {
  lat: number;
  lng: number;
  label?: string;
}

const { data: markers, loading: markersLoading, save: saveMarkers } = useContent<Marker[]>('map-markers', []);

onMounted(async () => {
  // get the map instance from your existing code
  map = initMap('leaflet-map');
  
  // Wait a bit for data to load from API
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Render existing markers on the map
  console.log('Rendering markers from DB:', markers.value);
  if (markers.value && Array.isArray(markers.value) && markers.value.length > 0) {
    markers.value.forEach((marker: Marker) => {
      console.log('Adding marker:', marker);
      L.marker([marker.lat, marker.lng]).addTo(map)
        .bindPopup(marker.label || `${marker.lat}, ${marker.lng}`);
    });
  }
});

// Track rendered markers to avoid duplicates
let renderedMarkerCount = 0;

// Watch for changes to markers and update map when new ones are added
watch(markers, (newMarkers) => {
  if (newMarkers && Array.isArray(newMarkers) && newMarkers.length > renderedMarkerCount && map) {
    console.log('New markers detected, updating map');
    // Add only new markers
    for (let i = renderedMarkerCount; i < newMarkers.length; i++) {
      const marker = newMarkers[i];
      console.log('Adding new marker to map:', marker);
      L.marker([marker.lat, marker.lng]).addTo(map)
        .bindPopup(marker.label || `${marker.lat}, ${marker.lng}`);
    }
    renderedMarkerCount = newMarkers.length;
  }
}, { deep: true });

async function addMarker() {
  if (!map) return;

  const label = `Marker ${(markers.value?.length || 0) + 1}`;
  
  // Add to state first
  if (!markers.value) {
    markers.value = [];
  }
  markers.value.push({
    lat: lat.value,
    lng: lng.value,
    label: label
  });
  
  // Save to database
  console.log('Saving markers to DB:', markers.value);
  await saveMarkers();
  console.log('Markers saved successfully');
  
  // Add to map (will be handled by watch)
  L.marker([lat.value, lng.value]).addTo(map)
    .bindPopup(`${label}:<br>${lat.value}, ${lng.value}`);
  
  // Reset inputs
  lat.value = 52.5186;
  lng.value = 5.4713;
}
</script>
