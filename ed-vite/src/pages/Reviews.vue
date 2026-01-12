<template>
  <div class="reviews-page">
    <h1>Reviews</h1>
    <form @submit.prevent="addReview" class="review-form">
      <textarea v-model="newReview.text" placeholder="laat hier een review achter..." required rows="3"></textarea>
      <div class="review-options">
        <label>
          <input type="checkbox" v-model="newReview.anonymous" /> Plaats als anoniem
        </label>
        <input v-if="!newReview.anonymous" v-model="newReview.name" placeholder="Naam (optioneel)" />
        <input v-model="newReview.email" placeholder="Email (optioneel)" type="email" />
        <div class="star-rating">
          <span v-for="star in 5" :key="star" @click="newReview.stars = star" :class="['star', { active: newReview.stars >= star }]">&#9733;</span>
        </div>
      </div>
      <button type="submit">Submit</button>
    </form>
    <div class="reviews-list" v-if="reviews.length">
      <h2>Reviews:</h2>
      <ul>
        <li v-for="(review, idx) in visibleReviews" :key="idx" class="review-item">
          <span class="review-text">{{ review.text }}</span>
          <div class="review-meta">
            <span v-if="review.anonymous">(anoniem)</span>
            <span v-else-if="review.name">- {{ review.name }}</span>
            <span v-if="review.email" class="review-email"> ({{ review.email }})</span>
            <span v-if="review.stars" class="review-stars">
              <span v-for="star in 5" :key="star" :class="['star', { active: review.stars >= star }]">&#9733;</span>
            </span>
          </div>
          <button @click="removeReview(idx)" class="remove-btn">Verwijder <p id="liltekst">"(temporary ofc)"</p></button>
        </li>
      </ul>
      <button v-if="visibleReviews.length < reviews.length" @click="showMoreReviews" class="show-more-btn">Show more</button>
    </div>
    <div v-else class="no-reviews">...</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

const STORAGE_KEY = 'site-reviews-v2'
interface Review {
  text: string;
  anonymous: boolean;
  name?: string;
  email?: string;
  stars?: number;
}
const newReview = ref<Review>({ text: '', anonymous: false, name: '', email: '', stars: 0 })
const reviews = ref<Review[]>([])
const visibleReviews = ref<Review[]>([])
const REVIEWS_TO_SHOW = 3



onMounted(() => {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    try {
      reviews.value = JSON.parse(saved)
    } catch {}
  }
  visibleReviews.value = reviews.value.slice(0, REVIEWS_TO_SHOW)
})

watch(reviews, (val) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(val))
  visibleReviews.value = val.slice(0, REVIEWS_TO_SHOW)
}, { deep: true })

function addReview() {
  if (newReview.value.text.trim()) {
    reviews.value.unshift({
      text: newReview.value.text.trim(),
      anonymous: newReview.value.anonymous,
      name: newReview.value.anonymous ? '' : newReview.value.name?.trim() || '',
      email: newReview.value.email?.trim() || '',
      stars: newReview.value.stars || 0
    })
    newReview.value = { text: '', anonymous: false, name: '', email: '', stars: 0 }
  }
}

function showMoreReviews() {
  const current = visibleReviews.value.length
  visibleReviews.value = reviews.value.slice(0, current + REVIEWS_TO_SHOW)
}

function removeReview(idx: number) {
  reviews.value.splice(idx, 1)
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
.review-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.review-options {
  display: flex;
  gap: 1rem;
  align-items: center;
}
.review-item {
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
  position: relative;
}

.review-meta {
  font-size: 0.9em;
  color: #888;
  margin-top: 0.2em;
}
.review-email {
  color: #aaa;
}
.review-stars {
  margin-left: 0.5em;
}
.star {
  cursor: pointer;
  color: #ccc;
  font-size: 1.2em;
  transition: color 0.2s;
}
.star.active {
  color: #FFD700;
}
.remove-btn {
  position: absolute;
  right: 0;
  top: 0;
  background: #ffdddd;
  border: none;
  color: #c00;
  padding: 0.2em 0.7em;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9em;
  transition: background 0.2s;
}
.remove-btn:hover {
  background: #ffbbbb;
}
.show-more-btn {
  display: block;
  margin: 1em auto 0 auto;
  padding: 0.5em 1.5em;
  background: #eee;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1em;
  color: #333;
  transition: background 0.2s;
}
.show-more-btn:hover {
  background: #ddd;
}

#liltekst {
  font-size: 0.45em;
  color: #888;
}
</style>


