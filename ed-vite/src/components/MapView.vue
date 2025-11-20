<template>
  <div id="map"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onBeforeUnmount } from 'vue';
import { initMap } from '../map';
import 'leaflet/dist/leaflet.css';

export default defineComponent({
  setup() {
    let map: L.Map;

    onMounted(() => {
      map = initMap('map'); // Call your existing TypeScript map logic
    });

    onBeforeUnmount(() => {
      if (map) map.remove(); // clean up Leaflet map
    });

    return {};
  }
});
</script>

<style scoped>
#map {
  flex: 1;
  height: 100%;
  width: 100%;
}
</style>