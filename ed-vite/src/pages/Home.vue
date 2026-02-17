<template>
  <div class="home-page">
     <div class="content-slider" 
       :style="{ backgroundImage: 'url(/img/achSlider.png)', backgroundSize: 'cover', backgroundPosition: 'top center' }">
     <h1 class="neEv-text">Nieuws & Evenementen</h1> 
     <div class="slider-container"> 
        <button class="slider-arrow prev" @click="prevSlide">❮</button>
        <div class="slider-track" ref="sliderTrack">
          <div
            v-for="(card, index) in sliderCards"
            :key="index"
            :class="[
              'slider-card',
              {
                active: index === currentIndex,
                selected: index === currentIndex,
              },
            ]"
            @click="handleCardClick(index)"
          >
            <div
              class="card-image"
              :style="{ backgroundImage: `url('${card.image}')` }"
            >
              <div class="date-badge">{{ card.date }}</div>
            </div>
            <div class="card-content">
              <h1>{{ card.title }}</h1>
              <p>{{ card.description }}</p>
            </div>
          </div>
        </div>
        <button class="slider-arrow next" @click="nextSlide">❯</button>
        <div class="slider-nav">
          <div
            v-for="(_, index) in sliderCards"
            :key="index"
            :class="['slider-dot', { active: index === currentIndex }]"
            @click="goToSlide(index)"
          ></div>
        </div>
      </div>
    </div>

    <section class="text-segment-section">
      <h2 class="segment-title">segment titel</h2>

      <div class="segment-content">
        <div class="text-block text-block-1">
          <div class="text-block-shape shape-1"></div>
          <div class="block-text">
            <h3>titel1</h3>
            <p>descriptie</p>
          </div>
          <div
            class="block-image1"
            :style="{
              backgroundImage: 'url(src/assets/img/18c-glas-in-lood.webp)',
            }"
          ></div>
        </div>

        <div class="text-block text-block-2">
          <div class="text-block-shape shape-2"></div>
          <div class="block-text">
            <h3>titel2</h3>
            <p>descriptie</p>
          </div>
          <div
            class="block-image"
            :style="{
              backgroundImage:
                'url(src/assets/img/17a-gevelschilderingen.webp)',
            }"
          ></div>
        </div>
        <div class="text-block text-block-3">
          <div class="text-block-shape shape-3"></div>
          <div class="block-text">
            <h3>titel3</h3>
            <p>descriptie</p>
          </div>
          <div
            class="block-image2"
            :style="{ backgroundImage: 'url(src/assets/img/agorahof.webp)' }"
          ></div>
        </div>
      </div>
    </section>
    <!-- Map section (full width below slider) 
    <section class="home-map-section">
      <MapView />
    </section>
-->
    <div class="backend-section">
      <BackendGlue />
    </div>
<div class="publicmap">
  <PublicMap />
  <POIModal :isOpen="showPOIModal" :poi="selectedPOI" @close="showPOIModal = false" />
</div>
    <div v-if="showModal" :class="['modal-overlay', { closing: isClosing }]" @click="closeModal">
      <div class="modal-content" @click.stop>
        <button class="modal-close" @click="closeModal">✕</button>
        <div
          class="modal-image"
          :style="{ backgroundImage: `url('${selectedCard.image}')` }">
          <div class="modal-date-badge">{{ selectedCard.date }}</div>
        </div>
        <div class="modal-text">
          <h1>{{ selectedCard.title }}</h1>
          <p>{{ selectedCard.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import Slider from '../components/Slider.vue'
import BackendGlue from '../components/BackendGlue.vue'
import PublicMap from '../components/PublicMap.vue'
import POIModal from '../components/POIModal.vue'
import { useMap } from '../composables/useMap'
import type { POI } from '../composables/useMap'
import '@/assets/css/home.css'

const {
  initMap,
  loadRoute,
  saveRoute: saveRouteToAPI,
  updateRoute,
  pois,
  addPOI,
  removePOI,
  saveMarkers,
  loadMarkers,
} = useMap();

// ────────────────────── POI MODAL ──────────────────────
const showPOIModal = ref(false);
const selectedPOI = ref<POI | null>(null);

// ────────────────────── EXACT SAME LISTENER FROM ADMIN.VUE ──────────────────────
const setupPoiClickListener = () => {
  document.addEventListener("click", (e: Event) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains("poi-more-btn")) {
      const poiId = target.getAttribute("data-id");
      if (!poiId) return;
      const poi = pois.value.find((p) => p.id === poiId);
      if (poi) {
        selectedPOI.value = poi;
        showPOIModal.value = true;
      }
    }
  });
};

