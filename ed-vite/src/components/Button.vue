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
  background: plum;
  border-radius: 20px;
  border: 2px solid var(--site-paars);
  cursor: pointer;
  color: hsl(240, 1%, 14%);;
  transition: background-color 0.45s;
  font-weight: bold;
  transition: background 0.1s;
  font-family: var(--font-primair);
}

.contactKnop:hover {
  background: var(--site-paars);
  color: white;
}
</style>
