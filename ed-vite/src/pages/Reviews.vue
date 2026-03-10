<template>
  <div class="reviews-page">
    <div class="reviews-header">
      <h1>Reviews</h1>
      <p class="reviews-subtitle">Deel je ervaringen en meningen</p>
    </div>

    <div class="reviews-container">
      <!-- Left side: Review form -->
      <div class="reviews-form-section">
        <h2>
          {{ currentImageUrl ? "Beoordeel afbeelding" : "Schrijf een review" }}
        </h2>

        <!-- carousel for images -->
        <div v-if="images.length" class="The-Carousel_Game">
          <div class="image-carousel">
            <button
              class="carousel-btn"
              @click="prevImage"
              :disabled="currentImageIndex === 0"
            >
              ‹
            </button>
            <div class="featured-image-wrapper">
              <img
                v-if="currentImageUrl"
                :src="currentImageUrl"
                class="featured-image"
                alt="Te reviewen afbeelding"
              />
              <div class="image-counter">
                {{ currentImageIndex + 1 }} / {{ images.length }}
              </div>
            </div>
            <button
              class="carousel-btn"
              @click="nextImage"
              :disabled="currentImageIndex === images.length - 1"
            >
              ›
            </button>
          </div>
        </div>

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

          <button type="submit" class="submit-btn" :disabled="isSubmitting">
            {{ isSubmitting ? "Verzenden..." : "Verzend Review" }}
          </button>
          <span v-if="submitError" class="submit-error">{{ submitError }}</span>
        </form>
      </div>

      <!-- Right side: Reviews list -->
      <section class="reviews-list-section">
        <div class="reviews-header-info">
          <h2>Alle reviews</h2>
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

        <div v-if="currentReviews.length" class="reviews-list">
          <ul class="reviews-ul">
            <li
              v-for="review in currentReviews"
              :key="review.id"
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
            </li>
          </ul>
        </div>

        <div v-else class="no-reviews">
          <p>Er zijn nog geen reviews voor deze afbeelding...</p>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";

interface Review {
  id: number;
  text: string;
  anonymous: boolean;
  name?: string;
  email?: string;
  stars: number;
  image_url?: string;
  pending?: boolean;
  created_at: string;
}

interface NewReview {
  text: string;
  anonymous: boolean;
  name: string;
  email: string;
  stars: number;
}

const reviews = ref<Review[]>([]);
const newReview = ref<NewReview>({
  text: "",
  anonymous: false,
  name: "",
  email: "",
  stars: 0,
});

// state for carousel
const currentImageIndex = ref(0);

const hoverRating = ref(0);
const isSubmitting = ref(false);
const submitError = ref("");

const averageRating = computed(() => {
  const reviewsWithStars = currentReviews.value.filter(
    (r) => r.stars && r.stars > 0,
  );
  if (reviewsWithStars.length === 0) return 0;
  return (
    reviewsWithStars.reduce((total, r) => total + r.stars, 0) /
    reviewsWithStars.length
  );
});

// unique images from all reviews with image_url
const images = computed(() => {
  const uniqueUrls = new Set<string>();
  reviews.value
    .filter((r) => r.image_url)
    .forEach((r) => uniqueUrls.add(r.image_url!));
  return Array.from(uniqueUrls);
});

const currentImageUrl = computed(
  () => images.value[currentImageIndex.value] || null,
);

// reviews for current image
const currentReviews = computed(() => {
  if (!currentImageUrl.value) return [];
  return reviews.value.filter(
    (r) => r.image_url === currentImageUrl.value && !r.pending,
  );
});

const ratingsCount = computed(() => {
  return currentReviews.value.filter((r) => r.stars && r.stars > 0).length;
});

async function loadReviews() {
  try {
    const response = await fetch("/api/reviews");
    if (!response.ok) throw new Error("Failed to load reviews");
    reviews.value = await response.json();
    // reset carousel index when list changes
    if (images.value.length > 0) {
      currentImageIndex.value = Math.min(
        currentImageIndex.value,
        images.value.length - 1,
      );
    } else {
      currentImageIndex.value = 0;
    }
  } catch (err) {
    console.error("Error loading reviews:", err);
  }
}

async function addReview() {
  if (!newReview.value.text.trim()) {
    return;
  }
  if (!currentImageUrl.value) {
    submitError.value = "Selecteer een afbeelding om te reviewen.";
    return;
  }

  isSubmitting.value = true;
  submitError.value = "";

  try {
    const payload: any = {
      text: newReview.value.text.trim(),
      stars: newReview.value.stars || 0,
      anonymous: newReview.value.anonymous,
      name: newReview.value.anonymous ? "" : newReview.value.name?.trim() || "",
      email: newReview.value.email?.trim() || "",
      image_url: currentImageUrl.value,
    };

    const response = await fetch("/api/reviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || "Failed to save review");
    }

    // Reset form
    newReview.value = {
      text: "",
      anonymous: false,
      name: "",
      email: "",
      stars: 0,
    };
    hoverRating.value = 0;
    submitError.value = "";

    // Reload reviews
    await loadReviews();
  } catch (err) {
    submitError.value = (err as Error).message;
  } finally {
    isSubmitting.value = false;
  }
}

onMounted(() => {
  loadReviews();
});

// carousel helpers
function prevImage() {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--;
  }
}
function nextImage() {
  if (currentImageIndex.value < images.value.length - 1) {
    currentImageIndex.value++;
  }
}

import "@/assets/css/reviews.css";
</script>
