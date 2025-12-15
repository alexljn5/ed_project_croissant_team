<!-- 
# Rohit - heeft dit gedaan
Navigatiebalk aangepast: 
- Logo en knoppen verplaatst naar rechts
- Alleen logo is klikbaar naar homepage
- Dubbeloproute titel is niet meer klikbaar
-->

<!--
# Jordy - heeft dit gedaan
App.vue aangepast:
- globale headers toegevoegd
- footer aangemaakt en toegevoegd
- pagina selectie toegevoegd met tekst knoppen
- pagina selectie = navigate
- social media links toegevoegd
- responsive gemaakt
- footer contactgegevens toegevoegd
Header aangepast:
- nieuwe styling
- nettere layout
Slider.vue aangepast:
- verwijdert uit App.vue
- omgezet naar component
- nieuwe css styling
- achtergrond zelfgemaakt en toegevoegd
-->

<template>
  <div class="app-layout">
    <!-- Navigation Header -->
    <header class="header-top">
      <div class="header-container">
        <h1 class="dubbeloproute-titel">Dubbelop-route</h1>
        <div class="header-right">
          <!--
          <router-link to="/admin" class="admin-button">
            <button class="adminKnop">Admin</button>
          </router-link>
          -->
          <router-link to="/contact" class="contact-button">
            <button class="contactKnop">Neem Contact Op</button>
          </router-link>
          <router-link to="/" class="logo-link">
            <div class="logo">
              <img src="/src/assets/img/dubbelop-logo.png" alt="Dubbelop Logo" />
            </div>
          </router-link>
        </div>
      </div>
    </header>
    <router-view />
    <Footer />
  </div>
</template>

<script setup lang="ts">
import Footer from './components/Footer.vue'
import '@/assets/css/app.css'
</script>
