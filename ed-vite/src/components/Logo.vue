<template>
  <div class="logo">
    <img :src="logoSrc" alt="Dubbelop Logo" />
  </div>
</template>

<script setup lang="ts">
// Use a relative path under /src/assets/img/...
const logoSrc = '/src/assets/img/dubbelop-logo.png';
</script>

<style scoped>
.logo {
  background-color: var(--site-paars);
  border-radius: 9999px;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 1rem;
}

.logo img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}
</style>
