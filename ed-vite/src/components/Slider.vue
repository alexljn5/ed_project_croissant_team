<template>
  <section class="content-slider">
    <div class="slider-container">
      <button class="slider-arrow prev" @click="prevSlide">❮</button>

      <div class="slider-track" ref="trackRef" @mouseenter="pauseAuto" @mouseleave="startAuto">
        <div
          v-for="(card, index) in cards"
          :key="index"
          class="slider-card"
          :class="{ active: index === currentIndex }"
          ref="cardEls"
        >
          <div class="card-image" :style="{ backgroundImage: `url('${card.image}')` }">
            <div class="date-badge">{{ card.date }}</div>
          </div>
          <div class="card-content">
            <h3>{{ card.title }}</h3>
            <p>{{ card.description }}</p>
          </div>
        </div>
      </div>

      <button class="slider-arrow next" @click="nextSlide">❯</button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';

const cards = [
  { image: '/src/assets/img/18c-glas-in-lood.webp', date: '18-11-25, 8:00', title: 'titel', description: 'description' },
  { image: '/src/assets/img/17a-gevelschilderingen.webp', date: '19-11-25, 14:30', title: 'titel', description: 'description' },
  { image: '/src/assets/img/buitenkant-bib-en-stadhuis.webp', date: '20-11-25, 10:00', title: 'titel', description: 'description' },
  { image: '/src/assets/img/agorahof.webp', date: '21-11-25, 19:00', title: 'titel', description: 'description' },
  { image: '/src/assets/img/20ab.webp', date: '22-11-25, 11:00', title: 'titel', description: 'description' }
];

const currentIndex = ref<number>(0);
const trackRef = ref<HTMLElement | null>(null);
const cardEls = ref<Array<HTMLElement>>([]);
let autoSlideInterval = 0;

function updateSliderPosition() {
  const track = trackRef.value;
  const cardsCollection = cardEls.value;
  if (!track || cardsCollection.length === 0) return;

  const cardWidth = cardsCollection[0].offsetWidth + 30;
  const offset = (track.offsetWidth / 2) - (cardWidth / 2) - (currentIndex.value * cardWidth);
  track.style.transform = `translateX(${offset}px)`;
}

function goToSlide(i: number) {
  currentIndex.value = (i + cards.length) % cards.length;
  updateSliderPosition();
  resetAuto();
}

function nextSlide() {
  goToSlide(currentIndex.value + 1);
}

function prevSlide() {
  goToSlide(currentIndex.value - 1);
}

function startAuto() {
  clearInterval(autoSlideInterval);
  autoSlideInterval = window.setInterval(nextSlide, 8000);
}

function resetAuto() {
  clearInterval(autoSlideInterval);
  startAuto();
}

function pauseAuto() {
  clearInterval(autoSlideInterval);
}

onMounted(async () => {
  // populate cardEls (refs)
  await nextTick();
  cardEls.value = Array.from(trackRef.value?.querySelectorAll('.slider-card') || []) as unknown as HTMLElement[];
  updateSliderPosition();
  window.addEventListener('resize', updateSliderPosition);
  startAuto();
});

onBeforeUnmount(() => {
  clearInterval(autoSlideInterval);
  window.removeEventListener('resize', updateSliderPosition);
});
</script>

<style scoped>
.content-slider {
  position: relative;
  z-index: 2;
  background: var(--site-paars);
  padding: 120px 0 20px;
  overflow: hidden;
}

.slider-container {
  position: relative;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px 0;
  top: 0;
  bottom: 0;
}

.slider-track {
  display: flex;
  transition: transform 0.5s ease;
  padding: 20px 0;
}

.slider-card {
  flex: 0 0 300px;
  margin: 0 15px;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 10px 9px rgba(0, 0, 0, 0.1);
  transition: all 0.4s ease;
  position: relative;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(10px) saturate(15px);
  -webkit-backdrop-filter: blur(10px) saturate(15px);
  border: 1px solid rgba(255, 255, 255, 0.18);
}

.slider-card.active {
  transform: scale(1.1);
  z-index: 10;
}

.slider-card:not(.active) {
  opacity: 0.7;
}

.card-image {
  height: 45%;
  width: 100%;
  background-size: cover;
  background-position: center;
  position: relative;
}

.date-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(22, 22, 22, 0.7);
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 0.8rem;
  font-weight: bold;
  box-shadow: 1px 5px 2px rgba(0, 0, 0, 0.35) inset;
}

.card-content {
  padding: 20px;
}

.card-content h3 {
  margin: 0 0 10px;
  color: var(--header-text);
  font-size: 1.2rem;
}

.card-content p {
  margin: 0;
  color: #555;
  line-height: 1.5;
}

.slider-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.8);
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 100;
  font-size: 1.2rem;
  color: var(--site-paars);
}

.slider-arrow:hover {
  background: var(--interactief);
  color: white;
}

.slider-arrow.prev {
  left: 10px;
  bottom: 0;
}

.slider-arrow.next {
  right: 10px;
  bottom: 0;
}

@media (max-width: 768px) {
  .slider-card {
    flex: 0 0 250px;
  }

  .slider-arrow {
    width: 35px;
    height: 35px;
  }
}
</style>