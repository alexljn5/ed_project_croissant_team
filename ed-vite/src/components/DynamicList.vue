<script setup lang="ts">
import { ref } from 'vue';
import { useContent } from '../composables/useContent';

const { data, loading, save } = useContent<string[]>('dynamic-list', ['Item 1', 'Item 2']);
const newItem = ref('');

const addItem = () => {
    if (!newItem.value.trim()) return;
    data.value.push(newItem.value.trim());
    newItem.value = '';
    save();
};

const removeItem = (index: number) => {
    data.value.splice(index, 1);
    save();
};
</script>

<template>
  <section class="mb-8 p-6 bg-[var(--achtergrond-primair)] rounded-lg shadow-md">
    <h2 class="text-[var(--font-grootte2)] font-bold text-[var(--site-paars)] mb-4">Dynamic List ➕</h2>

    <div v-if="loading" class="text-purple-500 font-bold">Loading from DB... ♡</div>
    
    <ul v-else class="list-disc pl-6 mb-4">
      <li v-for="(item, index) in data" :key="index" class="mb-2 flex items-center">
        {{ item }}
        <button @click="removeItem(index)" class="ml-4 text-red-500 hover:text-red-700">Remove</button>
      </li>
    </ul>

    <input v-model="newItem" type="text" class="p-2 border-2 border-[var(--site-paars)] rounded mr-2" placeholder="Add a new item ♡" />
    <button @click="addItem" class="px-6 py-2 bg-[var(--interactief)] text-white rounded hover:bg-yellow-500">Add</button>
  </section>
</template>
