<template>
  <div class="app-wrapper">
    <div class="hero-container">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <div class="hero-title-card">
          <img src="/src/assets/img/20ab.webp" alt="Dubbelop Logo" class="card-image" />
        </div>
        <div class="hero-text-section">
          <h1 class="hero-title">Welkom bij de Dubbelop-Route</h1>
          <p class="hero-subtitle">Ervaar hier de kunst & cultuur van Lelystad</p>
          <p class="hero-description">Ontdek een unieke reis door de creatieve hartslag van Lelystad. Laat je inspireren door lokale kunstenaars en culturele schatten.</p>
          <router-link to="/" class="hero-cta">
            <div class="scroll-indicator">
              <span class="arrow" :class="{ 'arrow-up': arrowPointingUp }"></span>
            </div>
          </router-link>
        </div>
      </div>
      <div class="hero-decoration">
        <div class="decoration-circle decoration-1"></div>
        <div class="decoration-circle decoration-2"></div>
      </div>
    </div>
    <header class="header-top">
      <div class="header-container">
        <img src ="/src/assets/img/dbtitel.png" alt="Dubbelop Logo" class="dubbeloproute-titel" />
        <div class="header-right">
          <router-link to="/reviews" class="reviews-button">
            <button class="reviewsKnop">Reviews</button>
          </router-link>
          <Button />
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
import { ref, onMounted, onUnmounted } from 'vue'
import Footer from './components/Footer.vue'
import EditButton from './components/editToolKnop.vue'
import Button from './components/Button.vue'

const arrowPointingUp = ref(false)

const handleScroll = () => {
  const scrollPosition = window.scrollY
  const windowHeight = window.innerHeight
  const documentHeight = document.documentElement.scrollHeight
  
  const mapSection = document.querySelector('.map-section') || document.querySelector('[class*="map"]')
  
  if (mapSection) {
    const mapPosition = mapSection.getBoundingClientRect().top + window.scrollY
    arrowPointingUp.value = scrollPosition > mapPosition - windowHeight
  } else {
    const midPoint = (documentHeight - windowHeight) / 2
    arrowPointingUp.value = scrollPosition > midPoint
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.app-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.hero-container {
  position: relative;
  height: 120vh;
  width: 100%;
  overflow: hidden;
  background: 
    linear-gradient(45deg, transparent 30%, rgba(var(--interactief-rgb, 255, 107, 53), 0.1) 30.5%, rgba(var(--achtergrond-primair-rgb, 255, 107, 53), 0.1) 70%, transparent 70.5%),
    linear-gradient(-45deg, transparent 30%, rgba(var(--site-paars-rgb, 120, 81, 169), 0.1) 30.5%, rgba(var(--interactief-rgb, 120, 81, 169), 0.1) 70%, transparent 70.5%),
    linear-gradient(to right, transparent 0%, rgba(var(--achtergrond-primair-rgb, 255, 107, 53), 0.05) 25%, rgba(var(--interactief-rgb, 120, 81, 169), 0.05) 50%, rgba(var(--achtergrond-primair-rgb-rgb, 255, 107, 53), 0.05) 75%, transparent 100%),
    linear-gradient(135deg, var(--achtergrond-primair) 0%, var(--interactief) 50%, var(--achtergrond-primair) 100%);
  background-size: 120px 120px, 120px 120px, 100% 100%, 100% 100%;
  background-position: 0 0, 60px 60px, 0 0, 0 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  gap: 4rem;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 80% 50%, rgba(var(--site-paars-rgb, 120, 81, 169), 0.05) 0%, transparent 50%);
  z-index: 1;
}

.hero-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 5;
  gap: 4rem;
}

.hero-title-card {
  flex-shrink: 0;
  position: relative;
  width: 400px;
  height: 400px;
  background: linear-gradient(135deg, #FFE066 0%, #FDD835 50%, #FBC02D 100%);
  border-radius: 30px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: float 6s ease-in-out infinite;
  overflow: hidden;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: left center;
  position: relative;
  z-index: 2;
}

.hero-title-card::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 10px,
    rgba(255, 255, 255, 0.1) 10px,
    rgba(255, 255, 255, 0.1) 20px
  );
  animation: shimmer 8s linear infinite;
}

.hero-text-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1.5rem;
  animation: slideInLeft 0.8s ease-out;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  line-height: 1.2;
  margin: 0;
  background-color: var(--site-paars);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -3.5px;
}

.hero-subtitle {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--site-paars);
  margin: 0;
  line-height: 1.4;
}

.hero-description {
  font-size: 1.1rem;
  color: #171717;
  margin: 1rem 0 0 0;
  line-height: 1.8;
  max-width: 500px;
  font-weight: 500;
}

.hero-cta {
  text-decoration: none;
  display: inline-flex;
  margin-top: 1rem;
}

.hero-cta {
  text-decoration: none;
  display: inline-flex;
  margin-top: 2rem;
}

.scroll-indicator {
  width: 210px;
  height: 350px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 8px;
  position: fixed;
  transition: all 0.3s ease;
}

.scroll-indicator:hover {
  scale: 1.1;
}

.arrow {
  width: 0px;
  height: 0px;
  background-color: var(--interactief);
  border-radius: 50%;
  animation: bounce 2s infinite;
  transition: transform 0.6s ease;
}

.arrow.arrow-up {
  transform: rotate(180deg);
}

.arrow::before {
  content: '';
  position: absolute;
  top: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 12px solid transparent;
  border-right: 12px solid transparent;
  border-top: 21px solid hsl(0, 0%, 9%);
}

.hero-decoration {
  position: absolute;
  z-index: 2;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
}

.decoration-circle {
  position: absolute;
  opacity: 0.5;
  mix-blend-mode: overlay;
}

.decoration-1 {
  width: 500px;
  height: 500px;
  background-color: var(--site-paars);
  border-radius: 100%;
  bottom: -200px;
  right: -100px;
}

.decoration-2 {
  width: 300px;
  height: 300px;
  background-color: var(--site-paars);
  border-radius: 100%;
  top: -100px;
  left: -50px;
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
  cursor: default;
  flex-shrink: 0;
  height: 66px;
  width: auto;
  object-fit: contain;
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

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

@keyframes shimmer {
  0% {
    transform: translate(-100%, -100%) rotate(45deg);
  }
  100% {
    transform: translate(100%, 100%) rotate(45deg);
  }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-100px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
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

@media (max-width: 1024px) {
  .hero-container {
    padding: 0 1.5rem;
    gap: 2rem;
  }

  .hero-content {
    gap: 2rem;
  }

  .hero-title-card {
    width: 300px;
    height: 300px;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .hero-subtitle {
    font-size: 1.2rem;
  }

  .hero-description {
    max-width: 100%;
  }
}

@media (max-width: 768px) {
  .hero-container {
    padding: 6rem 1rem 2rem 1rem;
  }

  .hero-content {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .hero-title-card {
    width: 280px;
    height: 280px;
  }

  .hero-title {
    font-size: 2rem;
  }

  .hero-subtitle {
    font-size: 1rem;
  }

  .hero-description {
    font-size: 1rem;
    max-width: 100%;
  }

  .scroll-indicator {
    width: 25px;
    height: 40px;
    border: 2px solid var(--site-paars);
    padding-top: 6px;
  }

  .arrow::before {
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 5px solid var(--site-paars);
  }

  .decoration-1 {
    width: 300px;
    height: 300px;
  }

  .decoration-2 {
    width: 200px;
    height: 200px;
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