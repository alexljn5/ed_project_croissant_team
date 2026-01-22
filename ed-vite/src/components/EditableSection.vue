<script setup lang="ts">
import { useContent } from '../composables/useContent'
import { ref } from 'vue'

// Tekst deel (blijft hetzelfde)
const { data: text, save: saveText, loading: textLoading } = useContent<string>(
  'editable_section',
  'Lorem ipsum Lorem ipsum'
)

const savingText = ref(false)

const saveChanges = async () => {
  savingText.value = true
  try {
    await saveText()
    alert('Tekst opgeslagen!')
  } catch (e) {
    alert('Opslaan mislukt: ' + (e as Error).message)
  } finally {
    savingText.value = false
  }
}

// Foto deel – nu met base64 (kopie van POIEditor logica)
const { data: photoUrl, save: savePhoto, loading: photoLoading, reload } = useContent<string>(
  'homepage_photo',
  '' // geen foto standaard
)

const uploadingPhoto = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

function handlePhotoChange(e: Event) {
  const input = e.target as HTMLInputElement
  if (!input.files?.length) return

  const file = input.files[0]
  uploadingPhoto.value = true

  const reader = new FileReader()
  reader.onload = () => {
    photoUrl.value = reader.result as string  // base64 string: data:image/...
    uploadingPhoto.value = false

    // Optioneel: automatisch opslaan na upload
    savePhoto().then(() => {
      alert('Foto succesvol geüpload en opgeslagen!')
      reload() // herlaad eventueel andere data
    }).catch(err => {
      alert('Opslaan mislukt: ' + err.message)
    })
  }
  reader.onerror = () => {
    alert('Kon afbeelding niet lezen')
    uploadingPhoto.value = false
  }
  reader.readAsDataURL(file)
}

const triggerUpload = () => fileInput.value?.click()
</script>

<template>
  <section class="mb-12 p-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl shadow-lg border-2 border-purple-300">

    <h2 class="text-3xl font-bold text-purple-800 mb-8 text-center">
      Admin Edit Sectie
    </h2>

    <!-- TEKST DEEL -->
    <div class="mb-10 bg-white p-6 rounded-lg shadow">
      <h3 class="text-xl font-semibold text-purple-700 mb-4">Tekst bewerken</h3>

      <div v-if="textLoading" class="text-purple-600">Tekst laden...</div>

      <!-- Huidige tekst tonen -->
      <div v-if="text && !textLoading" class="mb-6 p-4 bg-gray-50 border-l-4 border-purple-400 rounded">
        <p class="text-sm text-gray-600 font-semibold mb-2">📝 Huidige tekst:</p>
        <p class="text-gray-800 whitespace-pre-wrap">{{ text }}</p>
      </div>

      <textarea 
        v-model="text"
        class="w-full p-4 border-2 border-purple-400 rounded-lg font-mono text-gray-800"
        rows="6"
        placeholder="Typ hier je tekst..."
      ></textarea>

      <button 
        @click="saveChanges"
        :disabled="savingText"
        class="mt-4 px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-bold rounded-lg disabled:opacity-70"
      >
        {{ savingText ? 'Opslaan...' : 'Tekst opslaan' }}
      </button>
    </div>

    <!-- FOTO DEEL -->
    <div class="bg-white p-6 rounded-lg shadow">
      <h3 class="text-xl font-semibold text-pink-700 mb-4">Homepage foto</h3>

      <div v-if="photoLoading" class="text-pink-600">Foto laden...</div>

      <!-- Huidige foto tonen (werkt met base64 én oude URLs) -->
      <div v-if="photoUrl && !photoLoading" class="mb-6">
        <img 
          :src="photoUrl" 
          alt="Huidige homepage foto"
          class="max-w-full h-auto rounded-lg shadow-md mx-auto"
          @error="() => { photoUrl = '' }"  <!-- fallback als src kapot is -->
        />
        <p class="text-center text-sm text-gray-600 mt-2">
          Huidige foto – vervang door nieuwe upload
        </p>
      </div>

      <div v-else-if="!photoLoading" class="text-center py-16 border-2 border-dashed border-gray-300 rounded-lg text-gray-500">
        Nog geen foto geüpload
      </div>

      <!-- Upload knop -->
      <div class="text-center mt-6">
        <input 
          ref="fileInput"
          type="file"
          accept="image/*"
          @change="handlePhotoChange"
          class="hidden"
        />

        <button
          @click="triggerUpload"
          :disabled="uploadingPhoto || photoLoading"
          class="px-8 py-4 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-lg text-lg disabled:opacity-70"
        >
          {{ uploadingPhoto ? 'Bezig met verwerken...' : 'Nieuwe foto kiezen & uploaden' }}
        </button>
      </div>
    </div>

  </section>
</template>