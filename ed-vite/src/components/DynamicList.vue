<template>
  <section class="mb-8 p-6 bg-white rounded-lg shadow-md">
    <h2 class="text-2xl font-bold text-purple-700 mb-4">Dynamic List – Test opslaan in database</h2>
    <ul class="list-disc pl-6 mb-4">
      <li v-for="(item, index) in items" :key="index" class="mb-2 flex items-center text-lg">
        {{ item }} 
        <button @click="removeItem(index)" class="ml-4 text-red-600 hover:text-red-800 font-bold">Remove</button>
      </li>
    </ul>
    <input v-model="newItem" type="text" placeholder="Typ iets en klik Add" class="p-3 border-2 border-purple-600 rounded-lg mr-3 text-lg" />
    <button @click="addItem" class="px-8 py-3 bg-yellow-400 text-purple-900 rounded-lg font-bold hover:bg-yellow-300">
      Add
    </button>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'          // ← DIT MOEST ERBIJ!
import { useContent } from '../composables/useContent'

const { data: items, save } = useContent('dynamic-list-test', ['Start hier!'])

const newItem = ref('')            // nu snapt hij ref

const addItem = async () => {
  if (newItem.value.trim()) {
    items.value.push(newItem.value.trim())
    newItem.value = ''
    await save()
  }
}

const removeItem = async (index: number) => {
  items.value.splice(index, 1)
  await save()
}
</script>