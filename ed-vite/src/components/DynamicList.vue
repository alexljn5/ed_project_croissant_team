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
  <section class="mb-8 p-6 bg-gray-100 rounded-lg shadow-md border-2 border-purple-600">
    <h2 class="text-2xl font-bold text-purple-700 mb-4">Dynamic List</h2>

    <div v-if="loading" class="text-purple-600 font-bold mb-4">Loading from database...</div>
    
    <div v-else>
      <ul class="list-disc pl-6 mb-4 bg-white p-4 rounded border">
        <li v-for="(item, index) in data" :key="index" class="mb-2 flex items-center justify-between text-gray-800">
          <span>{{ item }}</span>
          <button @click="removeItem(index)" class="ml-4 text-red-500 hover:text-red-700 font-bold cursor-pointer">Remove</button>
        </li>
        <li v-if="data.length === 0" class="text-gray-500 italic">No items yet</li>
      </ul>
    </div>

    <div class="flex gap-2">
      <input v-model="newItem" type="text" class="flex-1 p-2 border-2 border-purple-600 rounded" placeholder="Add a new item..." />
      <button @click="addItem" class="px-6 py-2 bg-yellow-400 text-gray-800 rounded hover:bg-yellow-500 font-bold cursor-pointer">Add</button>
    </div>
  </section>
</template>

<style scoped>
section {
  font-family: var(--font-primair);
}

h2 {
  font-family: var(--font-heading);
}

button, input {
  font-family: var(--font-primair);
}
</style>
