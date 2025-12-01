<template>
  <div>
    <!-- Slider Section -->
    <div class="content-slider">
      <div class="slider-container">
        <button class="slider-arrow prev" @click="prevSlide">❮</button>
        <div class="slider-track" ref="sliderTrack">
          <div v-for="(card, index) in sliderCards" :key="index" 
               :class="['slider-card', { active: index === currentIndex }]">
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
    <BackendGlue />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import BackendGlue from '../components/BackendGlue.vue';

const currentIndex = ref(0);
const sliderTrack = ref<HTMLElement | null>(null);
let autoSlideInterval: NodeJS.Timeout;

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
  autoSlideInterval = setInterval(nextSlide, 8000);
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
      clearInterval(autoSlideInterval);
    });
    sliderTrack.value.addEventListener('mouseleave', () => {
      startAutoSlide();
    });
  }
});
</script>

<style scoped>
/* Slider styles */
.content-slider {
  width: 100%;
  padding: 2rem 0;
  background: linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%);
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
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  transform: scale(0.95);
  opacity: 0.7;
}

.slider-card.active {
  transform: scale(1);
  opacity: 1;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
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
  right: 10px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: bold;
}

.card-content {
  padding: 1.5rem;
}

.card-content h3 {
  margin: 0 0 0.5rem 0;
  color: var(--site-paars);
  font-size: 1.2rem;
}

.card-content p {
  margin: 0;
  color: #666;
  font-size: 0.95rem;
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
  background: var(--interactief);
  cursor: pointer;
  transition: all 0.3s ease;
}

.slider-dot.active {
  background: var(--interactief);
  transform: scale(1.3);
}

.slider-dot:hover {
  background: var(--interactief);
  opacity: 0.8;
}
</style>
