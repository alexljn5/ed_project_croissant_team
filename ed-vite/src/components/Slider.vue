<template>
  <section class="content-slider">
    <div class="slider-container">
      <div class="slider-count">{{ count }} {{ count === 1 ? 'item' : 'items' }}</div>

      <template v-if="count > 0">
        <button class="slider-arrow prev" @click="prevSlide">❮</button>

        <div class="slider-track" ref="trackRef" @mouseenter="pauseAuto" @mouseleave="startAuto">
          <div
            v-for="(card, index) in extendedCards"
            :key="index"
            class="slider-card"
            :class="{ active: index === currentIndex }"
          >
            <div
              class="card-image"
              :style="{ backgroundImage: `url('${card.image}')` }"
            >
              <div class="date-badge">{{ card.date }}</div>
            </div>
            <div class="card-content">
              <h3>{{ card.title }}</h3>
              <p>{{ card.description }}</p>
            </div>
          </div>
        </div>

        <button class="slider-arrow next" @click="nextSlide">❯</button>
      </template>

      <div v-else class="slider-empty-message">Momenteel geen evenementen, check later terug.</div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick, computed, watch } from 'vue';

const cards = ref([
  { image: '/src/assets/img/18c-glas-in-lood.webp', date: '18-11-25, 8:00', title: 'titel', description: 'description' },
  { image: '/src/assets/img/17a-gevelschilderingen.webp', date: '19-11-25, 14:30', title: 'titel', description: 'description' },
  { image: '/src/assets/img/buitenkant-bib-en-stadhuis.webp', date: '20-11-25, 10:00', title: 'titel', description: 'description' },
  { image: '/src/assets/img/agorahof.webp', date: '21-11-25, 19:00', title: 'titel', description: 'description' },
  { image: '/src/assets/img/20ab.webp', date: '22-11-25, 11:00', title: 'titel', description: 'description' }
]);

// extendedCards: clone last and first to enable seamless looping
const extendedCards = computed(() => {
  if (cards.value.length === 0) return [];
  return [
    cards.value[cards.value.length - 1], // cloned last
    ...cards.value,                      // real cards
    cards.value[0]                       // cloned first
  ];
});

const count = computed(() => cards.value.length);

// start on index 1 (first real card in extendedCards)
const currentIndex = ref(1);
const trackRef = ref<HTMLElement | null>(null);
const cardEls = ref<HTMLElement[]>([]);
let autoSlideInterval: number | null = null;

// utility to (re)collect slider-card elements after DOM changes
async function collectCardEls() {
  await nextTick();
  cardEls.value = Array.from(trackRef.value?.querySelectorAll('.slider-card') || []) as HTMLElement[];
  // recalc position once elements are known
  updateSliderPosition();
}

// compute transform so the current card is centered in the track
function updateSliderPosition() {
  const track = trackRef.value;
  const cardsCollection = cardEls.value;
  if (!track || cardsCollection.length === 0) return;

  // width of one card including gutters (margin-left + margin-right)
  const cardWidth = cardsCollection[0].offsetWidth + 30; // your margins are 15px each -> 30
  const offset = (track.offsetWidth / 2) - (cardWidth / 2) - (currentIndex.value * cardWidth);
  track.style.transform = `translateX(${offset}px)`;
}

function disableTransition() {
  const track = trackRef.value;
  if (track) track.style.transition = 'none';
}

function enableTransition() {
  const track = trackRef.value;
  if (track) track.style.transition = 'transform 0.5s ease';
}

// goToSlide now understands extendedCards layout and snaps when hitting clones
function goToSlide(i: number) {
  const len = cards.value.length; // real cards count

  currentIndex.value = i;
  updateSliderPosition();

  // after the transition completes, if we're on a cloned slide jump to the real one
  // timeout should match your CSS transition (0.5s)
  setTimeout(() => {
    // moved past last real slide -> landed on cloned first (index === len + 1)
    if (i === len + 1) {
      disableTransition();
      currentIndex.value = 1; // real first
      updateSliderPosition();
      requestAnimationFrame(enableTransition);
    }

    // moved before first real slide -> landed on cloned last (index === 0)
    if (i === 0) {
      disableTransition();
      currentIndex.value = len; // real last
      updateSliderPosition();
      requestAnimationFrame(enableTransition);
    }
  }, 520); // slightly more than CSS transition to be safe

  resetAuto();
}

function nextSlide() {
  goToSlide(currentIndex.value + 1);
}

function prevSlide() {
  goToSlide(currentIndex.value - 1);
}

function startAuto() {
  if (autoSlideInterval) clearInterval(autoSlideInterval);
  autoSlideInterval = window.setInterval(nextSlide, 8000);
}

function resetAuto() {
  if (autoSlideInterval) clearInterval(autoSlideInterval);
  startAuto();
}

function pauseAuto() {
  if (autoSlideInterval) clearInterval(autoSlideInterval);
  autoSlideInterval = null;
}

// watch for layout changes (cards array changes) and recollect elements
watch(extendedCards, () => {
  collectCardEls();
});

// also collect once on mount
onMounted(async () => {
  await collectCardEls();

  // images/backgrounds might still be loading — safe to update after window load
  window.addEventListener('load', updateSliderPosition);
  window.addEventListener('resize', updateSliderPosition);
  startAuto();
});

onBeforeUnmount(() => {
  if (autoSlideInterval) clearInterval(autoSlideInterval);
  window.removeEventListener('load', updateSliderPosition);
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
  font-family: var(--font-primair);
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

.slider-count {
  position: absolute;
  top: 12px;
  right: 18px;
  background: rgba(0,0,0,0.12);
  color: white;
  padding: 6px 10px;
  border-radius: 20px;
  font-weight: 600;
  backdrop-filter: blur(4px);
}

/* card styling */
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
  height: 180px;
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
  border-radius: 2px;
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
  font-size: 0.6rem;
  line-height: 1.2;
  font-weight: 700;
  font-family: var(--font-heading);
}

.card-content p {
  margin: 0;
  color: #555;
  line-height: 1.5;
  font-family: var(--font-primair);
}

/* arrows */
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

.slider-empty-message {
  padding: 60px 20px;
  text-align: center;
  color: white;
  font-size: 1.15rem;
  background: transparent;
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