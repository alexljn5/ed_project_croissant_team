<template>
  <footer>
    <div class="footer-content">
      <p>&copy; {{ new Date().getFullYear() }} Dubbeloproute. All rights reserved.</p>
      <div class="footer-right">
        <a href="/privacy">Privacy Policy</a>
        <a href="/terms">Terms of Service</a>
        <Socials />
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import Socials from './Socials.vue';
</script>

<style scoped>
footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: var(--footer-bg, #f5f5f5);
  color: var(--footer-text, #333);
  padding: 1rem 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.9rem;
}

.footer-content {
  width: 100%;
  max-width: 1200px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.footer-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.footer-right a {
  text-decoration: none;
  color: inherit;
  transition: color 0.2s;
}

.footer-right a:hover {
  color: var(--primary-color, #007bff);
}
</style>