// ────────────────────── SLIDER ──────────────────────
const currentIndex = ref(0)
const sliderTrack = ref<HTMLElement | null>(null)
const showModal = ref(false)
const selectedCard = ref<any>(null)
const isClosing = ref(false)
const isCardSelected = ref(false)
let autoSlideInterval: ReturnType<typeof setTimeout>

const sliderCards = [
  {
    title: "Titel1",
    description:
      "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore",
    date: "18-11-25, 8:00",
    image: "src/assets/img/18c-glas-in-lood.webp",
  },
  {
    title: "Titel2",
    description:
      "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore",
    date: "19-11-25, 14:30",
    image: "src/assets/img/17a-gevelschilderingen.webp",
  },
  {
    title: "Titel3",
    description:
      "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore",
    date: "20-11-25, 10:00",
    image: "src/assets/img/buitenkant-bib-en-stadhuis.webp",
  },
  {
    title: "Titel4",
    description:
      "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore",
    date: "21-11-25, 19:00",
    image: "src/assets/img/agorahof.webp",
  },
  {
    title: "Titel5",
    description:
      "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore",
    date: "22-11-25, 11:00",
    image: "src/assets/img/20ab.webp",
  },
];

const updateSlider = () => {
  if (!sliderTrack.value) return;
  const cards = sliderTrack.value.querySelectorAll<HTMLElement>(".slider-card");
  const cardWidth = cards[0].offsetWidth + 30;
  const centerOffset = sliderTrack.value.offsetWidth / 2 - cardWidth / 2;
  const offset = centerOffset - currentIndex.value * cardWidth;
  sliderTrack.value.style.transform = `translateX(${offset}px)`;
};

const goToSlide = (index: number) => {
  currentIndex.value = index;
  if (currentIndex.value >= sliderCards.length) currentIndex.value = 0;
  if (currentIndex.value < 0) currentIndex.value = sliderCards.length - 1;
  updateSlider();
  resetAutoSlide();
};

const nextSlide = () => goToSlide(currentIndex.value + 1);
const prevSlide = () =>
  goToSlide((currentIndex.value - 1 + sliderCards.length) % sliderCards.length);

const startAutoSlide = () => {
  autoSlideInterval = setInterval(nextSlide, 5000);
};
const resetAutoSlide = () => {
  clearInterval(autoSlideInterval);
  startAutoSlide();
};

const handleCardClick = (index: number) => {
  if (index === currentIndex.value) {
    selectedCard.value = sliderCards[index];
    showModal.value = true;
    isCardSelected.value = true;
    clearInterval(autoSlideInterval);
  } else goToSlide(index);
};

const closeModal = () => {
  isClosing.value = true;
  setTimeout(() => {
    showModal.value = false;
    selectedCard.value = null;
    isClosing.value = false;
    isCardSelected.value = false;
    startAutoSlide();
  }, 400);
};

let canNav = true;
const cd = 300;
const handleKeydown = (e: KeyboardEvent) => {
  if (!canNav) return;
  if (e.key === "ArrowLeft") prevSlide();
  if (e.key === "ArrowRight") nextSlide();
  canNav = false;
  setTimeout(() => (canNav = true), cd);
};

// ────────────────────── LIFECYCLE ──────────────────────
onMounted(async () => {
  updateSlider();
  startAutoSlide();
  window.addEventListener("resize", updateSlider);
  window.addEventListener("keydown", handleKeydown);

  if (sliderTrack.value) {
    sliderTrack.value.addEventListener("mouseenter", () => {
      if (!isCardSelected.value) clearInterval(autoSlideInterval);
    });
    sliderTrack.value.addEventListener("mouseleave", () => {
      if (!isCardSelected.value) resetAutoSlide();
    });
  }

  // THIS WAS THE MISSING PIECE
  await loadMarkers(); // ← WITHOUT THIS, pois.value = [] → nothing works

  setupPoiClickListener();
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('resize', updateSlider)
  document.removeEventListener('click', setupPoiClickListener as EventListener)
})
</script>

<style scoped>
.content-slider {
  width: 100%;
  padding: 2rem 5rem;
  font-family: var(--font-primair);
  background-color: var(--site-paars);
}

.content-slider::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--site-paars);
  z-index: -10000;
}

.slider-container {
  position: relative;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.slider-track {
  display: flex;
  gap: 30px;
  transition: transform 0.6s ease-out;
}

.slider-card {
  flex: 0 0 auto;
  width: 300px;
  background: rgb(255, 255, 255);
  backdrop-filter: blur(100px);
  -webkit-backdrop-filter: blur(100px);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  transform: scale(0.95);
  opacity: 0.7;
  cursor: pointer;
}

.slider-card:hover {
  transform: scale(0.98) translateY(-5px);
  box-shadow: 0 12px 12px rgba(0, 0, 0, 0.15);
}

.slider-card.active {
  transform: scale(1.05);
  opacity: 1;
  box-shadow: 0 12px 8px rgba(0, 0, 0, 0.5);
}

.slider-card.active:hover {
  transform: scale(1.08) translateY(-8px);
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.55);
}

