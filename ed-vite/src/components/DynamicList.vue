<template>
  <section class="mb-8 p-6 bg-[var(--achtergrond-primair)] rounded-lg shadow-md">
    <h2 class="text-[var(--font-grootte2)] font-bold text-[var(--site-paars)] mb-4">Dynamic List Placeholder ➕</h2>
    <ul class="list-disc pl-6 mb-4">
      <li v-for="(item, index) in items" :key="index" class="mb-2 flex items-center">
        {{ item }} 
        <button @click="removeItem(index)" class="ml-4 text-red-500 hover:text-red-700">Remove</button>
      </li>
    </ul>
    <input v-model="newItem" type="text" class="p-2 border-2 border-[var(--site-paars)] rounded mr-2" placeholder="Add a new item ♡" />
    <button @click="addItem" class="px-6 py-2 bg-[var(--interactief)] text-white rounded hover:bg-yellow-500">Add</button>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const items = ref<string[]>(['Item 1 (click remove to zap me!)', 'Item 2']);
const newItem = ref<string>('');

const addItem = () => {
  if (newItem.value) {
    items.value.push(newItem.value);
    newItem.value = '';
  }
};

const removeItem = (index: number) => {
  items.value.splice(index, 1);
};
</script>