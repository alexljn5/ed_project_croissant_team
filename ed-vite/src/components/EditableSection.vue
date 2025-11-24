<template>
  <section class="mb-8 p-6 bg-[var(--achtergrond-primair)] rounded-lg shadow-md">
    <h2 class="text-[var(--font-grootte2)] font-bold text-[var(--site-paars)] mb-4">Editable Section Placeholder</h2>
    <p class="text-[var(--font-grootte)] text-[var(--header-text)] mb-4">{{ content }}</p> <!-- DOM updates here live! -->
    <textarea v-model="content" class="w-full p-4 border-2 border-[var(--site-paars)] rounded" rows="5" placeholder="Type here to change the text above instantly... no packages needed!"></textarea>
    <button @click="saveChanges" class="mt-4 px-6 py-2 bg-[var(--interactief)] text-white rounded hover:bg-yellow-500">Pretend Save to Backend</button>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const content = ref<string>('Placeholder text! Edit me and watch the DOM change right away. ♡');

const saveChanges = () => {
  console.log('Pretend saving to Laravel:', content.value); // Hook to real API later
  alert('Changes "saved" (just in console for now)!');
};
</script>