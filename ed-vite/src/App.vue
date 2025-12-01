<template>
  <div class="app-layout">
    <!-- Navigation Header -->
    <header class="header-top">
      <div class="header-container">
        <router-link to="/" class="header-left">
          <h1 class="dubbeloproute-titel">Dubbeloproute</h1>
        </router-link>

        <div class="header-right">
          <router-link to="/admin" class="admin-button">
            <button class="adminKnop">Admin</button>
          </router-link>
          <router-link to="/contact" class="contact-button">
            <button class="contactKnop">Neem Contact Op</button>
          </router-link>
          <div class="logo">
            <img src="/src/assets/img/dubbelop-logo.png" alt="Dubbelop Logo" />
          </div>
        </div>
      </div>
    </header>

    <!-- Router Content + Components -->
    <router-view />

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
//ignore header temp
//import Header from './components/Header.vue'
import Slider from './components/Slider.vue'
import MapView from './components/MapView.vue'
</script>

<style>
body::-webkit-scrollbar {
  display: none;
}
</style>

<style scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding-top: 80px;
  background-color: transparent;
}

/* HEADER STYLES */
/*
.header-top {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  padding: 1rem 2rem;
  z-index: 1000;
  background-color: var(--header-bg);
box-shadow: 0 4px 7px rgba(0, 0, 0, 0.5);
}
*/

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.header-left {
  text-decoration: none;
}

.dubbeloproute-titel {
  font-family: 'Lucida Sans', sans-serif;
  font-size: var(--font-grootte2);
  margin: 0;
  color: var(--header-text);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
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

/* BUTTONS */
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
  color: #333;
}

.adminKnop:hover {
  background: #e5ad3f;
  transition: all 0.1s;
}

.contactKnop {
  padding: 10px 20px;
  background: var(--achtergrond-primair);
  border-radius: 20px;
  border: 2px solid var(--site-paars);
  cursor: pointer;
  transition: background-color 0.45s;
  font-weight: bold;
  color: var(--site-paars);
}

.contactKnop:hover {
  background: var(--site-paars);
  color: white;
  transition: all 0.1s;
}

main {
  padding-top: 10px;
}
</style>