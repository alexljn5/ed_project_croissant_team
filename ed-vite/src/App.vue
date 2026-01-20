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
  <div class="app-wrapper">
    <!-- Navigation Header (Fixed) -->
    <header class="header-top">
      <div class="header-container">
        <h1 class="dubbeloproute-titel">Dubbelop-route</h1>
        <div class="header-right">
          <!--
          <router-link to="/admin" class="admin-button">
            <button class="adminKnop">Admin</button>
          </router-link>
          -->
          <router-link to="/reviews" class="reviews-button">
            <button class="reviewsKnop">Reviews</button>
          </router-link>
          <router-link to="/contact" class="contact-button">
            <button class="contactKnop">Neem Contact Op</button>
          </router-link>
          <router-link to="/" class="logo-link">
            <div class="logo">
              <img
                src="/src/assets/img/dubbelop-logo.png"
                alt="Dubbelop Logo"
              />
            </div>
          </router-link>
        </div>
      </div>
    </header>
    
    <!-- Main Content Area (Scrollable) -->
    <div class="app-layout">
      <router-view />
      <Footer />
    </div>
  </div>
</template>

<script setup lang="ts">
import Footer from './components/Footer.vue'
import EditButton from './components/editToolKnop.vue'
import '@/assets/css/app.css'
</script>

<style scoped>
.app-wrapper {
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: hidden;
}

.header-top {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    padding: 1rem 2rem;
    z-index: 1000;
    background-image: linear-gradient(to right,
            var(--site-paars-xtra-light) 0%,
            var(--site-paars-xtra-light) 20%,
            var(--site-paars-xtra-light) 29.9999%,
            var(--header-bg) 30%,
            var(--header-bg) 70%,
            var(--header-bg) 100%);
    box-shadow: 0 4px 7px rgba(0, 0, 0, 0.5);
}

.header-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    max-width: 100%;
    width: 100%;
}

.dubbeloproute-titel {
    font-family: var(--titel-font);
    font-size: var(--font-grootte2);
    font-weight: bold;
    text-transform: uppercase;
    margin: 0;
    color: rgb(54, 54, 54);
    cursor: default;
    flex-shrink: 0;
}

.header-right {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-left: auto;
    justify-content: flex-end;
}

.logo-link {
    text-decoration: none;
    display: flex;
    align-items: center;
    cursor: pointer;
    transition: transform 0.3s ease;
}

.logo-link:hover {
    transform: scale(1.1);
}

.logo {
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.logo img {
    width: 100%;
    height: 100%;
    object-fit: contain;
}

.contact-button,
.admin-button {
    text-decoration: none;
}

.adminKnop {
    padding: 10px 20px;
    background: var(--interactief);
    border-radius: 20px;
    border: 2px solid var(--interactief);
    cursor: pointer;
    transition: background-color 0.45s;
    font-weight: bold;
    font-family: var(--font-primair);
}

.adminKnop:hover {
    background-color: var(--det-1);
}

.contactKnop {
    padding: 10px 20px;
    background: var(--achtergrond-primair);
    border-radius: 20px;
    border: 2px solid var(--site-paars);
    cursor: pointer;
    transition: background-color 0.45s;
    font-weight: bold;
    font-family: var(--font-primair);
}

.contactKnop:hover {
    background: var(--site-paars);
    color: white;
}

.reviewsKnop {
    padding: 10px 20px;
    background: var(--achtergrond-primair);
    border-radius: 20px;
    border: 2px solid var(--body);
    cursor: pointer;
    transition: background-color 0.45s;
    font-weight: bold;
    font-family: var(--font-primair);
}

.reviewsKnop:hover {
    background: var(--body);
    color: white;
}

.app-layout {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    overflow-x: hidden;
    background-color: transparent;
    scrollbar-width: none;
    -ms-overflow-style: none;
}

.app-layout::-webkit-scrollbar {
    display: none;
}
</style>

<!-- Global styles (not scoped - apply to html/body/root) -->
<style>
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
    scrollbar-width: none;
    -ms-overflow-style: none;
    overflow-y: auto;
}

body::-webkit-scrollbar {
    display: none;
}

/* Ensure page content doesn't hide behind fixed header */
.home-page,
.reviews-page,
.contact-page,
.admin-page {
    padding-top: 120px;
}

.content-slider {
    padding-top: 20px !important;
}
</style>