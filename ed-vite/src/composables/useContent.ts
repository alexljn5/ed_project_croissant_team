// ed-vite/src/composables/useContent.ts
import { ref, onMounted } from 'vue'

// Change this when you deploy! For now it's your local Laravel
const API_BASE = 'http://localhost:8000/api/content'

export function useContent<T>(key: string, defaultValue: T) {
    const data = ref<T>(defaultValue)
    const loading = ref(true)

    const load = async () => {
        try {
            const res = await fetch(`${API_BASE}/${key}`)
            if (!res.ok) throw new Error('Failed to fetch')
            const json = await res.json()
            data.value = json.value ?? defaultValue
        } catch (e) {
            console.warn(`Could not load ${key}, using default ♡`, e)
            data.value = defaultValue
        } finally {
            loading.value = false
        }
    }

    const save = async () => {
        try {
            await fetch(`${API_BASE}/${key}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ value: data.value })
            })
            console.log(`Saved ${key} ♡`)
        } catch (e) {
            alert('Save failed! Is Laravel running?')
            console.error(e)
        }
    }

    onMounted(load)

    return { data, loading, save, reload: load }
}