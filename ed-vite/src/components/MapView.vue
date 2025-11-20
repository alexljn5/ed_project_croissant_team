<template>
  <div id="map" style="height: 400px; width: 100%;"></div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import * as L from 'leaflet';

onMounted(() => {
  // Initialize map
  const map = L.map('map').setView([51.505, -0.09], 13);
  
  // Add tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);
  
  // Add marker
  L.marker([51.505, -0.09]).addTo(map)
    .bindPopup('placeholder')
    .openPopup();
});
</script>