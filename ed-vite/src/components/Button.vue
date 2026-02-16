<template>
  <router-link to="/contact" class="contact-link">
    <button class="contactKnop">Neem Contact Op</button>
  </router-link>
</template>

<script setup lang="ts">
</script>

<style scoped>
.contact-link {
  text-decoration: none;
}

.contactKnop {
  padding: 10px 20px;
  background-color: var(--site-paars);
  border-radius: 20px;
  border: none;
  cursor: pointer;
  color: hsl(0, 0%, 100%);
  transition: transform 0.3s ease;
  font-family: var(--font-primair);
}

.contactKnop:hover {
  transform: scale(1.02);
}
</style>