.slider-card.active .card-content h1 {
  transform: translateY(0);
  opacity: 1;
  transition: all 0.4s ease;
}

.slider-card .card-content h1 {
  transform: translateY(10px);
  opacity: 0.8;
}

.card-image {
  width: 100%;
  height: 20vh;
  background-size: cover;
  background-position: center;
  position: relative;
  transition: transform 0.6s ease-out;
}

.date-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 0.75rem;
  font-weight: bold;
  white-space: nowrap;
  width: fit-content;
  max-width: 130px;
}

.card-content {
  padding: 1.5rem;
}

.card-content h1 {
  font-family: var(--font-heading);
  margin: 0 0 0.5rem 0;
  color: var(--site-paars);
  font-size: 1.5rem;
  font-weight: bold;
  transition: all 0.3s ease;
}

.card-content p {
  font-family: var(--font-primair);
  margin: 0;
  color: #232323;
  font-size: 1.1rem;
  line-height: 1.4;
  transition: all 0.3s ease;
}

.slider-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: white;
  color: var(--site-paars);
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 10;
}

.slider-arrow:hover {
  background: var(--interactief);
  color: white;
  transform: translateY(-50%) scale(1.1);
}

.slider-arrow.prev {
  left: 0;
}

.slider-arrow.next {
  right: 0;
}

.slider-nav {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 2rem;
}

.slider-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #ffffff;
  cursor: pointer;
  transition: all 0.3s ease;
}

.slider-dot.active {
  background: var(--interactief);
  transform: scale(1.3);
}

.slider-dot:hover {
  background: hsl(46, 100%, 93%);
  transform: scale(1.15);
}

.backend-section {
  background:transparent;
  min-height: 0;
  width: 0%;
  padding: 0rem 0;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(52, 52, 52, 0.85);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fadeIn 0.4s ease;
}

.modal-overlay.closing {
  animation: fadeOut 0.4s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

.modal-content {
  background: white;
  border-radius: 20px;
  max-width: 800px;
  width: 90%;
  max-height: 90vh;
  overflow: auto;
  position: relative;
  scrollbar-width: none;
  -ms-overflow-style: none;
  overflow-y: auto;
  animation: zoomIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
}

.modal-overlay.closing .modal-content {
  animation: zoomOut 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes zoomIn {
  0% {
    transform: scale(0.8);
    opacity: 0;
  }
  60% {
    transform: scale(1.05);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes zoomOut {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  40% {
    transform: scale(1.05);
    opacity: 1;
  }
  100% {
    transform: scale(0.8);
    opacity: 0;
  }
}

.modal-close {
  position: absolute;
  top: 15px;
  right: 15px;
  background: var(--site-paars);
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.modal-close:hover {
  background: var(--interactief);
  transform: rotate(90deg) scale(1.1);
}

.modal-image {
  width: 100%;
  height: 100px;
  background-size: cover;
  background-position: center;
  position: relative;
  border-radius: 20px 20px 0 0;
}

.modal-date-badge {
  position: absolute;
  top: 20px;
  left: 20px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 5px 20px;
  border-radius: 5px;
  font-size: 1.1rem;
  font-weight: bold;
  white-space: nowrap;
  width: fit-content;
}

.modal-text {
  padding: 3rem;
}

.modal-text h2 {
  margin: 0 0 1.5rem 0;
  color: var(--site-paars);
  font-size: 2.5rem;
  font-weight: bold;
}

.modal-text p {
  margin: 0;
  color: #555;
  font-size: 1.3rem;
  line-height: 1.8;
}

.neEv-text {
  padding-left: 1rem;
  padding-right: 1%;
  width: fit-content;
  font-size: 1.55rem;
  font-weight: lighter;
  text-align: left;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  color: var(--title-text);
  font-family: var(--font-heading);
  margin-left: -5rem;
  margin-right: 0;

  background-image: linear-gradient(
    to right,
    var(--det-1) 0%,
    var(--det-1) 29.8%,
    var(--det-2) 30%,
    var(--det-2) 69.8%,
    var(--det-3) 70%,
    var(--det-3) 100%
  );
}
</style>

<style scoped>
.home-map-section {
  width: 100%;
  padding: 2rem;
  background: white;
}

.home-map-section #leaflet-map {
  height: 500px !important;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  border-radius: 8px;
  overflow: hidden;
}

@media (max-width: 768px) {
  .home-map-section {
    padding: 1rem;
  }

  .home-map-section #leaflet-map {
    height: 400px !important;
  }
}
</style>
