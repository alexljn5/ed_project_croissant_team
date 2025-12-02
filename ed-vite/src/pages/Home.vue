<template>
  <div>
    <!-- Vue Components Section -->
    <BackendGlue />

    <section class="home-hero">
      <div class="hero-left">
        <h2 class="section-title">Nieuws &amp; Evenementen</h2>
        <Slider />
      </div>
      <aside class="hero-right">
        <h3 class="map-title">Routekaart</h3>
        <MapView />
      </aside>
    </section>
  </div>
</template>

<script setup lang="ts">
import BackendGlue from '../components/BackendGlue.vue';
import Slider from '../components/Slider.vue';
import MapView from '../components/MapView.vue';
</script>

<style scoped>
/* Home layout: responsive two-column row for slider + map */
.home-hero {
  display: flex;
  gap: 24px;
  align-items: flex-start;
  padding: 2rem 1rem;
  max-width: 1200px;
  margin: 0 auto 3rem auto;
}

.hero-left {
  flex: 1 1 60%;
}

.hero-right {
  flex: 0 0 38%;
  min-width: 300px;
}

.section-title {
  margin: 0 0 1rem 0;
  font-size: 1.6rem;
  color: var(--site-paars);
}

.map-title {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  color: var(--header-text);
}

.content-slider {
  width: 100%;
  padding: 2rem 0 3rem;
  background: var(--site-paars);
  color: white;
}

.slider-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: white;
  color: var(--site-paars);
  border: 2px solid var(--site-paars);
  width: 44px;
  height: 44px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.18s ease;
  z-index: 10;
}

.slider-arrow:hover {
  background: var(--interactief);
  color: var(--site-paars);
  transform: translateY(-50%) scale(1.06);
}

.slider-dot.active {
  background: var(--site-paars); /* keep dot color purple */
  transform: scale(1.3);
}

/* Map container adjustments inside the hero */
.hero-right .map-container, .hero-right #leaflet-map {
  width: 100%;
  height: 420px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
}

@media (max-width: 900px) {
  .home-hero { flex-direction: column; }
  .hero-right { order: 2; }
}
</style>
