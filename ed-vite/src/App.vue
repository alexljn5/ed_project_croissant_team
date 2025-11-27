<template>
  <div>
    <Header />
    <BackendGlue />
    <main>
      <Slider />
      <EditableSection /> <!-- New: Simple text edit -->
      <DynamicList /> <!-- New: Add/remove items -->
      <MapView />
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import Header from "./components/Header.vue";
import Slider from "./components/Slider.vue";
import MapView from "./components/MapView.vue";
import BackendGlue from './components/BackendGlue.vue';
import EditableSection from './components/EditableSection.vue'; // Placeholder 1
import DynamicList from './components/DynamicList.vue'; // Placeholder 2
</script>

<style>
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
  scrollbar-width: none;
  -ms-overflow-style: none;
  overflow-y: auto;
}

body::-webkit-scrollbar {
  display: none;
}

main {
  padding-top: 10px;
}
</style>
