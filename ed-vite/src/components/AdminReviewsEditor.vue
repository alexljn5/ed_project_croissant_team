<template>
  <div class="admin-reviews-editor">
    <h3>Reviews afbeeldingen</h3>

    <div class="upload-section">
      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        multiple
        style="display: none"
        @change="handleFileSelect"
      />
      <button
        class="upload-btn"
        type="button"
        @click="triggerFileSelect"
        :disabled="isUploadingImage"
      >
        {{ isUploadingImage ? "Uploaden..." : "Afbeelding toevoegen" }}
      </button>
      <span v-if="uploadSuccess" class="success-text">
        ✓ Afbeelding toegevoegd
      </span>
      <span v-if="uploadError" class="error-text">{{ uploadError }}</span>
    </div>

    <div v-if="pendingReviews.length" class="pending-list">
      <h4>Te beoordelen afbeeldingen</h4>
      <ul>
        <li v-for="rev in pendingReviews" :key="rev.id" class="pending-item">
          <img :src="rev.image_url" class="thumb" alt="pending" />
          <button @click="deleteReview(rev.id)" class="delete-btn">
            Verwijder
          </button>
        </li>
      </ul>
    </div>
    <div v-else class="no-pending">
      <p>Geen openstaande afbeeldingen.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useImageUpload } from "../composables/useImageUpload";

interface Review {
  id: number;
  text?: string;
  stars?: number;
  anonymous?: boolean;
  name?: string;
  email?: string;
  image_url?: string;
  pending?: boolean;
}

const fileInput = ref<HTMLInputElement | null>(null);
const isUploadingImage = ref(false);
const uploadError = ref("");
const uploadSuccess = ref(false);

const reviews = ref<Review[]>([]);
const { uploadImage } = useImageUpload();

async function loadReviews() {
  try {
    const res = await fetch("/api/reviews");
    if (!res.ok) throw new Error("Kon reviews niet laden");
    reviews.value = await res.json();
  } catch (err) {
    console.error("Fout bij laden reviews:", err);
  }
}

const pendingReviews = computed(() =>
  reviews.value.filter((r) => r.image_url && r.pending),
);

function triggerFileSelect() {
  fileInput.value?.click();
}

async function handleFileSelect(e: Event) {
  const input = e.target as HTMLInputElement;
  if (!input.files?.length) return;
  isUploadingImage.value = true;
  uploadError.value = "";
  uploadSuccess.value = false;

  try {
    // upload each file sequentially to avoid overwhelming backend
    for (let i = 0; i < input.files.length; i++) {
      const file = input.files[i];
      const url = await uploadImage(file);
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image_url: url, pending: true }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Kon review niet aanmaken");
      }
    }
    await loadReviews();
    uploadSuccess.value = true;
  } catch (err: any) {
    uploadError.value = err.message || String(err);
  } finally {
    isUploadingImage.value = false;
    input.value = "";
  }
}

async function deleteReview(id: number) {
  if (!confirm("Weet je zeker dat je deze review wilt verwijderen?")) return;
  try {
    const res = await fetch(`/api/reviews/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Verwijderen mislukt");
    await loadReviews();
  } catch (err) {
    console.error(err);
  }
}

onMounted(() => {
  loadReviews();
});
</script>

<style scoped>
.admin-reviews-editor {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.upload-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.success-text {
  color: green;
}
.error-text {
  color: red;
}
.pending-list ul {
  list-style: none;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}
.pending-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.thumb {
  max-width: 80px;
  border-radius: 4px;
  object-fit: cover;
}
.delete-btn {
  margin-top: 0.5rem;
  background: #e74c3c;
  color: white;
  border: none;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  cursor: pointer;
}
</style>
