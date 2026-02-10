<template>
  <footer class="footer-container">
    <div class="footer-content">
      <div class="footer-section footer-brand">
        <router-link to="/" class="footer-logo-link">
          <img src="/src/assets/img/dubbelop-logo.png" alt="Dubbelop Logo" class="footer-logo" />
          <h3 class="footer-brand-text">Dubbelop-route</h3>
        </router-link>
        <p class="footer-description">Ontdek en beleef de mooiste kunst, in het hart van Lelystad.</p>
      </div>

      <div class="footer-section">
        <h4>Paginas</h4>
        <ul class="footer-links">
          <li><router-link to="/">Home</router-link></li>
          <li><router-link to="/admin">Admin</router-link></li>
          <li><router-link to="/contact">Contact</router-link></li>
        </ul>
      </div>

      <div class="footer-section">
        <h4>Contactgegevens</h4>
        <ul class="footer-info">
          <li>
            <a href="tel:+31612345678">+31 (0)6 12345678</a>
          </li>
          <li>
            <a href="mailto:test@gmail.com">test@gmail.com</a>
          </li>
          <li>dag1 - dag7</li>
          <li>12:00 - 18:00 uur</li>
        </ul>
      </div>

      <!-- Social Section (optional) -->
      <div class="footer-section">
        <h4>Volg ons</h4>
        <div class="footer-social">
          <a href="#" class="social-link" title="Facebook" alt="Facebook">f</a>
          <a href="#" class="social-link" title="X" alt="X">𝕏</a>
        </div>
      </div>
    </div>

    <div class="footer-bottom">
      <p>&copy; 2025 Dubbelop-route. Alle rechten voorbehouden.</p>
    </div>
  </footer>
</template>

<script setup lang="ts">
</script>

<style scoped>

.footer-container {
  position: relative;
  background-image: linear-gradient(
    to top, 
    var(--site-paars) 0%,
    var(--site-paars) 29.9999%,
    var(--site-paars-light) 30%,
    var(--site-paars-light) 100%
  );  
  color: white;
  padding-top: 3rem;
  margin-top: auto;
  font-family: var(--font-primair);
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem 2rem 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.footer-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.footer-brand {
  gap: 1.5rem;
}

.footer-logo-link {
  display: flex;
  align-items: center;
  gap: 1rem;
  text-decoration: none;
  transition: all 0.3s ease;
  width: fit-content;
}

.footer-logo-link:hover {
  transform: scale(1.08);
}

.footer-logo-link:hover .footer-brand-text {
  color: var(--interactief);
}

.footer-logo-link:hover .footer-logo {
  border-color: var(--interactief);
}

.footer-logo {
  width: 50px;
  height: 50px;
  min-width: 50px;
  min-height: 50px;
  object-fit: contain;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 120px;
  padding: 4px;
  transition: all 0.3s ease;
}

.footer-brand-text {
  font-family: var(--font-heading);
  font-size: 1.25rem;
  font-weight: bold;
  color: white;
  margin: 0;
  text-transform: uppercase;
  white-space: nowrap;
  transition: color 0.3s ease;
}

.footer-description {
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.95rem;
  line-height: 1.6;
  margin: 0;
}

.footer-section h4 {
  font-family: var(--font-heading);
  font-size: 1.1rem;
  font-weight: bold;
  color: white;
  margin: 0 0 0.5rem 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.footer-links,
.footer-info {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.footer-links li a,
.footer-info li a {
  color: rgba(255, 255, 255, 0.85);
  text-decoration: none;
  transition: all 0.3s ease;
  font-size: 0.95rem;
}

.footer-links li a:hover,
.footer-info li a:hover {
  color: var(--interactief);
  transform: translateX(4px);
}

.footer-info li {
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.95rem;
}

.footer-social {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
}

.social-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  min-width: 40px;
  min-height: 40px;
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 50%;
  color: white;
  text-decoration: none;
  transition: all 0.3s ease;
  font-weight: bold;
  font-size: 1.2rem;
}

.social-link:hover {
  background: var(--interactief);
  color: #333;
  transform: translateY(-4px);
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  padding: 1.5rem 2rem;
  text-align: center;
  background: rgba(0, 0, 0, 0.1);
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
}

.footer-bottom p {
  margin: 0;
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    padding: 0 1rem 1.5rem 1rem;
  }

  .footer-section h4 {
    font-size: 1rem;
  }

  .footer-logo {
    width: 40px;
    height: 40px;
  }

  .footer-brand-text {
    font-size: 1.1rem;
  }

  .footer-bottom {
    padding: 1rem;
    font-size: 0.85rem;
  }
}
</style>
