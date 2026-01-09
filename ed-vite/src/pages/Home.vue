<template>
  <div class="home-page">
        <nav style="text-align:right; margin: 1rem 0;">
          <router-link to="/reviews" class="reviews-link styled-link">Reviews</router-link>
        </nav>

        <!-- Floating Reviews Button -->
        <router-link to="/reviews" class="floating-reviews-btn">
      <span>Reviews</span>
        </router-link>
     <div class="content-slider" 
       :style="{ backgroundImage: 'url(/img/achSlider.png)', backgroundSize: 'cover', backgroundPosition: 'top center' }">
     <h1 class="neEv-text">Nieuws & Evenementen</h1> 
     <div class="slider-container"> 
        <button class="slider-arrow prev" @click="prevSlide">❮</button>
        <div class="slider-track" ref="sliderTrack">
          <div v-for="(card, index) in sliderCards" :key="index" 
               :class="['slider-card', { active: index === currentIndex, selected: index === currentIndex }]"
               @click="handleCardClick(index)">
            <div class="card-image" :style="{ backgroundImage: `url('${card.image}')` }">
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
          <div v-for="(_, index) in sliderCards" :key="index"
               :class="['slider-dot', { active: index === currentIndex }]"
               @click="goToSlide(index)"></div>
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
          <div class="block-image1" :style="{ backgroundImage: 'url(src/assets/img/18c-glas-in-lood.webp)' }"></div>
        </div>

        <div class="text-block text-block-2">
          <div class="text-block-shape shape-2"></div>
          <div class="block-text">
            <h3>titel2</h3>
            <p>descriptie</p>
          </div>
          <div class="block-image" :style="{ backgroundImage: 'url(src/assets/img/17a-gevelschilderingen.webp)' }"></div>
        </div>

        <div class="text-block text-block-3">
          <div class="text-block-shape shape-3"></div>
          <div class="block-text">
            <h3>titel3</h3>
            <p>descriptie</p>
          </div>
          <div class="block-image2" :style="{ backgroundImage: 'url(src/assets/img/agorahof.webp)' }"></div>
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
  <publicMap />
  <POIModal :isOpen="showPOIModal" :poi="selectedPOI" @close="showPOIModal = false" />
</div>

    <div v-if="showModal" :class="['modal-overlay', { closing: isClosing }]" @click="closeModal">
      <div class="modal-content" @click.stop>
        <button class="modal-close" @click="closeModal">✕</button>
        <div class="modal-image" :style="{ backgroundImage: `url('${selectedCard.image}')` }">
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
import BackendGlue from '../components/BackendGlue.vue'
import PublicMap from '../components/PublicMap.vue'
import POIModal from '../components/POIModal.vue'
import { useMap } from '../composables/useMap'
import type { POI } from '../composables/useMap'
import '@/assets/css/home.css'
import '@/assets/css/styles.css'

// ────────────────────── GET THE SHARED POIS (REQUIRED) ──────────────────────
const { initMap, loadRoute, saveRoute: saveRouteToAPI, updateRoute, pois, addPOI, removePOI, saveMarkers, loadMarkers } = useMap()

// ────────────────────── POI MODAL ──────────────────────
const showPOIModal = ref(false)
const selectedPOI = ref<POI | null>(null)

// ────────────────────── EXACT SAME LISTENER FROM ADMIN.VUE ──────────────────────
const setupPoiClickListener = () => {
  document.addEventListener('click', (e: Event) => {
    const target = e.target as HTMLElement
    if (target.classList.contains('poi-more-btn')) {
      const poiId = target.getAttribute('data-id')
      if (!poiId) return
      const poi = pois.value.find(p => p.id === poiId)
      if (poi) {
        selectedPOI.value = poi
        showPOIModal.value = true
      }
    }
  })
}

// ────────────────────── SLIDER (your original code) ──────────────────────
const currentIndex = ref(0)
const sliderTrack = ref<HTMLElement | null>(null)
const showModal = ref(false)
const selectedCard = ref<any>(null)
const isClosing = ref(false)
const isCardSelected = ref(false)
let autoSlideInterval: ReturnType<typeof setTimeout>

const sliderCards = [
  { title: 'Titel1', description: 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore', date: '18-11-25, 8:00', image: 'src/assets/img/18c-glas-in-lood.webp' },
  { title: 'Titel2', description: 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore', date: '19-11-25, 14:30', image: 'src/assets/img/17a-gevelschilderingen.webp' },
  { title: 'Titel3', description: 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore', date: '20-11-25, 10:00', image: 'src/assets/img/buitenkant-bib-en-stadhuis.webp' },
  { title: 'Titel4', description: 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore', date: '21-11-25, 19:00', image: 'src/assets/img/agorahof.webp' },
  { title: 'Titel5', description: 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore', date: '22-11-25, 11:00', image: 'src/assets/img/20ab.webp' }
]

const updateSlider = () => {
  if (!sliderTrack.value) return
  const cards = sliderTrack.value.querySelectorAll<HTMLElement>('.slider-card')
  const cardWidth = cards[0].offsetWidth + 30
  const centerOffset = sliderTrack.value.offsetWidth / 2 - cardWidth / 2
  const offset = centerOffset - currentIndex.value * cardWidth
  sliderTrack.value.style.transform = `translateX(${offset}px)`
}

const goToSlide = (index: number) => {
  currentIndex.value = index
  if (currentIndex.value >= sliderCards.length) currentIndex.value = 0
  if (currentIndex.value < 0) currentIndex.value = sliderCards.length - 1
  updateSlider()
  resetAutoSlide()
}

const nextSlide = () => goToSlide(currentIndex.value + 1)
const prevSlide = () => goToSlide((currentIndex.value - 1 + sliderCards.length) % sliderCards.length)

const startAutoSlide = () => { autoSlideInterval = setInterval(nextSlide, 5000) }
const resetAutoSlide = () => { clearInterval(autoSlideInterval); startAutoSlide() }

const handleCardClick = (index: number) => {
  if (index === currentIndex.value) {
    selectedCard.value = sliderCards[index]
    showModal.value = true
    isCardSelected.value = true
    clearInterval(autoSlideInterval)
  } else goToSlide(index)
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
  if (e.key === 'ArrowLeft') prevSlide()
  if (e.key === 'ArrowRight') nextSlide()
  canNav = false
  setTimeout(() => canNav = true, cd)
}

// ────────────────────── LIFECYCLE ──────────────────────
onMounted(async () => {
  updateSlider()
  startAutoSlide()
  window.addEventListener('resize', updateSlider)
  window.addEventListener('keydown', handleKeydown)

  if (sliderTrack.value) {
    sliderTrack.value.addEventListener('mouseenter', () => {
      if (!isCardSelected.value) clearInterval(autoSlideInterval)
    })
    sliderTrack.value.addEventListener('mouseleave', () => {
      if (!isCardSelected.value) resetAutoSlide()
    })
  }

  // THIS WAS THE MISSING PIECE
  await loadMarkers()  // ← WITHOUT THIS, pois.value = [] → nothing works

  setupPoiClickListener()
})


onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('resize', updateSlider)
  // Clean up the POI listener (optional but clean)
  document.removeEventListener('click', setupPoiClickListener as EventListener)
})
</script>


