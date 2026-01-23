<template>
  <div class="reviews-page">
    <div class="reviews-header">
      <h1>Reviews</h1>
      <p class="reviews-subtitle">Deel je ervaringen en meningen</p>
    </div>

    <!-- Featured Image -->
    <div class="featured-image-wrapper">
      <img
        :src="randomImageUrl"
        alt="Featured image for reviews"
        class="featured-image"
      />
    </div>

    <div class="reviews-container">
      <!-- Left side: Form -->
      <section class="reviews-form-section">
        <h2>Schrijf een review</h2>
        <form @submit.prevent="addReview" class="review-form">
          <!-- Rating section -->
          <div class="form-group">
            <label for="rating" class="form-label">Beoordeling</label>
            <div class="star-rating">
              <button
                v-for="star in 5"
                :key="star"
                type="button"
                @click="newReview.stars = star"
                @mouseenter="hoverRating = star"
                @mouseleave="hoverRating = 0"
                :class="[
                  'star-btn',
                  {
                    active: newReview.stars >= star,
                    hover: hoverRating >= star,
                  },
                ]"
                :aria-label="`${star} sterren`"
                tabindex="0"
              >
                ★
              </button>
            </div>
            <span v-if="newReview.stars" class="rating-text"
              >{{ newReview.stars }} van 5 sterren</span
            >
          </div>

          <!-- Review text -->
          <div class="form-group">
            <label for="review-text" class="form-label">Je review</label>
            <textarea
              id="review-text"
              v-model="newReview.text"
              placeholder="Vertel wat je ervan vindt..."
              required
              rows="5"
              class="form-input"
            ></textarea>
          </div>

          <!-- User info section -->
          <div class="form-group">
            <label class="checkbox-label">
              <input
                type="checkbox"
                v-model="newReview.anonymous"
                class="form-checkbox"
              />
              <span>Plaats als anoniem</span>
            </label>
          </div>

          <div v-if="!newReview.anonymous" class="form-group form-row">
            <div class="form-field">
              <label for="name" class="form-label">Naam</label>
              <input
                id="name"
                v-model="newReview.name"
                type="text"
                placeholder="Je naam"
                class="form-input"
              />
            </div>
            <div class="form-field">
              <label for="email" class="form-label"
                >Email <span class="optional">(optioneel)</span></label
              >
              <input
                id="email"
                v-model="newReview.email"
                type="email"
                placeholder="je@email.com"
                class="form-input"
              />
            </div>
          </div>

          <button type="submit" class="submit-btn">Verzend Review</button>
        </form>
      </section>

      <!-- Right side: Reviews list -->
      <section class="reviews-list-section">
        <div class="reviews-header-info">
          <h2>Alle Reviews ({{ reviews.length }})</h2>
          <div v-if="averageRating > 0" class="average-rating">
            <div class="average-score">
              <span class="score-number">{{ averageRating.toFixed(1) }}</span>
              <span class="score-max">/5</span>
            </div>
            <div class="average-stars">
              <span
                v-for="star in 5"
                :key="star"
                :class="['avg-star', { active: averageRating >= star }]"
                >★</span
              >
            </div>
            <span class="rating-count"
              >{{ ratingsCount }} beoordeling{{
                ratingsCount !== 1 ? "en" : ""
              }}</span
            >
          </div>
        </div>

        <div v-if="reviews.length" class="reviews-list">
          <ul class="reviews-ul">
            <li
              v-for="(review, idx) in visibleReviews"
              :key="idx"
              class="review-item"
            >
              <!-- Stars -->
              <div v-if="review.stars" class="review-rating">
                <span
                  v-for="star in 5"
                  :key="star"
                  :class="['review-star', { active: review.stars >= star }]"
                  aria-hidden="true"
                  >★</span
                >
              </div>

              <!-- Review text -->
              <p class="review-text">{{ review.text }}</p>

              <!-- Meta information -->
              <div class="review-meta">
                <span v-if="review.anonymous" class="review-author"
                  >Anoniem</span
                >
                <span v-else-if="review.name" class="review-author">{{
                  review.name
                }}</span>
                <span
                  v-if="review.email && !review.anonymous"
                  class="review-email"
                  >{{ review.email }}</span
                >
              </div>

              <!-- Delete button -->
              <button
                @click="removeReview(idx)"
                class="remove-btn"
                aria-label="Verwijder review"
              >
                Verwijder
              </button>
            </li>
          </ul>

          <button
            v-if="visibleReviews.length < reviews.length"
            @click="showMoreReviews"
            class="show-more-btn"
          >
            Bekijk meer ({{ reviews.length - visibleReviews.length }} meer)
          </button>
        </div>

        <div v-else class="no-reviews">
          <p>Er zijn nog geen reviews...</p>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue";
import pigImage from "@/assets/img/pig-1.jpg";

const STORAGE_KEY = "site-reviews-v2";
const REVIEWS_TO_SHOW = 5;

interface Review {
  text: string;
  anonymous: boolean;
  name?: string;
  email?: string;
  stars?: number;
}

// Featured image
const randomImageUrl = ref<string>(pigImage);

const newReview = ref<Review>({
  text: "",
  anonymous: false,
  name: "",
  email: "",
  stars: 0,
});
const reviews = ref<Review[]>([]);
const visibleReviews = ref<Review[]>([]);
const hoverRating = ref(0);

const averageRating = computed(() => {
  const reviewsWithStars = reviews.value.filter((r) => r.stars && r.stars > 0);
  if (reviewsWithStars.length === 0) return 0;
  const sum = reviewsWithStars.reduce((total, r) => total + (r.stars || 0), 0);
  return sum / reviewsWithStars.length;
});

const ratingsCount = computed(() => {
  return reviews.value.filter((r) => r.stars && r.stars > 0).length;
});

onMounted(() => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      reviews.value = JSON.parse(saved);
    } catch (error) {
      console.error("Error loading reviews:", error);
    }
  }
  visibleReviews.value = reviews.value.slice(0, REVIEWS_TO_SHOW);
});

watch(
  reviews,
  (val) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(val));
    visibleReviews.value = val.slice(0, REVIEWS_TO_SHOW);
  },
  { deep: true },
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
    // Reset form
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

import "@/assets/css/reviews.css";
</script>
