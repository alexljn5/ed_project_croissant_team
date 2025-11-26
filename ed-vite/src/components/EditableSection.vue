<template>
  <section class="mb-8 p-6 bg-[var(--achtergrond-primair)] rounded-lg shadow-md">
    <h2 class="text-[var(--font-grootte2)] font-bold text-[var(--site-paars)] mb-4">
      Editable Section Placeholder
    </h2>

    <p class="text-[var(--font-grootte)] text-[var(--header-text)] mb-4">
      {{ content }}
    </p>

    <textarea 
      v-model="content" 
      class="w-full p-4 border-2 border-[var(--site-paars)] rounded" 
      rows="5" 
      placeholder="Type here... changes save when you click the button ♡"
    ></textarea>

    <button 
      @click="saveChanges" 
      :disabled="saving"
      class="mt-4 px-6 py-2 bg-[var(--interactief)] text-white rounded hover:bg-yellow-500 disabled:opacity-70"
    >
      {{ saving ? 'Saving...' : 'Save to Laravel ♡' }}
    </button>
  </section>
</template>

<script setup lang="ts">
import { useContent } from '../composables/useContent'
import { ref } from 'vue'

const { data: content, save } = useContent<string>(
  'editable_section',
  'Placeholder text! Edit me and watch the DOM change right away. ♡'
)

const saving = ref(false)

const saveChanges = async () => {
  saving.value = true
  await save()
  saving.value = false
  alert('Saved forever! ♡ Refresh the page — your text will still be here!')
}
</script>