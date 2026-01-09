<template>
  <div class="reviews-page">
    <h1>Reviews</h1>
    <form @submit.prevent="addReview" class="review-form">
      <textarea v-model="newReview" placeholder="laat hier een review achter..." required rows="3"></textarea>
      <button type="submit">Submit</button>
    </form>
    <div class="reviews-list" v-if="reviews.length">
      <h2>Reviews:</h2>
      <ul>
        <li v-for="(review, idx) in reviews" :key="idx" class="review-item">
          <span class="review-text">{{ review }}</span>
        </li>
      </ul>
    </div>
    <div v-else class="no-reviews">...</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

const STORAGE_KEY = 'site-reviews-v1'
const newReview = ref('')
const reviews = ref<string[]>([])

onMounted(() => {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    try {
      reviews.value = JSON.parse(saved)
    } catch {}
  }
})

watch(reviews, (val) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(val))
}, { deep: true })

function addReview() {
  if (newReview.value.trim()) {
    reviews.value.unshift(newReview.value.trim())
    newReview.value = ''
  }
}
</script>

<style scoped>
.reviews-page {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}
</style>
