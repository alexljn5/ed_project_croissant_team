<template>
  <div>
    <!-- Slider Section -->
    <div class="content-slider">
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
              <h3>{{ card.title }}</h3>
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

    <!-- Vue Components Section -->
    <div class="backend-section">
      <BackendGlue />
    </div>

    <!-- Modal for zoomed card -->
    <div v-if="showModal" :class="['modal-overlay', { closing: isClosing }]" @click="closeModal">
      <div class="modal-content" @click.stop>
        <button class="modal-close" @click="closeModal">✕</button>
        <div class="modal-image" :style="{ backgroundImage: `url('${selectedCard.image}')` }">
          <div class="modal-date-badge">{{ selectedCard.date }}</div>
        </div>
        <div class="modal-text">
          <h2>{{ selectedCard.title }}</h2>
          <p>{{ selectedCard.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import BackendGlue from '../components/BackendGlue.vue';

const currentIndex = ref(0);
const sliderTrack = ref<HTMLElement | null>(null);
const showModal = ref(false);
const selectedCard = ref<any>(null);
let autoSlideInterval: ReturnType<typeof setTimeout>;

const isCardSelected = ref(false);

const handleCardClick = (index: number) => {
  if (index === currentIndex.value) {
    // Als geselecteerd, open modal en stop slider
    selectedCard.value = sliderCards[index];
    showModal.value = true;
    isCardSelected.value = true;
    clearInterval(autoSlideInterval);
  } else {
    // Als niet geselecteerd, ga naar die slide
    goToSlide(index);
  }
};

const isClosing = ref(false);

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

const sliderCards = [
  {
    title: 'titel',
    description: 'description',
    date: '18-11-25, 8:00',
    image: 'src/assets/img/18c-glas-in-lood.webp'
  },
  {
    title: 'titel',
    description: 'description',
    date: '19-11-25, 14:30',
    image: 'src/assets/img/17a-gevelschilderingen.webp'
  },
  {
    title: 'titel',
    description: 'description',
    date: '20-11-25, 10:00',
    image: 'src/assets/img/buitenkant-bib-en-stadhuis.webp'
  },
  {
    title: 'titel',
    description: 'description',
    date: '21-11-25, 19:00',
    image: 'src/assets/img/agorahof.webp'
  },
  {
    title: 'titel',
    description: 'description',
    date: '22-11-25, 11:00',
    image: 'src/assets/img/20ab.webp'
  }
];

const updateSlider = () => {
  if (!sliderTrack.value) return;
  const cards = sliderTrack.value.querySelectorAll('.slider-card');
  const cardWidth = (cards[0] as HTMLElement).offsetWidth + 30;
  const offset = sliderTrack.value.offsetWidth / 2 - cardWidth / 2 - currentIndex.value * cardWidth;
  sliderTrack.value.style.transform = `translateX(${offset}px)`;
};

const goToSlide = (index: number) => {
  currentIndex.value = index;
  if (currentIndex.value >= sliderCards.length) currentIndex.value = 0;
  if (currentIndex.value < 0) currentIndex.value = sliderCards.length - 1;
  updateSlider();
  resetAutoSlide();
};

const nextSlide = () => {
  goToSlide(currentIndex.value + 1);
};

const prevSlide = () => {
  goToSlide(currentIndex.value - 1);
};

const startAutoSlide = () => {
  autoSlideInterval = setInterval(nextSlide, 10000);
};

const resetAutoSlide = () => {
  clearInterval(autoSlideInterval);
  startAutoSlide();
};

onMounted(() => {
  updateSlider();
  startAutoSlide();
  window.addEventListener('resize', updateSlider);

  if (sliderTrack.value) {
    sliderTrack.value.addEventListener('mouseenter', () => {
      if (!isCardSelected.value) {
        clearInterval(autoSlideInterval);
      }
    });
    sliderTrack.value.addEventListener('mouseleave', () => {
      if (!isCardSelected.value) {
        resetAutoSlide();
      }
    });
  }
});
</script>

<style scoped>
/* Slider styles */
.content-slider {
  width: 100%;
  padding: 2rem 0;
  background: var(--site-paars);
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
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
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
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

.slider-card.active {
  transform: scale(1.05);
  opacity: 1;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5), 0 0 0 3px rgba(128, 128, 128, 0.4);
}

.slider-card.active:hover {
  transform: scale(1.08) translateY(-8px);
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.55), 0 0 0 3px rgba(128, 128, 128, 0.5);
}

.card-image {
  width: 100%;
  height: 180px;
  background-size: cover;
  background-position: center;
  position: relative;
}

.date-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 0.75rem;
  font-weight: bold;
  white-space: nowrap;
  width: fit-content;
  max-width: 130px;
}

.card-content {
  padding: 1.5rem;
}

.card-content h3 {
  margin: 0 0 0.5rem 0;
  color: var(--site-paars);
  font-size: 1.5rem;
  font-weight: bold;
  transition: all 0.3s ease;
}

.card-content p {
  margin: 0;
  color: #666;
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
  background: #ccc;
  cursor: pointer;
  transition: all 0.3s ease;
}

.slider-dot.active {
  background: var(--interactief);
  transform: scale(1.3);
}

.slider-dot:hover {
  background: var(--interactief);
}

.backend-section {
  background: white;
  min-height: 100vh;
  width: 100%;
  padding: 2rem 0;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
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
  animation: zoomIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
}

.modal-overlay.closing .modal-content {
  animation: zoomOut 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes zoomIn {
  from {
    transform: scale(0.8);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes zoomOut {
  from {
    transform: scale(1);
    opacity: 1;
  }
  to {
    transform: scale(0.8);
    opacity: 0;
  }
}

.modal-close {
  position: absolute;
  top: 15px;
  right: 15px;
  background: var(--interactief);
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
  background: var(--site-paars);
  transform: rotate(90deg) scale(1.1);
}

.modal-image {
  width: 100%;
  height: 400px;
  background-size: cover;
  background-position: center;
  position: relative;
  border-radius: 20px 20px 0 0;
}

.modal-date-badge {
  position: absolute;
  top: 20px;
  left: 20px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 10px 20px;
  border-radius: 25px;
  font-size: 1.1rem;
  font-weight: bold;
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
</style>
