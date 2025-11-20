<template>
  <div>
    <Header />
    <TestConnection />
    <main>
      <Slider />
      <MapView />
    </main>
    <Footer />
  </div>
</template>


<script setup lang="ts">
import Header from './components/Header.vue';
import Slider from './components/Slider.vue';
import MapView from './components/MapView.vue';
import Footer from './components/Footer.vue';
</script>

<style>
/* Global CSS variables and resets (available to all components) */
:root {
  --body: hsla(304, 36%, 42%, 1);
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
  background-color: var(--body);
  font-family: var(--font-primair);
  overflow-x: hidden;
  /* verstop scrollbar in firefox */
  scrollbar-width: none;
  -ms-overflow-style: none;
  /* 
  scroll = functioneel, overflow-y houdt het mogelijk om te kunnen scrollen vanwege overflow-x
  */
  overflow-y: auto;
}

  /* verstop scrollbar in chrome, safari & edge */
body::-webkit-scrollbar {
  display: none;
}

main {
  padding-top: 10px;
}
</style>