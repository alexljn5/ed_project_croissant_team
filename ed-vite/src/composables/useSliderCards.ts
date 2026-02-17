import { ref, computed } from 'vue'

export interface SliderCard {
  id: string
  title: string
  description: string
  date: string
  image: string
}

const STORAGE_KEY = 'slider-cards-data'

const cards = ref<SliderCard[]>([])

// Laad data bij eerste gebruik
function loadCards() {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    try {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed)) {
        cards.value = parsed
        return
      }
    } catch (err) {
      console.warn('Kan opgeslagen slider cards niet laden', err)
    }
  }

  // fallback als er niets opgeslagen is
  cards.value = [
    {
      id: '1',
      title: 'Titel1',
      description: 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore',
      date: '18-11-25, 8:00',
      image: '/src/assets/img/18c-glas-in-lood.webp',
    },
    {
      id: '2',
      title: 'Titel2',
      description: 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore',
      date: '19-11-25, 14:30',
      image: '/src/assets/img/17a-gevelschilderingen.webp',
    },
    {
      id: '3',
      title: 'Titel3',
      description: 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore',
      date: '20-11-25, 10:00',
      image: '/src/assets/img/buitenkant-bib-en-stadhuis.webp',
    },
    {
      id: '4',
      title: 'Titel4',
      description: 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore',
      date: '21-11-25, 19:00',
      image: '/src/assets/img/agorahof.webp',
    },
    {
      id: '5',
      title: 'Titel5',
      description: 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore',
      date: '22-11-25, 11:00',
      image: '/src/assets/img/20ab.webp',
    },
  ]
}

// Sla op in localStorage
function saveCards() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cards.value))
}

export function useSliderCards() {
  // Laad alleen als nog leeg
  if (cards.value.length === 0) {
    loadCards()
  }

  function addCard(newCard: Omit<SliderCard, 'id'>) {
    const card: SliderCard = {
      ...newCard,
      id: crypto.randomUUID() || Date.now().toString(36),
    }
    cards.value.push(card)
    saveCards()
  }

  function updateCard(updated: SliderCard) {
    const index = cards.value.findIndex(c => c.id === updated.id)
    if (index !== -1) {
      cards.value[index] = { ...updated }
      saveCards()
    }
  }

  function removeCard(id: string) {
    cards.value = cards.value.filter(c => c.id !== id)
    saveCards()
  }

  return {
    cards: computed(() => cards.value),
    addCard,
    updateCard,
    removeCard,
  }
}