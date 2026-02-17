<template>
  <div class="reviews-page">
    <div class="reviews-header">
      <h1>Reviews</h1>
      <p class="reviews-subtitle">Deel je ervaringen en meningen</p>
    </div>

    <!-- Image Carousel -->
    <div class="image-carousel-section">
      <div class="image-carousel">
        <button
          @click="previousImage"
          class="carousel-btn carousel-prev"
          aria-label="Vorige afbeelding"
        >
          ◀
        </button>
        <div class="featured-image-wrapper">
          <img
            :src="images[currentImageIndex]"
            :alt="`Afbeelding ${currentImageIndex + 1}`"
            class="featured-image"
          />
          <div class="image-counter">
            {{ currentImageIndex + 1 }} / {{ images.length }}
          </div>
        </div>
        <button
          @click="nextImage"
          class="carousel-btn carousel-next"
          aria-label="Volgende afbeelding"
        >
          ▶
        </button>
      </div>
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
          <h2>Reviews voor afbeelding {{ currentImageIndex + 1 }}</h2>
          <div
            v-if="currentImageRatings.averageRating > 0"
            class="average-rating"
          >
            <div class="average-score">
              <span class="score-number">{{
                currentImageRatings.averageRating.toFixed(1)
              }}</span>
              <span class="score-max">/5</span>
            </div>
            <div class="average-stars">
              <span
                v-for="star in 5"
                :key="star"
                :class="[
                  'avg-star',
                  { active: currentImageRatings.averageRating >= star },
                ]"
                >★</span
              >
            </div>
            <span class="rating-count"
              >{{ currentImageRatings.ratingsCount }} beoordeling{{
                currentImageRatings.ratingsCount !== 1 ? "en" : ""
              }}</span
            >
          </div>
        </div>

        <div v-if="currentImageReviews.length" class="reviews-list">
          <ul class="reviews-ul">
            <li
              v-for="(review, idx) in currentImageVisibleReviews"
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
                @click="removeReview(currentImageIndex, idx)"
                class="remove-btn"
                aria-label="Verwijder review"
              >
                Verwijder
              </button>
            </li>
          </ul>

          <button
            v-if="
              currentImageVisibleReviews.length < currentImageReviews.length
            "
            @click="showMoreReviews"
            class="show-more-btn"
          >
            Bekijk meer ({{
              currentImageReviews.length - currentImageVisibleReviews.length
            }}
            meer)
          </button>
        </div>

        <div v-else class="no-reviews">
          <p>Er zijn nog geen reviews voor deze afbeelding...</p>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue";
import pigImage from "@/assets/img/pig-1.jpg";
import fishImage from "@/assets/img/fish.png";
import alecImage from "@/assets/img/alec.png";

const STORAGE_KEY = "site-reviews-by-image";
const REVIEWS_TO_SHOW = 5;

interface Review {
  text: string;
  anonymous: boolean;
  name?: string;
  email?: string;
  stars?: number;
}

// Images array
const images = ref<string[]>([
  pigImage,
  "https://picsum.photos/500/400?random=2",
  "https://picsum.photos/500/400?random=3",
  fishImage,
  alecImage,
]);

const currentImageIndex = ref(0);

// Reviews structure: array of review arrays, one per image
const reviewsByImage = ref<Review[][]>([]);

const currentImageReviews = computed(() => {
  return reviewsByImage.value[currentImageIndex.value] || [];
});

const currentImageVisibleReviews = ref<Review[]>([]);

const newReview = ref<Review>({
  text: "",
  anonymous: false,
  name: "",
  email: "",
  stars: 0,
});

const hoverRating = ref(0);

const currentImageRatings = computed(() => {
  const reviews = currentImageReviews.value;
  const reviewsWithStars = reviews.filter((r) => r.stars && r.stars > 0);
  const averageRating =
    reviewsWithStars.length === 0
      ? 0
      : reviewsWithStars.reduce((total, r) => total + (r.stars || 0), 0) /
        reviewsWithStars.length;
  return {
    averageRating,
    ratingsCount: reviewsWithStars.length,
  };
});

onMounted(() => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      reviewsByImage.value = JSON.parse(saved);
    } catch (error) {
      console.error("Error loading reviews:", error);
    }
  }
  // Initialize empty arrays for each image
  if (reviewsByImage.value.length === 0) {
    reviewsByImage.value = images.value.map(() => []);
  }
  updateVisibleReviews();
});

watch(
  [currentImageIndex, currentImageReviews],
  () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reviewsByImage.value));
    updateVisibleReviews();
  },
  { deep: true },
);

function updateVisibleReviews() {
  currentImageVisibleReviews.value = currentImageReviews.value.slice(
    0,
    REVIEWS_TO_SHOW,
  );
}

function nextImage() {
  currentImageIndex.value = (currentImageIndex.value + 1) % images.value.length;
}

function previousImage() {
  currentImageIndex.value =
    (currentImageIndex.value - 1 + images.value.length) % images.value.length;
}

function addReview() {
  if (newReview.value.text.trim()) {
    const review: Review = {
      text: newReview.value.text.trim(),
      anonymous: newReview.value.anonymous,
      name: newReview.value.anonymous ? "" : newReview.value.name?.trim() || "",
      email: newReview.value.email?.trim() || "",
      stars: newReview.value.stars || 0,
    };

    if (!reviewsByImage.value[currentImageIndex.value]) {
      reviewsByImage.value[currentImageIndex.value] = [];
    }

    reviewsByImage.value[currentImageIndex.value].unshift(review);

    // Reset form
    newReview.value = {
      text: "",
      anonymous: false,
      name: "",
      email: "",
      stars: 0,
    };
    hoverRating.value = 0;
  }
}

function showMoreReviews() {
  const current = currentImageVisibleReviews.value.length;
  currentImageVisibleReviews.value = currentImageReviews.value.slice(
    0,
    current + REVIEWS_TO_SHOW,
  );
}

function removeReview(imageIndex: number, reviewIndex: number) {
  if (reviewsByImage.value[imageIndex]) {
    reviewsByImage.value[imageIndex].splice(reviewIndex, 1);
  }
}

import "@/assets/css/reviews.css";
</script>
