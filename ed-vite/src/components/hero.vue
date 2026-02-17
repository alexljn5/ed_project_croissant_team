<template>
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
      </div>
    </div>
    <div class="hero-decoration">
      <div class="decoration-circle decoration-1"></div>
      <div class="decoration-circle decoration-2"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
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
  justify-content: center;
  padding: 0;
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
  padding: 0 2rem;
  box-sizing: border-box;
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

@media (max-width: 1024px) {
  .hero-content {
    gap: 2rem;
    padding: 0 1.5rem;
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
  .hero-content {
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 6rem 1rem 2rem 1rem;
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
