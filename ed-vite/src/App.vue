<template>
  <div class="app-wrapper">
    <header class="header-top">
      <div class="header-container">
        <router-link to="/" class="logo-link-title">
          <img src ="/src/assets/img/dbtitel.png" alt="Dubbelop Logo" class="dubbeloproute-titel" />
        </router-link>
        <div class="header-right">
          <router-link to="/reviews" class="reviews-button">
            <button class="reviewsKnop">Reviews</button>
          </router-link>
          <router-link to="/contact" class="contact-button">
            <button class="contactKnop">
              <img
                src="/src/assets/img/Mail.png"
                alt="Mail"
                class="mail-icon"
              />
              Neem Contact Op
            </button>
          </router-link>
          <router-link to="/" class="logo-link">
          </router-link>
        </div>
      </div>
    </header>
    
    <main class="app-layout">
      <router-view />
    </main>
    
    <Footer />
    <EditButton />
  </div>
</template>

<script setup lang="ts">
import Footer from "./components/Footer.vue";
import EditButton from "./components/editToolKnop.vue";
import "@/assets/css/app.css";

</script>

<style scoped>
.app-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header-top {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  padding: 1rem 1rem;
  z-index: 1000;
  background-image: linear-gradient(to right,
          var(--site-paars) 0%,
          var(--site-paars) 20%,
          var(--site-paars) 29.9999%,
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
  font-weight: bold;
  text-transform: uppercase;
  margin: 0;
  cursor: pointer;
  flex-shrink: 0;
  height: 66px;
  width: auto;
  object-fit: contain;
  transition: transform 0.3s ease;
}

.logo-link-title {
  text-decoration: none;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.logo-link-title:hover .dubbeloproute-titel {
  transform: scale(1.05);
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
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--site-paars);
  border-radius: 100%;
  border: 3px solid transparent;
  transition: all 0.3s ease;
}

.logo:hover {
  border-color: var(--interactief);
}

.logo img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.reviews-button,
.admin-button,
.contact-button {
  text-decoration: none;
}

.adminKnop,
.reviewsKnop,
.contactKnop {
  padding: 10px 20px;
  border-radius: 20px;
  border: transparent;
  cursor: pointer;
  transition: all 0.45s ease;
  font-family: var(--font-primair);
}

.adminKnop {
  background: var(--interactief);
  border-color: var(--interactief);
  color: white;
}

.adminKnop:hover {
  background: var(--det-1);
  border-color: var(--det-1);
}

.reviewsKnop {
  background: var(--site-paars);
  color: hsl(0, 0%, 100%);
}

.reviewsKnop:hover {
  background-color: var(--interactief);
}

.contactKnop {
  background: var(--site-paars);
  color: hsl(0, 0%, 100%);
}

.contactKnop:hover {
  background-color: var(--interactief);
}

.app-layout {
  flex: 1; 
  padding-top: 98px;
  padding-bottom: 120px;
  overflow-y: auto;
  overflow-x: hidden;
  background-color: var(--achtergrond-primair);
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.app-layout::-webkit-scrollbar {
  display: none;
}

:deep(.footer-container) {
  position: relative !important;
  margin-top: auto;
}

@keyframes bounce {
  0% {
    transform: translateY(0);
  }
  20% {
    transform: translateY(8px);
    opacity: 1;
  }
  50% {
    transform: translateY(8px);
    opacity: 1;
  }
  100% {
    transform: translateY(0);
    opacity: 0;
  }
}

</style>

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
}

body::-webkit-scrollbar {
  display: none;
}

.content-slider {
  padding-top: 20px !important;
}
</style>