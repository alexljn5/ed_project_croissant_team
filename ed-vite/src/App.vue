<template>
  <header>
    <h1>Dubbeloproute</h1>
  </header>

  <div class="map-container">
    <MapView />
  </div>

  <HelloWorld msg="Vite + Vue" />
</template>

<script setup lang="ts">
import MapView from './components/MapView.vue'
import HelloWorld from './components/HelloWorld.vue'
</script>

<style scoped>
.map-container {
  height: 400px;
}
</style>
