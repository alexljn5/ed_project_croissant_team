<template>
  <header>
    <h1 class="dubbeloproute-titel">Dubbeloproute</h1>

    <div class="header-right">
      <ContactButton />
      <Logo />
    </div>
  </header>
</template>

<script setup lang="ts">
import ContactButton from './Button.vue';
import Logo from './Logo.vue';
</script>

<style scoped>
header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  padding: 1rem 2rem;
  z-index: 1000;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--header-bg);
  box-shadow: 0 4px 7px rgba(0, 0, 0, 0.5);
  gap: 1rem;
}

.dubbeloproute-titel {
  font-family: 'Lucida Sans', sans-serif;
  font-size: var(--font-grootte2);
  margin: 0;
  color: var(--header-text);
}

/* right group: button + logo */
.header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}
</style>