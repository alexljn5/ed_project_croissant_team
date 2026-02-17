<script setup lang="ts">
import { useContent } from '../composables/useContent'
import { ref } from 'vue'

// Tekst (blijft zoals het was)
const { data: text, save: saveText, loading: textLoading } = useContent<string>(
  'editable_section',
  'Lorem ipsum Lorem ipsum'
)

// Foto URL (nieuwe key)
const { data: photoUrl, save: savePhoto, loading: photoLoading, reload } = useContent<string>(
  'homepage_photo',
  '' // geen foto standaard
)

const savingText = ref(false)
const uploadingPhoto = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

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

const triggerUpload = () => fileInput.value?.click()

const uploadPhoto = async (e: Event) => {
  const input = e.target as HTMLInputElement
  if (!input.files?.length) return

  const file = input.files[0]
  uploadingPhoto.value = true

  const formData = new FormData()
  formData.append('photo', file)

  try {
    const res = await fetch('/api/upload-photo', {
      method: 'POST',
      body: formData
    })

    if (!res.ok) throw new Error('Upload mislukt')

    const json = await res.json()
    const newUrl = (json.url || json.path) + '?t=' + Date.now() // cache busting

    photoUrl.value = newUrl
    await savePhoto()  // slaat de URL op in dezelfde content-tabel

    alert('Foto geüpload & opgeslagen!')
    reload() // forceer herladen (niet echt nodig, maar veilig)
  } catch (err) {
    alert('Fout: ' + (err as Error).message)
  } finally {
    uploadingPhoto.value = false
    input.value = '' // zodat je dezelfde foto opnieuw kunt kiezen
  }
}
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
      <h3 class="text-xl font-semibold text-pink-700 mb-4">Homepage foto (wordt vervangen)</h3>

      <div v-if="photoLoading" class="text-pink-600">Foto laden...</div>

      <!-- Huidige foto tonen -->
      <div v-if="photoUrl && !photoLoading" class="mb-6">
        <img 
          :src="photoUrl" 
          alt="Huidige foto"
          class="max-w-full h-auto rounded-lg shadow-md mx-auto"
        />
        <p class="text-center text-sm text-gray-600 mt-2">Huidige foto – wordt overschreven bij nieuwe upload</p>
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
          @change="uploadPhoto"
          class="hidden"
        />

        <button
          @click="triggerUpload"
          :disabled="uploadingPhoto"
          class="px-8 py-4 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-lg text-lg disabled:opacity-70"
        >
          {{ uploadingPhoto ? 'Uploaden...' : 'Nieuwe foto kiezen & uploaden' }}
        </button>
      </div>
    </div>

  </section>
</template>