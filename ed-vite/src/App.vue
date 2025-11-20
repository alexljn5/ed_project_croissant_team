<template>
  <div>
    <Header />
    <main>
      <Slider />
      <MapView />
    </main>
  </div>
</template>

<script setup lang="ts">
import Header from './components/Header.vue';
import Slider from './components/Slider.vue';
import MapView from './components/MapView.vue';
</script>

<style>
/* Global CSS variables and resets (available to all components) */
:root {
  --achtergrond-primair: hsl(0, 0%, 96%);
  --site-paars: hsla(304, 36%, 42%, 1);
  --interactief: hsl(41, 100%, 69%);
  --header-bg: rgba(255, 255, 255, 0.8);
  --header-shadow: rgba(0, 0%, 0.1);
  --font-primair: Arial, Verdana;
  --font-grootte: 16px;
  --font-grootte2: 32px;
  --header-text: hsla(0, 0%, 11%, 1);
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  background-color: var(--achtergrond-primair);
  font-family: var(--font-primair);
  overflow-x: hidden;
}

main {
  padding-top: 110px;
}
</style>
