<script setup lang="ts">
import { useContent } from '../composables/useContent'
import { ref } from 'vue'

const { data: content, loading, save } = useContent<string>(
  'editable_section',
  'Placeholder text! Edit me and watch the DOM change right away. ♡'
)

const saving = ref(false)

const saveChanges = async () => {
  saving.value = true
  try {
    await save()
    alert('✅ Saved to database!')
  } catch (e) {
    alert('❌ Failed to save: ' + (e as Error).message)
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <section class="mb-8 p-6 bg-gray-100 rounded-lg shadow-md border-2 border-purple-600">
    <h2 class="text-2xl font-bold text-purple-700 mb-4">
      Edit Section Content
    </h2>

    <div v-if="loading" class="text-purple-600 font-bold mb-4">Loading from database...</div>

    <p v-if="!loading" class="text-base text-gray-800 mb-4 p-2 bg-white rounded border">
      Current text: {{ content }}
    </p>

    <textarea 
      v-model="content" 
      class="w-full p-4 border-2 border-purple-600 rounded text-gray-800 font-mono" 
      rows="5" 
      placeholder="Type your content here..."
    ></textarea>

    <button 
      @click="saveChanges" 
      :disabled="saving"
      class="mt-4 px-6 py-2 bg-yellow-400 text-gray-800 rounded hover:bg-yellow-500 disabled:opacity-70 font-bold cursor-pointer"
    >
      {{ saving ? 'Saving...' : 'Save to Database' }}
    </button>
  </section>
</template>