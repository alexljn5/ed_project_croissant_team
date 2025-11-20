<script setup>
import { ref, onMounted } from 'vue'

const msg = ref('loading...')

onMounted(async () => {
  try {
    const res = await fetch('/api/hello')
    const data = await res.json()
    msg.value = data.message
  } catch (e) {
    msg.value = 'oops! check the console ♡'
    console.error(e)
  }
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-r from-pink-200 via-purple-200 to-blue-200 flex items-center justify-center">
    <div class="bg-white/90 rounded-3xl shadow-2xl p-16 text-center">
      <h1 class="text-5xl font-bold text-purple-800 mb-6">
        {{ msg }}
      </h1>
      <p class="text-2xl text-pink-600">Cream & Cheese approve this croissant! 🥐✨</p>
    </div>
  </div>
</template>