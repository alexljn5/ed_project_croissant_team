<template>
  <div class="reviews-page">
    <h1>Reviews</h1>
    <div class="reviews-container">
      <!-- Left side: Form -->
      <div class="reviews-form-section">
        <h2>Schrijf een review</h2>
        <form @submit.prevent="addReview" class="review-form">
          <input v-model="newReview.name" placeholder="Naam" />
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
</script>

<style scoped>
.reviews-page {
  max-width: 1400px;
  margin: 2rem auto;
  padding: 2rem;
  background: #fff;
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 2rem;
}

.reviews-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
}

/* LEFT SIDE: FORM */
.reviews-form-section {
  border: 3px solid #000;
  padding: 2rem;
  background: #fff;
}

.reviews-form-section h2 {
  font-size: 1.8rem;
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: #333;
}

.review-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.review-form input[type="text"],
.review-form input[type="email"],
.review-form textarea {
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: inherit;
  font-size: 1rem;
  resize: vertical;
}

.review-form textarea {
  min-height: 120px;
}

.form-additional {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.form-additional label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.95rem;
}

.form-additional input[type="checkbox"] {
  cursor: pointer;
  width: 18px;
  height: 18px;
}

.star-rating {
  display: flex;
  gap: 0.5rem;
  padding: 1rem 0;
  border-top: 2px solid #000;
  border-bottom: 2px solid #000;
  margin: 1rem 0;
}

.star {
  cursor: pointer;
  color: #ccc;
  font-size: 2rem;
  transition: color 0.2s;
}

.star.active {
  color: #ffd700;
}

.star:hover {
  color: #ffd700;
}

.submit-btn {
  padding: 0.8rem 1.5rem;
  background: #6b3f7b;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  font-size: 1rem;
  transition: background 0.3s;
  margin-top: 0.5rem;
}

.submit-btn:hover {
  background: #553369;
}

/* RIGHT SIDE: REVIEWS */
.reviews-list-section {
  border: 3px solid #000;
  padding: 0;
  background: #fff;
  overflow: hidden;
}

.reviews-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.review-item {
  padding: 1.5rem;
  border-bottom: 2px solid #000;
  position: relative;
  background: #fff;
}

.review-item:last-child {
  border-bottom: none;
}

.review-item h3 {
  margin: 0 0 0.8rem 0;
  font-size: 1.2rem;
  color: #333;
}

.review-text {
  display: block;
  color: #555;
  line-height: 1.6;
  margin-bottom: 0.8rem;
  word-wrap: break-word;
}

.review-meta {
  font-size: 0.85rem;
  color: #999;
  margin-top: 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.review-email {
  color: #bbb;
}

.review-stars {
  margin-left: auto;
  display: flex;
  gap: 0.2rem;
}

.review-stars .star {
  font-size: 1.2rem;
}

.remove-btn {
  position: absolute;
  right: 1.5rem;
  top: 1.5rem;
  background: transparent;
  border: none;
  color: #999;
  padding: 0;
  cursor: pointer;
  font-size: 0.9rem;
  text-decoration: underline;
  transition: color 0.2s;
}

.remove-btn:hover {
  color: #c00;
}

.show-more-btn {
  display: block;
  width: 100%;
  padding: 1rem;
  background: #f5f5f5;
  border: 2px solid #000;
  border-top: none;
  cursor: pointer;
  font-size: 1rem;
  color: #333;
  font-weight: bold;
  transition: background 0.2s;
}

.show-more-btn:hover {
  background: #eee;
}

.no-reviews {
  padding: 2rem;
  text-align: center;
  color: #999;
  font-size: 1.5rem;
}

/* Responsive */
@media (max-width: 900px) {
  .reviews-container {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}
</style>
