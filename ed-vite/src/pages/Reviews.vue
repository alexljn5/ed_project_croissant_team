<template>
  <div class="reviews-page">
    <h1>Reviews</h1>
    <div class="reviews-container">
      <!-- Left side: Form -->
      <div class="reviews-form-section">
        <h2>Schrijf een review</h2>
        <form @submit.prevent="addReview" class="review-form">
          <input v-model="newReview.name" placeholder="Review" />
          <textarea
            v-model="newReview.text"
            placeholder="Text"
            required
            rows="4"
          ></textarea>
          <div class="form-additional">
            <label>
              <input type="checkbox" v-model="newReview.anonymous" /> Plaats als
              anoniem
            </label>
            <input
              v-if="!newReview.anonymous"
              v-model="newReview.email"
              placeholder="Email (optioneel)"
              type="email"
            />
          </div>
          <div class="star-rating">
            <span
              v-for="star in 5"
              :key="star"
              @click="newReview.stars = star"
              :class="['star', { active: newReview.stars >= star }]"
              >★</span
            >
          </div>
          <button type="submit" class="submit-btn">Submit</button>
        </form>
      </div>

      <!-- Right side: Reviews list -->
      <div class="reviews-list-section">
        <div class="reviews-list" v-if="reviews.length">
          <ul>
            <li
              v-for="(review, idx) in visibleReviews"
              :key="idx"
              class="review-item"
            >
              <h3>Review</h3>
              <span class="review-text">{{ review.text }}</span>
              <div class="review-meta">
                <span v-if="review.anonymous">(anoniem)</span>
                <span v-else-if="review.name">- {{ review.name }}</span>
                <span v-if="review.email" class="review-email">
                  ({{ review.email }})</span
                >
                <span v-if="review.stars" class="review-stars">
                  <span
                    v-for="star in 5"
                    :key="star"
                    :class="['star', { active: review.stars >= star }]"
                    >★</span
                  >
                </span>
              </div>
              <button @click="removeReview(idx)" class="remove-btn">
                Verwijder
              </button>
            </li>
          </ul>
          <button
            v-if="visibleReviews.length < reviews.length"
            @click="showMoreReviews"
            class="show-more-btn"
          >
            Show more
          </button>
        </div>
        <div v-else class="no-reviews">...</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";

const STORAGE_KEY = "site-reviews-v2";
interface Review {
  text: string;
  anonymous: boolean;
  name?: string;
  email?: string;
  stars?: number;
}
const newReview = ref<Review>({
  text: "",
  anonymous: false,
  name: "",
  email: "",
  stars: 0,
});
const reviews = ref<Review[]>([]);
const visibleReviews = ref<Review[]>([]);
const REVIEWS_TO_SHOW = 3;

onMounted(() => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      reviews.value = JSON.parse(saved);
    } catch {}
  }
  visibleReviews.value = reviews.value.slice(0, REVIEWS_TO_SHOW);
});

watch(
  reviews,
  (val) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(val));
    visibleReviews.value = val.slice(0, REVIEWS_TO_SHOW);
  },
  { deep: true }
);

function addReview() {
  if (newReview.value.text.trim()) {
    reviews.value.unshift({
      text: newReview.value.text.trim(),
      anonymous: newReview.value.anonymous,
      name: newReview.value.anonymous ? "" : newReview.value.name?.trim() || "",
      email: newReview.value.email?.trim() || "",
      stars: newReview.value.stars || 0,
    });
    newReview.value = {
      text: "",
      anonymous: false,
      name: "",
      email: "",
      stars: 0,
    };
  }
}

function showMoreReviews() {
  const current = visibleReviews.value.length;
  visibleReviews.value = reviews.value.slice(0, current + REVIEWS_TO_SHOW);
}

function removeReview(idx: number) {
  reviews.value.splice(idx, 1);
}

import '@/assets/css/reviews.css'

</script>
