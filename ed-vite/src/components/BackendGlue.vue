<template>
  <div class="fixed bottom-4 right-4 z-50">
    <div class="bg-white rounded-full shadow-2xl px-6 py-4 border-4 border-purple-300">
      <p class="text-sm font-bold text-purple-800 whitespace-nowrap">
        Backend: {{ msg }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
const msg = ref('connecting...')

onMounted(async () => {
  try {
    const res = await fetch('http://127.0.0.1:8000/api/hello')
    if (!res.ok) {
      msg.value = `HTTP ${res.status}`
      console.error('Backend returned non-OK status for /api/hello', res.status)
      return
    }
    const data = await res.json()
    msg.value = data.message || 'DIRECT CONNECT SUCCESS!'
  } catch (e) {
    msg.value = 'still offline :('
    console.error(e)
  }
})
</script>