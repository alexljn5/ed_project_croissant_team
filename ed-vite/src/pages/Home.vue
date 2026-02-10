<template>
  <div class="home-page">
    <div
      class="content-slider"
      :style="{
        backgroundImage: 'url(/img/achSlider.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'top center',
      }"
    >
      <h1 class="neEv-text">Nieuws & Evenementen</h1>

      <div class="slider-container">
        <button class="slider-arrow prev" @click="prevSlide">❮</button>
        <div class="slider-track" ref="sliderTrack">
          <div
            v-for="(card, index) in sliderCards"
            :key="card.id"
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
              backgroundImage: 'url(src/assets/img/17a-gevelschilderingen.webp)',
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

    <div class="backend-section">
      <BackendGlue />
    </div>

    <div class="publicmap">
      <PublicMap />
      <POIModal :isOpen="showPOIModal" :poi="selectedPOI" @close="showPOIModal = false" />
    </div>

    <div
      v-if="showModal"
      :class="['modal-overlay', { closing: isClosing }]"
      @click="closeModal"
    >
      <div class="modal-content" @click.stop>
        <button class="modal-close" @click="closeModal">✕</button>
        <div
          class="modal-image"
          :style="{ backgroundImage: `url('${selectedCard.image}')` }"
        >
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
import { ref, onMounted, onUnmounted } from "vue"
import BackendGlue from "../components/BackendGlue.vue"
import PublicMap from "../components/PublicMap.vue"
import POIModal from "../components/POIModal.vue"
import { useMap } from "../composables/useMap"
import { useSliderCards } from "@/composables/useSliderCards"
import type { POI } from "../composables/useMap"
import "@/assets/css/home.css"
import "@/assets/css/styles.css"

// ────────────────────── MAP / POI logica ──────────────────────
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
} = useMap()

// ────────────────────── POI MODAL ──────────────────────
const showPOIModal = ref(false)
const selectedPOI = ref<POI | null>(null)

const setupPoiClickListener = () => {
  document.addEventListener("click", (e: Event) => {
    const target = e.target as HTMLElement
    if (target.classList.contains("poi-more-btn")) {
      const poiId = target.getAttribute("data-id")
      if (!poiId) return
      const poi = pois.value.find((p) => p.id === poiId)
      if (poi) {
        selectedPOI.value = poi
        showPOIModal.value = true
      }
    }
  })
}

// ────────────────────── SLIDER ──────────────────────
const { cards: sliderCards } = useSliderCards()

const currentIndex = ref(0)
const sliderTrack = ref<HTMLElement | null>(null)
const showModal = ref(false)
const selectedCard = ref<any>(null)
const isClosing = ref(false)
const isCardSelected = ref(false)
let autoSlideInterval: ReturnType<typeof setTimeout>

const updateSlider = () => {
  if (!sliderTrack.value) return
  const cards = sliderTrack.value.querySelectorAll<HTMLElement>(".slider-card")
  if (cards.length === 0) return
  const cardWidth = cards[0].offsetWidth + 30
  const centerOffset = sliderTrack.value.offsetWidth / 2 - cardWidth / 2
  const offset = centerOffset - currentIndex.value * cardWidth
  sliderTrack.value.style.transform = `translateX(${offset}px)`
}

const goToSlide = (index: number) => {
  currentIndex.value = index
  if (currentIndex.value >= sliderCards.value.length) currentIndex.value = 0
  if (currentIndex.value < 0) currentIndex.value = sliderCards.value.length - 1
  updateSlider()
  resetAutoSlide()
}

const nextSlide = () => goToSlide(currentIndex.value + 1)

const prevSlide = () =>
  goToSlide((currentIndex.value - 1 + sliderCards.value.length) % sliderCards.value.length)

const startAutoSlide = () => {
  autoSlideInterval = setInterval(nextSlide, 5000)
}

const resetAutoSlide = () => {
  clearInterval(autoSlideInterval)
  startAutoSlide()
}

const handleCardClick = (index: number) => {
  if (index === currentIndex.value) {
    selectedCard.value = sliderCards.value[index]
    showModal.value = true
    isCardSelected.value = true
    clearInterval(autoSlideInterval)
  } else {
    goToSlide(index)
  }
}

const closeModal = () => {
  isClosing.value = true
  setTimeout(() => {
    showModal.value = false
    selectedCard.value = null
    isClosing.value = false
    isCardSelected.value = false
    startAutoSlide()
  }, 400)
}

let canNav = true
const cd = 300
const handleKeydown = (e: KeyboardEvent) => {
  if (!canNav) return
  if (e.key === "ArrowLeft") prevSlide()
  if (e.key === "ArrowRight") nextSlide()
  canNav = false
  setTimeout(() => (canNav = true), cd)
}

// ────────────────────── LIFECYCLE ──────────────────────
onMounted(async () => {
  updateSlider()
  startAutoSlide()
  window.addEventListener("resize", updateSlider)
  window.addEventListener("keydown", handleKeydown)

  if (sliderTrack.value) {
    sliderTrack.value.addEventListener("mouseenter", () => {
      if (!isCardSelected.value) clearInterval(autoSlideInterval)
    })
    sliderTrack.value.addEventListener("mouseleave", () => {
      if (!isCardSelected.value) resetAutoSlide()
    })
  }

  await loadMarkers()
  setupPoiClickListener()
})

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeydown)
  window.removeEventListener("resize", updateSlider)
  document.removeEventListener("click", setupPoiClickListener as EventListener)
  if (autoSlideInterval) clearInterval(autoSlideInterval)
})
</script>

<style scoped>
/* ────────────────────────────────────────────── */
/* Je bestaande styles blijven ongewijzigd         */
/* ────────────────────────────────────────────── */

.content-slider {
  width: 100%;
  padding: 2rem 0;
  font-family: var(--font-primair);
  position: relative;
}

.content-slider::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to top,
    var(--site-paars),
    rgba(0, 0, 0, 0.2),
    rgba(0, 0, 0, 0.2),
    rgba(0, 0, 0, 0.2),
    rgba(0, 0, 0, 0.2)
  );
  z-index: -10000;
}

/* ... alle andere styles blijven hetzelfde ... */

.neEv-text {
  padding-left: 2.5%;
  padding-right: 1%;
  width: fit-content;
  font-size: 1.55rem;
  font-weight: lighter;
  text-align: left;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  color: var(--title-text);
  font-family: var(--font-heading);

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
/* Bestaande .card-content aanpassen */
.card-content {
  padding: 1.5rem;
  height: 120px;           /* vaste hoogte – pas aan als nodig */
  overflow: hidden;
}

/* Titel blijft zoals hij is */
.card-content h1 {
  font-family: var(--font-heading);
  margin: 0 0 0.5rem 0;
  color: var(--site-paars);
  font-size: 1.5rem;
  font-weight: bold;
  transition: all 0.3s ease;
  line-height: 1.2;
  max-height: 3.6rem;      /* voorkomt dat titel te veel regels neemt */
  overflow: hidden;
}

/* Beschrijving afkappen met ellipsis */
.card-content p {
  font-family: var(--font-primair);
  margin: 0;
  color: #232323;
  font-size: 1.1rem;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 4;          /* maximaal 4 regels tonen */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Zorg dat de hele kaart niet uitrekt */
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
  display: flex;
  flex-direction: column;
}

/* Modal: volledige tekst laten zien */
.modal-text p {
  margin: 0;
  color: #555;
  font-size: 1.3rem;
  line-height: 1.8;
  white-space: pre-wrap;     /* behoudt enters */
  word-wrap: break-word;
}
</style>

<style scoped>
/* Homepage map section - full width below slider */
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