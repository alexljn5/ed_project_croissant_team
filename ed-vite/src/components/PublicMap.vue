<!-- src/components/MapView.vue -->
<template>
  <div class="map-container">
    <div id="leaflet-map" ref="mapEl"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useMap } from '../composables/useMap';

const mapEl = ref<HTMLDivElement | null>(null);

onMounted(async () => {
  if (mapEl.value) {
    const { initMap, loadMarkers, refresh } = useMap();
    const map = initMap(mapEl.value.id);  // init leaflet map
    await loadMarkers();                  // laad POI markers
    await refresh();                       // laad routes
  }
});
</script>

<style scoped>
.map-container {
  background-color: none;
  background: transparent;
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 2rem;
}

#leaflet-map {
  width: 100%;
  max-width: 1200px;
  height: 500px;
  border-radius: 8px;
}
@media (max-width: 768px) {
  #leaflet-map {
    height: 400px;
  }
}
</style>
