<template>
  <section class="mb-8 p-6 bg-white rounded shadow-md">
    <h2 class="text-2xl font-bold text-purple-700 mb-4">
      Voeg een marker toe ✿
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
import { ref, onMounted } from 'vue';
import { initMap } from '../leaflet/map';  // <-- your function
import L from 'leaflet';

let map: L.Map;

const lat = ref(52.5186);
const lng = ref(5.4713);

onMounted(() => {
  // get the map instance from your existing code
  map = initMap('leaflet-map');
});

function addMarker() {
  if (!map) return;

  L.marker([lat.value, lng.value]).addTo(map)
    .bindPopup(`Nieuwe marker:<br>${lat.value}, ${lng.value}`);
}
</script>
